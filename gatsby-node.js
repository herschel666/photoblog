const path = require('path');
const { createFilePath } = require(`gatsby-source-filesystem`);
const { createContentDigest } = require('gatsby-core-utils');
const fastExif = require('fast-exif');

const TMPL_DIR = path.join(__dirname, 'src', 'templates');

const pagesQuery = /* graphql */ `
  query pages($instanceName: String!) {
    page: allFile(
      filter: {
        sourceInstanceName: { eq: $instanceName }
        extension: { eq: "md" }
      }
    ) {
      nodes {
        name
        relativeDirectory
        markdown: childMarkdownRemark {
          fields {
            slug
          }
        }
      }
    }
  }
`;

const createFieldsOnNode = ({
  type,
  node,
  getNode,
  createNodeField,
  basePath,
}) => {
  const value = createFilePath({
    node,
    getNode,
    basePath,
  });

  createNodeField({
    node,
    value: type,
    name: 'type',
  });
  createNodeField({
    node,
    value,
    name: 'slug',
  });
};

const mapPageArgs = (nodes, component, getAdditionalContext = () => {}) =>
  nodes.map((node) => ({
    slug: node.markdown.fields.slug,
    additionalContext: getAdditionalContext(node),
    component,
  }));

const getSetImageNodeFactory = (getNode, createNode, createNodeId) => (
  name
) => {
  const nodeId = createNodeId(`SetImages /${name}/`);
  const node = getNode(nodeId);

  if (node) {
    return node;
  }

  return createNode({
    name,
    id: nodeId,
    children: [],
    parent: null,
    internal: {
      type: 'SetImages',
      contentDigest: createContentDigest(JSON.stringify({ name })),
    },
  });
};

const coordToDecimal = (gps = {}) => {
  const latArr = gps.GPSLatitude;
  const lngArr = gps.GPSLongitude;

  if (!latArr || !lngArr) {
    return { latitude: null, longitude: null };
  }

  const latRef = gps.GPSLatitudeRef || 'N';
  const lngRef = gps.GPSLongitudeRef || 'W';
  const latitude =
    (latArr[0] + latArr[1] / 60 + latArr[2] / 3600) * (latRef === 'N' ? 1 : -1);
  const longitude =
    (lngArr[0] + lngArr[1] / 60 + lngArr[2] / 3600) * (lngRef === 'W' ? -1 : 1);

  return { latitude, longitude };
};

const getImageExif = (exif) => ({
  ...coordToDecimal(exif.gps),
  camera: exif.image.Model || null,
  lens: exif.exif.LensModel || null,
  iso: exif.exif.ISO ? Number(exif.exif.ISO) : null,
  aperture: exif.exif.FNumber ? exif.exif.FNumber.toFixed(1) : null,
  focalLength: exif.exif.FocalLength ? exif.exif.FocalLength.toFixed(1) : null,
  exposureTime: exif.exif.ExposureTime ? Number(exif.exif.ExposureTime) : null,
  flash: Boolean(exif.exif.Flash),
});

exports.onCreateNode = ({ node, getNode, createNodeId, actions, reporter }) => {
  if (!node.parent) {
    return;
  }
  const { createNode, createNodeField } = actions;
  const getSetImageNode = getSetImageNodeFactory(
    getNode,
    createNode,
    createNodeId
  );
  const parent = getNode(node.parent);
  const type = parent.sourceInstanceName;

  if (type === 'pages') {
    createFieldsOnNode({
      type,
      node,
      getNode,
      createNodeField,
      basePath: '_pages',
    });
  }

  if (type === 'sets' || type === 'images') {
    createFieldsOnNode({
      type,
      node,
      getNode,
      createNodeField,
      basePath: '_sets',
    });
  }

  if (type === 'sets') {
    const parentDir = getNode(node.parent).relativeDirectory;
    const setImagesNode = getSetImageNode(parentDir);
    setImagesNode.parent = node.id;
  }

  if (type === 'images') {
    createNodeField({
      node,
      value: parent.relativeDirectory,
      name: 'set',
    });
  }

  if (type === 'imageFiles') {
    const setImagesNode = getSetImageNode(parent.relativeDirectory);

    setImagesNode.children.push(node.id);
    createNodeField({
      node,
      value: `/${parent.relativeDirectory}/${parent.name}/`,
      name: 'slug',
    });
  }

  // TODO: verify that  images from "gatsby-remark-images" don't end up in here!
  if (node.internal.type === 'ImageSharp' && node.fields && node.fields.slug) {
    fastExif.read(parent.absolutePath).then(
      (exif) =>
        createNodeField({
          node,
          name: 'exif',
          value: getImageExif(exif),
        }),
      (err) => reporter.panic('Could not extract EXIF data.', err)
    );
  }
};

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const defaultComponent = path.resolve(TMPL_DIR, 'default.tsx');
  const setComponent = path.resolve(TMPL_DIR, 'set.tsx');
  const imageComponent = path.resolve(TMPL_DIR, 'image.tsx');
  const { data: pages, errors: pageErrors } = await graphql(pagesQuery, {
    instanceName: 'pages',
  });
  const { data: sets, errors: setErrors } = await graphql(pagesQuery, {
    instanceName: 'sets',
  });
  const { data: images, errors: imageErrors } = await graphql(pagesQuery, {
    instanceName: 'images',
  });

  if (pageErrors || setErrors || imageErrors) {
    throw pageErrors || setErrors || imageErrors;
  }

  const pageSlugs = mapPageArgs(pages.page.nodes, defaultComponent);
  const setSlugs = mapPageArgs(
    sets.page.nodes,
    setComponent,
    ({ relativeDirectory }) => ({ name: relativeDirectory })
  );
  const imageSlugs = mapPageArgs(images.page.nodes, imageComponent, (node) => ({
    set: node.markdown.fields.slug,
    name: node.name,
  }));

  [...pageSlugs, ...setSlugs, ...imageSlugs].forEach(
    ({ slug, component, additionalContext }) =>
      createPage({
        path: slug,
        component,
        context: {
          ...additionalContext,
          slug,
        },
      })
  );
};

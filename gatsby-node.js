const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const { createFilePath } = require(`gatsby-source-filesystem`);
const md5File = promisify(require('md5-file'));
const mime = require('mime');
const slash = require('slash');
const prettyBytes = require('pretty-bytes');
const fastExif = require('fast-exif');

const stat = promisify(fs.stat);

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

const instaQuery = /* gaphql */ `
  query insta {
    images: allContentfulImage {
      nodes {
        contentful_id
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

const mapPageArgs = (type, nodes, component, getAdditionalContext = () => {}) =>
  nodes.map((node, i, arr) => ({
    slug: node.markdown.fields.slug,
    additionalContext: getAdditionalContext(node, i, arr),
    component,
    type,
  }));

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

const createImageFileNodeFactory = (
  createNode,
  createNodeId,
  createParentChildLink
) => async (parentNode) => {
  const fileAbsolutePath = slash(
    parentNode.fileAbsolutePath.replace('.md', '.jpg')
  );
  const fileName = path.basename(fileAbsolutePath);
  const fileRelativePath = `/${parentNode.fields.set}/${fileName}`;
  const imageFileId = createNodeId(fileAbsolutePath);
  const stats = await stat(fileAbsolutePath);
  const fileExt = path.extname(fileName);
  const contentDigest = await md5File(fileAbsolutePath);
  const internal = {
    contentDigest,
    type: 'ImageFile',
    mediaType: mime.getType(fileExt),
    description: `ImageFile "${fileRelativePath}"`,
  };
  const fileContent = JSON.parse(
    JSON.stringify({
      id: imageFileId,
      children: [],
      parent: parentNode.id,
      absolutePath: fileAbsolutePath,
      relativePath: fileRelativePath,
      extension: fileExt.replace('.', ''), // TODO: consider keeping the dot
      size: stats.size,
      prettySize: prettyBytes(stats.size),
      modifiedTime: stats.mtime,
      accessTime: stats.atime,
      changeTime: stats.ctime,
      birthTime: stats.birthtime,
      internal,
      ...stats,
    })
  );

  createNode(fileContent);
  createParentChildLink({ parent: parentNode, child: fileContent });
};

const createRedirectFactory = (createRedirect) => (type, slug) => {
  if (type === 'set' || type === 'image') {
    createRedirect({
      fromPath: `/sets${slug}`,
      toPath: slug,
      isPermanent: true,
    });
  }
};

exports.onCreateNode = async ({
  node,
  getNode,
  createNodeId,
  actions,
  reporter,
}) => {
  if (!node.parent) {
    return;
  }
  const { createNode, createNodeField, createParentChildLink } = actions;
  const createImageFileNode = createImageFileNodeFactory(
    createNode,
    createNodeId,
    createParentChildLink
  );
  const parent = getNode(node.parent);

  if (!parent) {
    return;
  }

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

  if (type === 'images') {
    createNodeField({
      node,
      value: `/${parent.relativeDirectory}/`,
      name: 'set',
    });
    await createImageFileNode(node);
  }

  // TODO: verify that images from "gatsby-remark-images" don't end up in here!
  if (
    node.internal.type === 'ImageSharp' &&
    parent.internal.type === 'ImageFile'
  ) {
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
  const { createPage, createRedirect: createRedirectAction } = actions;
  const createRedirect = createRedirectFactory(createRedirectAction);
  const defaultComponent = path.resolve(TMPL_DIR, 'default.tsx');
  const setComponent = path.resolve(TMPL_DIR, 'set.tsx');
  const imageComponent = path.resolve(TMPL_DIR, 'image.tsx');
  const instaComponent = path.resolve(TMPL_DIR, 'insta.tsx');
  const { data: pages, errors: pageErrors } = await graphql(pagesQuery, {
    instanceName: 'pages',
  });
  const { data: sets, errors: setErrors } = await graphql(pagesQuery, {
    instanceName: 'sets',
  });
  const { data: images, errors: imageErrors } = await graphql(pagesQuery, {
    instanceName: 'images',
  });
  const { data: insta, errors: instaErrors } = await graphql(instaQuery);

  if (pageErrors || setErrors || imageErrors || instaErrors) {
    throw pageErrors || setErrors || imageErrors || instaErrors;
  }

  const pageSlugs = mapPageArgs('page', pages.page.nodes, defaultComponent);
  const setSlugs = mapPageArgs('set', sets.page.nodes, setComponent);
  const imageSlugs = mapPageArgs(
    'image',
    images.page.nodes,
    imageComponent,
    (node, i, arr) => {
      const siblings = { prev: null, next: null };
      const prevNode = arr[i - 1];
      const nextNode = arr[i + 1];

      if (prevNode && prevNode.relativeDirectory === node.relativeDirectory) {
        siblings.prev = prevNode.markdown.fields.slug;
      }
      if (nextNode && nextNode.relativeDirectory === node.relativeDirectory) {
        siblings.next = nextNode.markdown.fields.slug;
      }

      return siblings;
    }
  );

  [...pageSlugs, ...setSlugs, ...imageSlugs].forEach(
    ({ type, slug, component, additionalContext }) => {
      createPage({
        path: slug,
        component,
        context: { slug, ...additionalContext },
      });
      createRedirect(type, slug);
    }
  );

  insta.images.nodes.forEach(({ contentful_id: id }) =>
    createPage({
      path: `insta/${id}`,
      component: instaComponent,
      context: { id },
    })
  );
};

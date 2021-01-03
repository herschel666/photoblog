const path = require('path');
const { createFilePath } = require(`gatsby-source-filesystem`);
const fastExif = require('fast-exif');

const TMPL_DIR = path.join(__dirname, 'src', 'templates');

const isProd = process.env.TARGET === 'production';

const pagesQuery = /* graphql */ `
  query pages($instanceName: String!, $directoryFilter: String, $sort: [FileFieldsEnum] = []) {
    page: allFile(
      filter: {
        sourceInstanceName: { eq: $instanceName }
        extension: { eq: "md" }
        relativeDirectory: { regex: $directoryFilter }
      }
      sort: { fields: $sort }
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
    images: allContentfulImage(sort: { fields: [date], order: DESC }) {
      nodes {
        id: contentful_id
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
  flash: (() => {
    const { Flash: flash = null } = exif.exif;

    switch (true) {
      case typeof flash === 'string':
      case typeof flash === 'boolean':
      case flash === null:
        return flash;
      case typeof flash === 'number':
        // TODO: handle all cases...
        //       https://stackoverflow.com/a/7100717/1478180
        return Boolean(flash);
      default:
        throw new Error(`Unexpected value "${flash}".`);
    }
  })(),
});

const createRedirectFactory = (createRedirect) => (type, slug) => {
  if (type === 'set' || type === 'image') {
    createRedirect({
      fromPath: `/sets${slug}`,
      toPath: slug,
      isPermanent: true,
    });
  }
};

exports.onCreateNode = async ({ node, getNode, actions, reporter }) => {
  if (!node.parent) {
    return;
  }
  const { createNodeField } = actions;
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

  if (type === 'images' || type === 'imageFiles') {
    createNodeField({
      node,
      value: `/${parent.relativeDirectory}/`,
      name: 'set',
    });
  }

  if (type === 'imageFiles') {
    createNodeField({
      node,
      value: `/${parent.relativeDirectory}/${parent.name}/`,
      name: 'slug',
    });
    createNodeField({
      node,
      value: 'image',
      name: 'type',
    });
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
  const directoryFilter = String(isProd ? /.+/ : /^(random|winter)-hamburg/);
  const defaultComponent = path.resolve(TMPL_DIR, 'default.tsx');
  const setComponent = path.resolve(TMPL_DIR, 'set.tsx');
  const imageComponent = path.resolve(TMPL_DIR, 'image.tsx');
  const instaComponent = path.resolve(TMPL_DIR, 'insta.tsx');
  const { data: pages, errors: pageErrors } = await graphql(pagesQuery, {
    instanceName: 'pages',
  });
  const { data: sets, errors: setErrors } = await graphql(pagesQuery, {
    instanceName: 'sets',
    directoryFilter,
  });
  const { data: images, errors: imageErrors } = await graphql(pagesQuery, {
    instanceName: 'images',
    directoryFilter,
    sort: ['name'],
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
      const prevNode = arr[i + 1];
      const nextNode = arr[i - 1];

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

  insta.images.nodes.forEach(({ id }, i, arr) =>
    createPage({
      path: `insta/${id}`,
      component: instaComponent,
      context: {
        ...(arr[i + 1] ? { prev: arr[i + 1].id } : void 0),
        ...(arr[i - 1] ? { next: arr[i - 1].id } : void 0),
        id,
      },
    })
  );
};

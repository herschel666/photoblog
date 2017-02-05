
const pathWrapper = (app, pathName, opts) =>
    ({ raw, query, params }, reply) => app
        .renderToHTML(raw.req, raw.res, pathName, Object.assign({
            album: params.album,
        }, query), opts)
        .then(reply);

const defaultHandlerWrapper = app =>
    ({ raw, url }) =>
        app.run(raw.req, raw.res, url);

module.exports = { pathWrapper, defaultHandlerWrapper };

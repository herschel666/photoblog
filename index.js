
import marked from 'marked';
import template from './src/template.ejs';

export default function (locals, callback) {
    const { chunks } = locals.webpackStats.compilation;
    const photos = Object.keys(locals.photos[locals.path])
        .map(photo => require(`./albums${locals.path}${photo}`));
    const { body, attributes } = require(`./albums${locals.path}index.md`);
    const { title } = attributes;
    const content = marked(body.trim());
    return callback(null, template({ title, content, photos }));
}

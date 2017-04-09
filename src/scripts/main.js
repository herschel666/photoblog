
import {
    loadFetch,
    loadObjectAssign,
} from './modules/polyfills';
import loadTurbolinks from './modules/turbolinks';
import lazyLoadImages from './modules/lazy-load-image';
import comments from './modules/comments';

Promise.all([
    loadTurbolinks(),
    loadFetch(),
    loadObjectAssign(),
]).then(([{ start }]) => {
    start();

    lazyLoadImages();
    comments();
});

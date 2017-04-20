
/* eslint "no-underscore-dangle": 0 */

import {
    loadFetch,
    loadObjectAssign,
} from './modules/polyfills';
import loadTurbolinks from './modules/turbolinks';
import lazyLoadImages from './modules/lazy-load-image';
import photoMap from './modules/photo-map';
import comments from './modules/comments';
import analytics from './modules/analytics';

if (!window.__main_initialized) {
    Promise.all([
        loadTurbolinks(),
        loadFetch(),
        loadObjectAssign(),
    ]).then(([{ start }]) => {
        window.__main_initialized = true;
        start();

        lazyLoadImages();
        photoMap();
        comments();
        analytics();
    });
}

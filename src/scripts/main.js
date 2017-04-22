
/* eslint "no-underscore-dangle": 0 */

import {
    loadFetch,
    loadObjectAssign,
} from './modules/polyfills';
import analytics from './modules/analytics';
import comments from './modules/comments';
import detailKeyNavigation from './modules/detail-key-navigation';
import lazyLoadImages from './modules/lazy-load-image';
import loadTurbolinks from './modules/turbolinks';
import photoMap from './modules/photo-map';
import setKeyNavigation from './modules/set-key-navigation';

if (!window.__main_initialized) {
    Promise.all([
        loadTurbolinks(),
        loadFetch(),
        loadObjectAssign(),
    ]).then(([{ start }]) => {
        window.__main_initialized = true;
        start();

        analytics();
        comments();
        detailKeyNavigation();
        lazyLoadImages();
        photoMap();
        setKeyNavigation();
    });
}

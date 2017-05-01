
/* eslint "no-underscore-dangle": 0 */

import {
    loadFetch,
    loadBabelPolyfill,
} from './modules/polyfills';
import setGlobalKey, { global } from './util/global';
import analytics from './modules/analytics';
import comments from './modules/comments';
import detailKeyNavigation from './modules/detail-key-navigation';
import lazyLoadImages from './modules/lazy-load-image';
import loadTurbolinks from './modules/turbolinks';
import photoMap from './modules/photo-map';
import setKeyNavigation from './modules/set-key-navigation';

const KEY_INITIALIZED = 'initialized';

setGlobalKey(KEY_INITIALIZED);

if (!global[KEY_INITIALIZED]) {
    Promise.all([
        loadTurbolinks(),
        loadFetch(),
        loadBabelPolyfill(),
    ]).then(([{ start }]) => {
        global[KEY_INITIALIZED] = true;

        start();
        analytics();
        comments();
        detailKeyNavigation();
        lazyLoadImages();
        photoMap();
        setKeyNavigation();
    });
}

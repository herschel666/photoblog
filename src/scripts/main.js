
import {
    loadFetch,
    loadObjectAssign,
} from './modules/polyfills';
import loadTurbolinks from './modules/turbolinks';
import lazyLoadImages from './modules/lazy-load-image';

Promise.all([
    loadTurbolinks(),
    loadFetch(),
    loadObjectAssign(),
]).then(([{ start, loadedEvent }]) => {
    start();

    lazyLoadImages(loadedEvent);
});


import setGlobalKey, { global } from '../util/global';

const KEY_TURBO = 'turboLoaded';

setGlobalKey(KEY_TURBO);

export default function loadTurbolinks() {
    /* eslint "no-underscore-dangle": 0 */
    if ((!window.requestAnimationFrame && !window.webkitRequestAnimationFrame) ||
        !(window.history && history.pushState) ||
        !!global[KEY_TURBO]) {
        return Promise.resolve({
            start: () => {},
        });
    }
    global[KEY_TURBO] = true;
    return System.import('turbolinks');
}

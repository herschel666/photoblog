
export default function loadTurbolinks() {
    /* eslint "no-underscore-dangle": 0 */
    if ((!window.requestAnimationFrame && !window.webkitRequestAnimationFrame) ||
        !(window.history && history.pushState) ||
        !!window.__script_added) {
        return Promise.resolve({
            loadedEvent: 'DOMContentLoaded',
            start: () => {},
        });
    }
    window.__script_added = true;
    return System.import('turbolinks')
        .then(({ start }) => ({
            loadedEvent: 'turbolinks:load',
            start,
        }));
}
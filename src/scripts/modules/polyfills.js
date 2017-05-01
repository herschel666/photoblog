
export function loadFetch() {
    return !window.fetch
        ? System.import('whatwg-fetch')
        : Promise.resolve();
}

export function loadBabelPolyfill() {
    return !window._babelPolyfill // eslint-disable-line no-underscore-dangle
        ? System.import('babel-polyfill')
        : Promise.resolve();
}


export function loadFetch() {
    return !window.fetch
        ? System.import('whatwg-fetch')
        : Promise.resolve();
}

export function loadObjectAssign() {
    return !Object.assign
        ? System.import('core-js/fn/object/assign')
        : Promise.resolve();
}

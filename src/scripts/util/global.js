
 // eslint-disable-next-line no-underscore-dangle
export const global = window.__ekphotos__;

const keyIsUndefined = key => global[key] === undefined;

const keyIsNull = key => global[key] === null;

export default function setGlobalKey(key, immutable = true) {
    const helperKeyName = `$$__${key}`;
    if (keyIsUndefined(helperKeyName)) {
        Object.defineProperty(global, helperKeyName, {
            __proto__: null,
            value: null,
            writable: true,
        });
        Object.defineProperty(global, key, {
            __proto__: null,
            enumerable: true,
            set(value) {
                if (!keyIsNull(helperKeyName) && immutable) {
                    return;
                }
                global[helperKeyName] = value;
            },
            get() {
                return global[helperKeyName];
            },
        });
    }
}


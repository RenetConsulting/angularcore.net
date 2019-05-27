/** whether @param x is boolean */
export function isBoolean(x) {
    return typeof x === 'boolean';
}

/** whether @param x is function */
export function isFunction(x) {
    return typeof x === 'function';
}

/** whether @param x is number and NaN */
export function isNumber(x) {
    return typeof x === 'number' && !isNaN(x);
}

/** whether all passed params are number and Nan */
export function isNumbers(...values) {
    return Array.isArray(values) && values.length > 0 ? values.every(x => isNumber(x)) : false;
}

/**
 * whether @param x is object
 * {@link function} can be {@link object}
 */
export function isObject(x) {
    return x !== null && typeof x === 'object' || isFunction(x);
}

/** whether @param x is string */
export function isString(x) {
    return typeof x === 'string';
}

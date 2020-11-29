export const isObject = (val) => typeof val === 'object' && val !== null

export const hasOwm = (target, key) => Object.prototype.hasOwnProperty.call(target, key)

export const isEqual = (oldVal, newVal) => oldVal === newVal;

export const isFunction = (val) => typeof val === 'function'
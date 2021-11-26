/**
 * Is JSON checker for string
 * @param {String} str
 * @return {Boolean}
 */
const isJson = (str: string) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

/**
 * Dynamic Sort For Objects
 * @param {String} property
 */
const dynamicSort = (property: string) => {
    let name = property;
    let sortOrder = 1;
    if (name[0] === "-") {
        sortOrder = -1;
        name = name.substring(1);
    }
    return function (a: any, b: any) {
        const result = (a[name] < b[name]) ? -1 : (a[name] > b[name]) ? 1 : 0;
        return result * sortOrder;
    }
}

/**
 * Object has checker
 * @param {Object} object
 * @param {String} key
 */
const has = (object: object, key: string) => {
    return object ? Object.prototype.hasOwnProperty.call(object, key) : false;
}

export const helper = {
    isJson,
    dynamicSort,
    has
}

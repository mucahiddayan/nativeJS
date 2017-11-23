/**
 * @author Mücahid Dayan
 * @version 1.0.0
 */

 export const deepAssign = (target = {}, ...sources) => {
    let src, copy,clone;
    for (let object of sources) {
        for (let p in object) {
            copy = object[p];
            src = target[p];
            if (target === copy) {
                continue;
            }
            if (typeof copy === 'object') {
                clone = src && Array.isArray(src) ? src : [];
                clone = src && typeof src === 'object' ? src : {};
                target[p] = deepAssign(copy, clone);
            }
            else if (copy !== undefined) {
                target[p] = copy;
            }
        }
    }
    return target;
}
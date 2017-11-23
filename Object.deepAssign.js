/**
 * @author Mücahid Dayan
 * @version 1.0.0
 */

const x = { a: { a: 1, c: 2 } }
const y = { a: { b: 1, d: 4 }, b: { a: 2 } }
const z = [2,3,4,6,7];
const l = { a: { a: 2, d: 3 ,e: 5 },name:'mücahid',position:{left:10,right:{po:1}}}


const deepAssign = (target = {}, ...sources) => {
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
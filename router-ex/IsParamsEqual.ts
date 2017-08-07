import {QueryParams} from "./Config";


export function isParamsEqual(pars1: QueryParams|{}, pars2: QueryParams|{}, isRouteParams?: boolean): boolean {

    let keys1 = Object.keys(pars1);
    let keys2 = Object.keys(pars2);

    if (!isRouteParams) {
        // remove parameters with null values
        keys1.forEach((k, i) => {
            if (pars1[k] === null) {
                delete pars1[k];
                keys1.splice(i, 1);
            }
        });

        keys2.forEach((k, i) => {
            if (pars2[k] === null) {
                delete pars2[k];
                keys2.splice(i, 1);
            }
        });
    }

    // quantity of parameters mismatch
    if (keys1.length !== keys2.length) {
        return false;
    }

    // different param names
    if (!keys1.every(k => keys2.indexOf(k) > -1)) {
        return false;
    }

    for (let key of keys1) {
        if (Array.isArray(pars1[key])) {
            // param is array in one set, not array in another
            if (!Array.isArray(pars2[key])) {
                return false;
            }

            // check nested arrays lengths and values
            if ((pars1[key] as Array<string|boolean>).length
                == (pars2[key] as Array<string|boolean>).length
                && !(pars1[key] as Array<string|boolean>).every((v) => (pars2[key] as Array<string|boolean>).indexOf(v) > -1)
            ) {
                return false;
            }
        } else {
            // check simple non-array values
            if (pars1[key] !== pars2[key]) {
                return false;
            }
        }
    }
    // all checks passed, params sets are equal
    return true;
}

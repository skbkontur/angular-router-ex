"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isParamsEqual(pars1, pars2, isRouteParams) {
    var keys1 = Object.keys(pars1);
    var keys2 = Object.keys(pars2);
    if (!isRouteParams) {
        // remove parameters with null values
        keys1.forEach(function (k, i) {
            if (pars1[k] === null) {
                delete pars1[k];
                keys1.splice(i, 1);
            }
        });
        keys2.forEach(function (k, i) {
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
    if (!keys1.every(function (k) { return keys2.indexOf(k) > -1; })) {
        return false;
    }
    var _loop_1 = function (key) {
        if (Array.isArray(pars1[key])) {
            // param is array in one set, not array in another
            if (!Array.isArray(pars2[key])) {
                return { value: false };
            }
            // check nested arrays lengths and values
            if (pars1[key].length
                == pars2[key].length
                && !pars1[key].every(function (v) { return pars2[key].indexOf(v) > -1; })) {
                return { value: false };
            }
        }
        else {
            // check simple non-array values
            if (pars1[key] !== pars2[key]) {
                return { value: false };
            }
        }
    };
    for (var _i = 0, keys1_1 = keys1; _i < keys1_1.length; _i++) {
        var key = keys1_1[_i];
        var state_1 = _loop_1(key);
        if (typeof state_1 === "object")
            return state_1.value;
    }
    // all checks passed, params sets are equal
    return true;
}
exports.isParamsEqual = isParamsEqual;

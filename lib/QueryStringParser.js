import { Injectable } from "@angular/core";
var QueryStringParser = /** @class */ (function () {
    function QueryStringParser() {
    }
    QueryStringParser.prototype.serialize = function (p) {
        var res = [];
        var _loop_1 = function (key) {
            if (p.hasOwnProperty(key)) {
                if (Array.isArray(p[key])) {
                    p[key].forEach(function (val) {
                        res.push(key + (val === true ? "" : "=" + encodeURIComponent(val)));
                    });
                }
                else {
                    if (!isNullOrUndefined(p[key])) {
                        res.push(key + (p[key] === true ? "" : "=" + encodeURIComponent(p[key])));
                    }
                }
            }
        };
        for (var key in p) {
            _loop_1(key);
        }
        return res.join("&");
    };
    QueryStringParser.prototype.parse = function (rawQuery) {
        var params = {};
        if (!rawQuery) {
            return params;
        }
        if (rawQuery[0] === '?') {
            rawQuery = rawQuery.substring(1);
        }
        rawQuery.split("&").forEach(function (pair) {
            var _a = pair.split("="), key = _a[0], value = _a[1];
            if (value) {
                try {
                    value = decodeURIComponent(value);
                }
                catch (e) {
                    // drop invalid parameters
                    return;
                }
            }
            if (!params[key]) {
                // no such key yet
                params[key] = value || true;
            }
            else {
                if (Array.isArray(params[key])) {
                    // value already an array
                    params[key].push(value || true);
                }
                else {
                    // make an array
                    params[key] = [params[key], value || true];
                }
            }
        });
        return params;
    };
    QueryStringParser.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    QueryStringParser.ctorParameters = function () { return []; };
    return QueryStringParser;
}());
export { QueryStringParser };
function isNullOrUndefined(obj) {
    return typeof (obj) === "undefined" || obj === null;
}

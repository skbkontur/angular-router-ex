import {QueryParam, QueryParams} from "./Config";

export class QueryStringParser {

    static serialize(p: QueryParams): string {
        let res = [];

        for (let key in p) {
            if (p.hasOwnProperty(key)) {
                if (Array.isArray(p[key])) {

                    (p[key] as Array<boolean | string>).forEach((val) => {
                        res.push(key + (val === true ? "" : "=" + encodeURIComponent(val as string)));
                    });
                } else {
                    if (!isNullOrUndefined(p[key])) {
                        res.push(key + (p[key] === true ? "" : "=" + encodeURIComponent(p[key] as string)));
                    }
                }
            }
        }

        return res.join("&");
    }

    static parse(rawQuery: string): QueryParams {
        let params = {};

        if (!rawQuery) {
            return params;
        }

        if (rawQuery[0] === '?') {
            rawQuery = rawQuery.substring(1);
        }

        rawQuery.split("&").forEach((pair) => {
            let [key, value] = pair.split("=");

            if (value) {
                try {
                    value = decodeURIComponent(value);
                } catch (e) {
                    // drop invalid parameters
                    return;
                }
            }

            if (!params[key]) { // no such key yet
                params[key] = value || true;
            } else {
                if (Array.isArray(params[key])) { // value already an array
                    (params[key] as Array<string | boolean>).push(value || true);
                } else { // make an array
                    params[key] = ([params[key], value || true] as QueryParam);
                }
            }

        });

        return params;
    }

}

function isNullOrUndefined(obj: any): boolean {
    return typeof (obj) === "undefined" || obj === null;
}

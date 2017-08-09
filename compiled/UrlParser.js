"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UrlParser = (function () {
    function UrlParser() {
    }
    UrlParser.ensureParser = function () {
        if (!UrlParser.parser) {
            UrlParser.parser = document.createElement("a");
        }
    };
    UrlParser.parseUrl = function (url) {
        UrlParser.ensureParser();
        UrlParser.parser.href = url;
        var parseResult = {
            hash: UrlParser.parser.hash,
            host: UrlParser.parser.host,
            hostname: UrlParser.parser.hostname,
            pathname: UrlParser.parser.pathname,
            port: UrlParser.parser.port,
            protocol: UrlParser.parser.protocol,
            search: UrlParser.parser.search
        };
        UrlParser.parser.href = "";
        return parseResult;
    };
    return UrlParser;
}());
UrlParser.parser = null;
exports.UrlParser = UrlParser;

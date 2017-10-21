var UrlParser = /** @class */ (function () {
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
        // Host, Hostname, Port Protocol могут быть пучтыми в IE на относительных URL
        var parseResult = {
            hash: UrlParser.parser.hash,
            host: UrlParser.parser.host,
            hostname: UrlParser.parser.hostname,
            pathname: UrlParser.parser.pathname[0] == "/" ? UrlParser.parser.pathname : "/" + UrlParser.parser.pathname,
            port: UrlParser.parser.port,
            protocol: UrlParser.parser.protocol,
            search: UrlParser.parser.search
        };
        UrlParser.parser.href = "";
        return parseResult;
    };
    UrlParser.parser = null;
    return UrlParser;
}());
export { UrlParser };

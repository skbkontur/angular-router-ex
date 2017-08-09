export interface IUrlParseResult {
    hash: string;
    host: string;
    hostname: string;
    pathname: string;
    port: string;
    protocol: string;
    search: string;
}
export declare class UrlParser {
    private static parser;
    static ensureParser(): void;
    static parseUrl(url: string): IUrlParseResult;
}

export interface IUrlParseResult{
  hash: string;
  host: string; //with port
  hostname: string;
  pathname: string;
  port: string;
  protocol: string;
  search: string;
}

export class UrlParser {

  private static parser:HTMLAnchorElement = null;

  static ensureParser(){
    if(!UrlParser.parser){
      UrlParser.parser = document.createElement("a");
    }
  }

  static parseUrl(url: string): IUrlParseResult{

    UrlParser.ensureParser();

    UrlParser.parser.href = url;

    const parseResult: IUrlParseResult =  {
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
  }
}

import { QueryParams } from "./Config";
export declare class QueryStringParser {
    serialize(p: QueryParams): string;
    parse(rawQuery: string): QueryParams;
}

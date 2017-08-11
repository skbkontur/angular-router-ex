import {QueryStringParser} from "../src/QueryStringParser";
import {QueryParams} from "../src/Config";

describe(`UrlSerializer`, () => {

    const parser = new QueryStringParser();

    describe(`url parsing`, () => {
        it("should parse url string", () => {
            const parsed = parser.parse("action=transfer&foo=bar");
            expect(parsed["action"]).toBe("transfer");
            expect(parsed["foo"]).toBe("bar");
        });

        it("should parse valueless parameters", () => {
            const parsed = parser.parse("action&blue&loader");
            expect(parsed["action"]).toBe(true);
            expect(parsed["blue"]).toBe(true);
            expect(parsed["loader"]).toBe(true);
        });

        it("should parse multiple parameters into array", () => {
            const parsed = parser.parse("action=1&action=2&action");
            expect((parsed["action"] as Array<string | boolean>).indexOf("1")).toBeGreaterThan(-1);
            expect((parsed["action"] as Array<string | boolean>).indexOf("2")).toBeGreaterThan(-1);
            expect((parsed["action"] as Array<string | boolean>).indexOf(true)).toBeGreaterThan(-1);
        });

        it("should decode non-ascii characters in url params", () => {
            const parsed = parser.parse("black=50%25&q=%D0%96%D0%B5%D1%81%D1%82%D1%8C");
            expect(parsed["black"]).toBe("50%");
            expect(parsed["q"]).toBe("Жесть");
        });
    });


    describe(`url serialization`, () => {
        it("should serialize urlParams", () => {

            const params: QueryParams = {
                "action": "controls",
                "filter": "blue"
            };

            const serialized = parser.serialize(params);
            const parts = serialized.split("&");
            /* for .. in does not guarantee order of keys */
            expect(parts.indexOf("action=controls")).toBeGreaterThan(-1);
            expect(parts.indexOf("filter=blue")).toBeGreaterThan(-1);
        });

        it("should serialize valueless params", () => {

            const params: QueryParams = {
                "isCool": true,
            };

            const serialized = parser.serialize(params);
            expect(serialized).toBe("isCool");
        });

        it("should serialize arrays", () => {

            const params: QueryParams = {
                "shapes": ["circle", "rectangle", "ellipse"],
            };

            const serialized = parser.serialize(params);

            const parts = serialized.split("&");

            expect(parts.indexOf("shapes=circle")).toBeGreaterThan(-1);
            expect(parts.indexOf("shapes=rectangle")).toBeGreaterThan(-1);
            expect(parts.indexOf("shapes=ellipse")).toBeGreaterThan(-1);
        });

        it("should encode non-ascii characters in url params", () => {

            const params: QueryParams = {
                "parent": "Мама",
            };

            const serialized = parser.serialize(params);

            expect(serialized).toBe("parent=%D0%9C%D0%B0%D0%BC%D0%B0");
        });

        it("should drop param if value is null", () => {

            const params: QueryParams = {
                "parent": "mother",
                "pet": null
            };

            const serialized = parser.serialize(params);

            expect(serialized).toBe("parent=mother");
        });


    });

});

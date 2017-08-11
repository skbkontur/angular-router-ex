

import {QueryParams} from "../src";
import {isParamsEqual} from "../src/IsParamsEqual";

describe(`Query params comparison`, () => {

    it("should detect singular non-matching params", () => {
        const par1: QueryParams = {"val1": "foobar"};
        const par2: QueryParams = {"val2": "foobar"};

        expect(isParamsEqual(par1, par2)).toBe(false);
    });

    it("should detect singular non-matching param values", () => {
        const par1: QueryParams = {"boo": "test"};
        const par2: QueryParams = {"boo": "foobar"};

        expect(isParamsEqual(par1, par2)).toBe(false);
    });

    it("should detect singular matching params", () => {
        const par1: QueryParams = {"booka": "byaka"};
        const par2: QueryParams = {"booka": "byaka"};

        expect(isParamsEqual(par1, par2)).toBe(true);
    });

    it("should detect multiple matching params", () => {
        const par1: QueryParams = {"weapon": "bazooka", "soldier": "predator"};
        const par2: QueryParams = {"weapon": "bazooka", "soldier": "predator"};

        expect(isParamsEqual(par1, par2)).toBe(true);
    });

    it("should detect multiple non-matching params", () => {
        const par1: QueryParams = {"weapon": "assaultRifle", "soldier": "trooper"};
        const par2: QueryParams = {"weapon": "bazooka", "soldier": "predator"};

        expect(isParamsEqual(par1, par2)).toBe(false);
    });

    it("should detect non-matching param quantities", () => {
        const par1: QueryParams = {"weapon": "bazooka", "soldier": "predator"};
        const par2: QueryParams = {"weapon": "bazooka", "soldier": "predator", "radio": "RT887"};

        expect(isParamsEqual(par1, par2)).toBe(false);
    });

    it("should detect non-matching array params", () => {
        const par1: QueryParams = {"orientation": ["portrait", "landscape"]};
        const par2: QueryParams = {"orientation": ["portrait", "round"]};

        expect(isParamsEqual(par1, par2)).toBe(false);
    });

    it("should detect matching array params", () => {
        const par1: QueryParams = {"orientation": ["portrait", "landscape"]};
        const par2: QueryParams = {"orientation": ["portrait", "landscape"]};

        expect(isParamsEqual(par1, par2)).toBe(true);
    });

    it("should detect non-matching params of different types", () => {
        const par1: QueryParams = {"orientation": ["portrait", "landscape"]};
        const par2: QueryParams = {"orientation": "portrait,landscape"};

        expect(isParamsEqual(par1, par2)).toBe(false);
    });

    it("should ignore positions in array params", () => {
        const par1: QueryParams = {"orientation": ["portrait", "landscape"]};
        const par2: QueryParams = {"orientation": ["landscape", "portrait"]};

        expect(isParamsEqual(par1, par2)).toBe(true);
    });

    it("should ignore null params", () => {
        const par1: QueryParams = {"animal": "cat", "food": "fish"};
        const par2: QueryParams = {"animal": "cat", "food": "fish", "catnip": null};

        expect(isParamsEqual(par1, par2)).toBe(true);
    });


    it("should detect non-matching route params", () => {
        const par1 = {"id": "554"};
        const par2 = {"id": "555"};

        expect(isParamsEqual(par1, par2, true)).toBe(false);
    });


    it("should detect matching route params", () => {
        const par1 = {"login": "mdn"};
        const par2 = {"login": "mdn"};

        expect(isParamsEqual(par1, par2, true)).toBe(true);
    });

});

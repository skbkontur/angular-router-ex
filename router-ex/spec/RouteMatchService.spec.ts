import {RouteMatchService} from "../RouteMatchService";
import {Routes} from "../Config";

class Foo {

}

describe(`RouteMatchService`, () => {

    let routeResolver: RouteMatchService;
    let routeMap: Routes = [
        {
            path: "/home",
            component: Foo,
        },
        {
            path: "/groups/:id/edit/:tab?",
            component: Foo,
        },
    ];

    let testUrls: string[] = [
        "/groups/123/edit/modify",
        "/profile/purpleplum",
        "/home",

    ];

    beforeEach(function () {
        routeResolver = new RouteMatchService(null, null, null, null);
    });


    it("should return promise", () => {
        expect(routeResolver.findRoute(testUrls[0], routeMap) instanceof Promise).toBe(true);
    });

    it("should provide a component to render", done => {
        routeResolver.findRoute(testUrls[2], routeMap).then((res) => {
            expect(res.component instanceof Function).toBe(true);
            done();
        });
    });

    it("should resolve as null if no matching route found", done => {
        const badUrl = "/a/non/existing/route/oops";
        routeResolver.findRoute(badUrl, routeMap).then((res) => {
            expect(res).toBeNull();
            done();
        });
    });

    it("should parse parameters from route", done => {
        routeResolver.findRoute(testUrls[0], routeMap).then((res) => {

            expect(res.params["id"]).toBe("123");
            expect(res.params["tab"]).toBe("modify");
            done();
        });
    });

});

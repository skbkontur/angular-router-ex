"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const protractor_1 = require("protractor");
const Helpers_1 = require("./Helpers");
describe("Router", () => {
    describe("navigation", () => {
        beforeAll(() => {
            protractor_1.browser.get("/home");
        });
        it("should navigate to home page by default", () => {
            Helpers_1.expectPageTitle("Home page");
        });
        it("should make simple route navigation", () => {
            Helpers_1.navigate("about");
            Helpers_1.expectPageTitle("About page");
        });
        it("should make simple route navigation when press back button", () => {
            Helpers_1.navigate("about");
            Helpers_1.navigateBack();
            Helpers_1.expectPageTitle("Home page");
        });
        it("should make simple route navigation when press forward button", () => {
            Helpers_1.navigate("about");
            Helpers_1.navigateBack();
            Helpers_1.navigateForward();
            Helpers_1.expectPageTitle("About page");
        });
        it("should navigate to lazy routes", () => {
            Helpers_1.navigate("detail");
            Helpers_1.expectPageTitle("Detail page");
        });
        it("should navigate by absolute URL", () => {
            protractor_1.browser.get("/about");
            Helpers_1.navigate("absurl");
            Helpers_1.expectPageTitle("Home page");
        });
        it("should auto scroll at the top on new navigation", () => {
            Helpers_1.navigate("home");
            Helpers_1.scrollWindow(1000);
            Helpers_1.click("cacheback-anchor");
            Helpers_1.expectPageTitle("Cache back page");
            Helpers_1.expectWindowScroll(0);
        });
        it("should make navigation by router api (navigateByUrl)", () => {
            Helpers_1.navigate("home");
            Helpers_1.scrollWindow(1000);
            Helpers_1.click("navigate-about");
            Helpers_1.expectPageTitle("About page");
        });
        it("should create new history item when using router api (navigateByUrl)", () => {
            Helpers_1.navigate("home");
            Helpers_1.scrollWindow(1000);
            Helpers_1.click("navigate-about");
            Helpers_1.navigateBack();
            Helpers_1.expectPageTitle("Home page");
        });
        it("should report replaced url when using router api with replaceUrl: true", () => {
            Helpers_1.navigate("detail");
            Helpers_1.navigate("home");
            Helpers_1.scrollWindow(1000);
            Helpers_1.click("navigate-about-replace");
            Helpers_1.expectText("url-replace-message", "old url replaced");
        });
        it("should report new url when using router api with no replaceUrl", () => {
            Helpers_1.navigate("detail");
            Helpers_1.navigate("home");
            Helpers_1.scrollWindow(1000);
            Helpers_1.click("navigate-about");
            Helpers_1.expectText("url-replace-message", "new url");
        });
        it("should not create new history item when using router api with replaceUrl: true (navigateByUrl)", () => {
            Helpers_1.navigate("sticky");
            Helpers_1.navigate("home");
            Helpers_1.scrollWindow(1000);
            Helpers_1.click("navigate-about-replace");
            Helpers_1.navigateBack();
            Helpers_1.expectPageTitle("Sticky page");
        });
    });
    describe("404 Not found", () => {
        it("should navigate to 404 on non-existent route at initial navigation", () => {
            protractor_1.browser.get("/404NonExistentPage");
            Helpers_1.expectPageTitle("404: page missing");
        });
        it("should navigate to 404 on non-existent route at subsequent navigation", () => {
            protractor_1.browser.get("/home");
            Helpers_1.navigate("404");
            Helpers_1.expectPageTitle("404: page missing");
        });
    });
    describe("Error page", () => {
        it("should navigate to error-page route at initial navigation", () => {
            protractor_1.browser.get("/error-page");
            Helpers_1.expectPageTitle("Error navigation");
        });
        it("should navigate to error-page route at subsequent navigation", () => {
            protractor_1.browser.get("/home");
            Helpers_1.navigate("error");
            Helpers_1.expectPageTitle("Error navigation");
        });
    });
    describe("route params", () => {
        beforeAll(() => {
            protractor_1.browser.get("/home");
        });
        beforeEach(() => {
            Helpers_1.navigate("home");
        });
        it("should navigate to item page", () => {
            Helpers_1.navigate("item");
            Helpers_1.expectPageTitle("Item page");
        });
        it("should navigate to item page and pass route parameter", () => {
            Helpers_1.navigate("item");
            Helpers_1.expectText("current-id", "1");
        });
        it("should update route params while navigation within same route", () => {
            Helpers_1.navigate("item");
            Helpers_1.click("navigate-2");
            Helpers_1.expectText("current-id", "2");
        });
        it("should push state history when navigates within same route", () => {
            Helpers_1.navigate("item");
            Helpers_1.click("navigate-2");
            Helpers_1.navigateBack();
            Helpers_1.expectPageTitle("Item page");
            Helpers_1.expectText("current-id", "1");
        });
        it("should not push state history when navigates multiple time with same route", () => {
            Helpers_1.navigate("item");
            Helpers_1.click("navigate-2");
            Helpers_1.click("navigate-2");
            Helpers_1.click("navigate-2");
            Helpers_1.navigateBack();
            Helpers_1.expectPageTitle("Item page");
            Helpers_1.expectText("current-id", "1");
        });
        it("should propagate route params changes when return on the page", () => {
            Helpers_1.navigate("item");
            Helpers_1.click("navigate-2");
            Helpers_1.navigate("home");
            Helpers_1.navigateBack();
            Helpers_1.click("navigate-2");
            Helpers_1.expectPageTitle("Item page");
            Helpers_1.expectText("current-id", "2");
        });
    });
    describe("guards", () => {
        beforeEach(() => {
            protractor_1.browser.get("/home");
        });
        it("should block route enter when guard enabled", () => {
            Helpers_1.click("enable-guards");
            Helpers_1.navigate("guard");
            Helpers_1.expectPageTitle("Home page");
            protractor_1.browser.sleep(200);
            Helpers_1.expectPageTitle("Home page");
        });
        it("should enter route when guard disabled", () => {
            Helpers_1.click("disable-guards");
            Helpers_1.navigate("guard");
            Helpers_1.expectPageTitle("Home page");
            protractor_1.browser.sleep(200);
            Helpers_1.expectPageTitle("Guard page");
        });
        it("should not allow deactivate route when guard enabled", () => {
            Helpers_1.click("disable-guards");
            Helpers_1.navigate("guard");
            protractor_1.browser.sleep(100);
            Helpers_1.click("enable-guards");
            Helpers_1.navigate("home");
            protractor_1.browser.sleep(100);
            Helpers_1.expectPageTitle("Guard page");
        });
        it("should not allow deactivate route by history pop and reset url to protected route", () => {
            Helpers_1.click("disable-guards");
            Helpers_1.navigate("guard");
            protractor_1.browser.sleep(100);
            Helpers_1.click("enable-guards");
            Helpers_1.navigateBack();
            protractor_1.browser.sleep(100);
            expect(protractor_1.browser.getCurrentUrl()).toEqual("http://localhost:3000/guard");
            Helpers_1.expectPageTitle("Guard page");
        });
        it("should work for lazy loaded modules", () => {
            Helpers_1.navigate("detail");
            Helpers_1.navigate("home");
            Helpers_1.expectPageTitle("Home page");
        });
    });
    describe("reusable routes", () => {
        describe("sticky", () => {
            beforeEach(() => {
                protractor_1.browser.get("/home");
            });
            it("should restore state of sticky routes on new navigation", () => {
                Helpers_1.navigate("sticky");
                Helpers_1.fillInput("sticky-input", "test string");
                Helpers_1.navigate("home");
                Helpers_1.navigate("sticky");
                Helpers_1.expectInput("sticky-input", "test string");
            });
            it("should restore state of sticky routes on history pop", () => {
                Helpers_1.navigate("sticky");
                Helpers_1.fillInput("sticky-input", "test string");
                Helpers_1.navigate("home");
                Helpers_1.navigateBack();
                Helpers_1.expectInput("sticky-input", "test string");
            });
            it("should propagate route params change on new navigation to sticky route", () => {
                Helpers_1.navigate("sticky");
                Helpers_1.click("navigate-2");
                Helpers_1.navigate("home");
                Helpers_1.navigate("sticky");
                Helpers_1.expectText("current-id", "1");
            });
        });
        describe("cache back", () => {
            beforeEach(() => {
                protractor_1.browser.get("/home");
            });
            it("should restore state of cache back routes when returns back", () => {
                Helpers_1.navigate("cacheback");
                Helpers_1.fillInput("cache-input", "test string");
                Helpers_1.navigate("home");
                Helpers_1.navigateBack();
                Helpers_1.expectInput("cache-input", "test string");
            });
            it("should restore state of cache back routes when returns forward", () => {
                Helpers_1.navigate("cacheback");
                Helpers_1.fillInput("cache-input", "test string");
                Helpers_1.navigateBack();
                Helpers_1.navigateForward();
                Helpers_1.expectInput("cache-input", "test string");
            });
            it("should not restore state of cache back routes on new new navigation", () => {
                Helpers_1.navigate("cacheback");
                Helpers_1.fillInput("cache-input", "test string");
                Helpers_1.navigate("home");
                Helpers_1.navigate("cacheback");
                Helpers_1.expectInput("cache-input", "");
            });
            it("should restore route when we navigate multiple time within reusable route", () => {
                Helpers_1.navigate("cacheback");
                Helpers_1.click("navigate-2");
                Helpers_1.click("navigate-3");
                Helpers_1.navigate("home");
                Helpers_1.navigateBack();
                Helpers_1.expectText("current-id", "3");
            });
            it("should propagate route params changes to reused routes", () => {
                Helpers_1.navigate("cacheback");
                Helpers_1.click("navigate-2");
                Helpers_1.click("navigate-3");
                Helpers_1.navigate("home");
                Helpers_1.navigateBack();
                Helpers_1.navigateBack();
                Helpers_1.expectText("current-id", "2");
            });
            it("should drop reuse cache correctly", () => {
                Helpers_1.navigate("cacheback");
                Helpers_1.fillInput("cache-input", "test string");
                Helpers_1.navigate("home");
                Helpers_1.navigate("cacheback");
                Helpers_1.navigateBack();
                Helpers_1.navigateBack();
                Helpers_1.expectInput("cache-input", "");
            });
            it("should drop reuse cache when navigating on non-reused routes", () => {
                Helpers_1.navigate("cacheback");
                Helpers_1.fillInput("cache-input", "test string");
                Helpers_1.navigate("home");
                Helpers_1.navigate("about");
                Helpers_1.navigateBack();
                Helpers_1.navigateBack();
                Helpers_1.expectInput("cache-input", "");
            });
            it("should not drop reuse cache when navigating within one route", () => {
                Helpers_1.navigate("cacheback");
                Helpers_1.fillInput("cache-input", "test string");
                Helpers_1.navigate("item");
                Helpers_1.click("navigate-2");
                Helpers_1.click("navigate-3");
                Helpers_1.navigateBack();
                Helpers_1.navigateBack();
                Helpers_1.navigateBack();
                Helpers_1.expectInput("cache-input", "test string");
            });
            it("should restore scroll position when return to cache back page", (done) => {
                Helpers_1.navigate("cacheback");
                Helpers_1.scrollWindow(1000);
                Helpers_1.getScrollPos().then(pos => {
                    Helpers_1.click("navigate-home-anchor");
                    Helpers_1.navigateBack();
                    Helpers_1.expectWindowScroll(pos);
                    done();
                });
            });
            it("should not restore scroll position on new navigation to cache back page", () => {
                Helpers_1.navigate("cacheback");
                Helpers_1.scrollWindow(1000);
                Helpers_1.click("navigate-home-anchor");
                Helpers_1.navigate("cacheback");
                Helpers_1.expectWindowScroll(0);
            });
            it("should update route params via observable after re-use", () => {
                Helpers_1.navigate("cacheback");
                Helpers_1.click("navigate-2");
                Helpers_1.navigate("querystring");
                Helpers_1.navigateBack();
                Helpers_1.click("navigate-3");
                Helpers_1.expectText("current-id", "3");
            });
            it("should update query params via observable after re-use", () => {
                Helpers_1.navigate("cacheback");
                Helpers_1.click("navigate-qs-1");
                Helpers_1.navigate("querystring");
                Helpers_1.navigateBack();
                Helpers_1.click("navigate-qs-2");
                Helpers_1.expectText("current-qs-id", "2");
            });
            it("should full reload page when using force flag", () => {
                Helpers_1.navigate("cacheback");
                Helpers_1.fillInput("cache-input", "test string");
                Helpers_1.click("force-reload");
                Helpers_1.expectInput("cache-input", "");
            });
        });
    });
    describe("prerender routes", () => {
        it("should load prerender route at first correctlty", () => {
            protractor_1.browser.get("/prerender");
            Helpers_1.expectPageTitle("Prerender page");
        });
        it("should prerender routes", () => {
            protractor_1.browser.get("/");
            Helpers_1.navigate("prerender");
            Helpers_1.expectPageTitle("Home page");
            protractor_1.browser.sleep(600);
            Helpers_1.expectPageTitle("Prerender page");
            //stop();
        });
        it("should split cache of prerender routes and reusable routes", () => {
            protractor_1.browser.get("/");
            Helpers_1.navigate("cacheback");
            Helpers_1.navigate("prerender");
            protractor_1.browser.sleep(600);
            Helpers_1.navigate("home");
            Helpers_1.navigateBack();
            Helpers_1.expectPageTitle("Prerender page");
        });
        it("should not prerender cache route", () => {
            protractor_1.browser.get("/");
            Helpers_1.navigate("prerender");
            protractor_1.browser.sleep(600);
            Helpers_1.navigate("home");
            Helpers_1.navigateBack();
            Helpers_1.expectPageTitle("Prerender page");
        });
        it("should not omit prerendering logic even on initial navigation", () => {
            protractor_1.browser.get("/prerender");
            protractor_1.browser.sleep(600);
            Helpers_1.expectText("prerender-text", "prerendered");
        });
        it("should activate routes in order, wait for route prerendering", () => {
            protractor_1.browser.get("/");
            Helpers_1.navigate("prerender");
            Helpers_1.navigate("about");
            Helpers_1.navigate("home");
            protractor_1.browser.sleep(600);
            Helpers_1.expectPageTitle("Home page");
        });
        it("should not emit new history item when midlle navigation delayed", () => {
            protractor_1.browser.get("/");
            Helpers_1.navigate("prerender");
            Helpers_1.navigate("about");
            Helpers_1.navigate("about");
            protractor_1.browser.sleep(600);
            Helpers_1.navigateBack();
            protractor_1.browser.sleep(600);
            Helpers_1.expectPageTitle("Prerender page");
        });
        it("should wait for prerenderTimeout, passed in URL param", () => {
            protractor_1.browser.get("/");
            Helpers_1.click("navigate-prerender-timeout");
            protractor_1.browser.sleep(600);
            Helpers_1.expectPageTitle("Home page");
            protractor_1.browser.sleep(1000);
            Helpers_1.expectPageTitle("Prerender page");
        });
    });
    describe("query params", () => {
        const key1 = "sampleKey";
        const val1 = "sampleValue";
        const key2 = "leprechaun";
        const val2 = "patrick";
        beforeEach(() => {
            protractor_1.browser.get("/querystring");
            Helpers_1.click("set-query-string");
        });
        it("should set query params", (done) => {
            protractor_1.browser.getCurrentUrl().then(res => {
                let qs = res.split("?")[1];
                expect(qs.split("&").length).toBe(2);
                expect(qs.indexOf(key1 + "=" + val1)).toBeGreaterThan(-1);
                expect(qs.indexOf(key2 + "=" + val2)).toBeGreaterThan(-1);
                done();
            });
        });
        it("should update existing query params with a set of new ones", (done) => {
            const key1a = "awesome";
            const val1a = "yes";
            const key2a = "superhero";
            const val2a = "batman";
            Helpers_1.click("add-query-string");
            protractor_1.browser.getCurrentUrl().then(res => {
                let qs = res.split("?")[1];
                expect(qs.split("&").length).toBe(4);
                expect(qs.indexOf(key1 + "=" + val1)).toBeGreaterThan(-1);
                expect(qs.indexOf(key2 + "=" + val2)).toBeGreaterThan(-1);
                expect(qs.indexOf(key1a + "=" + val1a)).toBeGreaterThan(-1);
                expect(qs.indexOf(key2a + "=" + val2a)).toBeGreaterThan(-1);
                done();
            });
        });
        it("should drop existing query params on set", (done) => {
            Helpers_1.click("reset-query-string");
            protractor_1.browser.getCurrentUrl().then(res => {
                let qs = res.split("?")[1];
                expect(qs.split("&").length).toBe(2);
                expect(qs.indexOf("bee=boo")).toBeGreaterThan(-1);
                expect(qs.indexOf("foo=bar")).toBeGreaterThan(-1);
                expect(qs.indexOf(key1)).toBe(-1);
                expect(qs.indexOf(key2)).toBe(-1);
                done();
            });
        });
        it("should set array query strings", (done) => {
            Helpers_1.click("set-array-query-string");
            protractor_1.browser.getCurrentUrl().then(res => {
                let qs = res.split("?")[1];
                expect(qs.split("&").length).toBe(3);
                expect(qs.indexOf("sampleArray=1")).toBeGreaterThan(-1);
                expect(qs.indexOf("sampleArray=2")).toBeGreaterThan(-1);
                expect(qs.indexOf("sampleArray=300")).toBeGreaterThan(-1);
                done();
            });
        });
        it("should set valueless query string", (done) => {
            Helpers_1.click("set-valueless-query-string");
            protractor_1.browser.getCurrentUrl().then(res => {
                expect(res.split("?")[1]).toBe("ok");
                done();
            });
        });
        it("should preserve query params on initial navigation", (done) => {
            protractor_1.browser.get("/querystring?initialNavigation&monkey=baboon");
            protractor_1.browser.getCurrentUrl().then(res => {
                expect(res.split("?")[1]).toBe("initialNavigation&monkey=baboon");
                done();
            });
        });
        it("should update query parameters via observable", () => {
            Helpers_1.expectText("observable-query-params-json", `{"sampleKey":"sampleValue","leprechaun":"patrick"}`);
            Helpers_1.click("set-valueless-query-string");
            Helpers_1.expectText("observable-query-params-json", `{"ok":true}`);
            Helpers_1.click("add-query-string");
            Helpers_1.expectText("observable-query-params-json", `{"ok":true,"awesome":"yes","superhero":"batman"}`);
        });
        it("should remove query parameters by passing null", (done) => {
            Helpers_1.click("null-query-string");
            protractor_1.browser.getCurrentUrl().then(res => {
                expect(res.split("?")[1].indexOf("sampleKey")).toBe(-1);
                done();
            });
        });
        it("should get query params updates from router even if route context is destroyed", () => {
            Helpers_1.expectText("not-in-outlet-text", `sampleValue`);
            Helpers_1.navigate("home");
            Helpers_1.navigate("about");
            Helpers_1.navigate("querystring");
            Helpers_1.expectText("not-in-outlet-text", ``);
            Helpers_1.click("set-query-string");
            Helpers_1.expectText("not-in-outlet-text", `sampleValue`);
        });
    });
    describe("query params also", () => {
        it("should drop parameters with invalid values", (done) => {
            protractor_1.browser.get("/querystring?CTR=50%");
            protractor_1.browser.getCurrentUrl().then(res => {
                expect(res.split("?")[1]).toBeUndefined();
                done();
            });
        });
        it("should not create new history item when using router api with replaceUrl: true (setQuery)", () => {
            protractor_1.browser.get("/");
            Helpers_1.navigate("querystring");
            Helpers_1.click("set-query-string-replace-state");
            Helpers_1.navigateBack();
            Helpers_1.expectPageTitle("Home page");
        });
        it("should skip navigation via setQuery if navigation is in progress", () => {
            protractor_1.browser.get("/");
            Helpers_1.navigate("querystring");
            Helpers_1.click("navigate-and-set-query");
            Helpers_1.expectPageTitle("About page");
        });
        it("should support query strings with question marks in data", () => {
            Helpers_1.navigate("querystring");
            Helpers_1.click("navigate-qs-quest");
            Helpers_1.expectText("observable-query-params-json", '{"search":"что? где? когда?","r321":"what?"}');
        });
    });
    describe("lazy modules", () => {
        it("should navigate within nested routes correctly", () => {
            protractor_1.browser.get("/");
            Helpers_1.navigate("detail");
            Helpers_1.click("extra-detail-link");
            Helpers_1.expectPageTitle("Detail extra page");
        });
    });
    describe("page route outlet hooks", () => {
        it("should be called on activation", () => {
            protractor_1.browser.get("/home");
            Helpers_1.expectText("header-message", "");
            Helpers_1.navigate("about");
            Helpers_1.expectText("header-message", "about activated");
        });
        it("should be called on deactivation", () => {
            protractor_1.browser.get("/about");
            Helpers_1.navigate("home");
            Helpers_1.expectText("header-message", "about deactivated");
        });
    });
    describe("url hash", () => {
        it("should not be parsed as a route parameter on initial navigation", () => {
            protractor_1.browser.get("/item/1#52");
            Helpers_1.expectText("current-id", "1");
        });
        it("should not be parsed as a route parameter on subsequent navigations", () => {
            Helpers_1.click("navigate-4");
            Helpers_1.expectText("current-id", "4");
        });
        it("should not be parsed as a query parameter on initial navigation", () => {
            protractor_1.browser.get("/querystring?awesome=yes#notreally");
            Helpers_1.expectText("observable-query-params-json", "{\"awesome\":\"yes\"}");
        });
        it("should not be parsed as a query parameter on subsequent navigations", () => {
            Helpers_1.click("navigate-qs-hash");
            Helpers_1.expectText("observable-query-params-json", "{\"search\":\"quest\"}");
        });
        it("should scroll page on hash-navigation in current document", () => {
            protractor_1.browser.get("/cacheback/1");
            Helpers_1.click("navigate-hash-anchor");
            expect(Helpers_1.getScrollPos()).toBeGreaterThan(0);
        });
    });
    describe("multiple outlets", () => {
        beforeEach(() => {
            protractor_1.browser.get("/multiple-outlets");
            Helpers_1.click("multiple-outlets-another-outlet-link");
        });
        it("should not detach component from default outlet, while navigating over other outlet routes", () => {
            Helpers_1.expectDisplayed("multiple-outlets-default-outlet-content");
            Helpers_1.expectDisplayed("multiple-outlets-another-outlet-content");
            Helpers_1.click("multiple-outlets-another-outlet-next-link");
            Helpers_1.expectDisplayed("multiple-outlets-default-outlet-content");
            Helpers_1.expectDisplayed("multiple-outlets-another-outlet-content");
        });
    });
});

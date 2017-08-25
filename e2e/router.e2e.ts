import {browser} from "protractor";
import {
  expectPageTitle,
  navigate,
  expectText,
  click,
  fillInput,
  expectInput,
  scrollWindow,
  expectWindowScroll,
  navigateBack,
  navigateForward,
  getScrollPos, stop
} from "./Helpers";

describe("Router", () => {

  describe("navigation", () => {

    beforeAll(() => {
      browser.get("/home");
    });

    it("should navigate to home page by default", () => {
      expectPageTitle("Home page");
    });

    it("should make simple route navigation", () => {
      navigate("about");
      expectPageTitle("About page");
    });

    it("should make simple route navigation when press back button", () => {
      navigate("about");
      navigateBack();
      expectPageTitle("Home page");
    });

    it("should make simple route navigation when press forward button", () => {
      navigate("about");
      navigateBack();
      navigateForward();
      expectPageTitle("About page");
    });

    it("should navigate to lazy routes", () => {
      navigate("detail");
      expectPageTitle("Detail page");
    });

    it("should navigate by absolute URL", () => {
      browser.get("/about");
      navigate("absurl");
      expectPageTitle("Home page");
    });

    it("should auto scroll at the top on new navigation", () => {
      navigate("home");
      scrollWindow(1000);
      click("cacheback-anchor");

      expectPageTitle("Cache back page");
      expectWindowScroll(0);
    });

    it("should make navigation by router api (navigateByUrl)", () => {
      navigate("home");
      click("navigate-about");

      expectPageTitle("About page");
    });

    it("should create new history item when using router api (navigateByUrl)", () => {
      navigate("home");
      click("navigate-about");
      navigateBack();

      expectPageTitle("Home page");
    });

    it("should not create new history item when using router api with replaceUrl: true (navigateByUrl)", () => {
      navigate("sticky");
      navigate("home");
      click("navigate-about-replace");
      navigateBack();

      expectPageTitle("Sticky page");
    });

  });

  describe("404 Not found", () => {
    it("should navigate to 404 on non-existent route at initial navigation", () => {
      browser.get("/404NonExistentPage");
      expectPageTitle("404: page missing");
    });

    it("should navigate to 404 on non-existent route at subsequent navigation", () => {
      browser.get("/home");
      navigate("404");
      expectPageTitle("404: page missing");
    });
  });

  describe("Error page", () => {
        it("should navigate to error-page route at initial navigation", () => {
            browser.get("/error-page");
            expectPageTitle("Error navigation");
        });

        it("should navigate to error-page route at subsequent navigation", () => {
            browser.get("/home");
            navigate("error");
            expectPageTitle("Error navigation");
        });
    });

  describe("route params", () => {

    beforeAll(() => {
      browser.get("/home");
    });

    beforeEach(() => {
      navigate("home");
    });

    it("should navigate to item page", () => {
      navigate("item");
      expectPageTitle("Item page");
    });

    it("should navigate to item page and pass route parameter", () => {
      navigate("item");
      expectText("current-id", "1");
    });

    it("should update route params while navigation within same route", () => {
      navigate("item");
      click("navigate-2");
      expectText("current-id", "2");
    });

    it("should push state history when navigates within same route", () => {
      navigate("item");
      click("navigate-2");
      navigateBack();

      expectPageTitle("Item page");
      expectText("current-id", "1");
    });

    it("should not push state history when navigates multiple time with same route", () => {
      navigate("item");
      click("navigate-2");
      click("navigate-2");
      click("navigate-2");

      navigateBack();

      expectPageTitle("Item page");
      expectText("current-id", "1");
    });

    it("should propagate route params changes when return on the page", () => {
      navigate("item");
      click("navigate-2");
      navigate("home");
      navigateBack();
      click("navigate-2");

      expectPageTitle("Item page");
      expectText("current-id", "2");
    });

  });

  describe("guards", () => {

    beforeEach(() => {
      browser.get("/home");
    });

    it("should block route enter when guard enabled", () => {

      click("enable-guards");
      navigate("guard");

      expectPageTitle("Home page");
      browser.sleep(200);
      expectPageTitle("Home page");

    });

    it("should enter route when guard disabled", () => {
      click("disable-guards");
      navigate("guard");

      expectPageTitle("Home page");

      browser.sleep(200);
      expectPageTitle("Guard page");
    });

    it("should not allow deactivate route when guard enabled", () => {
      click("disable-guards");
      navigate("guard");
      browser.sleep(100);
      click("enable-guards");
      navigate("home");
      browser.sleep(100);

      expectPageTitle("Guard page");
    });

    it("should not allow deactivate route by history pop and reset url to protected route", () => {
      click("disable-guards");
      navigate("guard");
      browser.sleep(100);
      click("enable-guards");
      navigateBack();
      browser.sleep(100);

      expect(browser.getCurrentUrl()).toEqual("http://localhost:3000/guard");
      expectPageTitle("Guard page");
    });

    it("should work for lazy loaded modules", () => {
      navigate("detail");
      navigate("home");
      expectPageTitle("Home page");
    });

  });

  describe("reusable routes", () => {

    describe("sticky", () => {
      beforeEach(() => {
        browser.get("/home");
      });

      it("should restore state of sticky routes on new navigation", () => {
        navigate("sticky");
        fillInput("sticky-input", "test string");
        navigate("home");
        navigate("sticky");

        expectInput("sticky-input", "test string");
      });

      it("should restore state of sticky routes on history pop", () => {
        navigate("sticky");
        fillInput("sticky-input", "test string");
        navigate("home");
        navigateBack();

        expectInput("sticky-input", "test string");
      });

      it("should propagate route params change on new navigation to sticky route", () => {
        navigate("sticky");
        click("navigate-2");
        navigate("home");
        navigate("sticky");

        expectText("current-id", "1");
      });

    });

    describe("cache back", () => {

      beforeEach(() => {
        browser.get("/home");
      });

      it("should restore state of cache back routes when returns back", () => {
        navigate("cacheback");
        fillInput("cache-input", "test string");
        navigate("home");
        navigateBack();

        expectInput("cache-input", "test string");
      });

      it("should restore state of cache back routes when returns forward", () => {
        navigate("cacheback");
        fillInput("cache-input", "test string");
        navigateBack();
        navigateForward();

        expectInput("cache-input", "test string");
      });

      it("should not restore state of cache back routes on new new navigation", () => {
        navigate("cacheback");
        fillInput("cache-input", "test string");

        navigate("home");
        navigate("cacheback");

        expectInput("cache-input", "");

      });

      it("should restore route when we navigate multiple time within reusable route", () => {
        navigate("cacheback");
        click("navigate-2");
        click("navigate-3");
        navigate("home");
        navigateBack();

        expectText("current-id", "3");
      });

      it("should propagate route params changes to reused routes", () => {
        navigate("cacheback");
        click("navigate-2");
        click("navigate-3");
        navigate("home");
        navigateBack();
        navigateBack();

        expectText("current-id", "2");
      });

      it("should drop reuse cache correctly", () => {
        navigate("cacheback");
        fillInput("cache-input", "test string");
        navigate("home");
        navigate("cacheback");
        navigateBack();
        navigateBack();

        expectInput("cache-input", "");
      });

      it("should drop reuse cache when navigating on non-reused routes", () => {
        navigate("cacheback");
        fillInput("cache-input", "test string");
        navigate("home");
        navigate("about");
        navigateBack();
        navigateBack();

        expectInput("cache-input", "");
      });

      it("should not drop reuse cache when navigating within one route", () => {
        navigate("cacheback");
        fillInput("cache-input", "test string");
        navigate("item");

        click("navigate-2");
        click("navigate-3");

        navigateBack();
        navigateBack();
        navigateBack();

        expectInput("cache-input", "test string");
      });

      it("should restore scroll position when return to cache back page", (done) => {
        navigate("cacheback");
        scrollWindow(1000);
        getScrollPos().then(pos => {
          click("navigate-home-anchor");
          navigateBack();

          expectWindowScroll(pos);
          done();
        });

      });

      it("should not restore scroll position on new navigation to cache back page", () => {
        navigate("cacheback");
        scrollWindow(1000);
        click("navigate-home-anchor");
        navigate("cacheback");

        expectWindowScroll(0);
      });


      it("should update route params via observable after re-use", () => {
        navigate("cacheback");
        click("navigate-2");

        navigate("querystring");
        navigateBack();

        click("navigate-3");
        expectText("current-id", "3");
      });

      it("should update query params via observable after re-use", () => {
        navigate("cacheback");
        click("navigate-qs-1");

        navigate("querystring");
        navigateBack();

        click("navigate-qs-2");
        expectText("current-qs-id", "2");
      });

        it("should full reload page when using force flag", () => {
            navigate("cacheback");
            fillInput("cache-input", "test string");
            click("force-reload");
            expectInput("cache-input", "");
        });
    });

  });

  describe("prerender routes", () => {

    it("should load prerender route at first correctlty", () => {
      browser.get("/prerender");
      expectPageTitle("Prerender page");
    });

    it("should prerender routes", () => {
      browser.get("/");

      navigate("prerender");
      expectPageTitle("Home page");
      browser.sleep(600);

      expectPageTitle("Prerender page");
      //stop();
    });

    it("should split cache of prerender routes and reusable routes", () => {
      browser.get("/");

      navigate("cacheback");
      navigate("prerender");
      browser.sleep(600);
      navigate("home");
      navigateBack();

      expectPageTitle("Prerender page");
    });

    it("should not prerender cache route", () => {
      browser.get("/");

      navigate("prerender");
      browser.sleep(600);
      navigate("home");
      navigateBack();

      expectPageTitle("Prerender page");
    });

    it("should not omit prerendering logic even on initial navigation", () => {
      browser.get("/prerender");
      browser.sleep(600);
      expectText("prerender-text", "prerendered");
    });

    it("should activate routes in order, wait for route prerendering", () => {
      browser.get("/");
      navigate("prerender");
      navigate("about");
      navigate("home");
      browser.sleep(600);

      expectPageTitle("Home page");
    });

    it("should not emit new history item when midlle navigation delayed", () => {
      browser.get("/");

      navigate("prerender");
      navigate("about");
      navigate("about");

      browser.sleep(600);
      navigateBack();
      browser.sleep(600);

      expectPageTitle("Prerender page");
    });

  });

  describe("query params", () => {

    const key1 = "sampleKey";
    const val1 = "sampleValue";
    const key2 = "leprechaun";
    const val2 = "patrick";

    beforeEach(() => {
      browser.get("/querystring");

      click("set-query-string");
    });

    it("should set query params", (done) => {

      browser.getCurrentUrl().then(res => {
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

      click("add-query-string");

      browser.getCurrentUrl().then(res => {

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

      click("reset-query-string");

      browser.getCurrentUrl().then(res => {

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

      click("set-array-query-string");

      browser.getCurrentUrl().then(res => {

        let qs = res.split("?")[1];
        expect(qs.split("&").length).toBe(3);
        expect(qs.indexOf("sampleArray=1")).toBeGreaterThan(-1);
        expect(qs.indexOf("sampleArray=2")).toBeGreaterThan(-1);
        expect(qs.indexOf("sampleArray=300")).toBeGreaterThan(-1);

        done();
      });
    });

    it("should set valueless query string", (done) => {

      click("set-valueless-query-string");

      browser.getCurrentUrl().then(res => {

        expect(res.split("?")[1]).toBe("ok");

        done();
      });
    });


    it("should preserve query params on initial navigation", (done) => {
      browser.get("/querystring?initialNavigation&monkey=baboon");
      browser.getCurrentUrl().then(res => {
        expect(res.split("?")[1]).toBe("initialNavigation&monkey=baboon");
        done();
      });
    });


    it("should update query parameters via observable", () => {
      expectText("observable-query-params-json", `{"sampleKey":"sampleValue","leprechaun":"patrick"}`);
      click("set-valueless-query-string");
      expectText("observable-query-params-json", `{"ok":true}`);
      click("add-query-string");
      expectText("observable-query-params-json", `{"ok":true,"awesome":"yes","superhero":"batman"}`);
    });

    it("should remove query parameters by passing null", (done) => {
      click("null-query-string");

      browser.getCurrentUrl().then(res => {
        expect(res.split("?")[1].indexOf("sampleKey")).toBe(-1);
        done();
      });

    });

    it("should get query params updates from router even if route context is destroyed", () => {

      expectText("not-in-outlet-text", `sampleValue`);
      navigate("home");
      navigate("about");
      navigate("querystring");
      expectText("not-in-outlet-text", ``);
      click("set-query-string");
      expectText("not-in-outlet-text", `sampleValue`);

    });

  });

  describe("query params also", () => {

    it("should drop parameters with invalid values", (done) => {
      browser.get("/querystring?CTR=50%");
      browser.getCurrentUrl().then(res => {
        expect(res.split("?")[1]).toBeUndefined();
        done();
      });
    });

    it("should not create new history item when using router api with replaceUrl: true (setQuery)", () => {
      browser.get("/");
      navigate("querystring");
      click("set-query-string-replace-state");
      navigateBack();

      expectPageTitle("Home page");
    });

    it("should skip navigation via setQuery if navigation is in progress", () => {
      browser.get("/");
      navigate("querystring");

      click("navigate-and-set-query");
      expectPageTitle("About page");
    });

      it("should support query strings with question marks in data", () => {
          navigate("querystring");

          click("navigate-qs-quest");
          expectText("observable-query-params-json", '{"search":"что? где? когда?","r321":"what?"}');
      });

  });

  describe("lazy modules", () => {

    it("should navigate within nested routes correctly", () => {
      browser.get("/");
      navigate("detail");
      click("extra-detail-link");
      expectPageTitle("Detail extra page");
    });

  });

  describe("page route outlet hooks", () => {

      it("should be called on activation", () => {
            browser.get("/home");
            expectText("header-message","");

            navigate("about");
            expectText("header-message","about activated");
        });

      it("should be called on deactivation", () => {
          browser.get("/about");

          navigate("home");
          expectText("header-message","about deactivated");
      });

    });


    describe("url hash", () => {

        it("should not be parsed as a route parameter on initial navigation", () => {
            browser.get("/item/1#52");
            expectText("current-id","1");

        });

        it("should not be parsed as a route parameter on subsequent navigations", () => {
            click("navigate-4");
            expectText("current-id","4");
        });

        it("should not be parsed as a query parameter on initial navigation", () => {
            browser.get("/querystring?awesome=yes#notreally");
            expectText("observable-query-params-json","{\"awesome\":\"yes\"}");

        });

        it("should not be parsed as a query parameter on subsequent navigations", () => {
            click("navigate-qs-hash");
            expectText("observable-query-params-json","{\"search\":\"quest\"}");
        });


    });

  //TODO: Base Href Tests ?

});

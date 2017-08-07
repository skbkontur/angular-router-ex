
import {UrlParser} from "../UrlParser";
describe(`UrlParser`, () => {

    it("should parse protocol", () => {
        const p = UrlParser.parseUrl("https://www.youtube.com/watch?v=ClkQA2Lb_iE");
        expect(p.protocol).toBe("https:")
      }
    )

    it("should parse host", () => {
        const p = UrlParser.parseUrl("https://www.youtube.com:8080/watch?v=ClkQA2Lb_iE");
        expect(p.host).toBe("www.youtube.com:8080")
      }
    )

  it("should parse hostname", () => {
      const p = UrlParser.parseUrl("https://www.youtube.com:9999/watch?v=ClkQA2Lb_iE");
      expect(p.hostname).toBe("www.youtube.com")
    }
  )

  it("should parse port", () => {
      const p = UrlParser.parseUrl("https://www.youtube.com:9991/watch?v=ClkQA2Lb_iE");
      expect(p.port).toBe("9991")
    }
  )

  it("should parse search", () => {
      const p = UrlParser.parseUrl("https://www.youtube.com:9991/watch?v=ClkQA2Lb_iE");
      expect(p.search).toBe("?v=ClkQA2Lb_iE")
    }
  )

  it("should parse pathname", () => {
      const p = UrlParser.parseUrl("https://www.youtube.com:9991/watch?v=ClkQA2Lb_iE");
      expect(p.pathname).toBe("/watch")
    }
  )

  it("should parse hash", () => {
      const p = UrlParser.parseUrl("https://www.youtube.com:9991/watch?v=ClkQA2Lb_iE#t=365s");
      expect(p.hash).toBe("#t=365s")
    }
  )

  it("should parse relative urls", () => {
      const p = UrlParser.parseUrl("/watch?v=ClkQA2Lb_iE#t=368s");
      expect(p.pathname).toBe("/watch")
      expect(p.search).toBe("?v=ClkQA2Lb_iE")
      expect(p.hash).toBe("#t=368s")
    }
  )


  it("should parse urls with no path separator", () => {
      const p = UrlParser.parseUrl("https://www.youtube.com:9991?v=ClkQA2Lb_iE#t=365s");
      expect(p.pathname).toBe("/");
      expect(p.search).toBe("?v=ClkQA2Lb_iE")
    }
  )


})

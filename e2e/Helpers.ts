import {browser, by, element, ElementArrayFinder, ElementFinder} from "protractor";

declare var expect: any;

export function navigate(page: string) {
    scrollWindow(0);
    getByTid(`navigate-page-${page}`).click();
    browser.sleep(50);
}

export function stop() {
    browser.wait(() => false, 10000000);
}

export function getByTid(tid: string, scope?: ElementFinder): ElementFinder {
    const selector = by.css(`[tid=${tid}]`);
    return scope ? scope.element(selector) : element(selector);
}

export function getAllByTid(tid: string): ElementArrayFinder {
    return element.all(by.css(`[tid=${tid}]`));
}

export function expectPageTitle(title: string) {
    const all = getAllByTid("page-title");
    expect(all.last().getText()).toEqual(title);
}

export function expectText(tid: string, text: string) {
    const el = getByTid(tid);
    expect(el.getText()).toEqual(text, `Expect text of element (tid=${tid})`);
}

export function click(tid: string) {
    const el = getByTid(tid);
    el.click();
}

export function expectDisplayed(tid: string | ElementFinder, scope?: ElementFinder) {
    const elementToExpect: ElementFinder = typeof tid === "string" ? getByTid(tid, scope) : tid;
    expect(elementToExpect.isDisplayed()).toBeTruthy();
}


export function fillInput(tid: string, text: string) {
    const el = getByTid(tid);
    el.sendKeys(text);
}

export function expectInput(tid: string, text: string) {
    const el = getByTid(tid);

    expect(el.getAttribute("value")).toEqual(text);
}

export function scrollWindow(offset: number): any {
    return browser.executeScript(`window.scrollTo(0,${offset});`);
}

export function getScrollPos(): any {
    return browser.executeScript('return window.pageYOffset;');
}

export function expectWindowScroll(offset: number) {
    expect(getScrollPos()).toBe(offset);
}

export function navigateBack() {
    browser.navigate().back();
}

export function navigateForward() {
    browser.navigate().forward();
}

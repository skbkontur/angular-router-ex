"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var protractor_1 = require("protractor");
function navigate(page) {
    getByTid("navigate-page-" + page).click();
    protractor_1.browser.sleep(50);
}
exports.navigate = navigate;
function stop() {
    protractor_1.browser.wait(function () { return false; }, 10000000);
}
exports.stop = stop;
function getByTid(tid) {
    return protractor_1.element(protractor_1.by.css("[tid=" + tid + "]"));
}
exports.getByTid = getByTid;
function getAllByTid(tid) {
    return protractor_1.element.all(protractor_1.by.css("[tid=" + tid + "]"));
}
exports.getAllByTid = getAllByTid;
function expectPageTitle(title) {
    var all = getAllByTid("page-title");
    expect(all.last().getText()).toEqual(title);
}
exports.expectPageTitle = expectPageTitle;
function expectText(tid, text) {
    var el = getByTid(tid);
    expect(el.getText()).toEqual(text, "Expect text of element (tid=" + tid + ")");
}
exports.expectText = expectText;
function click(tid) {
    var el = getByTid(tid);
    el.click();
}
exports.click = click;
function fillInput(tid, text) {
    var el = getByTid(tid);
    el.sendKeys(text);
}
exports.fillInput = fillInput;
function expectInput(tid, text) {
    var el = getByTid(tid);
    expect(el.getAttribute("value")).toEqual(text);
}
exports.expectInput = expectInput;
function scrollWindow(offset) {
    return protractor_1.browser.executeScript("window.scrollTo(0," + offset + ");");
}
exports.scrollWindow = scrollWindow;
function getScrollPos() {
    return protractor_1.browser.executeScript('return window.pageYOffset;');
}
exports.getScrollPos = getScrollPos;
function expectWindowScroll(offset) {
    expect(getScrollPos()).toBe(offset);
}
exports.expectWindowScroll = expectWindowScroll;
function navigateBack() {
    protractor_1.browser.navigate().back();
}
exports.navigateBack = navigateBack;
function navigateForward() {
    protractor_1.browser.navigate().forward();
}
exports.navigateForward = navigateForward;

export class RouterScrollWrapper {

    getScrollState(): number {
        return window.pageYOffset || document.documentElement.scrollTop;
    }

    setScrollState(position: number) {
        window.scrollTo(0, position);
    }

    moveTop() {
        this.setScrollState(0);
    }

}

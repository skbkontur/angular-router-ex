export declare type InternalStateType = {
    [key: string]: any;
};
export declare class AppState {
    _state: InternalStateType;
    state: any;
    get(prop?: any): any;
    set(prop: string, value: any): any;
    private _clone(object);
}

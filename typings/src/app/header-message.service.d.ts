import { Observable } from "rxjs/Observable";
export declare class HeaderMessageService {
    private message;
    setMessage(msg: string): void;
    getMessage(): Observable<string>;
}

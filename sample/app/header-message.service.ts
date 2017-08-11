import {Injectable} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {Observable} from "rxjs/Observable";


@Injectable()
export class HeaderMessageService {
    private message = new Subject<string>();

    setMessage(msg: string) {
        this.message.next(msg);
    }

    getMessage(): Observable<string> {
        return this.message;
    }
}

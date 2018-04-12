import {Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs";


@Injectable()
export class HeaderMessageService {
    private message = new Subject<string>();

    getMessage(): Observable<string> {
        return this.message;
    }

    setMessage(msg: string) {
        this.message.next(msg);
    }
}

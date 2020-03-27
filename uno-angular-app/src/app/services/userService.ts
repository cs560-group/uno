import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: "root"
})
export class UserService {
    private _name: BehaviorSubject<string> = new BehaviorSubject<string>("");
    name: Observable<string> = this._name.asObservable();

    setDisplayName(username: string) {
        console.log("setting name as", username);
        this._name.next(username);
    }
}
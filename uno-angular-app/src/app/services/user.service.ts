import { Injectable } from '@angular/core';

@Injectable({
    providedIn: "root"
})
export default class UserService {
    public username: string = "";
    constructor() {}
}
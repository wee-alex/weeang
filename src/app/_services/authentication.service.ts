import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '@/_models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
        // this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(null));
        this.currentUser = this.currentUserSubject.asObservable();

        this.http.get<any>(`${config.apiUrl}/api/check_cookie`).subscribe(user => {
            console.log(user);
            this.currentUserSubject.next(user);
            this.currentUser = this.currentUserSubject.asObservable();

        })
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    unsetCurrentUser() {
        console.log("unsetting user");
        this.currentUserSubject.next(null);
    }

    login(email: string, password: string) {
        return this.http.post<any>(`${config.apiUrl}/api/login_submit`, { email, password })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                // localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
                return user;
            }));
    }

    logout2() {
        return this.http.post<any>(`${config.apiUrl}/api/logout`, {  })
            .subscribe()
    }

    logout() {
        // remove user from local storage and set current user to null
        console.log('here1')
        return this.http.post<any>(`${config.apiUrl}/api/logout`, {})
        // .subscribe(data => {
        //     console.log('here2')
        //     console.log(data);
        //     localStorage.removeItem('currentUser');
        //     this.currentUserSubject.next(null);
        // })

    }
}
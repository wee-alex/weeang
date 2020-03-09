import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

import { User } from '@/_models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(
        private http: HttpClient,
        private router: Router,
        ) {
        // this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(null));
        this.currentUser = this.currentUserSubject.asObservable();

        this.http.get<User>(`${config.apiUrl}/api/check_cookie`)
        .pipe(
            tap(user => console.log("Check cookie user 1: ", user)),
            // map(user => new BehaviorSubject<User>(
            //     null
            //     // JSON.parse(user)
            //     ))
        )
        .subscribe(user => {
            // console.log("Check cookie user: ", user);
            this.currentUserSubject.next(user);
            this.currentUser = this.currentUserSubject.asObservable();
            this.router.navigate(['/']);

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
                console.log("Setting Current User to: ", user);
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
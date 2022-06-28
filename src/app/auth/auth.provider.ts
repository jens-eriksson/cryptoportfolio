import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable()
export class AuthProvider {
    private readonly AUTH_STORAGE_KEY = 'uid';
    private auth: firebase.default.auth.Auth;

    constructor(
        private router: Router
    ) {
        this.auth = firebase.default.auth();
        this.auth.onAuthStateChanged(firebaseUser => {
            if (firebaseUser) {
                localStorage.setItem(this.AUTH_STORAGE_KEY, firebaseUser.uid);
            } else {
                localStorage.removeItem(this.AUTH_STORAGE_KEY);
            }
        });
    }

    public async login(email: string, password: string) {
        return this.auth.signInWithEmailAndPassword(email, password);
    }

    public async logout() {
        return this.auth.signOut();
    }

    public uid() {
        return localStorage.getItem(this.AUTH_STORAGE_KEY);
    }

    public isAuthenticated() {
        const auth = localStorage.getItem(this.AUTH_STORAGE_KEY);
        if (auth) {
            return true;
        }
        return false;
    }

    public onAuthStateChanged(user) {
        return this.auth.onAuthStateChanged(user);
    }

    public updateUser(user) {
        return this.auth.updateCurrentUser(user);
    }
}

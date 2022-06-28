import { AuthProvider } from './auth.provider';
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private auth: AuthProvider
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        if (this.auth.isAuthenticated()) {
            return true;
        }
        this.router.navigate(['/login']);
        return false;
    }
}

import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad {
  /* We can inject services on other services using constructor */
  constructor(private authService: AuthService, private router: Router) {}

  /* CanActivate is wrong for lazyloaded modules,
  becoz that would means that, the page get downloaded before the guard
  actually get executes, it means, if we prevent navigation the code downloaded for nothing*/

  /* Instead we should use CanLoad , which is actually a guard that runs before
  lazy loaded code fetched */

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!this.authService.userIsAuthenticated) {
      this.router.navigateByUrl('/auth');
    }
    return this.authService.userIsAuthenticated;
  }
}

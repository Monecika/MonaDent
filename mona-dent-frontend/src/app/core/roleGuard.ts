import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs';
import { UserRole } from './models/User';
import { UserStore } from './stores/user-store';

export const roleGuard = (...allowedRoles: UserRole[]): CanActivateFn => {
  return () => {
    const router = inject(Router);
    const userStore = inject(UserStore);

    userStore.loadUser();

    return toObservable(userStore.isLoading).pipe(
      filter((isLoading) => !isLoading),
      take(1),
      map(() => {
        const user = userStore.user();
        return user && allowedRoles.includes(user.role)
          ? true
          : user
            ? router.createUrlTree(['/'])
            : router.createUrlTree(['/login']);
      }),
    );
  };
};

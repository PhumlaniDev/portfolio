import { Auth, authState } from '@angular/fire/auth';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs';

import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  return authState(auth).pipe(
    take(1),
    map((user) => {
      if (user?.email === 'aphumlani.dev@gmail.com') {
        return true;
      }
      router.navigate(['/']);
      return false;
    }),
  );
};

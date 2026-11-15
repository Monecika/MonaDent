import { HttpInterceptorFn } from '@angular/common/http';

export const requestInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.urlWithParams.includes('/auth/login')) {
    return next(req);
  }

  const token = localStorage.getItem('userAccessToken');

  if (!token) {
    throw new Error('Authentication token is missing. Please log in.');
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authReq);
};

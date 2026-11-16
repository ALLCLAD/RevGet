import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Intercepteur Anti-Cache pour Angular 21 (HttpInterceptorFn)
 * Clone toutes les requêtes HTTP sortantes pour y attacher les headers no-cache
 */
export const noCacheInterceptor: HttpInterceptorFn = (req, next) => {
  const noCacheReq = req.clone({
    setHeaders: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
  return next(noCacheReq);
};

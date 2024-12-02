

import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Assignatura } from './models/models';

export const removeUserIdInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    map((event) => {
      if (event instanceof HttpResponse && event.body) {
        if (Array.isArray(event.body)) {
          // Tipus explícit per a arrays
          const processedBody = event.body.map((assignatura: Assignatura) => {
            const { userId, ...rest } = assignatura;
            return rest;
          });
          return event.clone({ body: processedBody });
        } else if (typeof event.body === 'object') {
          // Tipus explícit per a objectes
          const { userId, ...rest } = event.body as Assignatura;
          return event.clone({ body: rest });
        }
      }
      return event;
    })
  );
};

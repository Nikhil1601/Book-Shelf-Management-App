import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  
  const myToken = sessionStorage.getItem('token');

  const cloneRequest =  req.clone({
    setHeaders:{
      Authorization: `${myToken}`
    }
    
  });console.log('hello from in');
  
  return next(cloneRequest);
};



import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router, private snackBar: MatSnackBar) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        const listOfErrors = [401, 403];
        if (listOfErrors.indexOf(error.status) > -1) {
          // Exibir SnackBar com mensagem de token inválido
          this.showSnackbarTopPosition('Token inválido');

          // Redirecionar para a página de login em caso de não autorizado
          this.router.navigate(['/admin/login']);
        }

        // Pode adicionar mais lógica de manipulação de erros conforme necessário
        return throwError(() => error);
      })
    );
  }

  private showSnackbarTopPosition(content: string) {
    this.snackBar.open(content, 'Fechar', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }
}
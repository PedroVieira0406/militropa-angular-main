import { NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-alterar-login',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    NgIf,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './alterar-login.component.html',
  styleUrl: './alterar-login.component.css',
})
export class AlterarLoginComponent implements OnInit {
  usuarioLogado: any;
  private subscription = new Subscription();
  formGroup: FormGroup;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private usuarioService: UsuarioService,
    private router: Router
  ) {
    this.formGroup = this.formBuilder.group({
      login: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    });
  }

  ngOnInit(): void {
    this.subscription.add(
      this.authService.getUsuarioLogado().subscribe((usuarioLogado) => {
        this.usuarioLogado = usuarioLogado;
        this.formGroup.patchValue({
          login: usuarioLogado?.login || '',
        });
      })
    );
  }

  alterarLogin() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const { login } = this.formGroup.value;

      this.usuarioService.alterarLogin(login).subscribe({
        next: () => {
          this.snackBar.open('Login alterado com sucesso!', 'Fechar', {
            duration: 3000,
          });
          this.router.navigateByUrl('/ecommerce');
        },
        error: (error: HttpErrorResponse) => {
          console.error('Erro ao alterar login:', error);
          this.tratarErros(error);
          this.snackBar.open('Erro ao alterar login.', 'Fechar', {
            duration: 3000,
          });
        },
      });
    } else {
      this.snackBar.open('Preencha o campo corretamente.', 'Fechar', {
        duration: 3000,
      });
    }
  }

  tratarErros(errorResponse: HttpErrorResponse) {
    if (errorResponse.status === 400) {
      if (errorResponse.error?.errors) {
        errorResponse.error.errors.forEach((validationError: any) => {
          const formControl = this.formGroup.get(validationError.fieldName);
          if (formControl) {
            formControl.setErrors({ apiError: validationError.message });
          }
        });
      }
    } else if (errorResponse.status >= 500) {
      alert('Erro interno do servidor.');
    }
  }
}

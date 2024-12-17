import { NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { ClienteService } from '../../../services/cliente.service';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-alterar-senha',
  standalone: true,
  imports: [MatCardModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, NgIf],
  templateUrl: './alterar-senha.component.html',
  styleUrl: './alterar-senha.component.css'
})
export class AlterarSenhaComponent {
    usuarioLogado: any;
    private subscription = new Subscription();
    formGroup: FormGroup;

    constructor(
      private authService: AuthService,
      private formBuilder: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private snackBar: MatSnackBar,
      private usuarioService: UsuarioService,
      private router: Router
    ) {
      this.formGroup = this.formBuilder.group({
        senhaAntiga: ['', Validators.required],
        novaSenha: ['', [Validators.required, Validators.minLength(3)]],
      });
    }

    ngOnInit(): void {}

    alterarSenha() {
      this.formGroup.markAllAsTouched();
      if (this.formGroup.valid) {
        const { senhaAntiga, novaSenha } = this.formGroup.value;
    
        // Converte os valores para string, caso não sejam
        const senhaAntigaStr = String(senhaAntiga);
        const senhaNovaStr = String(novaSenha);
    
        console.log('Dados enviados para a API:', { senhaAntiga: senhaAntigaStr, senhaNova: senhaNovaStr });
    
        // Chamada ao serviço
        this.usuarioService.alterarSenha(senhaAntigaStr, senhaNovaStr).subscribe({
          next: () => {
            this.snackBar.open('Senha alterada com sucesso!', 'Fechar', { duration: 3000 });
            this.router.navigateByUrl('/ecommerce');
          },
          error: (error: HttpErrorResponse) => {
            console.error('Erro ao alterar senha:', error);
            this.tratarErros(error);
          },
        });
      } else {
        this.snackBar.open('Preencha todos os campos corretamente.', 'Fechar', { duration: 3000 });
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

import { NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Usuario } from '../../../models/usuario.model';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [ ReactiveFormsModule, MatCardModule, MatFormFieldModule,
    MatButtonModule, NgIf, MatInputModule, RouterModule, MatTableModule, MatToolbarModule, MatSelectModule, MatDatepickerModule,
    MatNativeDateModule, MatIconModule, MatMenuModule],
  templateUrl: './usuario-form.component.html',
  styleUrl: './usuario-form.component.css'
})

export class UsuarioFormComponent {
  formGroup: FormGroup;


  constructor(private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog) {
      this.formGroup = this.formBuilder.group({
        id:[null],
        login: ['', Validators.required],
        senha: ['', Validators.required],
        perfil: ['', Validators.required]
      })
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void{
    const usuario: Usuario = this.activatedRoute.snapshot.data['usuario'];

    this.formGroup = this.formBuilder.group({

      id:[(usuario && usuario.id) ? usuario.id : null],
      login: [(usuario && usuario.login) ? usuario.login : '', Validators.required],
      senha: [null],
      perfil: [(usuario && usuario.perfil) ? usuario.perfil : '', Validators.required]
    });
  }
  
  tratarErros(errorResponse: HttpErrorResponse) {

    if (errorResponse.status === 400) {
      if (errorResponse.error?.errors) {
        errorResponse.error.errors.forEach((validationError: any) => {
          const formControl = this.formGroup.get(validationError.fieldName);

          if (formControl) {
            formControl.setErrors({apiError: validationError.message})
          }

        });
      }
    } else if (errorResponse.status < 400){
      alert(errorResponse.error?.message || 'Erro genérico do envio do formulário.');
    } else if (errorResponse.status >= 500) {
      alert('Erro interno do servidor.');
    }

  }

  salvar() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const usuario = this.formGroup.value;

      // selecionando a operacao (insert ou update)
      const operacao = usuario.id == null
      ? this.usuarioService.insert(usuario)
      : this.usuarioService.update(usuario);

      // executando a operacao
      operacao.subscribe({
        next: () => this.router.navigateByUrl('/admin/usuarios'),
        error: (error) => {
          console.log('Erro ao Salvar' + JSON.stringify(error));
          this.tratarErros(error);
        }
      });

      console.log('Dados enviados:', usuario);

    }
    
  }

  excluir() {
    if (this.formGroup.valid) {
      const usuario = this.formGroup.value;
      if (usuario.id != null) {
        this.usuarioService.delete(usuario).subscribe({
          next: () => {
            this.router.navigateByUrl('/admin/usuarios');
          },
          error: (err) => {
            console.log('Erro ao Excluir' + JSON.stringify(err));
          }
        });
      }
    }
  }

  getErrorMessage(controlName: string, errors: ValidationErrors | null | undefined): string {
    if (!errors) {
      return '';
    }
    for (const errorName in errors) {
      if (errors.hasOwnProperty(errorName) && this.errorMensages[controlName][errorName]) {
        return this.errorMensages[controlName][errorName];
      }
    }

    return 'invalid field';
  }

  errorMensages: { [controlName: string]: { [errorName: string]: string } } = {
    login: {
        required: 'Login é obrigatório',
        loginTaken: 'Este login já está em uso.',
        apiError: '',
    },
    senha: {
        required: 'Senha é obrigatória',
        minLength: 'O tamanho mínimo da senha é 5 dígitos.',
        apiError: '',
    },
    descricao: {
        required: 'Perfil é obrigatório',
        apiError: '',
    },
};
}
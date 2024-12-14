import { NgFor, NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Endereco } from '../../../models/endereco.model';
import { Funcionario } from '../../../models/funcionario.model';
import { Usuario } from '../../../models/usuario.model';
import { EnderecoService } from '../../../services/endereco.service';
import { FuncionarioService } from '../../../services/funcionario.service';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-funcionario-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule,
    RouterModule, MatSelectModule, NgIf,
    MatIconModule, FormsModule, NgFor,],
  templateUrl: './funcionario-form.component.html',
  styleUrl: './funcionario-form.component.css'
})
export class FuncionarioFormComponent implements OnInit {
  formGroup: FormGroup;
  funcionarios: Funcionario[] = [];
  usuarios: Usuario[] = [];
  enderecos: Endereco[] = [];

  constructor(private formBuilder: FormBuilder,
    private funcionarioService: FuncionarioService,
    private usuarioService: UsuarioService,
    private enderecoService: EnderecoService,
    private snackBar: MatSnackBar,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog) {
    this.formGroup = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.maxLength(60)]],
      cpf: ['', [Validators.required, Validators.maxLength(20), Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100), Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      telefone: ['', [Validators.required, Validators.pattern(/^(\(?\d{2}\)?\s?)?(\d{4,5}-\d{4})$/)]],
      endereco: [null, Validators.required],
      matricula: ['', [Validators.required, Validators.maxLength(10)]],
      usuario: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.usuarioService.findAll().subscribe(data => {
      this.usuarios = data;
    });
    this.enderecoService.findAll().subscribe(data => {
      this.enderecos = data;
    });
    this.initializeForm();
  }

  initializeForm(): void {
    const funcionario: Funcionario = this.activatedRoute.snapshot.data['funcionario'];

    const usuario = this.usuarios.find(u => u.id === (funcionario?.usuario?.id || null));
    const endereco = this.enderecos.find(e => e.id === (funcionario?.endereco?.id || null));

    this.formGroup = this.formBuilder.group({
      id:[(usuario && usuario.id) ? usuario.id : null],
      nome: [(funcionario && funcionario.nome) ? funcionario.nome:'', [Validators.required, Validators.maxLength(60)]],
      cpf: [(funcionario && funcionario.cpf) ? funcionario.cpf:'', [Validators.required, Validators.maxLength(20), Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]],
      email: [(funcionario && funcionario.email) ? funcionario.email:'', [Validators.required, Validators.email, Validators.maxLength(100), Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      telefone: [(funcionario && funcionario.telefone) ? funcionario.telefone:'', [Validators.required, Validators.pattern(/^(\(?\d{2}\)?\s?)?(\d{4,5}-\d{4})$/)]],
      endereco:[(endereco && endereco.id) ? endereco.id : null],
      matricula: [(funcionario && funcionario.matricula) ? funcionario.matricula:'', [Validators.required, Validators.maxLength(10)]],
      usuario:[(usuario && usuario.id) ? usuario.id : null]
    });
  }

  showSnackbarTopPosition(content: any) {
    this.snackBar.open(content, 'fechar', {
      duration: 3000,
      verticalPosition: "top",
      horizontalPosition: "center"
    });
  }

  cancelar() {
    this.router.navigateByUrl('/admin/funcionarios');
  }

  formatCpf() {
    let cpf = this.formGroup.get('cpf')?.value.replace(/\D/g, ''); // Remove qualquer coisa que não seja número
    if (cpf.length <= 3) {
      this.formGroup.get('cpf')?.setValue(cpf);
    } else if (cpf.length <= 6) {
      this.formGroup.get('cpf')?.setValue(cpf.replace(/(\d{3})(\d{0,3})/, '$1.$2'));
    } else if (cpf.length <= 9) {
      this.formGroup.get('cpf')?.setValue(cpf.replace(/(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3'));
    } else {
      this.formGroup.get('cpf')?.setValue(cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4'));
    }
  }

  formatTelefone() {
    let telefone = this.formGroup.get('telefone')?.value.replace(/\D/g, ''); // Remove qualquer coisa que não seja número
    if (telefone.length <= 2) {
      this.formGroup.get('telefone')?.setValue(telefone);
    } else if (telefone.length <= 6) {
      this.formGroup.get('telefone')?.setValue(telefone.replace(/(\d{2})(\d{0,4})/, '($1) $2'));
    } else {
      this.formGroup.get('telefone')?.setValue(telefone.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3'));
    }
  }


  salvar() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const funcionario = this.formGroup.value;

      const operacao = funcionario.id == null
        ? this.funcionarioService.insert(funcionario)
        : this.funcionarioService.update(funcionario);

      operacao.subscribe({
        next: () => this.router.navigateByUrl('/admin/funcionarios'),
        error: (error) => {
          console.log('Erro ao Salvar' + JSON.stringify(error));
          this.tratarErros(error);
        }
      });
    }
  }

  excluir() {
    if (this.formGroup.valid) {
      const funcionario = this.formGroup.value;
      if (funcionario.id != null) {
        this.funcionarioService.delete(funcionario).subscribe({
          next: () => this.router.navigateByUrl('/admin/funcionarios'),
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
      if (errors.hasOwnProperty(errorName) && this.errorMessages[controlName][errorName]) {
        return this.errorMessages[controlName][errorName];
      }
    }
    return 'Campo inválido';
  }

  tratarErros(errorResponse: HttpErrorResponse) {
    if (errorResponse.status === 400 && errorResponse.error?.errors) {
      errorResponse.error.errors.forEach((validationError: any) => {
        const formControl = this.formGroup.get(validationError.fieldName);
        if (formControl) {
          formControl.setErrors({ apiError: validationError.message });
        }
      });
    } else if (errorResponse.status >= 500) {
      alert('Erro interno do servidor.');
    } else {
      alert(errorResponse.error?.message || 'Erro genérico ao enviar o formulário.');
    }
  }

  errorMessages: { [controlName: string]: { [errorName: string]: string } } = {
    nome: {
      required: 'Nome é obrigatório',
      maxlength: 'Nome deve ter no máximo 60 caracteres',
      apiError: ''
    },
    cpf: {
      required: 'CPF é obrigatório',
      maxlength: 'CPF deve ter no máximo 20 caracteres',
      pattern: 'CPF deve seguir o formato 000.000.000-00',
      apiError: ''
    },
    email: {
      required: 'E-mail é obrigatório',
      email: 'E-mail deve ser válido',
      maxlength: 'E-mail deve ter no máximo 100 caracteres',
      pattern: 'E-mail deve ser válido',
      apiError: ''
    },
    telefone: {
      required: 'Telefone é obrigatório',
      pattern: 'Telefone deve seguir o formato (99) 9999-9999 ou (99) 8888-8888',
      apiError: ''
    },
    matricula: {
      required: 'Matrícula é obrigatória',
      maxlength: 'Matrícula deve ter no máximo 10 caracteres',
      apiError: ''
    },
    usuario: {
      required: 'Usuário é obrigatório',
      apiError: ' '
    },
    endereco: {
      required: 'Endereço é obrigatório',
      apiError: ' '
    }
  }
}
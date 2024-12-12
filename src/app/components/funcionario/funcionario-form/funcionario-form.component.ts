import { NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOption } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router } from '@angular/router';
import { Endereco } from '../../../models/endereco.model';
import { Funcionario } from '../../../models/funcionario.model';
import { Usuario } from '../../../models/usuario.model';
import { EnderecoService } from '../../../services/endereco.service';
import { FuncionarioService } from '../../../services/funcionario.service';
import { UsuarioService } from '../../../services/usuario.service';


@Component({
  selector: 'app-funcionario-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatButtonModule, NgIf, MatInputModule, MatCardModule, MatToolbarModule, MatOption],
  templateUrl: './funcionario-form.component.html',
  styleUrl: './funcionario-form.component.css'
})
export class FuncionarioFormComponent implements OnInit{
  formGroup: FormGroup;
  funcionarios: Funcionario[] = [];
  usuarios: Usuario[] = [];
  enderecos: Endereco [] = [];

  constructor(private formBuilder: FormBuilder,
    private funcionarioService: FuncionarioService,
    private usuarioService: UsuarioService,
    private enderecoService: EnderecoService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog) {
      this.formGroup = this.formBuilder.group({
        id: [null],
        nome: ['', Validators.required],
        cpf: ['', Validators.required],
        email: ['', Validators.required],
        telefone: ['', Validators.required],
        endereco:[null],
        matricula: ['', Validators.required],
        usuario:[null]
        }
      )
  }

  ngOnInit(): void {
    this.usuarioService.findAll().subscribe(data1 =>{
      this.usuarios = data1;
      this.initializeForm();
    })
    this.enderecoService.findAll().subscribe(data2 =>{
      this.enderecos = data2;
      this.initializeForm();
    })
  }

  initializeForm(): void{
    const funcionario: Funcionario = this.activatedRoute.snapshot.data['funcionario'];

    //selecionando o usuario
    const usuario = this.usuarios.find(usuario => usuario.id === (funcionario?.usuario?.id || null));
    
    //selecionando o endereco
    const endereco = this.enderecos.find(endereco => endereco.id === (funcionario?.endereco?.id || null));

    this.formGroup = this.formBuilder.group({
      id:[(funcionario && funcionario.id) ? funcionario.id : null],
      nome: [(funcionario && funcionario.nome) ? funcionario.nome : '', Validators.required],
      cpf: [(funcionario && funcionario.cpf) ? funcionario.cpf : '', Validators.required],
      email: [(funcionario && funcionario.email) ? funcionario.email : '', Validators.required],
      endereco:[endereco],
      telefone: [(funcionario && funcionario.telefone) ? funcionario.telefone : '', Validators.required],
      matricula: [(funcionario && funcionario.matricula) ? funcionario.matricula : '', Validators.required],
      usuario:[usuario]
    });
  }


  salvar() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const funcionario = this.formGroup.value;

      // selecionando a operacao (insert ou update)
      const operacao = funcionario.id == null
      ? this.funcionarioService.insert(funcionario)
      : this.funcionarioService.update(funcionario);

      // executando a operacao
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
          next: () => {
            this.router.navigateByUrl('/admin/funcionarios');
          },
          error: (err) => {
            console.log('Erro ao Excluir' + JSON.stringify(err));
          }
        });
      }
    }
  }

  cancelar(){
    this.router.navigateByUrl('/admin/estados');
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

    return 'invalid field';
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

  errorMessages: {[controlName: string]: {[errorName : string]:string }} = {
    nome:{
      required: 'Perfil é obrigatório',
    },
    cpf:{
      required: 'Cpf é obrigatória',
      minLength: 'O tamanho do Cpf é 11 digitos',
      maxLength: 'O tannho do Cpf é 11 digitos',
      apiError: ' '
    },
    Email:{
      required: 'Email é obrigatório',
      apiError: ' '
    },

    Telefone:{
      required: 'Telefone é obrigatório',
      apiError: ' '
    },
    Matricula:{
      required: 'Matricula é obrigatória',
      apiError: ' '
    },
    Usuario:{
      required: 'Usuario é obrigatório',
      apiError: ' '
    }
  }
}
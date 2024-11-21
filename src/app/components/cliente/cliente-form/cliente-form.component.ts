import { NgFor, NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Cliente } from '../../../models/cliente.model';
import { Endereco } from '../../../models/endereco.model';
import { Usuario } from '../../../models/usuario.model';
import { ClienteService } from '../../../services/cliente.service';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule,
    RouterModule, MatSelectModule, MatIcon],
  templateUrl: './cliente-form.component.html',
  styleUrl: './cliente-form.component.css'
})

export class ClienteFormComponent {
  formGroup: FormGroup;
  usuarios: Usuario[] = [];
  enderecos: Endereco []=[];


  constructor(private formBuilder: FormBuilder,
    private clienteService: ClienteService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog) {
      this.formGroup = this.formBuilder.group({
        id:[null],
        nome:['', Validators.required],
        cpf: ['', Validators.required],
        email: ['', Validators.required],
        numeroRegistro_posse_porte: ['', Validators.required],
        telefones: this.formBuilder.array([]), // FormArray para telefones
        enderecos: this.formBuilder.array([]), // FormArray para endereços
        login: ['', Validators.required],
        senha: ['', Validators.required],
      })
  }

  get telefones(): FormArray {
    return this.formGroup.get('telefones') as FormArray;
  }

  get enderecosArray(): FormArray {
    return this.formGroup.get('enderecos') as FormArray;
  }

      initializeForm(): void {
        const cliente: Cliente = this.activatedRoute.snapshot.data['cliente'];
        
      //selecionando o usuario
      //const usuario = this.usuarios.find(usuario => usuario.id === (cliente?.usuario?.id || null));

        this.formGroup.patchValue({
          id: cliente?.id || null,
          nome: cliente?.nome || '',
          cpf: cliente?.cpf || '',
          email: cliente?.email || '',
          numeroRegistro_posse_porte: cliente?.numeroRegistro_posse_porte || '',
          login: cliente?.usuario?.login || '',
        });
        
        
        // Inicializa os telefones
        cliente?.telefones?.forEach((telefone) => this.adicionarTelefone(telefone));
    
        // Inicializa os endereços
        cliente?.enderecos?.forEach((endereco) => this.adicionarEndereco(endereco));
      }
    
      // Adicionar um telefone ao FormArray
      adicionarTelefone(telefone: string = ''): void {
        this.telefones.push(
          this.formBuilder.control(telefone, [Validators.required, Validators.minLength(10)])
        );
      }
    
      // Remover um telefone pelo índice
      removerTelefone(index: number): void {
        this.telefones.removeAt(index);
      }
    
      // Adicionar um endereço ao FormArray
      adicionarEndereco(endereco: Partial<Endereco> = {}): void {
        this.enderecosArray.push(
          this.formBuilder.group({
            nome: [endereco.nome || '', Validators.required],
            logradouro: [endereco.logradouro || '', Validators.required],
            numero: [endereco.numero || '', Validators.required],
            complemento: [endereco.complemento || ''],
            bairro: [endereco.bairro || '', Validators.required],
            cep: [endereco.cep || '', Validators.required],
            cidade: [endereco.cidade || '', Validators.required],
            estado: [endereco.estado || '', Validators.required],
          })
        );
      }
    
      // Remover um endereço pelo índice
      removerEndereco(index: number): void {
        this.enderecosArray.removeAt(index);
      }
    

  salvar() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const cliente = this.formGroup.value;

      // selecionando a operacao (insert ou update)
      const operacao = cliente.id == null
      ? this.clienteService.insert(cliente)
      : this.clienteService.update(cliente);

      // executando a operacao
      operacao.subscribe({
        next: () => this.router.navigateByUrl('/admin/clientes'),
        error: (error) => {
          console.log('Erro ao Salvar' + JSON.stringify(error));
          this.tratarErros(error);
        }
      });
    }
  }

  excluir() {
    if (this.formGroup.valid) {
      const cliente = this.formGroup.value;
      if (cliente.id != null) {
        this.clienteService.delete(cliente).subscribe({
          next: () => {
            this.router.navigateByUrl('/admin/clientes');
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


errorMessages: { [controlName: string]: { [errorName: string]: string } } = {
  // Campos do Cliente
  nome: {
    required: 'O nome é obrigatório.',
    apiError: '',
  },
  cpf: {
    required: 'O CPF é obrigatório.',
    minlength: 'O CPF deve ter 11 dígitos.',
    maxlength: 'O CPF deve ter 11 dígitos.',
    pattern: 'O CPF está em um formato inválido.',
    apiError: '',
  },
  email: {
    required: 'O e-mail é obrigatório.',
    pattern: 'O e-mail deve estar em um formato válido.',
    apiError: '',
  },
  telefone: {
    required: 'O telefone é obrigatório.',
    pattern: 'O telefone deve estar em um formato válido.',
    apiError: '',
  },
  numeroRegistro_posse_porte: {
    required: 'O número de registro é obrigatório.',
    apiError: '',
  },
  login: {
    required: 'O login é obrigatório.',
    apiError: '',
  },
  senha: {
    required: 'A senha é obrigatória.',
    minlength: 'A senha deve ter pelo menos 6 caracteres.',
    apiError: '',
  },

  // Campos de Endereço
  endereco_nome: {
    required: 'O nome do endereço é obrigatório.',
    apiError: '',
  },
  endereco_logradouro: {
    required: 'O logradouro é obrigatório.',
    apiError: '',
  },
  endereco_numero: {
    required: 'O número do endereço é obrigatório.',
    apiError: '',
  },
  endereco_complemento: {
    required: 'O complemento do endereço é obrigatório.',
    apiError: '',
  },
  endereco_bairro: {
    required: 'O bairro é obrigatório.',
    apiError: '',
  },
  endereco_cep: {
    required: 'O CEP é obrigatório.',
    pattern: 'O CEP deve estar no formato válido (Ex: 00000-000).',
    apiError: '',
  },
  endereco_cidade: {
    required: 'A cidade é obrigatória.',
    apiError: '',
  },
  endereco_estado: {
    required: 'O estado é obrigatório.',
    apiError: '',
  },
};

}
import { NgFor, NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Cliente } from '../../../models/cliente.model';
import { Endereco } from '../../../models/endereco.model';
import { Usuario } from '../../../models/usuario.model';
import { ClienteService } from '../../../services/cliente.service';
import { EnderecoService } from '../../../services/endereco.service';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule,
    RouterModule, MatSelectModule, MatStepperModule],
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.css']
})
export class ClienteFormComponent {
  formGroup: FormGroup;
  usuarios: Usuario[] = [];
  enderecos: Endereco[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private clienteService: ClienteService,
    private usuarioService: UsuarioService,
    private enderecoService: EnderecoService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.formGroup = this.formBuilder.group({
      id: [null],
      nome: ['', [Validators.required]],
      cpf: ['', [Validators.required, Validators.pattern(/\d{3}\.\d{3}\.\d{3}-\d{2}/)]],
      email: ['', [Validators.required, Validators.email]],
      registro: ['', [Validators.required]],
      telefones: [null, Validators.required],
      enderecos: [null, Validators.required],
      login: ['', [Validators.required]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
    });
  }


  ngOnInit(): void {
    this.usuarioService.findAll().subscribe((data) => {
      this.usuarios = data;
    });
    this.enderecoService.findAll().subscribe((data) => {
      this.enderecos = data;
    });
    this.initializeForm();
  }


  initializeForm(): void {
    const cliente: Cliente = this.activatedRoute.snapshot.data['cliente'];

    this.formGroup.patchValue({
      id: cliente?.id || null,
      nome: cliente?.nome || '',
      cpf: cliente?.cpf || '',
      email: cliente?.email || '',
      telefones: '',
      enderecos: '',
      registro: cliente?.registro || '',
      login: cliente?.usuario?.login || '',
      senha: cliente?.usuario?.senha || '',
    });


  }

  createTelefoneGroup(telefone: string = ''): FormGroup {
    return this.formBuilder.group({
      numero: [telefone, [Validators.required, Validators.pattern(/\(\d{2}\) \d{4,5}-\d{4}/)]],
    });
  }

  createEnderecoGroup(endereco: Partial<Endereco> = {}): FormGroup {
    return this.formBuilder.group({
      nome: [endereco.nome || '', Validators.required],
      logradouro: [endereco.logradouro || '', Validators.required],
      numero: [endereco.numero || '', Validators.required],
      complemento: [endereco.complemento || ''],
      bairro: [endereco.bairro || '', Validators.required],
      cep: [endereco.cep || '', [Validators.required, Validators.pattern(/\d{5}-\d{3}/)]],
      cidade: [endereco.cidade || '', Validators.required],
      estado: [endereco.estado || '', Validators.required],
    });
  }

  addTelefone(): void {
    (this.formGroup.get('telefones') as FormArray).push(this.createTelefoneGroup());
  }

  removeTelefone(index: number): void {
    (this.formGroup.get('telefones') as FormArray).removeAt(index);
  }

  addEndereco(): void {
    (this.formGroup.get('enderecos') as FormArray).push(this.createEnderecoGroup());
  }

  removeEndereco(index: number): void {
    (this.formGroup.get('enderecos') as FormArray).removeAt(index);
  }

  formatCpf(): void {
    const cpfControl = this.formGroup.get('cpf');
    if (cpfControl && cpfControl.value) {
      const formattedCpf = cpfControl.value.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      cpfControl.setValue(formattedCpf);
    }
  }

  formatTelefone(): void {
    const telefoneControl = this.formGroup.get('telefone');
    if (telefoneControl) {
      let telefone = telefoneControl.value.replace(/\D/g, '');
      if (telefone.length <= 2) {
        telefoneControl.setValue(telefone);
      } else if (telefone.length <= 6) {
        telefoneControl.setValue(telefone.replace(/(\d{2})(\d{0,4})/, '($1) $2'));
      } else {
        telefoneControl.setValue(telefone.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3'));
      }
    }
  } 
  
  cancelar() {
    this.router.navigateByUrl('/admin/clientes');
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
            formControl.setErrors({ apiError: validationError.message })
          }

        });
      }
    } else if (errorResponse.status < 400) {
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
    registro: {
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
import { CommonModule, NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Cliente } from '../../../models/cliente.model';
import { ClienteCadastro } from '../../../models/clienteCadastro';
import { CepService } from '../../../services/cep.service';
import { ClienteService } from '../../../services/cliente.service';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule,
    RouterModule, MatSelectModule, MatIcon, MatStepperModule, CommonModule],
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.css']
})

export class ClienteCadastroFormComponent {
  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private clienteService: ClienteService,
    private cepService: CepService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.formGroup = this.formBuilder.group({
      firstFormGroup: this.formBuilder.group({
        nome: ['', Validators.required],
        cpf: ['', [Validators.required, Validators.pattern(/\d{3}\.\d{3}\.\d{3}-\d{2}/)]],
        email: ['', [Validators.required, Validators.email]],
        registro: ['', Validators.required],
        telefone: ['', [Validators.required, Validators.pattern(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/)]],
      }),
      secondFormGroup: this.formBuilder.group({
        enderecoLogradouro: ['', Validators.required],
        enderecoNumero: ['', [Validators.required, Validators.maxLength(10)]],
        enderecoBairro: ['', Validators.required],
        enderecoNome: ['', Validators.required],
        enderecoComplemento: ['', Validators.required],
        enderecoCep: ['', [Validators.required, , Validators.maxLength(9)]],
        enderecoCidade: ['', Validators.required],
        enderecoEstado: ['', Validators.required],
      }),
      thirdFormGroup: this.formBuilder.group({
        login: ['', Validators.required],
        senha: ['', [Validators.required, Validators.minLength(6)]],
      }),
    });

  }

  preencherDadosCliente(): ClienteCadastro{
    let cliente: ClienteCadastro = {} as ClienteCadastro;
    cliente.nome = this.formGroup.get('firstFormGroup')?.get('nome')?.value;
    cliente.cpf = this.formGroup.get('firstFormGroup')?.get('cpf')?.value;
    cliente.email = this.formGroup.get('firstFormGroup')?.get('email')?.value;
    cliente.registro = this.formGroup.get('firstFormGroup')?.get('registro')?.value;
    cliente.telefone = this.formGroup.get('firstFormGroup')?.get('telefone')?.value;

    cliente.enderecoLogradouro = this.formGroup.get('secondFormGroup')?.get('enderecoLogradouro')?.value;
    cliente.enderecoBairro = this.formGroup.get('secondFormGroup')?.get('enderecoBairro')?.value;
    cliente.enderecoNome = this.formGroup.get('secondFormGroup')?.get('enderecoNome')?.value;
    cliente.enderecoNumero = this.formGroup.get('secondFormGroup')?.get('enderecoNumero')?.value;
    cliente.enderecoComplemento = this.formGroup.get('secondFormGroup')?.get('enderecoComplemento')?.value;
    cliente.enderecoCep = this.formGroup.get('secondFormGroup')?.get('enderecoCep')?.value;
    cliente.enderecoCidade = this.formGroup.get('secondFormGroup')?.get('enderecoCidade')?.value;
    cliente.enderecoEstado = this.formGroup.get('secondFormGroup')?.get('enderecoEstado')?.value;

    cliente.login = this.formGroup.get('thirdFormGroup')?.get('login')?.value;
    cliente.senha = this.formGroup.get('thirdFormGroup')?.get('senha')?.value;

    return cliente;
  }

  // Inicialização do formulário com os dados do cliente
  initializeForm(): void {
    const cliente: Cliente = this.activatedRoute.snapshot.data['cliente'];

    if (cliente) {
      this.formGroup.patchValue({
        id: cliente.id || null,
        nome: cliente.nome || '',
        cpf: cliente.cpf || '',
        email: cliente.email || '',
        registro: cliente.registro || '',
        login: cliente.usuario?.login || '',
      });
    }
  }

  formatCpf() {
    const cpfControl = this.formGroup.get('firstFormGroup')?.get('cpf');
    if (cpfControl && cpfControl.value) {
      const formattedCpf = cpfControl.value.replace(/\D/g, '') // Remove não dígitos
        .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      cpfControl.setValue(formattedCpf);
    }
  }

  formatTelefone() {
    let telefone = this.formGroup.get('firstFormGroup')?.get('telefone')?.value.replace(/\D/g, ''); // Remove qualquer coisa que não seja número
    if (telefone.length <= 2) {
      this.formGroup.get('firstFormGroup')?.get('telefone')?.setValue(telefone);
    } else if (telefone.length <= 6) {
      this.formGroup.get('firstFormGroup')?.get('telefone')?.setValue(telefone.replace(/(\d{2})(\d{0,4})/, '($1) $2'));
    } else {
      this.formGroup.get('firstFormGroup')?.get('telefone')?.setValue(telefone.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3'));
    }
  }

  cancelar() {

    this.router.navigateByUrl('/login');
  }

  salvar() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) { 
      let cliente: ClienteCadastro = this.preencherDadosCliente();
      console.log("cadastro cliente: " + cliente)
      // Determina se é uma operação de inserção ou atualização
      /*
      const operacao = cliente.id == null
        ? this.clienteService.insert(cliente)
        : this.clienteService.update(cliente)
      */

        this.clienteService.insertClienteCadastro(cliente).subscribe({
        next: () => {
          this.router.navigateByUrl('/ecommerce')
        },
        error: (error) => {
          console.log('Erro ao Salvar: ' + JSON.stringify(error));
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
            this.router.navigateByUrl('/ecommerce');
          },
          error: (err) => {
            console.log('Erro ao Excluir: ' + JSON.stringify(err));
          }
        });
      }
    }
  }

  getErrorMessage(controlName: string, errors: ValidationErrors | null | undefined): string {
    if (!errors) {
      return ''; // Nenhum erro encontrado
    }

    for (const errorName in errors) {
      if (errors.hasOwnProperty(errorName) && this.errorMessages[controlName]?.[errorName]) {
        return this.errorMessages[controlName][errorName];
      }
    }

    return 'Campo inválido'; // Retorno padrão para erros não tratados
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
    } else if (errorResponse.status < 400) {
      alert(errorResponse.error?.message || 'Erro genérico do envio do formulário.');
    } else if (errorResponse.status >= 500) {
      alert('Erro interno do servidor.');
    }
  }

  
  preencherEnderecoPeloCep() {
    let cep: string = this.formGroup.get('secondFormGroup')?.get('enderecoCep')?.value;

    this.cepService.getEnderecoByCep(cep).subscribe({
      next: (enderecoViaCep) => {
        this.formGroup.get('secondFormGroup')?.get('enderecoLogradouro')?.setValue(enderecoViaCep.logradouro);
        this.formGroup.get('secondFormGroup')?.get('enderecoBairro')?.setValue(enderecoViaCep.bairro);
        this.formGroup.get('secondFormGroup')?.get('enderecoCidade')?.setValue(enderecoViaCep.localidade);
        this.formGroup.get('secondFormGroup')?.get('enderecoEstado')?.setValue(enderecoViaCep.estado);
      },
      error: (err) => {
        console.log('Erro ao preencher cep: ' + JSON.stringify(err));
      }
    });
  }

  errorMessages: { [controlName: string]: { [errorName: string]: string } } = {
    // Erros de validação para cada campo
    nome: {
      required: 'O nome é obrigatório.',
      apiError: '',
    },
    cpf: {
      required: 'O CPF é obrigatório.', minlength: 'O CPF deve ter 11 dígitos.', maxlength: 'O CPF deve ter 11 dígitos.',
      pattern: 'CPF deve seguir o formato 000.000.000-00',
      apiError: '',
    },
    email: {
      required: 'O e-mail é obrigatório.', pattern: 'O e-mail deve estar em um formato válido.',
      apiError: '',
    },
    telefone: {
      required: 'Telefone é obrigatório',
      pattern: 'Telefone deve seguir o formato (99) 9999-9999 ou (99) 8888-8888',
      apiError: ''
    },
    login: {
      required: 'O login é obrigatório.',
      apiError: '',
    },
    senha: {
      required: 'A senha é obrigatória.', minlength: 'A senha deve ter pelo menos 6 caracteres.',
      apiError: '',
    },
    enderecoNome: {
      required: 'O nome do endereço é obrigatório.',
      apiError: '',
    },
    enderecoLogradouro: {
      required: 'O logradouro é obrigatório.',
      apiError: '',
    },
    enderecoNumero: {
      required: 'O Número é obrigatório.',
      maxLength: 'O tamanho máximo do número é 10 caracteres',
      apiError: '',
    },
    enderecoCep: {
      required: 'O CEP é obrigatório.',
      maxLength: 'O tamanho máximo é 9 caracteres',
      apiError: '',
    },
    enderecoBairro: {
      required: 'O bairro é obrigatório.',
      apiError: '',
    },
    enderecoCidade: {
      required: 'A cidade é obrigatória.',
      apiError: '',
    },
    enderecoEstado: {
      required: 'O estado é obrigatório.',
      apiError: '',
    }
  };
}

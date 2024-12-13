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
import { MatStepperModule } from '@angular/material/stepper';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
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
    RouterModule, MatSelectModule, MatIcon, MatStepperModule, BrowserModule],
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.css']
})

export class ClienteFormComponent {
  formGroup: FormGroup;
  usuarios: Usuario[] = [];
  enderecos: Endereco[] = [];

  constructor(private formBuilder: FormBuilder,
              private clienteService: ClienteService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private dialog: MatDialog) {
    this.formGroup = this.formBuilder.group({
      firstFormGroup: this.formBuilder.group({
        id: [null],
        nome: ['', Validators.required],
        cpf: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(14)]],
        email: ['', [Validators.required, Validators.email]],
        telefones: this.formBuilder.array([this.createTelefone()]), // Garantir pelo menos 1 telefone
      }),
      secondFormGroup: this.formBuilder.group({
        enderecos: this.formBuilder.array([this.createEndereco()]), // Garantir pelo menos 1 endereço
      }),
      thirdFormGroup: this.formBuilder.group({
        login: ['', Validators.required],
        senha: ['', [Validators.required, Validators.minLength(6)]],
      })
    });
  }

  get telefones(): FormArray {
    return this.formGroup.get('firstFormGroup.telefones') as FormArray;
  }

  get enderecosArray(): FormArray {
    return this.formGroup.get('secondFormGroup.enderecos') as FormArray;
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

      // Adiciona telefones e endereços, garantindo que os controles existam
      const telefones = cliente.telefones || [];
      telefones.forEach(telefone => this.adicionarTelefone(telefone));

      const enderecos = cliente.enderecos || [];
      enderecos.forEach(endereco => this.adicionarEndereco(endereco));
    } else {
      this.formGroup.reset();
    }
  }

  // Adicionar um telefone ao FormArray
  adicionarTelefone(telefone: string = ''): void {
    this.telefones.push(
      this.formBuilder.control(telefone, [Validators.required, Validators.minLength(10)])
    );
  }

  // Remover um telefone pelo índice
  removerTelefone(index: number): void {
    if (this.telefones) {
      this.telefones.removeAt(index);
    }
  }

  // Adicionar um endereço ao FormArray
  adicionarEndereco(endereco: Partial<Endereco> = {}): void {
    if (this.enderecosArray) {
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
  }

  // Remover um endereço pelo índice
  removerEndereco(index: number): void {
    if (this.enderecosArray) {
      this.enderecosArray.removeAt(index);
    }
  }

  formatCpf() {
    const cpfControl = this.formGroup.get('firstFormGroup.cpf');
    if (cpfControl && cpfControl.value) {
      const formattedCpf = cpfControl.value.replace(/\D/g, '') // Remove não dígitos
        .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      cpfControl.setValue(formattedCpf);
    }
  }

  // Criação de um telefone com validação
  createTelefone(): FormGroup {
    return this.formBuilder.group({
      numero: ['', [Validators.required, Validators.pattern(/^(\(?\d{2}\)?\s?)?(\d{4,5}-\d{4})$/)]],
    });
  }

  // Criação de um endereço com validação
  createEndereco(): FormGroup {
    return this.formBuilder.group({
      logradouro: ['', Validators.required],
      numero: ['', Validators.required],
      complemento: [''],
      bairro: ['', Validators.required],
      cep: ['', [Validators.required, Validators.pattern('\\d{5}-\\d{3}')]],  // Validação para o formato de CEP
      cidade: ['', Validators.required],
      estado: ['', Validators.required],
    });
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

  cancelar() {
    this.router.navigateByUrl('/admin/clientes');
  }

  salvar() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const cliente = this.formGroup.value;

      // Determina se é uma operação de inserção ou atualização
      const operacao = cliente.id == null
        ? this.clienteService.insert(cliente)
        : this.clienteService.update(cliente);

      operacao.subscribe({
        next: () => this.router.navigateByUrl('/admin/clientes'),
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
            this.router.navigateByUrl('/admin/clientes');
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

  errorMessages: { [controlName: string]: { [errorName: string]: string } } = {
    // Erros de validação para cada campo
    nome: { required: 'O nome é obrigatório.' },
    cpf: { required: 'O CPF é obrigatório.', minlength: 'O CPF deve ter 11 dígitos.', maxlength: 'O CPF deve ter 11 dígitos.' },
    email: { required: 'O e-mail é obrigatório.', pattern: 'O e-mail deve estar em um formato válido.' },
    login: { required: 'O login é obrigatório.' },
    senha: { required: 'A senha é obrigatória.', minlength: 'A senha deve ter pelo menos 6 caracteres.' },
    endereco_nome: { required: 'O nome do endereço é obrigatório.' },
    endereco_logradouro: { required: 'O logradouro é obrigatório.' },
    endereco_cep: { required: 'O CEP é obrigatório.', pattern: 'O CEP deve estar no formato válido.' },
    endereco_bairro: { required: 'O bairro é obrigatório.' },
    endereco_cidade: { required: 'A cidade é obrigatória.' },
    endereco_estado: { required: 'O estado é obrigatório.' }
  };
}

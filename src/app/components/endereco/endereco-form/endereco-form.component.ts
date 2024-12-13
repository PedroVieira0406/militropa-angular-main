import { NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Endereco } from '../../../models/endereco.model';
import { EnderecoService } from '../../../services/endereco.service';

@Component({
  selector: 'app-endereco-form',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule,
    RouterModule, MatSelectModule],
  templateUrl: './endereco-form.component.html',
  styleUrl: './endereco-form.component.css'
})

export class EnderecoFormComponent {
  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private enderecoService: EnderecoService,
    private router: Router,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute) {
    this.formGroup = this.formBuilder.group({
      id: [null],
      nome: ['', [Validators.required, Validators.maxLength(60)]],
      logradouro: ['', [Validators.required, Validators.maxLength(60)]],
      numero: ['', [Validators.required, Validators.maxLength(5)]],
      complemento: ['', [Validators.required, Validators.maxLength(50)]],
      bairro: ['', [Validators.required, Validators.maxLength(120)]],
      cep: ['', [Validators.required, Validators.maxLength(9)]],
      cidade: ['', [Validators.required, Validators.maxLength(60)]],
      estado: ['', [Validators.required, Validators.maxLength(60)]]
    })
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    const endereco: Endereco = this.activatedRoute.snapshot.data['endereco'];

    //selecionando o estasdo
    //    const estado = this.enderecos.find(estado => estado.id === (municipio?.estado?.id || null));

    this.formGroup.patchValue({
      id: endereco?.id || null,
      nome: endereco?.nome || '',
      logradouro: endereco?.logradouro || '',
      numero: endereco?.numero || '',
      complemento: endereco?.complemento || '',
      bairro: endereco?.bairro || '',
      cep: endereco?.cep || '',
      cidade: endereco?.cidade || '',
      estado: endereco?.estado || ''
    });
  }

  cancelar() {
    this.router.navigateByUrl('/admin/enderecos');
  }

  showSnackbarTopPosition(content: any) {
    this.snackBar.open(content, 'fechar', {
      duration: 3000,
      verticalPosition: "top",
      horizontalPosition: "center"
    });
  }

  salvar(): void {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const endereco = this.formGroup.value;
      const operacao = endereco.id
        ? this.enderecoService.update(endereco)
        : this.enderecoService.insert(endereco);

      operacao.subscribe({
        next: () => this.router.navigateByUrl('/admin/enderecos'),
        error: (error) => this.tratarErros(error)
      });
    } else {
      this.showSnackbarTopPosition('Preencha todos os campos obrigatórios.');
    }
  }
  excluir() {
    if (this.formGroup.valid) {
      const id = this.formGroup.get('id')?.value;
      if (id) {
        this.enderecoService.delete(id).subscribe({
          next: () => this.router.navigateByUrl('/admin/enderecos'),
          error: (err) => {
            console.error('Erro ao excluir:', err);
          }
        });
      } else {
        console.error('ID do endereço não encontrado ou inválido.');
      }
    }
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

  errorMessages: { [controlName: string]: { [errorName: string]: string } } = {
    nome: {
      required: 'Nome é obrigatório',
      maxlength: 'Nome deve ter no máximo 60 caracteres',
      apiError: ''
    },
    logradouro: {
      required: 'Logradouro é obrigatório',
      maxlength: 'Logradouro deve ter no máximo 60 caracteres',
      apiError: ''
    },
    numero: {
      required: 'Número é obrigatório',
      maxlength: 'Número deve ter no máximo 5 caracteres',
      apiError: ''
    },
    complemento: {
      required: 'Complemento é obrigatório',
      maxlength: 'Complemento deve ter no máximo 50 caracteres',
      apiError: ''
    },
    bairro: {
      required: 'Bairro é obrigatório',
      maxlength: 'Bairro deve ter no máximo 120 caracteres',
      apiError: ''
    },
    cep: {
      required: 'CEP é obrigatório',
      maxlength: 'CEP deve ter no máximo 9 caracteres',
      apiError: ''
    },
    cidade: {
      required: 'Cidade é obrigatória',
      maxlength: 'Cidade deve ter no máximo 60 caracteres',
      apiError: ''
    },
    estado: {
      required: 'Estado é obrigatório',
      maxlength: 'Estado deve ter no máximo 60 caracteres',
      apiError: ''
    }
  };
}
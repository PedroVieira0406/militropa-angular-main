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
        id:[null],
        nome:['', Validators.required],
        logradouro: ['', Validators.required],
        numero: ['', Validators.required],
        complemento: ['', Validators.required],
        bairro: ['', Validators.required],
        cep: ['', Validators.required],
        cidade: ['', Validators.required],
        estado: ['', Validators.required]
      }) 
  }

  initializeForm(): void{
    const endereco: Endereco = this.activatedRoute.snapshot.data['endereco'];

    //selecionando o estasdo
//    const estado = this.enderecos.find(estado => estado.id === (municipio?.estado?.id || null));

    this.formGroup = this.formBuilder.group({
      id:[(endereco && endereco.id) ? endereco.id : null],
      nome: [(endereco && endereco.nome) ? endereco.nome : '', Validators.required],
      logradouro: [(endereco && endereco.logradouro) ? endereco.logradouro : '', Validators.required],
      numero: [(endereco && endereco.numero) ? endereco.numero : '', Validators.required],
      complemento: [(endereco && endereco.complemento) ? endereco.complemento : '', Validators.required],
      bairro: [(endereco && endereco.bairro) ? endereco.bairro : '', Validators.required],
      cep: [(endereco && endereco.cep) ? endereco.cep : '', Validators.required],
      cidade: [(endereco && endereco.cidade) ? endereco.cidade : '', Validators.required],
      estado: [(endereco && endereco.estado) ? endereco.estado : '', Validators.required]
    });
  }

  onSubmit() {
    if (this.formGroup.valid) {
      const novoEndereco = this.formGroup.value;
      this.enderecoService.insert(novoEndereco).subscribe({
        next: (enderecoCadastrado) => {
          this.router.navigateByUrl('/enderecos');
        },
        error: (err) => {
          console.log('Erro ao salvar', + JSON.stringify(err));
        }
      })
    }
  }

  cancelar(){
    this.router.navigateByUrl('/admin/enderecos');
  }

  showSnackbarTopPosition(content: any) {
    this.snackBar.open(content, 'fechar', {
      duration: 3000,
      verticalPosition: "top",
      horizontalPosition: "center"
    });
  }


  
  salvar() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const endereco = this.formGroup.value;

      const operacao = endereco.id == null
        ? this.enderecoService.insert(endereco)
        : this.enderecoService.update(endereco);

      operacao.subscribe({
        next: () => this.router.navigateByUrl('/admin/enderecos'),
        error: (error) => {
          console.log('Erro ao Salvar' + JSON.stringify(error));
          this.tratarErros(error);
        }
      });
    }
  }
excluir() {
    if (this.formGroup.valid) {
      const endereco = this.formGroup.value;
      if (endereco.id != null) {
        this.enderecoService.delete(endereco).subscribe({
          next: () => this.router.navigateByUrl('/admin/enderecos'),
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
      required: 'NOME é obrigatório',
      apiError: ' '
    },
    logradouro: {
      required: 'Logradouro é obrigatório',
      apiError: ' '
    },
    numero: {
      required: 'Numero é obrigatório',
      apiError: ' '
    },
    bairro: {
      required: 'Bairro é obrigatória',
      apiError: ' '
    },
    cep: {
      required: 'Cep é obrigatório',
      apiError: ' '
    },
    cidade: {
      required: 'Cidade é obrigatória',
      apiError: ' '
    },
    estado: {
      required: 'Estado é obrigatório',
      apiError: ' '
    },
  }
}
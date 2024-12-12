import { NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Acabamento } from '../../../models/acabamento.model';
import { AcabamentoService } from '../../../services/acabamento.service';

@Component({
  selector: 'app-acabamento-form',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule,
    RouterModule, MatSelectModule],
  templateUrl: './acabamento-form.component.html',
  styleUrl: './acabamento-form.component.css'
})
export class AcabamentoFormComponent implements OnInit{

  formGroup: FormGroup;
  acabamentos: Acabamento[] = [];

  constructor(private formBuilder: FormBuilder,
    private acabamentoService: AcabamentoService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {

    //inicializando
    this.formGroup = this.formBuilder.group({
      id:[null],
      nome:['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.acabamentoService.findAll().subscribe(data =>{
      this.acabamentos = data;
      this.initializeForm();
    })
  }

  initializeForm(): void{
    const acabamento: Acabamento = this.activatedRoute.snapshot.data['acabamento'];

    this.formGroup = this.formBuilder.group({
      id:[(acabamento && acabamento.id) ? acabamento.id : null],
      nome: [(acabamento && acabamento.nome) ? acabamento.nome : '', Validators.required],
    });
  }

  salvar() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const acabamento = this.formGroup.value;

      // selecionando a operacao (insert ou update)
      const operacao = acabamento.id == null
      ? this.acabamentoService.insert(acabamento)
      : this.acabamentoService.update(acabamento);

      // executando a operacao
      operacao.subscribe({
        next: () => this.router.navigateByUrl('/admin/acabamentos'),
        error: (error) => {
          console.log('Erro ao Salvar' + JSON.stringify(error));
          this.tratarErros(error);
        }
      });

      console.log('Dados enviados:', acabamento);

    }
    
  }

  excluir() {
    if (this.formGroup.valid) {
      const acabamento = this.formGroup.value;
      if (acabamento.id != null) {
        this.acabamentoService.delete(acabamento).subscribe({
          next: () => {
            this.router.navigateByUrl('/admin/acabamentos');
          },
          error: (err) => {
            console.log('Erro ao Excluir' + JSON.stringify(err));
          }
        });
      }
    }
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

  cancelar(){
    this.router.navigateByUrl('/admin/acabamentos');
  }

  errorMensages: { [controlName: string]: { [errorName: string]: string } } = {
    nome: {
        required: 'Nome é obrigatório',
        apiError: '',
    }
  }
}

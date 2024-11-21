import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Acabamento } from '../../../models/acabamento.model';
import { ArmaService } from '../../../services/arma.service';
import { AcabamentoService } from '../../../services/acabamento.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';

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
      material:['', Validators.required],
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
      material: [(acabamento && acabamento.label) ? acabamento.label : '', Validators.required],
    });
  }

  salvar() {
    if (this.formGroup.valid) {
      const acabamento = this.formGroup.value;
      if (acabamento.id ==null) {
        this.acabamentoService.insert(acabamento).subscribe({
          next: (grupoCadastrado) => {
            this.router.navigateByUrl('/acabamentos');
          },
          error: (err) => {
            console.log('Erro ao Incluir' + JSON.stringify(err));
          }
        });
      } else {
        this.acabamentoService.update(acabamento).subscribe({
          next: (acabamentoAlterado) => {
            this.router.navigateByUrl('/acabamentos');
          },
          error: (err) => {
            console.log('Erro ao Editar' + JSON.stringify(err));
          }
        });
      }
    }
  }

  excluir() {
    if (this.formGroup.valid) {
      const arma = this.formGroup.value;
      if (arma.id != null) {
        this.acabamentoService.delete(arma).subscribe({
          next: () => {
            this.router.navigateByUrl('/acabamentos');
          },
          error: (err) => {
            console.log('Erro ao Excluir' + JSON.stringify(err));
          }
        });
      }
    }
  }

}

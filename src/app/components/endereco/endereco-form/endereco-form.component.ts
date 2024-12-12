import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
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
    this.router.navigateByUrl('/admin/estados');
  }

  
  salvar() {
    if (this.formGroup.valid) {
      const endereco = this.formGroup.value;
      if (endereco.id ==null) {
        this.enderecoService.insert(endereco).subscribe({
          next: (enderecoCadastrado) => {
            this.router.navigateByUrl('/enderecos');
          },
          error: (err) => {
            console.log('Erro ao Incluir' + JSON.stringify(err));
          }
        });
      } else {
        this.enderecoService.update(endereco).subscribe({
          next: (enderecoAlterado) => {
            this.router.navigateByUrl('/enderecos');
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
      const endereco = this.formGroup.value;
      if (endereco.id != null) {
        this.enderecoService.delete(endereco).subscribe({
          next: () => {
            this.router.navigateByUrl('/enderecos');
          },
          error: (err) => {
            console.log('Erro ao Excluir' + JSON.stringify(err));
          }
        });
      }
    }
  }


}
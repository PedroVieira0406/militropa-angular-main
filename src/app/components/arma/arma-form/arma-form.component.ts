import { Location, NgFor, NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Acabamento } from '../../../models/acabamento.model';
import { Arma } from '../../../models/arma.model';
import { TipoArma } from '../../../models/tipoArma.model';
import { AcabamentoService } from '../../../services/acabamento.service';
import { ArmaService } from '../../../services/arma.service';

@Component({
  selector: 'app-arma-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule,
    RouterModule, MatSelectModule, MatIcon, NgIf,
    MatIconModule, FormsModule, NgFor,],
  templateUrl: './arma-form.component.html',
  styleUrl: './arma-form.component.css'
})
export class ArmaFormComponent implements OnInit {

  formGroup: FormGroup;
  armas: Arma[] = [];
  acabamentos: Acabamento[] = [];
  tipoArmas: TipoArma[] = [];

  fileName: string = '';
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(private formBuilder: FormBuilder,
    private armaService: ArmaService,
    private acabamentoService: AcabamentoService,
    private snackBar: MatSnackBar,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location) {

    //inicializando
    this.formGroup = this.formBuilder.group({
      id: [null],
      nome: ['', Validators.required],
      qtdNoEstoque: ['', Validators.required],
      preco: ['', Validators.required],
      descricao: ['', Validators.required],
      tipoArma: [null, Validators.required],
      marca: ['', Validators.required],
      idsAcabamentos: [null , Validators.required],
      calibre: ['', Validators.required],
      comprimentoDoCano: ['', Validators.required],
      capacidadeDeTiro: ['', Validators.required],
      numeroSigma: ['', Validators.required],
      numeroDaArma: ['', Validators.required],
      modelo: ['', Validators.required],
      rna: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.armaService.findTipoArmas().subscribe(data => {
      this.tipoArmas = data;
    });
    this.acabamentoService.findAll().subscribe(data => {
      this.acabamentos = data;
    })
    this.initializeForm();
  }

  initializeForm(): void {
    const arma: Arma = this.activatedRoute.snapshot.data['arma'];

    // carregando a imagem do preview
    if (arma && arma.nomeImagem) {
      this.imagePreview = this.armaService.getUrlImage(arma.nomeImagem);
      this.fileName = arma.nomeImagem;
    }

    // encontrando a referencia ddo tipo de arma no vetor
    const tipoArma = this.tipoArmas.find(m => m.id === (arma?.tipoArma?.id || null));

    // Obtendo a lista de acabamentos associados à arma (caso existam)
    const acabamentoIds = arma?.idsAcabamentos?.map(acabamento => acabamento.id) || [];

    this.formGroup = this.formBuilder.group({
      id: [(arma && arma.id) ? arma.id : null],
      nome: [(arma && arma.nome) ? arma.nome : '', Validators.required],
      qtdNoEstoque: [(arma && arma.qtdNoEstoque) ? arma.qtdNoEstoque : '', Validators.required],
      preco: [(arma && arma.preco) ? arma.preco : '', Validators.required],
      descricao: [(arma && arma.descricao) ? arma.descricao : '', Validators.required],
      tipoArma: [tipoArma, Validators.required],
      marca: [(arma && arma.marca) ? arma.marca : '', Validators.required],
      idsAcabamentos: [acabamentoIds, Validators.required],
      calibre: [(arma && arma.calibre) ? arma.calibre : '', Validators.required],
      comprimentoDoCano: [(arma && arma.comprimentoDoCano) ? arma.comprimentoDoCano : '', Validators.required],
      capacidadeDeTiro: [(arma && arma.capacidadeDeTiro) ? arma.capacidadeDeTiro : '', Validators.required],
      numeroSigma: [(arma && arma.numeroSigma) ? arma.numeroSigma : '', Validators.required],
      numeroDaArma: [(arma && arma.numeroDaArma) ? arma.numeroDaArma : '', Validators.required],
      modelo: [(arma && arma.modelo) ? arma.modelo : '', Validators.required],
      rna: [(arma && arma.rna) ? arma.rna : '', Validators.required],


    });
  }

  salvar() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const arma = this.formGroup.value;
      const operacao = arma.id == null
        ? this.armaService.insert(arma)
        : this.armaService.update(arma);

      operacao.subscribe({
        next: (armaCadastrado) => {
          if(arma && arma.id){
            this.uploadImage(arma.id);
          } else if (armaCadastrado && armaCadastrado.id){
            this.uploadImage(armaCadastrado.id);
          }
          this.router.navigateByUrl('/admin/armas');
          this.snackBar.open('O Arma foi salvo com Sucesso!!', 'Fechar', { duration: 3000 });
        },
        error: (error) => {
          console.error('Erro ao Salvar' + JSON.stringify(error));
          this.tratarErros(error);
          this.snackBar.open('Erro ao tentar salvar o Arma', 'Fechar', { duration: 3000 });
        }
      });
      console.log(arma);
    }
  }

  getSelectedAcabamentosNames(): string[] {
    const selectedIds: number[] = this.formGroup.get('idsAcabamentos')?.value || [];
    return selectedIds
      .map((id: number) => {
        const acabamento = this.acabamentos.find(a => a.id === id);
        return acabamento ? acabamento.nome : null;
      })
      .filter((name): name is string => name !== null); // Garantindo que o tipo é string
  }


  carregarImagemSelecionada(event: any) {
    this.selectedFile = event.target.files[0];

    if (this.selectedFile) {
      this.fileName = this.selectedFile.name;
      // carregando image preview
      const reader = new FileReader();
      reader.onload = e => this.imagePreview = reader.result;
      reader.readAsDataURL(this.selectedFile);
    }

  }

  private uploadImage(armaId: number) {
    if (this.selectedFile) {
      this.armaService.uploadImage(armaId, this.selectedFile.name, this.selectedFile)
      .subscribe({
        next: () => {
          console.log('voltarpagina1');
          this.voltarPagina();
        },
        error: err => {
          console.log('Erro ao fazer o upload da imagem');
          // tratar o erro
        }
      })
    } else {
      console.log('voltarpagina2');
      this.voltarPagina();
    }
  }

  voltarPagina() {
    this.location.back();
  }

  excluir() {
    if (this.formGroup.valid) {
      const arma = this.formGroup.value;
      if (arma.id != null) {
        this.armaService.delete(arma).subscribe({
          next: () => {
            this.router.navigateByUrl('/admin/armas');
          },
          error: (err) => {
            console.log('Erro ao Excluir' + JSON.stringify(err));
          }
        });
      }
    }
  }

  showSnackbarTopPosition(content: any) {
    this.snackBar.open(content, 'fechar', {
      duration: 3000,
      verticalPosition: "top",
      horizontalPosition: "center"
    });
  }

  cancelar(){
    this.router.navigateByUrl('/admin/armas');
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
      if (errors.hasOwnProperty(errorName) && this.errorMensages[controlName][errorName]) {
        return this.errorMensages[controlName][errorName];
      }
    }

    return 'invalid field';
  }
  errorMensages: { [controlName: string]: { [errorName: string]: string } } = {
    nome: {
      required: 'Nome é obrigatório',
      apiError: '',
    },
    qtdNoEstoque: {
      required: 'Quantidade de estoque é obrigatória',
      apiError: '',
    },
    descricao: {
      required: 'Descrição é obrigatória',
      apiError: '',
    },
    preco: {
      required: 'Preço é obrigatório',
      apiError: '',
    },
    tipoArma: {
      required: 'Tipo de disparo é obrigatório',
      apiError: '',
    },
    marca: {
      required: 'marca é obrigatória',
      apiError: '',
    },
    senha: {
      required: 'Senha é obrigatória',
      minLength: 'O tamanho mínimo da senha é 5 dígitos.',
      apiError: '',
    },
    acabamento: {
      required: 'Acabamento é obrigatório',
      apiError: '',
    },
    calibre: {
      required: 'calibre é obrigatório',
      apiError: '',
    },
    comprimentoDoCano: {
      required: 'Comprimento Do Cano é obrigatória',
      apiError: '',
    },
    capacidadeDeTiro: {
      required: 'Capacidade de tiro é obrigatória',
      apiError: '',
    },
    numeroSigma: {
      required: 'numero Sigma é obrigatório',
      apiError: '',
    },
    numeroDaArma: {
      required: 'Numero da arma é obrigatório',
      apiError: '',
    },

    rna: {
      required: 'rna é obrigatória',
      apiError: '',
    },

  };
}
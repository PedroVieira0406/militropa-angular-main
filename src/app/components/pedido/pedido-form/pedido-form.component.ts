import { NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormaDePagamento } from '../../../models/formaDePagamanto.model';
import { ItemPedido } from '../../../models/itemPedido.model';
import { Pedido } from '../../../models/pedido.model';
import { PedidoService } from '../../../services/pedido.service';

@Component({
  selector: 'app-pedido-form',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    MatCardModule, 
    MatFormFieldModule,
    MatButtonModule, 
    NgIf, 
    MatInputModule, 
    RouterModule, 
    MatTableModule, 
    MatToolbarModule, 
    MatSelectModule, 
    MatDatepickerModule,
    MatNativeDateModule, 
    MatIconModule, 
    MatMenuModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pedido-form.component.html',
  styleUrls: ['./pedido-form.component.css'] // Corrigido de "styleUrl" para "styleUrls"
})
export class PedidoFormComponent implements OnInit {
  formGroup: FormGroup;
  formaDePagamentos: FormaDePagamento []=[];
  itensPedidos: ItemPedido[]=[];

  constructor(
    private formBuilder: FormBuilder,
    private pedidoService: PedidoService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog
  ) {

    this.formGroup = this.formBuilder.group({
      id: [null],
      nome: ['', Validators.required],
      qtdNoEstoque: ['', Validators.required],
      preco: ['', Validators.required],
      descricao: ['', Validators.required],
      formaDePagamento: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.pedidoService.findFormaDePagamento().subscribe(data => {
      this.formaDePagamentos = data;
    });
    this.initializeForm();
  }

  initializeForm(): void {
    const pedido: Pedido = this.activatedRoute.snapshot.data['pedido'];

    const formaDePagamento = this.formaDePagamentos.find(m => m.id === (pedido?.formaDePagamento?.id || null));

    this.formGroup = this.formBuilder.group({
      id: [(pedido && pedido.id) ? pedido.id : null],
      senha: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
      perfil: [(pedido && pedido.formaDePagamento) ? pedido.formaDePagamento : '', Validators.required],
    });
  }
  /*
  salvar(): void {
    this.formGroup.markAllAsTouched();

    if (this.formGroup.valid) {
      const pedido = this.formGroup.value;

      // Determinando a operação: insert ou update
      const operacao = pedido.id == null
        ? this.pedidoService.insert(pedido)
        : this.pedidoService.update(pedido);

      // Executando a operação
      operacao.subscribe({
        next: () => this.router.navigateByUrl('/admin/pedidos'),
        error: (error) => {
          console.error('Erro ao Salvar:', error);
          this.tratarErros(error);
        },
      });
    }
  }
*/
  cancelar(): void {
    this.router.navigateByUrl('/admin/pedidos');
  }

  excluir(): void {
    const pedido = this.formGroup.value;

    if (pedido.id) {
      this.pedidoService.delete(pedido).subscribe({
        next: () => this.router.navigateByUrl('/admin/pedidos'),
        error: (err) => console.error('Erro ao Excluir:', err),
      });
    }
  }

  tratarErros(errorResponse: HttpErrorResponse): void {
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
      alert(errorResponse.error?.message || 'Erro ao enviar o formulário.');
    } else if (errorResponse.status >= 500) {
      alert('Erro interno do servidor.');
    }
  }

  getErrorMessage(controlName: string, errors: ValidationErrors | null | undefined): string {
    if (!errors) return '';

    for (const errorName in errors) {
      if (errors.hasOwnProperty(errorName) && this.errorMessages[controlName][errorName]) {
        return this.errorMessages[controlName][errorName];
      }
    }

    return 'Campo inválido';
  }

  errorMessages: { [controlName: string]: { [errorName: string]: string } } = {
    login: {
      required: 'Login é obrigatório',
      maxLength: 'O tamanho máximo do login é 60 dígitos',
      apiError: '',
    },
    senha: {
      required: 'Senha é obrigatória',
      minLength: 'O tamanho mínimo da senha é 5 dígitos',
      maxLength: 'O tamanho máximo da senha é 20 dígitos',
      apiError: '',
    },
    perfil: {
      required: 'Perfil é obrigatório',
      apiError: '',
    },
  };
}

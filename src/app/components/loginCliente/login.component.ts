import { Location, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule,
    RouterModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginClienteComponent implements OnInit {
  loginForm!: FormGroup;
  perfil = 1;

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private location: Location,
    private snackBar: MatSnackBar,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      login: ['', Validators.required],
      senha: ['', Validators.required]
    });
  }

  cadastro(){
    this.router.navigateByUrl('cadastro');
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const login = this.loginForm.get('login')?.value;
      const senha = this.loginForm.get('senha')?.value;


      this.authService.login(login, senha, this.perfil).subscribe({
        
        next: (resp) => {
          // redirecionando para a pagina principal
          this.showSnackbarTopPosition("Login comum realizado com sucesso");
          this.location.back();  // Volta para a página anterior

        },
        error: (err) => {
          console.log("Tentativa de enviar esses dados: ",login, senha, this.perfil);
          console.log(err);
          this.showSnackbarTopPosition("Login ou senha inválido");
        }
      })

    }
  }

  onRegister() {
    // criar usuário
  }

  cancelar() {
    this.router.navigateByUrl('/login');
  }

  showSnackbarTopPosition(content: any) {
    this.snackBar.open(content, 'fechar', {
      duration: 3000,
      verticalPosition: "top",
      horizontalPosition: "center"
    });
  }
}
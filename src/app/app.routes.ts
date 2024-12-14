import { Routes } from '@angular/router';
import { AcabamentoFormComponent } from './components/acabamento/acabamento-form/acabamento-form.component';
import { AcabamentoListComponent } from './components/acabamento/acabamento-list/acabamento-list.component';
import { acabamentoResolver } from './components/acabamento/resolver/acabamento.resolver';
import { ArmaCardListComponent } from './components/arma/arma-card-list/arma-card-list.component';
import { ArmaFormComponent } from './components/arma/arma-form/arma-form.component';
import { ArmaListComponent } from './components/arma/arma-list/arma-list.component';
import { armaResolver } from './components/arma/resolver/arma.resolver';
import { CarrinhoComponent } from './components/carrinho/carrinho.component';
import { ClienteFormComponent } from './components/cliente/cliente-form/cliente-form.component';
import { ClienteListComponent } from './components/cliente/cliente-list/cliente-list.component';
import { clienteResolver } from './components/cliente/resolver/cliente.resolver';
import { EnderecoFormComponent } from './components/endereco/endereco-form/endereco-form.component';
import { EnderecoListComponent } from './components/endereco/endereco-list/endereco-list.component';
import { enderecoResolver } from './components/endereco/resolver/endereco.resolver';
import { EstadoFormComponent } from './components/estado/estado-form/estado-form.component';
import { EstadoListComponent } from './components/estado/estado-list/estado-list.component';
import { estadoResolver } from './components/estado/resolver/estado.resolver';
import { FuncionarioFormComponent } from './components/funcionario/funcionario-form/funcionario-form.component';
import { FuncionarioListComponent } from './components/funcionario/funcionario-list/funcionario-list.component';
import { funcionarioResolver } from './components/funcionario/resolver/funcionario.resolver';
import { LoginComponent } from './components/login/login.component';
import { MunicipioFormComponent } from './components/municipio/municipio-form/municipio-form.component';
import { MunicipioListComponent } from './components/municipio/municipio-list/municipio-list.component';
import { municipioResolver } from './components/municipio/resolver/municipio.resolver';
import { AdminTemplateComponent } from './components/template/admin-template/admin-template.component';
import { UserTemplateComponent } from './components/template/user-template/user-template.component';
import { usuarioResolver } from './components/usuario/resolver/usuario.resolver';
import { UsuarioFormComponent } from './components/usuario/usuario-form/usuario-form.component';
import { UsuarioListComponent } from './components/usuario/usuario-list/usuario-list.component';
import { authGuard } from './guard/auth.guard';

export const routes: Routes = [
    {
        path: '',
        component: UserTemplateComponent,
        title: 'e-commerce',
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'ecommerce' },
            
            { path: 'ecommerce', component: ArmaCardListComponent, title: 'Lista de Cards de Armas' },
            { path: 'carrinho', component: CarrinhoComponent, title: 'Carrinho de Compras' },
            { path: 'login', component: LoginComponent, title: 'Login'},
        ]
    },
    {
        path: 'admin',
        component: AdminTemplateComponent,
        title: 'Administração',
        children: [
            { path: '', redirectTo: 'login', pathMatch: 'full' },

            { path: 'login', component: LoginComponent, title: 'Login'},

            { path: 'estados', component: EstadoListComponent, title: 'Lista de Estados', canActivate: [authGuard],},
            { path: 'estados/new', component: EstadoFormComponent, title: 'Novo Estado' , canActivate: [authGuard],},
            { path: 'estados/edit/:id', component: EstadoFormComponent, resolve: { estado: estadoResolver } , canActivate: [authGuard],},

            { path: 'municipios', component: MunicipioListComponent, title: 'Lista de Municípios', canActivate: [authGuard], },
            { path: 'municipios/new', component: MunicipioFormComponent, title: 'Novo Município' , canActivate: [authGuard],},
            { path: 'municipios/edit/:id', component: MunicipioFormComponent, resolve: { municipio: municipioResolver }, canActivate: [authGuard], },

            { path: 'armas', component: ArmaListComponent, title: 'Lista de Armas', canActivate: [authGuard], },
            { path: 'armas/new', component: ArmaFormComponent, title: 'Cadastrar Arma', canActivate: [authGuard], },
            { path: 'armas/edit/:id', component: ArmaFormComponent, resolve: { arma: armaResolver} , canActivate: [authGuard],},

            { path: 'enderecos', component: EnderecoListComponent, title: 'Lista de Endereços', canActivate: [authGuard], },
            { path: 'enderecos/new', component: EnderecoFormComponent, title: 'Novo Endereço' , canActivate: [authGuard],},
            { path: 'enderecos/edit/:id', component: EnderecoFormComponent, resolve: { endereco: enderecoResolver } , canActivate: [authGuard],},

            { path: 'funcionarios', component: FuncionarioListComponent, title: 'Lista de Funcionários', canActivate: [authGuard], },
            { path: 'funcionarios/new', component: FuncionarioFormComponent, title: 'Novo Funcionário', canActivate: [authGuard], },
            { path: 'funcionarios/edit/:id', component: FuncionarioFormComponent, resolve: { funcionario: funcionarioResolver } , canActivate: [authGuard],},

            { path: 'clientes', component: ClienteListComponent, title: 'Lista de Clientes', canActivate: [authGuard], },
            { path: 'clientes/new', component: ClienteFormComponent, title: 'Novo Cliente', canActivate: [authGuard], },
            { path: 'clientes/edit/:id', component: ClienteFormComponent, resolve: { cliente: clienteResolver } , canActivate: [authGuard],},

            { path: 'acabamentos', component: AcabamentoListComponent, title: 'Lista de Acabamentos' , canActivate: [authGuard],},
            { path: 'acabamentos/new', component: AcabamentoFormComponent, title: 'Novo Acabamento', canActivate: [authGuard], },
            { path: 'acabamentos/edit/:id', component: AcabamentoFormComponent, resolve: { acabamento: acabamentoResolver }, canActivate: [authGuard], },

            { path: 'usuarios', component: UsuarioListComponent, title: 'Lista de Usuários', canActivate: [authGuard], },
            { path: 'usuarios/new', component: UsuarioFormComponent, title: 'Novo Usuário', canActivate: [authGuard], },
            { path: 'usuarios/edit/:id', component: UsuarioFormComponent, resolve: { usuario: usuarioResolver } , canActivate: [authGuard],},
        ]
    },
];

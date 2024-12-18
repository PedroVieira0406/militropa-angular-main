import { Routes } from '@angular/router';
import { AcabamentoFormComponent } from './components/acabamento/acabamento-form/acabamento-form.component';
import { AcabamentoListComponent } from './components/acabamento/acabamento-list/acabamento-list.component';
import { acabamentoResolver } from './components/acabamento/resolver/acabamento.resolver';
import { AlterarLoginComponent } from './components/alterar-login/alterar-login/alterar-login.component';
import { AlterarSenhaComponent } from './components/alterar-senha/alterar-senha/alterar-senha.component';
import { ArmaCardListComponent } from './components/arma/arma-card-list/arma-card-list.component';
import { ArmaFormComponent } from './components/arma/arma-form/arma-form.component';
import { ArmaListComponent } from './components/arma/arma-list/arma-list.component';
import { InfoFormComponent } from './components/arma/info-form/info-form.component';
import { armaResolver } from './components/arma/resolver/arma.resolver';
import { CarrinhoComponent } from './components/carrinho/carrinho.component';
import { ClienteCadastroFormComponent } from './components/cliente/cliente-cadastro/cliente-form.component';
import { ClienteFormComponent } from './components/cliente/cliente-form/cliente-form.component';
import { ClienteListComponent } from './components/cliente/cliente-list/cliente-list.component';
import { clienteResolver } from './components/cliente/resolver/cliente.resolver';
import { EnderecoFormComponent } from './components/endereco/endereco-form/endereco-form.component';
import { EnderecoListComponent } from './components/endereco/endereco-list/endereco-list.component';
import { enderecoResolver } from './components/endereco/resolver/endereco.resolver';
import { FuncionarioFormComponent } from './components/funcionario/funcionario-form/funcionario-form.component';
import { FuncionarioListComponent } from './components/funcionario/funcionario-list/funcionario-list.component';
import { funcionarioResolver } from './components/funcionario/resolver/funcionario.resolver';
import { LoginComponent } from './components/login/login.component';
import { LoginClienteComponent } from './components/loginCliente/login.component';
import { PedidoFormComponent } from './components/pedido/pedido-form/pedido-form.component';
import { PedidoListComponent } from './components/pedido/pedido-list/pedido-list.component';
import { pedidoResolver } from './components/pedido/resolver/pedido.resolver';
import { AdminTemplateComponent } from './components/template/admin-template/admin-template.component';
import { UserTemplateComponent } from './components/template/user-template/user-template.component';
import { usuarioResolver } from './components/usuario/resolver/usuario.resolver';
import { UsuarioFormComponent } from './components/usuario/usuario-form/usuario-form.component';
import { UsuarioListComponent } from './components/usuario/usuario-list/usuario-list.component';
import { authGuard } from './guard/auth.guard';
import { authClienteGuard } from './guard/authCliente.guard';
import { RealizarPagamentoComponent } from './components/realizar-pagamento/realizar-pagamento.component';
import { AcompanharPedidoComponent } from './components/acompanhar-pedido/acompanhar-pedido.component';

export const routes: Routes = [
    {
        path: '',
        component: UserTemplateComponent,
        title: 'e-commerce',
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'ecommerce' },
            
            { path: 'ecommerce', component: ArmaCardListComponent, title: 'Lista de Cards de Armas' },
            { path: 'info/:id', component: InfoFormComponent, title: 'Info'},

            { path: 'login', component: LoginClienteComponent, title: 'Login'},
            { path: 'cadastro', component: ClienteCadastroFormComponent, title: 'Cadastro'},

            { path: 'carrinho', component: CarrinhoComponent, title: 'Carrinho de Compras' , canActivate: [authClienteGuard] },
            { path: 'realizarPagamento', component: RealizarPagamentoComponent, title: 'Realizar Pagamento', canActivate: [authClienteGuard]},
            { path: 'acompanharpedido', component: AcompanharPedidoComponent, title: 'Acompanhar Pedido', canActivate: [authClienteGuard]},

            { path: 'alterarLogin', component: AlterarLoginComponent, title: 'Alterando Login', canActivate: [authClienteGuard]},
            
            { path: 'alterarSenha', component: AlterarSenhaComponent, title: 'Alterando Senha', canActivate: [authClienteGuard]},
        ]
    },
    {
        path: 'admin',
        component: AdminTemplateComponent,
        title: 'Administração',
        children: [
            { path: '', redirectTo: 'login', pathMatch: 'full' },

            { path: 'login', component: LoginComponent, title: 'Login'},

            { path: 'pedidos', component: PedidoListComponent, title: 'Lista de Armas', canActivate: [authGuard], },
            { path: 'pedidos/new', component: PedidoFormComponent, title: 'Cadastrar Arma', canActivate: [authGuard], },
            { path: 'pedidos/edit/:id', component: PedidoFormComponent, resolve: { pedido: pedidoResolver} , canActivate: [authGuard],},

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

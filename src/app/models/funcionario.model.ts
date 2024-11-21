import { Endereco } from "./endereco.model";
import { Usuario } from "./usuario.model";


export class Funcionario {
    id!: number;
    nome!: string;
    cpf!: string;
    email!: string;
    telefone!: string;
    endereco!: Endereco;
    matricula!: string;
    usuario!: Usuario;
}

import { Endereco } from "./endereco.model";
import { Usuario } from "./usuario.model";

export class Cliente {
    id!: number;
    nome!: string;
    cpf!: string;
    email!: string;
    registro!: string;
    usuario!: Usuario;
    endereco?: Endereco;
}

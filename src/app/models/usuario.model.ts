import { Perfil } from "./perfil.model";

export class Usuario {
    id!: number;
    login!: string;
    senha!: string;
    perfil!: Perfil;
}

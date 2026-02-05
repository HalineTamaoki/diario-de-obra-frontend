export type Usuario = {
    email: string,
    senha: string,
}

export type CadastroUsuarioResponse = {
    email: string,
    id: number
}

export type Token = {
    access_token: string,
    validTo: string
}
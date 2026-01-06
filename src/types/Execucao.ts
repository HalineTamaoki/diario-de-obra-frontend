export type Execucao = {
    comentarios?: string;
    previsao?: Previsao,
    outrasDatas?: OutraData[]
}

export type Previsao = {
    inicio?: string;
    termino?: string;
}

export type OutraData = {
    id: number,
    nome: string,
    data: string
}
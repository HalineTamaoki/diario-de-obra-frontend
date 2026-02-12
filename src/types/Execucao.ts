export type Execucao = Previsao & {
    comentarios?: string;
    datasAdicionais?: OutraData[];
    itemObraId: number
}

export type Previsao = {
    inicio?: string;
    termino?: string;
}

export type OutraData = {
    id: number,
    nome: string,
    data: string,
}

export type NovaData = Omit<OutraData, 'id'> & {
    idItem: number; 
    idObra: number;
}

export type Execucao = {
    comentarios?: string;
    previsao?: Previsao,
    datasAdicionais?: OutraData[];
    finalizado?: boolean,
    itemObraId: number,
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

export type ExecucaoResponse = Previsao & Pick<Execucao, 'comentarios' | 'itemObraId' | 'datasAdicionais'>
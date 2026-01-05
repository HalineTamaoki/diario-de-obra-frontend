export type OrcamentoResumo = {
    id: number,
    selecionado?: boolean
} & OrcamentoBase;

export type OrcamentoDetalhesType = NovoOrcamentoType & OrcamentoResumo;

export type NovoOrcamentoType = OrcamentoBase & OrcamentoExtendido & {
    idObra: number;
};

type OrcamentoExtendido = {
    data: string,
    comentarios?: string
}

type OrcamentoBase = {
    empresa: string,
    valor?: number
}
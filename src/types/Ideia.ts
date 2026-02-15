export type NovaIdeia = {
    link: string;
    itemidObra: number;
    idObra: number;
}

export type Ideia = Omit<NovaIdeia, 'idObra'> & {
    id: number;
}
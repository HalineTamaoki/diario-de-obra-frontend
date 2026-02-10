export type NovaIdeia = {
    link: string;
    itemObraId: number;
    obraId: number;
}

export type Ideia = Omit<NovaIdeia, 'obraId'> & {
    id: number;
}
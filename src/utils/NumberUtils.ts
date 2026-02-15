export const converterMoeda = (valor: number) => valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
})
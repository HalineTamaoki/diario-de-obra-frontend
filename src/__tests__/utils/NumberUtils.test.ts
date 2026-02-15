import { converterMoeda } from "../../utils/NumberUtils";

describe('converterMoeda', () => {
  
    test('deve formatar um valor numérico para o padrão de moeda Real (BRL)', () => {
        const valor = 1500.50;
        const resultado = converterMoeda(valor);

        expect(resultado).toMatch(/R\$/);
        expect(resultado).toMatch(/1.500,50/);
    });

    test('deve formatar corretamente valores inteiros', () => {
        const valor = 10;
        const resultado = converterMoeda(valor);

        expect(resultado).toMatch(/10,00/);
    });
});
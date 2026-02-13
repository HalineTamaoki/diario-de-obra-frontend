import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { isBeforeNow, formatValue, converterData, diffDays } from '../../utils/DateUtils';

describe('Utilitários de Data', () => {
  
    describe('isBeforeNow', () => {
        beforeEach(() => {
            vi.useFakeTimers();
            vi.setSystemTime(new Date('2024-01-01T12:00:00Z'));
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        it('deve retornar true para uma data no passado', () => {
            expect(isBeforeNow('2023-12-31')).toBe(true);
        });

        it('deve retornar false para uma data no futuro', () => {
            expect(isBeforeNow('2024-01-02')).toBe(false);
        });
    });

    describe('formatValue', () => {
        it('deve retornar string vazia se o valor for undefined', () => {
            expect(formatValue('date', undefined)).toBe("");
        });

        it('deve formatar apenas a data quando o tipo for "date"', () => {
            const input = '2024-05-20T15:30:00Z';
            const result = formatValue('date', input);
            
            expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
            expect(result).toContain('2024-05-20');
        });

        it('deve retornar data e hora (YYYY-MM-DDTHH:mm) para outros tipos', () => {
            const input = '2024-05-20T15:30:00Z';
            const result = formatValue('datetime', input);
            
            expect(result).toHaveLength(16);
        });
    });

    describe('converterData', () => {
        it('deve retornar undefined se não houver data', () => {
            expect(converterData(undefined)).toBeUndefined();
        });

        it('deve converter para o formato de data local (pt-BR)', () => {
            const input = '2024-12-25T10:00:00Z';
            const result = converterData(input);
            
            expect(result).toContain('2024');
        });
    });

    describe('diffDays', () => {
        it('deve retornar a diferença correta de dias entre duas datas (positivo)', () => {
      const d1 = '2023-10-01';
      const d2 = '2023-10-10';
      expect(diffDays(d1, d2)).toBe(9);
    });

    it('deve retornar a diferença negativa se a segunda data for anterior', () => {
      const d1 = '2023-10-10';
      const d2 = '2023-10-01';
      expect(diffDays(d1, d2)).toBe(-9);
    });

    it('deve retornar 0 para a mesma data', () => {
      expect(diffDays('2023-01-01', '2023-01-01')).toBe(0);
    });

    it('deve calcular corretamente através de anos bissextos', () => {
      // 2024 é bissexto (fevereiro tem 29 dias)
      expect(diffDays('2024-02-28', '2024-03-01')).toBe(2);
    });
  });

    describe('Suporte a Formatos (parseDateToUTC)', () => {
        it('deve aceitar o formato ISO (YYYY-MM-DD)', () => {
            expect(diffDays('2023-05-01', '2023-05-02')).toBe(1);
        });

        it('deve aceitar o formato Brasileiro (DD/MM/YYYY)', () => {
            expect(diffDays('01/05/2023', '02/05/2023')).toBe(1);
        });

        it('deve aceitar o formato YYYY/MM/DD', () => {
            expect(diffDays('2023/05/01', '2023/05/02')).toBe(1);
        });

        it('deve lançar erro para formatos de data inválidos', () => {
            expect(() => diffDays('data-invalida', '2023-10-01')).toThrow(
                /Formato de data inválido/
            );
        });
    });
});
export const diffDays = (dateStr1?: string, dateStr2?: string): number | undefined => {
    if(!dateStr1 || !dateStr2){
        return;
    }
    const d1 = parseDateToUTC(dateStr1);
    const d2 = parseDateToUTC(dateStr2);

    const utc1 = Date.UTC(d1.getUTCFullYear(), d1.getUTCMonth(), d1.getUTCDate());
    const utc2 = Date.UTC(d2.getUTCFullYear(), d2.getUTCMonth(), d2.getUTCDate());

    const MS_PER_DAY = 24 * 60 * 60 * 1000;
    return Math.round((utc2 - utc1) / MS_PER_DAY);
}

/**
 * Converte uma string de data para um objeto Date em UTC (mantendo o dia civil).
 * Lança erro se o formato não for reconhecido.
 */
const parseDateToUTC = (input: string): Date => {
    const trimmed = input.trim();

    // ISO "YYYY-MM-DD"
    let m = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (m) {
        const [_, y, mm, dd] = m;
        return new Date(Date.UTC(Number(y), Number(mm) - 1, Number(dd)));
    }

    // BR "DD/MM/YYYY"
    m = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (m) {
        const [_, dd, mm, y] = m;
        return new Date(Date.UTC(Number(y), Number(mm) - 1, Number(dd)));
    }

    // "YYYY/MM/DD"
    m = trimmed.match(/^(\d{4})\/(\d{2})\/(\d{2})$/);
    if (m) {
        const [_, y, mm, dd] = m;
        return new Date(Date.UTC(Number(y), Number(mm) - 1, Number(dd)));
    }

    // Fallback: tenta Date.parse (pode variar por ambiente). Força UTC se possível.
    const parsed = Date.parse(trimmed);
    if (!isNaN(parsed)) {
        const d = new Date(parsed);
        // Normaliza para meia-noite UTC do dia correspondente
        return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
    }

    throw new Error(
        `Formato de data inválido: "${input}". Use "YYYY-MM-DD", "DD/MM/YYYY" ou "YYYY/MM/DD".`
    );
}
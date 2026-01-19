export const isBeforeNow = (isoDate: string) => {    
    const nowMs = Date.now();
    const dateMs = new Date(isoDate).getTime();

    return dateMs < nowMs;
}
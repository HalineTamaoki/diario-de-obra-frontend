export const isBeforeNow = (isoDate: string) => {    
    const nowMs = Date.now();
    const dateMs = new Date(isoDate).getTime();

    return dateMs < nowMs;
}

export const formatValue = (type: string, val?: string) => {
  if (!val) return "";
  console.log(val)
  
  const novaData = new Date(val);
  const offset = novaData.getTimezoneOffset() * 60000;
  const localISOTime = new Date(novaData.getTime() - offset).toISOString();

  if (type === 'date') {
    return localISOTime.split('T')[0];
  }
  
  return localISOTime.slice(0, 16);
};

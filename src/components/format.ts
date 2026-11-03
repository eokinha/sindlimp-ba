const MONTHS = ["jan", "fev", "mar", "abr", "maio", "jun", "jul", "ago", "set", "out", "nov", "dez"];

/** Data no formato do tema original: dia + "mês, ano". */
export function formatPostDate(iso: string) {
  const d = new Date(iso);
  return {
    day: String(d.getUTCDate()).padStart(2, "0"),
    monthYear: `${MONTHS[d.getUTCMonth()]}, ${d.getUTCFullYear()}`,
  };
}

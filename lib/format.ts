const rtf = new Intl.RelativeTimeFormat("fr", { numeric: "auto" });

export function timeAgo(date: Date): string {
  const seconds = (date.getTime() - Date.now()) / 1000;
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size) {
      return rtf.format(Math.round(seconds / size), unit);
    }
  }
  return "à l'instant";
}

const euros = (decimals: number) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

// "4000" → "4 000 €", "12,5" → "12,50 €" ; un texte libre ("~50", "entre 20 et 30") reçoit juste « € »
export function formatPrice(price: string): string {
  const compact = price.replace(/[\s\u00a0\u202f€]/g, "").replace(",", ".");
  if (/^\d+(\.\d+)?$/.test(compact)) {
    const amount = Number(compact);
    return euros(Number.isInteger(amount) ? 0 : 2).format(amount);
  }
  return price.includes("€") ? price : `${price} €`;
}

// Le symbole est affiché à côté du champ : on ne le stocke pas
export function stripEuro(price: string): string {
  return price.replace(/€/g, "").trim();
}

export function withProtocol(url: string): string {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

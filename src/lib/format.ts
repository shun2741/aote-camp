export const yenFormatter = new Intl.NumberFormat("ja-JP");

const parseLocalDate = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const monthDayFormatter = new Intl.DateTimeFormat("ja-JP", {
  month: "numeric",
  day: "numeric",
  weekday: "short",
});

const yearMonthDayFormatter = new Intl.DateTimeFormat("ja-JP", {
  year: "numeric",
  month: "numeric",
  day: "numeric",
});

export const formatCurrency = (amount: number) =>
  `${yenFormatter.format(Math.round(amount))}円`;

export const formatPelica = (amount: number) =>
  `${amount >= 0 ? "+" : "-"}${yenFormatter.format(Math.abs(Math.round(amount)))}ペリカ`;

export const formatNumber = (value: number, digits = 1) =>
  new Intl.NumberFormat("ja-JP", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);

export const formatDate = (value: string) =>
  yearMonthDayFormatter.format(parseLocalDate(value));

export const formatDateWithWeekday = (value: string) =>
  monthDayFormatter.format(parseLocalDate(value));

export const formatDateRange = (startDate: string, endDate: string) =>
  `${formatDate(startDate)} - ${formatDate(endDate)}`;

export const joinNames = (names: string[]) => names.join(" / ");

export const getStatusLabel = (status: "planning" | "completed") =>
  status === "planning" ? "計画中" : "実施済み";

export const getCategoryLabel = (category?: string) => {
  switch (category) {
    case "transport":
      return "交通";
    case "hotel":
      return "宿";
    case "food":
      return "食費";
    case "activity":
      return "アクティビティ";
    default:
      return "その他";
  }
};

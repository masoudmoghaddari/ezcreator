import { format } from "date-fns";

export function timeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  const divisions = [
    { amount: 60, name: "seconds" },
    { amount: 60, name: "minutes" },
    { amount: 24, name: "hours" },
    { amount: 7, name: "days" },
    { amount: 4.34524, name: "weeks" },
    { amount: 12, name: "months" },
    { amount: Number.POSITIVE_INFINITY, name: "years" },
  ];

  let duration = seconds;
  for (const division of divisions) {
    if (Math.abs(duration) < division.amount) {
      return rtf.format(-Math.floor(duration), division.name as any);
    }
    duration /= division.amount;
  }

  return rtf.format(0, "days");
}

export function formatDateToYMD(dateString: string | Date): string {
  try {
    return format(new Date(dateString), "yyyy-MM-dd");
  } catch {
    return "";
  }
}

export function formatDuration(seconds: number | null | undefined): string {
  if (seconds == null) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

import { format, isToday, isTomorrow, isYesterday } from "date-fns";

export const formatDate = (dateString: string): string => {
  if (!dateString || typeof dateString !== "string") return "-";

  const date = new Date(dateString);

  if (isToday(date)) return "Today";
  if (isTomorrow(date)) return "Tomorrow";
  if (isYesterday(date)) return "Yesterday";

  // Default format if not today, tomorrow, or yesterday
  return format(date, "dd/MM/yyyy");
};

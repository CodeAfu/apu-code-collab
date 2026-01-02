import { YearDisplayTypeDB } from "./types";

export const formatEnumString = (str: string | null) => {
  if (!str) return "Not set";
  return str.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export const formatYearToEnum = (str: string): YearDisplayTypeDB => {
  return str.split(" ").join("_").toLowerCase() as YearDisplayTypeDB;
}

export const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

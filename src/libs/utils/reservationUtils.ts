import { DateFilter, CarModelInfo } from "@/constants/types/reservation";

export const getFilterDate = (offset: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date;
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });
};

export const formatTime = (date: Date): string => {
  return new Date(date).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export const isDateInFilter = (frDate: Date, ToDate: Date, filter: DateFilter): boolean => {
  const filterDate = getFilterDate(filter);

  console.log(frDate, ToDate);
  console.log("Today", filterDate);

  return frDate.getTime() < filterDate.getTime() && ToDate.getTime() > filterDate.getTime();

};

export const getCarModelAndMdn = (index: number): CarModelInfo => {
  const carModels = ["아반떼", "소나타", "그랜저", "K5", "K8", "모닝", "레이"];
  return {
    carModel: carModels[index % carModels.length],
    mdn: `MDN-${100000 + index}`
  };
}; 
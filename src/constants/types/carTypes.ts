import { CarDetailTypes } from "./types";

export type CarSearchLayer = {
  carList: CarDetailTypes[];
  onSearch: (
    isReload: boolean,
    bizSearchText?: string,
    searchText?: string,
    status?: string,
    carType?: string,
    pageSize?: number
  ) => void;
  defaultPageSize?: number;
};
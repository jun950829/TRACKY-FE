export interface ReturnStatus {
  rentUuid: string;
  carPlate: string;
  renterName: string;
  carType: string;
  rentStatus: string;
  rentStime: string;
  rentEtime: string;
}

export interface ReservationCardProps {
  reservations: ReturnStatus[];
  isLoading: boolean;
  getReturnStatusData: (datefilter: number) => void;
}

// export enum DateFilter {
//   YESTERDAY = -1,
//   TODAY = 0,
//   TOMORROW = 1
// }

export interface CarModelInfo {
  carModel: string;
  mdn: string;
} 
import { CarStatusEnum } from "./types";

export interface MdnStatus {
    mdn :string;
    status: CarStatusEnum;
}

export type RentStatusEnum = 'RESERVED' | 'RENTING' | 'RETURNED' | 'CANCELED' | 'DELETED';

export const RentStatusLabels: Record<RentStatusEnum, string> = {
    RESERVED: '예약완료',
    RENTING:  '대여중',
    RETURNED: '반납완료',
    CANCELED: '취소',
    DELETED:  '삭제됨',
  };
export type CarTypes = {
  id: number;
  mdn: string;
  bizId: number;
  carType: string;
  carPlate: string;
  carYear: string;
  purpose: string;
  status: string;
  sum: string;
  createdAt: string;
}

export type Devices = {
  id: number;
  tid: string;
  mid: string;
  did: string;
  pv: string;
}


export type CarDetailTypes = {
  id: number;
  mdn: string;
  bizId: number;
  carType: string;
  carPlate: string;
  carYear: string;
  purpose: string;
  status: string;
  sum: string;
  deviceInfo: Devices;
  createdAt: string;
}
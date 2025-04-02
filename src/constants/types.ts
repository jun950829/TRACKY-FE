export type CarTypes = {
  mdn: string;
  bizId: number;
  carType: string;
  carPlate: string;
  carYear: string;
  purpose: string;
  status: string;
  sum: number;
  createdAt?: string;
}

export type CarCreateTypes = {
  mdn: string;
  bizId?: number;
  carType: string;
  carPlate: string;
  carYear: string;
  purpose: string;
  status: string;
  sum: number;
}

export type CarUpdateTypes = {
  mdn: string;
  bizId: number;
  carType: string;
  carPlate: string;
  carYear: string;
  purpose: string;
  status: string;
  sum: number;
  deviceInfo: Devices;
}

export type Devices = {
  id: number;
  tid: string;
  mid: string;
  did: string;
  pv: string;
}


export type CarDetailTypes = {
  mdn: string;
  bizId: number;
  carType: string;
  carPlate: string;
  carYear: string;
  purpose: string;
  status: string;
  sum: number;
  deviceInfo: Devices;
  createdAt: string;
}


export interface CarStatistic {
  carNumber: string;
  carType: '승용차' | 'SUV' | '소형' | '전기차';
  operationTime: string;
  operationDistance: string;
  averageSpeed: string;
  maxSpeed: string;
}

export const carStatisticData: CarStatistic[] = [
  {
    carNumber: '서울 12가 3456',
    carType: 'SUV',
    operationTime: '6.2시간',
    operationDistance: '87.5km',
    averageSpeed: '62km/h',
    maxSpeed: '95km/h',
  },
  {
    carNumber: '서울 34가 5678',
    carType: '승용차',
    operationTime: '4.8시간',
    operationDistance: '65.2km',
    averageSpeed: '58km/h',
    maxSpeed: '87km/h',
  },
  {
    carNumber: '서울 56가 7890',
    carType: '소형',
    operationTime: '5.5시간',
    operationDistance: '72.8km',
    averageSpeed: '55km/h',
    maxSpeed: '82km/h',
  },
  {
    carNumber: '서울 78가 9012',
    carType: '전기차',
    operationTime: '4.2시간',
    operationDistance: '58.5km',
    averageSpeed: '52km/h',
    maxSpeed: '78km/h',
  },
  {
    carNumber: '서울 90가 1234',
    carType: 'SUV',
    operationTime: '5.8시간',
    operationDistance: '76.2km',
    averageSpeed: '60km/h',
    maxSpeed: '92km/h',
  },
];

// 페이지네이션을 위한 설정
export const ITEMS_PER_PAGE = 5;
export const TOTAL_ITEMS = 68; 
import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import statisticApiService from '@/libs/apis/statisticApi';
import { CarTypeEnum } from '@/constants/types/types';

export interface CarStatisticRequest {
  searchTerm: string;
  currentPage: number;
  pageSize: number;
}

export interface CarStatisticResponse {
  mdn: string;
  carPlate: string;
  carType: CarTypeEnum;
  driveSec: number;
  driveDistance: number;
  avgSpeed: number;
}

export interface Pagination {
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

const defaultPage: Pagination = {
  totalElements: 0,
  totalPages: 1,
  number: 1,
  size: 1
}

function StatisticCarTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [carStatisticData, setCarStatisticData] = useState<CarStatisticResponse[]>([]);
  const [pagination, setPagination] = useState<Pagination>(defaultPage);
  const [isLoading, setIsLoading] = useState(false);

  const pageSize = 5;

  // 페이지네이션 계산
  const totalPages = pagination?.totalPages;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  useEffect(() => {
    const carStatisticRequest: CarStatisticRequest = { searchTerm, currentPage, pageSize }

    const fetchCarStatistic = async () => {
      setIsLoading(true);
      try {
        const response = await statisticApiService.getCarStatistic(carStatisticRequest);
        setCarStatisticData(response.data);
        setPagination(response.pageResponse);
        console.log('carStatisticData', carStatisticData);

      } catch(error) {
          console.error('차량 통계 불러오기 실패', error);
          setCarStatisticData([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCarStatistic();
  }, [searchTerm, currentPage])

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* 헤더 */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">차량별 상세 통계</h2>
          
          {/* 검색창 */}
          <div className="relative">
            <input
              type="text"
              placeholder="검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all w-64"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left text-sm font-medium text-gray-500 px-6 py-4">차량번호</th>
              <th className="text-left text-sm font-medium text-gray-500 px-6 py-4">차종</th>
              <th className="text-left text-sm font-medium text-gray-500 px-6 py-4">운행시간</th>
              <th className="text-left text-sm font-medium text-gray-500 px-6 py-4">운행거리</th>
              <th className="text-left text-sm font-medium text-gray-500 px-6 py-4">평균속도</th>
              <th className="text-left text-sm font-medium text-gray-500 px-6 py-4">최고속도</th>
              <th className="text-left text-sm font-medium text-gray-500 px-6 py-4">상세보기</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {carStatisticData.map((car, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-600">{car.carPlate}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{car.carType}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{car.driveSec}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{car.driveDistance}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{car.avgSpeed}</td>
                <td className="px-6 py-4 text-sm text-gray-600">0</td>
                <td className="px-6 py-4">
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    상세보기
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <div className="px-6 py-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            전체 {pagination?.totalElements} 개 중 1에서 5까지 표시
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
            >
              &lt;
            </button>
            {pages.map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  currentPage === page
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
              disabled={currentPage === pagination?.totalPages}
              className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatisticCarTable;

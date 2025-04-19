import { useState } from 'react';
import { Search } from 'lucide-react';
import { carStatisticData, ITEMS_PER_PAGE, TOTAL_ITEMS } from '@/constants/mocks/carStatisticMockData';

function StatisticCarTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  // 페이지네이션 계산
  const totalPages = Math.ceil(TOTAL_ITEMS / ITEMS_PER_PAGE);
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1);

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
                <td className="px-6 py-4 text-sm text-gray-600">{car.carNumber}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{car.carType}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{car.operationTime}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{car.operationDistance}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{car.averageSpeed}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{car.maxSpeed}</td>
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
            전체 {TOTAL_ITEMS} 개 중 1에서 5까지 표시
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
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
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

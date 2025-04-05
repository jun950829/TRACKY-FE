export const CarStatus = [
  { value: "all", label: "전체" },
  { value: "운행중", label: "운행중" },
  { value: "정비중", label: "정비중" },
  { value: "대기중", label: "대기중" },
  { value: "폐차", label: "폐차" }
];

export const CarPurpose = [
  { value: "all", label: "전체" },
  { value: "법인(업무)", label: "법인(업무)" },
  { value: "법인(영업)", label: "법인(영업)" },
  { value: "렌트카", label: "렌트카" },
  { value: "기타", label: "기타" }
];

export const StatusColorMap = {
  '운행중': 'bg-green-100 text-green-800',
  '정비중': 'bg-yellow-100 text-yellow-800',
  '대기중': 'bg-blue-100 text-blue-800',
  'default': 'bg-gray-100 text-gray-800'
};
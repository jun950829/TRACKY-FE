import { useState, useEffect } from 'react';

function RealTimeClock() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 시간 포맷팅 함수
  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return { hours, minutes, seconds };
  };

  // 요일 구하기
  const getDayOfWeek = (date: Date) => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return days[date.getDay()];
  };

  const { hours, minutes, seconds } = formatTime(currentTime);
  const month = (currentTime.getMonth() + 1).toString().padStart(2, '0');
  const date = currentTime.getDate().toString().padStart(2, '0');
  const dayOfWeek = getDayOfWeek(currentTime);

  return (
    <div className="z-[1000] absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-4 font-mono">
      <div className="flex items-end gap-1">
        <div className="text-4xl font-bold tracking-tight text-gray-800">
          {hours}
          <span className="animate-pulse">:</span>
          {minutes}
        </div>
        <div className="text-xl mb-1 text-gray-500">{seconds}</div>
      </div>
      <div className="text-sm text-gray-600 mt-1">
        {month}.{date} ({dayOfWeek})
      </div>
    </div>
  );
}

export default RealTimeClock; 
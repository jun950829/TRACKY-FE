import { buildCycleGpsList } from "./gpsUtils";
import { hubApiService } from "../apis/hubApi";

class GpsBuffer {
  private buffer: GeolocationPosition[] = [];
  private lastSentTimestamp: number = 0;
  private interval: number = 10; // 기본값은 10초
  private cycleId: string = '1';
  private timer: NodeJS.Timeout | null = null;
  private isActive: boolean = false;
  private currentPosition: GeolocationPosition | null = null; // 현재 위치 저장
  private totalPacketsCount: number = 0; // 총 전송된 cList 항목 개수
  private totalSentPackets: number = 0; // 총 전송 패킷 수
  
  private mdn: string = '';

  public setMdn(mdn: string): void {
    this.mdn = mdn;
  }

  /**
   * GPS 버퍼를 초기화합니다.
   * @param interval 전송 주기 (초)
   * @param cycleId 차량 ID
   */
  constructor(interval: number = 10, cycleId: string = '1') {
    this.interval = interval;
    this.cycleId = cycleId;
  }

  /**
   * 버퍼에 GPS 데이터를 추가합니다.
   * @param position GPS 위치 정보
   */
  public addPosition(position: GeolocationPosition): void {
    try {
      // 위치 데이터 유효성 검사
      if (!position || !position.coords) {
        console.warn(`[${new Date().toLocaleTimeString()}] 유효하지 않은 위치 데이터 수신됨. 스킵합니다.`);
        return;
      }

      // NaN 또는 null 좌표 확인
      if (isNaN(position.coords.latitude) || isNaN(position.coords.longitude) || 
          position.coords.latitude === null || position.coords.longitude === null) {
        console.warn(`[${new Date().toLocaleTimeString()}] 잘못된 좌표 데이터 (lat: ${position.coords.latitude}, lng: ${position.coords.longitude}). 스킵합니다.`);
        return;
      }

      // 현재 위치 업데이트
      this.currentPosition = position;
      
      // 새 데이터 추가
      this.buffer.push(position);
      
      console.log(`[${new Date().toLocaleTimeString()}] GPS 데이터 추가: 위도=${position.coords.latitude.toFixed(6)}, 경도=${position.coords.longitude.toFixed(6)}, 속도=${position.coords.speed || 0}m/s, 현재 버퍼=${this.buffer.length}개`);
      
      if (!this.isActive) {
        this.startTimer();
      }
    } catch (error) {
      console.error(`[${new Date().toLocaleTimeString()}] GPS 데이터 추가 중 오류 발생: ${error}. 이 데이터는 스킵됩니다.`);
    }
  }

  /**
   * 전송 주기를 설정합니다.
   * @param interval 전송 주기 (초)
   */
  public setInterval(interval: number): void {
    const oldInterval = this.interval;
    this.interval = interval;
    
    console.log(`⚙️ 전송 주기 변경: ${oldInterval}초 → ${interval}초`);
    
    // 타이머를 재설정
    if (this.isActive) {
      this.stopTimer();
      this.startTimer();
    }
  }

  /**
   * 차량 ID를 설정합니다.
   * @param cycleId 차량 ID
   */
  public setCycleId(cycleId: string): void {
    this.cycleId = cycleId;
  }

  /**
   * 버퍼에 있는 GPS 데이터를 서버로 전송합니다.
   * @returns 전송 성공 여부
   */
  public async sendData(): Promise<boolean> {
    // 전송할 데이터가 없으면 중단
    if (this.buffer.length === 0) {
      console.log(`[${new Date().toLocaleTimeString()}] 버퍼가 비어 있어 전송을 건너뜁니다. 새 주기를 시작합니다.`);
      // 마지막 전송 시간을 현재로 업데이트하여 새로운 주기를 시작
      this.lastSentTimestamp = Date.now();
      return false;
    }
    
    // 현재 버퍼를 복사 (전송용)
    const bufferToSend = [...this.buffer];
    const bufferSize = bufferToSend.length;
    
    try {
      // GPS 데이터로 리스트 생성
      const gpsList = buildCycleGpsList(bufferToSend);
      
      // API 요청 객체 생성
      const request = {
        mdn: this.mdn,
        tid: "A001",
        mid: "6",
        pv: "5",
        did: this.cycleId,
        cCnt: gpsList.length,
        oTime: this.getKoreanTimeFormatted(),
        cList: gpsList,
      };
      
      console.log(`[${new Date().toLocaleTimeString()}] 데이터 전송 시작: ${bufferSize}개의 GPS 데이터 전송 중...`);
      
      // API 전송
      await hubApiService.sendCycleInfo(request);
      
      // 전송 후에 버퍼 비우기 (새로운 주기 시작)
      this.buffer = [];
      
      // 마지막 전송 시간 업데이트
      this.lastSentTimestamp = Date.now();
      
      // 전송된 패킷 카운트 업데이트
      this.totalPacketsCount += gpsList.length;
      this.totalSentPackets += 1;
      
      console.log(`[${new Date().toLocaleTimeString()}] 전송 완료: ${gpsList.length}개 항목이 포함된 패킷 전송 (누적: ${this.totalPacketsCount}개 항목, ${this.totalSentPackets}개 패킷)`);
      
      return true;
    } catch (error) {
      console.error(`[${new Date().toLocaleTimeString()}] GPS 데이터 전송 실패:`, error);
      
      // 실패한 경우에는 버퍼 유지 (다음 전송 시도에 포함)
      return false;
    }
  }

  /**
   * 지정된 GPS 데이터 배열을 서버로 전송합니다.
   * @param dataArray 전송할 위치 데이터 배열
   * @returns 전송 성공 여부
   */
  private async sendDataArray(dataArray: GeolocationPosition[]): Promise<boolean> {
    if (dataArray.length === 0) {
      console.log(`[${new Date().toLocaleTimeString()}] 전송할 데이터가 없습니다. 전송을 건너뜁니다.`);
      return false;
    }
    
    // 성능 개선: 전송 시작 시간 기록
    const startTime = performance.now();
    
    try {
      // GPS 데이터로 리스트 생성
      const gpsList = buildCycleGpsList(dataArray);
      
      // API 요청 객체 생성
      const request = {
        mdn: this.mdn,
        tid: "A001",
        mid: "6",
        pv: "5",
        did: this.cycleId,
        cCnt: gpsList.length,
        oTime: this.getKoreanTimeFormatted(),
        cList: gpsList,
      };
      
      console.log(`[${new Date().toLocaleTimeString()}] 데이터 전송 시작: ${dataArray.length}개의 GPS 데이터 전송 중...`);
      
      // API 전송
      await hubApiService.sendCycleInfo(request);
      
      // 마지막 전송 시간 업데이트
      this.lastSentTimestamp = Date.now();
      
      // 전송된 패킷 카운트 업데이트
      this.totalPacketsCount += gpsList.length;
      this.totalSentPackets += 1;
      
      // 성능 측정: 전송 완료 시간 계산
      const endTime = performance.now();
      const processingTime = (endTime - startTime).toFixed(2);
      
      console.log(`[${new Date().toLocaleTimeString()}] 전송 완료: ${gpsList.length}개 항목이 포함된 패킷 전송 (처리 시간: ${processingTime}ms, 누적: ${this.totalPacketsCount}개 항목, ${this.totalSentPackets}개 패킷)`);
      
      return true;
    } catch (error) {
      console.error(`[${new Date().toLocaleTimeString()}] GPS 데이터 전송 실패:`, error);
      
      // 전송 실패한 데이터는 버퍼에 다시 넣어 다음에 재시도
      this.buffer = [...dataArray, ...this.buffer];
      
      return false;
    }
  }

  /**
   * 주기적으로 데이터를 전송하는 타이머를 시작합니다.
   */
  private startTimer(): void {
    if (this.timer !== null) {
      this.stopTimer(); // 기존 타이머가 있으면 중지하고 다시 시작
    }
    
    this.isActive = true;
    
    // 최초 전송 시간이 0이면 현재 시간으로 설정
    if (this.lastSentTimestamp === 0) {
      this.lastSentTimestamp = Date.now();
      console.log(`[${new Date().toLocaleTimeString()}] 타이머 초기화: 첫 전송까지 ${this.interval}초 카운트다운 시작`);
    }
    
    // 성능 개선: 마지막 체크 시간 기록 변수 추가 (지연 감지용)
    let lastCheckTime = Date.now();
    
    // 매 초마다 확인하여 주기가 지나면 전송
    this.timer = setInterval(async () => {
      const currentTime = Date.now();
      
      // 성능 개선: 이전 체크와의 시간 차이 계산 (타이머 지연 감지)
      const timeSinceLastCheck = currentTime - lastCheckTime;
      if (timeSinceLastCheck > 1500) { // 1.5초 이상 지연되면 경고
        console.warn(`[${new Date().toLocaleTimeString()}] 타이머 지연 감지: ${(timeSinceLastCheck / 1000).toFixed(1)}초 지연됨`);
      }
      lastCheckTime = currentTime;
      
      const secondsSinceLastSent = (currentTime - this.lastSentTimestamp) / 1000;
      const secondsRemaining = Math.max(0, this.interval - secondsSinceLastSent).toFixed(1);
      
      // 매 초마다가 아니라 5초 간격이나 중요 시점에만 로그
      if (secondsSinceLastSent % 5 < 1 || secondsSinceLastSent >= this.interval - 1) {
        console.log(`⏱[${new Date().toLocaleTimeString()}] 타이머 상태: 다음 전송까지 ${secondsRemaining}초 남음 (버퍼: ${this.buffer.length}개)`);
      }
      
      if (secondsSinceLastSent >= this.interval) {
        // 주기에 맞게 정확히 데이터 전송
        console.log(`[${new Date().toLocaleTimeString()}] 주기 도달: ${this.interval}초가 지났습니다. 데이터 전송 시작...`);
        
        try {
          // 버퍼가 주기보다 크면 주기만큼만 전송, 작으면 있는만큼 전송
          if (this.buffer.length > this.interval) {
            // 버퍼에서 주기만큼만 데이터 추출
            const dataToSend = this.buffer.slice(0, this.interval);
            const remainingData = this.buffer.slice(this.interval);
            
            // 버퍼 업데이트 (남은 데이터만 보관)
            this.buffer = remainingData;
            
            // 추출한 데이터 전송
            await this.sendDataArray(dataToSend);
          } else {
            // 버퍼가 주기보다 작거나 같으면 모두 전송
            await this.sendData();
          }
        } catch (error) {
          console.error(`[${new Date().toLocaleTimeString()}] 데이터 전송 중 예외 발생:`, error);
        }
        
        console.log(`[${new Date().toLocaleTimeString()}] 새 주기 시작: 다음 전송까지 ${this.interval}초 대기, 남은 버퍼: ${this.buffer.length}개`);
      }
    }, 1000);
    
    console.log(`⏱[${new Date().toLocaleTimeString()}] GPS 데이터 수집 타이머 시작 (주기: ${this.interval}초)`);
  }

  /**
   * 타이머를 중지합니다.
   */
  private stopTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      console.log(`⏹[${new Date().toLocaleTimeString()}] GPS 데이터 수집 타이머 중지됨`);
    }
    this.isActive = false;
  }

  /**
   * 버퍼를 초기화하고 타이머를 중지합니다.
   * @param sendRemainingData 버퍼에 남은 데이터를 전송할지 여부
   */
  public async reset(sendRemainingData: boolean = false): Promise<void> {
    console.log(`[${new Date().toLocaleTimeString()}] GPS 버퍼 초기화 시작 (남은 데이터 전송: ${sendRemainingData ? '예' : '아니오'}, 버퍼 크기: ${this.buffer.length}개)`);
    
    // 남은 데이터 전송 옵션이 켜져 있고, 버퍼에 데이터가 있으면 전송
    if (sendRemainingData && this.buffer.length > 0) {
      try {
        console.log(`[${new Date().toLocaleTimeString()}] 초기화 전 버퍼에 있는 ${this.buffer.length}개의 데이터 전송 시도...`);
        
        // 시동 OFF 시 모든 데이터를 sendData 대신 sendDataArray를 사용하여 전송
        const allData = [...this.buffer];
        
        // GPS 데이터로 리스트 생성
        const gpsList = buildCycleGpsList(allData);
        
        // API 요청 객체 생성
        const request = {
          mdn: this.mdn,
          tid: "A001",
          mid: "6",
          pv: "5",
          did: this.cycleId,
          cCnt: gpsList.length,
          oTime: this.getKoreanTimeFormatted(),
          cList: gpsList,
        };
        
        // 성능 측정 시작
        const startTime = performance.now();
        
        // API 전송
        await hubApiService.sendCycleInfo(request);
        
        // 전송된 패킷 카운트 업데이트
        this.totalPacketsCount += gpsList.length;
        this.totalSentPackets += 1;
        
        // 성능 측정 완료
        const endTime = performance.now();
        const processingTime = (endTime - startTime).toFixed(2);
        
        console.log(`[${new Date().toLocaleTimeString()}] 최종 데이터 전송 완료: ${gpsList.length}개 항목이 포함된 패킷 전송 (처리 시간: ${processingTime}ms)`);
        
        // 버퍼 비우기
        this.buffer = [];
      } catch (error) {
        console.error(`[${new Date().toLocaleTimeString()}] 초기화 전 데이터 전송 실패:`, error);
        // 실패해도 계속 진행하여 버퍼를 비움
      }
    }
    
    // 타이머 중지
    this.stopTimer();
    
    // 모든 상태 초기화 (패킷 카운트 제외)
    this.buffer = [];
    this.currentPosition = null;
    this.lastSentTimestamp = 0;
    
    // 카운터 상태를 보존하고 기록
    const preservedPacketsCount = this.totalPacketsCount;
    const preservedSentPackets = this.totalSentPackets;
    
    console.log(`[${new Date().toLocaleTimeString()}] GPS 버퍼 초기화 완료: 버퍼 비움, 총 전송된 데이터: ${preservedPacketsCount}개 항목, ${preservedSentPackets}개 패킷`);
  }

  /**
   * 현재 버퍼 크기를 반환합니다.
   */
  public getBufferSize(): number {
    return this.buffer.length;
  }

  /**
   * 현재 설정된 주기를 반환합니다.
   */
  public getInterval(): number {
    return this.interval;
  }

  /**
   * 총 전송된 cList 항목 개수를 반환합니다.
   */
  public getTotalPacketsCount(): number {
    return this.totalPacketsCount;
  }

  /**
   * 총 전송 패킷 수를 반환합니다.
   */
  public getTotalSentPackets(): number {
    return this.totalSentPackets;
  }

  /**
   * 현재 한국 시간을 'yyyyMMddHHmm' 형식으로 반환합니다.
   */
  private getKoreanTimeFormatted(): string {
    const now = new Date();
    // 한국 시간은 UTC+9
    const koreanTime = new Date(now.getTime());
    
    // 'yyyyMMddHHmm' 형식으로 변환
    const year = koreanTime.getFullYear();
    const month = String(koreanTime.getMonth() + 1).padStart(2, '0');
    const day = String(koreanTime.getDate()).padStart(2, '0');
    const hours = String(koreanTime.getHours()).padStart(2, '0');
    const minutes = String(koreanTime.getMinutes()).padStart(2, '0');
    
    return `${year}${month}${day}${hours}${minutes}`;
  }
}

// 싱글톤 인스턴스 생성
const gpsBuffer = new GpsBuffer();

export default gpsBuffer; 
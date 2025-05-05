export function validateFormValues (
    rentStime: string,
    rentEtime: string,
    rentLocation: string | null,
    returnLocation: string | null

): string | null {
    const diffMs = new Date(rentEtime).getTime() - new Date(rentStime).getTime();

    if(diffMs < 1) {
        return "반납 시간은 대여 시간 이후여야 합니다."
    } else if (diffMs < 30 * 60 * 1000) {
        return "최소 대여 가능 시간은 30분입니다.";
    } else if (!rentLocation || !returnLocation) {
        return "대여 위치와 반납 위치를 입력해주세요.";
    }
    return null;
}
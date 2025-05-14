// 공지사항 타입
export type NoticeTypes = {
    title: string;
    content: string;
    isImportant: boolean;// 중요 공지 여부
}

// 첨부파일 타입 정의
export type AttachmentType = {
    id?: number;
    name: string;
    url: string;
    size?: number;
    type?: string;
}

export type NoticeDetailTypes = {
    id: number;
    title: string;
    content: string;
    createdAt: string;// 작성일
    isImportant: boolean;// 중요 공지 여부
    attachments?: AttachmentType[]; // 첨부파일 목록
}
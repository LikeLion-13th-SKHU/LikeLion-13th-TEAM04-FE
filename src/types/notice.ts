export type NoticeCategory = "디자인" | "개발" | "영상" | "마케팅" | "기타";

export interface NoticePost {
  id: string;
  region: string; // 예: "서울시 노원구"
  title: string;
  pay: number; // 원 단위
  createdAt: string; // YYYY.MM.DD 또는 YYYY.M.DD
  category: NoticeCategory;
  // 상세 페이지용 확장 필드 (목업 우선, 선택적)
  headcount?: number;
  deadline?: string; // YYYY/MM/DD
  workPeriodStart?: string; // YYYY/MM/DD
  workPeriodEnd?: string; // YYYY/MM/DD
  workHours?: string; // 예: "10:00~18:00"
  description?: string;
  logoUrl?: string;
}

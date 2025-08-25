export type NoticeCategory =
  | "CAFE"
  | "RESTAURANT"
  | "SUPERMARKET"
  | "LIFE"
  | "EDUCATION"
  | "CULTURE"
  | "ADD";

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
  authorId?: number; // 공고글 작성자 ID
  isUser?: boolean; // 로그인 사용자가 작성자인지 여부
}

export interface BackendPostItem {
  post_id: number;
  title: string;
  location: string;
  salary: number;
  createAt: string;
  memberId?: number; // 공고글 작성자 ID
}

export interface BackendPaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
}

export interface BackendPostsResponse {
  success: boolean;
  code: string;
  message: string;
  data: {
    posts: BackendPostItem[];
    pagination: BackendPaginationInfo;
  };
}

export interface BackendPostDetailData {
  title: string;
  content: string;
  location: string;
  salary: number;
  work_time: string;
  tags: string;
  deadline: string; // 2025.07.25
  num: number; // headcount
  work_period: string; // 2025.07.27~2025.07.28
  createAt: string; // 2025.07.20
  category: string; // 예: 카페
  memberId?: number; // 공고글 작성자 ID (구버전 호환)
  postUserId?: number; // 공고글 작성자 ID (신버전)
  isUser?: boolean; // 로그인 사용자가 작성자인지 여부
}

export interface BackendPostDetailResponse {
  success: boolean;
  code: string;
  message: string;
  data: BackendPostDetailData;
}

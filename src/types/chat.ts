export type ChatMessageRole = "bot" | "user";

export type SelectedRole = "상인" | "청년";

export type ChatMessageText = {
  id: string;
  role: ChatMessageRole;
  kind: "text";
  text: string;
  createdAt: number;
};

export type ChatMessageRecommendations = {
  id: string;
  role: ChatMessageRole;
  kind: "recommendations";
  recommendations: Recommendation[];
  createdAt: number;
};

export type ChatMessage = ChatMessageText | ChatMessageRecommendations;

export type MatchIntentPayload = {
  role: SelectedRole;
  rawDetails: string[]; // 사용자가 입력한 문장 리스트
  summary: string; // 화면에 보인 요약 텍스트
  recentMessages: Array<{
    role: ChatMessageRole;
    text: string;
    createdAt: number;
  }>; // 최근 N개 메시지
  clientMeta?: { source: string; version?: string };
};

export type Recommendation = {
  id: string;
  name: string;
  age: number;
  gender: "남성" | "여성" | "무관";
  title: string; // 직무 타이틀 요약
  availability: string; // 가능 시간
  region: string; // 지역
  experience?: string; // 경력 요약
  matchRate: number; // 0~100
  // 상인 추천 전용 필드 (청년에게 보여줄 때)
  storeName?: string;
  industry?: string;
  hiringRole?: string;
};

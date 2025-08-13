import { useCallback, useMemo, useRef, useState } from "react";
// import axios from "axios"; // API 연동 시 주석 해제
import type { ChatMessage, SelectedRole, Recommendation } from "../types/chat";

const INITIAL_BOT_MESSAGE =
  "안녕하세요 청상회 AI 매칭 챗봇입니다.\n상인인지 청년인지 선택해주세요";

export type UseChatFlowResult = {
  role: SelectedRole | null;
  messages: ChatMessage[];
  input: string;
  canSend: boolean;
  setInput: (v: string) => void;
  selectRole: (role: SelectedRole) => void;
  submitInput: () => void;
  confirmAndSend: () => Promise<void>;
  sending: boolean;
  error: string | null;
  summaryReady: boolean;
  showSummary: () => void;
  templateVisible: boolean;
  toggleTemplateVisible: () => void;
  recommendations: Recommendation[];
  reset: () => void;
};

export const useChatFlow = (): UseChatFlowResult => {
  const [role, setRole] = useState<SelectedRole | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: crypto.randomUUID(),
      role: "bot",
      kind: "text",
      text: INITIAL_BOT_MESSAGE,
      createdAt: Date.now(),
    },
  ]);
  const [input, setInput] = useState<string>("");

  const detailsBufferRef = useRef<string[]>([]);
  const summaryTextRef = useRef<string>("");
  const [sending, setSending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [summaryReady, setSummaryReady] = useState<boolean>(false);
  const [templateVisible, setTemplateVisible] = useState<boolean>(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  const canSend = useMemo(
    () => input.trim().length > 0 && role !== null,
    [input, role]
  );

  const pushText = useCallback((role: "bot" | "user", text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role,
        kind: "text",
        text,
        createdAt: Date.now(),
      },
    ]);
  }, []);

  const pushRecommendations = useCallback(
    (role: "bot" | "user", recs: Recommendation[]) => {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role,
          kind: "recommendations",
          recommendations: recs,
          createdAt: Date.now(),
        },
      ]);
    },
    []
  );

  const selectRole = useCallback(
    (nextRole: SelectedRole) => {
      if (role) return;
      setRole(nextRole);
      pushText("user", nextRole);
      pushText(
        "bot",
        nextRole === "상인"
          ? "어떤 분을 찾고 계신가요?\n예시 입력을 기준으로 자유롭게 입력해 주세요."
          : "어떤 일을 할 수 있고 어느 지역에서 언제 일하고 싶은지 알려주세요.\n예시 입력을 기준으로 자유롭게 입력해 주세요."
      );
    },
    [role, pushText]
  );

  const submitInput = useCallback(() => {
    if (!canSend) return;
    const text = input.trim();
    setInput("");
    pushText("user", text);
    detailsBufferRef.current.push(text);

    const summaryText = detailsBufferRef.current.length
      ? `요약:\n- ${detailsBufferRef.current.join("\n- ")}`
      : "";
    summaryTextRef.current = summaryText;
    setSummaryReady(summaryText.length > 0);
  }, [canSend, input, pushText]);

  const showSummary = useCallback(() => {
    if (!summaryTextRef.current) {
      if (detailsBufferRef.current.length > 0) {
        summaryTextRef.current = `요약:\n- ${detailsBufferRef.current.join(
          "\n- "
        )}`;
      } else {
        summaryTextRef.current = "요약: 아직 입력이 없습니다";
      }
    }

    pushText(
      "bot",
      `${summaryTextRef.current}\n\n해당 정보로 진행할까요? (계속 입력해도 됩니다...)\n\n(확정 및 전송 버튼을 누르면 추천 목록이 업데이트됩니다.)`
    );
  }, [pushText]);

  const confirmAndSend = useCallback(async () => {
    if (!role) return;
    setSending(true);
    setError(null);
    // const recentMessages = messages.slice(-5);
    // payload 미리보기는 API 연동 시 생성하여 전송하세요

    /*
    // 준비되면 주석 해제하여 실제 전송
    // await axios.post(
    //   "/api/match/intents",
    //   _payload,
    //   { headers: { "Content-Type": "application/json" } }
    // );
    */

    // 임시 응답 처리: 샘플 추천 목록 생성
    const sample: Recommendation[] = [
      {
        id: crypto.randomUUID(),
        name: role === "상인" ? "최최최" : "청년 상점",
        age: 21,
        gender: "여성",
        title: role === "상인" ? "AI 개발자, 경력 없음" : "카페 · 음료",
        availability: role === "상인" ? "오전, 오후" : "상시",
        region: role === "상인" ? "계양구" : "연남동",
        storeName: role === "청년" ? "네모 카페" : undefined,
        industry: role === "청년" ? "카페/디저트" : undefined,
        hiringRole: role === "청년" ? "바리스타" : undefined,
        matchRate: 80,
      },
      {
        id: crypto.randomUUID(),
        name: role === "상인" ? "기기기" : "두부 식당",
        age: 25,
        gender: "남성",
        title: role === "상인" ? "백엔드 개발자, 경력 없음" : "한식 · 일반식당",
        availability: role === "상인" ? "오후" : "주5일",
        region: role === "상인" ? "부평구" : "구월동",
        storeName: role === "청년" ? "두부네" : undefined,
        industry: role === "청년" ? "한식" : undefined,
        hiringRole: role === "청년" ? "홀서빙" : undefined,
        matchRate: 98,
      },
      {
        id: crypto.randomUUID(),
        name: role === "상인" ? "웅웅웅" : "파란 빵집",
        age: 29,
        gender: "여성",
        title:
          role === "상인" ? "프론트엔드 개발자, 경력 5년" : "베이커리 · 제과",
        availability: role === "상인" ? "오전" : "주말",
        region: role === "상인" ? "구로구" : "상암동",
        storeName: role === "청년" ? "파란 빵집" : undefined,
        industry: role === "청년" ? "베이커리" : undefined,
        hiringRole: role === "청년" ? "제과제빵 보조" : undefined,
        matchRate: 86,
      },
    ];
    setRecommendations(sample);
    pushRecommendations("bot", sample);
    setSummaryReady(false);
    setSending(false);
  }, [role, pushRecommendations]);

  const reset = useCallback(() => {
    setRole(null);
    setMessages([
      {
        id: crypto.randomUUID(),
        role: "bot",
        kind: "text",
        text: INITIAL_BOT_MESSAGE,
        createdAt: Date.now(),
      },
    ]);
    setInput("");
    detailsBufferRef.current = [];
    summaryTextRef.current = "";
    setSummaryReady(false);
    setTemplateVisible(false);
    setRecommendations([]);
  }, []);

  const toggleTemplateVisible = useCallback(() => {
    setTemplateVisible((v) => !v);
  }, []);

  return {
    role,
    messages,
    input,
    canSend,
    setInput,
    selectRole,
    submitInput,
    confirmAndSend,
    sending,
    error,
    summaryReady,
    showSummary,
    templateVisible,
    toggleTemplateVisible,
    recommendations,
    reset,
  };
};

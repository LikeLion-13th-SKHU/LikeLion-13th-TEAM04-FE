import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createChatRoom, sendAiChat } from "../api/chat";
import type { ChatMessage, SelectedRole, Recommendation } from "../types/chat";
import { useAuth } from "../contexts/AuthContext";

const INITIAL_HELLO =
  "안녕하세요. 잘 부탁드립니다.\n주의 사항: \n1. 새로고침시에 채팅방이 초기화됩니다.";

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
  const { user } = useAuth();
  const [role, setRole] = useState<SelectedRole | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>("");

  const detailsBufferRef = useRef<string[]>([]);
  const summaryTextRef = useRef<string>("");
  const [sending, setSending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [summaryReady, setSummaryReady] = useState<boolean>(false);
  const [templateVisible, setTemplateVisible] = useState<boolean>(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [roomId, setRoomId] = useState<number | null>(null);
  const initializedRef = useRef(false);

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

  // 봇 답변이 "추천 후보"로 시작하면 텍스트 말풍선 생략
  const pushBotReply = useCallback(
    (reply: string) => {
      const trimmed = (reply || "").trim();
      if (trimmed.startsWith("추천 후보")) return;
      pushText("bot", reply);
    },
    [pushText]
  );

  const pushRecommendations = useCallback(
    (role: "bot" | "user", recs: Recommendation[]) => {
      if (!recs || recs.length === 0) return;
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

  const mapResultsToRecommendations = useCallback(
    (results: any[]): Recommendation[] => {
      return (results || []).map((r: any, idx: number) => {
        const profile: string = String(r.profile || "");
        const tokens = profile.split(",").map((s) => s.trim());
        const region = tokens.find((t) => /시|구|동/.test(t)) || "";
        const availability =
          tokens.find((t) => /(오전|오후|야간|주|주말|평일|상시)/.test(t)) ||
          "";
        const genderRaw = String(r.gender || "");
        const gender =
          genderRaw === "남성" || genderRaw === "여성" ? genderRaw : "무관";
        const matchRate = typeof r.score === "number" ? r.score : 0;
        const title = r.job || r.skills || tokens[0] || "추천";
        return {
          id: String(r.id ?? idx),
          name: String(r.name || "이름 미상"),
          age: 0,
          gender,
          title: String(title),
          availability: String(availability),
          region: String(region),
          experience: undefined,
          matchRate,
        } as Recommendation;
      });
    },
    []
  );

  // 역할(청년/상인) 선택 시 실행
  const selectRole = useCallback(
    (nextRole: SelectedRole) => {
      if (role) return;
      setRole(nextRole);
      pushText("user", nextRole);

      (async () => {
        try {
          const my = Number(
            (user?.memberId as unknown as number) ??
              (user?.id ? Number(user.id) : 0)
          );
          if (!my) return;
          let currentRoomId = roomId;
          if (currentRoomId == null) {
            const res = await createChatRoom();
            currentRoomId = res.data.roomId;
            setRoomId(currentRoomId);
          }

          const ai = await sendAiChat({
            roomId: currentRoomId,
            userId: my,
            text: nextRole,
          });

          pushBotReply(ai.data.reply);
          const recs = mapResultsToRecommendations(ai.data.results);
          pushRecommendations("bot", recs);
        } catch (e: any) {}
      })();
    },
    [
      role,
      roomId,
      user,
      mapResultsToRecommendations,
      pushRecommendations,
      pushBotReply,
    ]
  );

  // 입력 전송 버튼 클릭 시 실행
  const submitInput = useCallback(async () => {
    if (!canSend) return;
    const text = input.trim();
    setInput("");
    pushText("user", text);
    detailsBufferRef.current.push(text);

    try {
      const my = Number(
        (user?.memberId as unknown as number) ??
          (user?.id ? Number(user.id) : 0)
      );
      if (!my) throw new Error("로그인이 필요합니다.");
      let currentRoomId = roomId;
      if (currentRoomId == null) {
        const res = await createChatRoom();
        currentRoomId = res.data.roomId;
        setRoomId(currentRoomId);
      }
      const ai = await sendAiChat({ roomId: currentRoomId, userId: my, text });
      pushBotReply(ai.data.reply);

      const recs = mapResultsToRecommendations(ai.data.results);
      pushRecommendations("bot", recs);
    } catch (e: any) {
      setError(e.message || "메시지 전송에 실패했습니다.");
    }

    const summaryText = detailsBufferRef.current.length
      ? `요약:\n- ${detailsBufferRef.current.join("\n- ")}`
      : "";
    summaryTextRef.current = summaryText;
    setSummaryReady(summaryText.length > 0);
  }, [
    canSend,
    input,
    pushText,
    roomId,
    user,
    mapResultsToRecommendations,
    pushRecommendations,
    pushBotReply,
  ]);

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

  // 확정 및 전송 버튼 클릭 시 실행
  const confirmAndSend = useCallback(async () => {
    if (!role) return;
    setSending(true);
    setError(null);

    try {
      const my = Number(
        (user?.memberId as unknown as number) ??
          (user?.id ? Number(user.id) : 0)
      );
      if (!my) throw new Error("로그인이 필요합니다.");

      if (roomId == null) {
        const roomRes = await createChatRoom();
        setRoomId(roomRes.data.roomId);
      }

      const text = summaryTextRef.current || detailsBufferRef.current.join(" ");
      if (!text) throw new Error("전송할 내용이 없습니다.");

      const res = await sendAiChat({
        roomId:
          roomId ||
          (await (async () => {
            const tmp = await createChatRoom();
            return tmp.data.roomId;
          })()),
        userId: my,
        text,
      });

      pushBotReply(res.data.reply);
      const recs = mapResultsToRecommendations(res.data.results);
      pushRecommendations("bot", recs);
      setSummaryReady(false);
    } catch (e: any) {
      setError(e.message || "전송 중 오류가 발생했습니다.");
    } finally {
      setSending(false);
    }
  }, [
    role,
    roomId,
    pushText,
    user,
    mapResultsToRecommendations,
    pushRecommendations,
    pushBotReply,
  ]);

  const reset = useCallback(() => {
    setRole(null);
    setMessages([]);
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

  // 초기 로드 시 방 생성 및 인사로 대화 시작 (중복 호출 방지)
  useEffect(() => {
    if (!user) return;
    if (initializedRef.current) return;
    initializedRef.current = true;

    (async () => {
      try {
        const my = Number(
          (user?.memberId as unknown as number) ??
            (user?.id ? Number(user.id) : 0)
        );
        if (!my) return;

        let currentRoomId = roomId;
        if (currentRoomId == null) {
          const res = await createChatRoom();
          currentRoomId = res.data.roomId;
          setRoomId(currentRoomId);
        }

        pushText("user", INITIAL_HELLO);

        const ai = await sendAiChat({
          roomId: currentRoomId,
          userId: my,
          text: INITIAL_HELLO,
        });

        pushBotReply(ai.data.reply);
        const recs = mapResultsToRecommendations(ai.data.results);
        pushRecommendations("bot", recs);
      } catch {}
    })();
  }, [user]);

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

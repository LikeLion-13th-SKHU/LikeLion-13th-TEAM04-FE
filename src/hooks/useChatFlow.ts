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

          pushText("bot", ai.data.reply);
          if (ai.data.results && ai.data.results.length > 0) {
            // 결과가 오면 추천 리스트로 렌더 (현재는 any[]라 단순 문자열화)
            pushText(
              "bot",
              Array.isArray(ai.data.results)
                ? ai.data.results.map((r) => JSON.stringify(r)).join("\n")
                : String(ai.data.results)
            );
          }
        } catch (e: any) {}
      })();
    },
    [role, pushText, roomId, user]
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
      pushText("bot", ai.data.reply);
      if (ai.data.results && ai.data.results.length > 0) {
        pushText(
          "bot",
          Array.isArray(ai.data.results)
            ? ai.data.results.map((r) => JSON.stringify(r)).join("\n")
            : String(ai.data.results)
        );
      }
    } catch (e: any) {
      setError(e.message || "메시지 전송에 실패했습니다.");
    }

    const summaryText = detailsBufferRef.current.length
      ? `요약:\n- ${detailsBufferRef.current.join("\n- ")}`
      : "";
    summaryTextRef.current = summaryText;
    setSummaryReady(summaryText.length > 0);
  }, [canSend, input, pushText, roomId, user]);

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
          roomId ??
          (await (async () => {
            const tmp = await createChatRoom();
            return tmp.data.roomId;
          })()),
        userId: my,
        text,
      });

      pushText("bot", res.data.reply);
      if (res.data.results && res.data.results.length > 0) {
        pushText(
          "bot",
          Array.isArray(res.data.results)
            ? res.data.results.map((r) => JSON.stringify(r)).join("\n")
            : String(res.data.results)
        );
      }
      setSummaryReady(false);
    } catch (e: any) {
      setError(e.message || "전송 중 오류가 발생했습니다.");
    } finally {
      setSending(false);
    }
  }, [role, roomId, pushText, user]);

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

  // 초기 로드 시 방 생성 및 인사로 대화 시작
  useEffect(() => {
    if (initializedRef.current) return;
    if (!user) return;

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

        pushText("bot", ai.data.reply);
        if (ai.data.results && ai.data.results.length > 0) {
          pushText(
            "bot",
            Array.isArray(ai.data.results)
              ? ai.data.results.map((r) => JSON.stringify(r)).join("\n")
              : String(ai.data.results)
          );
        }
        initializedRef.current = true;
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

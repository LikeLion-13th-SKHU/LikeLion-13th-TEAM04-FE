import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { colors } from "../styles/theme";
import type { ChatMessageItem, User } from "../types/userChat";
import { useAuth } from "../contexts/AuthContext";
import { axiosInstance } from "../utils/apiConfig";
import {
  getRoomMessages,
  type ChatMessageHistoryItem,
  sendRoomMessage,
} from "../api/chat";

export default function ChatRoomPage() {
  const { chatRoomId } = useParams<{ chatRoomId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [messagesCursor, setMessagesCursor] = useState<number | null>(null);
  const [hasNext, setHasNext] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const messageIdSetRef = useRef<Set<string>>(new Set());
  const getAvatarUrlFor = (senderId: number | string): string => {
    const me = Number(user?.id);
    const sid = Number(senderId);
    if (!Number.isNaN(me) && me === sid) return user?.profileImageUrl || "";
    return otherUser?.profileImageUrl || "";
  };
  const parseServerDateToMs = (value: unknown): number => {
    try {
      if (Array.isArray(value)) {
        const [y, m, d, hh = 0, mm = 0, ss = 0, ns = 0] = value as number[];
        const ms = Math.floor((ns as number) / 1_000_000);
        return new Date(
          y as number,
          (m as number) - 1,
          d as number,
          hh as number,
          mm as number,
          ss as number,
          ms
        ).getTime();
      }
      if (typeof value === "number") {
        return value > 1e12 ? value : value * 1000;
      }
      if (typeof value === "string") {
        const s = value.trim();
        if (/^\d+$/.test(s)) {
          const n = Number(s);
          return n > 1e12 ? n : n * 1000;
        }
        return new Date(s.replaceAll(".", "-")).getTime();
      }
    } catch (_) {}
    return Date.now();
  };

  // 채팅방 정보와 메시지 가져오기
  useEffect(() => {
    const fetchChatRoomData = async () => {
      if (!isAuthenticated || !user || !chatRoomId) return;

      try {
        setIsLoading(true);
        setError(null);

        // 1) 목록에서 전달된 상대 정보가 있으면 우선 반영 (빠른 렌더)
        const state = (location.state as any) || {};
        if (state.otherUser && !otherUser) {
          const u = state.otherUser;
          setOtherUser({
            id: String(u.id),
            name: u.name,
            profileImageUrl: u.profileImageUrl || "",
            role: "청년",
            isOnline: false,
          });
        }

        // 2) 백업으로 서버에서 현재 방의 상대 사용자 정보 재확인
        const roomResponse = await axiosInstance.get(
          `/chat/rooms?userId=${user.id}`
        );
        if (roomResponse.status === 200) {
          const rooms = roomResponse.data.data || [];
          const currentRoom = rooms.find(
            (room: any) => room.id === parseInt(chatRoomId)
          );
          if (currentRoom) {
            const profile = currentRoom.participantProfile;
            if (profile && typeof profile.userId === "number") {
              setOtherUser({
                id: String(profile.userId),
                name: profile.name || `사용자 ${profile.userId}`,
                profileImageUrl: profile.profileImage || "",
                role: "청년",
                isOnline: false,
              });
            }
          }
        }

        // 메시지 가져오기 (첫 페이지)
        const history = await getRoomMessages(parseInt(chatRoomId), {
          size: 50,
        });
        if (history.success) {
          const items: ChatMessageHistoryItem[] = history.data?.content ?? [];
          const mapped: ChatMessageItem[] = items.map((m) => ({
            id: String(m.id),
            senderId: String(m.senderId),
            senderName:
              m.senderId === Number(user.id)
                ? user.name
                : `사용자 ${m.senderId}`,
            senderAvatarUrl: getAvatarUrlFor(m.senderId),
            content: m.type === "ENTER" ? "입장했습니다." : m.content,
            createdAt: parseServerDateToMs(m.createdAt as any),
            isRead: true,
          }));
          mapped.sort((a, b) => a.createdAt - b.createdAt);
          setMessages(mapped);
          messageIdSetRef.current = new Set(mapped.map((m) => m.id));
          setHasNext(Boolean(history.data?.hasNext));
          setMessagesCursor(history.data?.nextCursor ?? null);
        }
      } catch (error) {
        // 더 자세한 에러 메시지
        let errorMessage = "채팅방을 불러오는데 실패했습니다.";
        if (error && typeof error === "object" && "response" in error) {
          const apiError = error as any;
          if (apiError.response?.status === 404) {
            errorMessage = "채팅방을 찾을 수 없습니다. (404 Not Found)";
          } else if (apiError.response?.status === 401) {
            errorMessage = "인증이 필요합니다. (401 Unauthorized)";
          } else if (apiError.response?.status === 403) {
            errorMessage = "접근 권한이 없습니다. (403 Forbidden)";
          }
        }

        setError(errorMessage);
        // 에러 발생 시 기본 메시지 설정
        setMessages([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatRoomData();
  }, [chatRoomId, isAuthenticated, user]);

  // 메시지 전송
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !user || !chatRoomId) return;

    const optimistic: ChatMessageItem = {
      id: `temp-${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      senderAvatarUrl: user.profileImageUrl,
      content: inputMessage.trim(),
      createdAt: Date.now(),
      isRead: true,
    };
    setMessages((prev) => [...prev, optimistic]);
    const text = inputMessage.trim();
    setInputMessage("");

    try {
      const res = await sendRoomMessage(parseInt(chatRoomId), {
        type: "TALK",
        content: text,
      });
      if (res.success) {
        const m = res.data;
        const confirmed: ChatMessageItem = {
          id: String(m.id),
          senderId: String(m.senderId),
          senderName: user.name,
          senderAvatarUrl: getAvatarUrlFor(m.senderId),
          content: m.content,
          createdAt: parseServerDateToMs(m.createdAt as any),
          isRead: true,
        };
        setMessages((prev) =>
          prev.map((msg) => (msg.id === optimistic.id ? confirmed : msg))
        );
        messageIdSetRef.current.add(confirmed.id);
      }
    } catch (err) {
      // 실패 시 낙관적 메시지 제거 및 입력 복구
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      setInputMessage(text);
      setError("메시지 전송에 실패했습니다.");
    }
  };

  // 엔터키로 메시지 전송
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isComposing = (e.nativeEvent as any)?.isComposing;
    if (isComposing) return; // 한글 입력 중에는 전송 방지

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (inputMessage.trim() && user) {
        const form = e.currentTarget.form;
        if (form) form.requestSubmit();
      }
    }
  };

  // 스크롤을 맨 아래로
  useEffect(() => {
    if (!isAuthenticated || !user) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAuthenticated, user]);

  // 폴링으로 새 메시지 주기적 수신
  useEffect(() => {
    if (!isAuthenticated || !user || !chatRoomId) return;

    const intervalId = window.setInterval(async () => {
      try {
        const history = await getRoomMessages(parseInt(chatRoomId), {
          size: 20,
        });
        if (history.success) {
          const items: ChatMessageHistoryItem[] = history.data?.content ?? [];
          let polled: ChatMessageItem[] = items.map((m) => ({
            id: String(m.id),
            senderId: String(m.senderId),
            senderName:
              m.senderId === Number(user.id)
                ? user.name
                : `사용자 ${m.senderId}`,
            senderAvatarUrl: getAvatarUrlFor(m.senderId),
            content: m.type === "ENTER" ? "입장했습니다." : m.content,
            createdAt: parseServerDateToMs(m.createdAt as any),
            isRead: true,
          }));
          polled = polled.filter((m) => !messageIdSetRef.current.has(m.id));
          if (polled.length > 0) {
            polled.sort((a, b) => a.createdAt - b.createdAt);
            setMessages((prev) => [...prev, ...polled]);
            polled.forEach((m) => messageIdSetRef.current.add(m.id));
          }
        }
      } catch (e) {
        // ignore polling errors
      }
    }, 2000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isAuthenticated, user, chatRoomId]);

  // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
  if (!isAuthenticated || !user) {
    navigate("/login");
    return null;
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const loadMoreMessages = async () => {
    if (!chatRoomId || messagesCursor == null || isLoadingMore) return;
    try {
      setIsLoadingMore(true);
      const history = await getRoomMessages(parseInt(chatRoomId), {
        cursor: messagesCursor,
        size: 50,
      });
      if (history.success) {
        const items: ChatMessageHistoryItem[] = history.data?.content ?? [];
        const mapped: ChatMessageItem[] = items.map((m) => ({
          id: String(m.id),
          senderId: String(m.senderId),
          senderName:
            m.senderId === Number(user.id) ? user.name : `사용자 ${m.senderId}`,
          senderAvatarUrl: getAvatarUrlFor(m.senderId),
          content: m.type === "ENTER" ? "입장했습니다." : m.content,
          createdAt: parseServerDateToMs(m.createdAt as any),
          isRead: true,
        }));
        setMessages((prev) => [...mapped, ...prev]);
        mapped.forEach((m) => messageIdSetRef.current.add(m.id));
        setHasNext(Boolean(history.data?.hasNext));
        setMessagesCursor(history.data?.nextCursor ?? null);
      }
    } finally {
      setIsLoadingMore(false);
    }
  };

  // 로딩 중이거나 에러가 있는 경우 처리
  if (isLoading) {
    return (
      <PageContainer>
        <LoadingState>
          <LoadingIcon>⏳</LoadingIcon>
          <LoadingText>채팅방을 불러오는 중...</LoadingText>
        </LoadingState>
      </PageContainer>
    );
  }

  if (error || !otherUser) {
    return (
      <PageContainer>
        <ErrorState>
          <ErrorIcon>⚠️</ErrorIcon>
          <ErrorText>{error || "채팅방 정보를 불러올 수 없습니다."}</ErrorText>
          <RetryButton onClick={() => window.location.reload()}>
            다시 시도
          </RetryButton>
        </ErrorState>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ChatHeader>
        <BackButton onClick={() => navigate("/chat")}>←</BackButton>
        <UserInfo>
          <UserAvatar src={otherUser.profileImageUrl} alt={otherUser.name} />
          <div>
            <UserName>{otherUser.name}</UserName>
          </div>
        </UserInfo>
      </ChatHeader>

      <ChatContainer>
        <MessagesContainer>
          {hasNext && (
            <LoadMoreContainer>
              <LoadMoreButton
                onClick={loadMoreMessages}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? "불러오는 중..." : "이전 메시지 더 보기"}
              </LoadMoreButton>
            </LoadMoreContainer>
          )}
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              $isMine={message.senderId === user.id}
            >
              {message.senderId !== user.id && (
                <MessageAvatar
                  src={message.senderAvatarUrl || "/default-avatar.png"}
                  alt={message.senderName}
                />
              )}
              <MessageContent $isMine={message.senderId === user.id}>
                <MessageText $isMine={message.senderId === user.id}>
                  {message.content}
                </MessageText>
                <MessageTime>{formatTime(message.createdAt)}</MessageTime>
              </MessageContent>
            </MessageBubble>
          ))}
          <div ref={messagesEndRef} />
        </MessagesContainer>
      </ChatContainer>

      <InputContainer>
        <MessageForm onSubmit={handleSendMessage}>
          <MessageInput
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onCompositionStart={() => {
              /* IME 시작 */
            }}
            onCompositionEnd={() => {
              /* IME 종료 */
            }}
            placeholder="메시지를 입력하세요..."
            rows={1}
          />
          <SendButton type="submit" disabled={!inputMessage.trim()}>
            전송
          </SendButton>
        </MessageForm>
      </InputContainer>
    </PageContainer>
  );
}

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 3.75rem);
  background-color: ${colors.white};
  max-width: 768px;
  margin: 0 auto;
  width: 100%;
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #5a6bb2 0%, #2142ab 100%);
  color: ${colors.white};
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 1.1rem;
  cursor: pointer;
  border-radius: 9999px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const UserAvatar = styled.img`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.8);
`;

const UserName = styled.div`
  font-weight: 700;
  color: ${colors.white};
  font-size: 0.95rem;
`;

const UserStatus = styled.div<{ $isOnline: boolean }>`
  font-size: 0.75rem;
  color: ${(props) => (props.$isOnline ? "#10B981" : colors.gray[500])};
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  background: ${(props) =>
    props.$isOnline ? "rgba(16, 185, 129, 0.1)" : "rgba(107, 114, 128, 0.1)"};
  border-radius: 1rem;
  border: 1px solid
    ${(props) =>
      props.$isOnline ? "rgba(16, 185, 129, 0.2)" : "rgba(107, 114, 128, 0.2)"};
`;

const ChatContainer = styled.div`
  flex: 1;
  overflow: hidden;
  background-color: ${colors.gray[50]};
  min-height: 0;
`;

const MessagesContainer = styled.div`
  height: 80%;
  overflow-y: auto;
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 0;
`;

const MessageBubble = styled.div<{ $isMine: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  justify-content: ${(props) => (props.$isMine ? "flex-end" : "flex-start")};
  margin-bottom: 0.5rem;
`;

const MessageAvatar = styled.img`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  border: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  margin-top: 0.25rem;

  &:hover {
    transform: scale(1.05);
  }
`;

const MessageContent = styled.div<{ $isMine: boolean }>`
  max-width: 70%;
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.$isMine ? "flex-end" : "flex-start")};
  justify-content: flex-start;
`;

const MessageText = styled.div<{ $isMine?: boolean }>`
  padding: 0.6rem 0.9rem;
  border-radius: 1rem;
  background-color: ${(p) => (p.$isMine ? colors.blue[900] : colors.white)};
  color: ${(p) => (p.$isMine ? colors.white : colors.gray[900])};
  font-size: 0.9rem;
  line-height: 1.4;
  word-wrap: break-word;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
`;

const MessageTime = styled.div`
  font-size: 0.75rem;
  color: ${colors.gray[500]};
  margin-top: 0.25rem;
`;

const InputContainer = styled.div`
  padding: 0.75rem 1rem;
  border-top: 1px solid ${colors.gray[200]};
  background-color: ${colors.white};
  margin-top: auto;
`;

const MessageForm = styled.form`
  display: flex;
  gap: 0.75rem;
  align-items: flex-end;
`;

const MessageInput = styled.textarea`
  flex: 1;
  padding: 0.8rem 1rem;
  border: 1px solid ${colors.gray[300]};
  border-radius: 1rem;
  resize: none;
  font-family: inherit;
  font-size: 0.9rem;
  line-height: 1.4;
  outline: none;
  transition: border-color 0.2s ease;
  background-color: ${colors.white};

  &:focus {
    border-color: ${colors.blue[600]};
  }

  &::placeholder {
    color: ${colors.gray[400]};
  }
`;

const SendButton = styled.button`
  padding: 0.7rem 1rem;
  background: ${colors.blue[900]};
  color: ${colors.white};
  border: none;
  border-radius: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s ease;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    background: ${colors.blue[800]};
  }

  &:disabled {
    background: ${colors.gray[300]};
    cursor: not-allowed;
  }
`;

const LoadMoreContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 0.5rem;
`;

const LoadMoreButton = styled.button`
  padding: 0.5rem 0.75rem;
  border-radius: 0.75rem;
  border: 1px solid ${colors.gray[300]};
  background: ${colors.white};
  color: ${colors.gray[700]};
  font-size: 0.8125rem;
  cursor: pointer;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
`;

const LoadingIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  animation: spin 1s linear infinite;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  font-size: 1rem;
  color: ${colors.gray[600]};
  margin: 0;
`;

const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
`;

const ErrorIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const ErrorText = styled.p`
  font-size: 1rem;
  color: ${colors.red[600]};
  margin: 0 0 1rem 0;
`;

const RetryButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${colors.blue[600]};
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${colors.blue[700]};
  }
`;

import { useEffect, useRef } from "react";
import styled from "styled-components";
import ChatMessageBubble from "../components/chat/ChatMessageBubble";
import RoleOptions from "../components/chat/RoleOptions";
import ChatInputBar from "../components/chat/ChatInputBar";
import { useChatFlow } from "../hooks/useChatFlow";
import { useAuth } from "../contexts/AuthContext";

const AIMatchChatPage = () => {
  const { role, messages, input, setInput, selectRole, submitInput } =
    useChatFlow();
  const { user } = useAuth();
  const listEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitInput();
  };

  return (
    <PageRoot>
      <PageTitle>매칭 챗봇</PageTitle>

      <ChatWindow role="log" aria-label="채팅 내용">
        {messages.map((m) => (
          <ChatMessageBubble
            key={m.id}
            mine={m.role === "user"}
            text={m.kind === "text" ? m.text : undefined}
            recommendations={
              m.kind === "recommendations" ? m.recommendations : undefined
            }
            roleContext={role ?? undefined}
            showBotAvatar={m.role === "bot"}
            createdAt={m.createdAt}
            userAvatarUrl={
              m.role === "user" ? user?.profileImageUrl : undefined
            }
          />
        ))}
        {role === null && <RoleOptions onSelect={selectRole} />}
        <div ref={listEndRef} />
      </ChatWindow>

      <ChatInputBar
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
        disabled={role === null}
        placeholder={
          role
            ? "원하는 조건을 자유롭게 입력하세요"
            : "먼저 청년/상인을 선택하세요"
        }
      />
    </PageRoot>
  );
};

export default AIMatchChatPage;

const PageRoot = styled.section`
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: calc(100dvh - 6rem);
  max-width: 40rem;
  margin: 0 auto;
  padding: 1rem 1rem 1.25rem;
`;

const PageTitle = styled.h1`
  text-align: center;
  font-size: 1rem;
  font-weight: 700;
  margin: 0.25rem 0 0.75rem;
`;

const ChatWindow = styled.div`
  overflow-y: auto;
  padding: 0.5rem 0.125rem;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  /* 추천 영역이 늘어나도 채팅 영역이 최소 높이를 유지하도록 보장 */
  min-height: 50vh;
`;

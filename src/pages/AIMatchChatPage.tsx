import { useEffect, useRef } from "react";
import styled from "styled-components";
import ChatMessageBubble from "../components/chat/ChatMessageBubble";
import RoleOptions from "../components/chat/RoleOptions";
import ExampleTemplate from "../components/chat/ExampleTemplate";
import ChatInputBar from "../components/chat/ChatInputBar";
import { useChatFlow } from "../hooks/useChatFlow";
import { useAuth } from "../contexts/AuthContext";

const AIMatchChatPage = () => {
  const {
    role,
    messages,
    input,
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
  } = useChatFlow();
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

      {templateVisible && role && (
        <TemplateContainer>
          <ExampleTemplate role={role} />
        </TemplateContainer>
      )}

      {role && (
        <ActionsBar>
          <LeftActions>
            <SubmitButton onClick={showSummary} disabled={!summaryReady}>
              요약 보기
            </SubmitButton>
            <OutlineButton onClick={toggleTemplateVisible}>
              예시 입력 {templateVisible ? "숨기기" : "보기"}
            </OutlineButton>
          </LeftActions>
          <RightActions>
            <SubmitButton
              onClick={confirmAndSend}
              disabled={!summaryReady || sending}
            >
              {sending ? "전송 중..." : "확정 및 전송"}
            </SubmitButton>
          </RightActions>
          {error && <ErrorText>{error}</ErrorText>}
        </ActionsBar>
      )}
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

const ActionsBar = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  margin-top: 0.5rem;
`;

const SubmitButton = styled.button`
  padding: 0.625rem 0.875rem;
  border-radius: 0.5rem;
  border: none;
  background: #2142ab;
  color: white;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorText = styled.span`
  color: #b91c1c;
  font-size: 0.875rem;
`;

const OutlineButton = styled.button`
  padding: 0.6rem 0.875rem;
  border-radius: 0.5rem;
  background: white;
  color: #2142ab;
  border: 1px solid #2142ab;
  font-weight: 700;
  cursor: pointer;
`;

const TemplateContainer = styled.div`
  margin-top: 0.5rem;
`;
const LeftActions = styled.div`
  display: inline-flex;
  gap: 0.5rem;
`;

const RightActions = styled.div`
  display: inline-flex;
`;


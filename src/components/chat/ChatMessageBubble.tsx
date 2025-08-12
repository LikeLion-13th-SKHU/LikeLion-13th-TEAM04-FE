import styled from "styled-components";
import { colors } from "../../styles/theme";
import RecommendationList from "./RecommendationList";
import type { Recommendation, SelectedRole } from "../../types/chat";

type Props = {
  mine: boolean;
  text?: string;
  showBotAvatar?: boolean;
  createdAt?: number;
  userAvatarUrl?: string;
  recommendations?: Recommendation[];
  roleContext?: SelectedRole;
};

const ChatMessageBubble = ({
  mine,
  text,
  showBotAvatar,
  createdAt,
  userAvatarUrl,
  recommendations,
  roleContext,
}: Props) => {
  const timeLabel = createdAt
    ? new Date(createdAt).toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    : undefined;

  return (
    <Row $mine={mine}>
      {!mine && showBotAvatar && <BotAvatar aria-hidden />}
      {recommendations ? (
        <RecommendationWrapper>
          {roleContext && (
            <RecommendationList items={recommendations} role={roleContext} />
          )}
        </RecommendationWrapper>
      ) : (
        <Bubble $mine={mine}>
          {text?.split("\n").map((line, idx, arr) => (
            <span key={idx}>
              {line}
              {idx < (arr?.length ?? 0) - 1 && <br />}
            </span>
          ))}
        </Bubble>
      )}
      {mine &&
        (userAvatarUrl ? (
          <UserAvatar src={userAvatarUrl} alt="" aria-hidden />
        ) : (
          <UserAvatarFallback aria-hidden />
        ))}
      {timeLabel && <Time $mine={mine}>{timeLabel}</Time>}
    </Row>
  );
};

export default ChatMessageBubble;

const Row = styled.div<{ $mine: boolean }>`
  display: grid;
  grid-template-columns: ${(p) => (p.$mine ? "1fr auto" : "auto 1fr")};
  align-items: flex-start;
  gap: 0.375rem 0.5rem; /* 행/열 간격 분리 */
`;

const BotAvatar = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  background: ${colors.blue[900]};
  position: relative;

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 0.625rem;
    width: 0.375rem;
    height: 0.375rem;
    background: ${colors.white};
    border-radius: 9999px;
  }
  &::before {
    left: 0.5rem;
  }
  &::after {
    right: 0.5rem;
  }
`;

const Bubble = styled.div<{ $mine: boolean }>`
  display: inline-block;
  padding: 0.625rem 0.75rem;
  border-radius: 0.75rem;
  max-width: 28rem;
  background: ${(p) => (p.$mine ? colors.blue[900] : colors.gray[100])};
  color: ${(p) => (p.$mine ? colors.white : colors.black)};
  font-size: 0.9375rem;
  line-height: 1.35;
  white-space: pre-wrap;
  justify-self: ${(p) => (p.$mine ? "end" : "start")};
  position: relative;

  &::after {
    content: "";
    position: absolute;
    top: 10px;
    ${(p) => (p.$mine ? "right: -6px;" : "left: -6px;")}
    width: 0;
    height: 0;
    border-style: solid;
    ${(p) =>
      p.$mine
        ? `border-width: 6px 0 6px 6px; border-color: transparent transparent transparent ${colors.blue[900]};`
        : `border-width: 6px 6px 6px 0; border-color: transparent ${colors.gray[100]} transparent transparent;`}
  }
`;

const Time = styled.time<{ $mine: boolean }>`
  grid-column: ${(p) => (p.$mine ? 1 : 2)};
  justify-self: ${(p) => (p.$mine ? "end" : "start")};
  margin-top: 0.125rem;
  font-size: 0.75rem;
  color: ${colors.gray[900]};
  opacity: 0.65;
`;

const RecommendationWrapper = styled.div`
  justify-self: start;
  max-width: 100%;
`;

const UserAvatar = styled.img`
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  object-fit: cover;
  background: ${colors.gray[200]};
`;

const UserAvatarFallback = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  background: ${colors.gray[200]};
`;

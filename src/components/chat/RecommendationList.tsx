import styled from "styled-components";
import RecommendationCard from "./RecommendationCard";
import type { Recommendation, SelectedRole } from "../../types/chat";

type Props = {
  items: Recommendation[];
  role: SelectedRole;
  onMatchClick?: (id: string) => void;
};

const RecommendationList = ({ items, role, onMatchClick }: Props) => {
  if (items.length === 0) return null;
  const target = role === "상인" ? "구직자" : "상인";
  return (
    <Section>
      <Banner>
        말씀해주신 조건을 바탕으로 가장 잘 맞는 {target}를 추천해드렸습니다.
      </Banner>
      <Info>
        조건을 더 입력하고 '확정 및 전송'을 누르면 추천이 업데이트됩니다.
      </Info>
      <Row>
        {items.map((it) => (
          <RecommendationCard
            key={it.id}
            item={it}
            roleContext={role === "청년" ? "청년" : "상인"}
            onMatchClick={onMatchClick}
          />
        ))}
      </Row>
    </Section>
  );
};

export default RecommendationList;

const Section = styled.section`
  margin-top: 1rem;
  display: grid;
  gap: 0.75rem;
`;

const Banner = styled.div`
  align-self: start;
  padding: 0.75rem 1rem;
  background: #eef2ff;
  border-radius: 1.25rem;
  font-weight: 700;
`;

const Info = styled.div`
  color: #374151;
  font-size: 0.875rem;
`;

const Row = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

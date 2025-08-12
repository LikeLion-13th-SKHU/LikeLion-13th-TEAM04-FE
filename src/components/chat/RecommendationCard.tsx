import styled from "styled-components";
import { colors } from "../../styles/theme";
import type { Recommendation } from "../../types/chat";

type Props = {
  item: Recommendation;
  roleContext?: "상인" | "청년"; // 추천을 받는 쪽의 역할
  onMatchClick?: (id: string) => void;
};

const RecommendationCard = ({ item, onMatchClick, roleContext }: Props) => {
  return (
    <Card>
      <Header>
        <Avatar aria-hidden />
        <div>
          <Name>{item.name}</Name>
          <Meta>
            {item.age}세, {item.gender}
          </Meta>
        </div>
      </Header>

      <Title>
        {roleContext === "청년" && item.storeName
          ? `${item.storeName} · ${item.industry ?? "업종"}`
          : item.title}
      </Title>
      <Sub>
        {item.availability} / {item.region}
      </Sub>
      {item.experience && <Sub>{item.experience}</Sub>}
      {roleContext === "청년" && item.hiringRole && (
        <Sub>모집 직무: {item.hiringRole}</Sub>
      )}

      <Footer>
        <Rate>
          <Star>★</Star>
          {item.matchRate}%
        </Rate>
        <MatchButton onClick={() => onMatchClick?.(item.id)}>
          매칭하기
        </MatchButton>
      </Footer>
    </Card>
  );
};

export default RecommendationCard;

const Card = styled.div`
  width: 10rem;
  border: 1px solid ${colors.blue[300]};
  border-radius: 0.75rem;
  background: ${colors.white};
  padding: 0.75rem;
  display: grid;
  gap: 0.25rem;
`;

const Header = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 0.25rem;
`;

const Avatar = styled.div`
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 9999px;
  background: ${colors.gray[200]};
`;

const Name = styled.div`
  font-weight: 800;
`;

const Meta = styled.div`
  font-size: 0.8125rem;
  color: ${colors.gray[900]};
`;

const Title = styled.div`
  font-weight: 700;
  margin-top: 0.25rem;
`;

const Sub = styled.div`
  font-size: 0.875rem;
  color: ${colors.gray[900]};
`;

const Footer = styled.div`
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Star = styled.span`
  color: #ffb400;
  margin-right: 0.25rem;
`;

const Rate = styled.div`
  font-weight: 700;
`;

const MatchButton = styled.button`
  padding: 0.4rem 0.625rem;
  border-radius: 0.5rem;
  background: ${colors.blue[900]};
  color: ${colors.white};
  border: none;
  cursor: pointer;
  font-weight: 700;
`;

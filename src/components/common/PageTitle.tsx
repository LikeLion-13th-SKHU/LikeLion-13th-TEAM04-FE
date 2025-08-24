import styled from "styled-components";
import { colors } from "../../styles/theme";

interface PageTitleProps {
  children: React.ReactNode;
}

export default function PageTitle({ children }: PageTitleProps) {
  return (
    <PageTitleContainer>
      <TitleText>{children}</TitleText>
      <TitleUnderline />
    </PageTitleContainer>
  );
}

const PageTitleContainer = styled.div`
  margin-bottom: 2rem;
  text-align: center;
`;

const TitleText = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${colors.black};
  margin: 0 0 0.5rem 0;
  line-height: 1.2;
`;

const TitleUnderline = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${colors.black};
  margin: 0 auto;
`;

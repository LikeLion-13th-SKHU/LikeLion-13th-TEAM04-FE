import styled from "styled-components";
import { colors } from "../../styles/theme";
import type { SelectedRole } from "../../types/chat";

type Props = {
  role: SelectedRole;
};

const ExampleTemplate = ({ role }: Props) => {
  return (
    <Box>
      <Title>예시 입력</Title>
      {role === "상인" ? (
        <ul>
          <li>업무 :</li>
          <li>나이 :</li>
          <li>성별 :</li>
          <li>경력 :</li>
          <li>추가 조건 :</li>
        </ul>
      ) : (
        <ul>
          <li>근무 지역 :</li>
          <li>가능 시간 :</li>
          <li>추가 조건 :</li>
        </ul>
      )}
    </Box>
  );
};

export default ExampleTemplate;

const Box = styled.div`
  align-self: flex-start;
  padding: 0.75rem;
  border: 1px dashed ${colors.blue[300]};
  border-radius: 0.5rem;
  color: ${colors.blue[900]};
  background: ${colors.white};

  ul {
    list-style: none;
    margin: 0.25rem 0 0;
    padding: 0.5rem 0.75rem;
    border: 1px solid ${colors.blue[300]};
    border-radius: 0.5rem;
    color: ${colors.black};
    background: ${colors.gray[100]};
  }

  li + li {
    margin-top: 0.25rem;
  }
`;

const Title = styled.div`
  font-weight: 700;
  color: ${colors.blue[900]};
`;

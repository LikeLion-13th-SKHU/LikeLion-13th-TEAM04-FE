import styled from "styled-components";
import { colors } from "../../styles/theme";
import type { SelectedRole } from "../../types/chat";

type Props = {
  onSelect: (role: SelectedRole) => void;
};

const RoleOptions = ({ onSelect }: Props) => {
  return (
    <Row>
      <OptionButton type="button" onClick={() => onSelect("청년")}>
        청년
      </OptionButton>
      <OptionButton type="button" onClick={() => onSelect("상인")}>
        상인
      </OptionButton>
    </Row>
  );
};

export default RoleOptions;

const Row = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-left: 2.5rem;
`;

const OptionButton = styled.button`
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  border: 1px solid ${colors.blue[300]};
  background: ${colors.white};
  color: ${colors.blue[900]};
  cursor: pointer;
  font-weight: 700;

  &:hover {
    background: ${colors.blue[100]};
  }
`;

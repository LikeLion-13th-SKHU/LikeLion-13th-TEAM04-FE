import styled from "styled-components";
import { colors } from "../../styles/theme";
import { useNavigate } from "react-router-dom";

export interface NoticeSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const NoticeSearchBar = ({ value, onChange }: NoticeSearchBarProps) => {
  const navigate = useNavigate();

  const handleClickWrite = () => {
    navigate("/notices/new");
  };

  return (
    <SearchRow>
      <SearchInput
        placeholder="search..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

      <RightActions>
        <WriteButton type="button" onClick={handleClickWrite}>
          공고 작성하기
        </WriteButton>
      </RightActions>
    </SearchRow>
  );
};

export default NoticeSearchBar;

const SearchRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const SearchInput = styled.input`
  flex: 1 1 auto;
  height: 2.5rem;
  border: 1px solid ${colors.blue[300]};
  border-radius: 0.5rem;
  padding: 0 1rem;
  outline: none;

  &:focus {
    border-color: ${colors.blue[900]};
  }
`;

const RightActions = styled.div`
  margin-left: auto;
`;

const WriteButton = styled.button`
  height: 2.5rem;
  padding: 0 0.875rem;
  border-radius: 0.5rem;
  border: 1px solid ${colors.blue[300]};
  background: ${colors.white};
  color: ${colors.gray[900]};
  font-weight: 700;
  cursor: pointer;

  &:hover {
    border-color: ${colors.blue[900]};
  }
`;

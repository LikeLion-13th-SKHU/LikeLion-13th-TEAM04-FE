import styled from "styled-components";
import { colors } from "../../styles/theme";

export interface NoticeFiltersProps {
  category: string;
  categories: string[];
  onChangeCategory: (category: string) => void;
}

const NoticeFilters = ({
  category,
  categories,
  onChangeCategory,
}: NoticeFiltersProps) => {
  // 한글 라벨 매핑
  const labelMap: Record<string, string> = {
    ALL: "전체",
    CAFE: "카페",
    RESTAURANT: "음식점",
    SUPERMARKET: "마트",
    LIFE: "생활",
    EDUCATION: "교육",
    CULTURE: "문화",
    ADD: "기타",
  };

  return (
    <Filters>
      <Select
        value={category}
        onChange={(e) => onChangeCategory(e.target.value)}
      >
        <option value="ALL">전체</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {labelMap[c] || c}
          </option>
        ))}
      </Select>
    </Filters>
  );
};

export default NoticeFilters;

const Filters = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.75rem 0 1rem;
`;

const Select = styled.select`
  height: 2rem;
  padding: 0 0.75rem;
  border: 1px solid ${colors.blue[300]};
  border-radius: 0.5rem;
  background: ${colors.white};
`;

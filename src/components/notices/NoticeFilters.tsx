import styled from "styled-components";
import { colors } from "../../styles/theme";
import type { NoticeCategory } from "../../types/notice";

export interface NoticeFiltersProps {
  region: string;
  category: NoticeCategory | "전체";
  regions: string[];
  categories: NoticeCategory[];
  onChangeRegion: (region: string) => void;
  onChangeCategory: (category: NoticeCategory | "전체") => void;
}

const NoticeFilters = ({
  region,
  category,
  regions,
  categories,
  onChangeRegion,
  onChangeCategory,
}: NoticeFiltersProps) => {
  return (
    <Filters>
      <Select value={region} onChange={(e) => onChangeRegion(e.target.value)}>
        {regions.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </Select>

      <Select
        value={category}
        onChange={(e) => onChangeCategory(e.target.value as any)}
      >
        <option value="전체">카테고리</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
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

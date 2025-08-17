import styled from "styled-components";
import { colors } from "../../styles/theme";

interface GradeDisplayProps {
  grade: string;
  score: number;
}

export default function GradeDisplay({ grade, score }: GradeDisplayProps) {
  return (
    <GradeDisplayContainer>
      <GradeBadge $grade={grade}>
        {grade}
      </GradeBadge>
      <GradeScore>{score}점</GradeScore>
    </GradeDisplayContainer>
  );
}

const GradeDisplayContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const GradeBadge = styled.span<{ $grade: string }>`
  padding: 0.375rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: white;
  background: ${({ $grade }) => {
    switch ($grade) {
      case "다이아몬드":
        return "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
      case "플래티넘":
        return "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)";
      case "골드":
        return "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)";
      case "실버":
        return "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)";
      case "브론즈":
        return "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)";
      default:
        return colors.blue[900];
    }
  }};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  position: relative;
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.2) 50%, transparent 70%);
    border-radius: 1rem;
    animation: shine 2s infinite;
  }

  @keyframes shine {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

const GradeScore = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${colors.blue[900]};
  background: ${colors.blue[100]};
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid ${colors.blue[300]};
`;

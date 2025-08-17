import styled from "styled-components";
import { colors } from "../../styles/theme";

interface MyPostsButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

interface PortfolioButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

export function MyPostsButton({ onClick, children }: MyPostsButtonProps) {
  return (
    <MyPostsButtonStyled onClick={onClick}>
      {children}
    </MyPostsButtonStyled>
  );
}

export function PortfolioViewButton({ onClick, children }: PortfolioButtonProps) {
  return (
    <PortfolioViewButtonStyled onClick={onClick}>
      {children}
    </PortfolioViewButtonStyled>
  );
}



const MyPostsButtonStyled = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  max-width: 240px;
  margin: 0 auto 2rem auto;
  padding: 0.875rem 1.25rem;
  background: linear-gradient(135deg, ${colors.blue[700]} 0%, ${colors.blue[900]} 100%);
  color: ${colors.white};
  border: 2px solid ${colors.blue[500]};
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(33, 66, 171, 0.25);
  position: relative;
  overflow: hidden;

  &::before {
    content: "📋";
    font-size: 1rem;
  }

  &:hover {
    background: linear-gradient(135deg, ${colors.blue[500]} 0%, ${colors.blue[700]} 100%);
    border-color: ${colors.blue[300]};
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(33, 66, 171, 0.35);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(33, 66, 171, 0.25);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${colors.blue[100]}, 0 4px 12px rgba(33, 66, 171, 0.25);
  }
`;

const PortfolioViewButtonStyled = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  max-width: 240px;
  padding: 0.875rem 1.25rem;
  background: linear-gradient(135deg, ${colors.blue[700]} 0%, ${colors.blue[900]} 100%);
  color: ${colors.white};
  border: 2px solid ${colors.blue[500]};
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(33, 66, 171, 0.25);
  position: relative;
  overflow: hidden;

  &::before {
    content: "📄";
    font-size: 1rem;
  }

  &:hover {
    background: linear-gradient(135deg, ${colors.blue[500]} 0%, ${colors.blue[700]} 100%);
    border-color: ${colors.blue[300]};
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(33, 66, 171, 0.35);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(33, 66, 171, 0.25);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${colors.blue[100]}, 0 4px 12px rgba(33, 66, 171, 0.25);
  }
`;









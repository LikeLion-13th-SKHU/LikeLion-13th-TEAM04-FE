import styled from "styled-components";
import { colors } from "../../styles/theme";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  disabled?: boolean;
  placeholder?: string;
};

const ChatInputBar = ({
  value,
  onChange,
  onSubmit,
  disabled,
  placeholder,
}: Props) => {
  return (
    <Form onSubmit={onSubmit} role="search">
      <TextArea
        aria-label="메시지 입력"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
      <SendButton
        type="submit"
        disabled={disabled || value.trim().length === 0}
        aria-label="전송"
      >
        ↑
      </SendButton>
    </Form>
  );
};

export default ChatInputBar;

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.5rem;
  align-items: center;
  padding-top: 0.75rem;
`;

const TextArea = styled.textarea`
  resize: none;
  min-height: 2.75rem;
  max-height: 8rem;
  padding: 0.625rem 0.75rem;
  border-radius: 1rem;
  border: 1px solid ${colors.gray[200]};
  outline: none;
  font-size: 0.9375rem;
`;

const SendButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  background: ${colors.blue[900]};
  color: ${colors.white};
  font-weight: 800;
  transition: background-color 0.15s ease;

  &:disabled {
    background: ${colors.blue[500]};
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    background: ${colors.blue[700]};
  }
`;

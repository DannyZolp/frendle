import styled from "styled-components";

interface ButtonProps {
  bgColor: string;
}

export const Button = styled.button<ButtonProps>`
  border: 2px solid ${(props) => props.bgColor};
  border-radius: 1px;
  background-color: transparent;
  color: white;
  padding: 5px;
  width: 100%;
  font-size: 14px;
  transition: 0.2s;

  &:hover {
    background-color: ${(props) => props.bgColor};
  }
`;

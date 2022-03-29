import styled from "styled-components";

interface HeaderProps {
  size: string;
  font?: string;
  fType?: string;
}

export const Header = styled.h1<HeaderProps>`
  font-family: "${(props) => (props.font ? props.font : "Poppins")}",
    ${(props) => (props.fType ? props.fType : "sans-serif")};
  font-size: ${(props) => props.size};
  color: white;
`;

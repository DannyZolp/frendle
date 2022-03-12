import styled from "styled-components";

interface HeaderProps {
  size: string;
}

export const Header = styled.h1<HeaderProps>`
  font-family: "Poppins", sans-serif;
  font-size: ${(props) => props.size};
  color: white;
`;

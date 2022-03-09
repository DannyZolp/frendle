import styled from "styled-components";
import { CellType } from "./Cell";

interface KeyProps {
  state: CellType;
  others: number;
}

export const Key = styled.button<KeyProps>`
  border: none;
  border-radius: 4px;
  min-width: calc(100% / 10);
  max-width: 4rem;
  margin: 2px;
  background-color: ${(props) =>
    props.state === CellType.WRONG
      ? "#333"
      : props.state === CellType.YELLOW
      ? "#b59f3b"
      : props.state === CellType.GREEN
      ? "#538d4e"
      : "#555"};

  &:hover {
    background-color: ${(props) =>
      props.state === CellType.UNDEF ? "#444" : ""};
  }
`;

export const SpecialKey = styled.button`
  border: none;
  border-radius: 4px;
  min-width: calc(100% / 6);
  margin: 2px;
  background-color: #555;

  &:hover {
    background-color: #444;
  }
`;

export const KeyText = styled.h2`
  color: white;
  font-size: 14px;
  font-family: "Poppins", sans-serif;
`;

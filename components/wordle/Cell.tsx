import styled from "styled-components";

export enum CellType {
  UNDEF,
  WRONG,
  YELLOW,
  GREEN,
  RED
}

interface CellProps {
  type: CellType;
  letters: number;
}

export const Cell = styled.div<CellProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  height: calc(60vw / ${(props) => props.letters});
  width: calc(60vw / ${(props) => props.letters});
  max-height: 4rem;
  max-width: 4rem;
  transition: 0.2s;
  background-color: ${(props) =>
    props.type === CellType.WRONG
      ? "#555"
      : props.type === CellType.YELLOW
      ? "#b59f3b"
      : props.type === CellType.GREEN
      ? "#538d4e"
      : props.type === CellType.RED
      ? "#e02222"
      : "#222"};
  border: ${(props) =>
    props.type === CellType.UNDEF ? "1px solid #555" : "1px solid transparent"};
  margin: 4px;
  border-radius: 1px;
`;

export const CellText = styled.h1`
  font-size: 1.5rem;
  color: white;
  font-family: "Poppins", sans-serif;
`;

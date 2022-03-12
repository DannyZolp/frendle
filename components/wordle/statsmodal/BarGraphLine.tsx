import styled from "styled-components";

interface BarGraphLineProps {
  percentage: number;
  bgColor?: string;
}

export const BarGraphLine = styled.div<BarGraphLineProps>`
  background-color: ${(props) => (props.bgColor ? props.bgColor : "#555")};
  height: 1rem;
  width: calc(${(props) => props.percentage}% + 1rem);
  margin-left: 4px;
`;

export const BarGraphLineText = styled.span`
  font-size: 0.8rem;
  font-family: "Poppins", sans-serif;
  color: white;
  margin-left: 5px;
`;

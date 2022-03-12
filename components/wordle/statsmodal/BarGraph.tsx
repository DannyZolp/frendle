import { useEffect, useState } from "react";
import styled from "styled-components";
import { BarGraphLine, BarGraphLineText } from "./BarGraphLine";

interface BarGraphProps {
  /**
   * Expected input
   * ar[0] = 10;
   * ar[1] = 5;
   * ar[2] = 20;
   *
   * Expected output
   * 1: ##########
   * 2: #####
   * 3: ####################
   */
  data: number[];
  green: number;
}

export const BarGraph = ({ data, green }: BarGraphProps) => {
  const [max, setMax] = useState(-1);

  useEffect(() => {
    let nMax = 0;
    for (let i = 0; i < data.length; i++) {
      if (data[i] > nMax) {
        nMax = data[i];
      }
    }
    setMax(nMax);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return max > -1 ? (
    <div style={{ width: "100%" }}>
      {data.map((line, idx) => (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            marginTop: "10px",
            width: "100%",
            alignItems: "center"
          }}
          key={idx}
        >
          <p
            style={{
              margin: 0,
              padding: 0,
              color: "white",
              fontFamily: "'Poppins', sans-serif"
            }}
          >
            {idx + 1}:
          </p>
          <BarGraphLine
            percentage={(line / max) * 100}
            bgColor={idx === green ? "#538d4e" : undefined}
          ></BarGraphLine>
          <BarGraphLineText>{line}</BarGraphLineText>
        </div>
      ))}
    </div>
  ) : null;
};

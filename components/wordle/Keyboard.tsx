import Image from "next/image";
import { CellType } from "./Cell";
import { Key, KeyText, SpecialKey } from "./Key";

interface KeyboardProps {
  correct: string[];
  yellow: string[];
  wrong: string[];
  onClick: (key: string) => void;
  onSubmit: () => void;
  onBackspace: () => void;
}

const convertStatesToKeyboard = (
  correct: string[],
  yellow: string[],
  wrong: string[]
): CellType[][] => {
  const keyboard = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"]
  ];

  let keyboardStates = [
    new Array(10).fill(CellType.UNDEF),
    new Array(9).fill(CellType.UNDEF),
    new Array(7).fill(CellType.UNDEF)
  ];

  for (let i = 0; i < keyboard.length; i++) {
    for (let key = 0; key < keyboard[i].length; key++) {
      if (correct.includes(keyboard[i][key])) {
        keyboardStates[i][key] = CellType.GREEN;
      } else if (yellow.includes(keyboard[i][key])) {
        keyboardStates[i][key] = CellType.YELLOW;
      } else if (wrong.includes(keyboard[i][key])) {
        keyboardStates[i][key] = CellType.WRONG;
      }
    }
  }

  return keyboardStates;
};

export const Keyboard = ({
  correct,
  yellow,
  wrong,
  onClick,
  onSubmit,
  onBackspace
}: KeyboardProps) => {
  const keyboard = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"]
  ];
  const keyboardStates = convertStatesToKeyboard(correct, yellow, wrong);

  return (
    <>
      {keyboard.map((row, rowIdx) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "90vw",
            maxWidth: "400px",
            padding: "4px"
          }}
          key={rowIdx}
        >
          {rowIdx === 2 ? (
            <SpecialKey key={"enter"} onClick={() => onSubmit()}>
              <KeyText>
                <Image
                  src={"/icons/enter.svg"}
                  alt={"submit icon"}
                  height={"24px"}
                  width={"24px"}
                />
              </KeyText>
            </SpecialKey>
          ) : null}
          {row.map((key, keyIdx) => (
            <Key
              key={keyIdx}
              state={keyboardStates[rowIdx][keyIdx]}
              others={keyboardStates[rowIdx].length}
              onClick={() => onClick(key)}
            >
              <KeyText>{key}</KeyText>
            </Key>
          ))}
          {rowIdx === 2 ? (
            <SpecialKey key={"backspace"} onClick={() => onBackspace()}>
              <KeyText>
                <Image
                  src={"/icons/backspace.svg"}
                  alt={"backspace icon"}
                  height={"24px"}
                  width={"24px"}
                />
              </KeyText>
            </SpecialKey>
          ) : null}
        </div>
      ))}
    </>
  );
};

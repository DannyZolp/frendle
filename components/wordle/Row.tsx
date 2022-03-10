import { useEffect, useState } from "react";
import { Cell, CellText, CellType } from "./Cell";
import words from "../../public/words.json";
import guessable from "../../public/guessable.json";

const convertAnswerToCellState = (answer: string) => {
  let cells = [];
  for (let i = 0; i < answer.length; i++) {
    cells.push(CellType.UNDEF);
  }
  return cells;
};

const convertAnswerToRedCellState = (answer: string) => {
  let cells = [];
  for (let i = 0; i < answer.length; i++) {
    cells.push(CellType.RED);
  }
  return cells;
};

const findDoubles = (word: string) => {
  let doubles = [] as string[];
  let checked = [] as string[];

  for (let i = 0; i < word.length; i++) {
    if (checked.includes(word.charAt(i))) {
      doubles.push(word.charAt(i));
    } else {
      checked.push(word.charAt(i));
    }
  }

  return doubles;
};

const overlayAnswerToGuess = (answer: string, guess: string) => {
  let alreadyMarked = [] as string[];
  let doubles = findDoubles(answer);

  let cells = [];
  for (let i = 0; i < guess.length; i++) {
    if (answer.charAt(i) === guess.charAt(i)) {
      cells.push(CellType.GREEN);
    } else if (
      !doubles.includes(guess.charAt(i)) &&
      alreadyMarked.includes(answer.charAt(i))
    ) {
      cells.push(CellType.WRONG);
    } else if (answer.includes(guess.charAt(i))) {
      cells.push(CellType.YELLOW);
    } else {
      cells.push(CellType.WRONG);
    }
    alreadyMarked.push(answer.charAt(i));
  }
  return cells;
};

interface RowProps {
  guess: string;
  correct: string;
  overlayCorrect: boolean;
}

export const Row = ({ guess, correct, overlayCorrect }: RowProps) => {
  const [cellState, setCellState] = useState<CellType[]>(
    convertAnswerToCellState(correct)
  );
  const [cellLetters, setCellLetters] = useState<string[]>([]);

  useEffect(() => {
    let tCellLetters = [];
    for (let i = 0; i < correct.length; i++) {
      tCellLetters.push(guess.charAt(i) ? guess.charAt(i).toUpperCase() : "");
    }
    setCellLetters(tCellLetters);
  }, [guess, correct]);

  useEffect(() => {
    if (overlayCorrect) {
      setCellState(overlayAnswerToGuess(correct, guess));
    } else if (guess.length === correct.length) {
      if (!(guessable.includes(guess) || words.includes(guess))) {
        setCellState(convertAnswerToRedCellState(correct));
      }
    } else {
      setCellState(convertAnswerToCellState(correct));
    }
  }, [overlayCorrect, correct, guess]);

  return (
    <div style={{ display: "flex" }}>
      {cellState.map((state, idx) => (
        <Cell key={idx} type={state} letters={cellState.length}>
          <CellText>{cellLetters[idx]}</CellText>
        </Cell>
      ))}
    </div>
  );
};

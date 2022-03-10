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

const countLetters = (word: string, letter: string) => {
  let count = 0;

  for (let i = 0; i < word.length; i++) {
    if (word.charAt(i) === letter) {
      count++;
    }
  }

  return count;
};

const overlayAnswerToGuess = (answer: string, guess: string) => {
  let cells = new Array<CellType>(answer.length);
  let finished = new Array<boolean>(guess.length);
  let correctLetters = new Array<string>();

  // first, do the correct pass
  for (let i = 0; i < guess.length; i++) {
    if (answer.charAt(i) === guess.charAt(i)) {
      cells[i] = CellType.GREEN;
      finished[i] = true;
      correctLetters.push(guess.charAt(i));
    }
  }

  // now, do the yellow pass
  for (let i = 0; i < guess.length; i++) {
    if (
      !finished[i] &&
      !correctLetters.includes(guess.charAt(i)) &&
      answer.includes(guess.charAt(i))
    ) {
      cells[i] = CellType.YELLOW;
      finished[i] = true;
    } else if (
      !finished[i] &&
      correctLetters.includes(guess.charAt(i)) &&
      answer.includes(guess.charAt(i))
    ) {
      if (countLetters(answer, guess.charAt(i)) > 1) {
        cells[i] = CellType.YELLOW;
      } else {
        cells[i] = CellType.WRONG;
      }
      finished[i] = true;
    }
  }

  // make everything else wrong
  for (let i = 0; i < guess.length; i++) {
    if (!finished[i]) {
      cells[i] = CellType.WRONG;
    }
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

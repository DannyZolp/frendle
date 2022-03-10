import { differenceInDays } from "date-fns";
import { useEffect, useState } from "react";
import { Row } from "../components/wordle/Row";
import words from "../public/words.json";
import guessable from "../public/guessable.json";
import { Keyboard } from "../components/wordle/Keyboard";
import { FrendlePageProps } from "./_app";

interface CorrectYellowWrongOutput {
  correct: string[];
  yellow: string[];
  wrong: string[];
}

const getCorrectYellowWrong = (
  guess: string,
  answer: string
): CorrectYellowWrongOutput => {
  let correct = [] as string[];
  let yellow = [] as string[];
  let wrong = [] as string[];

  for (let i = 0; i < guess.length; i++) {
    if (answer.charAt(i) === guess.charAt(i)) {
      correct.push(guess.charAt(i).toUpperCase());
    } else if (answer.includes(guess.charAt(i))) {
      yellow.push(guess.charAt(i).toUpperCase());
    } else {
      wrong.push(guess.charAt(i).toUpperCase());
    }
  }

  return {
    correct,
    yellow,
    wrong
  };
};

const Play = ({ supabase }: FrendlePageProps) => {
  const [correct, setCorrect] = useState("");
  const [rowText, setRowText] = useState<string[]>(new Array(6).fill(""));
  const [rowOverlay, setRowOverlay] = useState<boolean[]>(
    new Array(6).fill(false)
  );
  const [currentRow, setCurrentRow] = useState(0);
  const [currentGuess, setCurrentGuess] = useState("");
  const [correctLetters, setCorrectLetters] = useState<string[]>([]);
  const [yellowLetters, setYellowLetters] = useState<string[]>([]);
  const [wrongLetters, setWrongLetters] = useState<string[]>([]);

  useEffect(() => {
    // get the current word
    setCorrect(words[differenceInDays(new Date(), new Date("June 19 2021"))]);
  }, []);

  useEffect(() => {
    let rows = [...rowText];
    rows[currentRow] = currentGuess;
    setRowText(rows);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentGuess, currentRow]);

  const tryNextRow = () => {
    if (currentGuess.length === correct.length) {
      if (guessable.includes(currentGuess) || words.includes(currentGuess)) {
        let rowState = [...rowOverlay];
        rowState[currentRow] = true;
        setRowOverlay(rowState);
        setCurrentRow(currentRow + 1);

        const {
          correct: lCorrect,
          yellow,
          wrong
        } = getCorrectYellowWrong(currentGuess, correct);

        setCorrectLetters(lCorrect.concat(correctLetters));
        setYellowLetters(yellow.concat(yellowLetters));
        setWrongLetters(wrong.concat(wrongLetters));

        setCurrentGuess("");
      } else {
        alert("Not a word");
      }
    } else {
      alert("Not long enough");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column"
      }}
    >
      {/* <input
        onChange={(e) => {
          if (e.target.value.length <= correct.length) {
            setCurrentGuess(e.target.value);
          }
        }}
        value={currentGuess}
        placeholder="Guess"
      />
      <button onClick={tryNextRow}>Next</button> */}
      <div>
        {rowOverlay.map((overlay, idx) => (
          <Row
            correct={correct}
            guess={rowText[idx]}
            overlayCorrect={overlay}
            key={idx}
          />
        ))}
      </div>
      <Keyboard
        correct={correctLetters}
        yellow={yellowLetters}
        wrong={wrongLetters}
        onClick={(k) => setCurrentGuess(currentGuess + k.toLowerCase())}
        onBackspace={() =>
          setCurrentGuess(currentGuess.slice(0, currentGuess.length - 1))
        }
        onSubmit={tryNextRow}
      />
    </div>
  );
};

export default Play;

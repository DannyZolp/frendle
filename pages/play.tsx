import { differenceInDays, isSameDay } from "date-fns";
import { useEffect, useState } from "react";
import { Row } from "../components/wordle/Row";
import words from "../public/words.json";
import guessable from "../public/guessable.json";
import { Keyboard } from "../components/wordle/Keyboard";
import { FrendlePageProps } from "./_app";
import { definitions } from "../types/supabase";
import { StatsModal } from "../components/wordle/statsmodal";

interface CorrectYellowWrongOutput {
  correct: string[];
  yellow: string[];
  wrong: string[];
}

const getAllCYW = (guesses: string[], answer: string) => {
  let c = new Array<string>();
  let y = new Array<string>();
  let w = new Array<string>();

  for (let i = 0; i < guesses.filter((g) => g.length === 5).length; i++) {
    console.log(guesses[i]);
    const { correct, yellow, wrong } = getCorrectYellowWrong(
      guesses[i],
      answer
    );

    c = c.concat(correct);
    y = y.concat(yellow);
    w = w.concat(wrong);
  }

  return {
    correct: c,
    yellow: y,
    wrong: w
  };
};

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
  const [lock, setLock] = useState(false);
  const [wordleId, setWordleId] = useState("");
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    // get the current word
    setCorrect(words[differenceInDays(new Date(), new Date("June 19 2021"))]);

    // check the cloud for previous saves for today
    supabase
      .from<definitions["wordle"]>("wordle")
      .select("guesses, created_at, id")
      .then(async ({ data }) => {
        if (data && (data?.length ?? 0) > 0) {
          // the user has made a save in the past
          for (let i = 0; i < data?.length; i++) {
            if (isSameDay(new Date(), new Date(data[i].created_at))) {
              // this is the correct wordle
              setWordleId(data[i].id);

              const len = data[i].guesses.filter((g) => g !== "").length;
              const guesses = data[i].guesses as string[];

              if (len > 0) {
                setRowText(guesses);
                setCurrentRow(len);
                setCurrentGuess(guesses[len - 1]);
                setRowOverlay(
                  new Array<boolean>(len)
                    .fill(true)
                    .concat(new Array<boolean>(6 - len).fill(false))
                );

                const {
                  correct: lCorrect,
                  yellow,
                  wrong
                } = getAllCYW(
                  guesses,
                  words[differenceInDays(new Date(), new Date("June 19 2021"))]
                );

                setCorrectLetters(lCorrect);
                setYellowLetters(yellow);
                setWrongLetters(wrong);
                setCurrentGuess("");
              }

              return;
            }
          }
          // the user does not have a wordle for the day
          supabase
            .from<definitions["wordle"]>("wordle")
            .insert({
              guesses: rowText,
              owner_id: supabase.auth.user()?.id
            })
            .then(({ data }) => {
              if (data) {
                setWordleId(data[0].id);
              }
            });
        } else {
          // the user does not have a wordle for the day
          supabase
            .from<definitions["wordle"]>("wordle")
            .insert({
              guesses: rowText,
              owner_id: supabase.auth.user()?.id
            })
            .then(({ data }) => {
              if (data) {
                setWordleId(data[0].id);
              }
            });
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // save current state to the cloud
    if (wordleId) {
      supabase
        .from<definitions["wordle"]>("wordle")
        .update({
          guesses: rowText
        })
        .eq("id", wordleId)
        .then(() => {
          console.log("completed save");
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRow, wordleId]);

  useEffect(() => {
    document.onkeydown = (ev) => {
      ev.preventDefault();
      if (!lock) {
        if (ev.code === "Backspace") {
          setCurrentGuess(currentGuess.slice(0, currentGuess.length - 1));
        } else if (ev.code === "Enter") {
          tryNextRow();
        } else if (ev.code.startsWith("Key") && currentGuess.length < 5) {
          setCurrentGuess(currentGuess + ev.key.toLowerCase());
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentGuess, lock]);

  useEffect(() => {
    let rows = [...rowText];
    rows[currentRow] = currentGuess;
    setRowText(rows);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentGuess, currentRow]);

  useEffect(() => {
    if (rowText[currentRow - 1] === correct) {
      setLock(true);
      setShowStats(true);
    }
  }, [rowText, currentRow, correct]);

  const tryNextRow = () => {
    if (currentGuess.length === correct.length && !lock) {
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
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        height: "100vh",
        width: "100vw"
      }}
    >
      <button
        onClick={() => setShowStats(true)}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        Show Stats
      </button>
      <StatsModal
        isOpen={showStats}
        close={() => setShowStats(false)}
        supabase={supabase}
        green={currentRow - 1}
      />
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
      <div
        style={{
          position: "absolute",
          top: "2vh"
        }}
      >
        {rowOverlay.map((overlay, idx) => (
          <Row
            correct={correct}
            guess={rowText[idx]}
            overlayCorrect={overlay}
            key={idx}
          />
        ))}
      </div>
      <div
        style={{
          width: "100vw",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          position: "absolute",
          bottom: 0
        }}
      >
        <Keyboard
          correct={correctLetters}
          yellow={yellowLetters}
          wrong={wrongLetters}
          onClick={(k) =>
            setCurrentGuess(lock ? "" : currentGuess + k.toLowerCase())
          }
          onBackspace={() =>
            setCurrentGuess(
              lock ? "" : currentGuess.slice(0, currentGuess.length - 1)
            )
          }
          onSubmit={tryNextRow}
        />
      </div>
    </div>
  );
};

export default Play;

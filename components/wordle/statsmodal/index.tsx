import { SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import ReactModal, { Styles } from "react-modal";
import { toast } from "react-toastify";
import { definitions } from "../../../types/supabase";
import { Header } from "../../basic/Header";
import { BarGraph } from "./BarGraph";
import { NumericalStat } from "./NumericalStat";
import words from "../../../public/words.json";
import { differenceInDays } from "date-fns";
import { Button } from "../../basic/Button";
import Link from "next/link";

const GUESSES_ALLOWED = 6;

interface StatsModalProps {
  isOpen: boolean;
  close: () => void;
  supabase: SupabaseClient;
  green: number;
}

const customStyles: Styles = {
  content: {
    width: "100vw",
    maxWidth: "400px",
    height: "65%",
    backgroundColor: "#333",
    borderRadius: "8px",
    marginLeft: "-75px",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    border: "none",
    overflow: "hidden"
  },
  overlay: {
    backgroundColor: "rgba(0.3, 0.3, 0.3, 0.5)",
    padding: 0,
    display: "flex",
    justifyContent: "center"
  }
};

const getStatDataFromWordles = (data: definitions["wordle"][]) => {
  const barGraphData = new Array<number>(GUESSES_ALLOWED).fill(0);
  let won = 0;
  let plays = 0;
  let currentStreak = 0;
  let maxStreak = 0;

  for (let i = 0; i < data.length; i++) {
    const correctWord =
      words[
        differenceInDays(new Date(data[i].created_at), new Date("June 19 2021"))
      ];
    const guesses = data[i].guesses.filter((g) => g !== "").length;
    const lastGuess = data[i].guesses[guesses - 1];

    if (correctWord === lastGuess) {
      currentStreak++;
      won++;
      plays++;
      barGraphData[guesses - 1]++;
    } else if (guesses >= 6) {
      // the player has a CONFIRMED loss
      plays++;
      if (currentStreak > maxStreak) {
        maxStreak = currentStreak;
      }
      currentStreak = 0;
    }
  }

  if (maxStreak < currentStreak) {
    maxStreak = currentStreak;
  }

  return {
    barGraphData,
    plays,
    won,
    maxStreak,
    currentStreak
  };
};

export const StatsModal = ({
  isOpen,
  close,
  supabase,
  green
}: StatsModalProps) => {
  const [finishes, setFinishes] = useState<number[]>([1, 4, 10, 30, 20, 10]);
  const [timesPlayed, setTimesPlayed] = useState(0);
  const [numberWon, setNumberWon] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
  }, [isOpen]);

  useEffect(() => {
    supabase
      .from<definitions["wordle"]>("wordle")
      .select("guesses, created_at")
      .eq("owner_id", supabase.auth.user()?.id ?? "")
      .then(({ data }) => {
        if (data) {
          const {
            barGraphData,
            plays,
            won,
            maxStreak: nMaxStreak,
            currentStreak
          } = getStatDataFromWordles(data);
          setTimesPlayed(plays);
          setFinishes(barGraphData);
          setNumberWon(won);
          setMaxStreak(nMaxStreak);
          setStreak(currentStreak);
          setLoading(false);
        } else {
          toast.error("Error loading stats, please refresh the page.");
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={close}
      style={customStyles}
      contentLabel="statistics modal"
    >
      <Header size="2rem">your statistics</Header>
      {loading ? (
        <p style={{ color: "white", fontFamily: "'Poppins', sans-serif" }}>
          Loading...
        </p>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column"
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateRows: "repeat(2, 1fr)",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "10px"
            }}
          >
            <NumericalStat number={`${timesPlayed}`} def={"played"} />
            <NumericalStat
              number={`${Math.floor(
                (numberWon / (timesPlayed === 0 ? 1 : timesPlayed)) * 100
              )}%`}
              def={"win ratio"}
            />
            <NumericalStat number={`${streak}`} def={"current streak"} />
            <NumericalStat number={`${maxStreak}`} def={"maximum streak"} />
          </div>
          <Header size="1rem">Guess Distribution</Header>

          <BarGraph data={finishes} green={green} />
          <Link href="/global" passHref>
            <Button
              bgColor="#222"
              style={{
                width: "50%",
                fontFamily: "'Poppins', sans-serif",
                padding: "10px 12px"
              }}
            >
              View Global
            </Button>
          </Link>
        </div>
      )}
    </ReactModal>
  );
};

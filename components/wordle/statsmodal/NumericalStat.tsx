interface NumericalStatProps {
  number: string;
  def: string;
}

export const NumericalStat = ({ number, def }: NumericalStatProps) => (
  <div
    style={{
      color: "white",
      fontFamily: "'Poppins', sans-serif",
      display: "flex",
      flexDirection: "column",
      margin: "0 1rem",
      textAlign: "center"
    }}
  >
    <span style={{ fontSize: "2.2rem", margin: 0, padding: 0 }}>{number}</span>
    <span style={{ fontSize: "0.8rem", margin: 0 }}>{def}</span>
  </div>
);

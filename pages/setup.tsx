import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Box } from "../components/basic/Box";
import { Button } from "../components/basic/Button";
import { Input } from "../components/basic/Input";
import { definitions } from "../types/supabase";
import { FrendlePageProps } from "./_app";

enum CheckingUsername {
  CHECKING,
  VALID,
  TAKEN
}

const Setup = ({ supabase }: FrendlePageProps) => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [validUsername, setValidUsername] = useState<CheckingUsername>(
    CheckingUsername.CHECKING
  );

  useEffect(() => {
    if (username.length > 0) {
      supabase
        .from<definitions["users"]>("users")
        .select("id")
        .eq("username", username)
        .then((data) => {
          if (data.body?.length === 0) {
            setValidUsername(CheckingUsername.VALID);
          } else {
            setValidUsername(CheckingUsername.TAKEN);
          }
        });
    } else {
      setValidUsername(CheckingUsername.CHECKING);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  const createUser = () => {
    supabase
      .from<definitions["users"]>("users")
      .insert({
        id: supabase.auth.user()?.id,
        username,
        displayName: name
      })
      .then(() => router.push("/play"));
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh"
      }}
    >
      <Box>
        <h1 style={{ margin: "1px" }}>Finish Setup</h1>
        <Input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            border: `${
              validUsername === CheckingUsername.TAKEN
                ? "red"
                : validUsername === CheckingUsername.VALID
                ? "green"
                : "#444"
            } 1px solid`
          }}
        />
        {validUsername === CheckingUsername.TAKEN ? (
          <p style={{ color: "red", fontSize: "14px" }}>Username taken!</p>
        ) : validUsername === CheckingUsername.VALID ? (
          <p style={{ color: "green", fontSize: "14px" }}>Username available</p>
        ) : null}
        <Input
          placeholder="Public Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button
          bgColor="#444"
          style={{ marginTop: "2.5%", padding: "14px 16px" }}
          onClick={createUser}
        >
          Finish Setup
        </Button>
      </Box>
    </div>
  );
};

export default Setup;

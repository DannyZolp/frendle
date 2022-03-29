import Image from "next/image";
import { useState } from "react";
import { Box } from "../components/basic/Box";
import { Button } from "../components/basic/Button";
import { Input } from "../components/basic/Input";
import { FrendlePageProps } from "./_app";
import { toast } from "react-toastify";
import Link from "next/link";

const Index = ({ supabase, setConnecting }: FrendlePageProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginWithEmail = () => {
    setConnecting(true);
    supabase.auth
      .signIn({
        email,
        password
      })
      .then((value) => {
        if (value.error) {
          toast.error(value.error.message);
        }
      });
  };

  const loginWithDiscord = () => {
    setConnecting(true);
    supabase.auth.signIn(
      {
        provider: "discord"
      },
      {
        redirectTo:
          process.env.NODE_ENV === "development" ? "http://localhost:3000" : ""
      }
    );
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
        <h1 style={{ margin: "1px" }}>Login</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            loginWithEmail();
          }}
        >
          <Input
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            bgColor="#444"
            style={{ marginTop: "2.5%", padding: "14px 16px" }}
          >
            Login with Email
          </Button>
        </form>
        <Link href="/signup" passHref>
          <a style={{ color: "white", fontSize: "14px", margin: "0" }}>
            sign up?
          </a>
        </Link>
        <hr
          style={{
            border: "none",
            backgroundColor: "#444",
            height: "1px",
            margin: "1rem"
          }}
        />
        <Button bgColor="#404eed" onClick={loginWithDiscord}>
          <Image
            src="/icons/login-with-discord.svg"
            alt="discord logo"
            width={146}
            height={40}
          />
        </Button>
      </Box>
    </div>
  );
};

export default Index;

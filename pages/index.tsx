import Image from "next/image";
import { useState } from "react";
import { Box } from "../components/basic/Box";
import { Button } from "../components/basic/Button";
import { Input } from "../components/basic/Input";
import { FrendlePageProps } from "./_app";
import { toast } from "react-toastify";
import Link from "next/link";

const Index = ({ supabase }: FrendlePageProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginWithEmail = () => {
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
    supabase.auth.signIn({
      provider: "discord"
    });
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
          onClick={loginWithEmail}
        >
          Login with Email
        </Button>
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

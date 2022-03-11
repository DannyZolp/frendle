import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";
import { Box } from "../components/login/Box";
import { Button } from "../components/login/Button";
import { Input } from "../components/login/Input";
import { FrendlePageProps } from "./_app";

const Signup = ({ supabase }: FrendlePageProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginWithEmail = () => {
    supabase.auth
      .signUp({
        email,
        password
      })
      .then((value) => {
        if (value.error) {
          toast.error(value.error.message);
        }
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
        <h1 style={{ margin: "1px" }}>Sign Up</h1>
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
          Sign Up with Email
        </Button>
        <Link href="/" passHref>
          <a style={{ color: "white", fontSize: "14px", margin: "0" }}>
            login?
          </a>
        </Link>
      </Box>
    </div>
  );
};

export default Signup;

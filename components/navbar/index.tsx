import { SupabaseClient } from "@supabase/supabase-js";
import Image from "next/image";
import { useEffect, useState } from "react";
import { definitions } from "../../types/supabase";
import { Header } from "../basic/Header";
import { MainNavbar } from "./MainNavbar";
import { NavbarSect } from "./NavbarSect";

interface NavbarProps {
  supabase: SupabaseClient;
  showStats: () => void;
}

export const Navbar = ({ supabase, showStats }: NavbarProps) => {
  const [user, setUser] = useState<definitions["users"]>();

  useEffect(() => {
    supabase
      .from<definitions["users"]>("users")
      .select("*")
      .eq("id", supabase.auth.user()?.id ?? "")
      .then(({ data }) => {
        if (data) {
          setUser(data[0]);
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MainNavbar>
      <NavbarSect
        style={{ alignItems: "flex-start", justifyContent: "center" }}
      >
        <Image
          src="/icons/logout.svg"
          width="28"
          height="28"
          alt="logout"
          onClick={() => supabase.auth.signOut()}
        />
        <Header size="1rem">Hello, {user?.displayName}!</Header>
      </NavbarSect>
      <NavbarSect>
        <Header size="1.25rem" font="Roboto Slab" fType="serif">
          Frendle
        </Header>
      </NavbarSect>
      <NavbarSect style={{ alignItems: "flex-end" }}>
        <div style={{ marginRight: "5%" }}>
          <Image
            src="/icons/stats.svg"
            width="28"
            height="28"
            alt="statistics"
            onClick={showStats}
          />
        </div>
      </NavbarSect>
    </MainNavbar>
  );
};

import { SupabaseClient } from "@supabase/supabase-js";
import { Header } from "../basic/Header";
import { MainNavbar } from "./MainNavbar";
import { NavbarSect } from "./NavbarSect";

interface NavbarProps {
  supabase: SupabaseClient;
}

export const Navbar = ({ supabase }: NavbarProps) => {
  return (
    <MainNavbar>
      <NavbarSect />
      <NavbarSect>
        <Header size="1.25rem">Frendle</Header>
      </NavbarSect>
      <NavbarSect></NavbarSect>
    </MainNavbar>
  );
};

import "react-toastify/dist/ReactToastify.css";
import "normalize.css";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { setAppElement } from "react-modal";
import { ToastContainer } from "react-toastify";
import { definitions } from "../types/supabase";
import Head from "next/head";
import LoadingOverlay from "react-loading-overlay-ts";

export interface FrendlePageProps {
  supabase: SupabaseClient;
  setConnecting: (c: boolean) => void;
}

const protectedRoutes = ["/play", "/setup"];
const unprotectedRoutes = ["/", "/signup"];

setAppElement("#__next");

function MyApp({ Component, pageProps }: AppProps) {
  const [authLoading, setAuthLoading] = useState(true);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const supabase = createClient(supabaseUrl!, supabaseAnonKey!);
  const router = useRouter();

  supabase.auth.onAuthStateChange(async (event, session) => {
    const document = await supabase
      .from<definitions["users"]>("users")
      .select("id")
      .eq("id", session?.user?.id);

    if (document.body?.length === 0 && router.pathname !== "/setup") {
      router.push("/setup");
    }

    switch (event) {
      case "SIGNED_IN":
        if (unprotectedRoutes.includes(router.pathname)) {
          setAuthLoading(false);
          router.push("/play");
        }
        break;
      case "SIGNED_OUT":
        if (protectedRoutes.includes(router.pathname)) {
          setAuthLoading(false);
          router.push("/");
        }
        break;
      case "USER_DELETED":
        if (protectedRoutes.includes(router.pathname)) {
          setAuthLoading(false);
          router.push("/");
        }
        break;
      default: {
        setAuthLoading(false);
      }
    }
  });

  useEffect(() => {
    if (supabase.auth.session() === null) {
      if (protectedRoutes.includes(router.pathname)) {
        setAuthLoading(false);
        router.push("/");
      } else {
        setAuthLoading(false);
      }
    } else {
      if (unprotectedRoutes.includes(router.pathname)) {
        setAuthLoading(false);
        router.push("/play");
      } else {
        setAuthLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <LoadingOverlay
      active={authLoading}
      spinner
      text="connecting to servers..."
    >
      <Head>
        <title>Frendle</title>
      </Head>
      <ToastContainer />
      <Component
        {...pageProps}
        supabase={supabase}
        setConnecting={setAuthLoading}
      />
    </LoadingOverlay>
  );
}

export default MyApp;

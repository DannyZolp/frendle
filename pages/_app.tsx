import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import "normalize.css";
import type { AppProps } from "next/app";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { setAppElement } from "react-modal";
import { ToastContainer } from "react-toastify";

export interface FrendlePageProps {
  supabase: SupabaseClient;
}

const protectedRoutes = ["/play"];
const unprotectedRoutes = ["/"];

setAppElement("#__next");

function MyApp({ Component, pageProps }: AppProps) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const supabase = createClient(supabaseUrl!, supabaseAnonKey!);
  const router = useRouter();

  supabase.auth.onAuthStateChange((event) => {
    switch (event) {
      case "SIGNED_IN":
        if (unprotectedRoutes.includes(router.basePath)) {
          router.push("/play");
        }
        break;
      case "SIGNED_OUT":
        if (protectedRoutes.includes(router.basePath)) {
          router.push("/");
        }
        break;
      case "USER_DELETED":
        if (protectedRoutes.includes(router.basePath)) {
          router.push("/");
        }
        break;
    }
  });

  useEffect(() => {
    if (supabase.auth.session() === null) {
      if (protectedRoutes.includes(router.basePath)) {
        router.push("/");
      }
    } else {
      if (unprotectedRoutes.includes(router.basePath)) {
        router.push("/play");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <>
      <ToastContainer />
      <Component {...pageProps} supabase={supabase} />
    </>
  );
}

export default MyApp;

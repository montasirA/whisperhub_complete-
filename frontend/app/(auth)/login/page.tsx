"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Mail,
  Lock,
  Globe,
} from "lucide-react";

import axios from "axios";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import BrandLogo from "@/components/ui/BrandLogo";

import { useAuth } from "@/context/AuthContext";


interface ApiErrorResponse {
  message?: string;
  detail?: string;
}


export default function LoginPage() {

  const router = useRouter();

  const { login } = useAuth();


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

    setError("");


    if (!email.trim()) {

      setError(
        "Please enter your email."
      );

      return;
    }


    if (!password) {

      setError(
        "Please enter your password."
      );

      return;
    }


    setLoading(true);


    try {

      await login(
        email.trim(),
        password
      );


      router.push("/feed");

    } catch (err: unknown) {

      if (axios.isAxiosError<ApiErrorResponse>(err)) {

        const status = err.response?.status;

        const message =
          err.response?.data?.message ||
          err.response?.data?.detail;


        if (status === 401) {

          setError(
            "Invalid email or password."
          );

        } else if (message) {

          setError(message);

        } else {

          setError(
            "Unable to connect to WhisperHub."
          );

        }

      } else {

        setError(
          "Unable to connect to WhisperHub."
        );

      }

    } finally {

      setLoading(false);

    }

  };


  return (

    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--page-gradient)] px-4 py-10 sm:px-6 lg:px-8">

      <div className="absolute left-8 top-10 h-24 w-24 rounded-full bg-[var(--page-glow-primary)] blur-3xl" />

      <div className="absolute bottom-10 right-10 h-32 w-32 rounded-full bg-[var(--page-glow-secondary)] blur-3xl" />


      <motion.div
        initial={{
          opacity: 0,
          y: 18,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
        }}
        className="relative z-10 grid w-full max-w-6xl gap-8 rounded-[40px] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow)] backdrop-blur-2xl lg:grid-cols-[1.05fr_0.95fr] lg:p-8"
      >

        {/* LEFT */}

        <section className="relative overflow-hidden rounded-[32px] border border-[var(--border)] bg-[linear-gradient(135deg,var(--page-glow-primary),var(--surface-2),var(--page-glow-secondary))] p-8 sm:p-10">

          <div className="relative z-10 flex h-full flex-col justify-between">

            <div className="space-y-4">

              <BrandLogo />

              <h1 className="max-w-md text-3xl font-semibold leading-tight text-[var(--text)] sm:text-4xl">

                Welcome back to your anonymous little universe.

              </h1>


              <p className="max-w-md text-base leading-7 text-[var(--muted)]">

                Share confessions, make new friends, and let your softer side show up without the pressure of real identities.

              </p>

            </div>

          </div>

        </section>


        {/* RIGHT */}

        <section className="rounded-[32px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-strong)] backdrop-blur-2xl sm:p-8">

          <div className="mb-6">

            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--secondary)]">

              Login

            </p>

            <h2 className="mt-1 text-2xl font-semibold text-[var(--text)]">

              Step back in

            </h2>

          </div>


          <form
            onSubmit={handleLogin}
            className="space-y-4"
          >

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              icon={Mail}
              value={email}
              onChange={(
                e: React.ChangeEvent<HTMLInputElement>
              ) =>
                setEmail(e.target.value)
              }
            />


            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={password}
              onChange={(
                e: React.ChangeEvent<HTMLInputElement>
              ) =>
                setPassword(e.target.value)
              }
            />


            {error && (

              <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3">

                <p className="text-sm text-red-500">
                  {error}
                </p>

              </div>

            )}


            <Button
              className="w-full"
              size="lg"
              disabled={loading}
            >

              {loading ? (
                "Signing in..."
              ) : (
                <>
                  Sign in

                  <ArrowRight
                    size={16}
                    className="ml-2"
                  />
                </>
              )}

            </Button>


            <Button
              variant="secondary"
              className="w-full gap-2"
              size="lg"
              type="button"
            >

              <Globe size={16} />

              Continue with Google

            </Button>

          </form>


          <div className="mt-6 text-center text-sm text-[var(--muted)]">

            New here?

            {" "}

            <Link
              href="/register"
              className="font-semibold text-[var(--secondary)]"
            >
              Create account
            </Link>

          </div>


        </section>

      </motion.div>

    </main>
  );
}
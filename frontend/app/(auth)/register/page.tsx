"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Mail,
  Lock,
  UserRound,
  Sparkles,
} from "lucide-react";

import axios from "axios";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import BrandLogo from "@/components/ui/BrandLogo";

import { registerUser } from "@/services/authService";


interface RegisterErrorResponse {
  email?: string | string[];
  username?: string | string[];
  detail?: string;
  message?: string;
}


export default function RegisterPage() {

  const router = useRouter();


  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleRegister = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

    setError("");


    if (!displayName.trim()) {

      setError(
        "Please enter your name."
      );

      return;

    }


    if (!username.trim()) {

      setError(
        "Please choose a username."
      );

      return;

    }


    if (!email.trim()) {

      setError(
        "Please enter your email."
      );

      return;

    }


    if (password.length < 8) {

      setError(
        "Password must be at least 8 characters."
      );

      return;

    }


    setLoading(true);


    try {

      await registerUser({

        email: email.trim(),

        username: username.trim(),

        display_name: displayName.trim(),

        password,

      });


      router.push("/setup");


    } catch (err: unknown) {

      if (axios.isAxiosError<RegisterErrorResponse>(err)) {

        const data = err.response?.data;


        if (data?.email) {

          setError(
            Array.isArray(data.email)
              ? data.email[0]
              : data.email
          );

        } else if (data?.username) {

          setError(
            Array.isArray(data.username)
              ? data.username[0]
              : data.username
          );

        } else if (data?.detail) {

          setError(data.detail);

        } else if (data?.message) {

          setError(data.message);

        } else {

          setError(
            "Unable to create account."
          );

        }

      } else {

        setError(
          "Could not connect to WhisperHub."
        );

      }

    } finally {

      setLoading(false);

    }

  };


  return (

    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--page-gradient)] px-4 py-10 sm:px-6 lg:px-8">

      <motion.div
        initial={{
          opacity: 0,
          y: 16,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.35,
        }}
        className="w-full max-w-5xl rounded-[40px] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow)] backdrop-blur-2xl lg:p-8"
      >

        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">

          {/* LEFT SIDE */}

          <section className="rounded-[32px] border border-[var(--border)] bg-[linear-gradient(135deg,var(--page-glow-primary),var(--card),var(--page-glow-secondary))] p-8">

            <BrandLogo />

            <h1 className="mt-6 text-3xl font-semibold leading-tight text-[var(--text)] sm:text-4xl">

              Create your hidden identity and step into the soft chaos.

            </h1>

            <p className="mt-4 text-base leading-7 text-[var(--muted)]">

              Choose an anonymous name, a playful identity, and a little bio that feels honest in the most delightful way.

            </p>


            <div className="mt-8 rounded-[26px] border border-[var(--border)] bg-[var(--card)] p-5">

              <div className="flex items-center gap-3">

                <div className="rounded-full bg-gradient-to-r from-[var(--secondary)] to-[var(--accent)] p-2 text-[var(--button-text)]">

                  <Sparkles size={16} />

                </div>

                <div>

                  <p className="font-semibold text-[var(--text)]">

                    No real profile needed

                  </p>

                  <p className="text-sm text-[var(--muted)]">

                    Just a fun, private, anonymous vibe.

                  </p>

                </div>

              </div>

            </div>

          </section>


          {/* RIGHT SIDE */}

          <section className="rounded-[32px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)] backdrop-blur-2xl sm:p-8">

            <div className="mb-6">

              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--primary)]">

                Register

              </p>

              <h2 className="mt-1 text-2xl font-semibold text-[var(--text)]">

                Join WhisperHub

              </h2>

            </div>


            <form
              onSubmit={handleRegister}
              className="space-y-4"
            >

              <Input
                label="Name"
                type="text"
                placeholder="Your display name"
                icon={UserRound}
                value={displayName}
                onChange={(
                  e: React.ChangeEvent<HTMLInputElement>
                ) =>
                  setDisplayName(e.target.value)
                }
              />


              <Input
                label="Username"
                type="text"
                placeholder="Choose a username"
                icon={UserRound}
                value={username}
                onChange={(
                  e: React.ChangeEvent<HTMLInputElement>
                ) =>
                  setUsername(e.target.value)
                }
              />


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
                placeholder="Create a secure password"
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
                  "Creating account..."
                ) : (
                  <>
                    Create account

                    <ArrowRight
                      size={16}
                      className="ml-2"
                    />
                  </>
                )}

              </Button>

            </form>


            <div className="mt-6 text-center text-sm text-[var(--muted)]">

              Already have an account?

              {" "}

              <Link
                href="/login"
                className="font-semibold text-[var(--secondary)]"
              >

                Sign in

              </Link>

            </div>

          </section>

        </div>

      </motion.div>

    </main>

  );
}
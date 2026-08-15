"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Palette,
  Smile,
  PenSquare,
  Loader2,
  Check,
} from "lucide-react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import GlassCard from "@/components/ui/GlassCard";
import Avatar from "@/components/ui/Avatar";

import {
  getCurrentUser,
  updateProfile,
} from "@/services/authService";

import { useAuth } from "@/context/AuthContext";


interface AvatarOption {
  label: string;
  emoji: string;
  color: string;
}


interface ThemeOption {
  name: string;
  value: string;
  color: string;
}


interface ApiErrorResponse {
  detail?: string;
  message?: string;
}


const avatars: AvatarOption[] = [
  {
    label: "Bubble",
    emoji: "☁️",
    color: "var(--accent)",
  },
  {
    label: "Mochi",
    emoji: "🍡",
    color: "var(--primary)",
  },
  {
    label: "Star",
    emoji: "⭐",
    color: "var(--secondary)",
  },
  {
    label: "Cat",
    emoji: "🐱",
    color: "var(--primary)",
  },
  {
    label: "Fox",
    emoji: "🦊",
    color: "var(--accent)",
  },
  {
    label: "Ghost",
    emoji: "👻",
    color: "var(--secondary)",
  },
];


const themes: ThemeOption[] = [
  {
    name: "Purple",
    value: "#7C5CFC",
    color: "#7C5CFC",
  },
  {
    name: "Pink",
    value: "#EC4899",
    color: "#EC4899",
  },
  {
    name: "Blue",
    value: "#3B82F6",
    color: "#3B82F6",
  },
  {
    name: "Green",
    value: "#22C55E",
    color: "#22C55E",
  },
];


export default function SetupPage() {

  const router = useRouter();

  const { token } = useAuth();


  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");


  const [selectedAvatar, setSelectedAvatar] =
    useState<AvatarOption>(avatars[0]);


  const [selectedTheme, setSelectedTheme] =
    useState<ThemeOption>(themes[0]);


  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");


  // ==========================
  // LOAD CURRENT USER
  // ==========================

  useEffect(() => {

    if (!token) {
      const t = window.setTimeout(() => setLoading(false), 0);
      return () => clearTimeout(t);
    }


    const loadUser = async () => {

      try {

        const user = await getCurrentUser();


        setUsername(
          user.username || ""
        );


        setBio(
          user.bio || ""
        );


        const currentAvatar =
          avatars.find(
            (avatar) =>
              avatar.emoji === user.emoji_avatar
          );


        if (currentAvatar) {

          setSelectedAvatar(
            currentAvatar
          );

        }


        const currentTheme =
          themes.find(
            (theme) =>
              theme.value === user.theme_color
          );


        if (currentTheme) {

          setSelectedTheme(
            currentTheme
          );

        }


      } catch (err: unknown) {

        console.error(
          "Failed to load user:",
          err
        );


        setError(
          "Could not load your profile."
        );


      } finally {

        setLoading(false);

      }

    };


    const t = window.setTimeout(() => {
      void loadUser();
    }, 0);

    return () => clearTimeout(t);

  }, [token]);


  // ==========================
  // FINISH SETUP
  // ==========================

  const handleFinish = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

    setError("");


    if (!username.trim()) {

      setError(
        "Please choose an anonymous username."
      );

      return;

    }


    setSaving(true);


    try {

      await updateProfile({

        bio: bio.trim(),

        emoji_avatar:
          selectedAvatar.emoji,

        theme_color:
          selectedTheme.value,

      });


      router.push("/feed");


    } catch (err: unknown) {

      console.error(
        "Profile setup failed:",
        err
      );


      let message =
        "Failed to save your profile.";


      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err
      ) {

        const axiosError =
          err as {
            response?: {
              data?: ApiErrorResponse;
            };
          };


        message =
          axiosError.response?.data?.detail ||
          axiosError.response?.data?.message ||
          message;

      }


      setError(message);


    } finally {

      setSaving(false);

    }

  };


  // ==========================
  // LOADING
  // ==========================

  if (loading) {

    return (

      <main className="flex min-h-screen items-center justify-center bg-[var(--page-gradient)]">

        <div className="flex items-center gap-3 text-[var(--muted)]">

          <Loader2
            size={20}
            className="animate-spin"
          />

          Loading your profile...

        </div>

      </main>

    );

  }


  return (

    <main className="flex min-h-screen items-center justify-center bg-[var(--page-gradient)] px-4 py-10 sm:px-6 lg:px-8">

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
          duration: 0.35,
        }}
        className="w-full max-w-5xl rounded-[40px] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow)] backdrop-blur-2xl lg:p-8"
      >

        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">


          {/* ==========================
              PREVIEW
          ========================== */}

          <section className="rounded-[32px] border border-[var(--border)] bg-[linear-gradient(135deg,var(--page-glow-primary),var(--card),var(--page-glow-secondary))] p-8">

            <div className="flex items-center gap-2 text-[var(--secondary)]">

              <Sparkles size={16} />

              <p className="text-sm font-semibold uppercase tracking-[0.24em]">

                Profile setup

              </p>

            </div>


            <h1 className="mt-4 text-3xl font-semibold leading-tight text-[var(--text)] sm:text-4xl">

              Make your anonymous self feel delightfully you.

            </h1>


            <p className="mt-4 text-base leading-7 text-[var(--muted)]">

              Give yourself a nickname, a cheeky avatar,
              a tiny bio, and a color that feels like
              your mood for tonight.

            </p>


            {/* LIVE PREVIEW */}

            <div className="mt-8 flex items-center gap-3 rounded-[24px] border border-[var(--border)] bg-[var(--card)] p-4">

              <Avatar
                name={
                  username || "Preview"
                }
                emoji={
                  selectedAvatar.emoji
                }
                color={
                  selectedAvatar.color
                }
                size="lg"
              />


              <div className="min-w-0">

                <p className="truncate font-semibold text-[var(--text)]">

                  @{username || "username"}

                </p>


                <p className="truncate text-sm text-[var(--muted)]">

                  {bio ||
                    "Soft confessions. Bright energy."}

                </p>

              </div>

            </div>

          </section>


          {/* ==========================
              FORM
          ========================== */}

          <section className="rounded-[32px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)] backdrop-blur-2xl sm:p-8">

            <form
              onSubmit={handleFinish}
              className="space-y-5"
            >


              {/* USERNAME */}

              <Input
                label="Anonymous username"
                placeholder="@sunsetmoth"
                value={username}
                onChange={(
                  e: React.ChangeEvent<HTMLInputElement>
                ) =>
                  setUsername(
                    e.target.value.replace(
                      /^@/,
                      ""
                    )
                  )
                }
              />


              {/* BIO */}

              <Input
                label="Bio"
                placeholder="What kind of stranger are you tonight?"
                value={bio}
                onChange={(
                  e: React.ChangeEvent<HTMLInputElement>
                ) =>
                  setBio(
                    e.target.value
                  )
                }
              />


              {/* ==========================
                  AVATAR
              ========================== */}

              <GlassCard className="space-y-4">

                <div className="flex items-center gap-2 text-[var(--text)]">

                  <Smile size={16} />

                  <p className="font-semibold">

                    Choose your avatar

                  </p>

                </div>


                <div className="grid grid-cols-3 gap-3">

                  {avatars.map(
                    (avatar) => {

                      const selected =
                        selectedAvatar.label ===
                        avatar.label;


                      return (

                        <button
                          key={
                            avatar.label
                          }
                          type="button"
                          onClick={() =>
                            setSelectedAvatar(
                              avatar
                            )
                          }
                          className={`relative flex flex-col items-center gap-2 rounded-2xl border p-3 transition ${
                            selected
                              ? "border-[var(--primary)] bg-[var(--surface)] shadow-md"
                              : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)]"
                          }`}
                        >

                          <Avatar
                            name={
                              avatar.label
                            }
                            emoji={
                              avatar.emoji
                            }
                            color={
                              avatar.color
                            }
                            size="sm"
                          />


                          <span className="text-xs text-[var(--muted)]">

                            {avatar.label}

                          </span>


                          {selected && (

                            <span className="absolute right-2 top-2 rounded-full bg-[var(--primary)] p-1 text-white">

                              <Check
                                size={10}
                              />

                            </span>

                          )}

                        </button>

                      );

                    }
                  )}

                </div>

              </GlassCard>


              {/* ==========================
                  THEME
              ========================== */}

              <GlassCard className="space-y-4">

                <div className="flex items-center gap-2 text-[var(--text)]">

                  <Palette size={16} />

                  <p className="font-semibold">

                    Choose your color

                  </p>

                </div>


                <div className="grid grid-cols-4 gap-3">

                  {themes.map(
                    (theme) => {

                      const selected =
                        selectedTheme.name ===
                        theme.name;


                      return (

                        <button
                          key={
                            theme.name
                          }
                          type="button"
                          onClick={() =>
                            setSelectedTheme(
                              theme
                            )
                          }
                          className={`relative flex flex-col items-center gap-2 rounded-2xl border p-3 transition ${
                            selected
                              ? "border-[var(--primary)] bg-[var(--surface)]"
                              : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)]"
                          }`}
                        >

                          <span
                            className="h-9 w-9 rounded-full shadow-sm"
                            style={{
                              backgroundColor:
                                theme.color,
                            }}
                          />


                          <span className="text-xs text-[var(--muted)]">

                            {theme.name}

                          </span>


                          {selected && (

                            <span className="absolute right-1 top-1 rounded-full bg-[var(--primary)] p-1 text-white">

                              <Check
                                size={9}
                              />

                            </span>

                          )}

                        </button>

                      );

                    }
                  )}

                </div>

              </GlassCard>


              {/* MESSAGE */}

              <div className="flex items-center gap-2 rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-3 text-sm text-[var(--muted)]">

                <PenSquare
                  size={16}
                  className="text-[var(--primary)]"
                />

                Make it cute, expressive,
                and a little mysterious.

              </div>


              {/* ERROR */}

              {error && (

                <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-500">

                  {error}

                </p>

              )}


              {/* SUBMIT */}

              <Button
                className="w-full"
                size="lg"
                disabled={saving}
              >

                {saving ? (

                  <>

                    <Loader2
                      size={16}
                      className="mr-2 animate-spin"
                    />

                    Saving...

                  </>

                ) : (

                  <>

                    Finish setup

                    <ArrowRight
                      size={16}
                      className="ml-2"
                    />

                  </>

                )}

              </Button>

            </form>

          </section>

        </div>

      </motion.div>

    </main>

  );

}
"use client";

import { useActionState, useState } from "react";
import { login } from "@/lib/actions";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="flex flex-col">
      <h1 className="mb-2 font-serif text-[44px] font-bold leading-none tracking-tight">
        Nos <em className="font-medium not-italic text-accent italic">envies</em>
      </h1>
      <p className="mb-8 text-[15px] text-muted">Qui es-tu aujourd&apos;hui ?</p>

      <fieldset className="mb-7">
        <legend className="mb-3 text-[13px] font-semibold text-body">Choisis ton profil</legend>
        <div className="flex gap-3.5">
          {["R", "S"].map((profile) => (
            <label key={profile} className="group relative flex-1 cursor-pointer">
              <input type="radio" name="profil" value={profile} required className="peer sr-only" />
              <span className="flex h-[150px] flex-col items-center justify-center gap-3 rounded-[20px] border border-line bg-white text-plum peer-checked:border-plum peer-checked:bg-plum peer-checked:text-bg peer-focus-visible:outline-2 peer-focus-visible:outline-offset-[3px] peer-focus-visible:outline-accent">
                <span className="flex size-[72px] items-center justify-center rounded-full bg-blush font-serif text-[32px] font-bold text-plum group-has-[:checked]:bg-bg">
                  {profile}
                </span>
                <span className="text-[15px] font-semibold">Profil {profile}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="text-[13px] font-semibold text-body">
        <label htmlFor="password">Mot de passe</label>
        <div className="mt-1.5 flex h-[52px] items-center gap-2 rounded-[14px] border border-line bg-white pl-3.5 pr-1.5">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Ton mot de passe"
            autoComplete="current-password"
            required
            className="min-w-0 flex-1 bg-transparent text-base text-ink outline-none"
          />
          <button
            type="button"
            aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            aria-pressed={showPassword}
            onClick={() => setShowPassword((value) => !value)}
            className="h-10 rounded-[10px] bg-blush px-3 text-[13px] font-semibold text-plum"
          >
            {showPassword ? "Masquer" : "Afficher"}
          </button>
        </div>
      </div>

      {state?.error && <p className="mt-3 text-sm font-semibold text-accent">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="fixed bottom-7 left-1/2 h-14 w-[342px] max-w-[calc(100%-48px)] -translate-x-1/2 rounded-[28px] bg-plum text-base font-semibold text-bg disabled:opacity-60"
      >
        {pending ? "Connexion…" : "Entrer"}
      </button>
    </form>
  );
}

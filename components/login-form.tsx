"use client";

import { useActionState, useState } from "react";
import { login } from "@/lib/actions";
import { BrandTitle } from "@/components/brand-title";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="flex flex-col">
      <BrandTitle className="mb-2 text-[44px]" />
      <p className="mb-8 text-[15px] text-muted">Entre le mot de passe pour voir la liste.</p>

      <div className="text-[13px] font-semibold text-body">
        <label htmlFor="password">Mot de passe</label>
        <div className="mt-1.5 flex h-[52px] items-center gap-2 rounded-[14px] border border-line bg-white pl-3.5 pr-1.5">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Ton mot de passe"
            autoComplete="current-password"
            autoFocus
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
        className="press mt-6 h-14 w-full rounded-[28px] bg-plum text-base font-semibold text-bg disabled:opacity-60"
      >
        {pending ? "Connexion…" : "Entrer"}
      </button>
    </form>
  );
}

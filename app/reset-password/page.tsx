"use client";

import { AuthBranding } from "@/app/_components/auth/AuthBranding";
import { ForgotPasswordForm } from "@/app/_components/auth/ForgotPasswordForm";

export default function ForgotPassword() {
  return (
    <div className="flex min-h-screen">
      <AuthBranding
        title={
          <>
            Redefinir
            <br />
            sua senha
          </>
        }
        subtitle="Enviaremos um link para redefinir sua senha no email cadastrado."
      />
      <ForgotPasswordForm />
    </div>
  );
}

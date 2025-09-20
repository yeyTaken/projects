"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface AuthWrapperProps {
  children: React.ReactNode;
  redirectTo?: string; // onde redirecionar se não estiver logado
}

export default function AuthWrapper({
  children,
  redirectTo = "/auth/signin",
}: AuthWrapperProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // redirecionamento automático se não estiver autenticado
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(redirectTo);
    }
  }, [status, router, redirectTo]);

  // exibe mensagem de loading automaticamente
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) return null; // evita renderizar o conteúdo antes do redirect

  return <>{children}</>;
}

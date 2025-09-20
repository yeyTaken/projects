"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";
import AuthWrapper from "@/components/root/AuthWrapper";

export default function SignIn() {
  const { data: session } = useSession();

  if (!session) {
    return (
        <div className="relative flex items-center justify-center h-screen">

          <button
            onClick={() => signIn("google")}
            className="flex items-center gap-3 px-6 py-3 bg-white border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition duration-200 relative z-10"
          >
            <FcGoogle className="text-2xl" />
            <span className="text-gray-700 font-medium">Entrar com Google</span>
          </button>
        </div>
    );
  }

  return (
    <AuthWrapper>
      <div className="relative flex items-center justify-center h-screen">

        <div className="bg-cyan-100/50 shadow-lg rounded-2xl overflow-hidden w-80 relative z-10 border-4 border-cyan-100">
          {/* Conteúdo */}
          <div className="p-6 text-center">
            <Image
              src={session.user?.image ?? "/default-avatar.png"}
              alt="User Avatar"
              width={100}
              height={100}
              className="rounded-full mx-auto mb-4"
            />
            <h1 className="text-xl font-semibold mb-2">
              Olá {session.user?.name}
            </h1>
            <p className="text-gray-600">{session.user?.email}</p>
          </div>

          {/* Footer */}
          <div className="bg-red-600 text-center p-3">
            <button
              onClick={() => signOut()}
              className="text-white font-semibold"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
}

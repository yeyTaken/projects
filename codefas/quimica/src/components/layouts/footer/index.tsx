import { SlChemistry } from "react-icons/sl";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="select-none w-full bg-gradient-to-r from-red-900 via-red-800 to-red-900 text-gray-300 py-8 mt-12 shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 gap-4">
        {/* Logo / Nome */}
        <div className="flex items-center gap-2 text-lg font-semibold">
          <SlChemistry className="text-blue-100" size={28} />
          <span className="text-xl font-bold">
            <Link href="/" className="hover:text-white transition">
              CODEFAS
            </Link>{" "}
            —{" "}
            <Link href="/chemistry" className="hover:text-white transition">
              Química
            </Link>
          </span>
        </div>

        {/* Direitos reservados */}
        <div className="text-center md:text-right text-sm text-gray-400">
          © {new Date().getFullYear()}{" "}
          <Link
            className="hover:text-white transition"
            href="https://github.com/yeytaken/"
          >
            Israel R. Jatobá
          </Link>{" "}
          &{" "}
          <Link
            className="hover:text-white transition"
            href="https://arcstudio.online/"
          >
            ARC Studio
          </Link>
          . Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}

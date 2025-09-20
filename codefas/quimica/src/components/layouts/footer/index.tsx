import { SlChemistry } from "react-icons/sl";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="select-none w-full bg-red-900 text-gray-300 py-6 mt-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4">
        {/* Logo / Nome */}
        <div className="flex items-center space-x-2 text-lg font-semibold">
          <span className="text-2xl font-bold" ><Link href={"/"}>CODEFAS</Link>{" — "}<Link href={"/"}>Química</Link></span>
          <SlChemistry className="text-blue-100 font-extrabold" size={25} />
        </div>
        {/* Links */}
        {/*
        <div className="flex space-x-6 mt-4 md:mt-0">
          <Link href="/chemistry" className="hover:text-white transition">Química</Link>
        </div>
        */}

        {/* Direitos reservados */}
        <div className="mt-4 md:mt-0 text-sm text-gray-400">
          © {new Date().getFullYear()}{" "}
          <Link
            className="hover:text-white transition"
            href="https://github.com/yeytaken/"
          >
            Israel R. Jatobá
          </Link>{" "}
          e{" "}
          <Link
            className="hover:text-white transition"
            href="https://arcstudio.online/"
          >
            ARC Studio
          </Link>
          , Inc. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}

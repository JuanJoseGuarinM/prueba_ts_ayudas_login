import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-10 py-5 bg-blue-600 text-white shadow-xl border-b border-blue-500">
      {/* Logo */}
      <div className="text-2xl font-black tracking-tighter">
        <Link href="/" className="group flex items-center">
          C.A.N.D.Y
          <span className="text-white ml-0.5 group-hover:animate-pulse">.</span>
        </Link>
      </div>

      {/* Navegación Unificada */}
      <div className="flex items-center gap-10 text-sm font-bold uppercase tracking-widest">
        <Link 
          href="/" 
          className="opacity-80 hover:opacity-100 transition-opacity relative group"
        >
          Inicio
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full"></span>
        </Link>
        
        <Link 
          href="/login" 
          className="opacity-80 hover:opacity-100 transition-opacity relative group"
        >
          Login
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full"></span>
        </Link>

        {/* Register ahora es igual a los demás */}
        <Link 
          href="/register" 
          className="opacity-80 hover:opacity-100 transition-opacity relative group"
        >
          Register
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full"></span>
        </Link>
      </div>
    </nav>
  );
}
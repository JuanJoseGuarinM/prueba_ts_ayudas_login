import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Acceso Seguro | C.A.N.D.Y.",
    description: "Inicia sesión o regístrate en C.A.N.D.Y. para analizar tus exámenes médicos con inteligencia artificial avanzada.",
};

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        // Fondo blanco con un toque de profundidad azulada
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-white bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-gray-50 overflow-hidden relative">
            
            {/* El resplandor (glow) ahora es un azul suave para que no manche el blanco */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[120px] pointer-events-none" />

            {/* Card con borde sutil y sombra elegante */}
            <div className="relative z-10 w-full max-w-md bg-white/70 backdrop-blur-2xl border border-blue-100 rounded-[2.5rem] p-10 shadow-2xl shadow-blue-900/5">
                
                <div className="text-center mb-8">
                    {/* Badge de seguridad en azul */}
                    <div className="inline-block px-4 py-1 rounded-full bg-blue-600 text-white mb-6">
                        <span className="text-[10px] font-black tracking-[0.2em] uppercase">Análisis Seguro con IA</span>
                    </div>

                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
                        C.A.N.D.Y<span className="text-blue-600">.</span>
                    </h1>
                    
                    <p className="text-slate-500 mt-2 font-medium">Gestiona tu salud con precisión</p>
                </div>

                {/* Contenido dinámico (Login o Register) */}
                <div className="min-h-[100px]">
                    {children}
                </div>

                <footer className="text-center mt-10">
                    <p className="text-xs text-slate-400 font-semibold tracking-wider">
                        &copy; 2026 C.A.N.D.Y. - TECNOLOGÍA MÉDICA
                    </p>
                </footer>
            </div>
        </div>
    );
}
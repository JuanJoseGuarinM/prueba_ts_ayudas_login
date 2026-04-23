export default function Home() {
  return (
    <>
      {/* Fondo cambiado a blanco con un degradado radial muy suave para no perder profundidad */}
      <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-white bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-gray-100 text-slate-900">
        
        <div className="text-center max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
          
          {/* El título ahora usa un degradado azul más sólido para resaltar sobre el blanco */}
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter">
            Bienvenido a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">C.A.N.D.Y</span>
          </h1>

          {/* Texto descriptivo en un gris oscuro para mejor legibilidad */}
          <p className="text-xl md:text-2xl text-slate-600 mb-10 font-light leading-relaxed">
            Entender tu salud nunca fue tan sencillo.
            Sube tus exámenes y deja que C.A.N.D.Y. te guíe. Una herramienta diseñada para darte el conocimiento que necesitas sobre tus resultados, eliminando la incertidumbre de los términos médicos.
          </p>

          <div className="flex gap-4 justify-center">
            {/* Botón Registrarse: Azul sólido y llamativo */}
            <a 
              href="/register" 
              className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg shadow-blue-200"
            >
              Registrarse
            </a>

            {/* Botón Iniciar sesión: Estilo "Outline" con borde azul para que sea visible pero secundario */}
            <a 
              href="/login" 
              className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-full font-bold hover:bg-blue-50 transition-all"
            >
              Iniciar sesión
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
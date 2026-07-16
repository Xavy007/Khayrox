import { login } from './actions'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050914]">
      <div className="w-full max-w-md p-8 bg-surface border border-primary/20 rounded-2xl shadow-[0_0_50px_rgba(0,212,255,0.1)]">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            KHAYROX
          </h1>
          <p className="text-muted mt-2">Panel de Administración</p>
        </div>

        <form className="space-y-6" action={login}>
          <div>
            <label className="block text-sm font-bold text-foreground mb-2" htmlFor="email">
              Correo Electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full bg-background border border-primary/20 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="admin@khayrox.com"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-foreground mb-2" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full bg-background border border-primary/20 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="••••••••"
            />
          </div>

          <button
            formAction={login}
            className="w-full py-3 bg-primary text-[#050914] font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(0,212,255,0.4)] mt-4"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  )
}

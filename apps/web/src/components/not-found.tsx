import { useNavigate } from '@tanstack/react-router'

export function NotFound() {
  const navigate = useNavigate()

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-background px-6 py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,hsl(var(--accent))_0%,transparent_55%)] opacity-15" />
      <div className="relative w-full max-w-lg rounded-3xl border border-border bg-card/80 p-8 shadow-xl backdrop-blur">
        <span className="font-semibold text-muted-foreground text-xs uppercase tracking-[0.3em]">
          404
        </span>
        <h1 className="mt-4 font-semibold text-3xl text-foreground">
          Pagina nao encontrada
        </h1>
        <p className="mt-3 text-muted-foreground text-sm leading-6">
          A rota que voce tentou acessar nao existe ou foi movida. Verifique o
          endereço ou volte para o login.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm shadow-sm transition hover:bg-primary/90"
            onClick={() => {
              navigate({
                to: '/login',
                replace: true,
              })
            }}
            type="button"
          >
            Ir para login
          </button>
          <button
            className="inline-flex items-center justify-center rounded-md border border-border bg-muted px-4 py-2 font-medium text-foreground text-sm shadow-sm transition hover:bg-muted/80"
            onClick={() => {
              navigate({
                to: '/dashboard',
                replace: true,
              })
            }}
            type="button"
          >
            Ir para inicio
          </button>
        </div>
      </div>
    </main>
  )
}

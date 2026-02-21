import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { PlusIcon } from 'lucide-react'
import { ButtonLogout } from '@/components/button-logout'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export const Route = createFileRoute(
  '/(private)/trator/(with-navbar)/servicos'
)({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between border-b bg-background px-4 py-3">
        <div>
          <p className="text-muted-foreground text-xs uppercase tracking-wide">
            Trator
          </p>
          <h1 className="font-semibold text-lg">Meus Serviços</h1>
        </div>
        <ButtonLogout />
      </header>

      <main className="mb-16 flex flex-1 flex-col justify-between gap-4">
        {/* Lista de serviços */}
        <section className="flex-1 p-4">
          <p className="font-medium text-sm">Serviços cadastrados</p>
        </section>

        <Separator orientation="horizontal" />

        {/* Botão para criar um novo serviço */}
        <Button
          className="mx-2 py-4"
          onClick={() =>
            navigate({
              to: '/trator/servico/novo',
            })
          }
          size="sm"
        >
          <PlusIcon className="size-4" />
          Criar Novo Serviço
        </Button>
      </main>
    </div>
  )
}

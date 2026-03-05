import { createFileRoute, Link } from '@tanstack/react-router'
import { ChevronRightIcon, SettingsIcon, UsersIcon } from 'lucide-react'
import { ButtonLogout } from '@/components/button-logout'
import { buttonVariants } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'

export const Route = createFileRoute('/(private)/(admin)/mais')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="space-y-2">
      <header className="flex items-center justify-between border-b px-4 py-3">
        <div>
          <h1 className="font-semibold text-lg">Mais</h1>
        </div>
        <ButtonLogout />
      </header>

      <main className="space-y-6 px-4">
        <section>
          <ButtonGroup className="w-full" orientation="vertical">
            <Link
              className={buttonVariants({
                variant: 'outline',
                className: 'items-center justify-between gap-4 p-6',
              })}
              to="/clientes"
            >
              <UsersIcon className="size-8 rounded-full bg-primary-foreground/10 p-2 text-primary" />
              <div className="flex-1">
                <p className="font-semibold text-sm capitalize">Clientes</p>
                <p className="text-foreground text-xs">
                  consulta, histórico e associação
                </p>
              </div>
              <ChevronRightIcon className="ml-auto size-4" />
            </Link>
            <Link
              className={buttonVariants({
                variant: 'outline',
                className: 'items-center justify-between gap-4 p-6',
              })}
              to="/configuracoes"
            >
              <SettingsIcon className="size-8 rounded-full bg-primary-foreground/10 p-2 text-primary" />
              <div className="flex-1">
                <p className="font-semibold text-sm capitalize">
                  Configurações
                </p>
                <p className="text-foreground text-xs">Tarifas horárias</p>
              </div>
              <ChevronRightIcon className="ml-auto size-4" />
            </Link>
          </ButtonGroup>
        </section>
      </main>
    </div>
  )
}

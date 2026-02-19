import { createFileRoute } from '@tanstack/react-router'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  DollarSignIcon,
  LogOutIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ButtonGroup, ButtonGroupSeparator } from '@/components/ui/button-group'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/(private)/trator/(with-navbar)/horas')({
  component: RouteComponent,
})

function RouteComponent() {
  const isFilterMonth = true
  const selectedPeriodLabel = 'Junho 2024'

  const summaryCards = [
    {
      id: 'total-hours',
      icon: ClockIcon,
      label: 'Total de Horas',
      value: '6h 30min',
      valueClassName: 'text-base',
    },
    {
      id: 'estimated-earnings',
      icon: DollarSignIcon,
      label: 'Ganhos Estimados',
      value: 'R$ 600,00',
      valueClassName: 'text-base text-primary',
    },
  ] as const

  const dailyEntries = [
    {
      id: '2024-02-17',
      label: 'Ter 17/02',
      hours: '2h 30min',
      earnings: 'R$ 250,00',
    },
    {
      id: '2024-02-18',
      label: 'Qua 18/02',
      hours: '2h 30min',
      earnings: 'R$ 250,00',
    },
  ] as const

  return (
    <div className="min-h-dvh bg-background">
      <header className="flex items-center justify-between border-b bg-background px-4 py-3">
        <div>
          <p className="text-muted-foreground text-xs uppercase tracking-wide">
            Trator
          </p>
          <h1 className="font-semibold text-lg">Minhas Horas</h1>
        </div>
        <Button aria-label="Sair" size="icon" type="button" variant="ghost">
          <LogOutIcon className="size-4" />
        </Button>
      </header>

      <main className="space-y-6 px-4 py-6">
        <section className="space-y-3">
          <ButtonGroup className="w-full">
            <Button
              className="flex-1"
              variant={isFilterMonth ? 'outline' : 'default'}
            >
              Semana
            </Button>
            <ButtonGroupSeparator />
            <Button
              className="flex-1"
              variant={isFilterMonth ? 'default' : 'outline'}
            >
              Mês
            </Button>
          </ButtonGroup>
        </section>

        <section className="flex items-center justify-between gap-3 rounded-lg border bg-card px-4 py-2">
          <Button aria-label="Período anterior" size="icon" variant="ghost">
            <ChevronLeftIcon className="size-4" />
          </Button>
          <p className="font-medium text-sm">{selectedPeriodLabel}</p>
          <Button aria-label="Proximo período" size="icon" variant="ghost">
            <ChevronRightIcon className="size-4" />
          </Button>
        </section>

        <section className="flex items-center justify-start gap-4 overflow-auto">
          {summaryCards.map(
            ({ id, icon: Icon, label, value, valueClassName }) => (
              <Card className="flex-1" key={id}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 font-medium text-muted-foreground text-xs">
                    <Icon className="size-4 text-primary" />
                    <p className="max-w-2/3 truncate">{label}</p>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={valueClassName}>{value}</p>
                </CardContent>
              </Card>
            )
          )}
        </section>

        <section className="space-y-3">
          <p className="font-medium text-sm">Por dia</p>
          <div className="space-y-2">
            {dailyEntries.map((entry) => (
              <Card key={entry.id}>
                <CardContent className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-sm">{entry.label}</p>
                    <p className="text-sm">{entry.hours}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-base text-primary">
                      {entry.earnings}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

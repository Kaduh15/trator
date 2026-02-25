import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  DollarSignIcon,
} from 'lucide-react'
import { useState } from 'react'
import { ButtonLogout } from '@/components/button-logout'
import { Button } from '@/components/ui/button'
import { ButtonGroup, ButtonGroupSeparator } from '@/components/ui/button-group'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getTractorMe } from '@/http/queries/tractor'
import { queryClient } from '@/providers/query-provider'

export const Route = createFileRoute('/(private)/trator/(with-navbar)/horas')({
  component: RouteComponent,
  loader: async () => {
    await queryClient.ensureQueryData(getTractorMe())
  },
})

function RouteComponent() {
  const { data } = useSuspenseQuery(getTractorMe())

  const [isFilterMonth, setIsFilterMonth] = useState(true)
  const selectedPeriodLabel = 'Junho 2024'

  const summaryCards = [
    {
      id: 'total-hours',
      icon: ClockIcon,
      label: 'Total de Horas',
      value: `${Math.floor(data.totalWorkedMinutes / 60)}h ${data.totalWorkedMinutes % 60}min`,
      valueClassName: 'text-base',
    },
    {
      id: 'estimated-earnings',
      icon: DollarSignIcon,
      label: 'Ganhos Estimados',
      value: (data.totalTractorCents / 100).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }),
      valueClassName: 'text-base text-primary',
    },
  ] as const

  const dailyEntries = data.weeks.map((week, index) => {
    return {
      id: week.weekStartDate,
      label: `Semana ${index + 1} (${new Date(
        week.weekStartDate
      ).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
      })})`,
      hours: `${Math.floor(week.workedMinutes / 60)}h ${week.workedMinutes % 60}min`,
      earnings: (week.tractorCents / 100).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }),
    }
  })

  return (
    <div className="">
      <header className="flex items-center justify-between border-b px-4 py-3">
        <div>
          <p className="text-muted-foreground text-xs uppercase tracking-wide">
            Trator
          </p>
          <h1 className="font-semibold text-lg">Minhas Horas</h1>
        </div>
        <ButtonLogout />
      </header>

      <main className="space-y-6 px-4 py-6">
        <section className="space-y-3">
          <ButtonGroup className="w-full">
            <Button
              className="flex-1"
              onClick={() => setIsFilterMonth(false)}
              variant={isFilterMonth ? 'outline' : 'default'}
            >
              Semana
            </Button>
            <ButtonGroupSeparator />
            <Button
              className="flex-1"
              onClick={() => setIsFilterMonth(true)}
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

import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DollarSignIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  WrenchIcon,
} from 'lucide-react'
import { useState } from 'react'
import { ButtonLogout } from '@/components/button-logout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getDashboardQueryOptions } from '@/http/queries/dashboard'
import { queryClient } from '@/providers/query-provider'
import { formatCurrency } from '@/utils/format-currency'

const capitalize = (value: string) =>
  value.length === 0 ? value : `${value[0].toUpperCase()}${value.slice(1)}`

export const Route = createFileRoute('/(private)/(admin)/dashboard')({
  component: RouteComponent,
  loader: async () => {
    await queryClient.ensureQueryData(getDashboardQueryOptions())
  },
})

function RouteComponent() {
  const [selectedMonth, setSelectedMonth] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  )
  const selectedMonthParam = `${selectedMonth.getFullYear()}-${String(
    selectedMonth.getMonth() + 1
  ).padStart(2, '0')}`
  const selectedPeriodLabel = capitalize(
    selectedMonth.toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric',
    })
  )
  const { data } = useSuspenseQuery(
    getDashboardQueryOptions({ month: selectedMonthParam })
  )

  const {
    totalGeneratedCents,
    totalExpensesCents,
    finalBalanceCents,
    receivedCents,
  } = data.summary

  const summaryCards = [
    {
      id: 'total-generated',
      icon: DollarSignIcon,
      label: 'Total gerado',
      value: formatCurrency(totalGeneratedCents, true),
      valueClassName: 'text-base font-semibold text-primary',
    },
    {
      id: 'received',
      icon: FileTextIcon,
      label: 'Recebido',
      value: formatCurrency(receivedCents, true),
      valueClassName: 'text-base font-semibold',
    },
    {
      id: 'total-expenses',
      icon: WrenchIcon,
      label: 'Total despesas',
      value: formatCurrency(totalExpensesCents, true),
      valueClassName: 'text-base font-semibold text-destructive',
    },
    {
      id: 'final-balance',
      icon: LayoutDashboardIcon,
      label: 'Saldo final',
      value: formatCurrency(finalBalanceCents, true),
      valueClassName: 'text-base font-semibold text-primary',
    },
  ] as const

  return (
    <div className="space-y-2">
      <header className="flex items-center justify-between border-b px-4 py-3">
        <div>
          <h1 className="font-semibold text-lg">Dashboard</h1>
        </div>
        <ButtonLogout />
      </header>

      <main className="space-y-6 px-4">
        <section className="flex items-center justify-between gap-3 rounded-lg border bg-card px-4 py-2">
          <Button
            aria-label="Período anterior"
            onClick={() =>
              setSelectedMonth(
                (current) =>
                  new Date(current.getFullYear(), current.getMonth() - 1, 1)
              )
            }
            size="icon"
            variant="ghost"
          >
            <ChevronLeftIcon className="size-4" />
          </Button>
          <p className="font-medium text-sm">{selectedPeriodLabel}</p>
          <Button
            aria-label="Proximo período"
            onClick={() =>
              setSelectedMonth(
                (current) =>
                  new Date(current.getFullYear(), current.getMonth() + 1, 1)
              )
            }
            size="icon"
            variant="ghost"
          >
            <ChevronRightIcon className="size-4" />
          </Button>
        </section>
        <section>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map(
              ({ id, icon: Icon, label, value, valueClassName }) => (
                <Card key={id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 font-medium text-muted-foreground text-xs">
                      <Icon className="size-4 text-primary" />
                      <p className="min-w-0 truncate">{label}</p>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={valueClassName}>{value}</p>
                  </CardContent>
                </Card>
              )
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

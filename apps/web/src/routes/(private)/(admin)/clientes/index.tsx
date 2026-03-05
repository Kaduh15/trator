import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useMemo } from 'react'
import { PageHeader } from '@/components/page-header'
import { getClientsQueryOptions } from '@/http/queries/client'
import { getServicesQueryOptions } from '@/http/queries/service'
import { queryClient } from '@/providers/query-provider'
import { formatCurrency } from '@/utils/format-currency'

export const Route = createFileRoute('/(private)/(admin)/clientes/')({
  component: RouteComponent,
  loader: async () => {
    await Promise.all([
      queryClient.ensureQueryData(getClientsQueryOptions()),
      queryClient.ensureQueryData(getServicesQueryOptions()),
    ])
  },
})

function RouteComponent() {
  const { data: clients } = useSuspenseQuery(getClientsQueryOptions())
  const { data: services } = useSuspenseQuery(getServicesQueryOptions())

  const clientSummaries = useMemo(() => {
    const summaries = new Map<
      string,
      {
        totalCents: number
        paidCents: number
        pendingCents: number
        hasPendingServices: boolean
      }
    >()

    for (const client of clients) {
      summaries.set(client.id, {
        totalCents: 0,
        paidCents: 0,
        pendingCents: 0,
        hasPendingServices: false,
      })
    }

    for (const service of services) {
      if (service.status !== 'done') {
        continue
      }

      const clientId = service.client?.id

      if (!clientId) {
        continue
      }

      const summary = summaries.get(clientId)

      if (!summary) {
        continue
      }

      const totalCents = Math.trunc(
        (service.clientHourlyRateCents * service.workedMinutes) / 60
      )
      const paidCents = service.payments.reduce((acc, payment) => {
        return acc + payment.amountCents
      }, 0)

      summary.totalCents += totalCents
      summary.paidCents += paidCents

      if (totalCents > paidCents) {
        summary.hasPendingServices = true
      }
    }

    for (const summary of summaries.values()) {
      summary.pendingCents = Math.max(summary.totalCents - summary.paidCents, 0)
    }

    return summaries
  }, [clients, services])

  return (
    <div className="flex flex-col">
      <PageHeader title="Clientes" />

      <main className="mb-16 flex flex-1 flex-col justify-between gap-4">
        <section className="flex-1 p-4">
          <p className="font-medium text-sm">Clientes: {clients.length}</p>
          {clients.length === 0 ? (
            <p className="mt-4 text-muted-foreground text-sm">
              Nenhum cliente cadastrado.
            </p>
          ) : (
            <ul className="scroll-y mt-4 space-y-2 scroll-auto">
              {clients.map((client) => {
                const summary = clientSummaries.get(client.id)
                const pendingCents = summary?.pendingCents ?? 0
                const hasPendingServices = summary?.hasPendingServices ?? false

                return (
                  <li key={client.id}>
                    <Link
                      className="flex items-center justify-between rounded-xl border bg-card p-4 transition-all hover:border-primary/40"
                      params={{ id: client.id }}
                      to="/clientes/$id"
                    >
                      <div className="min-w-0 flex-1 space-y-1">
                        <p className="font-semibold text-base">{client.name}</p>
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center rounded-full border px-2 py-0.5 font-medium text-xs ${
                              client.isAssociated
                                ? 'border-primary/20 bg-primary/10 text-primary'
                                : 'border-border bg-muted text-muted-foreground'
                            }`}
                          >
                            {client.isAssociated
                              ? 'Associado'
                              : 'Não associado'}
                          </span>
                        </div>
                        {pendingCents > 0 && (
                          <p className="text-muted-foreground text-sm">
                            Pendente: {formatCurrency(pendingCents, true)}
                          </p>
                        )}
                      </div>
                      <div
                        className={`flex h-8 items-center rounded-full px-3 font-semibold text-xs ${
                          hasPendingServices
                            ? 'bg-warning text-warning-foreground'
                            : 'bg-success text-success-foreground'
                        }`}
                      >
                        {hasPendingServices
                          ? 'Com pendências'
                          : 'Sem pendências'}
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </main>
    </div>
  )
}

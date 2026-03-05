import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { BanknoteIcon, CalendarIcon, ClockIcon } from 'lucide-react'
import { useMemo } from 'react'
import { PageHeader } from '@/components/page-header'
import { Switch } from '@/components/ui/switch'
import {
  getClientsQueryOptions,
  updateClientAssociationMutationOptions,
} from '@/http/queries/client'
import { getLastRateSettingsQueryOptions } from '@/http/queries/rate-settings'
import { getServicesQueryOptions } from '@/http/queries/service'
import { queryClient } from '@/providers/query-provider'
import { formatCurrency } from '@/utils/format-currency'

export const Route = createFileRoute('/(private)/(admin)/clientes/$id')({
  component: RouteComponent,
  loader: async () => {
    await Promise.all([
      queryClient.ensureQueryData(getClientsQueryOptions()),
      queryClient.ensureQueryData(getServicesQueryOptions()),
      queryClient.ensureQueryData(getLastRateSettingsQueryOptions()),
    ])
  },
})

function RouteComponent() {
  const params = Route.useParams()

  const { data: clients } = useSuspenseQuery(getClientsQueryOptions())
  const { data: services } = useSuspenseQuery(getServicesQueryOptions())
  const { data: rateSettings } = useSuspenseQuery(
    getLastRateSettingsQueryOptions()
  )
  const { mutate: updateAssociation, isPending: isUpdatingAssociation } =
    useMutation(updateClientAssociationMutationOptions())

  const client = clients.find((item) => item.id === params.id)

  const clientServices = useMemo(() => {
    if (!client) {
      return []
    }

    return services.filter((service) => {
      return service.client?.id === client.id && service.status === 'done'
    })
  }, [client, services])

  const { totalCents, paidCents } = useMemo(() => {
    return clientServices.reduce(
      (acc, service) => {
        const serviceTotalCents =
          service.totalClientCents ??
          Math.trunc(
            (service.clientHourlyRateCents * service.workedMinutes) / 60
          )

        const servicePaidCents = service.payments.reduce((sum, payment) => {
          return sum + payment.amountCents
        }, 0)

        acc.totalCents += serviceTotalCents
        acc.paidCents += servicePaidCents

        return acc
      },
      {
        totalCents: 0,
        paidCents: 0,
      }
    )
  }, [clientServices])

  const summary = {
    totalCents,
    paidCents,
    pendingCents: Math.max(totalCents - paidCents, 0),
  }

  const clientPayments = useMemo(() => {
    return clientServices
      .flatMap((service) => {
        return service.payments.map((payment) => {
          return {
            ...payment,
            serviceDescription: service.description,
            serviceId: service.id,
          }
        })
      })
      .sort((first, second) => {
        return (
          new Date(second.paidAt).getTime() - new Date(first.paidAt).getTime()
        )
      })
  }, [clientServices])

  if (!client) {
    return (
      <div className="flex flex-col">
        <PageHeader title="Clientes" />
        <main className="mb-16 flex flex-1 flex-col justify-between gap-4">
          <section className="flex-1 p-4">
            <p className="rounded-xl border bg-card p-4 text-center text-muted-foreground text-sm">
              Cliente não encontrado.
            </p>
          </section>
        </main>
      </div>
    )
  }

  const hourlyRateCents = client.isAssociated
    ? rateSettings.data.clientAssociateHourlyRate
    : rateSettings.data.clientNonAssociateHourlyRate

  return (
    <div className="flex flex-col">
      <PageHeader title={client.name} />

      <main className="mb-16 flex flex-1 flex-col justify-between gap-4">
        <section className="flex-1 p-4">
          <div className="rounded-xl border bg-card p-4">
            <h2 className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
              Status do Cliente
            </h2>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-medium text-sm">
                  {client.isAssociated ? 'Associado' : 'Não associado'}
                </p>
                <p className="text-muted-foreground text-xs">
                  Valor/hora atual: {formatCurrency(hourlyRateCents, true)}/h
                </p>
                <p className="text-[10px] text-muted-foreground/60 italic">
                  Configuração atual · não retroativo
                </p>
              </div>
              <span
                className={`inline-flex items-center rounded-full border px-2 py-0.5 font-medium text-xs ${
                  client.isAssociated
                    ? 'border-primary/20 bg-primary/10 text-primary'
                    : 'border-border bg-muted text-muted-foreground'
                }`}
              >
                {client.isAssociated ? 'Associado' : 'Não associado'}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">Associado</span>
                <Switch
                  checked={client.isAssociated}
                  disabled={isUpdatingAssociation}
                  onCheckedChange={(checked) => {
                    updateAssociation({
                      clientId: client.id,
                      isAssociated: checked,
                    })
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="mb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
              Resumo Financeiro
            </h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-xl border bg-card p-4">
                <span className="text-muted-foreground text-sm">
                  Total Gerado
                </span>
                <span className="font-bold text-lg">
                  {formatCurrency(summary.totalCents, true)}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl border bg-card p-4">
                <span className="text-muted-foreground text-sm">
                  Total Pago
                </span>
                <span className="font-bold text-lg text-success">
                  {formatCurrency(summary.paidCents, true)}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl border bg-card p-4">
                <span className="text-muted-foreground text-sm">Pendente</span>
                <span
                  className={`font-bold text-lg ${summary.pendingCents > 0 ? 'text-warning' : 'text-success'}`}
                >
                  {formatCurrency(summary.pendingCents, true)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="mb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
              Serviços ({clientServices.length})
            </h2>
            {clientServices.length === 0 ? (
              <p className="rounded-xl border bg-card p-4 text-center text-muted-foreground text-sm">
                Nenhum serviço concluído.
              </p>
            ) : (
              <ul className="scroll-y space-y-2 scroll-auto">
                {clientServices.map((service) => {
                  const serviceTotalCents =
                    service.totalClientCents ??
                    Math.trunc(
                      (service.clientHourlyRateCents * service.workedMinutes) /
                        60
                    )
                  const servicePaidCents = service.payments.reduce(
                    (sum, payment) => {
                      return sum + payment.amountCents
                    },
                    0
                  )
                  const isPaid = servicePaidCents >= serviceTotalCents
                  const serviceDate = service.finishedAt ?? service.createdAt

                  return (
                    <li
                      className="rounded-xl border bg-card p-4"
                      key={service.id}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold leading-tight">
                            {service.description}
                          </p>
                          <div className="mt-2 flex flex-wrap items-center gap-3 text-muted-foreground text-xs">
                            <span className="flex items-center gap-1">
                              <CalendarIcon className="inline size-3" />
                              {new Date(serviceDate).toLocaleDateString(
                                'pt-BR',
                                {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                }
                              )}
                            </span>
                            <span className="flex items-center gap-1">
                              <ClockIcon className="inline size-3" />
                              {Math.trunc(service.workedMinutes / 60)}h{' '}
                              {service.workedMinutes % 60 > 0
                                ? `${service.workedMinutes % 60}m`
                                : ''}
                            </span>
                            <span className="text-muted-foreground/60">
                              {formatCurrency(
                                service.clientHourlyRateCents,
                                true
                              )}
                              /h
                            </span>
                          </div>
                        </div>
                        <div className="shrink-0 space-y-2 text-right">
                          <p className="font-bold text-base">
                            {formatCurrency(serviceTotalCents, true)}
                          </p>
                          <span
                            className={`inline-flex items-center rounded-full border px-2 py-0.5 font-medium text-[10px] ${
                              isPaid
                                ? 'border-success/20 bg-success/10 text-success'
                                : 'border-warning/20 bg-warning/10 text-warning'
                            }`}
                          >
                            {isPaid ? 'Pago' : 'Pendente'}
                          </span>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          <div className="mt-6">
            <h2 className="mb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
              Pagamentos Registrados ({clientPayments.length})
            </h2>
            {clientPayments.length === 0 ? (
              <p className="rounded-xl border bg-card p-4 text-center text-muted-foreground text-sm">
                Nenhum pagamento registrado.
              </p>
            ) : (
              <ul className="scroll-y space-y-2 scroll-auto">
                {clientPayments.map((payment) => (
                  <li
                    className="flex items-center justify-between gap-4 rounded-xl border bg-card p-4"
                    key={payment.id}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <BanknoteIcon className="h-4 w-4 text-success" />
                        {new Date(payment.paidAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                      </div>
                      <p className="mt-1 text-muted-foreground text-xs">
                        {payment.serviceDescription}
                      </p>
                      {payment.note ? (
                        <p className="mt-1 text-muted-foreground/70 text-xs">
                          {payment.note}
                        </p>
                      ) : null}
                    </div>
                    <span className="font-bold text-base text-success">
                      {formatCurrency(payment.amountCents, true)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

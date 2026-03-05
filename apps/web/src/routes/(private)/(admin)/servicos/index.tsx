import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ClockIcon, DollarSignIcon } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { getServicesQueryOptions } from '@/http/queries/service'
import { queryClient } from '@/providers/query-provider'

export const Route = createFileRoute('/(private)/(admin)/servicos/')({
  component: RouteComponent,
  loader: async () => {
    await queryClient.ensureQueryData(getServicesQueryOptions())
  },
})

function RouteComponent() {
  const { data: services } = useSuspenseQuery(getServicesQueryOptions())
  const servicesOpen = services.filter((service) => {
    const totalCents = Math.trunc(
      (service.clientHourlyRateCents * service.workedMinutes) / 60
    )

    const totalAmount = totalCents / 100

    const paidAmount =
      service.payments.reduce((acc, payment) => {
        return acc + payment.amountCents
      }, 0) / 100

    const remainingAmount = totalAmount - paidAmount

    return service.status === 'done' && remainingAmount > 0
  })

  const quantityServices = servicesOpen.length

  return (
    <div className="flex flex-col">
      <PageHeader eyebrow="Trator" title="Meus Serviços" />

      <main className="mb-16 flex flex-1 flex-col justify-between gap-4">
        <section className="flex-1 p-4">
          <p className="font-medium text-sm">Serviços: {quantityServices}</p>
          <ul className="scroll-y mt-4 space-y-2 scroll-auto">
            {servicesOpen.map((service) => (
              <li
                className="border p-4 transition-all data-[selected=true]:border-primary"
                key={service.id}
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-semibold">{service.client?.name}</p>
                    <p className="text-muted-foreground text-sm">
                      {service.description}
                    </p>
                    <p className="flex items-center gap-1 text-muted-foreground text-xs">
                      <ClockIcon className="inline size-3" />
                      {new Date(service.createdAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <Link
                    className="flex items-center gap-1 bg-primary px-3 py-2 text-sm text-white transition-colors hover:bg-primary/90"
                    params={{ id: service.id }}
                    to="/servicos/$id/pagamento"
                  >
                    <DollarSignIcon className="size-4" />
                    Registrar
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  )
}

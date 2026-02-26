import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { CalendarIcon, ClockIcon, DollarSignIcon } from 'lucide-react'
import { ButtonLogout } from '@/components/button-logout'
import { getServicesQueryOptions } from '@/http/queries/service'
import { queryClient } from '@/providers/query-provider'

export const Route = createFileRoute(
  '/(private)/(admin)/servicos/$id/pagamento'
)({
  component: RouteComponent,
  loader: async () => {
    await queryClient.ensureQueryData(getServicesQueryOptions())
  },
})

function RouteComponent() {
  const params = Route.useParams()

  const { data: services } = useSuspenseQuery(getServicesQueryOptions())

  const service = services.find((service) => {
    return service.id === params.id
  })
  console.log('🚀 ~ RouteComponent ~ service:', service)

  if (!service) {
    return <div>Serviço não encontrado</div>
  }

  return (
    <div className="flex flex-col">
      <header className="flex items-center justify-between border-b bg-background px-4 py-3">
        <div>
          <p className="text-muted-foreground text-xs uppercase tracking-wide">
            Trator
          </p>
          <h1 className="font-semibold text-lg">Registrar pagamento</h1>
        </div>
        <ButtonLogout />
      </header>

      <main className="mb-16 flex flex-1 flex-col justify-between gap-4">
        {/* Lista de serviços */}
        <section className="flex-1 p-4">
          <div>
            <p className="font-semibold">{service.client?.name}</p>
            <p className="text-muted-foreground text-sm">
              {service.description}
            </p>

            <div className="mt-4 flex items-center gap-4 text-muted-foreground text-sm">
              <div className="flex items-center gap-1">
                <CalendarIcon className="inline size-3" />
                {new Date(service.createdAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </div>

              <div className="flex items-center gap-1">
                <ClockIcon className="inline size-3" />
                {service.workedMinutes / 60}h {service.workedMinutes % 60}m
              </div>
              <div className="flex items-center gap-1">
                <DollarSignIcon className="inline size-3" />
                {service.totalAmountCents
                  ? (service.totalAmountCents / 100).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })
                  : 'Valor não calculado'}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

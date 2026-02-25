import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ClockIcon, PlusIcon } from 'lucide-react'
import { Activity, useState } from 'react'
import { ButtonLogout } from '@/components/button-logout'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  getServicesQueryOptions,
  updateServiceMutationOptions,
} from '@/http/queries/service'
import { queryClient } from '@/providers/query-provider'

export const Route = createFileRoute(
  '/(private)/trator/(with-navbar)/servicos'
)({
  component: RouteComponent,
  loader: async () => {
    await queryClient.ensureQueryData(getServicesQueryOptions())
  },
})

function extractWorkedMinutes(workMinutes: string) {
  const [hours, minutes] = workMinutes.split(':').map(Number)
  return hours * 60 + minutes
}

function RouteComponent() {
  const { data: services } = useSuspenseQuery(getServicesQueryOptions())
  const servicesOpen = services.filter((service) => service.status === 'open')

  const quantityServices = servicesOpen.length

  const [serviceSelect, setServiceSelect] = useState<string | null>(null)
  const [workedMinutes, setWorkedMinutes] = useState('00:00')

  const workedMinutesNumber = extractWorkedMinutes(workedMinutes)

  const { mutateAsync: updateService } = useMutation(
    updateServiceMutationOptions()
  )

  async function handleUpdateService(serviceId: string) {
    if (workedMinutes === '00:00') {
      return
    }

    await updateService(
      {
        serviceId,
        workedMinutes: workedMinutesNumber,
      },
      {
        onSuccess: () => {
          setServiceSelect(null)
          setWorkedMinutes('00:00')
        },
      }
    )
  }

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
          <p className="font-medium text-sm">Serviços: {quantityServices}</p>
          <ul className="mt-4 space-y-2 scroll-auto">
            {servicesOpen.map((service) => (
              <li
                className="border p-4 transition-all data-[selected=true]:border-primary"
                data-selected={serviceSelect === service.id}
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
                  <Activity
                    mode={serviceSelect === service.id ? 'hidden' : 'visible'}
                  >
                    <Button onClick={() => setServiceSelect(service.id)}>
                      Finalizar
                    </Button>
                  </Activity>
                </div>
                <Activity
                  mode={serviceSelect === service.id ? 'visible' : 'hidden'}
                >
                  <div className="space-y-2">
                    <Separator className="my-4" orientation="horizontal" />
                    <p>Horas trabalhadas</p>
                    <Input
                      onChange={(e) => setWorkedMinutes(e.target.value)}
                      placeholder="ex: 5"
                      type="time"
                      value={workedMinutes}
                    />
                    <ButtonGroup className="flex w-full items-center justify-end">
                      <Button
                        disabled={workedMinutes === '00:00'}
                        onClick={() => handleUpdateService(service.id)}
                        size="sm"
                      >
                        Finalizar Serviço
                      </Button>
                      <Button
                        onClick={() => {
                          setServiceSelect(null)
                          setWorkedMinutes('00:00')
                        }}
                        size="sm"
                        type="button"
                        variant="outline"
                      >
                        Cancelar
                      </Button>
                    </ButtonGroup>
                  </div>
                </Activity>
              </li>
            ))}
          </ul>
        </section>

        <Separator orientation="horizontal" />

        {/* Botão para criar um novo serviço */}

        <Link
          className="mx-2 flex items-center justify-center gap-2 bg-primary py-2 text-white"
          to="/trator/servico/novo"
        >
          <PlusIcon className="size-4" />
          Criar Novo Serviço
        </Link>
      </main>
    </div>
  )
}

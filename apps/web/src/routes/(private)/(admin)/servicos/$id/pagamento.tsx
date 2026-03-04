import { useForm, useStore } from '@tanstack/react-form'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { CalendarIcon, ClockIcon } from 'lucide-react'
import z from 'zod'
import { ButtonLogout } from '@/components/button-logout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  getServicesQueryOptions,
  registerPaymentMutationOptions,
} from '@/http/queries/service'
import { queryClient } from '@/providers/query-provider'
import { formatCurrency } from '@/utils/format-currency'

export const Route = createFileRoute(
  '/(private)/(admin)/servicos/$id/pagamento'
)({
  component: RouteComponent,
  loader: async () => {
    await queryClient.ensureQueryData(getServicesQueryOptions())
  },
})

const formSchema = z.object({
  amount: z.number().min(1, 'O valor deve ser maior que zero'),
  observation: z.string(),
})

function RouteComponent() {
  const params = Route.useParams()
  const navigate = Route.useNavigate()

  const { data: services } = useSuspenseQuery(getServicesQueryOptions())

  const service = services.find((service) => {
    return service.id === params.id
  })

  const { mutate: registerPayment } = useMutation(
    registerPaymentMutationOptions()
  )

  const form = useForm({
    defaultValues: {
      amount: 0,
      observation: '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: () => {
      if (!service) {
        return
      }
      registerPayment(
        {
          serviceId: service.id,
          amountCents: Math.round(form.state.values.amount * 100),
          note: form.state.values.observation,
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['services'] })
            navigate({
              to: '/dashboard',
            })
          },
        }
      )
    },
  })

  const formIsValid = useStore(form.store, (state) => {
    if (!service) {
      return false
    }

    const totalCents = Math.trunc(
      (service.clientHourlyRateCents * service.workedMinutes) / 60
    )

    const totalAmount = totalCents / 100

    const paidAmount =
      service.payments.reduce((acc, payment) => {
        return acc + payment.amountCents
      }, 0) / 100

    return (
      state.values.amount > 0 && state.values.amount <= totalAmount - paidAmount
    )
  })

  if (!service) {
    navigate({
      to: '/servicos',
    })
    return null
  }

  const totalCents = Math.trunc(
    (service.clientHourlyRateCents * service.workedMinutes) / 60
  )

  const totalAmount = totalCents / 100

  const paidAmount =
    service.payments.reduce((acc, payment) => {
      return acc + payment.amountCents
    }, 0) / 100

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

      <main className="mb-16 flex flex-1 flex-col justify-between gap-4 p-2">
        <section className="flex-1 border p-4">
          <div>
            <p className="font-semibold">{service.client.name}</p>
            <p className="text-muted-foreground text-sm">
              {service.description}
            </p>
          </div>

          <div className="mt-4 flex items-center gap-4 text-muted-foreground text-xs">
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
              {Math.trunc(service.workedMinutes / 60)}h{' '}
              {service.workedMinutes % 60 > 0
                ? `${service.workedMinutes % 60}m`
                : ''}
            </div>
            <div className="flex items-center gap-1">
              {`R$ ${service.clientHourlyRateCents / 100}/h`}
            </div>
          </div>

          <Separator className="mt-2" />

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">Valor total</p>
              <p className="font-semibold">{`R$ ${totalAmount.toFixed(2)}`}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">pendente</p>
              <p className="font-semibold text-amber-300">{`R$ ${(totalAmount - paidAmount).toFixed(2)}`}</p>
            </div>
          </div>
        </section>

        <form
          className="space-y-4 border border-primary p-4"
          onSubmit={(event) => {
            event.preventDefault()
            event.stopPropagation()
            form.handleSubmit()
          }}
        >
          <form.Field name="amount">
            {(field) => (
              <div className="space-y-2">
                <Label
                  className="text-muted-foreground text-sm"
                  htmlFor={field.name}
                >
                  Valor pago
                </Label>
                <Input
                  className="w-full rounded border p-2"
                  id={field.name}
                  inputMode="numeric"
                  onChange={(event) => {
                    const digitsOnly = event.target.value.replace(/\D/g, '')
                    const numericValue = digitsOnly
                      ? Number(digitsOnly) / 100
                      : 0
                    field.handleChange(numericValue)
                  }}
                  placeholder="R$ 0,00"
                  type="text"
                  value={formatCurrency(field.state.value, false)}
                />
              </div>
            )}
          </form.Field>
          <form.Field name="observation">
            {(field) => (
              <div className="space-y-2">
                <Label
                  className="text-muted-foreground text-sm"
                  htmlFor={field.name}
                >
                  Observação
                </Label>
                <Input
                  className="w-full rounded border p-2"
                  id={field.name}
                  onChange={(event) => {
                    field.handleChange(event.target.value)
                  }}
                  placeholder="Ex: Pagamento por pix"
                  type="text"
                />
              </div>
            )}
          </form.Field>

          <Button
            onClick={() =>
              form.setFieldValue('amount', totalAmount - paidAmount)
            }
            type="button"
            variant="outline"
          >
            Pagar total
          </Button>

          <Button className="mt-4 w-full" disabled={!formIsValid} type="submit">
            Registrar pagamento
          </Button>
        </form>
      </main>
    </div>
  )
}

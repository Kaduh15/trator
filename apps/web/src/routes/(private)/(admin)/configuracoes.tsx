import { useForm, useStore } from '@tanstack/react-form'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { SaveIcon } from 'lucide-react'
import z from 'zod'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group'
import {
  createRateSettingsMutationOptions,
  getLastRateSettingsQueryOptions,
} from '@/http/queries/rate-settings'
import { queryClient } from '@/providers/query-provider'

export const Route = createFileRoute('/(private)/(admin)/configuracoes')({
  component: RouteComponent,
  loader: async () => {
    await queryClient.ensureQueryData(getLastRateSettingsQueryOptions())
  },
})

const formSchema = z.object({
  clientAssociateHourlyRateCents: z
    .number()
    .min(
      0,
      'A tarifa horária para clientes associados deve ser maior ou igual a zero'
    ),
  clientNonAssociateHourlyRateCents: z
    .number()
    .min(
      0,
      'A tarifa horária para clientes não associados deve ser maior ou igual a zero'
    ),
  tractorHourlyRateCents: z
    .number()
    .min(0, 'A tarifa horária do trator deve ser maior ou igual a zero'),
})

const parseCentsInput = (value: string) => {
  const digitsOnly = value.replace(/\D/g, '')
  return digitsOnly ? Number(digitsOnly) : 0
}

function RouteComponent() {
  const { data: rateSettings } = useSuspenseQuery(
    getLastRateSettingsQueryOptions()
  )

  const { mutate: createRateSettings } = useMutation(
    createRateSettingsMutationOptions()
  )

  const initialValues = {
    clientAssociateHourlyRateCents:
      rateSettings.data.clientAssociateHourlyRate / 100,
    clientNonAssociateHourlyRateCents:
      rateSettings.data.clientNonAssociateHourlyRate / 100,
    tractorHourlyRateCents: rateSettings.data.tractorHourlyRate / 100,
  }

  const form = useForm({
    defaultValues: initialValues,
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: () => {
      createRateSettings(
        {
          clientAssociateHourlyRateCents: Math.round(
            form.state.values.clientAssociateHourlyRateCents * 100
          ),
          clientNonAssociateHourlyRateCents: Math.round(
            form.state.values.clientNonAssociateHourlyRateCents * 100
          ),
          tractorHourlyRateCents: Math.round(
            form.state.values.tractorHourlyRateCents * 100
          ),
        },
        {
          onSuccess: () => {
            form.reset()
          },
        }
      )
    },
  })

  const canSubmit = useStore(form.store, (state) => {
    if (!state.values) {
      return false
    }

    const {
      clientAssociateHourlyRateCents,
      clientNonAssociateHourlyRateCents,
      tractorHourlyRateCents,
    } = state.values

    const values = [
      clientAssociateHourlyRateCents,
      clientNonAssociateHourlyRateCents,
      tractorHourlyRateCents,
    ]

    const hasInvalidValue = values.some((value) => value <= 0)
    const hasChanges =
      clientAssociateHourlyRateCents !==
        initialValues.clientAssociateHourlyRateCents ||
      clientNonAssociateHourlyRateCents !==
        initialValues.clientNonAssociateHourlyRateCents ||
      tractorHourlyRateCents !== initialValues.tractorHourlyRateCents

    return hasChanges && !hasInvalidValue
  })

  return (
    <div className="space-y-2">
      <PageHeader title="Configurações" />

      <main className="space-y-6 px-4">
        <section>
          <p className="text-muted-foreground text-sm">
            Mudanças aplicam apenas a novos serviços. Registros passados não são
            alterados.
          </p>
        </section>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <form.Field name="tractorHourlyRateCents">
            {(field) => (
              <div className="space-y-1">
                <h3 className="text-xl">Valor/hora — Tratorista</h3>
                <div className="space-y-1 border p-4">
                  <p className="text-muted-foreground text-sm">
                    Usado para calcular os ganhos estimados do tratorista por
                    serviço.
                  </p>
                  <InputGroup className="h-12">
                    <InputGroupAddon>
                      <InputGroupText>R$</InputGroupText>
                    </InputGroupAddon>
                    <InputGroupInput
                      className="text-2xl"
                      id={field.name}
                      inputMode="numeric"
                      onChange={(e) => {
                        field.handleChange(parseCentsInput(e.target.value))
                      }}
                      type="text"
                      value={field.state.value}
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupText>/ hora</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </div>
              </div>
            )}
          </form.Field>

          <section className="space-y-3">
            <h3 className="text-xl">Valor/hora — Clientes</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <form.Field name="clientAssociateHourlyRateCents">
                {(field) => (
                  <div className="space-y-2 border p-4">
                    <p className="font-semibold text-sm uppercase tracking-wide">
                      Associado
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Aplicado a clientes associados.
                    </p>
                    <InputGroup className="h-12">
                      <InputGroupAddon>
                        <InputGroupText>R$</InputGroupText>
                      </InputGroupAddon>
                      <InputGroupInput
                        className="text-2xl"
                        id={field.name}
                        inputMode="numeric"
                        onChange={(e) => {
                          field.handleChange(parseCentsInput(e.target.value))
                        }}
                        type="text"
                        value={field.state.value}
                      />
                      <InputGroupAddon align="inline-end">
                        <InputGroupText>/ hora</InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                  </div>
                )}
              </form.Field>

              <form.Field name="clientNonAssociateHourlyRateCents">
                {(field) => (
                  <div className="space-y-2 border p-4">
                    <p className="font-semibold text-sm uppercase tracking-wide">
                      Não associado
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Aplicado a clientes não associados.
                    </p>
                    <InputGroup className="h-12">
                      <InputGroupAddon>
                        <InputGroupText>R$</InputGroupText>
                      </InputGroupAddon>
                      <InputGroupInput
                        className="text-2xl"
                        id={field.name}
                        inputMode="numeric"
                        onChange={(e) => {
                          field.handleChange(parseCentsInput(e.target.value))
                        }}
                        type="text"
                        value={field.state.value}
                      />
                      <InputGroupAddon align="inline-end">
                        <InputGroupText>/ hora</InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                  </div>
                )}
              </form.Field>
            </div>
          </section>

          <Button
            className="w-full p-6 text-base"
            disabled={!canSubmit}
            type="submit"
          >
            <SaveIcon className="size-4" />
            Salvar configurações
          </Button>
        </form>
      </main>
    </div>
  )
}

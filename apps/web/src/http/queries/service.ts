import { mutationOptions, queryOptions } from '@tanstack/react-query'
import type {
  CreateServiceInput,
  ServiceWithClientAndPayments,
} from '@trator/db'
import { toast } from 'sonner'
import { queryClient } from '@/providers/query-provider'
import { api } from '../api'

export const getServicesQueryOptions = () =>
  queryOptions({
    queryKey: ['services'],
    queryFn: async () => {
      const { data } = await api.get<{ data: ServiceWithClientAndPayments[] }>(
        '/api/services'
      )

      return data.data
    },
  })

export const createServiceMutationOptions = () =>
  mutationOptions({
    mutationKey: ['createService'],
    mutationFn: async (
      input: Pick<CreateServiceInput, 'description' | 'clientId'>
    ) => {
      const { data } = await api.post<{ data: ServiceWithClientAndPayments[] }>(
        '/api/services',
        {
          description: input.description,
          clientId: input.clientId,
        }
      )

      return data.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['services'] })

      toast.success('Serviço criado com sucesso')
    },
    onError: () => {
      toast.error('Nao foi possivel criar o servico.')
    },
  })

export const finishServiceMutationOptions = () =>
  mutationOptions({
    mutationKey: ['finishService'],
    mutationFn: async ({
      serviceId,
      workedMinutes,
    }: {
      serviceId: string
      workedMinutes: number
    }) => {
      const { data } = await api.post<{ data: ServiceWithClientAndPayments }>(
        `/api/services/${serviceId}/finish`,
        {
          workedMinutes,
        }
      )

      return data.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['services'],
      })

      toast.success('Serviço atualizado com sucesso')
    },
    onError: () => {
      toast.error('Nao foi possível finalizar o serviço.')
    },
  })

export const registerPaymentMutationOptions = () =>
  mutationOptions({
    mutationKey: ['registerPayment'],
    mutationFn: async ({
      serviceId,
      amountCents,
      note,
    }: {
      serviceId: string
      amountCents: number
      note: string
    }) => {
      const { data } = await api.post<{ data: ServiceWithClientAndPayments }>(
        `/api/services/${serviceId}/payment`,
        {
          amountCents,
          note,
        }
      )

      return data.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['services'],
      })

      await queryClient.invalidateQueries({
        queryKey: ['dashboard', 'current'],
      })

      toast.success('Pagamento registrado com sucesso')
    },
    onError: () => {
      toast.error('Nao foi possivel registrar o pagamento.')
    },
  })

import { mutationOptions, queryOptions } from '@tanstack/react-query'
import type {
  CreateServiceInput,
  CreateServiceResponse,
  ServiceListItem,
  UpdateServiceInput,
  UpdateServiceResponse,
} from '@trator/db'
import { toast } from 'sonner'
import { queryClient } from '@/providers/query-provider'
import { api } from '../api'

export const getServicesQueryOptions = () =>
  queryOptions({
    queryKey: ['services'],
    queryFn: async () => {
      const { data } = await api.get<{ data: ServiceListItem[] }>(
        '/api/services'
      )

      return data.data
    },
  })

export const createServiceMutationOptions = () =>
  mutationOptions({
    mutationKey: ['createService'],
    mutationFn: async (input: Omit<CreateServiceInput, 'tractorUserId'>) => {
      const { data } = await api.post<{ data: CreateServiceResponse }>(
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
  })

export const updateServiceMutationOptions = () =>
  mutationOptions({
    mutationKey: ['updateService'],
    mutationFn: async (input: UpdateServiceInput) => {
      const { data } = await api.put<{ data: UpdateServiceResponse }>(
        `/api/services/${input.serviceId}`,
        {
          workedMinutes: input.workedMinutes,
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
  })

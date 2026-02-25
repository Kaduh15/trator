import { mutationOptions, queryOptions } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryClient } from '@/providers/query-provider'
import { api } from '../api'

export interface Service {
  client?: {
    id: string
    name: string
    phone?: string
  }
  clientId: string
  createdAt: Date
  description: string
  id: string
  status: 'open' | 'done' | 'canceled'
  updatedAt: Date | null
}

export const getServicesQueryOptions = () =>
  queryOptions({
    queryKey: ['services'],
    queryFn: async () => {
      const { data } = await api.get<{ data: Service[] }>('/api/services')

      return data.data
    },
  })

export const createServiceMutationOptions = () =>
  mutationOptions({
    mutationKey: ['createService'],
    mutationFn: async (input: { description: string; clientId: string }) => {
      const { data } = await api.post<{ data: Service }>('/api/services', {
        description: input.description,
        clientId: input.clientId,
      })

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
    mutationFn: async (input: { serviceId: string; workedMinutes: number }) => {
      const { data } = await api.put<{ data: Service }>(
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

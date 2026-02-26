import { mutationOptions, queryOptions } from '@tanstack/react-query'
import type { Client, CreateClientInput } from '@trator/db'
import { toast } from 'sonner'
import { queryClient } from '@/providers/query-provider'
import { api } from '../api'

export const getClientsQueryOptions = () =>
  queryOptions({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data } = await api.get<{ data: Client[] }>('/api/clients')

      return data.data
    },
  })

export const createClientQueryOptions = () =>
  mutationOptions({
    mutationKey: ['createClient'],
    mutationFn: async (input: CreateClientInput) => {
      const { data } = await api.post<{ data: Client }>('/api/clients', {
        name: input.name,
        phone: input.phone,
      })

      return data.data
    },
    onSuccess: async (newClient: Client) => {
      await queryClient.setQueryData(
        ['clients'],
        (oldData: Client[] | undefined) => {
          return oldData ? [newClient, ...oldData] : [newClient]
        }
      )

      toast.success('Cliente criado com sucesso')
    },
  })

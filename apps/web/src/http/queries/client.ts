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
    onError: () => {
      toast.error('Nao foi possível criar o cliente.')
    },
  })

interface UpdateClientAssociationInput {
  clientId: Client['id']
  isAssociated: boolean
}

export const updateClientAssociationMutationOptions = () =>
  mutationOptions({
    mutationKey: ['updateClientAssociation'],
    mutationFn: async (input: UpdateClientAssociationInput) => {
      const { data } = await api.put<{ data: Client }>(
        `/api/clients/${input.clientId}`,
        {
          isAssociated: input.isAssociated,
        }
      )

      return data.data
    },
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: ['clients'] })

      const previousClients = queryClient.getQueryData<Client[]>(['clients'])

      if (previousClients) {
        queryClient.setQueryData(
          ['clients'],
          previousClients.map((client) => {
            if (client.id !== input.clientId) {
              return client
            }

            return {
              ...client,
              isAssociated: input.isAssociated,
            }
          })
        )
      }

      return { previousClients }
    },
    onSuccess: async (updatedClient) => {
      await queryClient.setQueryData(
        ['clients'],
        (oldData: Client[] | undefined) => {
          if (!oldData) {
            return [updatedClient]
          }

          return oldData.map((client) => {
            if (client.id !== updatedClient.id) {
              return client
            }

            return updatedClient
          })
        }
      )

      toast.success('Cliente atualizado com sucesso')
    },
    onError: (_error, _input, context) => {
      if (context?.previousClients) {
        queryClient.setQueryData(['clients'], context.previousClients)
      }

      toast.error('Nao foi possível atualizar o cliente.')
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['clients'] })
    },
  })

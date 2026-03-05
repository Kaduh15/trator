import { mutationOptions, queryOptions } from '@tanstack/react-query'
import type { RateSettings } from '@trator/db'
import { toast } from 'sonner'
import { queryClient } from '@/providers/query-provider'
import { api } from '../api'

export const getLastRateSettingsQueryOptions = () =>
  queryOptions({
    queryKey: ['last-rate-settings'],
    queryFn: async ({ signal }) => {
      const { data } = await api.get<{ data: RateSettings }>(
        '/api/rate-settings',
        {
          signal,
        }
      )

      return data
    },
  })

export const createRateSettingsMutationOptions = () =>
  mutationOptions({
    mutationKey: ['create-rate-settings'],
    mutationFn: async (input: {
      clientAssociateHourlyRateCents: number
      clientNonAssociateHourlyRateCents: number
      tractorHourlyRateCents: number
    }) => {
      const { data } = await api.post('/api/rateSettings', {
        clientAssociateHourlyRate: input.clientAssociateHourlyRateCents,
        clientNonAssociateHourlyRate: input.clientNonAssociateHourlyRateCents,
        tractorHourlyRate: input.tractorHourlyRateCents,
      })

      return data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['last-rate-settings'] })

      toast.success('Configurações de tarifa atualizadas com sucesso!')
    },
    onError: () => {
      toast.error('Nao foi possível salvar as configurações.')
    },
  })

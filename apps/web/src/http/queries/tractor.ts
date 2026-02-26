import { queryOptions } from '@tanstack/react-query'
import type { TractorHours } from '@trator/db'
import { api } from '../api'

export const getTractorMe = () =>
  queryOptions({
    queryKey: ['tractor-me'],
    queryFn: async () => {
      const { data } = await api.get<{ data: TractorHours }>('/api/tractor/me')

      return data.data
    },
  })

import { queryOptions } from '@tanstack/react-query'
import { api } from '../api'

export interface Data {
  totalTractorCents: number
  totalWorkedMinutes: number
  weeks: Week[]
}

export interface Week {
  tractorCents: number
  weekStartDate: string
  workedMinutes: number
}

export const getTractorMe = () =>
  queryOptions({
    queryKey: ['tractor-me'],
    queryFn: async () => {
      const { data } = await api.get<{ data: Data }>('/api/tractor/me')

      return data.data
    },
  })

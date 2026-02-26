import { queryOptions } from '@tanstack/react-query'
import type { DashboardSummary } from '@trator/db'
import { api } from '../api'

export const getDashboardQueryOptions = (input?: { month?: string }) =>
  queryOptions({
    queryKey: ['dashboard', input?.month ?? 'current'],
    queryFn: async () => {
      const { data } = await api.get<{ data: DashboardSummary }>(
        '/api/dashboard',
        {
          params: input?.month ? { month: input.month } : undefined,
        }
      )
      return data.data
    },
  })

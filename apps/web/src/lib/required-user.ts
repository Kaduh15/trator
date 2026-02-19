import { cache } from 'react'

export const requiredUser = cache(async () => {
  const { authClient } = await import('./auth-client')

  const session = await authClient.getSession()

  return session?.data?.user
})

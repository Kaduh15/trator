import { cache } from 'react'

export const requiredUser = cache(async () => {
  const { authClient } = await import('./auth-client')

  const session = await authClient.getSession()

  if (!session.data) {
    throw new Error('User is not authenticated')
  }

  return session.data.user
})

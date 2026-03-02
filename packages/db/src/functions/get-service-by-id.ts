import { eq } from 'drizzle-orm'
import { db } from '..'
import { service } from '../schema'

export const getServiceByIdDB = async (serviceId: string) => {
  const [serviceResult] = await db
    .select()
    .from(service)
    .where(eq(service.id, serviceId))

  if (!serviceResult) {
    return [null, new Error('Service not found')] as const
  }

  return [serviceResult, null] as const
}

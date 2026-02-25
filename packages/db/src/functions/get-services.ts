import { desc, eq } from 'drizzle-orm'
import { db } from '..'
import { client, service } from '../schema'

export async function getServicesDB() {
  const services = await db
    .select({
      id: service.id,
      description: service.description,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
      status: service.status,
      client: {
        isAssociated: client.isAssociated,
        id: client.id,
        name: client.name,
        phone: client.phone,
      },
    })
    .from(service)
    .orderBy(desc(service.createdAt))
    .leftJoin(client, eq(service.clientId, client.id))

  if (!services) {
    return [null, new Error('Failed to fetch services')] as const
  }

  return [services, null] as const
}

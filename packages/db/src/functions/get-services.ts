import { desc, eq } from 'drizzle-orm'
import { db, selectServiceWithClientAndPaymentsSchema } from '..'
import { client, service, servicePayment } from '../schema'

export async function getServicesDB() {
  const services = await db
    .select({
      id: service.id,
      description: service.description,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
      status: service.status,
      workedMinutes: service.workedMinutes,
      totalAmountCents: service.totalClientCents,
      client: {
        isAssociated: client.isAssociated,
        id: client.id,
        name: client.name,
        phone: client.phone,
      },
      payments: {
        id: servicePayment.id,
        amountCents: servicePayment.amountCents,
        paidAt: servicePayment.paidAt,
      },
    })
    .from(service)
    .orderBy(desc(service.createdAt))
    .leftJoin(client, eq(service.clientId, client.id))
    .leftJoin(servicePayment, eq(servicePayment.serviceId, service.id))

  if (!services) {
    return [null, new Error('Failed to fetch services')] as const
  }

  const servicesParsed = selectServiceWithClientAndPaymentsSchema
    .array()
    .safeParse(services)

  if (!servicesParsed.success) {
    return [null, new Error('Failed to parse services data')] as const
  }

  return [servicesParsed.data, null] as const
}

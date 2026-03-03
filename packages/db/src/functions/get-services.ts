import { eq, sql } from 'drizzle-orm'
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
      tractorUserId: service.tractorUserId,
      clientHourlyRateCents: service.clientHourlyRateCents,
      tractorHourlyRateCents: service.tractorHourlyRateCents,
      totalClientCents: service.totalClientCents,
      totalTractorCents: service.totalTractorCents,
      finishedAt: service.finishedAt,

      client: sql`
      json_build_object(
        'id', ${client.id},
        'name', ${client.name},
        'phone', ${client.phone},
        'isAssociated', ${client.isAssociated}
      )
    `.as('client'),

      payments: sql`
      coalesce(
        json_agg(
          json_build_object(
            'id', ${servicePayment.id},
            'amountCents', ${servicePayment.amountCents},
            'paidAt', ${servicePayment.paidAt},
            'note', ${servicePayment.note},
            'createdByUserId', ${servicePayment.createdByUserId},
            'method', ${servicePayment.method}
          )
        ) filter (where ${servicePayment.id} is not null),
        '[]'
      )
    `.as('payments'),
    })
    .from(service)
    .leftJoin(client, eq(service.clientId, client.id))
    .leftJoin(servicePayment, eq(service.id, servicePayment.serviceId))
    .groupBy(service.id, client.id)

  if (!services) {
    return [null, new Error('Failed to fetch services')] as const
  }

  const servicesParsed = selectServiceWithClientAndPaymentsSchema
    .array()
    .safeParse(services)

  if (servicesParsed.error) {
    return [null, new Error('Failed to parse services data')] as const
  }

  return [servicesParsed.data, null] as const
}

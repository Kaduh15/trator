import { desc, eq } from 'drizzle-orm'
import { db } from '..'
import { client, service, servicePayment } from '../schema'

interface ServicePayment {
  amountCents: number
  id: string
  paidAt: Date | null
}

interface ServiceWithPayments {
  client: {
    isAssociated: boolean
    id: string
    name: string
    phone: string | null
  } | null
  createdAt: Date
  description: string
  id: string
  payments: ServicePayment[]
  status: 'open' | 'done' | 'canceled'
  totalAmountCents: number
  updatedAt: Date | null
  workedMinutes: number
}

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

  const servicesMap = new Map<string, ServiceWithPayments>()

  for (const row of services) {
    const existing = servicesMap.get(row.id)
    const normalizedClient = row.client?.id
      ? {
          isAssociated: row.client.isAssociated,
          id: row.client.id,
          name: row.client.name,
          phone: row.client.phone,
        }
      : null

    const base = existing ?? {
      id: row.id,
      description: row.description,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      status: row.status,
      workedMinutes: row.workedMinutes,
      totalAmountCents: row.totalAmountCents ?? 0,
      client: normalizedClient,
      payments: [] as ServicePayment[],
    }

    if (row.payments?.id) {
      base.payments.push({
        id: row.payments.id,
        amountCents: row.payments.amountCents,
        paidAt: row.payments.paidAt,
      })
    }

    servicesMap.set(row.id, base)
  }

  return [Array.from(servicesMap.values()), null] as const
}

import { db } from './index'
import { user } from './schema/auth'
import { client } from './schema/clients'
import { rateSetting } from './schema/rate-setting'
import { service } from './schema/service'

const managerUserId = 'user_manager_01'
const tractorUserId = 'user_tractorist_01'

const users = [
  {
    id: managerUserId,
    name: 'Gerente',
    email: 'gerente@trator.dev',
    emailVerified: true,
    username: 'gerente',
    displayUsername: 'Gerente',
    role: 'manager',
  },
  {
    id: tractorUserId,
    name: 'Tratorista',
    email: 'tratorista@trator.dev',
    emailVerified: true,
    username: 'tratorista',
    displayUsername: 'Tratorista',
    role: 'tractorist',
  },
]

const clients = [
  {
    name: 'Fazenda Boa Vista',
    isAssociated: true,
  },
  {
    name: 'Agro Horizonte',
    isAssociated: false,
  },
  {
    name: 'Santo Campo',
    isAssociated: true,
  },
]

const rateSettings = [
  {
    clientAssociateHourlyRate: 20_000,
    clientNonAssociateHourlyRate: 22_000,
    tractorHourlyRate: 2800,
    createdByUserId: managerUserId,
  },
]

async function seed() {
  await db.transaction(async (tx) => {
    await tx.insert(user).values(users).onConflictDoNothing()
    await tx.insert(rateSetting).values(rateSettings).onConflictDoNothing()

    const insertedClients = await tx.insert(client).values(clients).returning({
      id: client.id,
      isAssociated: client.isAssociated,
    })

    const firstClient = insertedClients[0]

    if (!firstClient) {
      throw new Error('Seed: nenhum cliente foi inserido.')
    }

    const associateClient = insertedClients.find((entry) => entry.isAssociated)
    const nonAssociateClient = insertedClients.find(
      (entry) => !entry.isAssociated
    )

    const fallbackClientId = firstClient.id

    const services = [
      {
        clientId: associateClient?.id ?? fallbackClientId,
        tractorUserId,
        description: 'Preparo de solo para plantio',
        status: 'open' as const,
        workedMinutes: 180,
        clientHourlyRateCents: 20_000,
        tractorHourlyRateCents: 2800,
        totalClientCents: 60_000,
        totalTractorCents: 8400,
      },
      {
        clientId: nonAssociateClient?.id ?? fallbackClientId,
        tractorUserId,
        description: 'Aplicacao de fertilizante',
        status: 'done' as const,
        workedMinutes: 240,
        clientHourlyRateCents: 22_000,
        tractorHourlyRateCents: 2800,
        totalClientCents: 88_000,
        totalTractorCents: 11_200,
      },
    ]

    await tx.insert(service).values(services).onConflictDoNothing()
  })
}

seed()
  .then(() => {
    console.log('Seed concluido com sucesso.')
  })
  .catch((error: unknown) => {
    console.error('Erro ao executar seed:', error)
    process.exitCode = 1
  })

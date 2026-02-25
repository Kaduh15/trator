import { and, asc, eq, gte, sql, sum } from 'drizzle-orm'
import { db } from '..'
import { service } from '../schema'

export async function getHoursDB() {
  try {
    const weekStartDate = sql<string>`to_char(date_trunc('week', ${service.finishedAt}), 'YYYY-MM-DD')`

    const services = await db
      .select({
        weekStartDate,
        workedMinutes: sum(service.workedMinutes),
        tractorCents: sum(service.totalTractorCents),
      })
      .from(service)
      .where(
        and(
          eq(service.status, 'done'),
          gte(
            service.finishedAt,
            new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          )
        )
      )
      .groupBy(weekStartDate)
      .orderBy(asc(weekStartDate))

    const weeks = services.map((row) => ({
      weekStartDate: row.weekStartDate,
      workedMinutes: Number(row.workedMinutes ?? 0),
      tractorCents: Number(row.tractorCents ?? 0),
    }))

    const totalWorkedMinutes = weeks.reduce(
      (total, week) => total + week.workedMinutes,
      0
    )
    const totalTractorCents = weeks.reduce(
      (total, week) => total + week.tractorCents,
      0
    )

    return [
      {
        totalWorkedMinutes,
        totalTractorCents,
        weeks,
      },
      null,
    ] as const
  } catch (error) {
    return [
      null,
      error instanceof Error ? error : new Error('Failed to fetch hours'),
    ] as const
  }
}

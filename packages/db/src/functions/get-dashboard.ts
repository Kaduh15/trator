import { and, eq, gte, lt, sum } from 'drizzle-orm'
import { db } from '..'
import { service, servicePayment } from '../schema'

const formatMonthLabel = (date: Date) => {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${date.getFullYear()}-${month}`
}

const getMonthRange = (date: Date) => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1)
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 1)
  return { start, end }
}

const parseMonthLabel = (monthLabel: string) => {
  const [yearLabel, monthLabelValue] = monthLabel.split('-')
  const year = Number(yearLabel)
  const month = Number(monthLabelValue)

  const isValidYear = Number.isInteger(year)
  const isValidMonth = Number.isInteger(month)

  if (!(isValidYear && isValidMonth)) {
    return null
  }

  if (month < 1 || month > 12) {
    return null
  }

  return {
    year,
    monthIndex: month - 1,
  }
}

export async function getDashboardDB(options?: { month?: string }) {
  try {
    const now = new Date()
    const parsedMonth = options?.month ? parseMonthLabel(options.month) : null

    if (options?.month && !parsedMonth) {
      return [null, new Error('Invalid month format')] as const
    }

    const monthDate = parsedMonth
      ? new Date(parsedMonth.year, parsedMonth.monthIndex, 1)
      : now
    const monthLabel = options?.month ?? formatMonthLabel(monthDate)
    const { start, end } = getMonthRange(monthDate)

    const [serviceTotals] = await db
      .select({
        totalGeneratedCents: sum(service.totalClientCents),
        totalExpensesCents: sum(service.totalTractorCents),
      })
      .from(service)
      .where(
        and(
          eq(service.status, 'done'),
          gte(service.finishedAt, start),
          lt(service.finishedAt, end)
        )
      )

    const [paymentTotals] = await db
      .select({
        receivedCents: sum(servicePayment.amountCents),
      })
      .from(servicePayment)
      .where(
        and(gte(servicePayment.paidAt, start), lt(servicePayment.paidAt, end))
      )

    const totalGeneratedCents = Number(serviceTotals?.totalGeneratedCents ?? 0)
    const totalExpensesCents = Number(serviceTotals?.totalExpensesCents ?? 0)
    const receivedCents = Number(paymentTotals?.receivedCents ?? 0)

    return [
      {
        month: monthLabel,
        currency: 'BRL',
        summary: {
          totalGeneratedCents,
          receivedCents,
          totalExpensesCents,
          finalBalanceCents: receivedCents - totalExpensesCents,
        },
      },
      null,
    ] as const
  } catch (error) {
    return [
      null,
      error instanceof Error
        ? error
        : new Error('Failed to fetch dashboard summary'),
    ] as const
  }
}

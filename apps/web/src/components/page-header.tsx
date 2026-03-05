import type { ReactNode } from 'react'
import { ButtonLogout } from '@/components/button-logout'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  actions?: ReactNode | null
  className?: string
  eyebrow?: string
  leading?: ReactNode
  subtitle?: string
  title: string
  withBackground?: boolean
}

export function PageHeader({
  title,
  eyebrow,
  subtitle,
  leading,
  actions,
  withBackground = false,
  className,
}: PageHeaderProps) {
  const resolvedActions = actions === undefined ? <ButtonLogout /> : actions

  return (
    <header
      className={cn(
        'flex items-center justify-between border-b px-4 py-3',
        withBackground && 'bg-background',
        className
      )}
    >
      <div className="flex items-center gap-2">
        {leading ? <div className="shrink-0">{leading}</div> : null}
        <div>
          {eyebrow ? (
            <p className="text-muted-foreground text-xs uppercase tracking-wide">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="font-semibold text-lg">{title}</h1>
          {subtitle ? (
            <p className="text-muted-foreground text-sm">{subtitle}</p>
          ) : null}
        </div>
      </div>
      {resolvedActions}
    </header>
  )
}

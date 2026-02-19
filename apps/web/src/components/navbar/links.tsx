import { Link, type LinkProps } from '@tanstack/react-router'
import { cn } from '@/lib/utils'

export function Links({
  children,
  className,
  activeProps,
  ...props
}: { children: React.ReactNode; className?: string } & LinkProps) {
  return (
    <Link
      activeProps={{
        className: cn('bg-primary text-primary-foreground', activeProps),
      }}
      className={cn(
        'flex flex-1 flex-col items-center justify-center px-3 py-2 font-medium text-sm transition-colors hover:bg-muted',
        className
      )}
      {...props}
    >
      {children}
    </Link>
  )
}

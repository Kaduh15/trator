import { Link } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'
import type { PropsWithChildren } from 'react'
import { cn } from '@/lib/utils'

type NavbarProps = {
  links: {
    to: string
    label: string
    icon: LucideIcon
  }[]
} & PropsWithChildren &
  React.HTMLAttributes<HTMLElement>

export function Navbar({ links, className, ...props }: NavbarProps) {
  return (
    <nav className={cn('fixed bottom-0 bg-background', className)} {...props}>
      <ul className="flex w-screen">
        {links.map((link) => (
          <li className="flex-1" key={link.to}>
            <Link
              activeProps={{
                className: cn('bg-primary text-primary-foreground'),
              }}
              className={cn(
                'flex flex-col items-center justify-center px-3 py-2 font-medium text-sm transition-colors hover:bg-muted',
                className
              )}
              to={link.to}
            >
              <link.icon className="size-5" />
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

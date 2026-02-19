import type { PropsWithChildren } from 'react'
import { cn } from '@/lib/utils'

type NavbarProps = {} & PropsWithChildren & React.HTMLAttributes<HTMLElement>

export function Navbar({ children, className, ...props }: NavbarProps) {
  return (
    <nav
      className={cn(
        'fixed bottom-0 flex w-full items-center justify-around',
        className
      )}
      {...props}
    >
      {children}
    </nav>
  )
}

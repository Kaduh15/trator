import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { ClipboardIcon, ClockIcon } from 'lucide-react'
import { Links, Navbar } from '@/components/navbar'

export const Route = createFileRoute('/(private)/trator/(with-navbar)')({
  component: RouteComponent,
  beforeLoad: async () => {
    const { requiredUser } = await import('@/lib/required-user')
    try {
      const user = await requiredUser()

      if (user?.role !== 'user') {
        throw redirect({
          to: '/dashboard',
        })
      }
    } catch {
      throw redirect({
        to: '/login',
      })
    }
  },
})

function RouteComponent() {
  return (
    <div className="min-h-screen">
      <Outlet />
      <Navbar className="fixed bottom-0 w-full">
        <Links
          to="/trator/horas"
        >
          <ClockIcon className="size-4" />
          Horas
        </Links>
        <Links
          to="/trator/servicos"
        >
          <ClipboardIcon className="size-4" />
          Serviços
        </Links>
      </Navbar>
    </div>
  )
}

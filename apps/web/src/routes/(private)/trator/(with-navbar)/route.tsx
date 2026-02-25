import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { ClipboardIcon, ClockIcon } from 'lucide-react'
import { Navbar } from '@/components/navbar'

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
    <>
      <Outlet />
      <Navbar
        links={[
          {
            to: '/trator/horas',
            label: 'Horas',
            icon: ClockIcon,
          },
          {
            to: '/trator/servicos',
            label: 'Serviços',
            icon: ClipboardIcon,
          },
        ]}
      />
    </>
  )
}

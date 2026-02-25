import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { ClockIcon } from 'lucide-react'
import { Navbar } from '@/components/navbar'

export const Route = createFileRoute('/(private)/(admin)')({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    const user = context.user

    if (user?.role !== 'admin') {
      throw redirect({
        to: '/trator/horas',
      })
    }
  },
})

function RouteComponent() {
  return (
    <div className="min-h-screen">
      <Outlet />
      <Navbar
        className="fixed bottom-0 w-full"
        links={[
          {
            to: '/trator/horas',
            label: 'Horas',
            icon: ClockIcon,
          },
          {
            to: '/trator/servicos',
            label: 'Serviços',
            icon: ClockIcon,
          },
        ]}
      />
    </div>
  )
}

import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { EllipsisIcon, FileTextIcon, LayoutDashboardIcon, WrenchIcon } from 'lucide-react'
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
        links={[
          {
            to: '/dashboard',
            label: 'Dashboard',
            icon: LayoutDashboardIcon,
          },
          {
            to: '/servicos',
            label: 'Serviços',
            icon: FileTextIcon,
          },
          {
            to: '/despesas',
            label: 'Despesas',
            icon: WrenchIcon,
          },
          {
            to: '/mais',
            label: 'Mais',
            icon: EllipsisIcon,
          }
        ]}
      />
    </div>
  )
}

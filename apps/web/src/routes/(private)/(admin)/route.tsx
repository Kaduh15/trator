import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { Links, Navbar } from '@/components/navbar'

export const Route = createFileRoute('/(private)/(admin)')({
  component: RouteComponent,
  beforeLoad: async () => {
    const { requiredUser } = await import('@/lib/required-user')

    const user = await requiredUser()

    if (user.role !== 'admin') {
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
      <Navbar className="fixed bottom-0 w-full">
        <Links
          className="flex flex-col items-center justify-center gap-2"
          to="/trator/horas"
        >
          Horas
        </Links>
        <Links
          className="flex flex-col items-center justify-center gap-2"
          to="/trator/servicos"
        >
          Serviços
        </Links>
      </Navbar>
    </div>
  )
}

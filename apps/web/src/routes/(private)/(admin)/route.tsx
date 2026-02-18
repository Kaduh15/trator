import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

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
  return <Outlet />
}

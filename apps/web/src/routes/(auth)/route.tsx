import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { requiredUser } from '@/lib/required-user'

export const Route = createFileRoute('/(auth)')({
  component: RouteComponent,
  beforeLoad: async () => {
    const user = await requiredUser()
    if (user) {
      throw redirect({
        to: user.role === 'admin' ? '/dashboard' : '/trator/horas',
      })
    }
  },
})

function RouteComponent() {
  return <Outlet />
}

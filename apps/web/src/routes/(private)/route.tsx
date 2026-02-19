import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { requiredUser } from '@/lib/required-user'

export const Route = createFileRoute('/(private)')({
  component: RouteComponent,
  beforeLoad: async () => {
    const user = await requiredUser()
    if (!user) {
      throw redirect({
        to: '/login',
      })
    }
  },
})

function RouteComponent() {
  return <Outlet />
}

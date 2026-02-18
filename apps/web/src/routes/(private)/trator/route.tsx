import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/(private)/trator')({
  component: RouteComponent,
  beforeLoad: async () => {
    const { requiredUser } = await import('@/lib/required-user')
    try {
      const user = await requiredUser()

      if (user.role !== 'user') {
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
  return <Outlet />
}

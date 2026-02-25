import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/(private)/trator')({
  component: RouteComponent,
  beforeLoad(ctx) {
    if (ctx.context.user.role === 'admin') {
      throw redirect({
        to: '/dashboard',
      })
    }
  },
})

function RouteComponent() {
  return <Outlet />
}

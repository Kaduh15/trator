import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(private)/clientes')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(private)/clientes"!</div>
}

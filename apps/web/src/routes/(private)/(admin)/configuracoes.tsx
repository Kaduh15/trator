import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(private)/(admin)/configuracoes')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(private)/(admin)/configuracoes"!</div>
}

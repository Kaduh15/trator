import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(private)/(admin)/despesas')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(private)/(admin)/despesas"!</div>
}

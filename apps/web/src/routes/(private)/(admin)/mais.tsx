import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(private)/(admin)/mais')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(private)/(admin)/mais"!</div>
}

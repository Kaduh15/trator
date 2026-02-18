import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(private)/(admin)/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(private)/(admin)/dashboard"!</div>
}

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/posyandu/gizi')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/posyandu/gizi"!</div>
}

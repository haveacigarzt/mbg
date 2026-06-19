import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sppg/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/sppg/"!</div>
}

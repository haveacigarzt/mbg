import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sekolah/gizi')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/sekolah/gizi"!</div>
}

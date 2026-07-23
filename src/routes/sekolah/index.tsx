import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/sekolah/')({
  component: RouteComponent
});

function RouteComponent() {
  return <div>Hello "/sekolah/"!</div>;
}

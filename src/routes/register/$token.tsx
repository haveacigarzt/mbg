import Register from '@/components/homepage/Register';
import Loading from '@/components/Loading';
import NotFound from '@/components/NotFound';
import { getSPPGInvitationQueryOptions } from '@/queryOptions/sppg_invitations';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/register/$token')({
  component: RouteComponent
  // beforeload: const { data: invitation, isFetching: isFetchingInvitation } = useQuery(getSPPGInvitationQueryOptions(token));
  // if notfound, tampilkan halaman notfound
});

function RouteComponent() {
  const { token } = Route.useParams();

  const { data: invitation, isFetching } = useQuery(getSPPGInvitationQueryOptions(token));

  console.log(invitation);

  if (isFetching) return <Loading />;

  if (!invitation) {
    return <NotFound />;
  }

  return <Register invitation={invitation} />;
}

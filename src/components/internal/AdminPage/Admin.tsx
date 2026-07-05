import Navbar from '../Navbar';
import { Building2, Download, Landmark, MailQuestionMark, Plus, Search, Send, SquarePen, UserRoundX, Users, UsersRound } from 'lucide-react';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { Button } from '@/components/ui/button';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAkunQueryOptions, getUsersSummaryQueryOptions } from '@/queryOptions/akun';
import AdminTable from './AdminTable';
import { useState } from 'react';
import type { SortingState } from '@tanstack/react-table';
import DialogTambahUser from './DialogTambahUser';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Field } from '@/components/ui/field';
import { createSPPGInvitationsMutationOptions, getSPPGInvitationsQueryOptions } from '@/queryOptions/sppg_invitations';
import { toast } from 'sonner';
import { errorToast, successToast } from '@/lib/constants';
import { ApiError } from '@/api/client';
import { Spinner } from '@/components/ui/spinner';
import { formatTanggalIndonesia } from '@/lib/utils';
import InvitationsTable from './InvitationsTable';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Admin = () => {
  const [searchAkun] = useState('');
  const [page, setPage] = useState(1);
  const page_size = 10;
  const [sorting] = useState<SortingState>([]);
  const sort = sorting[0] ? `${sorting[0].desc ? '-' : ''}${sorting[0].id}` : '';
  const { data: akun, isFetching } = useQuery(
    getAkunQueryOptions({
      page,
      page_size,
      name: searchAkun,
      sort
    })
  );
  // console.log(akun);
  const { data: summary, isFetching: isFetchingSummary } = useQuery(getUsersSummaryQueryOptions());
  const [page_invitations, setPageInvitations] = useState(1);
  const page_size_invitations = 10;
  const [sorting_invitations] = useState<SortingState>([]);
  const sort_invitations = sorting_invitations[0] ? `${sorting_invitations[0].desc ? '-' : ''}${sorting_invitations[0].id}` : '';
  const { data: invitations, isFetching: isFetchingInvitations } = useQuery(getSPPGInvitationsQueryOptions({ page: page_invitations, page_size: page_size_invitations }));
  // console.log(invitations);
  const [isUndangan, setIsUndangan] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [namaSPPGBefore, setNamaSPPGBefore] = useState('');
  const [namaSPPG, setNamaSPPG] = useState('');
  const [namaSPPGDisplay, setNamaSPPGDisplay] = useState('');
  const [token, setToken] = useState('');
  const [validThru, setValidThru] = useState('');
  const [isOpenUndangan, setIsOpenUndangan] = useState(false);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    ...createSPPGInvitationsMutationOptions(),
    onSuccess: (data) => {
      console.log(data);
      toast.success('Berhasil membuat undangan user.', {
        style: successToast as React.CSSProperties
      });
      setNamaSPPGBefore(namaSPPG);
      setToken(data.invitation.token);
      setValidThru(formatTanggalIndonesia(data.invitation.expires_at.Time));
      generateUndangan();
      // refetchAlokasi();
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
    }
  });
  const handleCreateInvitation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (namaSPPG !== namaSPPGBefore) {
      console.log('mengirim', namaSPPG);
      setIsLoading(true);
      try {
        await mutation.mutateAsync({ input: { nama_sppg: namaSPPG } });
      } catch (err) {
        let message = 'Gagal menambahkan user.';
        if (err instanceof ApiError) {
          const errors = err.data?.error;
          if (errors?.email) {
            message = `Gagal: ${errors.email}`;
          }
          if (errors?.password) {
            message = `Gagal: ${errors.password}`;
          }
        }
        toast.error(message, {
          style: errorToast as React.CSSProperties
        });
      } finally {
        setIsLoading(false);
      }
    }
  };
  const generateUndangan = () => {
    setIsUndangan(true);
    setNamaSPPGDisplay(namaSPPG);
  };
  const copyToClipboard = async (text: string) => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';

    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    document.execCommand('copy');

    document.body.removeChild(textarea);
  };

  const linkPendaftaran = `https://192.168.1.10:5173/register/${token}`;
  const pesan = `🏢 *UNDANGAN PENGELOLA SPPG - MBG*

        Halo,

        Anda diundang untuk bergabung sebagai *Pengelola ${namaSPPG || '...'}* pada Sistem MBG.

        📝 *Daftar melalui:*
        *${linkPendaftaran}*

        Tautan undangan ini berlaku hingga ${validThru}.

        ⏳ Setelah mendaftar, akun Anda akan menunggu persetujuan dari administrator sebelum dapat digunakan.

        Terima kasih.

        *Tim MBG*`;
  const plain = `
  🏢 UNDANGAN PENGELOLA SPPG - MBG

      Halo,

      Anda diundang untuk bergabung sebagai Pengelola SPPG ${namaSPPG || '...'} pada Sistem MBG.

      📝 Daftar melalui:
      ${linkPendaftaran}

      Tautan undangan ini berlaku hingga ${validThru}.

      ⏳ Setelah mendaftar, akun Anda akan menunggu persetujuan dari administrator sebelum dapat digunakan.

      Terima kasih.

      Tim MBG  
    `;
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navbar role_id={1} />

      <div className="ml-[15%] flex-1 p-6 flex flex-col gap-4">
        {/* Header */}
        <div>
          <h1 className="text-xl font-black text-gray-800">Kelola Akun User</h1>
          <p className="text-xs text-gray-400 tracking-widest mt-1">Kelola dan monitor semua akun SPPG dan Stakeholder</p>
        </div>

        {/* Info Card SPPG */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 rounded-full p-3">
                <UsersRound className="w-8 h-8 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-800">Total User</p>
                <div className="text-xl font-bold flex items-center gap-1 mt-0.5">{isFetchingSummary ? 'Memuat' : summary?.total}</div>
                <p className="text-sm text-gray-800">Semua akun terdaftar</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-center gap-3">
              <div className="flex-1 ">
                <div className="bg-green-50 rounded-full p-3">
                  <Building2 className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <div className="flex-6">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <p className="text-sm text-gray-800">User SPPG</p>
                    <div className="text-xl font-bold flex items-center gap-1 mt-0.5">{isFetchingSummary ? 'Memuat' : summary?.sppg}</div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300
                             text-white text-sm font-semibold p-3 rounded-xl transition-colors"
                      >
                        <Plus />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[100]">
                      <Dialog>
                        <DialogTrigger>
                          <Button variant="ghost">
                            <Send />
                            Kirim Invitasi
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg">
                          <DialogHeader>
                            <DialogTitle className="text-base">Invite User SPPG</DialogTitle>
                            <DialogDescription>Kirim pesan berikut kepada calon pengelola SPPG untuk melakukan pendaftaran.</DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleCreateInvitation} className="flex flex-col gap-4">
                            <div className="flex gap-2 items-end">
                              <Field className="gap-2 flex-5">
                                <Label htmlFor="nama">Nama SPPG</Label>
                                <Input id="nama" name="nama" required value={namaSPPG} onChange={(e) => setNamaSPPG(e.target.value)} />
                              </Field>
                              <div className="flex-2">
                                <Button
                                  className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 disabled:bg-blue-50 text-blue-700 disabled:text-blue-300 text-sm font-semibold p-3 rounded-xl transition-colors"
                                  type="submit"
                                >
                                  {isLoading ? <Spinner /> : 'Buat Undangan'}
                                </Button>
                              </div>
                            </div>
                          </form>
                          {isUndangan && (
                            <>
                              <div className="rounded-xl border bg-muted/40 p-4 text-sm whitespace-pre-wrap">
                                <div className="space-y-4 text-sm">
                                  <h3 className="font-semibold text-base">🏢 UNDANGAN PENGELOLA SPPG - MBG</h3>
                                  <p>Halo,</p>
                                  <p>
                                    Anda diundang untuk bergabung sebagai <strong>Pengelola {namaSPPGDisplay || '...'}</strong> pada Sistem MBG.
                                  </p>
                                  <p className="mb-0">📝 Daftar melalui:</p>
                                  <p>
                                    <a href={linkPendaftaran} className="font-semibold underline text-blue-600">
                                      {linkPendaftaran}
                                    </a>
                                  </p>
                                  <p>Tautan undangan ini berlaku hingga {validThru}.</p>
                                  <p>⏳ Setelah mendaftar, akun Anda akan menunggu persetujuan dari administrator sebelum dapat digunakan.</p>
                                  <p className="font-medium">Tim MBG</p>
                                </div>
                              </div>
                              <DialogFooter className="flex justify-between">
                                <Button
                                  className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 disabled:bg-blue-50 text-blue-700 disabled:text-blue-300 text-sm font-semibold p-3 rounded-xl transition-colors"
                                  onClick={async () => {
                                    await copyToClipboard(plain);

                                    toast.success('Undangan berhasil disalin');
                                  }}
                                >
                                  Salin Undangan
                                </Button>
                                <Button
                                  onClick={() => {
                                    window.open(`https://wa.me?text=${encodeURIComponent(pesan)}`, '_blank');
                                  }}
                                  className=" bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-semibold rounded-xl transition-colors px-3"
                                >
                                  Kirim via WhatsApp
                                </Button>
                              </DialogFooter>
                            </>
                          )}
                        </DialogContent>
                      </Dialog>
                      <DropdownMenuSeparator />
                      <DialogTambahUser role_id={3}>
                        <Button variant="ghost">
                          <SquarePen />
                          Buat Sendiri
                        </Button>
                      </DialogTambahUser>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="text-sm text-gray-800">Akun SPPG aktif</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-center gap-3">
              <div className="flex-1 ">
                <div className="bg-purple-50 rounded-full p-3">
                  <Landmark className="w-8 h-8 text-purple-500" />
                </div>
              </div>
              <div className="flex-6">
                <div className="flex justify-between">
                  <div className="flex flex-col">
                    <p className="text-sm text-gray-800">Stakeholder</p>
                    <div className="text-xl font-bold flex items-center gap-1 mt-0.5">{isFetchingSummary ? 'Memuat' : summary?.stakeholder}</div>
                  </div>
                  <DialogTambahUser role_id={2}>
                    <Button
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300
                             text-white text-sm font-semibold p-3 rounded-xl transition-colors"
                    >
                      <Plus />
                    </Button>
                  </DialogTambahUser>
                </div>
                <p className="text-sm text-gray-800">Akun Stakeholder aktif</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-center gap-3">
              <div className="bg-red-50 rounded-full p-3">
                <UserRoundX className="w-8 h-8 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-gray-800">Akun Nonakitf</p>
                <div className="text-xl font-bold flex items-center gap-1 mt-0.5">{isFetchingSummary ? 'Memuat' : summary?.nonaktif}</div>
                <p className="text-sm text-gray-800">Akun tidak aktif</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex justify-between items-center">
            <div>Daftar {isOpenUndangan ? 'invitasi' : 'akun'} user</div>
            <Tabs value={isOpenUndangan ? 'invitasi' : 'akun'} onValueChange={(value) => setIsOpenUndangan(value === 'invitasi')}>
              <TabsList className="gap-3 px-1 shadow-sm">
                <TabsTrigger value="akun" className="px-3">
                  <Users /> Akun User
                </TabsTrigger>
                <TabsTrigger value="invitasi" className="px-3">
                  <MailQuestionMark /> Status Invitasi
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="flex justify-between">
            {!isOpenUndangan ? (
              <>
                <div className="flex gap-3 items-center">
                  <InputGroup className="w-67.5">
                    <InputGroupInput placeholder="Cari email, atau instansi..." />
                    <InputGroupAddon>
                      <Search />
                    </InputGroupAddon>
                  </InputGroup>
                  <NativeSelect>
                    <NativeSelectOption value="">Semua Jenis User</NativeSelectOption>
                    <NativeSelectOption value="sppg">SPPG</NativeSelectOption>
                    <NativeSelectOption value="stakeholder">Stakeholder</NativeSelectOption>
                  </NativeSelect>
                  <NativeSelect>
                    <NativeSelectOption value="">Status Akun</NativeSelectOption>
                    <NativeSelectOption value="aktif">Aktif</NativeSelectOption>
                    <NativeSelectOption value="nonaktif">Nonaktif</NativeSelectOption>
                  </NativeSelect>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 bg-white-600 hover:bg-white-700 disabled:bg-white-300
                             text-black text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
                  >
                    <Download /> Export
                  </Button>
                </div>
              </>
            ) : (
              <>
                <InputGroup className="w-67.5">
                  <InputGroupInput placeholder="Cari nama SPPG..." />
                  <InputGroupAddon>
                    <Search />
                  </InputGroupAddon>
                </InputGroup>
              </>
            )}
          </div>
          {!isOpenUndangan ? (
            isFetching ? (
              <p>Memuat...</p>
            ) : (
              <AdminTable data={akun} page={page} setPage={setPage} />
            )
          ) : isFetchingInvitations ? (
            <p>Memuat...</p>
          ) : (
            <InvitationsTable data={invitations} page={page_invitations} setPage={setPageInvitations} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;

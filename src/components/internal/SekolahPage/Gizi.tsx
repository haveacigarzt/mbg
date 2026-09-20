import type { AuthResponse } from '@/types/auth';
import Navbar from '../Navbar';
interface Props {
  user: AuthResponse;
}

const Gizi = ({ user }: Props) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navbar role_id={6} />

      <div className="ml-[15%] flex-1 p-6 flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-black text-gray-800">Halaman Gizi Penerima Terpantau</h1>
          <p className="text-xs text-gray-400 tracking-widest mt-1">MANAJEMEN DATA SEKOLAH PENERIMA MANFAAT</p>
        </div>
      </div>
    </div>
  );
};

export default Gizi;

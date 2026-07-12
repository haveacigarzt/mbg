'use client';

import { useState } from 'react';
import { Users, Heart, Briefcase, Wheat } from 'lucide-react';
import Penerima from './Penerima';

const tabs = [
  { id: 'penerima', icon: <Users className="w-5 h-5 md:w-7 md:h-7" />, label: 'PENERIMA MANFAAT', color: 'text-blue-500' },
  { id: 'stunting', icon: <Heart className="w-5 h-5 md:w-7 md:h-7" />, label: 'POTENSI STUNTING', color: 'text-red-400' },
  { id: 'pekerjaan', icon: <Briefcase className="w-5 h-5 md:w-7 md:h-7" />, label: 'LAPANGAN PEKERJAAN', color: 'text-green-500' },
  { id: 'pangan', icon: <Wheat className="w-5 h-5 md:w-7 md:h-7" />, label: 'SERAPAN PANGAN LOKAL', color: 'text-orange-400' }
];

export default function KatalogTabs() {
  const [activeTab, setActiveTab] = useState('penerima');

  return (
    <section className="px-4 sm:px-8 md:px-16 lg:px-32 pb-8">
      {/* Tab buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-2xl p-3 md:p-6 flex flex-col items-center gap-2 md:gap-3 cursor-pointer transition-all
              ${activeTab === tab.id ? 'border-2 border-blue-500 bg-white shadow-md' : 'border border-gray-100 bg-white hover:border-blue-200 hover:shadow-sm'}`}
          >
            <span className={tab.color}>{tab.icon}</span>
            <p className="text-[10px] md:text-xs font-bold text-gray-600 tracking-widest text-center">{tab.label}</p>
          </button>
        ))}
      </div>

      {/* Konten berdasarkan tab aktif */}
      <div>
        {activeTab === 'penerima' && <Penerima />}
        {activeTab === 'stunting' && <p className="text-gray-400 text-sm">Konten Potensi Stunting — coming soon</p>}
        {activeTab === 'pekerjaan' && <p className="text-gray-400 text-sm">Konten Lapangan Pekerjaan — coming soon</p>}
        {activeTab === 'pangan' && <p className="text-gray-400 text-sm">Konten Serapan Pangan Lokal — coming soon</p>}
      </div>
    </section>
  );
}

'use client';

import { GraduationCap, Briefcase, UserX, Clock, Baby } from 'lucide-react';
const allTabs = [
  { id: '3B', icon: Baby, label: '3B', color: 'text-pink-500' },
  { id: 'Ps.D', icon: GraduationCap, label: 'PS. D.', color: 'text-blue-500' },
  { id: 'Guru', icon: Briefcase, label: 'GURU', color: 'text-green-500' },
  { id: 'ATS', icon: UserX, label: 'ATS', color: 'text-orange-500' },
  { id: 'APS', icon: Clock, label: 'APS', color: 'text-gray-500' }
];

export default function SubTab({ onSelect, selected }: { onSelect: (id: string) => void; selected: string }) {
  return (
    <div className="bg-white rounded-2xl p-3 md:p-4 border border-gray-100">
      {/* Digeser horizontal (scroll-x) di layar kecil biar 5 tab nggak numpuk/kegencet */}
      <div className="flex gap-2 md:gap-3 overflow-x-auto pb-1 sm:pb-0 sm:overflow-visible -mx-1 px-1 sm:mx-0 sm:px-0">
        {allTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onSelect(tab.id)}
              className={`flex flex-col items-center gap-1.5 md:gap-2 px-4 md:px-6 py-3 md:py-4 rounded-xl transition-all shrink-0 w-20 sm:w-auto sm:flex-1
                ${selected === tab.id ? 'border-2 border-pink-400 bg-pink-50' : 'border border-gray-100 hover:border-gray-200'}`}
            >
              <Icon className={`w-4 h-4 md:w-5 md:h-5 ${selected === tab.id ? 'text-pink-500' : tab.color}`} />
              <p className="text-[10px] md:text-xs font-bold text-gray-500 tracking-widest">{tab.label}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

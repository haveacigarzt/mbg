"use client";

import { GraduationCap, Briefcase, UserX, Clock, Baby } from "lucide-react";
const allTabs = [
  { id: "3B", icon: Baby, label: "3B", color: "text-pink-500" },
  { id: "Ps.D", icon: GraduationCap, label: "PS. D.", color: "text-blue-500" },
  { id: "Guru", icon: Briefcase, label: "GURU", color: "text-green-500" },
  { id: "ATS", icon: UserX, label: "ATS", color: "text-orange-500" },
  { id: "APS", icon: Clock, label: "APS", color: "text-gray-500" },
];

export default function SubTab({ onSelect, selected }: { onSelect: (id: string) => void; selected: string }) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100">
      <div className="flex gap-3">
        {allTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onSelect(tab.id)}
              className={`flex flex-col items-center gap-2 px-6 py-4 rounded-xl transition-all flex-1
                ${selected === tab.id ? "border-2 border-pink-400 bg-pink-50" : "border border-gray-100 hover:border-gray-200"}`}
            >
              <Icon className={`w-5 h-5 ${selected === tab.id ? "text-pink-500" : tab.color}`} />
              <p className="text-xs font-bold text-gray-500 tracking-widest">{tab.label}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

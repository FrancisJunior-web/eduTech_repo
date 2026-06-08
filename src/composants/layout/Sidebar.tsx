import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, BookOpen, GraduationCap,
  ClipboardCheck, FileText, Award, Wallet, Calendar, UserRound, Settings,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useLanguage } from '../../i18n/LanguageContext';
import { useBranding } from '../../context/BrandingContext';

export default function Sidebar() {
  const { t, lang } = useLanguage();
  const { logoUrl, schoolName, schoolSub } = useBranding();

  const nav = [
    { label: t.nav.dashboard,    to: '/dashboard',    icon: LayoutDashboard },
    { label: t.nav.students,     to: '/students',     icon: Users            },
    { label: t.nav.classes,      to: '/classes',      icon: BookOpen         },
    { label: t.nav.teachers,     to: '/teachers',     icon: GraduationCap    },
    { label: t.nav.attendance,   to: '/attendance',   icon: ClipboardCheck   },
    { label: t.nav.assessments,  to: '/assessments',  icon: FileText         },
    { label: t.nav.reportCards,  to: '/report-cards', icon: Award            },
    { label: t.nav.fees,         to: '/fees',         icon: Wallet           },
    { label: t.nav.timetable,    to: '/timetable',    icon: Calendar         },
    { label: t.nav.parents,      to: '/parents',      icon: UserRound        },
  ];

  return (
    <aside className="w-64 bg-slate-900 flex flex-col h-screen shrink-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
            {logoUrl
              ? <img src={logoUrl} alt="logo" className="w-full h-full object-contain p-0.5" />
              : <GraduationCap size={20} className="text-white" />
            }
          </div>
          <div className="min-w-0">
            <p className="text-white font-semibold text-sm leading-tight truncate">{schoolName}</p>
            <p className="text-slate-400 text-xs truncate">{schoolSub}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-widest px-3 mb-2">
          {t.nav.mainMenu}
        </p>
        {nav.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              )
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}

        <div className="pt-4">
          <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-widest px-3 mb-2">
            {t.nav.system}
          </p>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              )
            }
          >
            <Settings size={17} />
            {t.nav.settings}
          </NavLink>
        </div>
      </nav>

      {/* Current Term badge */}
      <div className="px-4 py-4 border-t border-slate-700">
        <div className="bg-slate-800 rounded-lg px-3 py-2">
          <p className="text-slate-400 text-xs">{t.nav.currentTerm}</p>
          <p className="text-white text-sm font-medium">
            {lang === 'fr' ? 'Trimestre 2' : 'Term 2'} · 2025/2026
          </p>
        </div>
      </div>
    </aside>
  );
}

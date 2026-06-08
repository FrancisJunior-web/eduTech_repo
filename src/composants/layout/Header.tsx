import { Bell, Search, ChevronDown, Globe } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';

export default function Header() {
  const { pathname } = useLocation();
  const { lang, setLang, t } = useLanguage();

  const titles: Record<string, string> = {
    '/dashboard':    t.header.dashboard,
    '/students':     t.header.students,
    '/classes':      t.header.classes,
    '/teachers':     t.header.teachers,
    '/attendance':   t.header.attendance,
    '/assessments':  t.header.assessments,
    '/report-cards': t.header.reportCards,
    '/fees':         t.header.fees,
    '/timetable':    t.header.timetable,
    '/parents':      t.header.parents,
    '/settings':          t.header.settings,
    '/announcements':     t.header.announcements,
    '/email-alerts':      t.header.emailAlerts,
    '/discussion-forums': t.header.discussionForums,
  };

  const title = titles[pathname] ?? 'School Management';

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
      <h1 className="text-slate-800 font-semibold text-lg">{title}</h1>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden sm:block">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={t.header.search}
            className="w-52 pl-9 pr-4 py-1.5 text-sm bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Language switcher */}
        <div className="flex items-center bg-slate-100 rounded-lg p-0.5 gap-0.5">
          <button
            onClick={() => setLang('en')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
              lang === 'en'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Globe size={11} />
            EN
          </button>
          <button
            onClick={() => setLang('fr')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
              lang === 'fr'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Globe size={11} />
            FR
          </button>
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
          <Bell size={18} className="text-slate-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User */}
        <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
            <span className="text-indigo-700 font-semibold text-xs">GM</span>
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium text-slate-800 leading-tight">Grace Moyo</p>
            <p className="text-xs text-slate-500">{t.header.headTeacher}</p>
          </div>
          <ChevronDown size={14} className="text-slate-400" />
        </button>
      </div>
    </header>
  );
}

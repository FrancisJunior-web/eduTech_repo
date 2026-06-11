import { useState } from 'react';
import { Megaphone, Plus, Pin, ChevronDown, Search, X } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface Announcement {
  id: number;
  title: string;
  body: string;
  audience: string;
  date: string;
  pinned: boolean;
  type: 'info' | 'warning' | 'success';
}

const typeStyle = {
  info:    { bar: 'bg-indigo-500', badge: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
  warning: { bar: 'bg-amber-400',  badge: 'bg-amber-50  text-amber-700  border-amber-100'  },
  success: { bar: 'bg-emerald-500',badge: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
};

export default function Announcements() {
  const { t, lang } = useLanguage();
  const lbl = (en: string, fr: string) => lang === 'fr' ? fr : en;

  const [items, setItems]     = useState<Announcement[]>([]);
  const [search, setSearch]   = useState('');
  const [expanded, setExpanded] = useState<number | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [draft, setDraft]     = useState({ title: '', body: '', audience: 'All Classes', type: 'info' as Announcement['type'] });

  const filtered = items.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.body.toLowerCase().includes(search.toLowerCase()),
  );

  const pinned   = filtered.filter(a => a.pinned);
  const regular  = filtered.filter(a => !a.pinned);

  const addAnnouncement = () => {
    if (!draft.title.trim()) return;
    setItems(prev => [{
      id: Date.now(), ...draft,
      date: new Date().toISOString().split('T')[0], pinned: false,
    }, ...prev]);
    setDraft({ title: '', body: '', audience: 'All Classes', type: 'info' });
    setShowNew(false);
  };

  const Card = ({ a }: { a: Announcement }) => {
    const st  = typeStyle[a.type];
    const open = expanded === a.id;
    return (
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className={`h-1 ${st.bar}`} />
        <div
          className="flex items-start justify-between gap-3 px-5 py-4 cursor-pointer hover:bg-slate-50 transition-colors"
          onClick={() => setExpanded(open ? null : a.id)}
        >
          <div className="flex items-start gap-3 min-w-0">
            {a.pinned && <Pin size={14} className="text-indigo-400 mt-0.5 shrink-0" />}
            <div className="min-w-0">
              <p className="font-semibold text-slate-800 text-sm">{a.title}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {a.audience} · {new Date(a.date).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`text-xs font-medium px-2 py-0.5 rounded border ${st.badge}`}>{a.type}</span>
            <ChevronDown size={15} className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
          </div>
        </div>
        {open && (
          <div className="px-5 pb-4 text-sm text-slate-600 border-t border-slate-100 pt-3">
            {a.body}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-52">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={lbl('Search announcements…', 'Rechercher des annonces…')}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            onClick={() => setShowNew(v => !v)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={14} />
            {lbl('New Announcement', 'Nouvelle Annonce')}
          </button>
        </div>

        {/* Compose form */}
        {showNew && (
          <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
            <input
              value={draft.title}
              onChange={e => setDraft(d => ({ ...d, title: e.target.value }))}
              placeholder={lbl('Title', 'Titre')}
              className="w-full py-2 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <textarea
              rows={3}
              value={draft.body}
              onChange={e => setDraft(d => ({ ...d, body: e.target.value }))}
              placeholder={lbl('Message…', 'Message…')}
              className="w-full py-2 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
            <div className="flex gap-3">
              <select
                value={draft.audience}
                onChange={e => setDraft(d => ({ ...d, audience: e.target.value }))}
                className="py-2 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {['All Classes','All Students','All Parents','All Staff'].map(a => <option key={a}>{a}</option>)}
              </select>
              <select
                value={draft.type}
                onChange={e => setDraft(d => ({ ...d, type: e.target.value as Announcement['type'] }))}
                className="py-2 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="success">Success</option>
              </select>
              <button onClick={addAnnouncement} className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                {lbl('Post', 'Publier')}
              </button>
              <button onClick={() => setShowNew(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: lbl('Total', 'Total'),  value: items.length,                color: 'text-indigo-600' },
          { label: lbl('Pinned', 'Épinglés'), value: items.filter(a => a.pinned).length,  color: 'text-amber-600'  },
          { label: lbl('This Month', 'Ce mois'), value: items.filter(a => a.date.startsWith(new Date().toISOString().slice(0, 7))).length, color: 'text-emerald-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Pinned */}
      {pinned.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
            <Pin size={11} /> {lbl('Pinned', 'Épinglés')}
          </p>
          {pinned.map(a => <Card key={a.id} a={a} />)}
        </div>
      )}

      {/* Regular */}
      {regular.length > 0 && (
        <div className="space-y-2">
          {pinned.length > 0 && (
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
              <Megaphone size={11} /> {lbl('All Notices', 'Toutes les Annonces')}
            </p>
          )}
          {regular.map(a => <Card key={a.id} a={a} />)}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 py-14 text-center text-slate-400">
          <Megaphone size={36} className="mx-auto mb-2 opacity-30" />
          <p className="text-sm">{t.common.noResults}</p>
        </div>
      )}
    </div>
  );
}

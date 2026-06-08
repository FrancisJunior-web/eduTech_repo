import { useState } from 'react';
import { Mail, Plus, Send, Clock, CheckCircle2, XCircle, Search, X } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface Alert {
  id: number;
  subject: string;
  recipient: string;
  message: string;
  sentAt: string | null;
  status: 'sent' | 'pending' | 'failed';
}

const SAMPLE: Alert[] = [
  { id: 1, subject: 'Fee Payment Reminder',        recipient: 'All Parents',   message: 'Dear Parent, this is a reminder that school fees for Term 2 are due on 15 June 2025.',                       sentAt: '2025-06-01 09:00', status: 'sent'    },
  { id: 2, subject: 'Exam Timetable Released',     recipient: 'All Students',  message: 'The end-of-term examination timetable has been published. Please log in to view your schedule.',              sentAt: '2025-05-30 14:30', status: 'sent'    },
  { id: 3, subject: 'Parent–Teacher Meeting',      recipient: 'Grade 3A',      message: 'You are invited to the parent–teacher meeting scheduled for Saturday 8 June 2025 at 9 AM.',                 sentAt: null,               status: 'pending' },
  { id: 4, subject: 'Attendance Alert — Absent',   recipient: 'Mr. Farai N.',  message: 'Your child Tatenda was marked absent on 28 May 2025. Please contact the school if you have any queries.',   sentAt: '2025-05-28 11:00', status: 'failed'  },
];

const statusConfig = {
  sent:    { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', label: 'Sent'    },
  pending: { icon: Clock,        color: 'text-amber-600',   bg: 'bg-amber-50 border-amber-200',     label: 'Pending' },
  failed:  { icon: XCircle,      color: 'text-red-500',     bg: 'bg-red-50 border-red-200',         label: 'Failed'  },
};

export default function EmailAlerts() {
  const { lang } = useLanguage();
  const lbl = (en: string, fr: string) => lang === 'fr' ? fr : en;

  const [alerts, setAlerts]   = useState<Alert[]>(SAMPLE);
  const [search, setSearch]   = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | Alert['status']>('all');
  const [showNew, setShowNew] = useState(false);
  const [draft, setDraft]     = useState({ subject: '', recipient: 'All Parents', message: '' });

  const filtered = alerts.filter(a => {
    const matchSearch = a.subject.toLowerCase().includes(search.toLowerCase()) || a.recipient.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const sendAlert = () => {
    if (!draft.subject.trim() || !draft.message.trim()) return;
    setAlerts(prev => [{
      id: Date.now(), ...draft,
      sentAt: new Date().toLocaleString(),
      status: 'sent' as const,
    }, ...prev]);
    setDraft({ subject: '', recipient: 'All Parents', message: '' });
    setShowNew(false);
  };

  const counts = {
    sent:    alerts.filter(a => a.status === 'sent').length,
    pending: alerts.filter(a => a.status === 'pending').length,
    failed:  alerts.filter(a => a.status === 'failed').length,
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
              placeholder={lbl('Search alerts…', 'Rechercher des alertes…')}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as typeof filterStatus)}
            className="py-2 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">{lbl('All Statuses', 'Tous les statuts')}</option>
            <option value="sent">{lbl('Sent', 'Envoyé')}</option>
            <option value="pending">{lbl('Pending', 'En attente')}</option>
            <option value="failed">{lbl('Failed', 'Échec')}</option>
          </select>
          <button
            onClick={() => setShowNew(v => !v)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={14} />
            {lbl('New Alert', 'Nouvelle Alerte')}
          </button>
        </div>

        {showNew && (
          <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input
                value={draft.subject}
                onChange={e => setDraft(d => ({ ...d, subject: e.target.value }))}
                placeholder={lbl('Subject', 'Objet')}
                className="py-2 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <select
                value={draft.recipient}
                onChange={e => setDraft(d => ({ ...d, recipient: e.target.value }))}
                className="py-2 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {['All Parents','All Students','All Staff','Grade 1A','Grade 2A','Grade 3A','Grade 4A','Grade 5A','Grade 6A'].map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <textarea
              rows={3}
              value={draft.message}
              onChange={e => setDraft(d => ({ ...d, message: e.target.value }))}
              placeholder={lbl('Message body…', 'Corps du message…')}
              className="w-full py-2 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
            <div className="flex gap-2">
              <button onClick={sendAlert} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                <Send size={13} /> {lbl('Send', 'Envoyer')}
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
        {(['sent','pending','failed'] as const).map(s => {
          const cfg = statusConfig[s];
          const Icon = cfg.icon;
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(f => f === s ? 'all' : s)}
              className={`rounded-xl border p-4 text-center cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${filterStatus === s ? cfg.bg : 'bg-white border-slate-200'}`}
            >
              <Icon size={18} className={`mx-auto mb-1 ${cfg.color}`} />
              <p className={`text-2xl font-bold ${cfg.color}`}>{counts[s]}</p>
              <p className="text-sm text-slate-500">{lbl(cfg.label, cfg.label)}</p>
            </button>
          );
        })}
      </div>

      {/* Alert list */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2">
          <Mail size={16} className="text-indigo-500" />
          <h3 className="font-semibold text-slate-800">{lbl('Email Alerts', 'Alertes Email')}</h3>
          <span className="ml-auto text-xs text-slate-400">{filtered.length} {lbl('records', 'entrées')}</span>
        </div>
        <div className="divide-y divide-slate-100">
          {filtered.length === 0 && (
            <div className="py-14 text-center text-slate-400">
              <Mail size={36} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">{lbl('No alerts found', 'Aucune alerte trouvée')}</p>
            </div>
          )}
          {filtered.map(a => {
            const cfg = statusConfig[a.status];
            const Icon = cfg.icon;
            return (
              <div key={a.id} className="flex items-start justify-between gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${cfg.bg}`}>
                    <Icon size={15} className={cfg.color} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-slate-800 text-sm">{a.subject}</p>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">{a.message}</p>
                    <p className="text-xs text-slate-400 mt-1">{lbl('To', 'À')} : <span className="font-medium text-slate-600">{a.recipient}</span></p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded border ${cfg.bg} ${cfg.color}`}>
                    <Icon size={11} /> {cfg.label}
                  </span>
                  {a.sentAt && <p className="text-xs text-slate-400 mt-1">{a.sentAt}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

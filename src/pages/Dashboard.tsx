import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, GraduationCap, BookOpen, UserCheck, TrendingUp, AlertCircle, Search } from 'lucide-react';
import StatCard from '../composants/ui/StatCard';
import { dashboardStats, attendanceRecords, reportCards, feeRecords, students } from '../data/mockData';
import { useBranding } from '../context/BrandingContext';
import { StatusBadge } from '../composants/ui/Badge';
import { useLanguage } from '../i18n/LanguageContext';

const feeTotal     = feeRecords.reduce((s, f) => s + f.amountDue,  0);
const feeCollected = feeRecords.reduce((s, f) => s + f.amountPaid, 0);
const feePending   = feeRecords.reduce((s, f) => s + f.balance,    0);
const feePercent   = feeTotal > 0 ? Math.round((feeCollected / feeTotal) * 100) : 0;

export default function Dashboard() {
  const { t, lang } = useLanguage();
  const { schoolInfo } = useBranding();
  const navigate = useNavigate();

  const recentActivity = [
    { text: lang === 'fr' ? '3 nouveaux bulletins publiés pour la Grade 5A' : '3 new report cards published for Grade 5A', time: lang === 'fr' ? 'Il y a 2h' : '2 hours ago', type: 'success' },
    { text: lang === 'fr' ? 'Présences enregistrées pour Grade 7A' : 'Attendance marked for Grade 7A', time: lang === 'fr' ? 'Il y a 3h' : '3 hours ago', type: 'info' },
    { text: lang === 'fr' ? 'Paiement reçu de Amara Chidziva' : 'Fee payment received from Amara Chidziva', time: lang === 'fr' ? 'Il y a 5h' : '5 hours ago', type: 'success' },
    { text: lang === 'fr' ? 'Les frais de Tatenda Nhamo sont échus' : 'Tatenda Nhamo fees are overdue', time: lang === 'fr' ? 'Il y a 1j' : '1 day ago', type: 'warning' },
    { text: lang === 'fr' ? 'Bulletins du 1er trimestre finalisés pour Grade 3A' : 'Term 1 report cards finalized for Grade 3A', time: lang === 'fr' ? 'Il y a 2j' : '2 days ago', type: 'info' },
  ];

  const [studentSearch, setStudentSearch] = useState('');

  const todayAttendance = attendanceRecords.filter(a => a.date === '2025-06-04');
  const absentCount = todayAttendance.filter(a => a.status === 'absent').length;

  const studentRows = students
    .filter(s => s.isActive)
    .map(s => ({ ...s, fee: feeRecords.find(f => f.studentId === s.id) ?? null }));

  const filteredStudents = studentSearch.trim()
    ? studentRows.filter(s => {
        const q = studentSearch.toLowerCase();
        return (
          `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
          s.studentNumber.toLowerCase().includes(q) ||
          s.className.toLowerCase().includes(q)
        );
      })
    : studentRows;

  const statusLabels: Record<string, string> = {
    present: t.common.present,
    absent:  t.common.absent,
    late:    t.common.late,
    excused: t.common.excused,
  };

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="bg-linear-to-r from-indigo-600 to-indigo-500 rounded-xl px-6 py-5 text-white">
        <p className="text-indigo-100 text-sm">{t.dashboard.welcomeBack}</p>
        <h2 className="text-xl font-bold mt-0.5">{schoolInfo.headTeacher} &nbsp;·&nbsp; {schoolInfo.name}</h2>
        <p className="text-indigo-200 text-sm mt-1">
          {schoolInfo.motto} &nbsp;|&nbsp; {lang === 'fr' ? 'Trimestre 2' : 'Term 2'} · 2025/2026
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label={t.dashboard.totalStudents}   value={dashboardStats.totalStudents}          sub={t.dashboard.enrolledThisYear} icon={Users}         color="indigo" onClick={() => navigate('/students')}    />
        <StatCard label={t.dashboard.teachers}        value={dashboardStats.totalTeachers}          sub={t.dashboard.activeStaff}      icon={GraduationCap} color="blue"   onClick={() => navigate('/teachers')}    />
        <StatCard label={t.dashboard.classes}         value={dashboardStats.totalClasses}           sub={t.dashboard.activeStreams}     icon={BookOpen}      color="purple" onClick={() => navigate('/classes')}     />
        <StatCard label={t.dashboard.attendanceToday} value={`${dashboardStats.attendanceRate}%`}   sub={t.dashboard.presentToday}     icon={UserCheck}     color="green"  onClick={() => navigate('/attendance')}  />
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Attendance breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 transition-transform duration-200 hover:-translate-y-1 hover:shadow-md cursor-default">
          <h3 className="text-slate-800 font-semibold mb-4">{t.dashboard.todaysAttendance}</h3>
          <div className="space-y-3">
            {(['present','absent','late','excused'] as const).map(s => {
              const count = todayAttendance.filter(a => a.status === s).length;
              const pct = todayAttendance.length ? Math.round((count / todayAttendance.length) * 100) : 0;
              const barColor = s === 'present' ? 'bg-green-500' : s === 'absent' ? 'bg-red-400' : s === 'late' ? 'bg-yellow-400' : 'bg-blue-400';
              return (
                <div key={s}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">{statusLabels[s]}</span>
                    <span className="font-medium text-slate-800">{count} <span className="text-slate-400 font-normal">({pct}%)</span></span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${barColor} rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-slate-400 text-xs mt-4">{todayAttendance.length} {t.dashboard.records} · 4 {lang === 'fr' ? 'juin' : 'June'} 2025</p>
        </div>

        {/* Fee collection */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 transition-transform duration-200 hover:-translate-y-1 hover:shadow-md cursor-default">
          <h3 className="text-slate-800 font-semibold mb-4">{t.dashboard.feeCollection}</h3>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative w-20 h-20 shrink-0">
              <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#4f46e5" strokeWidth="3"
                  strokeDasharray={`${feePercent} ${100 - feePercent}`}
                  strokeDashoffset="0" strokeLinecap="round" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-800">
                {feePercent}%
              </span>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-slate-500 text-xs">{t.dashboard.collected}</p>
                <p className="text-slate-800 font-bold">{feeCollected.toLocaleString()} FCFA</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs">{t.dashboard.pending}</p>
                <p className="text-orange-600 font-semibold">{feePending.toLocaleString()} FCFA</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: t.common.paid,    count: feeRecords.filter(f => f.status === 'paid').length,    color: 'text-green-600'  },
              { label: t.common.partial, count: feeRecords.filter(f => f.status === 'partial').length,  color: 'text-yellow-600' },
              { label: t.common.overdue, count: feeRecords.filter(f => f.status === 'overdue').length,  color: 'text-red-600'    },
              { label: t.common.pending, count: feeRecords.filter(f => f.status === 'pending').length,  color: 'text-blue-600'   },
            ].map(i => (
              <div key={i.label} className="bg-slate-50 rounded-lg p-2.5 text-center">
                <p className={`text-xl font-bold ${i.color}`}>{i.count}</p>
                <p className="text-slate-500 text-xs">{i.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Report cards */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 transition-transform duration-200 hover:-translate-y-1 hover:shadow-md cursor-default">
          <h3 className="text-slate-800 font-semibold mb-4">{t.dashboard.reportCards}</h3>
          <div className="space-y-3">
            {reportCards.map(rc => (
              <div key={rc.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{rc.studentName}</p>
                  <p className="text-xs text-slate-400">
                    {rc.className} · {lang === 'fr' ? 'Trim.' : 'Term'} {rc.termName === 'first' ? 1 : rc.termName === 'second' ? 2 : 3}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-semibold text-indigo-600">{rc.percentage}%</span>
                  <StatusBadge status={rc.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Absent students */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 transition-transform duration-200 hover:-translate-y-1 hover:shadow-md cursor-default">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-800 font-semibold">{t.dashboard.absentToday}</h3>
            <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-0.5 rounded-full">
              {absentCount} {t.dashboard.students}
            </span>
          </div>
          {todayAttendance.filter(a => a.status !== 'present').length === 0 ? (
            <p className="text-slate-400 text-sm">{t.dashboard.allPresent}</p>
          ) : (
            <div className="space-y-2">
              {todayAttendance.filter(a => a.status !== 'present').map(a => (
                <div key={a.id} className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                      <span className="text-xs font-medium text-slate-600">
                        {a.studentName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{a.studentName}</p>
                      <p className="text-xs text-slate-400">{a.className}</p>
                    </div>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activity feed */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 transition-transform duration-200 hover:-translate-y-1 hover:shadow-md cursor-default">
          <h3 className="text-slate-800 font-semibold mb-4">{t.dashboard.recentActivity}</h3>
          <div className="space-y-3">
            {recentActivity.map((item, i) => {
              const Icon = item.type === 'warning' ? AlertCircle : item.type === 'success' ? TrendingUp : UserCheck;
              const color = item.type === 'warning' ? 'text-orange-500 bg-orange-50' : item.type === 'success' ? 'text-green-600 bg-green-50' : 'text-blue-600 bg-blue-50';
              return (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
                    <Icon size={14} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-700">{item.text}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Student Directory ──────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <h3 className="font-semibold text-slate-800">{t.dashboard.studentDirectory}</h3>
            <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-0.5 rounded-full">
              {filteredStudents.length}
            </span>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={studentSearch}
              onChange={e => setStudentSearch(e.target.value)}
              placeholder={t.students.searchPlaceholder}
              className="pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-52"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                <th className="px-5 py-3 text-left font-medium w-10">#</th>
                <th className="px-5 py-3 text-left font-medium">{t.common.name}</th>
                <th className="px-5 py-3 text-left font-medium">{t.common.class}</th>
                <th className="px-5 py-3 text-left font-medium">{t.dashboard.guardianPhone}</th>
                <th className="px-5 py-3 text-left font-medium">{t.common.status}</th>
                <th className="px-5 py-3 text-right font-medium">{t.fees.balance}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((s, i) => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 text-slate-400 text-xs">{i + 1}</td>
                  <td className="px-5 py-3">
                    <p className="font-medium text-slate-800">{s.firstName} {s.lastName}</p>
                    <p className="text-xs text-slate-400 font-mono">{s.studentNumber}</p>
                  </td>
                  <td className="px-5 py-3">
                    <span className="bg-indigo-50 text-indigo-700 text-xs font-medium px-2 py-0.5 rounded">
                      {s.className}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-600">{s.guardianPhone}</td>
                  <td className="px-5 py-3">
                    {s.fee
                      ? <StatusBadge status={s.fee.status} />
                      : <span className="text-xs text-slate-400 italic">{t.dashboard.noFeeRecord}</span>
                    }
                  </td>
                  <td className="px-5 py-3 text-right">
                    {s.fee
                      ? <span className={`font-semibold ${s.fee.balance > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                          {s.fee.balance.toLocaleString()} FCFA
                        </span>
                      : <span className="text-slate-300">—</span>
                    }
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-slate-400 text-sm">
                    {t.common.noResults}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

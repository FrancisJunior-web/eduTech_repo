import { useState } from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle, Save } from 'lucide-react';
import { students, classes } from '../data/mockData';
import type { AttendanceStatus } from '../types';
import { clsx } from 'clsx';
import { useLanguage } from '../i18n/LanguageContext';

export default function Attendance() {
  const { t } = useLanguage();

  const statusConfig = {
    present: { icon: CheckCircle, color: 'text-green-600',  bg: 'bg-green-50 border-green-200 hover:bg-green-100'   },
    absent:  { icon: XCircle,     color: 'text-red-500',    bg: 'bg-red-50 border-red-200 hover:bg-red-100'         },
    late:    { icon: Clock,       color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100' },
    excused: { icon: AlertCircle, color: 'text-blue-600',   bg: 'bg-blue-50 border-blue-200 hover:bg-blue-100'      },
  };

  const statusLabels: Record<AttendanceStatus, string> = {
    present: t.common.present,
    absent:  t.common.absent,
    late:    t.common.late,
    excused: t.common.excused,
  };

  const today = new Date().toISOString().split('T')[0];
  const [date, setDate]         = useState(today);
  const [classId, setClassId]   = useState(classes[0].id);
  const [saved, setSaved]       = useState(false);

  const classStudents = students.filter(s => s.classId === classId);

  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>(() => {
    const init: Record<string, AttendanceStatus> = {};
    classStudents.forEach(s => { init[s.id] = 'present'; });
    return init;
  });

  const handleClassChange = (id: string) => {
    setClassId(id);
    const next: Record<string, AttendanceStatus> = {};
    students.filter(s => s.classId === id).forEach(s => { next[s.id] = 'present'; });
    setAttendance(next);
    setSaved(false);
  };

  const mark = (studentId: string, status: AttendanceStatus) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
    setSaved(false);
  };

  const markAll = (status: AttendanceStatus) => {
    const next: Record<string, AttendanceStatus> = {};
    classStudents.forEach(s => { next[s.id] = status; });
    setAttendance(next);
    setSaved(false);
  };

  const counts = {
    present: classStudents.filter(s => attendance[s.id] === 'present').length,
    absent:  classStudents.filter(s => attendance[s.id] === 'absent').length,
    late:    classStudents.filter(s => attendance[s.id] === 'late').length,
    excused: classStudents.filter(s => attendance[s.id] === 'excused').length,
  };

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">{t.attendance.date}</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="py-2 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">{t.attendance.class}</label>
            <select
              value={classId}
              onChange={e => handleClassChange(e.target.value)}
              className="py-2 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="flex gap-2 ml-auto flex-wrap">
            {(['present','absent','late','excused'] as AttendanceStatus[]).map(s => (
              <button
                key={s}
                onClick={() => markAll(s)}
                className={clsx('text-xs px-3 py-2 rounded-lg border font-medium transition-colors', statusConfig[s].bg, statusConfig[s].color)}
              >
                {t.attendance.markAll} {statusLabels[s]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-3">
        {(Object.entries(counts) as [AttendanceStatus, number][]).map(([status, count]) => {
          const cfg = statusConfig[status];
          return (
            <div key={status} className={clsx('rounded-xl p-4 text-center border', cfg.bg)}>
              <p className={clsx('text-2xl font-bold', cfg.color)}>{count}</p>
              <p className={clsx('text-sm font-medium', cfg.color)}>{statusLabels[status]}</p>
            </div>
          );
        })}
      </div>

      {/* Attendance sheet */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
          <div>
            <h3 className="font-semibold text-slate-800">
              {classes.find(c => c.id === classId)?.name} · {new Date(date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </h3>
            <p className="text-xs text-slate-400">{classStudents.length} {t.attendance.students}</p>
          </div>
          <button
            onClick={() => setSaved(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Save size={14} />
            {saved ? t.common.saved : t.attendance.saveAttendance}
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {classStudents.map((s, i) => {
            const current = attendance[s.id] ?? 'present';
            return (
              <div key={s.id} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 text-sm w-6 text-right">{i + 1}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${s.gender === 'female' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'}`}>
                    {s.firstName[0]}{s.lastName[0]}
                  </div>
                  <div>
                    <p className="font-medium text-slate-800 text-sm">{s.firstName} {s.lastName}</p>
                    <p className="text-xs text-slate-400">{s.studentNumber}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {(['present','absent','late','excused'] as AttendanceStatus[]).map(status => {
                    const cfg = statusConfig[status];
                    const isSelected = current === status;
                    return (
                      <button
                        key={status}
                        onClick={() => mark(s.id, status)}
                        className={clsx(
                          'px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
                          isSelected
                            ? clsx(cfg.bg, cfg.color, 'border-current ring-1 ring-offset-1',
                                status === 'present' ? 'ring-green-400' : status === 'absent' ? 'ring-red-400' : status === 'late' ? 'ring-yellow-400' : 'ring-blue-400')
                            : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                        )}
                      >
                        {statusLabels[status]}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

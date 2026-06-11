import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle, Save, BookOpen } from 'lucide-react';
import type { AttendanceStatus, Class, Student } from '../types';
import { clsx } from 'clsx';
import { useLanguage } from '../i18n/LanguageContext';
import { api } from '../api/client';
import { mapClass, mapStudent } from '../api/mappers';

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
  const [classes,    setClasses]    = useState<Class[]>([]);
  const [classStudents, setClassStudents] = useState<Student[]>([]);
  const [date,       setDate]       = useState(today);
  const [classId,    setClassId]    = useState('');
  const [saved,      setSaved]      = useState(false);
  const [saving,     setSaving]     = useState(false);
  const [filter,     setFilter]     = useState<AttendanceStatus | 'all'>('all');
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);

  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});

  // Load classes once
  useEffect(() => {
    api.getClasses()
      .then(data => {
        const mapped = data.map(mapClass);
        setClasses(mapped);
        if (mapped.length > 0) setClassId(mapped[0].id);
      })
      .catch(console.error)
      .finally(() => setLoadingClasses(false));
  }, []);

  // Load students when classId changes
  useEffect(() => {
    if (!classId) return;
    setLoadingStudents(true);
    api.getClassStudents(classId)
      .then(data => {
        const mapped = data.map(mapStudent);
        setClassStudents(mapped);
        const init: Record<string, AttendanceStatus> = {};
        mapped.forEach(s => { init[s.id] = 'present'; });
        setAttendance(init);
        setSaved(false);
        setFilter('all');
      })
      .catch(console.error)
      .finally(() => setLoadingStudents(false));
  }, [classId]);

  const handleClassChange = (id: string) => {
    setClassId(id);
  };

  const visibleStudents = filter === 'all'
    ? classStudents
    : classStudents.filter(s => attendance[s.id] === filter);

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

  const handleSave = async () => {
    if (!classId) return;
    setSaving(true);
    const cls = classes.find(c => c.id === classId);
    const records = classStudents.map(s => ({
      studentId:     s.id,
      studentName:   `${s.firstName} ${s.lastName}`,
      studentNumber: s.studentNumber,
      classId:       classId,
      className:     cls?.name ?? '',
      date:          date,
      status:        attendance[s.id] ?? 'present',
    }));
    try {
      await api.saveAttendance(records);
      setSaved(true);
    } catch (err) {
      console.error('Failed to save attendance:', err);
    } finally {
      setSaving(false);
    }
  };

  const counts = {
    present: classStudents.filter(s => attendance[s.id] === 'present').length,
    absent:  classStudents.filter(s => attendance[s.id] === 'absent').length,
    late:    classStudents.filter(s => attendance[s.id] === 'late').length,
    excused: classStudents.filter(s => attendance[s.id] === 'excused').length,
  };

  if (loadingClasses) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
          <BookOpen size={28} className="text-slate-400" />
        </div>
        <h3 className="text-slate-700 font-semibold text-lg mb-1">No classes yet</h3>
        <p className="text-slate-400 text-sm max-w-xs">Add classes first before recording attendance.</p>
      </div>
    );
  }

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
              onChange={e => { setDate(e.target.value); setSaved(false); }}
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

      {/* Summary KPIs */}
      {(() => {
        const kpiConfig: { status: AttendanceStatus; activeBg: string; activeShadow: string; hoverBorder: string; hoverShadow: string; iconActive: string; numActive: string; labelActive: string; numDefault: string; blob: string }[] = [
          { status: 'present', activeBg: 'bg-emerald-500 border-emerald-500', activeShadow: 'shadow-emerald-200', hoverBorder: 'hover:border-emerald-300', hoverShadow: 'hover:shadow-emerald-100', iconActive: 'text-emerald-100', numActive: 'text-white', labelActive: 'text-emerald-100', numDefault: 'text-emerald-600', blob: 'bg-emerald-400' },
          { status: 'absent',  activeBg: 'bg-red-500 border-red-500',         activeShadow: 'shadow-red-200',     hoverBorder: 'hover:border-red-300',     hoverShadow: 'hover:shadow-red-100',     iconActive: 'text-red-100',     numActive: 'text-white', labelActive: 'text-red-100',     numDefault: 'text-red-500',   blob: 'bg-red-400'     },
          { status: 'late',    activeBg: 'bg-amber-400 border-amber-400',      activeShadow: 'shadow-amber-200',   hoverBorder: 'hover:border-amber-300',   hoverShadow: 'hover:shadow-amber-100',   iconActive: 'text-amber-100',   numActive: 'text-white', labelActive: 'text-amber-100',   numDefault: 'text-amber-500', blob: 'bg-amber-300'   },
          { status: 'excused', activeBg: 'bg-blue-500 border-blue-500',        activeShadow: 'shadow-blue-200',    hoverBorder: 'hover:border-blue-300',    hoverShadow: 'hover:shadow-blue-100',    iconActive: 'text-blue-100',    numActive: 'text-white', labelActive: 'text-blue-100',    numDefault: 'text-blue-500',  blob: 'bg-blue-400'    },
        ];
        return (
          <div className="grid grid-cols-4 gap-3">
            {kpiConfig.map(({ status, activeBg, activeShadow, hoverBorder, hoverShadow, iconActive, numActive, labelActive, numDefault, blob }) => {
              const cfg = statusConfig[status];
              const Icon = cfg.icon;
              const isActive = filter === status;
              return (
                <div
                  key={status}
                  onClick={() => setFilter(f => f === status ? 'all' : status)}
                  className={clsx(
                    'relative overflow-hidden rounded-xl border p-4 cursor-pointer select-none',
                    'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg group',
                    isActive
                      ? clsx(activeBg, 'shadow-md', activeShadow)
                      : clsx('bg-white border-slate-200', hoverBorder, hoverShadow),
                  )}
                >
                  <div className={clsx('absolute -right-3 -top-3 w-16 h-16 rounded-full opacity-10', isActive ? 'bg-white' : blob)} />
                  <Icon size={20} className={clsx('mb-2 transition-colors', isActive ? iconActive : clsx(cfg.color, 'opacity-80 group-hover:opacity-100'))} />
                  <p className={clsx('text-2xl font-bold transition-colors', isActive ? numActive : numDefault)}>
                    {counts[status]}
                  </p>
                  <p className={clsx('text-sm mt-0.5 font-medium transition-colors', isActive ? labelActive : 'text-slate-500')}>
                    {statusLabels[status]}
                  </p>
                </div>
              );
            })}
          </div>
        );
      })()}

      {/* Attendance sheet */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
          <div>
            <h3 className="font-semibold text-slate-800">
              {classes.find(c => c.id === classId)?.name} · {new Date(date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </h3>
            <p className="text-xs text-slate-400">
              {filter === 'all'
                ? `${classStudents.length} ${t.attendance.students}`
                : `${visibleStudents.length} / ${classStudents.length} ${t.attendance.students} · ${statusLabels[filter]}`}
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Save size={14} />
            {saving ? 'Saving…' : saved ? t.common.saved : t.attendance.saveAttendance}
          </button>
        </div>

        {loadingStudents ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : classStudents.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-sm">
            No students enrolled in this class yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {visibleStudents.map((s, i) => {
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
        )}
      </div>
    </div>
  );
}

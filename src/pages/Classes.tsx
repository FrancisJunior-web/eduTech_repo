import { useState } from 'react';
import { Plus, Users, BookOpen, Eye } from 'lucide-react';
import { classes as initialClasses, students, teachers } from '../data/mockData';
import type { Class } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import ClassDetailModal from '../composants/classes/ClassDetailModal';
import AddClassModal    from '../composants/classes/AddClassModal';

export default function Classes() {
  const { t } = useLanguage();

  const [classList, setClassList]   = useState<Class[]>(initialClasses);
  const [selected,  setSelected]    = useState<Class | null>(null);
  const [adding,    setAdding]      = useState(false);

  const handleAdd = (cls: Class) => {
    setClassList(prev => [...prev, cls]);
  };

  return (
    <div className="space-y-5">

      {/* Top bar */}
      <div className="flex items-center justify-between">
        <p className="text-slate-500 text-sm">{classList.length} {t.classes.activeThisTerm}</p>
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={15} /> {t.classes.addClass}
        </button>
      </div>

      {/* Class cards — clickable */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {classList.map(cls => {
          const classStudents = students.filter(s => s.classId === cls.id);
          const maleCount     = classStudents.filter(s => s.gender === 'male').length;
          const femaleCount   = classStudents.filter(s => s.gender === 'female').length;
          const pct           = Math.round((cls.enrolled / cls.capacity) * 100);

          return (
            <div
              key={cls.id}
              onClick={() => setSelected(cls)}
              className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors">
                    {cls.name}
                  </h3>
                  <p className="text-slate-400 text-xs">{cls.gradeLevelName} · {cls.room}</p>
                </div>
                <div className="w-9 h-9 rounded-lg bg-indigo-50 group-hover:bg-indigo-100 flex items-center justify-center transition-colors">
                  <BookOpen size={17} className="text-indigo-600" />
                </div>
              </div>

              {/* Capacity bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>{t.classes.enrollment}</span>
                  <span>{cls.enrolled}/{cls.capacity}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${pct >= 90 ? 'bg-red-400' : pct >= 75 ? 'bg-yellow-400' : 'bg-green-400'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              {/* Teacher + gender counts */}
              <div className="border-t border-slate-100 pt-3 space-y-1.5">
                <div className="flex items-center gap-2 text-sm">
                  <Users size={13} className="text-slate-400" />
                  <span className="text-slate-600 truncate">{cls.classTeacherName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2 text-xs">
                    <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">{maleCount} {t.classes.boys}</span>
                    <span className="bg-pink-50 text-pink-700 px-1.5 py-0.5 rounded">{femaleCount} {t.classes.girls}</span>
                  </div>
                  <span className="text-indigo-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <Eye size={12} /> View
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">{t.classes.classDetails}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                <th className="text-left px-5 py-3 font-medium">{t.common.class}</th>
                <th className="text-left px-5 py-3 font-medium">{t.classes.gradeLevel}</th>
                <th className="text-left px-5 py-3 font-medium">{t.classes.classTeacher}</th>
                <th className="text-left px-5 py-3 font-medium">{t.classes.room}</th>
                <th className="text-center px-5 py-3 font-medium">{t.classes.boys}</th>
                <th className="text-center px-5 py-3 font-medium">{t.classes.girls}</th>
                <th className="text-center px-5 py-3 font-medium">{t.classes.enrolled}</th>
                <th className="text-center px-5 py-3 font-medium">{t.classes.capacity}</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classList.map(cls => {
                const classStudents = students.filter(s => s.classId === cls.id);
                return (
                  <tr
                    key={cls.id}
                    className="hover:bg-slate-50 cursor-pointer"
                    onClick={() => setSelected(cls)}
                  >
                    <td className="px-5 py-3 font-medium text-slate-800">{cls.name}</td>
                    <td className="px-5 py-3 text-slate-600">{cls.gradeLevelName}</td>
                    <td className="px-5 py-3 text-slate-600">{cls.classTeacherName}</td>
                    <td className="px-5 py-3 text-slate-500">{cls.room}</td>
                    <td className="px-5 py-3 text-center text-blue-600 font-medium">
                      {classStudents.filter(s => s.gender === 'male').length}
                    </td>
                    <td className="px-5 py-3 text-center text-pink-600 font-medium">
                      {classStudents.filter(s => s.gender === 'female').length}
                    </td>
                    <td className="px-5 py-3 text-center font-semibold text-slate-800">{cls.enrolled}</td>
                    <td className="px-5 py-3 text-center text-slate-500">{cls.capacity}</td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={e => { e.stopPropagation(); setSelected(cls); }}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
                      >
                        <Eye size={13} /> {t.common.view}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Class detail modal ─────────────────────────────── */}
      {selected && (
        <ClassDetailModal
          cls={selected}
          students={students.filter(s => s.classId === selected.id)}
          teacher={teachers.find(tc => tc.id === selected.classTeacherId)}
          onClose={() => setSelected(null)}
        />
      )}

      {/* ── Add class modal ────────────────────────────────── */}
      {adding && (
        <AddClassModal
          onClose={() => setAdding(false)}
          onAdd={handleAdd}
        />
      )}
    </div>
  );
}

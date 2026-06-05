import { useState } from 'react';
import { Save, FileText } from 'lucide-react';
import { marks, classes, subjects, students } from '../data/mockData';
import { useLanguage } from '../i18n/LanguageContext';

const gradeColor: Record<string, string> = {
  'A+': 'bg-emerald-100 text-emerald-700', 'A': 'bg-green-100 text-green-700',
  'B':  'bg-blue-100 text-blue-700',        'C': 'bg-yellow-100 text-yellow-700',
  'D':  'bg-orange-100 text-orange-700',    'F': 'bg-red-100 text-red-700',
};

export default function Assessments() {
  const { t, lang } = useLanguage();
  const [classId,   setClassId]   = useState(classes[2].id);
  const [subjectId, setSubjectId] = useState(subjects[0].id);
  const [saved, setSaved] = useState(false);

  const classStudents = students.filter(s => s.classId === classId);

  const [scores, setScores] = useState<Record<string, { ca: string; exam: string }>>(() => {
    const init: Record<string, { ca: string; exam: string }> = {};
    classStudents.forEach(s => {
      const existing = marks.find(m => m.studentId === s.id && m.subjectId === subjectId);
      init[s.id] = { ca: existing ? String(existing.caScore) : '', exam: existing ? String(existing.examScore) : '' };
    });
    return init;
  });

  const getGrade = (total: number): { grade: string; remark: string } => {
    if (total >= 90) return { grade: 'A+', remark: lang === 'fr' ? 'Excellent'    : 'Excellent'    };
    if (total >= 80) return { grade: 'A',  remark: lang === 'fr' ? 'Très bien'    : 'Very Good'    };
    if (total >= 70) return { grade: 'B',  remark: lang === 'fr' ? 'Bien'         : 'Good'         };
    if (total >= 60) return { grade: 'C',  remark: lang === 'fr' ? 'Assez bien'   : 'Average'      };
    if (total >= 50) return { grade: 'D',  remark: lang === 'fr' ? 'Insuffisant'  : 'Below Avg'    };
    return              { grade: 'F',  remark: lang === 'fr' ? 'Échec'        : 'Fail'         };
  };

  const updateScore = (sid: string, field: 'ca' | 'exam', val: string) => {
    setScores(prev => ({ ...prev, [sid]: { ...prev[sid], [field]: val } }));
    setSaved(false);
  };

  const rows = classStudents.map(s => {
    const ca   = parseFloat(scores[s.id]?.ca   ?? '') || 0;
    const exam = parseFloat(scores[s.id]?.exam ?? '') || 0;
    const total = ca + exam;
    const { grade, remark } = getGrade(total);
    return { ...s, ca, exam, total, grade, remark };
  });

  const classAvg = rows.length
    ? Math.round(rows.reduce((sum, r) => sum + r.total, 0) / rows.length)
    : 0;

  const className   = classes.find(c => c.id === classId)?.name ?? '';
  const subjectName = subjects.find(s => s.id === subjectId)?.name ?? '';

  const termLabel = lang === 'fr' ? 'Trimestre 1 · 2025/2026' : 'Term 1 · 2025/2026';
  const term2Label = lang === 'fr' ? 'Trimestre 2 · 2025/2026' : 'Term 2 · 2025/2026';

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">{t.assessments.class}</label>
            <select
              value={classId}
              onChange={e => setClassId(e.target.value)}
              className="py-2 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">{t.assessments.subject}</label>
            <select
              value={subjectId}
              onChange={e => setSubjectId(e.target.value)}
              className="py-2 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">{t.assessments.term}</label>
            <select className="py-2 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>{termLabel}</option>
              <option>{term2Label}</option>
            </select>
          </div>
          <button
            onClick={() => setSaved(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors ml-auto"
          >
            <Save size={14} />
            {saved ? t.common.saved : t.assessments.saveMarks}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <p className="text-2xl font-bold text-indigo-600">{classAvg}</p>
          <p className="text-sm text-slate-500">{t.assessments.classAverage}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{rows.filter(r => r.total >= 50).length}</p>
          <p className="text-sm text-slate-500">{t.assessments.passed}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <p className="text-2xl font-bold text-red-500">{rows.filter(r => r.total > 0 && r.total < 50).length}</p>
          <p className="text-sm text-slate-500">{t.assessments.failed}</p>
        </div>
      </div>

      {/* Marks table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-3 border-b border-slate-100">
          <FileText size={16} className="text-indigo-500" />
          <h3 className="font-semibold text-slate-800">{className} · {subjectName}</h3>
          <span className="text-slate-400 text-sm ml-1">{t.assessments.caExamFormula}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                <th className="text-left px-5 py-3 font-medium w-8">#</th>
                <th className="text-left px-5 py-3 font-medium">{t.common.name}</th>
                <th className="text-center px-5 py-3 font-medium">{t.assessments.caOutOf}</th>
                <th className="text-center px-5 py-3 font-medium">{t.assessments.examOutOf}</th>
                <th className="text-center px-5 py-3 font-medium">{t.assessments.totalOutOf}</th>
                <th className="text-center px-5 py-3 font-medium">{t.assessments.grade}</th>
                <th className="text-center px-5 py-3 font-medium">{t.assessments.remark}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((s, i) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3 text-slate-400">{i + 1}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${s.gender === 'female' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'}`}>
                        {s.firstName[0]}{s.lastName[0]}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{s.firstName} {s.lastName}</p>
                        <p className="text-xs text-slate-400">{s.studentNumber}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <input
                      type="number" min="0" max="40"
                      value={scores[s.id]?.ca ?? ''}
                      onChange={e => updateScore(s.id, 'ca', e.target.value)}
                      className="w-16 text-center py-1 px-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      placeholder="—"
                    />
                  </td>
                  <td className="px-5 py-3 text-center">
                    <input
                      type="number" min="0" max="60"
                      value={scores[s.id]?.exam ?? ''}
                      onChange={e => updateScore(s.id, 'exam', e.target.value)}
                      className="w-16 text-center py-1 px-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      placeholder="—"
                    />
                  </td>
                  <td className="px-5 py-3 text-center font-bold text-slate-800">{s.total > 0 ? s.total : '—'}</td>
                  <td className="px-5 py-3 text-center">
                    {s.total > 0 && (
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${gradeColor[s.grade] ?? 'bg-slate-100 text-slate-600'}`}>
                        {s.grade}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-center text-slate-500 text-xs">{s.total > 0 ? s.remark : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

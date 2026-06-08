import { useState } from 'react';
import { Save, FileText, BarChart2, CheckCircle2, XCircle } from 'lucide-react';
import { marks, classes, subjects, students, terms } from '../data/mockData';
import { useLanguage } from '../i18n/LanguageContext';

type Filter = 'all' | 'passed' | 'failed';

const gradeColor: Record<string, string> = {
  'A+': 'bg-emerald-100 text-emerald-700', 'A': 'bg-green-100 text-green-700',
  'B':  'bg-blue-100 text-blue-700',        'C': 'bg-yellow-100 text-yellow-700',
  'D':  'bg-orange-100 text-orange-700',    'F': 'bg-red-100 text-red-700',
};

// Sequences [seq1, seq2] for each term id
const TERM_SEQUENCES: Record<string, [number, number]> = {
  't1': [1, 2],
  't2': [3, 4],
  't3': [5, 6],
};

type SeqScores = Record<string, { seq1: string; seq2: string }>;

function initScores(
  studentList: typeof students,
  subId: string,
): SeqScores {
  const init: SeqScores = {};
  studentList.forEach(s => {
    const existing = marks.find(m => m.studentId === s.id && m.subjectId === subId);
    init[s.id] = {
      seq1: existing ? String(existing.caScore)   : '',
      seq2: existing ? String(existing.examScore) : '',
    };
  });
  return init;
}

export default function Assessments() {
  const { t, lang } = useLanguage();
  const [classId,   setClassId]   = useState(classes[2].id);
  const [subjectId, setSubjectId] = useState(subjects[0].id);
  const [termId,    setTermId]    = useState(
    terms.find(tm => tm.isCurrent)?.id ?? terms[0].id,
  );
  const [saved,   setSaved]   = useState(false);
  const [filter,  setFilter]  = useState<Filter>('all');

  const classStudents = students.filter(s => s.classId === classId);

  const [scores, setScores] = useState<SeqScores>(() =>
    initScores(classStudents, subjectId),
  );

  const [s1, s2] = TERM_SEQUENCES[termId] ?? [1, 2];

  const handleClassChange = (newId: string) => {
    setClassId(newId);
    setScores(initScores(students.filter(s => s.classId === newId), subjectId));
    setSaved(false);
    setFilter('all');
  };

  const handleSubjectChange = (newId: string) => {
    setSubjectId(newId);
    setScores(initScores(classStudents, newId));
    setSaved(false);
    setFilter('all');
  };

  const handleTermChange = (newId: string) => {
    setTermId(newId);
    setScores(initScores(classStudents, subjectId));
    setSaved(false);
    setFilter('all');
  };

  const getGrade = (total: number): { grade: string; remark: string } => {
    if (total >= 90) return { grade: 'A+', remark: lang === 'fr' ? 'Excellent'   : 'Excellent'   };
    if (total >= 80) return { grade: 'A',  remark: lang === 'fr' ? 'Très bien'   : 'Very Good'   };
    if (total >= 70) return { grade: 'B',  remark: lang === 'fr' ? 'Bien'        : 'Good'        };
    if (total >= 60) return { grade: 'C',  remark: lang === 'fr' ? 'Assez bien'  : 'Average'     };
    if (total >= 50) return { grade: 'D',  remark: lang === 'fr' ? 'Insuffisant' : 'Below Avg'   };
    return              { grade: 'F',  remark: lang === 'fr' ? 'Échec'       : 'Fail'        };
  };

  const updateScore = (sid: string, field: 'seq1' | 'seq2', val: string) => {
    setScores(prev => ({ ...prev, [sid]: { ...prev[sid], [field]: val } }));
    setSaved(false);
  };

  const rows = classStudents.map(s => {
    const seq1  = parseFloat(scores[s.id]?.seq1 ?? '') || 0;
    const seq2  = parseFloat(scores[s.id]?.seq2 ?? '') || 0;
    const hasAny = (scores[s.id]?.seq1 ?? '') !== '' || (scores[s.id]?.seq2 ?? '') !== '';
    const total  = hasAny ? Math.round((seq1 + seq2) / 2) : 0;
    const { grade, remark } = getGrade(total);
    return { ...s, seq1, seq2, total, grade, remark, hasAny };
  });

  const visibleRows = filter === 'passed'
    ? rows.filter(r => r.hasAny && r.total >= 50)
    : filter === 'failed'
    ? rows.filter(r => r.hasAny && r.total < 50)
    : rows;

  const classAvg = rows.length
    ? Math.round(rows.reduce((sum, r) => sum + r.total, 0) / rows.length)
    : 0;

  const className   = classes.find(c => c.id === classId)?.name ?? '';
  const subjectName = subjects.find(s => s.id === subjectId)?.name ?? '';

  const termLabel = (tm: typeof terms[0]) => {
    const n = tm.id === 't1' ? 1 : tm.id === 't2' ? 2 : 3;
    const [a, b] = TERM_SEQUENCES[tm.id] ?? [1, 2];
    return lang === 'fr'
      ? `Trimestre ${n} (Séq ${a}-${b}) · 2025/2026`
      : `Term ${n} (Seq ${a}-${b}) · 2025/2026`;
  };

  const seq1Header = lang === 'fr' ? `Séq ${s1} /100` : `Seq ${s1} /100`;
  const seq2Header = lang === 'fr' ? `Séq ${s2} /100` : `Seq ${s2} /100`;
  const formulaHint = lang === 'fr'
    ? `Moy. Séq ${s1} & Séq ${s2} = Total /100`
    : `Avg of Seq ${s1} & Seq ${s2} = Total /100`;

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">{t.assessments.class}</label>
            <select
              value={classId}
              onChange={e => handleClassChange(e.target.value)}
              className="py-2 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">{t.assessments.subject}</label>
            <select
              value={subjectId}
              onChange={e => handleSubjectChange(e.target.value)}
              className="py-2 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">{t.assessments.term}</label>
            <select
              value={termId}
              onChange={e => handleTermChange(e.target.value)}
              className="py-2 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {terms.map(tm => (
                <option key={tm.id} value={tm.id}>{termLabel(tm)}</option>
              ))}
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
        {/* Class Average */}
        <div
          onClick={() => setFilter('all')}
          className={`relative overflow-hidden rounded-xl border p-4 cursor-pointer select-none
            transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg group
            ${filter === 'all'
              ? 'bg-indigo-600 border-indigo-600 shadow-indigo-200 shadow-md'
              : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-indigo-100'}`}
        >
          <div className={`absolute -right-3 -top-3 w-16 h-16 rounded-full opacity-10
            ${filter === 'all' ? 'bg-white' : 'bg-indigo-400'}`} />
          <BarChart2
            size={20}
            className={`mb-2 transition-colors ${filter === 'all' ? 'text-indigo-200' : 'text-indigo-400 group-hover:text-indigo-500'}`}
          />
          <p className={`text-2xl font-bold transition-colors ${filter === 'all' ? 'text-white' : 'text-indigo-600'}`}>
            {classAvg}
          </p>
          <p className={`text-sm mt-0.5 transition-colors ${filter === 'all' ? 'text-indigo-200' : 'text-slate-500'}`}>
            {t.assessments.classAverage}
          </p>
        </div>

        {/* Passed */}
        <div
          onClick={() => setFilter(f => f === 'passed' ? 'all' : 'passed')}
          className={`relative overflow-hidden rounded-xl border p-4 cursor-pointer select-none
            transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg group
            ${filter === 'passed'
              ? 'bg-emerald-500 border-emerald-500 shadow-emerald-200 shadow-md'
              : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-emerald-100'}`}
        >
          <div className={`absolute -right-3 -top-3 w-16 h-16 rounded-full opacity-10
            ${filter === 'passed' ? 'bg-white' : 'bg-emerald-400'}`} />
          <CheckCircle2
            size={20}
            className={`mb-2 transition-colors ${filter === 'passed' ? 'text-emerald-100' : 'text-emerald-500 group-hover:text-emerald-600'}`}
          />
          <p className={`text-2xl font-bold transition-colors ${filter === 'passed' ? 'text-white' : 'text-emerald-600'}`}>
            {rows.filter(r => r.hasAny && r.total >= 50).length}
          </p>
          <p className={`text-sm mt-0.5 transition-colors ${filter === 'passed' ? 'text-emerald-100' : 'text-slate-500'}`}>
            {t.assessments.passed}
          </p>
        </div>

        {/* Failed */}
        <div
          onClick={() => setFilter(f => f === 'failed' ? 'all' : 'failed')}
          className={`relative overflow-hidden rounded-xl border p-4 cursor-pointer select-none
            transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg group
            ${filter === 'failed'
              ? 'bg-red-500 border-red-500 shadow-red-200 shadow-md'
              : 'bg-white border-slate-200 hover:border-red-300 hover:shadow-red-100'}`}
        >
          <div className={`absolute -right-3 -top-3 w-16 h-16 rounded-full opacity-10
            ${filter === 'failed' ? 'bg-white' : 'bg-red-400'}`} />
          <XCircle
            size={20}
            className={`mb-2 transition-colors ${filter === 'failed' ? 'text-red-100' : 'text-red-400 group-hover:text-red-500'}`}
          />
          <p className={`text-2xl font-bold transition-colors ${filter === 'failed' ? 'text-white' : 'text-red-500'}`}>
            {rows.filter(r => r.hasAny && r.total < 50).length}
          </p>
          <p className={`text-sm mt-0.5 transition-colors ${filter === 'failed' ? 'text-red-100' : 'text-slate-500'}`}>
            {t.assessments.failed}
          </p>
        </div>
      </div>

      {/* Marks table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-3 border-b border-slate-100">
          <FileText size={16} className="text-indigo-500" />
          <h3 className="font-semibold text-slate-800">{className} · {subjectName}</h3>
          <span className="text-slate-400 text-sm ml-1">{formulaHint}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                <th className="text-left px-5 py-3 font-medium w-8">#</th>
                <th className="text-left px-5 py-3 font-medium">{t.common.name}</th>
                <th className="text-center px-5 py-3 font-medium">{seq1Header}</th>
                <th className="text-center px-5 py-3 font-medium">{seq2Header}</th>
                <th className="text-center px-5 py-3 font-medium">{t.assessments.totalOutOf}</th>
                <th className="text-center px-5 py-3 font-medium">{t.assessments.grade}</th>
                <th className="text-center px-5 py-3 font-medium">{t.assessments.remark}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleRows.map((s, i) => (
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
                      type="number" min="0" max="100"
                      value={scores[s.id]?.seq1 ?? ''}
                      onChange={e => updateScore(s.id, 'seq1', e.target.value)}
                      className="w-16 text-center py-1 px-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      placeholder="—"
                    />
                  </td>
                  <td className="px-5 py-3 text-center">
                    <input
                      type="number" min="0" max="100"
                      value={scores[s.id]?.seq2 ?? ''}
                      onChange={e => updateScore(s.id, 'seq2', e.target.value)}
                      className="w-16 text-center py-1 px-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      placeholder="—"
                    />
                  </td>
                  <td className="px-5 py-3 text-center font-bold text-slate-800">
                    {s.hasAny ? s.total : '—'}
                  </td>
                  <td className="px-5 py-3 text-center">
                    {s.hasAny && (
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${gradeColor[s.grade] ?? 'bg-slate-100 text-slate-600'}`}>
                        {s.grade}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-center text-slate-500 text-xs">
                    {s.hasAny ? s.remark : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

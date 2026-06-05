import { useState } from 'react';
import { Printer, Eye, Award, X } from 'lucide-react';
import { reportCards } from '../data/mockData';
import { useBranding } from '../context/BrandingContext';
import type { ReportCard } from '../types';
import { StatusBadge } from '../composants/ui/Badge';
import { clsx } from 'clsx';
import { useLanguage } from '../i18n/LanguageContext';

const gradeColor: Record<string, string> = {
  'A+': 'text-emerald-700', 'A': 'text-green-700', 'B': 'text-blue-700',
  'C':  'text-yellow-700',  'D': 'text-orange-700', 'F': 'text-red-700',
};

function PrintableReportCard({ rc }: { rc: ReportCard }) {
  const { t } = useLanguage();
  const { schoolInfo } = useBranding();

  const termLabel =
    rc.termName === 'first'  ? t.reportCards.term1 :
    rc.termName === 'second' ? t.reportCards.term2 : t.reportCards.term3;

  const attendancePct = rc.totalSchoolDays
    ? Math.round((rc.daysPresent / rc.totalSchoolDays) * 100)
    : 0;

  return (
    <div className="print-card bg-white" style={{ fontFamily: 'serif', maxWidth: '210mm', margin: '0 auto', padding: '16mm 14mm' }}>
      {/* Header */}
      <div className="text-center border-b-2 border-slate-800 pb-4 mb-4">
        <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-2">
          <Award size={28} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-wide">{schoolInfo.name}</h1>
        <p className="text-slate-600 text-sm italic">{schoolInfo.motto}</p>
        <p className="text-slate-500 text-xs mt-1">{schoolInfo.address} · {schoolInfo.phone}</p>
        <div className="mt-3 bg-indigo-700 text-white text-sm font-bold py-1.5 px-4 rounded inline-block uppercase tracking-widest">
          {t.reportCards.studentProgressReport}
        </div>
      </div>

      {/* Student info */}
      <div className="grid grid-cols-2 gap-4 mb-5 text-sm">
        <div className="space-y-1.5">
          {[
            { label: t.common.name,            val: rc.studentName    },
            { label: t.reportCards.admNumber,  val: rc.studentNumber  },
            { label: t.common.class,           val: rc.className      },
          ].map(f => (
            <div key={f.label} className="flex gap-2">
              <span className="text-slate-500 w-32 shrink-0">{f.label}:</span>
              <span className="font-semibold text-slate-900">{f.val}</span>
            </div>
          ))}
        </div>
        <div className="space-y-1.5">
          {[
            { label: t.reportCards.academicYear, val: rc.academicYear       },
            { label: t.common.term,              val: termLabel             },
            { label: t.reportCards.headTeacher,  val: schoolInfo.headTeacher    },
          ].map(f => (
            <div key={f.label} className="flex gap-2">
              <span className="text-slate-500 w-32 shrink-0">{f.label}:</span>
              <span className="font-semibold text-slate-900">{f.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Subject marks */}
      <table className="w-full text-sm border-collapse mb-5">
        <thead>
          <tr className="bg-slate-800 text-white">
            <th className="text-left px-3 py-2 font-semibold">{t.common.subject}</th>
            <th className="text-center px-3 py-2 font-semibold">{t.assessments.caOutOf}</th>
            <th className="text-center px-3 py-2 font-semibold">{t.assessments.examOutOf}</th>
            <th className="text-center px-3 py-2 font-semibold">{t.assessments.totalOutOf} (100)</th>
            <th className="text-center px-3 py-2 font-semibold">{t.assessments.grade}</th>
            <th className="text-center px-3 py-2 font-semibold">{t.assessments.remark}</th>
            <th className="text-center px-3 py-2 font-semibold">{t.common.position}</th>
          </tr>
        </thead>
        <tbody>
          {rc.entries.map((e, i) => (
            <tr key={e.subjectId} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'} style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td className="px-3 py-2 font-medium text-slate-800">{e.subjectName}</td>
              <td className="px-3 py-2 text-center text-slate-700">{e.caScore}</td>
              <td className="px-3 py-2 text-center text-slate-700">{e.examScore}</td>
              <td className="px-3 py-2 text-center font-bold text-slate-900">{e.totalScore}</td>
              <td className={clsx('px-3 py-2 text-center font-bold', gradeColor[e.grade] ?? 'text-slate-700')}>{e.grade}</td>
              <td className="px-3 py-2 text-center text-slate-600 text-xs">{e.remark}</td>
              <td className="px-3 py-2 text-center text-slate-500">{e.position}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-indigo-50" style={{ borderTop: '2px solid #4f46e5' }}>
            <td className="px-3 py-2 font-bold text-slate-800">{t.reportCards.totalAverage}</td>
            <td colSpan={2} />
            <td className="px-3 py-2 text-center font-bold text-indigo-700">{rc.totalMarksObtained}</td>
            <td className="px-3 py-2 text-center font-bold text-indigo-700">{rc.percentage}%</td>
            <td />
            <td className="px-3 py-2 text-center font-bold text-indigo-700">{rc.classPosition}/{rc.outOf}</td>
          </tr>
        </tfoot>
      </table>

      {/* Summary boxes */}
      <div className="grid grid-cols-3 gap-4 mb-5 text-sm">
        <div className="border border-slate-300 rounded p-3 text-center">
          <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">{t.reportCards.classPosition}</p>
          <p className="text-2xl font-bold text-indigo-700">{rc.classPosition}<sup className="text-sm">/{rc.outOf}</sup></p>
        </div>
        <div className="border border-slate-300 rounded p-3 text-center">
          <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">{t.reportCards.attendance}</p>
          <p className="text-2xl font-bold text-green-700">{attendancePct}%</p>
          <p className="text-xs text-slate-400">{rc.daysPresent}/{rc.totalSchoolDays} {t.reportCards.days}</p>
        </div>
        <div className="border border-slate-300 rounded p-3 text-center">
          <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">{t.reportCards.conduct}</p>
          <p className="text-lg font-bold text-slate-800">{rc.conduct}</p>
        </div>
      </div>

      {/* Comments */}
      <div className="space-y-3 mb-6 text-sm">
        <div className="border border-slate-200 rounded p-3">
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">{t.reportCards.classTeacherComment}</p>
          <p className="text-slate-800 italic">"{rc.classTeacherComment}"</p>
        </div>
        <div className="border border-slate-200 rounded p-3">
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">{t.reportCards.headTeacherComment}</p>
          <p className="text-slate-800 italic">"{rc.headTeacherComment}"</p>
        </div>
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-3 gap-8 text-sm border-t border-slate-300 pt-4">
        {[t.classes.classTeacher, t.reportCards.headTeacher, t.reportCards.parent].map(role => (
          <div key={role} className="text-center">
            <div className="border-b border-slate-400 h-8 mb-1" />
            <p className="text-slate-500 text-xs">{role} {t.reportCards.signature}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 text-center text-xs text-slate-400 border-t border-slate-200 pt-2">
        <p>{t.reportCards.footer} · {schoolInfo.name}</p>
      </div>
    </div>
  );
}

export default function ReportCards() {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<ReportCard | null>(null);
  const [filterClass, setFilterClass] = useState('');

  const classNames = [...new Set(reportCards.map(r => r.className))];
  const filtered = filterClass ? reportCards.filter(r => r.className === filterClass) : reportCards;

  const handlePrint = (rc: ReportCard) => {
    setSelected(rc);
    setTimeout(() => window.print(), 300);
  };

  return (
    <>
      {selected && (
        <div className="print-only fixed inset-0 bg-white z-50">
          <PrintableReportCard rc={selected} />
        </div>
      )}

      <div className="space-y-5 no-print">
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={filterClass}
            onChange={e => setFilterClass(e.target.value)}
            className="py-2 px-3 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">{t.reportCards.allClasses}</option>
            {classNames.map(c => <option key={c}>{c}</option>)}
          </select>
          <select className="py-2 px-3 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option>{t.reportCards.term1} · 2025/2026</option>
            <option>{t.reportCards.term2} · 2025/2026</option>
          </select>
          <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors ml-auto">
            <Printer size={14} />
            {t.reportCards.printAll} ({filtered.length})
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filtered.map(rc => (
            <div key={rc.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold shrink-0">
                    {rc.studentName.split(' ').map(n => n[0]).join('').slice(0,2)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">{rc.studentName}</h3>
                    <p className="text-slate-400 text-xs">{rc.studentNumber} · {rc.className}</p>
                    <p className="text-slate-400 text-xs">
                      {rc.termName === 'first' ? t.reportCards.term1 : rc.termName === 'second' ? t.reportCards.term2 : t.reportCards.term3} · {rc.academicYear}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-center">
                  <div>
                    <p className="text-2xl font-bold text-indigo-600">{rc.percentage}%</p>
                    <p className="text-xs text-slate-400">{t.assessments.classAverage}</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-800">{rc.classPosition}<span className="text-sm text-slate-400">/{rc.outOf}</span></p>
                    <p className="text-xs text-slate-400">{t.common.position}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">{rc.conduct}</p>
                    <p className="text-xs text-slate-400">{t.reportCards.conduct}</p>
                  </div>
                  <StatusBadge status={rc.status} />
                </div>
              </div>

              {/* Subject summary row */}
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-slate-400 uppercase">
                      {rc.entries.map(e => (
                        <th key={e.subjectId} className="text-center px-2 py-1 font-medium">{e.subjectName.split(' ')[0]}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {rc.entries.map(e => (
                        <td key={e.subjectId} className="text-center px-2 py-1">
                          <span className={clsx('font-bold', gradeColor[e.grade] ?? 'text-slate-700')}>{e.grade}</span>
                          <span className="text-slate-400 ml-1">{e.totalScore}</span>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                <button
                  onClick={() => setSelected(selected?.id === rc.id ? null : rc)}
                  className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  <Eye size={14} />
                  {selected?.id === rc.id ? t.reportCards.closePreview : t.reportCards.preview}
                </button>
                <button
                  onClick={() => handlePrint(rc)}
                  className="flex items-center gap-1.5 text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg font-medium transition-colors ml-auto"
                >
                  <Printer size={14} />
                  {t.reportCards.printReportCard}
                </button>
              </div>

              {selected?.id === rc.id && (
                <div className="mt-4 border-t border-slate-200 pt-4">
                  <div className="flex justify-end mb-2">
                    <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600">
                      <X size={18} />
                    </button>
                  </div>
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <PrintableReportCard rc={rc} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

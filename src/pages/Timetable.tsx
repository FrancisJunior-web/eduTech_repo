import { useState } from 'react';
import { Save, CheckCircle, X, Pencil, Plus, RotateCcw, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { classes, subjects, teachers } from '../data/mockData';
import { useLanguage } from '../i18n/LanguageContext';

// ── Types ────────────────────────────────────────────────────────
type Cell = { subject: string; teacherName: string; room: string };
type DayGrid = Record<string, Cell | null>;          // periodKey → Cell
type ClassGrid = Record<string, DayGrid>;             // day       → DayGrid
type AllGrids  = Record<string, ClassGrid>;           // classId   → ClassGrid

type Editing = {
  day: string; dayLabel: string;
  periodKey: string; periodLabel: string;
  classId: string;
};

// ── Constants ────────────────────────────────────────────────────
const DAYS_EN = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const;

const PERIODS = [
  { key: 'p1',    label: 'P1', time: '07:30 – 08:10', isBreak: false },
  { key: 'p2',    label: 'P2', time: '08:10 – 08:50', isBreak: false },
  { key: 'break', label: '',   time: '08:50 – 09:10', isBreak: true  },
  { key: 'p3',    label: 'P3', time: '09:10 – 09:50', isBreak: false },
  { key: 'p4',    label: 'P4', time: '09:50 – 10:30', isBreak: false },
  { key: 'p5',    label: 'P5', time: '10:30 – 11:10', isBreak: false },
  { key: 'lunch', label: '',   time: '11:10 – 11:50', isBreak: true  },
  { key: 'p6',    label: 'P6', time: '11:50 – 12:30', isBreak: false },
  { key: 'p7',    label: 'P7', time: '12:30 – 13:10', isBreak: false },
] as const;

const TEACHING_PERIODS = PERIODS.filter(p => !p.isBreak);

// Subject → color
const SUBJECT_COLORS: Record<string, string> = {
  'English Language':   'bg-blue-100   text-blue-700   border-blue-200',
  'Mathematics':        'bg-green-100  text-green-700  border-green-200',
  'General Science':    'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Social Studies':     'bg-orange-100 text-orange-700 border-orange-200',
  'Shona':              'bg-rose-100   text-rose-700   border-rose-200',
  'Religious & Moral':  'bg-purple-100 text-purple-700 border-purple-200',
  'Art & Craft':        'bg-pink-100   text-pink-700   border-pink-200',
  'Physical Education': 'bg-teal-100   text-teal-700   border-teal-200',
};
function cellColor(subject: string) {
  return SUBJECT_COLORS[subject] ?? 'bg-slate-100 text-slate-700 border-slate-200';
}

// Build a fresh empty grid for one class
function emptyGrid(): ClassGrid {
  const g: ClassGrid = {};
  DAYS_EN.forEach(day => { g[day] = {}; TEACHING_PERIODS.forEach(p => { g[day][p.key] = null; }); });
  return g;
}

// Pre-fill a class grid with sample data (subject name only)
function sampleGrid(classIdx: number, classRoom: string): ClassGrid {
  const subs = subjects.map(s => s.name);
  const g: ClassGrid = {};
  DAYS_EN.forEach((day, di) => {
    g[day] = {};
    TEACHING_PERIODS.forEach((p, pi) => {
      g[day][p.key] = {
        subject:     subs[(pi + di + classIdx) % subs.length],
        teacherName: '',
        room:        classRoom,
      };
    });
  });
  return g;
}

// ── Cell Editor Modal ────────────────────────────────────────────
function CellEditorModal({
  editing, current, classRoom, onApply, onClear, onClose,
}: {
  editing: Editing;
  current: Cell | null;
  classRoom: string;
  onApply: (cell: Cell) => void;
  onClear: () => void;
  onClose: () => void;
}) {
  const { t } = useLanguage();
  const [subject,     setSubject]     = useState(current?.subject     ?? '');
  const [teacherName, setTeacherName] = useState(current?.teacherName ?? '');
  const [room,        setRoom]        = useState(current?.room        ?? classRoom);

  const handleApply = () => {
    if (!subject) return;
    onApply({ subject, teacherName, room });
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center">
              <Pencil size={13} className="text-indigo-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-sm">{t.timetable.editPeriod}</p>
              <p className="text-slate-400 text-xs">{editing.dayLabel} · {editing.periodLabel}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
            <X size={16} className="text-slate-500" />
          </button>
        </div>

        {/* Form */}
        <div className="px-5 py-4 space-y-4">

          {/* Subject */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              {t.common.subject}<span className="text-red-500 ml-0.5">*</span>
            </label>
            <select
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full py-2.5 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="">— {t.timetable.selectSubject} —</option>
              {subjects.map(s => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </select>
            {/* Color preview */}
            {subject && (
              <div className={`mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${cellColor(subject)}`}>
                {subject}
              </div>
            )}
          </div>

          {/* Teacher */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">{t.timetable.selectTeacher}</label>
            <select
              value={teacherName}
              onChange={e => setTeacherName(e.target.value)}
              className="w-full py-2.5 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="">— {t.teachers.none} —</option>
              {teachers.filter(tc => tc.isActive).map(tc => (
                <option key={tc.id} value={`${tc.firstName} ${tc.lastName}`}>
                  {tc.firstName} {tc.lastName} ({tc.subjects.join(', ')})
                </option>
              ))}
            </select>
          </div>

          {/* Room */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">{t.classes.room}</label>
            <input
              value={room}
              onChange={e => setRoom(e.target.value)}
              placeholder="e.g. Room 3"
              className="w-full py-2.5 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-200">
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors font-medium"
          >
            <X size={14} /> {t.timetable.clearPeriod}
          </button>
          <div className="flex gap-2">
            <button onClick={onClose}
              className="px-3 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              {t.common.cancel}
            </button>
            <button
              onClick={handleApply}
              disabled={!subject}
              className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-lg font-medium transition-colors"
            >
              {t.timetable.apply}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────
export default function Timetable() {
  const { t, lang } = useLanguage();

  const [classId,   setClassId]  = useState(classes[0].id);
  const [editing,   setEditing]  = useState<Editing | null>(null);
  const [saved,     setSaved]    = useState(false);

  // Per-class grids — lazy-initialised with sample data on first access
  const [allGrids, setAllGrids] = useState<AllGrids>(() => {
    const init: AllGrids = {};
    classes.forEach((cls, i) => { init[cls.id] = sampleGrid(i, cls.room); });
    return init;
  });

  const cls      = classes.find(c => c.id === classId)!;
  const grid     = allGrids[classId] ?? emptyGrid();

  const dayLabels: Record<string, string> = {
    monday: t.common.monday, tuesday: t.common.tuesday, wednesday: t.common.wednesday,
    thursday: t.common.thursday, friday: t.common.friday,
  };

  const periodLabel = (key: string) => {
    const p = PERIODS.find(p => p.key === key);
    if (!p) return key;
    if (p.isBreak) return p.key === 'break' ? t.timetable.break : t.timetable.lunch;
    return `${t.timetable.period} ${p.label.slice(1)}`;
  };

  const handleCellClick = (day: string, periodKey: string) => {
    setEditing({
      day, dayLabel: dayLabels[day],
      periodKey, periodLabel: periodLabel(periodKey),
      classId,
    });
    setSaved(false);
  };

  const applyEdit = (cell: Cell) => {
    if (!editing) return;
    setAllGrids(prev => ({
      ...prev,
      [editing.classId]: {
        ...prev[editing.classId],
        [editing.day]: { ...prev[editing.classId][editing.day], [editing.periodKey]: cell },
      },
    }));
    setEditing(null);
  };

  const clearCell = () => {
    if (!editing) return;
    setAllGrids(prev => ({
      ...prev,
      [editing.classId]: {
        ...prev[editing.classId],
        [editing.day]: { ...prev[editing.classId][editing.day], [editing.periodKey]: null },
      },
    }));
    setEditing(null);
  };

  const handleReset = () => {
    setAllGrids(prev => ({
      ...prev,
      [classId]: sampleGrid(classes.findIndex(c => c.id === classId), cls.room),
    }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDownload = () => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

    // ── Header ──────────────────────────────────────────────────
    doc.setFillColor(49, 46, 129); // indigo-900
    doc.rect(0, 0, 297, 22, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`${t.timetable.weeklyTimetable} — ${cls.name}`, 10, 9);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(termLabel, 10, 16);
    doc.text(`${filledCells}/${totalCells} ${lang === 'fr' ? 'séances remplies' : 'periods filled'}`, 287, 16, { align: 'right' });

    // ── Table rows ──────────────────────────────────────────────
    const head = [[t.timetable.period, t.timetable.time, ...DAYS_EN.map(d => dayLabels[d])]];

    const body = PERIODS.map(period => {
      if (period.isBreak) {
        const lbl = period.key === 'break' ? t.timetable.break : t.timetable.lunch;
        return [{ content: lbl, colSpan: 1 }, period.time, ...DAYS_EN.map(() => ({ content: '—', styles: { textColor: [180, 180, 180] as [number,number,number] } }))];
      }
      return [
        periodLabel(period.key),
        period.time,
        ...DAYS_EN.map(day => {
          const cell = grid[day]?.[period.key];
          if (!cell) return { content: '', styles: { textColor: [200, 200, 200] as [number,number,number] } };
          const lines = [cell.subject];
          if (cell.teacherName) lines.push(cell.teacherName);
          if (cell.room) lines.push(cell.room);
          return { content: lines.join('\n'), styles: { fontStyle: 'normal' as const } };
        }),
      ];
    });

    // ── Palette: map subject → light background ──────────────────
    const SUBJECT_PDF_COLORS: Record<string, [number, number, number]> = {
      'English Language':   [219, 234, 254],
      'Mathematics':        [220, 252, 231],
      'General Science':    [209, 250, 229],
      'Social Studies':     [255, 237, 213],
      'Shona':              [254, 226, 226],
      'Religious & Moral':  [243, 232, 255],
      'Art & Craft':        [252, 231, 243],
      'Physical Education': [204, 251, 241],
    };

    autoTable(doc, {
      head,
      body,
      startY: 26,
      margin: { left: 10, right: 10 },
      styles: {
        fontSize: 8,
        cellPadding: { top: 3, right: 3, bottom: 3, left: 3 },
        valign: 'middle',
        overflow: 'linebreak',
        lineColor: [226, 232, 240],
        lineWidth: 0.3,
      },
      headStyles: {
        fillColor: [79, 70, 229],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center',
        fontSize: 8.5,
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 18, halign: 'center', textColor: [51, 65, 85] },
        1: { cellWidth: 26, halign: 'center', textColor: [100, 116, 139] },
      },
      didParseCell(data) {
        if (data.section === 'body') {
          const period = PERIODS[data.row.index];
          if (period?.isBreak) {
            data.cell.styles.fillColor = [248, 250, 252];
            data.cell.styles.textColor = [148, 163, 184];
            data.cell.styles.fontStyle = 'italic';
          } else if (data.column.index >= 2) {
            const day = DAYS_EN[data.column.index - 2];
            const cell = grid[day]?.[period?.key ?? ''];
            if (cell?.subject) {
              const bg = SUBJECT_PDF_COLORS[cell.subject] ?? [241, 245, 249];
              data.cell.styles.fillColor = bg;
              data.cell.styles.textColor = [30, 41, 59];
              data.cell.styles.fontStyle = 'bold';
            }
          }
        }
      },
    });

    // ── Footer ──────────────────────────────────────────────────
    const pageH = doc.internal.pageSize.getHeight();
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.setFont('helvetica', 'normal');
    doc.text(new Date().toLocaleDateString('en-GB'), 10, pageH - 5);
    doc.text(cls.classTeacherName ? `${lang === 'fr' ? 'Prof. principal' : 'Class teacher'}: ${cls.classTeacherName}` : '', 287, pageH - 5, { align: 'right' });

    doc.save(`${cls.name.replace(/\s+/g, '-')}-timetable.pdf`);
  };

  // Count filled / empty cells
  const totalCells = DAYS_EN.length * TEACHING_PERIODS.length;
  const filledCells = DAYS_EN.reduce((n, day) =>
    n + TEACHING_PERIODS.filter(p => grid[day]?.[p.key] != null).length, 0);

  const termLabel = lang === 'fr' ? 'Trimestre 2 · 2025/2026' : 'Term 2 · 2025/2026';

  return (
    <div className="space-y-4">

      {/* ── Top bar ─────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <select
            value={classId}
            onChange={e => { setClassId(e.target.value); setSaved(false); }}
            className="py-2 px-3 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <span className="text-slate-500 text-sm">{termLabel}</span>
          <span className="text-slate-400 text-xs bg-slate-100 px-2 py-1 rounded-lg">
            {filledCells}/{totalCells} {lang === 'fr' ? 'séances' : 'periods filled'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-500 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Download size={13} /> {t.timetable.downloadTimetable}
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-500 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 transition-colors"
          >
            <RotateCcw size={13} /> {t.timetable.resetAll}
          </button>
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              saved
                ? 'bg-green-500 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {saved ? <CheckCircle size={14} /> : <Save size={14} />}
            {saved ? t.timetable.timetableSaved : t.timetable.saveTimetable}
          </button>
        </div>
      </div>

      {/* ── Legend ──────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-slate-400">{lang === 'fr' ? 'Matières :' : 'Subjects:'}</span>
        {subjects.map(s => (
          <span key={s.id} className={`text-xs px-2 py-0.5 rounded border font-medium ${cellColor(s.name)}`}>
            {s.name}
          </span>
        ))}
      </div>

      {/* ── Timetable grid ──────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">
            {t.timetable.weeklyTimetable} — {cls.name}
          </h3>
          <p className="text-xs text-slate-400">
            {lang === 'fr' ? 'Cliquer sur une cellule pour modifier' : 'Click any cell to edit'}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-800 text-white">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide w-24">
                  {t.timetable.period}
                </th>
                <th className="text-left px-3 py-3 text-xs font-semibold uppercase tracking-wide w-28 text-slate-400">
                  {t.timetable.time}
                </th>
                {DAYS_EN.map(day => (
                  <th key={day} className="text-center px-2 py-3 text-xs font-semibold uppercase tracking-wide">
                    {dayLabels[day]}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {PERIODS.map((period, rowIdx) => {
                if (period.isBreak) {
                  return (
                    <tr key={period.key} className="bg-slate-50">
                      <td className="px-4 py-2 text-xs text-slate-400 italic font-medium">
                        {period.key === 'break' ? t.timetable.break : t.timetable.lunch}
                      </td>
                      <td className="px-3 py-2 text-xs text-slate-300 whitespace-nowrap">{period.time}</td>
                      {DAYS_EN.map(day => (
                        <td key={day} className="px-2 py-2 text-center">
                          <span className="text-slate-200 text-xs">—</span>
                        </td>
                      ))}
                    </tr>
                  );
                }

                return (
                  <tr key={period.key} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}>
                    <td className="px-4 py-2 font-semibold text-slate-600 text-sm">
                      {periodLabel(period.key)}
                    </td>
                    <td className="px-3 py-2 text-slate-400 text-xs whitespace-nowrap">{period.time}</td>

                    {DAYS_EN.map(day => {
                      const cell = grid[day]?.[period.key] ?? null;
                      return (
                        <td key={day} className="px-2 py-2 text-center">
                          <button
                            onClick={() => handleCellClick(day, period.key)}
                            className="w-full min-h-[52px] rounded-xl border transition-all group relative"
                            style={{ padding: '6px 8px' }}
                            title={lang === 'fr' ? 'Cliquer pour modifier' : 'Click to edit'}
                          >
                            {cell ? (
                              // Filled cell
                              <div className={`rounded-lg px-2 py-1.5 border ${cellColor(cell.subject)} h-full`}>
                                <p className="text-xs font-semibold leading-tight truncate">
                                  {cell.subject}
                                </p>
                                {cell.teacherName && (
                                  <p className="text-[10px] opacity-65 leading-tight mt-0.5 truncate">
                                    {cell.teacherName.split(' ').pop()}
                                  </p>
                                )}
                                {cell.room && (
                                  <p className="text-[10px] opacity-50 leading-tight">{cell.room}</p>
                                )}
                                {/* Edit overlay on hover */}
                                <div className="absolute inset-0 rounded-xl bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                  <div className="bg-white rounded-full p-1 shadow-md">
                                    <Pencil size={10} className="text-slate-600" />
                                  </div>
                                </div>
                              </div>
                            ) : (
                              // Empty cell
                              <div className="rounded-xl border-2 border-dashed border-slate-200 group-hover:border-indigo-300 group-hover:bg-indigo-50/50 transition-colors h-full flex items-center justify-center min-h-[44px]">
                                <Plus size={14} className="text-slate-300 group-hover:text-indigo-400 transition-colors" />
                              </div>
                            )}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Cell editor modal ────────────────────────────────── */}
      {editing && (
        <CellEditorModal
          editing={editing}
          current={grid[editing.day]?.[editing.periodKey] ?? null}
          classRoom={cls.room}
          onApply={applyEdit}
          onClear={clearCell}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}

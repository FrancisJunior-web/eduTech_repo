import { useState, useRef } from 'react';
import { Upload, X, CalendarDays, AlertTriangle, CheckCircle2, BookOpen, Trash2, Plus, Pencil, Check } from 'lucide-react';
import { subjects as defaultSubjects } from '../data/mockData';
import type { Subject } from '../types';

interface FeeInstallment {
  label:   string;
  dueDate: string;
  amount:  number;
}

const DEFAULT_INSTALLMENTS: FeeInstallment[] = [
  { label: '', dueDate: '2025-02-15', amount: 25000 },
  { label: '', dueDate: '2025-04-15', amount: 25000 },
  { label: '', dueDate: '2025-06-15', amount: 25000 },
  { label: '', dueDate: '2025-09-15', amount: 25000 },
];

function loadInstallments(): FeeInstallment[] {
  try {
    const s = localStorage.getItem('fee_installments');
    if (s) return JSON.parse(s) as FeeInstallment[];
  } catch { /* ignore */ }
  return DEFAULT_INSTALLMENTS;
}

function loadSubjects(): Subject[] {
  try {
    const s = localStorage.getItem('subjects');
    if (s) return JSON.parse(s) as Subject[];
  } catch { /* ignore */ }
  return defaultSubjects;
}
import { useLanguage } from '../i18n/LanguageContext';
import { useBranding } from '../context/BrandingContext';

export default function Settings() {
  const { t, lang } = useLanguage();
  const { logoUrl, schoolName, schoolSub, schoolInfo, setLogoUrl, setSchoolName, setSchoolSub, setSchoolInfo } = useBranding();
  const lbl = (en: string, fr: string) => lang === 'fr' ? fr : en;

  const [name, setName]         = useState(schoolName);
  const [sub,  setSub]          = useState(schoolSub);
  const [info, setInfo]         = useState(schoolInfo);
  const [installments, setInstallments] = useState<FeeInstallment[]>(loadInstallments);
  const [brandSaved,   setBrandSaved]   = useState(false);
  const [infoSaved,    setInfoSaved]    = useState(false);
  const [gradeSaved,   setGradeSaved]   = useState(false);
  const [feeSaved,     setFeeSaved]     = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Subjects state
  const [subjectList,  setSubjectList]  = useState<Subject[]>(loadSubjects);
  const [subjectSaved, setSubjectSaved] = useState(false);
  const [newSubName,   setNewSubName]   = useState('');
  const [newSubCode,   setNewSubCode]   = useState('');
  const [editingSubId, setEditingSubId] = useState<string | null>(null);
  const [editSubName,  setEditSubName]  = useState('');
  const [editSubCode,  setEditSubCode]  = useState('');

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const max = 256;
        const ratio = Math.min(max / img.width, max / img.height, 1);
        canvas.width  = Math.round(img.width  * ratio);
        canvas.height = Math.round(img.height * ratio);
        canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
        setLogoUrl(canvas.toDataURL('image/webp', 0.85));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const saveBranding = () => {
    setSchoolName(name.trim() || schoolName);
    setSchoolSub(sub.trim());
    setBrandSaved(true);
    setTimeout(() => setBrandSaved(false), 2000);
  };

  const fields: { label: string; key: keyof typeof info; span?: boolean }[] = [
    { label: t.settings.schoolName,  key: 'name'        },
    { label: t.settings.schoolCode,  key: 'code'        },
    { label: t.settings.address,     key: 'address',     span: true },
    { label: t.settings.phone,       key: 'phone'       },
    { label: t.settings.email,       key: 'email'       },
    { label: t.settings.headTeacher, key: 'headTeacher' },
    { label: t.settings.motto,       key: 'motto',       span: true },
  ];

  const saveSubjects = (list: Subject[]) => {
    localStorage.setItem('subjects', JSON.stringify(list));
    setSubjectList(list);
    setSubjectSaved(true);
    setTimeout(() => setSubjectSaved(false), 2000);
  };

  const addSubject = () => {
    const name = newSubName.trim();
    const code = newSubCode.trim().toUpperCase();
    if (!name || !code) return;
    const next: Subject[] = [
      ...subjectList,
      { id: `sub${Date.now()}`, name, code },
    ];
    saveSubjects(next);
    setNewSubName('');
    setNewSubCode('');
  };

  const deleteSubject = (id: string) => saveSubjects(subjectList.filter(s => s.id !== id));

  const startEdit = (s: Subject) => {
    setEditingSubId(s.id);
    setEditSubName(s.name);
    setEditSubCode(s.code);
  };

  const commitEdit = () => {
    if (!editingSubId) return;
    saveSubjects(subjectList.map(s =>
      s.id === editingSubId
        ? { ...s, name: editSubName.trim() || s.name, code: editSubCode.trim().toUpperCase() || s.code }
        : s
    ));
    setEditingSubId(null);
  };

  const gradingScale = [
    { grade: 'A+', min: 90, max: 100, remarkEn: 'Excellent',     remarkFr: 'Excellent'   },
    { grade: 'A',  min: 80, max: 89,  remarkEn: 'Very Good',     remarkFr: 'Très bien'   },
    { grade: 'B',  min: 70, max: 79,  remarkEn: 'Good',          remarkFr: 'Bien'        },
    { grade: 'C',  min: 60, max: 69,  remarkEn: 'Average',       remarkFr: 'Assez bien'  },
    { grade: 'D',  min: 50, max: 59,  remarkEn: 'Below Average', remarkFr: 'Insuffisant' },
    { grade: 'F',  min: 0,  max: 49,  remarkEn: 'Fail',          remarkFr: 'Échec'       },
  ];

  return (
    <div className="space-y-6">

      {/* ── Top row: Branding + School Info ───────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* Branding */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col">
          <h3 className="font-semibold text-slate-800 mb-5">
            {lbl('Application Branding', "Identité de l'application")}
          </h3>

          {/* Upload zone */}
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => {
              e.preventDefault(); setDragging(false);
              const f = e.dataTransfer.files[0];
              if (f) handleFile(f);
            }}
            className={`relative mx-auto w-32 h-32 rounded-2xl border-2 border-dashed cursor-pointer flex items-center justify-center overflow-hidden transition-colors mb-1 ${
              dragging
                ? 'border-indigo-400 bg-indigo-50'
                : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
            }`}
          >
            {logoUrl ? (
              <>
                <img src={logoUrl} alt="logo" className="w-full h-full object-contain p-1" />
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                  <Upload size={18} className="text-white" />
                  <span className="text-white text-xs">{lbl('Change', 'Changer')}</span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-400 px-3 text-center">
                <Upload size={22} />
                <span className="text-xs leading-snug">
                  {lbl('Click or drag\nto upload logo', 'Cliquer ou\nglisser logo')}
                </span>
              </div>
            )}
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
              e.target.value = '';
            }}
          />

          {logoUrl ? (
            <button
              onClick={() => setLogoUrl(null)}
              className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 mx-auto mb-4 mt-2"
            >
              <X size={11} /> {lbl('Remove logo', 'Supprimer le logo')}
            </button>
          ) : (
            <p className="text-xs text-slate-400 text-center mb-4 mt-2">
              {lbl('PNG, JPG or SVG — max 256px', 'PNG, JPG ou SVG — max 256px')}
            </p>
          )}

          <div className="space-y-3 flex-1">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                {lbl('School name (sidebar)', 'Nom école (barre latérale)')}
                <span className="text-red-500 ml-0.5">*</span>
              </label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full py-2 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                {lbl('Subtitle (sidebar)', 'Sous-titre (barre latérale)')}
              </label>
              <input
                value={sub}
                onChange={e => setSub(e.target.value)}
                className="w-full py-2 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            onClick={saveBranding}
            className="mt-5 w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            {brandSaved ? t.common.saved : t.settings.saveChanges}
          </button>
        </div>

        {/* School Information */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-800 mb-5">{t.settings.schoolInformation}</h3>
          <div className="grid grid-cols-2 gap-4">
            {fields.map(f => (
              <div key={f.key} className={f.span ? 'col-span-2' : ''}>
                <label className="block text-xs font-medium text-slate-500 mb-1">{f.label}</label>
                <input
                  value={info[f.key]}
                  onChange={e => setInfo(prev => ({ ...prev, [f.key]: e.target.value }))}
                  className="w-full py-2 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            ))}
          </div>
          <button
            onClick={() => { setSchoolInfo(info); setInfoSaved(true); setTimeout(() => setInfoSaved(false), 2000); }}
            className="mt-5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            {infoSaved ? t.common.saved : t.settings.saveChanges}
          </button>
        </div>
      </div>

      {/* ── Fee Payment Schedule ──────────────────────────────── */}
      {(() => {
        const total    = installments.reduce((s, i) => s + i.amount, 0);
        const isValid  = total === 100000;
        const today    = new Date().toISOString().split('T')[0];

        const ordinal = (n: number) => {
          if (lang === 'fr') return `${n}${n === 1 ? 'er' : 'e'}`;
          return `${n}${['th','st','nd','rd'][Math.min(n % 10 > 3 || Math.floor(n / 10) % 10 === 1 ? 0 : n % 10, 3)]}`;
        };

        const updateField = <K extends keyof FeeInstallment>(idx: number, key: K, value: FeeInstallment[K]) =>
          setInstallments(prev => prev.map((item, i) => i === idx ? { ...item, [key]: value } : item));

        const saveSchedule = () => {
          localStorage.setItem('fee_installments', JSON.stringify(installments));
          setFeeSaved(true);
          setTimeout(() => setFeeSaved(false), 2000);
        };

        return (
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                <CalendarDays size={16} className="text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">{t.settings.feeSchedule}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{t.settings.feeScheduleHint}</p>
              </div>
            </div>

            <div className="space-y-3">
              {installments.map((inst, idx) => {
                const isOverdue = inst.dueDate && inst.dueDate < today;
                const defaultLabel = `${ordinal(idx + 1)} ${t.settings.installment}`;
                return (
                  <div key={idx} className="grid grid-cols-12 gap-3 items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                    {/* Number badge */}
                    <div className="col-span-1 flex items-center justify-center">
                      <span className="w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                    </div>

                    {/* Label */}
                    <div className="col-span-4">
                      <label className="block text-xs font-medium text-slate-500 mb-1">
                        {lbl('Label', 'Libellé')}
                      </label>
                      <input
                        value={inst.label}
                        onChange={e => updateField(idx, 'label', e.target.value)}
                        placeholder={defaultLabel}
                        className="w-full py-2 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                      />
                    </div>

                    {/* Due date */}
                    <div className="col-span-4">
                      <label className="block text-xs font-medium text-slate-500 mb-1">
                        {t.fees.dueDate}
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={inst.dueDate}
                          onChange={e => updateField(idx, 'dueDate', e.target.value)}
                          className={`w-full py-2 px-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white ${
                            isOverdue ? 'border-orange-300 text-orange-600' : 'border-slate-200'
                          }`}
                        />
                        {isOverdue && (
                          <span className="absolute -top-2 right-2 bg-orange-100 text-orange-600 text-[10px] font-semibold px-1.5 py-0.5 rounded">
                            {lbl('past', 'échu')}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="col-span-3">
                      <label className="block text-xs font-medium text-slate-500 mb-1">
                        {lbl('Amount (FCFA)', 'Montant (FCFA)')}
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={inst.amount}
                        onChange={e => updateField(idx, 'amount', Math.max(0, Number(e.target.value)))}
                        className="w-full py-2 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total row */}
            <div className={`mt-4 flex items-center justify-between px-4 py-3 rounded-xl border ${
              isValid ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'
            }`}>
              <div className="flex items-center gap-2">
                {isValid
                  ? <CheckCircle2 size={16} className="text-green-600" />
                  : <AlertTriangle size={16} className="text-orange-500" />
                }
                <span className={`text-sm font-medium ${isValid ? 'text-green-700' : 'text-orange-600'}`}>
                  {t.settings.totalAmount}: {total.toLocaleString()} FCFA
                  {!isValid && ` — ${(100000 - total).toLocaleString()} FCFA ${total < 100000 ? lbl('missing', 'manquant') : lbl('excess', 'en trop')}`}
                </span>
              </div>
              {isValid && (
                <span className="text-xs text-green-600 font-medium">
                  {lbl('✓ Balanced', '✓ Équilibré')}
                </span>
              )}
            </div>

            <button
              onClick={saveSchedule}
              disabled={!isValid}
              className="mt-5 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              {feeSaved ? t.common.saved : t.settings.saveChanges}
            </button>
          </div>
        );
      })()}

      {/* ── Subjects ──────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
            <BookOpen size={16} className="text-indigo-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">{t.settings.subjects}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{t.settings.subjectsHint}</p>
          </div>
        </div>

        {/* Subject list */}
        <div className="space-y-2 mb-4">
          {subjectList.length === 0 && (
            <p className="text-sm text-slate-400 py-2">{t.settings.noSubjects}</p>
          )}
          {subjectList.map(s => (
            <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              {editingSubId === s.id ? (
                <>
                  <input
                    value={editSubName}
                    onChange={e => setEditSubName(e.target.value)}
                    placeholder={t.settings.subjectName}
                    className="flex-1 py-1.5 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  />
                  <input
                    value={editSubCode}
                    onChange={e => setEditSubCode(e.target.value)}
                    placeholder={t.settings.subjectCode}
                    className="w-28 py-1.5 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white uppercase"
                  />
                  <button
                    onClick={commitEdit}
                    className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title={t.common.save}
                  >
                    <Check size={15} />
                  </button>
                  <button
                    onClick={() => setEditingSubId(null)}
                    className="p-1.5 text-slate-400 hover:bg-slate-200 rounded-lg transition-colors"
                    title={t.common.cancel}
                  >
                    <X size={15} />
                  </button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-sm text-slate-800 font-medium">{s.name}</span>
                  <span className="w-16 text-xs font-mono text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md text-center">{s.code}</span>
                  <button
                    onClick={() => startEdit(s)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title={t.common.edit}
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => deleteSubject(s.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title={t.settings.deleteSubject}
                  >
                    <Trash2 size={14} />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Add new subject */}
        <div className="flex items-center gap-3 p-3 rounded-xl border-2 border-dashed border-slate-200">
          <Plus size={16} className="text-slate-400 shrink-0" />
          <input
            value={newSubName}
            onChange={e => setNewSubName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') addSubject(); }}
            placeholder={t.settings.subjectName}
            className="flex-1 py-1.5 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          />
          <input
            value={newSubCode}
            onChange={e => setNewSubCode(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') addSubject(); }}
            placeholder={t.settings.subjectCode}
            className="w-28 py-1.5 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white uppercase"
          />
          <button
            onClick={addSubject}
            disabled={!newSubName.trim() || !newSubCode.trim()}
            className="shrink-0 flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors"
          >
            <Plus size={14} />
            {t.settings.addSubject}
          </button>
        </div>

        {subjectSaved && (
          <p className="mt-3 text-sm text-green-600 font-medium flex items-center gap-1.5">
            <CheckCircle2 size={15} /> {t.common.saved}
          </p>
        )}
      </div>

      {/* ── Grading Scale ─────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-800 mb-5">{t.settings.gradingScale}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                <th className="text-left px-4 py-2.5 font-medium w-16">{t.assessments.grade}</th>
                <th className="text-left px-4 py-2.5 font-medium w-32">{t.settings.minScore}</th>
                <th className="text-left px-4 py-2.5 font-medium w-32">{t.settings.maxScore}</th>
                <th className="text-left px-4 py-2.5 font-medium">{t.settings.remark}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {gradingScale.map(g => (
                <tr key={g.grade} className="hover:bg-slate-50">
                  <td className="px-4 py-2">
                    <span className="font-bold text-slate-800">{g.grade}</span>
                  </td>
                  <td className="px-4 py-2">
                    <input
                      defaultValue={g.min}
                      type="number"
                      min={0} max={100}
                      className="w-24 py-1.5 px-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      defaultValue={g.max}
                      type="number"
                      min={0} max={100}
                      className="w-24 py-1.5 px-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      defaultValue={lang === 'fr' ? g.remarkFr : g.remarkEn}
                      className="w-full py-1.5 px-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          onClick={() => { setGradeSaved(true); setTimeout(() => setGradeSaved(false), 2000); }}
          className="mt-5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          {gradeSaved ? t.common.saved : t.settings.saveChanges}
        </button>
      </div>
    </div>
  );
}

import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { school } from '../data/mockData';
import { useLanguage } from '../i18n/LanguageContext';
import { useBranding } from '../context/BrandingContext';

export default function Settings() {
  const { t, lang } = useLanguage();
  const { logoUrl, schoolName, schoolSub, setLogoUrl, setSchoolName, setSchoolSub } = useBranding();
  const lbl = (en: string, fr: string) => lang === 'fr' ? fr : en;

  const [name, setName]         = useState(schoolName);
  const [sub,  setSub]          = useState(schoolSub);
  const [brandSaved, setBrandSaved] = useState(false);
  const [infoSaved,  setInfoSaved]  = useState(false);
  const [gradeSaved, setGradeSaved] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

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

  const fields: { label: string; value: string; key: string; span?: boolean }[] = [
    { label: t.settings.schoolName,  value: school.name,        key: 'name'        },
    { label: t.settings.schoolCode,  value: school.code,        key: 'code'        },
    { label: t.settings.address,     value: school.address,     key: 'address',     span: true },
    { label: t.settings.phone,       value: school.phone,       key: 'phone'       },
    { label: t.settings.email,       value: school.email,       key: 'email'       },
    { label: t.settings.headTeacher, value: school.headTeacher, key: 'headTeacher' },
    { label: t.settings.motto,       value: school.motto,       key: 'motto',       span: true },
  ];

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
                  defaultValue={f.value}
                  className="w-full py-2 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            ))}
          </div>
          <button
            onClick={() => { setInfoSaved(true); setTimeout(() => setInfoSaved(false), 2000); }}
            className="mt-5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            {infoSaved ? t.common.saved : t.settings.saveChanges}
          </button>
        </div>
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

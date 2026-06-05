import { useState } from 'react';
import { X, Save, CheckCircle } from 'lucide-react';
import type { Student } from '../../types';
import { classes } from '../../data/mockData';
import { useLanguage } from '../../i18n/LanguageContext';

interface Props {
  student: Student;
  onClose: () => void;
  onSave: (updated: Student) => void;
}

function Field({
  label, value, onChange, type = 'text',
}: {
  label: string; value: string; onChange: (v: string) => void; type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full py-2 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
      />
    </div>
  );
}

export default function StudentEditModal({ student, onClose, onSave }: Props) {
  const { t } = useLanguage();
  const [form, setForm] = useState<Student>({ ...student });
  const [saved, setSaved] = useState(false);

  const update = <K extends keyof Student>(field: K, value: Student[K]) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(form);
    setSaved(true);
    setTimeout(onClose, 900);
  };

  const relationships = ['mother', 'father', 'guardian', 'grandparent', 'sibling', 'other'];

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold
              ${student.gender === 'female' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'}`}>
              {student.firstName[0]}{student.lastName[0]}
            </div>
            <div>
              <h2 className="font-semibold text-slate-800 text-sm">{t.students.editTitle}</h2>
              <p className="text-xs text-slate-400">{student.studentNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
            <X size={17} className="text-slate-500" />
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="overflow-y-auto flex-1 p-5 space-y-4">

          {/* Basic info */}
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="First Name"
              value={form.firstName}
              onChange={v => update('firstName', v)}
            />
            <Field
              label="Last Name"
              value={form.lastName}
              onChange={v => update('lastName', v)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field
              label={t.students.dateOfBirth}
              value={form.dateOfBirth}
              type="date"
              onChange={v => update('dateOfBirth', v)}
            />
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">{t.students.gender}</label>
              <select
                value={form.gender}
                onChange={e => update('gender', e.target.value as Student['gender'])}
                className="w-full py-2 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="male">{t.common.male}</option>
                <option value="female">{t.common.female}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">{t.common.class}</label>
            <select
              value={form.classId}
              onChange={e => {
                const cls = classes.find(c => c.id === e.target.value);
                if (cls) setForm(prev => ({
                  ...prev,
                  classId: cls.id,
                  className: cls.name,
                  gradeLevelName: cls.gradeLevelName,
                }));
              }}
              className="w-full py-2 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <Field
            label={t.students.address}
            value={form.address}
            onChange={v => update('address', v)}
          />

          {/* Active toggle */}
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm font-medium text-slate-700">{t.common.active}</p>
              <p className="text-xs text-slate-400">
                {form.isActive
                  ? (t.common.active)
                  : (t.common.inactive)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => update('isActive', !form.isActive)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${form.isActive ? 'bg-indigo-500' : 'bg-slate-300'}`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${form.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Guardian section */}
          <div className="border-t border-slate-100 pt-4 space-y-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {t.students.guardianInfo}
            </p>
            <Field
              label={`${t.students.guardian} — ${t.common.name}`}
              value={form.guardianName}
              onChange={v => update('guardianName', v)}
            />
            <div className="grid grid-cols-2 gap-4">
              <Field
                label={`${t.students.guardian} — ${t.settings.phone}`}
                value={form.guardianPhone}
                onChange={v => update('guardianPhone', v)}
              />
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">{t.students.relationship}</label>
                <select
                  value={form.guardianRelationship}
                  onChange={e => update('guardianRelationship', e.target.value as Student['guardianRelationship'])}
                  className="w-full py-2 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {relationships.map(r => (
                    <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-slate-200 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            {t.common.cancel}
          </button>
          <button
            onClick={handleSave}
            disabled={saved}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
              saved
                ? 'bg-green-500 text-white cursor-default'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {saved ? <CheckCircle size={14} /> : <Save size={14} />}
            {saved ? t.common.saved : t.common.save}
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Search, Banknote, Plus, Receipt } from 'lucide-react';
import { feeRecords as initialFeeRecords } from '../data/mockData';
import { StatusBadge } from '../composants/ui/Badge';
import type { FeeStatus, FeeRecord, Payment } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import RecordPaymentModal from '../composants/fees/RecordPaymentModal';

export default function Fees() {
  const { t } = useLanguage();
  const [records, setRecords]     = useState<FeeRecord[]>(initialFeeRecords);
  const [search, setSearch]       = useState('');
  const [statusFilter, setStatus] = useState<FeeStatus | ''>('');
  const [selected, setSelected]   = useState<string | null>(null);
  const [payModal, setPayModal]   = useState<{ open: boolean; recordId?: string }>({ open: false });

  const statusFilters: { label: string; value: FeeStatus | '' }[] = [
    { label: t.common.all,     value: ''        },
    { label: t.common.paid,    value: 'paid'    },
    { label: t.common.partial, value: 'partial' },
    { label: t.common.pending, value: 'pending' },
    { label: t.common.overdue, value: 'overdue' },
  ];

  const handlePayment = (recordId: string, payment: Payment) => {
    setRecords(prev => prev.map(r => {
      if (r.id !== recordId) return r;
      const newPaid    = r.amountPaid + payment.amount;
      const newBalance = Math.max(0, r.amountDue - newPaid);
      return {
        ...r,
        amountPaid: newPaid,
        balance:    newBalance,
        status:     newBalance <= 0 ? 'paid' : 'partial',
        payments:   [...r.payments, payment],
      };
    }));
  };

  const filtered = records.filter(f => {
    const matchSearch = `${f.studentName} ${f.studentNumber}`.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter ? f.status === statusFilter : true;
    return matchSearch && matchStatus;
  });

  const totals = {
    due:       records.reduce((s, f) => s + f.amountDue,  0),
    collected: records.reduce((s, f) => s + f.amountPaid, 0),
    balance:   records.reduce((s, f) => s + f.balance,    0),
  };
  const pct = Math.round((totals.collected / totals.due) * 100);
  const selectedRecord = records.find(f => f.id === selected);

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3 mb-1">
            <Banknote size={16} className="text-slate-400" />
            <p className="text-slate-500 text-sm">{t.fees.totalBilled}</p>
          </div>
          <p className="text-2xl font-bold text-slate-800">{totals.due.toLocaleString()} FCFA</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3 mb-1">
            <Banknote size={16} className="text-green-500" />
            <p className="text-slate-500 text-sm">{t.fees.collected}</p>
          </div>
          <p className="text-2xl font-bold text-green-600">{totals.collected.toLocaleString()} FCFA</p>
          <div className="mt-2">
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${pct}%` }} />
            </div>
            <p className="text-xs text-slate-400 mt-1">{pct}{t.fees.collectedPct}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3 mb-1">
            <Banknote size={16} className="text-orange-500" />
            <p className="text-slate-500 text-sm">{t.fees.outstanding}</p>
          </div>
          <p className="text-2xl font-bold text-orange-600">{totals.balance.toLocaleString()} FCFA</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t.students.searchPlaceholder}
              className="pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg w-52 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex gap-1.5">
            {statusFilters.map(f => (
              <button
                key={f.value}
                onClick={() => setStatus(f.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${statusFilter === f.value ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                {f.label}
                <span className="ml-1 text-xs opacity-70">
                  ({f.value === '' ? records.length : records.filter(r => r.status === f.value).length})
                </span>
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={() => setPayModal({ open: true })}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={15} /> {t.fees.recordPayment}
        </button>
      </div>

      <div className="flex gap-5">
        {/* Table */}
        <div className="flex-1 bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                  <th className="text-left px-5 py-3 font-medium">{t.common.name}</th>
                  <th className="text-left px-5 py-3 font-medium">{t.common.class}</th>
                  <th className="text-left px-5 py-3 font-medium">{t.fees.fee}</th>
                  <th className="text-right px-5 py-3 font-medium">{t.fees.billed}</th>
                  <th className="text-right px-5 py-3 font-medium">{t.fees.paid}</th>
                  <th className="text-right px-5 py-3 font-medium">{t.fees.balance}</th>
                  <th className="text-left px-5 py-3 font-medium">{t.common.status}</th>
                  <th className="text-left px-5 py-3 font-medium">{t.fees.dueDate}</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(f => (
                  <tr
                    key={f.id}
                    onClick={() => setSelected(selected === f.id ? null : f.id)}
                    className={`hover:bg-slate-50 cursor-pointer transition-colors ${selected === f.id ? 'bg-indigo-50' : ''}`}
                  >
                    <td className="px-5 py-3">
                      <p className="font-medium text-slate-800">{f.studentName}</p>
                      <p className="text-xs text-slate-400 font-mono">{f.studentNumber}</p>
                    </td>
                    <td className="px-5 py-3">
                      <span className="bg-indigo-50 text-indigo-700 text-xs font-medium px-2 py-0.5 rounded">{f.className}</span>
                    </td>
                    <td className="px-5 py-3 text-slate-600 text-xs">{f.feeName}</td>
                    <td className="px-5 py-3 text-right font-medium text-slate-800">{f.amountDue} FCFA</td>
                    <td className="px-5 py-3 text-right font-medium text-green-600">{f.amountPaid} FCFA</td>
                    <td className={`px-5 py-3 text-right font-bold ${f.balance > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                      {f.balance} FCFA
                    </td>
                    <td className="px-5 py-3"><StatusBadge status={f.status} /></td>
                    <td className="px-5 py-3 text-slate-500 text-xs">{new Date(f.dueDate).toLocaleDateString('en-GB')}</td>
                    <td className="px-5 py-3">
                      <button className="p-1.5 hover:bg-indigo-100 rounded-lg text-indigo-600 transition-colors">
                        <Receipt size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-slate-400">{t.fees.noRecords}</div>
            )}
          </div>
        </div>

        {/* Side panel */}
        {selectedRecord && (
          <div className="w-72 shrink-0 bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-800 mb-1">{selectedRecord.studentName}</h3>
            <p className="text-xs text-slate-400 mb-4">{selectedRecord.studentNumber} · {selectedRecord.className}</p>

            <div className="space-y-2 text-sm mb-4">
              {[
                { label: t.fees.amountDue,  val: `${selectedRecord.amountDue} FCFA`,  color: 'text-slate-800' },
                { label: t.fees.amountPaid, val: `${selectedRecord.amountPaid} FCFA`, color: 'text-green-600' },
                { label: t.fees.balance,    val: `${selectedRecord.balance} FCFA`,    color: selectedRecord.balance > 0 ? 'text-orange-600' : 'text-green-600' },
              ].map(row => (
                <div key={row.label} className="flex justify-between">
                  <span className="text-slate-500">{row.label}</span>
                  <span className={`font-semibold ${row.color}`}>{row.val}</span>
                </div>
              ))}
            </div>

            {selectedRecord.payments.length > 0 && (
              <>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">{t.fees.paymentHistory}</p>
                <div className="space-y-2">
                  {selectedRecord.payments.map(p => (
                    <div key={p.id} className="bg-slate-50 rounded-lg p-2.5 text-xs">
                      <div className="flex justify-between font-medium">
                        <span className="text-slate-700">{p.method}</span>
                        <span className="text-green-600">{p.amount} FCFA</span>
                      </div>
                      <div className="flex justify-between text-slate-400 mt-0.5">
                        <span>{new Date(p.paymentDate).toLocaleDateString('en-GB')}</span>
                        <span>{p.receiptNumber}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {selectedRecord.balance > 0 && (
              <button
                onClick={() => setPayModal({ open: true, recordId: selectedRecord.id })}
                className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 rounded-lg transition-colors"
              >
                {t.fees.recordPayment}
              </button>
            )}
          </div>
        )}
      </div>

      {payModal.open && (
        <RecordPaymentModal
          records={records}
          initialRecordId={payModal.recordId}
          onClose={() => setPayModal({ open: false })}
          onSubmit={handlePayment}
        />
      )}
    </div>
  );
}

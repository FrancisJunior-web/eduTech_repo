import { useState, useRef, useEffect } from 'react';
import {
  MessageCircle, Mic, MicOff, Send, Search, Plus,
  Image as ImageIcon, Users, Phone, MoreVertical,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

type MsgType = 'text' | 'image' | 'voice';

interface Msg {
  id: number;
  author: string;
  initials: string;
  type: MsgType;
  text?: string;
  imageUrl?: string;
  voiceUrl?: string | null;
  voiceDuration?: number;
  time: string;
  mine: boolean;
}

interface Thread {
  id: number;
  title: string;
  tag: string;
  participants: number;
  unread: number;
  preview: string;
}

const tagColor: Record<string, string> = {
  General:  'bg-slate-100 text-slate-600',
  Academic: 'bg-indigo-50 text-indigo-700',
  Events:   'bg-emerald-50 text-emerald-700',
  Admin:    'bg-blue-50 text-blue-700',
};

const THREADS: Thread[] = [
  { id: 1, title: 'General Staff Discussion', tag: 'General',  participants: 12, unread: 3, preview: 'When is the next staff meeting?' },
  { id: 2, title: 'Grade 5 – Maths Support',  tag: 'Academic', participants: 5,  unread: 0, preview: 'Here are the worksheets I mentioned' },
  { id: 3, title: 'Sports Day Planning',       tag: 'Events',   participants: 8,  unread: 1, preview: 'Can everyone confirm their house?' },
  { id: 4, title: 'Parent Updates – June',     tag: 'Admin',    participants: 6,  unread: 0, preview: 'Fees reminder sent to all parents' },
];

const INIT_MSGS: Record<number, Msg[]> = {
  1: [
    { id: 1, author: 'Mrs. Rutendo Zulu',  initials: 'RZ', type: 'text',  text: "Good morning everyone! Don't forget the staff meeting tomorrow at 8 AM.",              time: '08:15', mine: false },
    { id: 2, author: 'You',                initials: 'GM', type: 'text',  text: "Thanks for the reminder! I'll be there.",                                              time: '08:22', mine: true  },
    { id: 3, author: 'Mr. Farai Ncube',    initials: 'FN', type: 'voice', voiceUrl: null, voiceDuration: 12,                                                            time: '09:04', mine: false },
    { id: 4, author: 'Mrs. Chipo Ndlovu', initials: 'CN', type: 'image', imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400',               time: '10:30', mine: false },
    { id: 5, author: 'You',                initials: 'GM', type: 'text',  text: 'When is the next staff meeting after this one?',                                       time: '10:45', mine: true  },
  ],
  2: [
    { id: 1, author: 'Mrs. Tapiwa Dube',  initials: 'TD', type: 'text',  text: "I've prepared some extra worksheets for struggling students.",                         time: '11:00', mine: false },
    { id: 2, author: 'You',               initials: 'GM', type: 'text',  text: 'Great idea! Can you share them here?',                                                  time: '11:05', mine: true  },
    { id: 3, author: 'Mrs. Tapiwa Dube',  initials: 'TD', type: 'image', imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400',                time: '11:08', mine: false },
    { id: 4, author: 'You',               initials: 'GM', type: 'voice', voiceUrl: null, voiceDuration: 6,                                                              time: '11:20', mine: true  },
  ],
  3: [
    { id: 1, author: 'Mr. Blessing Sibanda', initials: 'BS', type: 'text',  text: 'Sports Day is confirmed for 22 June. All teachers please confirm your house team.', time: '14:00', mine: false },
    { id: 2, author: 'You',                  initials: 'GM', type: 'text',  text: 'I am with the Red Eagles!',                                                         time: '14:15', mine: true  },
    { id: 3, author: 'Mr. Blessing Sibanda', initials: 'BS', type: 'voice', voiceUrl: null, voiceDuration: 8,                                                           time: '14:30', mine: false },
  ],
  4: [
    { id: 1, author: 'Mr. Tinashe Moyo', initials: 'TM', type: 'text', text: 'Fee reminders have been sent to all parents via email.',     time: '09:00', mine: false },
    { id: 2, author: 'You',              initials: 'GM', type: 'text', text: "Thank you Tinashe. What's the response rate so far?",        time: '09:10', mine: true  },
  ],
};

// Static waveform for sample voice messages that have no real audio
const WAVE_HEIGHTS = [40, 65, 80, 55, 90, 45, 75, 85, 60, 70, 50, 80, 65, 45, 72, 55, 85, 62, 75, 40];

function Waveform({ mine }: { mine: boolean }) {
  return (
    <div className="flex items-center gap-[2px]" style={{ height: 24 }}>
      {WAVE_HEIGHTS.map((h, i) => (
        <div
          key={i}
          className={`w-[3px] rounded-full ${mine ? 'bg-white opacity-70' : 'bg-indigo-400'}`}
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}

export default function DiscussionForums() {
  const { lang } = useLanguage();
  const lbl = (en: string, fr: string) => lang === 'fr' ? fr : en;

  const [activeThread, setActiveThread] = useState(1);
  const [msgs, setMsgs]     = useState<Record<number, Msg[]>>(INIT_MSGS);
  const [text, setText]     = useState('');
  const [search, setSearch] = useState('');
  const [recording, setRecording] = useState(false);
  const [recSeconds, setRecSeconds] = useState(0);

  const mediaRef    = useRef<MediaRecorder | null>(null);
  const chunksRef   = useRef<Blob[]>([]);
  const fileRef     = useRef<HTMLInputElement>(null);
  const bottomRef   = useRef<HTMLDivElement>(null);
  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const recStartRef = useRef(0);

  const activeMsgs = msgs[activeThread] ?? [];
  const activeInfo = THREADS.find(t => t.id === activeThread)!;
  const filtered   = THREADS.filter(t => !search || t.title.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMsgs.length]);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const now = () => new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  const appendMsg = (threadId: number, partial: Omit<Msg, 'id' | 'author' | 'initials' | 'time' | 'mine'>) => {
    setMsgs(prev => ({
      ...prev,
      [threadId]: [...(prev[threadId] ?? []), {
        id: Date.now(), author: 'You', initials: 'GM', mine: true, time: now(), ...partial,
      }],
    }));
  };

  const sendText = () => {
    if (!text.trim()) return;
    appendMsg(activeThread, { type: 'text', text: text.trim() });
    setText('');
  };

  const handleImageFile = (file: File) => {
    const threadId = activeThread;
    const reader = new FileReader();
    reader.onload = e => appendMsg(threadId, { type: 'image', imageUrl: e.target?.result as string });
    reader.readAsDataURL(file);
  };

  const startRecording = async () => {
    const threadId = activeThread;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      recStartRef.current = Date.now();

      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        const duration = Math.round((Date.now() - recStartRef.current) / 1000);
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        appendMsg(threadId, { type: 'voice', voiceUrl: URL.createObjectURL(blob), voiceDuration: duration });
        stream.getTracks().forEach(t => t.stop());
        if (timerRef.current) clearInterval(timerRef.current);
        setRecSeconds(0);
      };

      mr.start();
      mediaRef.current = mr;
      setRecording(true);
      timerRef.current = setInterval(() => setRecSeconds(s => s + 1), 1000);
    } catch {
      alert(lbl('Microphone access denied. Please allow access in browser settings.', 'Accès au microphone refusé.'));
    }
  };

  const stopRecording = () => {
    mediaRef.current?.stop();
    setRecording(false);
  };

  return (
    <div
      className="flex rounded-xl border border-slate-200 overflow-hidden bg-white"
      style={{ height: 'calc(100vh - 9rem)' }}
    >
      {/* ── Left: thread list ──────────────────────────────── */}
      <div className="w-72 border-r border-slate-200 flex flex-col shrink-0 bg-slate-50">
        <div className="px-4 py-3 bg-white border-b border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-slate-800 text-sm">{lbl('Forums', 'Forums')}</h2>
            <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
              <Plus size={15} className="text-slate-500" />
            </button>
          </div>
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={lbl('Search forums…', 'Rechercher…')}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filtered.map(thread => (
            <button
              key={thread.id}
              onClick={() => setActiveThread(thread.id)}
              className={`w-full text-left px-4 py-3.5 transition-colors ${
                activeThread === thread.id ? 'bg-indigo-50' : 'hover:bg-white'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  activeThread === thread.id ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-400'
                }`}>
                  <MessageCircle size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className={`text-sm font-medium truncate ${activeThread === thread.id ? 'text-indigo-700' : 'text-slate-800'}`}>
                      {thread.title}
                    </p>
                    {thread.unread > 0 && (
                      <span className="min-w-[18px] h-[18px] bg-indigo-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 shrink-0">
                        {thread.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{thread.preview}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${tagColor[thread.tag]}`}>{thread.tag}</span>
                    <span className="flex items-center gap-0.5 text-[10px] text-slate-400">
                      <Users size={9} /> {thread.participants}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Right: chat area ────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Chat header */}
        <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-3 bg-white shrink-0">
          <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
            <MessageCircle size={16} className="text-indigo-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-800 text-sm leading-tight">{activeInfo.title}</p>
            <p className="text-xs text-slate-400">
              {activeInfo.participants} {lbl('participants', 'participants')} · {activeInfo.tag}
            </p>
          </div>
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <Phone size={16} className="text-slate-500" />
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <MoreVertical size={16} className="text-slate-500" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-slate-50/40">
          {activeMsgs.map(msg => (
            <div key={msg.id} className={`flex gap-2.5 ${msg.mine ? 'flex-row-reverse' : ''}`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 self-end ${
                msg.mine ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {msg.initials}
              </div>

              <div className={`flex flex-col max-w-[65%] ${msg.mine ? 'items-end' : 'items-start'}`}>
                {!msg.mine && (
                  <p className="text-[11px] text-slate-400 mb-1 ml-1">{msg.author}</p>
                )}

                {/* Text bubble */}
                {msg.type === 'text' && (
                  <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words ${
                    msg.mine
                      ? 'bg-indigo-600 text-white rounded-br-sm'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                )}

                {/* Image bubble */}
                {msg.type === 'image' && (
                  <div className={`rounded-2xl overflow-hidden max-w-[240px] shadow-sm ${
                    msg.mine ? 'rounded-br-sm' : 'rounded-bl-sm border border-slate-200'
                  }`}>
                    <img
                      src={msg.imageUrl}
                      alt="shared"
                      className="w-full max-h-52 object-cover block"
                      onError={e => {
                        (e.target as HTMLImageElement).src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='160' fill='%23f1f5f9'%3E%3Crect width='240' height='160'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-size='13'%3EImage%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                )}

                {/* Voice bubble */}
                {msg.type === 'voice' && (
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-sm ${
                    msg.mine
                      ? 'bg-indigo-600 text-white rounded-br-sm'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm'
                  }`}>
                    {msg.voiceUrl ? (
                      /* Real recorded audio */
                      <audio controls src={msg.voiceUrl} style={{ height: 32, width: 200 }} />
                    ) : (
                      /* Sample placeholder */
                      <>
                        <Mic size={15} className="shrink-0 opacity-80" />
                        <Waveform mine={msg.mine} />
                        <span className="text-xs opacity-70 shrink-0 tabular-nums">
                          {msg.voiceDuration}s
                        </span>
                      </>
                    )}
                  </div>
                )}

                <p className="text-[10px] text-slate-400 mt-1 mx-1">{msg.time}</p>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <div className="px-4 py-3 border-t border-slate-100 bg-white shrink-0">
          {recording && (
            <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg mb-2 text-red-600 text-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shrink-0" />
              <span className="flex-1">
                {lbl('Recording', 'Enregistrement')} — {recSeconds}s
              </span>
              <span className="text-xs opacity-70">
                {lbl('tap mic again to send', 'retap pour envoyer')}
              </span>
            </div>
          )}

          <div className="flex items-end gap-2">
            {/* Image upload */}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) handleImageFile(file);
                e.target.value = '';
              }}
            />
            <button
              onClick={() => fileRef.current?.click()}
              title={lbl('Upload image', 'Envoyer une image')}
              className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors shrink-0"
            >
              <ImageIcon size={20} />
            </button>

            {/* Text input */}
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendText(); } }}
              placeholder={lbl('Type a message… (Enter to send, Shift+Enter for new line)', 'Écrire… (Entrée pour envoyer)')}
              rows={1}
              style={{ maxHeight: 112, lineHeight: '1.5' }}
              className="flex-1 resize-none py-2.5 px-3.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 overflow-y-auto"
            />

            {/* Send or mic */}
            {text.trim() ? (
              <button
                onClick={sendText}
                className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors shrink-0"
              >
                <Send size={18} />
              </button>
            ) : (
              <button
                onClick={recording ? stopRecording : startRecording}
                title={recording ? lbl('Stop & send', "Arrêter et envoyer") : lbl('Record voice message', 'Enregistrer un message vocal')}
                className={`p-2.5 rounded-xl transition-colors shrink-0 ${
                  recording
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                {recording ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

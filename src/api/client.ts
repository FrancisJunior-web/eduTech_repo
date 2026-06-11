const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api';

function getToken(): string | null {
  try {
    const stored = localStorage.getItem('auth_user');
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    return parsed.token ?? null;
  } catch {
    return null;
  }
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? `HTTP ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  // ── Auth ─────────────────────────────────────────────────────────
  login:  (email: string, password: string) =>
    request<{ token: string; user: AuthUser }>('POST', '/auth/login', { email, password }),
  me:     () => request<AuthUser>('GET', '/auth/me'),
  logout: () => request<void>('POST', '/auth/logout'),

  // ── Dashboard ────────────────────────────────────────────────────
  dashboard: () => request<DashboardData>('GET', '/dashboard'),

  // ── School ───────────────────────────────────────────────────────
  getSchool:    () => request<School>('GET', '/school'),
  updateSchool: (data: Partial<School>) => request<School>('PUT', '/school', data),

  // ── Academic ─────────────────────────────────────────────────────
  getYears:    () => request<AcademicYear[]>('GET', '/academic/years'),
  getTerms:    (academic_year_id?: string) =>
    request<Term[]>('GET', `/academic/terms${academic_year_id ? `?academic_year_id=${academic_year_id}` : ''}`),
  getGradeLevels: () => request<GradeLevel[]>('GET', '/academic/grade-levels'),

  // ── Subjects ─────────────────────────────────────────────────────
  getSubjects:    () => request<Subject[]>('GET', '/subjects'),
  createSubject:  (data: Partial<Subject>) => request<Subject>('POST', '/subjects', data),
  updateSubject:  (id: string, data: Partial<Subject>) => request<Subject>('PUT', `/subjects/${id}`, data),
  deleteSubject:  (id: string) => request<void>('DELETE', `/subjects/${id}`),

  // ── Teachers ─────────────────────────────────────────────────────
  getTeachers:   (params?: Record<string, string>) =>
    request<Teacher[]>('GET', `/teachers${toQS(params)}`),
  getTeacher:    (id: string) => request<Teacher>('GET', `/teachers/${id}`),
  createTeacher: (data: Partial<Teacher>) => request<Teacher>('POST', '/teachers', data),
  updateTeacher: (id: string, data: Partial<Teacher>) => request<Teacher>('PUT', `/teachers/${id}`, data),
  deleteTeacher: (id: string) => request<void>('DELETE', `/teachers/${id}`),

  // ── Classes ──────────────────────────────────────────────────────
  getClasses:      (params?: Record<string, string>) =>
    request<ClassRecord[]>('GET', `/classes${toQS(params)}`),
  getClass:        (id: string) => request<ClassRecord>('GET', `/classes/${id}`),
  getClassStudents:(id: string) => request<Student[]>('GET', `/classes/${id}/students`),
  createClass:     (data: Partial<ClassRecord>) => request<ClassRecord>('POST', '/classes', data),
  updateClass:     (id: string, data: Partial<ClassRecord>) => request<ClassRecord>('PUT', `/classes/${id}`, data),
  deleteClass:     (id: string) => request<void>('DELETE', `/classes/${id}`),

  // ── Students ─────────────────────────────────────────────────────
  getStudents:   (params?: Record<string, string>) =>
    request<Student[]>('GET', `/students${toQS(params)}`),
  getStudent:    (id: string) => request<Student>('GET', `/students/${id}`),
  createStudent: (data: Partial<Student>) => request<Student>('POST', '/students', data),
  updateStudent: (id: string, data: Partial<Student>) => request<Student>('PUT', `/students/${id}`, data),
  deleteStudent: (id: string) => request<void>('DELETE', `/students/${id}`),

  // ── Parents ──────────────────────────────────────────────────────
  getParents:   (params?: Record<string, string>) =>
    request<Parent[]>('GET', `/parents${toQS(params)}`),
  getParent:    (id: string) => request<Parent>('GET', `/parents/${id}`),
  createParent: (data: Partial<Parent>) => request<Parent>('POST', '/parents', data),
  updateParent: (id: string, data: Partial<Parent>) => request<Parent>('PUT', `/parents/${id}`, data),
  deleteParent: (id: string) => request<void>('DELETE', `/parents/${id}`),

  // ── Attendance ───────────────────────────────────────────────────
  getAttendance:      (params?: Record<string, string>) =>
    request<AttendanceRecord[]>('GET', `/attendance${toQS(params)}`),
  saveAttendance:     (records: Partial<AttendanceRecord>[]) =>
    request<{ saved: number }>('POST', '/attendance', records),
  getAttendanceStats: (classId: string, month: string) =>
    request<AttendanceStat[]>('GET', `/attendance/stats?classId=${classId}&month=${month}`),
  getTeacherAttendance:(params?: Record<string, string>) =>
    request<TeacherAttendanceRecord[]>('GET', `/attendance/teachers${toQS(params)}`),
  saveTeacherAttendance:(records: unknown[]) =>
    request<{ saved: number }>('POST', '/attendance/teachers', records),

  // ── Timetable ────────────────────────────────────────────────────
  getTimetable:   (params?: Record<string, string>) =>
    request<ScheduleEntry[]>('GET', `/timetable${toQS(params)}`),
  createSlot:     (data: Partial<ScheduleEntry>) => request<ScheduleEntry>('POST', '/timetable', data),
  updateSlot:     (id: string, data: Partial<ScheduleEntry>) => request<ScheduleEntry>('PUT', `/timetable/${id}`, data),
  deleteSlot:     (id: string) => request<void>('DELETE', `/timetable/${id}`),

  // ── Marks ────────────────────────────────────────────────────────
  getMarks:    (params?: Record<string, string>) =>
    request<Mark[]>('GET', `/marks${toQS(params)}`),
  saveMarks:   (records: Partial<Mark>[]) =>
    request<{ saved: number }>('POST', '/marks', records),
  updateMark:  (id: string, data: Partial<Mark>) => request<Mark>('PUT', `/marks/${id}`, data),

  // ── Report Cards ─────────────────────────────────────────────────
  getReportCards:       (params?: Record<string, string>) =>
    request<ReportCard[]>('GET', `/report-cards${toQS(params)}`),
  getReportCard:        (id: string) => request<ReportCard>('GET', `/report-cards/${id}`),
  createReportCard:     (data: unknown) => request<ReportCard>('POST', '/report-cards', data),
  updateReportCard:     (id: string, data: unknown) => request<ReportCard>('PUT', `/report-cards/${id}`, data),
  setReportCardStatus:  (id: string, status: string) =>
    request<ReportCard>('PATCH', `/report-cards/${id}/status`, { status }),

  // ── Fees ─────────────────────────────────────────────────────────
  getFees:        (params?: Record<string, string>) =>
    request<FeeRecord[]>('GET', `/fees${toQS(params)}`),
  getFeesSummary: (academicYear?: string) =>
    request<FeesSummary>('GET', `/fees/summary${academicYear ? `?academicYear=${academicYear}` : ''}`),
  getFee:         (id: string) => request<FeeRecord>('GET', `/fees/${id}`),
  createFee:      (data: Partial<FeeRecord>) => request<FeeRecord>('POST', '/fees', data),
  updateFee:      (id: string, data: Partial<FeeRecord>) => request<FeeRecord>('PUT', `/fees/${id}`, data),
  addPayment:     (feeId: string, payment: Partial<Payment>) =>
    request<FeeRecord>('POST', `/fees/${feeId}/payments`, payment),

  // ── Payroll ──────────────────────────────────────────────────────
  getPayroll:       (month: string) =>
    request<PayrollRecord[]>('GET', `/payroll?month=${month}`),
  getTeacherPayroll:(teacherId: string, month: string) =>
    request<PayrollRecord>('GET', `/payroll/${teacherId}?month=${month}`),
  updatePayroll:    (teacherId: string, month: string, data: Partial<PayrollRecord>) =>
    request<PayrollRecord>('PUT', `/payroll/${teacherId}/${month}`, data),
  setPayrollStatus: (teacherId: string, month: string, status: string) =>
    request<PayrollRecord>('PATCH', `/payroll/${teacherId}/${month}/status`, { status }),
  bulkPayrollStatus:(month: string, fromStatus: string, toStatus: string) =>
    request<{ updated: number }>('PATCH', `/payroll/${month}/bulk-status`, { fromStatus, toStatus }),

  // ── Announcements ────────────────────────────────────────────────
  getAnnouncements:   (params?: Record<string, string>) =>
    request<Announcement[]>('GET', `/announcements${toQS(params)}`),
  createAnnouncement: (data: Partial<Announcement>) =>
    request<Announcement>('POST', '/announcements', data),
  updateAnnouncement: (id: string, data: Partial<Announcement>) =>
    request<Announcement>('PUT', `/announcements/${id}`, data),
  deleteAnnouncement: (id: string) => request<void>('DELETE', `/announcements/${id}`),

  // ── Email Alerts ─────────────────────────────────────────────────
  getEmailAlerts:  (params?: Record<string, string>) =>
    request<EmailAlert[]>('GET', `/email-alerts${toQS(params)}`),
  sendEmailAlert:  (data: Partial<EmailAlert>) =>
    request<EmailAlert>('POST', '/email-alerts', data),
  deleteEmailAlert:(id: string) => request<void>('DELETE', `/email-alerts/${id}`),

  // ── Forums ───────────────────────────────────────────────────────
  getThreads:      (params?: Record<string, string>) =>
    request<ForumThread[]>('GET', `/forums/threads${toQS(params)}`),
  createThread:    (data: { title: string; tag?: string }) =>
    request<ForumThread>('POST', '/forums/threads', data),
  deleteThread:    (id: string) => request<void>('DELETE', `/forums/threads/${id}`),
  getMessages:     (threadId: string) =>
    request<ForumMessage[]>('GET', `/forums/threads/${threadId}/messages`),
  sendMessage:     (threadId: string, data: Partial<ForumMessage>) =>
    request<ForumMessage>('POST', `/forums/threads/${threadId}/messages`, data),
  deleteMessage:   (threadId: string, msgId: string) =>
    request<void>('DELETE', `/forums/threads/${threadId}/messages/${msgId}`),
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function toQS(params?: Record<string, string>): string {
  if (!params) return '';
  const q = new URLSearchParams(params).toString();
  return q ? `?${q}` : '';
}

// ── Minimal type stubs (mirrors existing types + API shapes) ─────────────────
export interface AuthUser { id: string; name: string; email: string; role: string; initials: string; teacher_id?: string; }
export interface School { id: string; name: string; code: string; address: string; phone: string; email: string; head_teacher: string; motto: string; logo_url?: string; }
export interface AcademicYear { id: string; label: string; start_date: string; end_date: string; is_current: number; }
export interface Term { id: string; academic_year_id: string; name: string; start_date: string; end_date: string; is_current: number; }
export interface GradeLevel { id: string; name: string; sort_order: number; }
export interface Subject { id: string; name: string; code: string; }
export interface Teacher { id: string; first_name: string; last_name: string; email: string; phone: string; gender: string; subjects: string[]; class_assigned?: string; qualification: string; join_date: string; is_active: number; }
export interface ClassRecord { id: string; grade_level_id: string; grade_level_name: string; name: string; capacity: number; room: string; class_teacher_id?: string; class_teacher_name?: string; enrolled: number; }
export interface Student { id: string; student_number: string; first_name: string; last_name: string; date_of_birth: string; gender: string; class_id: string; class_name: string; grade_level_name: string; guardian_name: string; guardian_phone: string; guardian_relationship: string; admission_date: string; is_active: number; address: string; }
export interface Parent { id: string; name: string; email?: string; phone: string; relationship?: string; address?: string; occupation?: string; children?: Student[]; }
export interface AttendanceRecord { id: string; student_id: string; student_name: string; student_number: string; class_id: string; class_name: string; date: string; status: string; remarks?: string; }
export interface AttendanceStat { student_id: string; student_name: string; present: number; absent: number; late: number; excused: number; total: number; }
export interface TeacherAttendanceRecord { id: string; teacher_id: string; date: string; status: string; remarks?: string; first_name: string; last_name: string; }
export interface ScheduleEntry { id: string; teacher_id: string; day: string; period_key: string; period_label: string; time: string; class_id: string; class_name: string; subject_name: string; room: string; first_name?: string; last_name?: string; }
export interface Mark { id: string; student_id: string; student_name: string; subject_id: string; subject_name: string; term_id: string; class_id: string; ca_score: number; exam_score: number; total_score: number; grade: string; remark: string; }
export interface ReportCard { id: string; student_id: string; student_name: string; term_name: string; academic_year: string; class_name: string; percentage: number; class_position: number; status: string; conduct: string; entries: ReportCardEntry[]; }
export interface ReportCardEntry { subject_id: string; subject_name: string; ca_score: number; exam_score: number; total_score: number; grade: string; position?: number; teacher_comment?: string; }
export interface Payment { id: string; fee_record_id: string; amount: number; method: string; reference: string; payment_date: string; receipt_number: string; }
export interface FeeRecord { id: string; student_id: string; student_name: string; student_number: string; class_id: string; class_name: string; fee_name: string; academic_year: string; amount_due: number; amount_paid: number; balance: number; status: string; due_date: string; payments: Payment[]; }
export interface FeesSummary { total_due: number; total_collected: number; total_pending: number; paid_count: number; partial_count: number; overdue_count: number; total_records: number; }
export interface PayrollRecord { id: string; teacher_id: string; month: string; hourly_rate: number; contracted_hours: number; base_allowance: number; absence_deduction: number; late_deduction: number; hours_worked: number; absences: number; late_coming: number; bonus: number; notes: string; status: string; gross: number; absenceDeduct: number; lateDeduct: number; totalDeductions: number; netPay: number; teacher?: Teacher; }
export interface Announcement { id: string; title: string; body: string; author: string; audience: string; is_pinned: number; created_at: string; }
export interface EmailAlert { id: string; subject: string; body: string; recipient: string; sender: string; status: string; sent_at: string; }
export interface ForumThread { id: string; title: string; tag: string; author: string; is_pinned: number; message_count: number; created_at: string; updated_at: string; }
export interface ForumMessage { id: string; thread_id: string; author: string; type: string; content?: string; image_url?: string; voice_url?: string; voice_duration?: number; created_at: string; }
export interface DashboardData { totalStudents: number; totalTeachers: number; totalClasses: number; presentToday: number; absentToday: number; attendanceRate: number; feesCollected: number; feesPending: number; feesTotal: number; recentAnnouncements: Announcement[]; classSizes: { name: string; enrolled: number; capacity: number }[]; feesByStatus: { status: string; count: number; total_balance: number }[]; }

import type {
  School, AcademicYear, Term, GradeLevel, Class,
  Subject, Student, Teacher, AttendanceRecord, Mark,
  ReportCard, FeeRecord, DashboardStats,
  TeacherAttendance, TeacherScheduleEntry,
} from '../types';

export const school: School = {
  id: 's1',
  name: 'Bright Stars Primary School',
  code: 'BSPS-001',
  address: '12 Academic Avenue, Harare',
  phone: '+263 242 123 456',
  email: 'info@brightstars.edu',
  headTeacher: 'Mrs. Grace Moyo',
  motto: 'Excellence Through Knowledge',
};

export const academicYears: AcademicYear[] = [
  { id: 'ay1', label: '2025/2026', startDate: '2025-01-15', endDate: '2025-11-28', isCurrent: true },
  { id: 'ay2', label: '2024/2025', startDate: '2024-01-17', endDate: '2024-11-29', isCurrent: false },
];

export const terms: Term[] = [
  { id: 't1', academicYearId: 'ay1', name: 'first',  startDate: '2025-01-15', endDate: '2025-04-11', isCurrent: false },
  { id: 't2', academicYearId: 'ay1', name: 'second', startDate: '2025-05-06', endDate: '2025-08-08', isCurrent: true  },
  { id: 't3', academicYearId: 'ay1', name: 'third',  startDate: '2025-09-09', endDate: '2025-11-28', isCurrent: false },
];

export const gradeLevels: GradeLevel[] = [
  { id: 'gl0', name: 'ECD A',   sortOrder: 0 },
  { id: 'gl1', name: 'ECD B',   sortOrder: 1 },
  { id: 'gl2', name: 'Grade 1', sortOrder: 2 },
  { id: 'gl3', name: 'Grade 2', sortOrder: 3 },
  { id: 'gl4', name: 'Grade 3', sortOrder: 4 },
  { id: 'gl5', name: 'Grade 4', sortOrder: 5 },
  { id: 'gl6', name: 'Grade 5', sortOrder: 6 },
  { id: 'gl7', name: 'Grade 6', sortOrder: 7 },
  { id: 'gl8', name: 'Grade 7', sortOrder: 8 },
];

export const classes: Class[] = [
  { id: 'c1', gradeLevelId: 'gl2', gradeLevelName: 'Grade 1', name: 'Grade 1A', capacity: 35, room: 'Room 1', classTeacherId: 'tc3', classTeacherName: 'Mrs. Chipo Ndlovu',   enrolled: 32 },
  { id: 'c2', gradeLevelId: 'gl2', gradeLevelName: 'Grade 1', name: 'Grade 1B', capacity: 35, room: 'Room 2', classTeacherId: 'tc4', classTeacherName: 'Mr. Tinashe Moyo',     enrolled: 30 },
  { id: 'c3', gradeLevelId: 'gl3', gradeLevelName: 'Grade 2', name: 'Grade 2A', capacity: 38, room: 'Room 3', classTeacherId: 'tc1', classTeacherName: 'Mrs. Rutendo Zulu',     enrolled: 36 },
  { id: 'c4', gradeLevelId: 'gl4', gradeLevelName: 'Grade 3', name: 'Grade 3A', capacity: 40, room: 'Room 4', classTeacherId: 'tc2', classTeacherName: 'Mr. Farai Ncube',       enrolled: 38 },
  { id: 'c5', gradeLevelId: 'gl5', gradeLevelName: 'Grade 4', name: 'Grade 4A', capacity: 40, room: 'Room 5', classTeacherId: 'tc5', classTeacherName: 'Mrs. Tapiwa Dube',      enrolled: 37 },
  { id: 'c6', gradeLevelId: 'gl6', gradeLevelName: 'Grade 5', name: 'Grade 5A', capacity: 40, room: 'Room 6', classTeacherId: 'tc6', classTeacherName: 'Mr. Blessing Sibanda',  enrolled: 35 },
  { id: 'c7', gradeLevelId: 'gl7', gradeLevelName: 'Grade 6', name: 'Grade 6A', capacity: 40, room: 'Room 7', classTeacherId: 'tc6', classTeacherName: 'Mr. Blessing Sibanda',  enrolled: 33 },
  { id: 'c8', gradeLevelId: 'gl8', gradeLevelName: 'Grade 7', name: 'Grade 7A', capacity: 40, room: 'Room 8', classTeacherId: 'tc1', classTeacherName: 'Mrs. Rutendo Zulu',     enrolled: 34 },
];

export const subjects: Subject[] = [
  { id: 'sub1', name: 'English Language',  code: 'ENG' },
  { id: 'sub2', name: 'Mathematics',       code: 'MTH' },
  { id: 'sub3', name: 'General Science',   code: 'SCI' },
  { id: 'sub4', name: 'Social Studies',    code: 'SST' },
  { id: 'sub5', name: 'Shona',             code: 'SHO' },
  { id: 'sub6', name: 'Religious & Moral', code: 'RME' },
  { id: 'sub7', name: 'Art & Craft',       code: 'ART' },
  { id: 'sub8', name: 'Physical Education',code: 'PE'  },
];

export const teachers: Teacher[] = [
  { id: 'tc1', firstName: 'Rutendo',  lastName: 'Zulu',    email: 'r.zulu@bsps.edu',    phone: '+263 77 111 2201', gender: 'female', subjects: ['English Language', 'Social Studies'], classAssigned: 'Grade 2A', qualification: 'B.Ed Primary', joinDate: '2018-01-10', isActive: true },
  { id: 'tc2', firstName: 'Farai',    lastName: 'Ncube',   email: 'f.ncube@bsps.edu',   phone: '+263 77 111 2202', gender: 'male',   subjects: ['Mathematics', 'General Science'],    classAssigned: 'Grade 3A', qualification: 'B.Ed Mathematics', joinDate: '2019-02-01', isActive: true },
  { id: 'tc3', firstName: 'Chipo',    lastName: 'Ndlovu',  email: 'c.ndlovu@bsps.edu',  phone: '+263 77 111 2203', gender: 'female', subjects: ['English Language', 'Shona'],         classAssigned: 'Grade 1A', qualification: 'Diploma in Education', joinDate: '2020-01-15', isActive: true },
  { id: 'tc4', firstName: 'Tinashe',  lastName: 'Moyo',    email: 't.moyo@bsps.edu',    phone: '+263 77 111 2204', gender: 'male',   subjects: ['Mathematics', 'Art & Craft'],        classAssigned: 'Grade 1B', qualification: 'B.Ed Primary', joinDate: '2021-01-10', isActive: true },
  { id: 'tc5', firstName: 'Tapiwa',   lastName: 'Dube',    email: 't.dube@bsps.edu',    phone: '+263 77 111 2205', gender: 'female', subjects: ['General Science', 'Social Studies'], classAssigned: 'Grade 4A', qualification: 'B.Sc Education', joinDate: '2017-01-08', isActive: true },
  { id: 'tc6', firstName: 'Blessing', lastName: 'Sibanda', email: 'b.sibanda@bsps.edu', phone: '+263 77 111 2206', gender: 'male',   subjects: ['Physical Education', 'Art & Craft'], classAssigned: 'Grade 5A', qualification: 'B.Ed Physical Education', joinDate: '2016-02-14', isActive: true },
];

export const students: Student[] = [
  { id: 'st1',  studentNumber: 'BSPS-2025-001', firstName: 'Amara',    lastName: 'Chidziva',  dateOfBirth: '2017-03-14', gender: 'female', classId: 'c1', className: 'Grade 1A', gradeLevelName: 'Grade 1', guardianName: 'Mr. John Chidziva',    guardianPhone: '+263 77 200 0001', guardianRelationship: 'father', admissionDate: '2025-01-15', isActive: true, address: '14 Mbare St' },
  { id: 'st2',  studentNumber: 'BSPS-2025-002', firstName: 'Tafadzwa', lastName: 'Moyo',      dateOfBirth: '2017-06-22', gender: 'male',   classId: 'c1', className: 'Grade 1A', gradeLevelName: 'Grade 1', guardianName: 'Mrs. Alice Moyo',      guardianPhone: '+263 77 200 0002', guardianRelationship: 'mother', admissionDate: '2025-01-15', isActive: true, address: '5 Avondale Rd' },
  { id: 'st3',  studentNumber: 'BSPS-2025-003', firstName: 'Nyasha',   lastName: 'Banda',     dateOfBirth: '2017-11-08', gender: 'female', classId: 'c1', className: 'Grade 1A', gradeLevelName: 'Grade 1', guardianName: 'Mr. Peter Banda',      guardianPhone: '+263 77 200 0003', guardianRelationship: 'father', admissionDate: '2025-01-15', isActive: true, address: '22 Glen View' },
  { id: 'st4',  studentNumber: 'BSPS-2025-004', firstName: 'Tatenda',  lastName: 'Nhamo',     dateOfBirth: '2016-04-17', gender: 'male',   classId: 'c3', className: 'Grade 2A', gradeLevelName: 'Grade 2', guardianName: 'Mrs. Sisi Nhamo',      guardianPhone: '+263 77 200 0004', guardianRelationship: 'mother', admissionDate: '2024-01-17', isActive: true, address: '8 Budiriro' },
  { id: 'st5',  studentNumber: 'BSPS-2025-005', firstName: 'Ruvimbo',  lastName: 'Sithole',   dateOfBirth: '2016-08-30', gender: 'female', classId: 'c3', className: 'Grade 2A', gradeLevelName: 'Grade 2', guardianName: 'Mr. Dan Sithole',      guardianPhone: '+263 77 200 0005', guardianRelationship: 'father', admissionDate: '2024-01-17', isActive: true, address: '3 Waterfalls' },
  { id: 'st6',  studentNumber: 'BSPS-2025-006', firstName: 'Panashe',  lastName: 'Chirwa',    dateOfBirth: '2015-01-05', gender: 'male',   classId: 'c4', className: 'Grade 3A', gradeLevelName: 'Grade 3', guardianName: 'Mrs. Ruth Chirwa',     guardianPhone: '+263 77 200 0006', guardianRelationship: 'mother', admissionDate: '2023-01-18', isActive: true, address: '19 Borrowdale' },
  { id: 'st7',  studentNumber: 'BSPS-2025-007', firstName: 'Tariro',   lastName: 'Mwangi',    dateOfBirth: '2015-05-19', gender: 'female', classId: 'c4', className: 'Grade 3A', gradeLevelName: 'Grade 3', guardianName: 'Mr. Samuel Mwangi',    guardianPhone: '+263 77 200 0007', guardianRelationship: 'father', admissionDate: '2023-01-18', isActive: true, address: '7 Highlands' },
  { id: 'st8',  studentNumber: 'BSPS-2025-008', firstName: 'Simba',    lastName: 'Dlamini',   dateOfBirth: '2014-09-12', gender: 'male',   classId: 'c5', className: 'Grade 4A', gradeLevelName: 'Grade 4', guardianName: 'Mrs. Lindiwe Dlamini', guardianPhone: '+263 77 200 0008', guardianRelationship: 'mother', admissionDate: '2022-01-19', isActive: true, address: '11 Greendale' },
  { id: 'st9',  studentNumber: 'BSPS-2025-009', firstName: 'Chenai',   lastName: 'Mutasa',    dateOfBirth: '2014-12-25', gender: 'female', classId: 'c5', className: 'Grade 4A', gradeLevelName: 'Grade 4', guardianName: 'Mr. Tongesai Mutasa',  guardianPhone: '+263 77 200 0009', guardianRelationship: 'father', admissionDate: '2022-01-19', isActive: true, address: '30 Msasa' },
  { id: 'st10', studentNumber: 'BSPS-2025-010', firstName: 'Takunda',  lastName: 'Gumbo',     dateOfBirth: '2013-02-14', gender: 'male',   classId: 'c6', className: 'Grade 5A', gradeLevelName: 'Grade 5', guardianName: 'Mrs. Flora Gumbo',     guardianPhone: '+263 77 200 0010', guardianRelationship: 'mother', admissionDate: '2021-01-20', isActive: true, address: '2 Eastlea' },
  { id: 'st11', studentNumber: 'BSPS-2025-011', firstName: 'Rutendo',  lastName: 'Chikwanda', dateOfBirth: '2013-07-09', gender: 'female', classId: 'c6', className: 'Grade 5A', gradeLevelName: 'Grade 5', guardianName: 'Mr. Isaac Chikwanda',  guardianPhone: '+263 77 200 0011', guardianRelationship: 'father', admissionDate: '2021-01-20', isActive: true, address: '6 Hatfield' },
  { id: 'st12', studentNumber: 'BSPS-2025-012', firstName: 'Munyaradzi',lastName: 'Hove',     dateOfBirth: '2012-10-01', gender: 'male',   classId: 'c7', className: 'Grade 6A', gradeLevelName: 'Grade 6', guardianName: 'Mrs. Clara Hove',      guardianPhone: '+263 77 200 0012', guardianRelationship: 'mother', admissionDate: '2020-01-15', isActive: true, address: '14 Marlborough' },
  { id: 'st13', studentNumber: 'BSPS-2025-013', firstName: 'Tsitsi',   lastName: 'Mapfumo',   dateOfBirth: '2012-04-18', gender: 'female', classId: 'c7', className: 'Grade 6A', gradeLevelName: 'Grade 6', guardianName: 'Mr. Tafara Mapfumo',   guardianPhone: '+263 77 200 0013', guardianRelationship: 'father', admissionDate: '2020-01-15', isActive: true, address: '9 Belvedere' },
  { id: 'st14', studentNumber: 'BSPS-2025-014', firstName: 'Farai',    lastName: 'Zimba',     dateOfBirth: '2011-08-23', gender: 'male',   classId: 'c8', className: 'Grade 7A', gradeLevelName: 'Grade 7', guardianName: 'Mrs. Rejoice Zimba',   guardianPhone: '+263 77 200 0014', guardianRelationship: 'mother', admissionDate: '2019-01-16', isActive: true, address: '18 Dzivaresekwa' },
  { id: 'st15', studentNumber: 'BSPS-2025-015', firstName: 'Vimbai',   lastName: 'Ncube',     dateOfBirth: '2011-11-30', gender: 'female', classId: 'c8', className: 'Grade 7A', gradeLevelName: 'Grade 7', guardianName: 'Mr. Godfrey Ncube',    guardianPhone: '+263 77 200 0015', guardianRelationship: 'father', admissionDate: '2019-01-16', isActive: true, address: '25 Kuwadzana' },
];

export const attendanceRecords: AttendanceRecord[] = [
  { id: 'at1',  studentId: 'st1',  studentName: 'Amara Chidziva',      studentNumber: 'BSPS-2025-001', classId: 'c1', className: 'Grade 1A', date: '2025-06-04', status: 'present' },
  { id: 'at2',  studentId: 'st2',  studentName: 'Tafadzwa Moyo',       studentNumber: 'BSPS-2025-002', classId: 'c1', className: 'Grade 1A', date: '2025-06-04', status: 'present' },
  { id: 'at3',  studentId: 'st3',  studentName: 'Nyasha Banda',        studentNumber: 'BSPS-2025-003', classId: 'c1', className: 'Grade 1A', date: '2025-06-04', status: 'absent'  },
  { id: 'at4',  studentId: 'st4',  studentName: 'Tatenda Nhamo',       studentNumber: 'BSPS-2025-004', classId: 'c3', className: 'Grade 2A', date: '2025-06-04', status: 'present' },
  { id: 'at5',  studentId: 'st5',  studentName: 'Ruvimbo Sithole',     studentNumber: 'BSPS-2025-005', classId: 'c3', className: 'Grade 2A', date: '2025-06-04', status: 'late'    },
  { id: 'at6',  studentId: 'st6',  studentName: 'Panashe Chirwa',      studentNumber: 'BSPS-2025-006', classId: 'c4', className: 'Grade 3A', date: '2025-06-04', status: 'present' },
  { id: 'at7',  studentId: 'st7',  studentName: 'Tariro Mwangi',       studentNumber: 'BSPS-2025-007', classId: 'c4', className: 'Grade 3A', date: '2025-06-04', status: 'present' },
  { id: 'at8',  studentId: 'st8',  studentName: 'Simba Dlamini',       studentNumber: 'BSPS-2025-008', classId: 'c5', className: 'Grade 4A', date: '2025-06-04', status: 'absent'  },
  { id: 'at9',  studentId: 'st9',  studentName: 'Chenai Mutasa',       studentNumber: 'BSPS-2025-009', classId: 'c5', className: 'Grade 4A', date: '2025-06-04', status: 'present' },
  { id: 'at10', studentId: 'st10', studentName: 'Takunda Gumbo',       studentNumber: 'BSPS-2025-010', classId: 'c6', className: 'Grade 5A', date: '2025-06-04', status: 'present' },
  { id: 'at11', studentId: 'st11', studentName: 'Rutendo Chikwanda',   studentNumber: 'BSPS-2025-011', classId: 'c6', className: 'Grade 5A', date: '2025-06-04', status: 'excused' },
  { id: 'at12', studentId: 'st12', studentName: 'Munyaradzi Hove',     studentNumber: 'BSPS-2025-012', classId: 'c7', className: 'Grade 6A', date: '2025-06-04', status: 'present' },
  { id: 'at13', studentId: 'st13', studentName: 'Tsitsi Mapfumo',      studentNumber: 'BSPS-2025-013', classId: 'c7', className: 'Grade 6A', date: '2025-06-04', status: 'present' },
  { id: 'at14', studentId: 'st14', studentName: 'Farai Zimba',         studentNumber: 'BSPS-2025-014', classId: 'c8', className: 'Grade 7A', date: '2025-06-04', status: 'present' },
  { id: 'at15', studentId: 'st15', studentName: 'Vimbai Ncube',        studentNumber: 'BSPS-2025-015', classId: 'c8', className: 'Grade 7A', date: '2025-06-04', status: 'present' },
];

export const marks: Mark[] = [
  { studentId: 'st6', studentName: 'Panashe Chirwa',  studentNumber: 'BSPS-2025-006', subjectId: 'sub1', subjectName: 'English Language',   caScore: 35, examScore: 52, totalScore: 87, grade: 'A',  remark: 'Excellent' },
  { studentId: 'st6', studentName: 'Panashe Chirwa',  studentNumber: 'BSPS-2025-006', subjectId: 'sub2', subjectName: 'Mathematics',         caScore: 38, examScore: 55, totalScore: 93, grade: 'A+', remark: 'Excellent' },
  { studentId: 'st6', studentName: 'Panashe Chirwa',  studentNumber: 'BSPS-2025-006', subjectId: 'sub3', subjectName: 'General Science',     caScore: 30, examScore: 48, totalScore: 78, grade: 'B',  remark: 'Good' },
  { studentId: 'st6', studentName: 'Panashe Chirwa',  studentNumber: 'BSPS-2025-006', subjectId: 'sub4', subjectName: 'Social Studies',      caScore: 32, examScore: 50, totalScore: 82, grade: 'A',  remark: 'Very Good' },
  { studentId: 'st6', studentName: 'Panashe Chirwa',  studentNumber: 'BSPS-2025-006', subjectId: 'sub5', subjectName: 'Shona',               caScore: 36, examScore: 51, totalScore: 87, grade: 'A',  remark: 'Excellent' },
  { studentId: 'st7', studentName: 'Tariro Mwangi',   studentNumber: 'BSPS-2025-007', subjectId: 'sub1', subjectName: 'English Language',   caScore: 28, examScore: 43, totalScore: 71, grade: 'B',  remark: 'Good' },
  { studentId: 'st7', studentName: 'Tariro Mwangi',   studentNumber: 'BSPS-2025-007', subjectId: 'sub2', subjectName: 'Mathematics',         caScore: 25, examScore: 38, totalScore: 63, grade: 'C',  remark: 'Average' },
  { studentId: 'st7', studentName: 'Tariro Mwangi',   studentNumber: 'BSPS-2025-007', subjectId: 'sub3', subjectName: 'General Science',     caScore: 33, examScore: 49, totalScore: 82, grade: 'A',  remark: 'Very Good' },
  { studentId: 'st7', studentName: 'Tariro Mwangi',   studentNumber: 'BSPS-2025-007', subjectId: 'sub4', subjectName: 'Social Studies',      caScore: 29, examScore: 44, totalScore: 73, grade: 'B',  remark: 'Good' },
  { studentId: 'st7', studentName: 'Tariro Mwangi',   studentNumber: 'BSPS-2025-007', subjectId: 'sub5', subjectName: 'Shona',               caScore: 31, examScore: 46, totalScore: 77, grade: 'B',  remark: 'Good' },
];

export const reportCards: ReportCard[] = [
  {
    id: 'rc1',
    studentId: 'st6',
    studentName: 'Panashe Chirwa',
    studentNumber: 'BSPS-2025-006',
    className: 'Grade 3A',
    gradeLevelName: 'Grade 3',
    termName: 'first',
    academicYear: '2025/2026',
    totalMarksObtained: 427,
    totalMarksPossible: 500,
    percentage: 85.4,
    classPosition: 2,
    outOf: 38,
    daysPresent: 56,
    daysAbsent: 2,
    totalSchoolDays: 58,
    conduct: 'Excellent',
    classTeacherComment: 'Panashe is a dedicated and enthusiastic learner. He participates actively in class and consistently produces quality work. Keep it up!',
    headTeacherComment: 'A commendable performance. Continue to strive for excellence.',
    status: 'published',
    entries: [
      { subjectId: 'sub1', subjectName: 'English Language',   caScore: 35, examScore: 52, totalScore: 87, grade: 'A',  remark: 'Excellent',  position: 3,  teacherComment: 'Excellent reading and comprehension skills.' },
      { subjectId: 'sub2', subjectName: 'Mathematics',         caScore: 38, examScore: 55, totalScore: 93, grade: 'A+', remark: 'Excellent',  position: 1,  teacherComment: 'Outstanding mathematical ability.' },
      { subjectId: 'sub3', subjectName: 'General Science',     caScore: 30, examScore: 48, totalScore: 78, grade: 'B',  remark: 'Good',       position: 8,  teacherComment: 'Good understanding of concepts.' },
      { subjectId: 'sub4', subjectName: 'Social Studies',      caScore: 32, examScore: 50, totalScore: 82, grade: 'A',  remark: 'Very Good',  position: 5,  teacherComment: 'Shows great interest in social topics.' },
      { subjectId: 'sub5', subjectName: 'Shona',               caScore: 36, examScore: 51, totalScore: 87, grade: 'A',  remark: 'Excellent',  position: 2,  teacherComment: 'Excellent spoken and written Shona.' },
    ],
  },
  {
    id: 'rc2',
    studentId: 'st7',
    studentName: 'Tariro Mwangi',
    studentNumber: 'BSPS-2025-007',
    className: 'Grade 3A',
    gradeLevelName: 'Grade 3',
    termName: 'first',
    academicYear: '2025/2026',
    totalMarksObtained: 366,
    totalMarksPossible: 500,
    percentage: 73.2,
    classPosition: 9,
    outOf: 38,
    daysPresent: 54,
    daysAbsent: 4,
    totalSchoolDays: 58,
    conduct: 'Good',
    classTeacherComment: 'Tariro works hard and shows improvement each week. With more practice in Mathematics, she will achieve great results.',
    headTeacherComment: 'A solid effort this term. We look forward to continued progress.',
    status: 'published',
    entries: [
      { subjectId: 'sub1', subjectName: 'English Language',   caScore: 28, examScore: 43, totalScore: 71, grade: 'B', remark: 'Good',    position: 12, teacherComment: 'Adequate comprehension and expression.' },
      { subjectId: 'sub2', subjectName: 'Mathematics',         caScore: 25, examScore: 38, totalScore: 63, grade: 'C', remark: 'Average', position: 20, teacherComment: 'Needs additional practice with problem-solving.' },
      { subjectId: 'sub3', subjectName: 'General Science',     caScore: 33, examScore: 49, totalScore: 82, grade: 'A', remark: 'Very Good', position: 4, teacherComment: 'Very good performance in science experiments.' },
      { subjectId: 'sub4', subjectName: 'Social Studies',      caScore: 29, examScore: 44, totalScore: 73, grade: 'B', remark: 'Good',    position: 11, teacherComment: 'Good effort in social studies discussions.' },
      { subjectId: 'sub5', subjectName: 'Shona',               caScore: 31, examScore: 46, totalScore: 77, grade: 'B', remark: 'Good',    position: 9,  teacherComment: 'Good command of Shona language.' },
    ],
  },
  {
    id: 'rc3',
    studentId: 'st10',
    studentName: 'Takunda Gumbo',
    studentNumber: 'BSPS-2025-010',
    className: 'Grade 5A',
    gradeLevelName: 'Grade 5',
    termName: 'first',
    academicYear: '2025/2026',
    totalMarksObtained: 448,
    totalMarksPossible: 500,
    percentage: 89.6,
    classPosition: 1,
    outOf: 35,
    daysPresent: 57,
    daysAbsent: 1,
    totalSchoolDays: 58,
    conduct: 'Excellent',
    classTeacherComment: 'Takunda is the top student this term. His determination and focus are truly admirable.',
    headTeacherComment: 'Exceptional performance. Keep up the outstanding work!',
    status: 'printed',
    entries: [
      { subjectId: 'sub1', subjectName: 'English Language',   caScore: 37, examScore: 54, totalScore: 91, grade: 'A+', remark: 'Excellent',  position: 1, teacherComment: 'Superb writing and comprehension.' },
      { subjectId: 'sub2', subjectName: 'Mathematics',         caScore: 39, examScore: 56, totalScore: 95, grade: 'A+', remark: 'Excellent',  position: 1, teacherComment: 'Perfect scores in several tests.' },
      { subjectId: 'sub3', subjectName: 'General Science',     caScore: 34, examScore: 52, totalScore: 86, grade: 'A',  remark: 'Excellent',  position: 2, teacherComment: 'Excellent grasp of scientific concepts.' },
      { subjectId: 'sub4', subjectName: 'Social Studies',      caScore: 35, examScore: 51, totalScore: 86, grade: 'A',  remark: 'Excellent',  position: 3, teacherComment: 'Shows a broad understanding of social topics.' },
      { subjectId: 'sub5', subjectName: 'Shona',               caScore: 36, examScore: 54, totalScore: 90, grade: 'A+', remark: 'Excellent',  position: 1, teacherComment: 'Highly proficient in both written and spoken Shona.' },
    ],
  },
];

export const feeRecords: FeeRecord[] = [
  {
    id: 'fr1', studentId: 'st1', studentName: 'Amara Chidziva', studentNumber: 'BSPS-2025-001',
    classId: 'c1', className: 'Grade 1A', feeName: 'Term 1 School Fees 2025',
    academicYear: '2025/2026', amountDue: 100000, amountPaid: 100000, balance: 0,
    status: 'paid', dueDate: '2025-01-31',
    payments: [{ id: 'p1', amount: 100000, method: 'Bank Transfer', reference: 'TXN-2025-001', paymentDate: '2025-01-20', receiptNumber: 'RCP-001' }],
  },
  {
    id: 'fr2', studentId: 'st2', studentName: 'Tafadzwa Moyo', studentNumber: 'BSPS-2025-002',
    classId: 'c1', className: 'Grade 1A', feeName: 'Term 1 School Fees 2025',
    academicYear: '2025/2026', amountDue: 100000, amountPaid: 60000, balance: 40000,
    status: 'partial', dueDate: '2025-01-31',
    payments: [{ id: 'p2', amount: 60000, method: 'Cash', reference: '', paymentDate: '2025-01-25', receiptNumber: 'RCP-002' }],
  },
  {
    id: 'fr3', studentId: 'st4', studentName: 'Tatenda Nhamo', studentNumber: 'BSPS-2025-004',
    classId: 'c3', className: 'Grade 2A', feeName: 'Term 1 School Fees 2025',
    academicYear: '2025/2026', amountDue: 100000, amountPaid: 0, balance: 100000,
    status: 'overdue', dueDate: '2025-01-31',
    payments: [],
  },
  {
    id: 'fr4', studentId: 'st6', studentName: 'Panashe Chirwa', studentNumber: 'BSPS-2025-006',
    classId: 'c4', className: 'Grade 3A', feeName: 'Term 1 School Fees 2025',
    academicYear: '2025/2026', amountDue: 100000, amountPaid: 100000, balance: 0,
    status: 'paid', dueDate: '2025-01-31',
    payments: [{ id: 'p4', amount: 100000, method: 'Mobile Money', reference: 'MM-2025-101', paymentDate: '2025-01-18', receiptNumber: 'RCP-004' }],
  },
  {
    id: 'fr5', studentId: 'st8', studentName: 'Simba Dlamini', studentNumber: 'BSPS-2025-008',
    classId: 'c5', className: 'Grade 4A', feeName: 'Term 1 School Fees 2025',
    academicYear: '2025/2026', amountDue: 100000, amountPaid: 100000, balance: 0,
    status: 'paid', dueDate: '2025-01-31',
    payments: [{ id: 'p5', amount: 100000, method: 'Bank Transfer', reference: 'TXN-2025-005', paymentDate: '2025-01-15', receiptNumber: 'RCP-005' }],
  },
  {
    id: 'fr6', studentId: 'st10', studentName: 'Takunda Gumbo', studentNumber: 'BSPS-2025-010',
    classId: 'c6', className: 'Grade 5A', feeName: 'Term 1 School Fees 2025',
    academicYear: '2025/2026', amountDue: 100000, amountPaid: 75000, balance: 25000,
    status: 'partial', dueDate: '2025-01-31',
    payments: [{ id: 'p6', amount: 75000, method: 'Cash', reference: '', paymentDate: '2025-02-01', receiptNumber: 'RCP-006' }],
  },
  {
    id: 'fr7', studentId: 'st12', studentName: 'Munyaradzi Hove', studentNumber: 'BSPS-2025-012',
    classId: 'c7', className: 'Grade 6A', feeName: 'Term 1 School Fees 2025',
    academicYear: '2025/2026', amountDue: 100000, amountPaid: 0, balance: 100000,
    status: 'pending', dueDate: '2025-05-31',
    payments: [],
  },
  {
    id: 'fr8', studentId: 'st14', studentName: 'Farai Zimba', studentNumber: 'BSPS-2025-014',
    classId: 'c8', className: 'Grade 7A', feeName: 'Term 1 School Fees 2025',
    academicYear: '2025/2026', amountDue: 100000, amountPaid: 100000, balance: 0,
    status: 'paid', dueDate: '2025-01-31',
    payments: [{ id: 'p8', amount: 100000, method: 'Bank Transfer', reference: 'TXN-2025-008', paymentDate: '2025-01-14', receiptNumber: 'RCP-008' }],
  },
];

export const dashboardStats: DashboardStats = {
  totalStudents: 275,
  totalTeachers: 18,
  totalClasses: 8,
  presentToday: 258,
  absentToday: 17,
  attendanceRate: 93.8,
  feesCollected: 535000,
  feesPending: 265000,
  feesTotal: 800000,
};

// ── Teacher attendance (June 2025 working days) ──────────────────
const juneDays = ['2025-06-02','2025-06-03','2025-06-04','2025-06-05','2025-06-06',
                  '2025-06-09','2025-06-10','2025-06-11','2025-06-12','2025-06-13',
                  '2025-06-16','2025-06-17','2025-06-18','2025-06-19','2025-06-20',
                  '2025-06-23','2025-06-24','2025-06-25','2025-06-26','2025-06-27'];

const tcAbsences: Record<string, string[]> = {
  tc1: ['2025-06-10', '2025-06-18'],
  tc2: ['2025-06-05'],
  tc3: ['2025-06-12', '2025-06-13'],
  tc4: [],
  tc5: ['2025-06-20'],
  tc6: ['2025-06-03', '2025-06-25'],
};
const tcLate: Record<string, string[]> = {
  tc1: ['2025-06-16'], tc2: ['2025-06-23'], tc3: ['2025-06-09'],
  tc4: ['2025-06-17'], tc5: ['2025-06-11'], tc6: ['2025-06-19'],
};

export const teacherAttendance: TeacherAttendance[] = Object.keys(tcAbsences).flatMap(tid =>
  juneDays.map((date, i) => ({
    id: `ta-${tid}-${i}`,
    teacherId: tid,
    date,
    status: tcAbsences[tid].includes(date) ? 'absent'
           : tcLate[tid]?.includes(date)   ? 'late'
           : 'present',
  } as TeacherAttendance))
);

// ── Teacher schedule ─────────────────────────────────────────────
export const teacherSchedule: TeacherScheduleEntry[] = [
  // tc1 — Rutendo Zulu — English & Social Studies (Grade 2A + Grade 7A)
  ...([
    ['monday',    'p1','07:30–08:10','c3','Grade 2A','English Language'],
    ['monday',    'p2','08:10–08:50','c3','Grade 2A','Social Studies'],
    ['monday',    'p4','09:50–10:30','c8','Grade 7A','English Language'],
    ['monday',    'p6','11:50–12:30','c8','Grade 7A','Social Studies'],
    ['tuesday',   'p1','07:30–08:10','c3','Grade 2A','English Language'],
    ['tuesday',   'p3','09:10–09:50','c3','Grade 2A','Social Studies'],
    ['tuesday',   'p5','10:30–11:10','c8','Grade 7A','English Language'],
    ['wednesday', 'p2','08:10–08:50','c3','Grade 2A','English Language'],
    ['wednesday', 'p4','09:50–10:30','c8','Grade 7A','Social Studies'],
    ['wednesday', 'p6','11:50–12:30','c3','Grade 2A','Social Studies'],
    ['thursday',  'p1','07:30–08:10','c8','Grade 7A','English Language'],
    ['thursday',  'p3','09:10–09:50','c3','Grade 2A','English Language'],
    ['thursday',  'p7','12:30–13:10','c8','Grade 7A','Social Studies'],
    ['friday',    'p2','08:10–08:50','c3','Grade 2A','Social Studies'],
    ['friday',    'p4','09:50–10:30','c8','Grade 7A','English Language'],
    ['friday',    'p6','11:50–12:30','c3','Grade 2A','English Language'],
  ] as const).map(([day, pk, time, cid, cname, sub], i) => ({
    teacherId: 'tc1', day, periodKey: pk,
    periodLabel: `Period ${pk.slice(1)}`, time,
    classId: cid, className: cname, subjectName: sub,
    room: cid === 'c3' ? 'Room 3' : 'Room 8', id: `ts-tc1-${i}`,
  } as TeacherScheduleEntry & { id: string })),

  // tc2 — Farai Ncube — Mathematics & General Science (Grade 3A + Grade 4A)
  ...([
    ['monday',    'p1','07:30–08:10','c4','Grade 3A','Mathematics'],
    ['monday',    'p3','09:10–09:50','c4','Grade 3A','General Science'],
    ['monday',    'p6','11:50–12:30','c5','Grade 4A','Mathematics'],
    ['tuesday',   'p2','08:10–08:50','c4','Grade 3A','Mathematics'],
    ['tuesday',   'p4','09:50–10:30','c4','Grade 3A','General Science'],
    ['tuesday',   'p7','12:30–13:10','c5','Grade 4A','General Science'],
    ['wednesday', 'p1','07:30–08:10','c4','Grade 3A','General Science'],
    ['wednesday', 'p3','09:10–09:50','c4','Grade 3A','Mathematics'],
    ['wednesday', 'p5','10:30–11:10','c5','Grade 4A','Mathematics'],
    ['thursday',  'p2','08:10–08:50','c4','Grade 3A','Mathematics'],
    ['thursday',  'p4','09:50–10:30','c4','Grade 3A','General Science'],
    ['thursday',  'p6','11:50–12:30','c5','Grade 4A','General Science'],
    ['friday',    'p1','07:30–08:10','c4','Grade 3A','Mathematics'],
    ['friday',    'p5','10:30–11:10','c4','Grade 3A','General Science'],
    ['friday',    'p7','12:30–13:10','c5','Grade 4A','Mathematics'],
  ] as const).map(([day, pk, time, cid, cname, sub]) => ({
    teacherId: 'tc2', day, periodKey: pk,
    periodLabel: `Period ${pk.slice(1)}`, time,
    classId: cid, className: cname, subjectName: sub,
    room: cid === 'c4' ? 'Room 4' : 'Room 5',
  } as TeacherScheduleEntry)),

  // tc3 — Chipo Ndlovu — English & Shona (Grade 1A)
  ...([
    ['monday',    'p1','07:30–08:10','c1','Grade 1A','English Language'],
    ['monday',    'p2','08:10–08:50','c1','Grade 1A','Shona'],
    ['monday',    'p5','10:30–11:10','c1','Grade 1A','English Language'],
    ['tuesday',   'p1','07:30–08:10','c1','Grade 1A','Shona'],
    ['tuesday',   'p3','09:10–09:50','c1','Grade 1A','English Language'],
    ['tuesday',   'p6','11:50–12:30','c1','Grade 1A','Shona'],
    ['wednesday', 'p2','08:10–08:50','c1','Grade 1A','English Language'],
    ['wednesday', 'p4','09:50–10:30','c1','Grade 1A','Shona'],
    ['wednesday', 'p7','12:30–13:10','c1','Grade 1A','English Language'],
    ['thursday',  'p1','07:30–08:10','c1','Grade 1A','English Language'],
    ['thursday',  'p3','09:10–09:50','c1','Grade 1A','Shona'],
    ['friday',    'p2','08:10–08:50','c1','Grade 1A','English Language'],
    ['friday',    'p4','09:50–10:30','c1','Grade 1A','Shona'],
    ['friday',    'p6','11:50–12:30','c1','Grade 1A','English Language'],
  ] as const).map(([day, pk, time, cid, cname, sub]) => ({
    teacherId: 'tc3', day, periodKey: pk,
    periodLabel: `Period ${pk.slice(1)}`, time,
    classId: cid, className: cname, subjectName: sub, room: 'Room 1',
  } as TeacherScheduleEntry)),

  // tc4 — Tinashe Moyo — Mathematics & Art (Grade 1B)
  ...([
    ['monday',    'p1','07:30–08:10','c2','Grade 1B','Mathematics'],
    ['monday',    'p3','09:10–09:50','c2','Grade 1B','Art & Craft'],
    ['monday',    'p6','11:50–12:30','c2','Grade 1B','Mathematics'],
    ['tuesday',   'p2','08:10–08:50','c2','Grade 1B','Mathematics'],
    ['tuesday',   'p5','10:30–11:10','c2','Grade 1B','Art & Craft'],
    ['wednesday', 'p1','07:30–08:10','c2','Grade 1B','Art & Craft'],
    ['wednesday', 'p3','09:10–09:50','c2','Grade 1B','Mathematics'],
    ['wednesday', 'p6','11:50–12:30','c2','Grade 1B','Art & Craft'],
    ['thursday',  'p2','08:10–08:50','c2','Grade 1B','Mathematics'],
    ['thursday',  'p4','09:50–10:30','c2','Grade 1B','Art & Craft'],
    ['friday',    'p1','07:30–08:10','c2','Grade 1B','Mathematics'],
    ['friday',    'p3','09:10–09:50','c2','Grade 1B','Art & Craft'],
    ['friday',    'p5','10:30–11:10','c2','Grade 1B','Mathematics'],
  ] as const).map(([day, pk, time, cid, cname, sub]) => ({
    teacherId: 'tc4', day, periodKey: pk,
    periodLabel: `Period ${pk.slice(1)}`, time,
    classId: cid, className: cname, subjectName: sub, room: 'Room 2',
  } as TeacherScheduleEntry)),

  // tc5 — Tapiwa Dube — Science & Social Studies (Grade 4A)
  ...([
    ['monday',    'p2','08:10–08:50','c5','Grade 4A','General Science'],
    ['monday',    'p4','09:50–10:30','c5','Grade 4A','Social Studies'],
    ['monday',    'p7','12:30–13:10','c5','Grade 4A','General Science'],
    ['tuesday',   'p1','07:30–08:10','c5','Grade 4A','Social Studies'],
    ['tuesday',   'p3','09:10–09:50','c5','Grade 4A','General Science'],
    ['wednesday', 'p2','08:10–08:50','c5','Grade 4A','General Science'],
    ['wednesday', 'p6','11:50–12:30','c5','Grade 4A','Social Studies'],
    ['thursday',  'p1','07:30–08:10','c5','Grade 4A','General Science'],
    ['thursday',  'p5','10:30–11:10','c5','Grade 4A','Social Studies'],
    ['friday',    'p2','08:10–08:50','c5','Grade 4A','General Science'],
    ['friday',    'p4','09:50–10:30','c5','Grade 4A','Social Studies'],
    ['friday',    'p7','12:30–13:10','c5','Grade 4A','General Science'],
  ] as const).map(([day, pk, time, cid, cname, sub]) => ({
    teacherId: 'tc5', day, periodKey: pk,
    periodLabel: `Period ${pk.slice(1)}`, time,
    classId: cid, className: cname, subjectName: sub, room: 'Room 5',
  } as TeacherScheduleEntry)),

  // tc6 — Blessing Sibanda — PE & Art (Grade 5A + Grade 6A)
  ...([
    ['monday',    'p2','08:10–08:50','c6','Grade 5A','Physical Education'],
    ['monday',    'p4','09:50–10:30','c7','Grade 6A','Art & Craft'],
    ['monday',    'p7','12:30–13:10','c6','Grade 5A','Art & Craft'],
    ['tuesday',   'p1','07:30–08:10','c7','Grade 6A','Physical Education'],
    ['tuesday',   'p3','09:10–09:50','c6','Grade 5A','Physical Education'],
    ['tuesday',   'p6','11:50–12:30','c7','Grade 6A','Art & Craft'],
    ['wednesday', 'p2','08:10–08:50','c6','Grade 5A','Art & Craft'],
    ['wednesday', 'p4','09:50–10:30','c7','Grade 6A','Physical Education'],
    ['thursday',  'p1','07:30–08:10','c6','Grade 5A','Physical Education'],
    ['thursday',  'p3','09:10–09:50','c7','Grade 6A','Art & Craft'],
    ['thursday',  'p6','11:50–12:30','c6','Grade 5A','Art & Craft'],
    ['friday',    'p2','08:10–08:50','c7','Grade 6A','Physical Education'],
    ['friday',    'p4','09:50–10:30','c6','Grade 5A','Art & Craft'],
    ['friday',    'p6','11:50–12:30','c7','Grade 6A','Physical Education'],
  ] as const).map(([day, pk, time, cid, cname, sub]) => ({
    teacherId: 'tc6', day, periodKey: pk,
    periodLabel: `Period ${pk.slice(1)}`, time,
    classId: cid, className: cname, subjectName: sub,
    room: cid === 'c6' ? 'Room 6' : 'Room 7',
  } as TeacherScheduleEntry)),
];

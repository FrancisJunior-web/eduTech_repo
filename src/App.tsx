import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './composants/layout/Layout';
import Dashboard   from './pages/Dashboard';
import Students    from './pages/Students';
import Classes     from './pages/Classes';
import Teachers    from './pages/Teachers';
import Attendance  from './pages/Attendance';
import Assessments from './pages/Assessments';
import ReportCards from './pages/ReportCards';
import Fees        from './pages/Fees';
import Timetable   from './pages/Timetable';
import Parents     from './pages/Parents';
import Settings          from './pages/Settings';
import Announcements    from './pages/Announcements';
import EmailAlerts      from './pages/EmailAlerts';
import DiscussionForums from './pages/DiscussionForums';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard"    element={<Dashboard   />} />
          <Route path="students"     element={<Students    />} />
          <Route path="classes"      element={<Classes     />} />
          <Route path="teachers"     element={<Teachers    />} />
          <Route path="attendance"   element={<Attendance  />} />
          <Route path="assessments"  element={<Assessments />} />
          <Route path="report-cards" element={<ReportCards />} />
          <Route path="fees"         element={<Fees        />} />
          <Route path="timetable"    element={<Timetable   />} />
          <Route path="parents"      element={<Parents     />} />
          <Route path="settings"          element={<Settings          />} />
          <Route path="announcements"    element={<Announcements    />} />
          <Route path="email-alerts"     element={<EmailAlerts      />} />
          <Route path="discussion-forums" element={<DiscussionForums />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

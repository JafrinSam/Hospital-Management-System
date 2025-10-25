import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user, logout } = useAuth();

  const linksByRole: Record<string, { name: string; path: string }[]> = {
    SuperAdmin: [
      { name: 'Manage patients', path: '/patient' },
      { name: 'Manage Users', path: '/superadmin/users' },
      { name:'Manage lab', path: '/lab'},
      { name: 'Finance Dashboard', path: '/finance' },
      { name: 'Doctor Dashboard', path: '/doctor' },
      { name: 'Nurse Dashboard', path: '/nurse' },
      { name: 'Pharmacy Dashboard', path: '/pharmacy' },
      { name: "AI Triage Prediction", path: '/ai/triage-prediction' },
    ],
    HospitalAdmin: [
      { name: 'Manage Staff', path: '/hospital/staff' },
      { name: 'View Reports', path: '/hospital/reports' },
    ],
    Doctor: [
      { name: 'My Patients', path: '/doctor/patients' },
      { name: 'Prescriptions', path: '/doctor/prescriptions' },
    ],
    LabTech: [{ name: 'Lab Tests', path: '/lab/tests' }],
  };

  const links = user ? linksByRole[user.role] || [] : [];

  return (
    <div className="bg-white w-64 h-screen p-4 flex flex-col justify-between shadow-lg border-r border-gray-200">
      <div>
        <h2 className="text-2xl font-bold mb-6 text-center text-cyan">
          {user?.role} Panel
        </h2>
        <nav>
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="block py-2 px-3 rounded text-gray-700 hover:bg-gray-100 hover:text-cyan transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>

    </div>
  );
}

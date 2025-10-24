import { useEffect, useState } from 'react';
import api from '../api/axiosClient';
import UserTable from '../components/UserTable';
import HospitalTable from '../components/HospitalTable';

export default function SuperAdminDashboard() {
  const [users, setUsers] = useState([]);
  const [hospitals, setHospitals] = useState([]);

  const fetchUsers = async () => {
    const res = await api.get('/superadmin/users');
    setUsers(res.data);
  };

  const fetchHospitals = async () => {
    const res = await api.get('/superadmin/hospitals');
    setHospitals(res.data);
  };

  useEffect(() => {
    fetchUsers();
    fetchHospitals();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-black">Super Admin Dashboard</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-black">Manage Hospitals</h2>
        <HospitalTable hospitals={hospitals} refresh={fetchHospitals} />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2 text-black">Manage Users</h2>
        <UserTable users={users} refresh={fetchUsers} />
      </div>
    </div>
  );
}

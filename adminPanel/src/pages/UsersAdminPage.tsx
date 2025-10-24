import React, { useEffect, useState } from 'react';
import { Edit, Eye, Trash2 } from 'lucide-react';

type User = { _id: string; name: string; email: string; role: string; phone?: string; status?: string };

function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="bg-secondry_colour p-4 rounded-lg mr-4 flex-1">
      <div className="text-sm text-gray-200">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

export default function UsersAdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [q, setQ] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [editing, setEditing] = useState<User | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // ---- DUMMY DATA ----
  const dummyUsers: User[] = [
    { _id: '1', name: 'Dr. Alice Smith', email: 'alice@karexpert.com', role: 'Doctor', phone: '9876543210', status: 'active' },
    { _id: '2', name: 'John Doe', email: 'john@karexpert.com', role: 'Patient', phone: '9876500001', status: 'active' },
    { _id: '3', name: 'Sarah Johnson', email: 'sarah@karexpert.com', role: 'Nurse', phone: '9876500002', status: 'inactive' },
    { _id: '4', name: 'Michael Lee', email: 'michael@karexpert.com', role: 'HospitalAdmin', phone: '9876500003', status: 'active' },
    { _id: '5', name: 'Raj Patel', email: 'raj@karexpert.com', role: 'LabTech', phone: '9876500004', status: 'active' },
  ];

  useEffect(() => {
    setLoading(true);
    // Simulate fetch
    setTimeout(() => {
      let filtered = dummyUsers.filter(
        (u) =>
          (!q || u.name.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase())) &&
          (!roleFilter || u.role === roleFilter)
      );
      setUsers(filtered);
      setStats({
        totalUsers: dummyUsers.length,
        totalActions: 250,
        avgActionsPerUser: (250 / dummyUsers.length).toFixed(2),
        avgAppointmentsPerDoctor: 15.4,
      });
      setLoading(false);
    }, 500);
  }, [q, roleFilter]);

  const openCreate = () => {
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (u: User) => {
    setEditing(u);
    setShowForm(true);
  };

  const deleteUser = (id: string) => {
    if (!confirm('Delete user?')) return;
    setUsers((prev) => prev.filter((u) => u._id !== id));
  };

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const newUser: User = {
      _id: editing?._id || Math.random().toString(36).substring(2, 8),
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      role: formData.get('role') as string,
      phone: formData.get('phone') as string,
      status: 'active',
    };
    if (editing) {
      setUsers((prev) => prev.map((u) => (u._id === editing._id ? newUser : u)));
    } else {
      setUsers((prev) => [...prev, newUser]);
    }
    setShowForm(false);
  };

  const fetchUserDetails = (id: string) => {
    const u = users.find((u) => u._id === id);
    if (!u) return alert('User not found');
    alert(`User Details:\n\nName: ${u.name}\nEmail: ${u.email}\nRole: ${u.role}\nPhone: ${u.phone}\nStatus: ${u.status}`);
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">User Admin — KareXpert</h1>

      {/* Stats */}
      <div className="flex mb-4 flex-wrap gap-4">
        <StatCard title="Total Users" value={stats?.totalUsers ?? '—'} />
        <StatCard title="Total Actions" value={stats?.totalActions ?? '—'} />
        <StatCard title="Avg Actions / User" value={stats?.avgActionsPerUser ?? '—'} />
        <StatCard title="Avg Appointments / Doctor" value={stats?.avgAppointmentsPerDoctor ?? '—'} />
      </div>

      {/* Filters */}
      <div className="flex items-center mb-4 flex-wrap gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name or email"
          className="p-2 rounded text-white flex-1"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="p-2 rounded bg-cyan text-white"
        >
          <option value="">All roles</option>
          <option>SuperAdmin</option>
          <option>HospitalAdmin</option>
          <option>Doctor</option>
          <option>LabTech</option>
          <option>Nurse</option>
          <option>Receptionist</option>
          <option>Patient</option>
        </select>
        <button onClick={openCreate} className="px-3 py-2 bg-green-600 rounded">
          + Create User
        </button>
      </div>

      {/* Users table */}
      <div className="bg-cyan/90 p-3 rounded-lg">
        <table className="w-full text-left">
          <thead className="text-sm text-white border-b border-gray-700">
            <tr>
              <th className="py-2">Name</th>
              <th className="py-2">Email</th>
              <th className="py-2">Role</th>
              <th className="py-2">Phone</th>
              <th className="py-2">Status</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="py-6 text-center">
                  Loading...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-6 text-center">
                  No users
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u._id} className="border-t border-gray-700 text-sm text-white">
                  <td className="py-2">{u.name}</td>
                  <td className="py-2">{u.email}</td>
                  <td className="py-2">{u.role}</td>
                  <td className="py-2">{u.phone}</td>
                  <td className="py-2">{u.status}</td>
                  <td className="py-2">
                    <button onClick={() => openEdit(u)} className="text-sm bg-blue-600 px-2 py-1 rounded mr-2">
                      <Edit className="w-4 h-4 mr-1"/>
                    </button>
                    <button onClick={() => fetchUserDetails(u._id)} className="text-sm bg-gray-600 px-2 py-1 rounded mr-2">
                      <Eye className="w-4 h-4 mr-1" />
                    </button>
                    <button onClick={() => deleteUser(u._id)} className="text-sm bg-red-600 px-2 py-1 rounded">
                      <Trash2 className="w-4 h-4 mr-1" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-gray-900 p-6 rounded w-[640px]">
            <h3 className="text-xl mb-3">{editing ? 'Edit User' : 'Create User'}</h3>
            <form onSubmit={submitForm}>
              <div className="grid grid-cols-2 gap-3">
                <input name="name" defaultValue={editing?.name} placeholder="Name" className="p-2 rounded bg-gray-800" />
                <input name="email" defaultValue={editing?.email} placeholder="Email" className="p-2 rounded bg-gray-800" />
                <select name="role" defaultValue={editing?.role || 'HospitalAdmin'} className="p-2 rounded bg-gray-800">
                  <option>SuperAdmin</option>
                  <option>HospitalAdmin</option>
                  <option>Doctor</option>
                  <option>LabTech</option>
                  <option>Nurse</option>
                  <option>Receptionist</option>
                  <option>Patient</option>
                </select>
                <input name="phone" defaultValue={editing?.phone} placeholder="Phone" className="p-2 rounded bg-gray-800" />
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-3 py-2 mr-2 bg-gray-600 rounded"
                >
                  Cancel
                </button>
                <button type="submit" className="px-3 py-2 bg-green-600 rounded">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

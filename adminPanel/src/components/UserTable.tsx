import api from '../api/axiosClient';

interface Props {
  users: any[];
  refresh: () => void;
}

export default function UserTable({ users, refresh }: Props) {
  const deleteUser = async (id: string) => {
    if (!confirm('Delete this user?')) return;
    await api.delete(`/superadmin/users/${id}`);
    refresh();
  };

  return (
    <table className="w-full bg-secondry_colour rounded-lg">
      <thead>
        <tr className="text-left border-b border-gray-700">
          <th className="p-2">Name</th>
          <th className="p-2">Email</th>
          <th className="p-2">Role</th>
          <th className="p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u._id} className="border-b border-gray-700">
            <td className="p-2">{u.name}</td>
            <td className="p-2">{u.email}</td>
            <td className="p-2">{u.role}</td>
            <td className="p-2">
              <button
                onClick={() => deleteUser(u._id)}
                className="bg-red-500 px-2 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

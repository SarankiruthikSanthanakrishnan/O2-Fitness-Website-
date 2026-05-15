import { useEffect, useState } from "react";
import { db } from "@/firebase/firebaseConfig";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { Users } from "lucide-react";

export default function UserManagement() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const snapshot = await getDocs(collection(db, "users"));
    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setUsers(list);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateUserStatus = async (userId, newStatus) => {
    try {
      await updateDoc(doc(db, "users", userId), { status: newStatus });
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );
    } catch (err) {
      console.error("Failed to update user status:", err);
      alert("Error updating user status.");
    }
  };

  const statusBadge = (status) => {
    const base = "px-2 py-1 rounded text-sm ";
    switch (status) {
      case "active":
        return (
          <span className={`${base} bg-green-100 text-green-700`}>Active</span>
        );
      case "blocked":
        return (
          <span className={`${base} bg-red-100 text-red-700`}>Blocked</span>
        );
      case "spam":
        return (
          <span className={`${base} bg-yellow-100 text-yellow-700`}>Spam</span>
        );
      default:
        return (
          <span className={`${base} bg-gray-100 text-gray-600`}>{status}</span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Users className="mt-1" />
        <h2 className="text-2xl font-bold"> User Management</h2>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr className="border-b">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
              <th className="p-3">Recent Activity</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{user.name || "—"}</td>
                <td className="p-3">{user.email || "—"}</td>
                <td className="p-3">{statusBadge(user.status)}</td>
                <td className="p-3 space-x-2">
                  {user.status !== "active" && (
                    <button
                      onClick={() => updateUserStatus(user.id, "active")}
                      className="text-green-600 text-sm px-3 py-1 rounded-md hover:bg-green-200 hover:text-green-700 transition"
                    >
                      Active
                    </button>
                  )}
                  {user.status !== "blocked" && (
                    <button
                      onClick={() => updateUserStatus(user.id, "blocked")}
                      className="text-red-600  text-sm px-3 py-1 rounded-md hover:bg-red-200 hover:text-red-700 transition"
                    >
                      Block
                    </button>
                  )}
                  {user.status !== "spam" && (
                    <button
                      onClick={() => updateUserStatus(user.id, "spam")}
                      className="text-yellow-600 text-sm px-3 py-1 rounded-md hover:bg-yellow-200 hover:text-yellow-700 transition"
                    >
                      Spam
                    </button>
                  )}
                </td>
                <td className="p-3 text-xs text-gray-600">
                  {user.activity?.[0]?.action || "—"}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

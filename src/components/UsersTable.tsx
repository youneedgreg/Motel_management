"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function UsersTable() {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({});
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    if (data.success) setUsers(data.data);
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setForm(user);
  };

  const handleDelete = async (id) => {
    const res = await fetch("/api/users", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });

    const data = await res.json();
    if (data.success) {
      toast({ description: "User deleted successfully!" });
      fetchUsers();
    }
  };

  const handleSubmit = async () => {
    const res = await fetch("/api/users", {
      method: "PUT",
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (data.success) {
      toast({ description: "User updated successfully!" });
      fetchUsers();
      setEditUser(null);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <table className="w-full border border-gray-200 rounded">
        <thead>
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Phone</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t">
              <td className="p-2">{user.name}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.phone}</td>
              <td className="p-2 flex space-x-2">
                <Button variant="outline" onClick={() => handleEdit(user)}>
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => handleDelete(user.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Dialog */}
      {editUser && (
        <Dialog open={!!editUser} onOpenChange={() => setEditUser(null)}>
          <DialogContent className="bg-white border border-gray-300 shadow-lg rounded-md p-6">
  <DialogTitle className="text-xl font-bold">Edit User</DialogTitle>
  <DialogDescription className="text-sm text-gray-600">
    Make changes to the user details.
  </DialogDescription>
  <form
    onSubmit={(e) => {
      e.preventDefault();
      handleSubmit();
    }}
    className="space-y-4 mt-4"
  >
    <Input
      value={form.name}
      onChange={(e) => setForm({ ...form, name: e.target.value })}
      placeholder="Name"
      required
    />
    <Input
      value={form.email}
      onChange={(e) => setForm({ ...form, email: e.target.value })}
      placeholder="Email"
      required
    />
    <Input
      value={form.phone}
      onChange={(e) => setForm({ ...form, phone: e.target.value })}
      placeholder="Phone"
      required
    />
    <Input
      value={form.empId}
      onChange={(e) => setForm({ ...form, empId: e.target.value })}
      placeholder="employee id"
      required
    />
    <Input
      value={form.address}
      onChange={(e) => setForm({ ...form, address: e.target.value })}
      placeholder="address"
      required
    />
    <Button className="w-full bg-blue-600 text-white hover:bg-blue-700" type="submit">
      Save
    </Button>
  </form>
</DialogContent>

        </Dialog>
      )}
    </div>
  );
}

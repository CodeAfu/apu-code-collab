"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Pencil,
  Trash2,
  Loader2,
  Search,
  Shield,
  GraduationCap,
  User as UserIcon,
  Unlink
} from "lucide-react";
import { GitHubLogoIcon as Github } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { User, UserRole, AdminUpdateUserPayload } from "./types";
import UserFormModal from "./_components/user-form-modal";
import { toast } from "sonner";

export default function UserAdminPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [search, setSearch] = useState("");

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => (await api.get<User[]>("/api/v1/users/")).data,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: AdminUpdateUserPayload }) => {
      toast.loading("Updating user...");
      return (await api.put<User>(`/api/v1/users/${id}`, data)).data;
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("User updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsModalOpen(false);
      setEditingUser(null);
    },
    onError: () => {
      toast.dismiss();
      toast.error("Failed to update user.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return (await api.delete(`/api/v1/users/${id}`)).data;
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("User deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {
      toast.dismiss();
      toast.error("Failed to delete user.");
    },
  });

  const unlinkGithubMutation = useMutation({
    mutationFn: async (id: string) => {
      toast.loading("Unlinking GitHub account...");
      return (await api.get(`/api/v1/users/${id}/github/unlink`)).data;
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("GitHub account unlinked successfully.");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {
      toast.dismiss();
      toast.error("Failed to unlink GitHub account.");
    },
  });

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleUpdate = (data: AdminUpdateUserPayload) => {
    if (!editingUser) return;
    updateMutation.mutate({ id: editingUser.id, data });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      deleteMutation.mutate(id);
    }
  };

  const handleUnlinkGithub = (user: User) => {
    if (confirm(`Are you sure you want to unlink GitHub account @${user.github_username}?`)) {
      unlinkGithubMutation.mutate(user.id);
    }
  };

  // Filter Logic
  const filteredUsers = users.filter((u) =>
    (u.apu_id || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.first_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.email || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.github_username || "").toLowerCase().includes(search.toLowerCase()) // Added search by GitHub user
  );

  return (
    <main className="p-8 space-y-8 w-full max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage students, teachers, and admins.</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-card max-w-sm">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          placeholder="Search by TP Number, Name, Email or GitHub..."
          className="flex-1 bg-transparent border-none outline-none text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Data Table */}
      <div className="border rounded-xl bg-card overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground gap-2">
            <Search className="h-8 w-8 opacity-20" />
            <p>No users found.</p>
          </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
              <tr>
                <th className="px-6 py-4">Identity</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredUsers.map((user) => {
                const isGithubLinked = !!user.github_access_token;

                return (
                  <tr key={user.id} className="group hover:bg-muted/50 transition-colors">
                    {/* Identity Column */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-foreground">
                          {user.first_name ? `${user.first_name} ${user.last_name || ""}` : "Unnamed User"}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="font-mono bg-muted px-1 rounded">{user.apu_id}</span>
                          <span>{user.email}</span>
                        </div>

                        {/* GitHub Indicator */}
                        {isGithubLinked && (
                          <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                            <Github className="h-3 w-3" />
                            <span className="font-medium text-foreground/80">@{user.github_username}</span>
                            <span className="ml-1 text-[10px] text-secondary-foreground bg-secondary px-1 rounded">
                              Linked
                            </span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Role Column */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {user.role === UserRole.ADMIN && <Shield className="h-4 w-4 text-red-500" />}
                        {user.role === UserRole.TEACHER && <GraduationCap className="h-4 w-4 text-blue-500" />}
                        {user.role === UserRole.STUDENT && <UserIcon className="h-4 w-4 text-green-500" />}
                        <span className="capitalize">{user.role}</span>
                      </div>
                    </td>

                    {/* Status Column */}
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset",
                        user.is_active
                          ? "bg-secondary text-secondary-foreground ring-secondary/20"
                          : "bg-destructive text-destructive-foreground ring-destructive/20"
                      )}>
                        {user.is_active ? "Active" : "Suspended"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">

                        {isGithubLinked && (
                          <button
                            onClick={() => handleUnlinkGithub(user)}
                            disabled={unlinkGithubMutation.isPending}
                            className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-md transition-colors"
                            title="Unlink GitHub Account"
                          >
                            {unlinkGithubMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Unlink className="h-4 w-4" />
                            )}
                          </button>
                        )}

                        <button
                          onClick={() => openEditModal(user)}
                          className="p-2 hover:bg-primary/10 hover:text-primary rounded-md transition-colors"
                          title="Edit User"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-md transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <UserFormModal
        isOpen={isModalOpen}
        initialData={editingUser}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleUpdate}
        isSubmitting={updateMutation.isPending}
      />
    </main>
  );
}

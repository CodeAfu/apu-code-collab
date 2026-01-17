"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Loader2, Search } from "lucide-react";
import api from "@/lib/api";
import { Framework } from "./types";
import FrameworkFormModal from "./_components/framework-form-modal";
import { toast } from "sonner";

export default function FrameworkAdminPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Framework | null>(null);
  const [search, setSearch] = useState("");

  const { data: frameworks = [], isLoading } = useQuery({
    queryKey: ["frameworks"],
    queryFn: async () => (await api.get<Framework[]>("/api/v1/frameworks")).data,
  });

  const createMutation = useMutation({
    mutationFn: async (payload: { name: string }) => {
      toast.loading("Creating framework...");
      return (await api.post<Framework>("/api/v1/frameworks", payload)).data;
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Framework created successfully.");
      queryClient.invalidateQueries({ queryKey: ["frameworks"] });
      setIsModalOpen(false);
    },
    onError: () => {
      toast.dismiss();
      toast.error("Failed to create framework.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      toast.loading("Updating framework...");
      return (await api.put<Framework>(`/api/v1/frameworks/${id}`, { name })).data;
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Framework updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["frameworks"] });
      setIsModalOpen(false);
      setEditingItem(null);
    },
    onError: () => {
      toast.dismiss();
      toast.error("Failed to update framework.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      toast.loading("Deleting framework...");
      return (await api.delete(`/api/v1/frameworks/${id}`)).data;
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Framework deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["frameworks"] });
    },
    onError: () => {
      toast.dismiss();
      toast.error("Failed to delete framework.");
    },
  });

  const handleSubmit = (name: string) => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, name });
    } else {
      createMutation.mutate({ name });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this framework? This action cannot be undone.")) {
      deleteMutation.mutate(id);
    }
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: Framework) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  // 4. Filtering
  const filteredFrameworks = frameworks.filter((fw) =>
    fw.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="p-8 space-y-8 w-full max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Frameworks</h1>
          <p className="text-muted-foreground">Manage the list of supported frameworks.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Add Framework
        </button>
      </div>

      <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-card max-w-sm">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          placeholder="Search frameworks..."
          className="flex-1 bg-transparent border-none outline-none text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="border rounded-xl bg-card overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredFrameworks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground gap-2">
            <Search className="h-8 w-8 opacity-20" />
            <p>No frameworks found.</p>
          </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredFrameworks.map((fw) => (
                <tr key={fw.id} className="group hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{fw.name}</td>
                  <td className="px-6 py-4 text-xs font-mono text-muted-foreground">{fw.id}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditModal(fw)}
                        className="p-2 hover:bg-primary/10 hover:text-primary rounded-md transition-colors"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(fw.id)}
                        disabled={deleteMutation.isPending}
                        className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-md transition-colors"
                        title="Delete"
                      >
                        {deleteMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <FrameworkFormModal
        isOpen={isModalOpen}
        initialData={editingItem}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />
    </main>
  );
}

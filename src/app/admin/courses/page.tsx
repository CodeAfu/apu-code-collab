"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Loader2, Search } from "lucide-react";
import api from "@/lib/api";
import { UniversityCourse, CoursePayload } from "./types";
import CourseFormModal from "./_components/course-form-modal";
import { toast } from "sonner";

export default function CourseAdminPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<UniversityCourse | null>(null);
  const [search, setSearch] = useState("");

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["university_courses"],
    queryFn: async () => (await api.get<UniversityCourse[]>("/api/v1/university_courses/")).data,
  });

  const createMutation = useMutation({
    mutationFn: async (payload: CoursePayload) => {
      toast.loading("Creating course...");
      return (await api.post<UniversityCourse>("/api/v1/university_courses/", payload)).data;
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Course created successfully.");
      queryClient.invalidateQueries({ queryKey: ["university_courses"] });
      setIsModalOpen(false);
    },
    onError: () => {
      toast.dismiss();
      toast.error("Failed to create course.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CoursePayload }) => {
      toast.loading("Updating course...");
      return (await api.put<UniversityCourse>(`/api/v1/university_courses/${id}`, data)).data;
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Course updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["university_courses"] });
      setIsModalOpen(false);
      setEditingItem(null);
    },
    onError: () => {
      toast.dismiss();
      toast.error("Failed to update course.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      toast.loading("Deleting course...");
      return (await api.delete(`/api/v1/university_courses/${id}`)).data;
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Course deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["university_courses"] });
    },
    onError: () => {
      toast.dismiss();
      toast.error("Failed to delete course.");
    },
  });

  const handleSubmit = (data: CoursePayload) => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
      deleteMutation.mutate(id);
    }
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: UniversityCourse) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const filteredCourses = courses.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="p-8 space-y-8 w-full max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">University Courses</h1>
          <p className="text-muted-foreground">Manage the list of offered degree programs.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Add Course
        </button>
      </div>

      <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-card max-w-sm">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          placeholder="Search by name or code..."
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
        ) : filteredCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground gap-2">
            <Search className="h-8 w-8 opacity-20" />
            <p>No courses found.</p>
          </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
              <tr>
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredCourses.map((course) => (
                <tr key={course.id} className="group hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium">{course.code}</td>
                  <td className="px-6 py-4 font-medium text-foreground">{course.name}</td>
                  <td className="px-6 py-4 text-xs font-mono text-muted-foreground">{course.id}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditModal(course)}
                        className="p-2 hover:bg-primary/10 hover:text-primary rounded-md transition-colors"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(course.id)}
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

      <CourseFormModal
        isOpen={isModalOpen}
        initialData={editingItem}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />
    </main>
  );
}

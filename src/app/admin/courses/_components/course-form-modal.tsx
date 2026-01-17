import { X, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { UniversityCourse, CoursePayload } from "../types";
import Modal from "@/components/modal";

interface CourseFormModalProps {
  isOpen: boolean;
  initialData: UniversityCourse | null;
  onClose: () => void;
  onSubmit: (data: CoursePayload) => void;
  isSubmitting: boolean;
}

export default function CourseFormModal({
  isOpen,
  initialData,
  onClose,
  onSubmit,
  isSubmitting,
}: CourseFormModalProps) {
  const [formData, setFormData] = useState<CoursePayload>({ name: "", code: "" });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: initialData?.name || "",
        code: initialData?.code || "",
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) return;
    onSubmit(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" className="p-0 overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b">
        <h2 className="text-lg font-semibold">
          {initialData ? "Edit Course" : "Add Course"}
        </h2>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Course Name</label>
          <input
            autoFocus
            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            placeholder="e.g. BSc (Hons) in Computer Science"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Course Code</label>
          <input
            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            placeholder="e.g. CS-DA"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium hover:bg-accent rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !formData.name.trim() || !formData.code.trim()}
            className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {initialData ? "Save Changes" : "Create Course"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

"use client";

import Modal from "@/components/modal";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { SkillItem } from "../types";
import api from "@/lib/api";
import { withAuth } from "@/lib/auth";
import { devLog, logApiError } from "@/lib/utils";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import LoadingSpinner from "@/components/loading-spinner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";

interface SkillsModalProps {
  repositoryId: string;
  skills: SkillItem[];
  setSkills: React.Dispatch<React.SetStateAction<SkillItem[]>>;
  isSkillsModalOpen: boolean;
  setIsSkillsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SkillsModal({ repositoryId, skills, setSkills, isSkillsModalOpen, setIsSkillsModalOpen }: SkillsModalProps) {
  const queryClient = useQueryClient();
  const [focusedSkillId, setFocusedSkillId] = useState<string | null>(null);
  const [error, setError] = useState<string>();

  const { data: skillsAutocompleteSuggestions } = useSuspenseQuery<string[]>({
    queryKey: ["github", "repos", "skills"],
    queryFn: withAuth(async () => {
      const response = await api.get(`/api/v1/github/repos/skills`);
      return response.data.items;
    }),
  })

  const { mutateAsync: saveSkillsHandler, isPending: isSkillsSavePending } = useMutation({
    mutationFn: withAuth(async () => {
      const payload = {
        skills: skills.map((s) => s.name.trim()).filter((s) => s !== "")
      }
      toast.loading("Saving skills...");
      const response = await api.post(`/api/v1/github/repos/${repositoryId}/skills`, payload)
      return response.data;
    }),
    onSuccess: (data) => {
      toast.dismiss();
      devLog("Success:", data);
      toast.success("Successfully saved skills");
      setIsSkillsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["github", "repos"] });
    },
    onError: (error) => {
      toast.dismiss();
      logApiError(error);
      toast.error("Failed to save skills");
      setError("Failed to save skills");
    },
  })

  useEffect(() => {
    if (isSkillsModalOpen && skills.length === 0) {
      setSkills([{ id: crypto.randomUUID(), name: "" }]);
    }
  }, [isSkillsModalOpen]);

  const handleSave = async () => {
    await saveSkillsHandler();
  };

  const updateSkill = (id: string, newValue: string) => {
    setSkills((prev) =>
      prev.map((item) => (item.id === id ? { ...item, name: newValue } : item))
    );
    setError(undefined);
  };

  const removeSkill = (id: string) => {
    setSkills((prev) => prev.filter((item) => item.id !== id));
  };

  const addSkill = () => {
    if (skills.some((s) => s.name.trim() === "")) {
      setError("Please enter a skill");
      return;
    }
    if (skills.length >= 15) {
      setError("You can only add up to 15 skills");
      return;
    }

    const values = skills.map((s) => s.name.trim().toLowerCase());
    const uniqueValues = new Set(values);

    if (uniqueValues.size !== values.length) {
      setError("Duplicate skills are not allowed");
      return;
    }
    setSkills([...skills, { id: crypto.randomUUID(), name: "" }]);
  };

  return (
    <Modal
      isOpen={isSkillsModalOpen}
      size="xl" onClose={() => setIsSkillsModalOpen(false)}
      className="relative border border-border shadow-lg rounded-xl p-6 sm:p-8"
    >
      <div className="flex flex-col">
        <div className="mb-4">
          <div className="flex items-center justify-between gap-4 mb-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Skills
            </h2>
            <span className="text-sm text-muted-foreground select-none px-2 py-1 border border-border rounded-lg">Enter</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Add skills you would like to see from collaborators of this project.
          </p>
        </div>
        <ul className="mb-6 gap-1.5 grid sm:grid-cols-2">
          <AnimatePresence>
            {skills.map((skill, index) => {
              const showSuggestions =
                focusedSkillId === skill.id &&
                skill.name.trim() !== "" &&
                skillsAutocompleteSuggestions?.some(
                  (s) =>
                    s.toLowerCase().includes(skill.name.toLowerCase()) &&
                    s.toLowerCase() !== skill.name.toLowerCase()
                );

              const filteredSuggestions = skillsAutocompleteSuggestions
                ?.filter(
                  (s) =>
                    s.toLowerCase().includes(skill.name.toLowerCase()) &&
                    s.toLowerCase() !== skill.name.toLowerCase()
                )
                .slice(0, 5);

              return (
                <motion.li
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2"
                  key={skill.id}
                >
                  <span className="ml-1 w-6 text-sm text-muted-foreground text-right tabular-nums">{index + 1}.</span>

                  <Popover open={!!showSuggestions}>
                    <PopoverTrigger asChild>
                      <div className="relative w-full">
                        <input
                          type="text"
                          className="w-full bg-input px-3 py-1.5 text-sm rounded-md border border-border transition duration-200 focus:outline-none focus:ring-1 focus:ring-primary"
                          value={skill.name}
                          onChange={(e) => updateSkill(skill.id, e.target.value)}
                          onFocus={() => setFocusedSkillId(skill.id)}
                          onBlur={() => setTimeout(() => setFocusedSkillId(null), 200)}
                          autoFocus={skills.length > 1 && index === skills.length - 1}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addSkill();
                            }
                          }}
                        />
                      </div>
                    </PopoverTrigger>

                    <PopoverContent
                      className="p-1 z-200 w-[var(--radix-popover-trigger-width)]"
                      align="start"
                      onOpenAutoFocus={(e) => e.preventDefault()}
                    >
                      <div className="flex flex-col gap-0.5">
                        {filteredSuggestions?.map((suggestion) => (
                          <button
                            key={suggestion}
                            className="w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                            onClick={(e) => {
                              e.preventDefault();
                              updateSkill(skill.id, suggestion);
                              setFocusedSkillId(null);
                            }}
                            onMouseDown={(e) => e.preventDefault()}
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>

                  <button
                    onClick={() => removeSkill(skill.id)}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition duration-200"
                    type="button"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>

        <div className="flex items-center gap-4">
          <button
            onClick={addSkill}
            className="inline-flex px-2 py-1 border border-foreground rounded shadow w-fit
          hover:cursor-pointer hover:shadow-primary hover:scale-105 transition duration-200"
          >
            Add
          </button>
        </div>

        <div className="flex justify-between items-center gap-3 mt-2">
          <div className="flex items-center">
            {error && (
              <p className="text-sm text-destructive">
                {error}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsSkillsModalOpen(false)} className="px-3 py-2 hover:underline hover:cursor-pointer">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSkillsSavePending}
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground px-3 py-2 rounded-md shadow
                hover:cursor-pointer disabled:bg-muted disabled:text-muted-foreground disabled:pointer-events-none transition duration-200"
            >
              {isSkillsSavePending ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isSkillsSavePending && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-0 right-0 inset-0 bg-black/50 backdrop-blur-sm flex flex-col justify-center items-center gap-2 text-sm text-muted-foreground">
            <LoadingSpinner />
            <span>Saving...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal >
  );
}

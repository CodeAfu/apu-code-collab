"use client";

import Modal from "@/components/modal";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { SkillItem } from "../types";
import { toast } from "sonner";

interface SkillsModalProps {
  skills: SkillItem[];
  setSkills: React.Dispatch<React.SetStateAction<SkillItem[]>>;
  isSkillsModalOpen: boolean;
  setIsSkillsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SkillsModal({ skills, setSkills, isSkillsModalOpen, setIsSkillsModalOpen }: SkillsModalProps) {
  useEffect(() => {
    if (isSkillsModalOpen) {
      setSkills([{ id: crypto.randomUUID(), value: "" }]);
    }
  }, [isSkillsModalOpen]);

  const handleSave = () => {
    const cleanSkills = skills
      .map((s) => s.value)
      .filter((s) => s.trim() !== "");
    console.log("Saving strings:", cleanSkills);
    setIsSkillsModalOpen(false);
  };

  const updateSkill = (id: string, newValue: string) => {
    setSkills((prev) =>
      prev.map((item) => (item.id === id ? { ...item, value: newValue } : item))
    );
  };

  const removeSkill = (id: string) => {
    setSkills((prev) => prev.filter((item) => item.id !== id));
  };

  const addSkill = () => {
    if (skills.length >= 15) {
      toast.error("You can only add up to 15 skills");
      return;
    }
    setSkills([...skills, { id: crypto.randomUUID(), value: "" }]);
  };

  return (
    <Modal
      isOpen={isSkillsModalOpen}
      size="xl" onClose={() => setIsSkillsModalOpen(false)}
      className="relative border border-border shadow-lg rounded-xl p-6 sm:p-8"
    >
      <div className="flex flex-col">
        <div className="mb-4">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Skills
          </h2>
          <p className="text-sm text-muted-foreground">
            Add skills you would like to see from collaborators of this project.
          </p>
        </div>
        <ul className="mb-4 gap-2 grid sm:grid-cols-2">
          <AnimatePresence>
            {skills.map((skill, index) => (
              <motion.li
                initial={{ opacity: 0, }}
                animate={{ opacity: 1, }}
                exit={{ opacity: 0, }}
                className="inline-flex items-center gap-2"
                key={skill.id}>
                <span className="ml-2 w-10 text-muted-foreground">{index + 1}.</span>
                <input
                  type="text"
                  className="w-full bg-input px-2 text-lg rounded border border-border transition duration-200 focus:outline-none"
                  value={skill.value}
                  onChange={(e) => updateSkill(skill.id, e.target.value)}
                  autoFocus={skills.length > 1 && index === skills.length - 1}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                />
                <button
                  onClick={() => removeSkill(skill.id)}
                  className="p-2 rounded-md hover:ring-1 hover:ring-foreground hover:cursor-pointer transition duration-200"
                  type="button"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.li>
            ))}
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
          <p className="text-sm text-muted-foreground select-none pointer-events-none">"Enter"</p>
        </div>

        <div className="flex justify-end items-center gap-3 mt-2">
          <button onClick={() => setIsSkillsModalOpen(false)} className="px-3 py-2 hover:underline hover:cursor-pointer">
            Cancel
          </button>
          <button className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground transition-colors px-3 py-2 rounded-md shadow
            hover:cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            Save
          </button>
        </div>
      </div>
    </Modal >
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function RepoFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [apuId, setApuId] = useState(searchParams.get("apu_id") || "");
  const [githubUser, setGithubUser] = useState(searchParams.get("github_username") || "");
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>(searchParams.getAll("skills") || []);

  // Sync state if URL changes externally
  useEffect(() => {
    setApuId(searchParams.get("apu_id") || "");
    setGithubUser(searchParams.get("github_username") || "");
    setSkills(searchParams.getAll("skills") || []);
  }, [searchParams]);

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
      }
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const applyFilters = () => {
    // Preserve existing search query
    const params = new URLSearchParams(searchParams.toString());

    // Update Filter params
    if (apuId) params.set("apu_id", apuId); else params.delete("apu_id");
    if (githubUser) params.set("github_username", githubUser); else params.delete("github_username");

    params.delete("skills");
    skills.forEach((s) => params.append("skills", s));

    router.push(`?${params.toString()}`);
  };

  const clearFilters = () => {
    setApuId("");
    setGithubUser("");
    setSkills([]);
    setSkillInput("");

    // Keep search, remove others
    const params = new URLSearchParams(searchParams.toString());
    params.delete("apu_id");
    params.delete("github_username");
    params.delete("skills");
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="space-y-6 p-1">
      <div className="space-y-4">
        {/* Skills */}
        <div className="space-y-2">
          <Label>Skills</Label>
          <Input
            placeholder="e.g. React (Press Enter)"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={handleAddSkill}
            className="bg-background"
          />
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="px-1 py-0 text-xs gap-1 hover:bg-secondary">
                {skill}
                <X className="w-3 h-3 cursor-pointer hover:text-destructive" onClick={() => removeSkill(skill)} />
              </Badge>
            ))}
          </div>
        </div>

        {/* User IDs */}
        <div className="space-y-2">
          <Label>APU ID</Label>
          <Input
            placeholder="e.g. TP060000"
            value={apuId}
            onChange={(e) => setApuId(e.target.value.toUpperCase())}
            className="bg-background"
          />
        </div>
        <div className="space-y-2">
          <Label>GitHub Username</Label>
          <Input
            placeholder="e.g. codeafu"
            value={githubUser}
            onChange={(e) => setGithubUser(e.target.value)}
            className="bg-background"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Button onClick={applyFilters} className="w-full">Apply Filters</Button>
        {(apuId || githubUser || skills.length > 0) && (
          <Button variant="ghost" onClick={clearFilters} size="sm" className="w-full text-muted-foreground">
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}

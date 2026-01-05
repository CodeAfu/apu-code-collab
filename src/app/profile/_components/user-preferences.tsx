"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "motion/react";
import { X, Plus, Settings2, Check, Loader2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import api from "@/lib/api";
import { withAuth } from "@/lib/auth";
import { cn, devLog, logApiError } from "@/lib/utils";
import { useUser } from "@/hooks/use-user";

// Types
interface UserPreferenceItem {
  id: string;
  name: string;
}

export default function UserPreferences({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const queryClient = useQueryClient();
  const { userDetails } = useUser();
  const [isEditing, setIsEditing] = useState(false);

  const [localLanguages, setLocalLanguages] = useState<UserPreferenceItem[]>([]);
  const [localFrameworks, setLocalFrameworks] = useState<UserPreferenceItem[]>([]);

  useEffect(() => {
    if (userDetails) {
      setLocalLanguages(userDetails.preferred_programming_languages || []);
      setLocalFrameworks(userDetails.preferred_frameworks || []);
    }
  }, [userDetails, isEditing]);

  // Fetch available options
  const { data: allLanguages } = useQuery<UserPreferenceItem[]>({
    queryKey: ["languages"],
    queryFn: async () => (await api.get("/api/v1/github/repos/programming_languages")).data,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const { data: allFrameworks } = useQuery<UserPreferenceItem[]>({
    queryKey: ["frameworks"],
    queryFn: async () => (await api.get("/api/v1/github/repos/frameworks")).data,
    staleTime: 1000 * 60 * 60,
  });

  // Save Mutation
  const { mutateAsync: savePreferences, isPending } = useMutation({
    mutationFn: withAuth(async () => {
      if (!userDetails) return;

      const payload = {
        programming_languages: localLanguages.map((l) => l.name),
        frameworks: localFrameworks.map((f) => f.name),
      };

      toast.loading("Saving...");
      const response = await api.put("/api/v1/users/me/preferences/persist", payload);
      toast.dismiss();
      devLog("Preferences:", response.data);
      return response.data;
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "me"] });
      toast.success("Preferences updated successfully!");
      setIsEditing(false);
    },
    onError: (err) => {
      logApiError(err);
      toast.error("Failed to update preferences.");
    },
  });

  if (!userDetails) return null;

  return (
    <div className={cn("group relative overflow-visible rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md", className)} {...props}>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400">
            <Settings2 className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-lg">Tech Preferences</h3>
        </div>

        {/* Edit / Save Controls */}
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-md hover:bg-accent"
            >
              Edit
            </button>
          ) : (
            <>
              <button
                disabled={isPending}
                onClick={() => setIsEditing(false)}
                className="text-sm text-foreground-subtle hover:text-foreground hover:underline px-2 py-1.5 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={isPending}
                onClick={() => savePreferences()}
                className="flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-3 py-1.5 rounded-md
                  shadow hover:bg-primary/90 transition-all disabled:opacity-50"
              >
                {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                Save
              </button>
            </>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Section: Languages */}
        <PreferenceSection
          title="Programming Languages"
          items={localLanguages}
          setItems={setLocalLanguages}
          allItems={allLanguages || []}
          isEditing={isEditing}
          placeholder="Add language..."
        />


        {/* Section: Frameworks */}
        <PreferenceSection
          title="Frameworks & Libraries"
          items={localFrameworks}
          setItems={setLocalFrameworks}
          allItems={allFrameworks || []}
          isEditing={isEditing}
          placeholder="Add framework..."
        />
      </div>
    </div>
  );
}

interface PreferenceSectionProps {
  title: string;
  items: UserPreferenceItem[];
  setItems: (items: UserPreferenceItem[]) => void;
  allItems: UserPreferenceItem[];
  isEditing: boolean;
  placeholder: string;
}

function PreferenceSection({ title, items, setItems, allItems, isEditing, placeholder }: PreferenceSectionProps) {
  const [inputValue, setInputValue] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleAddItem = (item: UserPreferenceItem) => {
    if (items.some((i) => i.id === item.id)) return;
    setItems([...items, item]);
    setInputValue("");
    setIsPopoverOpen(false);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  // Filter logic: Match name AND exclude already selected items
  const suggestions = allItems
    .filter((i) => i.name.toLowerCase().includes(inputValue.toLowerCase()))
    .filter((i) => !items.some((existing) => existing.id === i.id))
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-3">
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {title}
      </h4>

      <div className="flex flex-wrap gap-2 min-h-[32px]">
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <motion.span
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors",
                isEditing
                  ? "bg-background border-dashed border-muted-foreground/40 pr-1.5"
                  : "bg-primary/10 border-primary text-primary select-none"
              )}
            >
              {item.name}
              {isEditing && (
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="rounded-full p-0.5 hover:bg-destructive hover:text-destructive-foreground text-muted-foreground transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </motion.span>
          ))}
        </AnimatePresence>

        {/* Add Button (Only in Edit Mode) */}
        {isEditing && (
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium border border-dashed border-muted-foreground/40 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </PopoverTrigger>
            <PopoverContent className="p-1 w-[220px]" align="start" side="bottom">
              <input
                className="w-full bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground"
                placeholder={placeholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                autoFocus
              />
              <div className="mt-1 flex flex-col gap-0.5">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    onClick={() => handleAddItem(suggestion)}
                    className="w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    {suggestion.name}
                  </button>
                ))}
                {inputValue.length > 0 && suggestions.length === 0 && (
                  <div className="px-2 py-2 text-xs text-muted-foreground text-center italic">
                    No results found.
                  </div>
                )}
                {inputValue.length === 0 && suggestions.length === 0 && (
                  <div className="px-2 py-2 text-xs text-muted-foreground text-center italic">
                    Type to search...
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        )}

        {/* Empty State (Only in View Mode) */}
        {!isEditing && items.length === 0 && (
          <span className="text-sm text-muted-foreground italic py-1">None selected</span>
        )}
      </div>
    </div>
  );
}

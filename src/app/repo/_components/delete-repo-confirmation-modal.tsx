"use client";

import Modal from "@/components/modal";

interface DeleteRepoConfirmationModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  deleteRepoHandler: () => void;
  isRepoDeletePending: boolean;
  isRepoDeleteSuccess: boolean;
}

export default function DeleteRepoConfirmationModal({ isOpen, setIsOpen, deleteRepoHandler, isRepoDeletePending, isRepoDeleteSuccess }: DeleteRepoConfirmationModalProps) {
  return (
    <Modal className="border border-border rounded p-6" isOpen={isOpen} onClose={() => setIsOpen(false)} size="md">
      <div>
        <h2 className="text-xl font-bold tracking-tight mb-2">
          Are you sure you want to delete this repository?
        </h2>
        <p className="text-sm text-muted-foreground">
          This action cannot be undone.
        </p>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={() => setIsOpen(false)}
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 hover:cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            setIsOpen(false);
            deleteRepoHandler()
          }}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium px-4 py-2 bg-destructive text-destructive-foreground shadow 
                hover:bg-destructive/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring hover:cursor-pointer 
                transition-colors disabled:opacity-50 disabled:pointer-events-none"
          disabled={isRepoDeletePending || isRepoDeleteSuccess}
        >
          Delete
        </button>
      </div>
    </Modal >
  )
}

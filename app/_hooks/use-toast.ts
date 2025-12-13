"use client";

import { toast as sonnerToast } from "sonner";

type toastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
};

export default function Toast({ title, description, variant }: toastProps) {
  if (variant === "destructive") {
    sonnerToast.error(title || "Error", {
      description,
    });
  } else {
    sonnerToast.success(title || "Success", {
      description,
    });
  }
}

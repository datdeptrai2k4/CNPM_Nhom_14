import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { API_BASE } from "./config";

export const getFullImageUrl = (url: string | undefined) => {
  if (url === undefined) {
    url = '';
  }

  const something = url?.startsWith("http") ? url : `${API_BASE}${url}`

  console.log(something);

  return something;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

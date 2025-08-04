// Render a string with line breaks (\n) as React elements
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function renderWithLineBreaks(message: string) {
  // Render markdown-formatted text using react-markdown
  return <ReactMarkdown>{message}</ReactMarkdown>;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Render a string with line breaks (\n) as React elements
import React from 'react';
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function renderWithLineBreaks(message: string) {
  return message.split('\n').map((line, idx, arr) => (
    <span key= { idx } >
    { line }
            { idx<arr.length - 1 ? <br /> : null}
    </span>
  ));
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

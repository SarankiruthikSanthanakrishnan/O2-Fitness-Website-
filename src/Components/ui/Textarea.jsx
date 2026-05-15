// src/Components/Textarea.jsx
import React from 'react';

export function Textarea({ value, onChange, placeholder, name, rows = 4, className }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      name={name}
      rows={rows}
      placeholder={placeholder}
      className={`border border-gray-300 rounded px-3 py-2 w-full ${className}`}
    />
  );
}

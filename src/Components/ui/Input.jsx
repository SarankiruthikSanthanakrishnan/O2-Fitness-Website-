// src/Components/Input.jsx
import React from 'react';

export function Input({ type = 'text', value, onChange, placeholder, name, className }) {
  return (
    <input
      type={type}
      value={value}
      name={name}
      placeholder={placeholder}
      onChange={onChange}
      className={`border border-gray-300 rounded px-3 py-2 w-full ${className}`}
    />
  );
}

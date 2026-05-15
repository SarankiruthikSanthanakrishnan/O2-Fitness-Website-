import React, { useState } from 'react';

// Tabs main wrapper
export function Tabs({ defaultValue, children, className }) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <div className={className}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        return React.cloneElement(child, {
          activeTab,
          setActiveTab,
        });
      })}
    </div>
  );
}

export function TabsList({ children, className, setActiveTab, activeTab }) {
  return (
    <div className={className}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        return React.cloneElement(child, {
          onClick: () => setActiveTab(child.props.value),
          isActive: child.props.value === activeTab,
        });
      })}
    </div>
  );
}

export function TabsTrigger({ children, value, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md font-medium text-sm transition ${
        isActive ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
      }`}
    >
      {children}
    </button>
  );
}
TabsTrigger.displayName = 'TabsTrigger';

export function TabsContent({ children, value, activeTab }) {
  return (
    <div className={`mt-4 ${activeTab !== value ? 'hidden' : ''}`}>
      {children}
    </div>
  );
}
TabsContent.displayName = 'TabsContent';

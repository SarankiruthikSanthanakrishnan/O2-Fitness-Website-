import React from 'react';
import clsx from 'clsx';

const categories = [
  { name: 'Massage Chairs' },
  {name:"Fitness Massagers"},
  { name: 'Leg & Foot Massager' },
  { name: 'Neck Massager' },
  
];

const CategoryProductTab = ({ selectedTab, onSelect }) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 py-4">
      {categories.map((cat) => (
        <div
          key={cat.name}
          onClick={() => onSelect(cat.name)}
          className="p-[2px] rounded-full cursor-pointer transition"
          style={{
            background: selectedTab === cat.name
              ? '#f97316'
              : 'linear-gradient(to bottom, #fb923c, #93c5fd)'
          }}
        >
          <button
            className={clsx(
              'px-4 py-2 rounded-full font-medium w-full h-full transition',
              selectedTab === cat.name
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-700 hover:bg-orange-100'
            )}
          >
            {cat.name}
          </button>
        </div>
      ))}
    </div>
  );
};

export default CategoryProductTab;

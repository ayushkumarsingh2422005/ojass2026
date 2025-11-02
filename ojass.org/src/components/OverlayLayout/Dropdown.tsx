"use client";

import React, { useState, useEffect, useRef } from 'react';

// 1. Define karte hain ki har option kaisa dikhega
interface DropdownOption {
  value: string | number;
  label: string;
}

// 2. Define karte hain ki component ko parent se kya props chahiye
interface DropdownProps {
  options: DropdownOption[];
  selectedValue: string | number;
  onChange: (newValue: string | number) => void;
}

// 3. Component ab 'props' le raha hai
const Dropdown: React.FC<DropdownProps> = ({ options, selectedValue, onChange }) => {
  
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click-outside logic (aapka code) - ismein koi badlaav nahi
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        event.target instanceof Node &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  // 4. Current selected option ka label dhoondhna
  // '==' ka istemaal type (string/number) ki chinta kiye bina match karne ke liye
  const selectedOption = options.find(option => option.value == selectedValue);

  // 5. Jab naye item par click ho
  const handleItemClick = (value: string | number) => {
    onChange(value); // Parent ko naya value bhejte hain
    setIsOpen(false); // Dropdown ko band karte hain
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      
      {/* Button to toggle the dropdown */}
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          id="menu-button"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {/* 6. Static "Options" ki jagah dynamic label dikhana */}
          {selectedOption ? selectedOption.label : 'Select Event'}
          
          <svg className="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.29a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* The Dropdown Menu (conditionally rendered) */}
      {isOpen && (
        <div
          className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="py-1" role="none">
            
            {/* 7. Hard-coded items ki jagah 'options' prop se dynamic list banana */}
            {options.map((option) => (
              <a
                key={option.value}
                href="#"
                className={`text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 ${
                  option.value == selectedValue ? 'font-bold bg-gray-50' : '' // Selected ko highlight karein
                }`}
                role="menuitem"
                tabIndex={-1}
                id={`menu-item-${option.value}`}
                onClick={(e) => {
                  e.preventDefault(); // Page reload na ho
                  handleItemClick(option.value); // Click handle karein
                }}
              >
                {option.label}
              </a>
            ))}
            
          </div>
        </div>
      )}
    </div>
  );
}

export default Dropdown;
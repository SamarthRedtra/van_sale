"use client";

import { useState, useEffect, useRef } from "react";

const fruits = [
  "Apple",
  "Apricot",
  "Avocado",
  "Banana",
  "Blackberry",
  "Blueberry",
  "Cherry",
  "Coconut",
  "Fig",
  "Grape",
  "Guava",
  "Kiwi",
  "Lemon",
  "Lime",
  "Mango",
  "Orange",
  "Papaya",
  "Peach",
  "Pear",
  "Pineapple",
  "Plum",
  "Raspberry",
  "Strawberry",
  "Watermelon",
];

export default function AutoComplete() {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>(fruits);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRefs = useRef<(HTMLLIElement | null)[]>([]);
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (input === "") {
      setSuggestions(fruits);
    } else {
      const filteredSuggestions = fruits.filter((fruit) =>
        fruit.toLowerCase().includes(input.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    }
    setSelectedIndex(-1);
    setIsOpen(true);
  }, [input]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        componentRef.current &&
        !componentRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
      setIsOpen(true);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
      setIsOpen(true);
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      setInput(suggestions[selectedIndex]);
      setIsOpen(false);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (selectedIndex >= 0 && suggestionRefs.current[selectedIndex]) {
      suggestionRefs.current[selectedIndex]?.scrollIntoView({
        block: "nearest",
      });
    }
  }, [selectedIndex]);

  return (
    <div className="w-full max-w-md mx-auto" ref={componentRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          className="w-full px-4 py-2 text-gray-700 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Type a fruit name..."
        />
        {isOpen && (
          <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {suggestions.map((suggestion, index) => (
              <li
                key={suggestion}
                ref={(el) => (suggestionRefs.current[index] = el)}
                className={`px-4 py-2 cursor-pointer ${
                  index === selectedIndex
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => {
                  setInput(suggestion);
                  setIsOpen(false);
                  inputRef.current?.focus();
                }}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

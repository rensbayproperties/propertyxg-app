import React, { useState, useRef, useEffect } from 'react';
import { CheckIcon, ChevronDownIcon } from '@radix-ui/react-icons';

interface Option {
    label: string;
    value: string;
}

interface SearchableDropdownProps {
    options?: Option[];
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    className?: string;
}

const InputSelect: React.FC<SearchableDropdownProps> = ({
    options = [],
    value = '',
    onChange = () => { },
    placeholder = 'Select or type...',
    className = ''
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const inputRef = useRef<HTMLInputElement | null>(null);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Get display label for current value
    const getDisplayLabel = () => {
        if (!value) return placeholder;
        const matchedOption = options.find(opt => opt.value === value);
        return matchedOption ? matchedOption.label : value;
    };

    // Sync searchTerm when parent value updates
    useEffect(() => {
        if (!isOpen) {
            setSearchTerm('');
        }
    }, [value, isOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setSearchTerm('');
        setIsOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setSearchTerm(newValue);
        if (!isOpen) setIsOpen(true);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchTerm.trim()) {
            // If there's a matching option, select it
            const exactMatch = filteredOptions.find(
                opt => opt.label.toLowerCase() === searchTerm.toLowerCase()
            );

            if (exactMatch) {
                handleSelect(exactMatch.value);
            } else {
                // Use custom value
                onChange(searchTerm.trim());
                setSearchTerm('');
                setIsOpen(false);
            }
        } else if (e.key === 'Escape') {
            setIsOpen(false);
            setSearchTerm('');
        }
    };

    return (
        <div ref={dropdownRef} className={`relative w-full ${className}`
        }>
            <button
                type="button"
                onClick={() => {
                    setIsOpen(!isOpen);
                    if (!isOpen) {
                        setTimeout(() => inputRef.current?.focus(), 0);
                    }
                }}
                className="flex h-10 w-full items-center justify-between whitespace-nowrap rounded-md border px-3 py-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 bg-input"
            >
                <span className={`line-clamp-1 ${!value ? 'text-gray-500' : ''}`}>
                    {getDisplayLabel()}
                </span>
                < ChevronDownIcon className={`h-4 w-4 opacity-50 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {
                isOpen && (
                    <div className="absolute z-50 w-full mt-1 rounded-md border bg-white shadow-md animate-in fade-in-0 zoom-in-95" >
                        <div className="p-2 border-b border-gray-200" >
                            <input
                                ref={inputRef}
                                type="text"
                                value={searchTerm}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                placeholder="Search or type custom value..."
                                className="w-full px-3 py-2 text-sm rounded border bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        < div className="max-h-60 overflow-y-auto p-1" >
                            {
                                filteredOptions.length > 0 ? (
                                    filteredOptions.map((option, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => handleSelect(option.value)}
                                            className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 pl-3 pr-8 text-sm outline-none hover:bg-gray-100"
                                        >
                                            <span>{option.label} </span>
                                            {
                                                value === option.value && (
                                                    <span className="absolute right-2 flex h-4 w-4 items-center justify-center" >
                                                        <CheckIcon className="h-4 w-4" />
                                                    </span>
                                                )
                                            }
                                        </button>
                                    ))
                                ) : searchTerm ? (
                                    <div className="py-6 text-center text-sm" >
                                        <div className="mb-2 text-gray-600" > No options found </div>
                                        < div className="text-xs text-blue-600" > Press Enter to use "{searchTerm}" </div>
                                    </div>
                                ) : options.length > 0 ? (
                                    <div className="py-6 text-center text-sm text-gray-500" >
                                        Start typing to search
                                    </div>
                                ) : (
                                    <div className="py-6 text-center text-sm text-gray-500" >
                                        Type a value and press Enter
                                    </div>
                                )
                            }
                        </div>
                    </div>
                )}
        </div>
    );
};

export default InputSelect;
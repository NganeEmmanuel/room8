import React, { useState } from 'react';
import { X } from 'lucide-react';

export const InputField = ({ label, id, type = 'text', value, onChange, placeholder, required = false, disabled = false, helpText }) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input type={type} id={id} name={id} value={value || ''} onChange={onChange} placeholder={placeholder} required={required} disabled={disabled} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"/>
      {helpText && <p className="mt-1 text-xs text-gray-500">{helpText}</p>}
    </div>
);

export const SelectField = ({ label, id, value, onChange, options, required = false, disabled = false, helpText }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <select id={id} name={id} value={value || ''} onChange={onChange} required={required} disabled={disabled} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
            {options.map(opt => ( <option key={opt.value||opt} value={opt.value||opt}>{opt.label||opt}</option>))}
        </select>
        {helpText && <p className="mt-1 text-xs text-gray-500">{helpText}</p>}
    </div>
);

export const TextareaField = ({ label, id, value, onChange, placeholder, rows = 3, maxLength, helpText }) => {
    const charCount = maxLength ? `${(value||'').length}/${maxLength}` : null;
    return (
        <div>
            <div className="flex justify-between items-center mb-1">
                <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
                {maxLength && <span className="text-xs text-gray-500">{charCount}</span>}
            </div>
            <textarea id={id} name={id} value={value || ''} onChange={onChange} placeholder={placeholder} rows={rows} maxLength={maxLength} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"/>
            {helpText && <p className="mt-1 text-xs text-gray-500">{helpText}</p>}
        </div>
    );
};

export const ToggleSwitch = ({ label, id, name, checked, onChange, helpText }) => (
    <div className="flex items-center justify-between">
      <div>
        <span className="text-sm font-medium text-gray-700">{label}</span>
        {helpText && <p className="mt-1 text-xs text-gray-500">{helpText}</p>}
      </div>
      <button type="button" onClick={() => onChange({ target: { name: name || id, type: 'checkbox', checked: !checked } })}
        className={`${checked ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`} role="switch" aria-checked={checked}>
        <span className={`${checked ? 'translate-x-6' : 'translate-x-1'} pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
      </button>
    </div>
);

export const TagInput = ({ label, id, name, value = [], onChange, placeholder, helpText }) => {
  const [inputValue, setInputValue] = useState('');
  const currentTags = Array.isArray(value) ? value : [];
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && inputValue.trim()) {
      event.preventDefault();
      onChange({ target: { name: name || id, value: [...currentTags, inputValue.trim()] } });
      setInputValue('');
    }
  };
  const removeTag = (tagToRemove) => {
    onChange({ target: { name: name || id, value: currentTags.filter(tag => tag !== tagToRemove) } });
  };
  return (
    <div>
        <label htmlFor={id + '-input'} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-md min-h-[40px]">
            {currentTags.map(tag => (
            <span key={tag} className="inline-flex items-center gap-x-1.5 py-1 px-2 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
                {tag}
                <button type="button" onClick={() => removeTag(tag)} className="text-blue-800 hover:text-blue-900"><X size={14} /></button>
            </span>
            ))}
            <input type="text" id={id + '-input'} value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeyDown} placeholder={placeholder || "Type and press Enter"} className="flex-grow bg-transparent focus:outline-none p-1"/>
        </div>
        {helpText && <p className="mt-1 text-xs text-gray-500">{helpText}</p>}
    </div>
  );
};

export const SectionCard = ({ title, children, icon: IconComponent }) => (
  <div className="bg-white shadow-md rounded-lg p-6 mb-6">
    <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center border-b border-gray-200 pb-4">
      {IconComponent && <IconComponent className="mr-3 text-blue-600" size={24} />}
      {title}
    </h3>
    <div className="space-y-6">{children}</div>
  </div>
);
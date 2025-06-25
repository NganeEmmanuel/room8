import React from 'react';

export const FormInput = ({ label, id, name, type = 'text', value, onChange, required = false, placeholder = '', helpText = '', error = '', min, step }) => (
    <div className="mb-4">
      <label htmlFor={id || name} className="block text-sm font-medium text-gray-700">{label} {required && <span className="text-red-500">*</span>}</label>
      <input type={type} id={id || name} name={name} value={value} onChange={onChange} required={required} placeholder={placeholder} min={min} step={step}
        className={`mt-1 block w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`} />
      {helpText && !error && <p className="mt-1 text-xs text-gray-500">{helpText}</p>}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
);

export const FormTextarea = ({ label, id, name, value, onChange, required = false, placeholder = '', rows = 3, helpText = '', error = '' }) => (
  <div className="mb-4">
    <label htmlFor={id || name} className="block text-sm font-medium text-gray-700">{label} {required && <span className="text-red-500">*</span>}</label>
    <textarea id={id || name} name={name} value={value} onChange={onChange} required={required} placeholder={placeholder} rows={rows}
      className={`mt-1 block w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`} />
    {helpText && !error && <p className="mt-1 text-xs text-gray-500">{helpText}</p>}
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

export const FormSelect = ({ label, id, name, value, onChange, options, required = false, error = '' }) => (
  <div className="mb-4">
    <label htmlFor={id || name} className="block text-sm font-medium text-gray-700">{label} {required && <span className="text-red-500">*</span>}</label>
    <select id={id || name} name={name} value={value} onChange={onChange} required={required}
      className={`mt-1 block w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`} >
      {Object.entries(options).map(([key, val]) => (
        <option key={key} value={key}>{val}</option>
      ))}
    </select>
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

export const FormToggle = ({ label, id, name, checked, onChange, helpText = '' }) => (
    <div className="flex items-center justify-between mb-4">
        <div>
            <span className="text-sm font-medium text-gray-700">{label}</span>
            {helpText && <p className="mt-1 text-xs text-gray-500">{helpText}</p>}
        </div>
        <button type="button" id={id || name} onClick={() => onChange({ target: { name: name || id, value: !checked, type: 'checkbox' }})}
            className={`${checked ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            role="switch" aria-checked={checked} >
            <span className={`${checked ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`} />
        </button>
    </div>
);
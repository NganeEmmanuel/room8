import React, { useState } from 'react';
import { X } from 'lucide-react';
import {toast} from "react-toastify";

const ToggleSwitch = ({ id, checked, onChange, label, description }) => (
    <div className="flex items-center justify-between p-4 rounded-lg bg-gray-100">
        <div className="pr-4">
            <label htmlFor={id} className="font-medium text-gray-900">{label}</label>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
        <button
            type="button"
            id={id}
            onClick={() => onChange({ target: { name: id, type: 'checkbox', checked: !checked }})}
            className={`${checked ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            role="switch"
            aria-checked={checked}
        >
            <span
                aria-hidden="true"
                className={`${checked ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
            />
        </button>
    </div>
);


const PlaceBidPanel = ({ isOpen, onClose, onSubmit, listingTitle }) => {
  const [proposal, setProposal] = useState('');
  const [amount, setAmount] = useState(''); // ADDED: State for the bid amount
  const [shareUserInfo, setShareUserInfo] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    // MODIFIED: Added validation for proposal and amount
    if (proposal.trim() === '') {
        toast.info('Please write a proposal before submitting.');
        return;
    }
    if (!amount || Number(amount) <= 0) {
        toast.info("please enter a valid amount")
        return;
    }
    // MODIFIED: Pass the bid data, including the amount, up to the parent component
    onSubmit({ proposal, amount: Number(amount), shareUserInfo });
  };

  const handleCancel = () => {
    setProposal('');
    setAmount(''); // ADDED: Reset amount on cancel
    setShareUserInfo(true);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end  bg-opacity-40 transition-opacity">
      <div className={`w-full max-w-lg h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Place Your Bid</h2>
                    <p className="text-sm text-gray-500 truncate">For: {listingTitle}</p>
                </div>
                <button
                    onClick={handleCancel}
                    className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                >
                    <X size={24} />
                </button>
            </div>

            {/* MODIFIED: Changed div to form to handle submission correctly */}
            <form onSubmit={handleSubmit} className="flex-grow p-6 overflow-y-auto space-y-6">

                {/* ADDED: Amount Input Field with validation */}
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                        Bid Amount (in FCFA)
                    </label>
                    <input
                        type="number"
                        id="amount"
                        name="amount"
                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., 55000"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        min="1" // Browser-level validation for positive numbers
                    />
                </div>

                <div>
                    <label htmlFor="proposal" className="block text-sm font-medium text-gray-700 mb-2">
                        Your Proposal
                    </label>
                    <textarea
                        id="proposal"
                        name="proposal"
                        rows="8"
                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Introduce yourself, explain why you're a good fit..."
                        value={proposal}
                        onChange={(e) => setProposal(e.target.value)}
                        required
                    ></textarea>
                </div>

                <div>
                    <h3 className="text-md font-medium text-gray-900 mb-2">Share Your Profile Details</h3>
                    <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200 mb-4">
                        To help the landlord make an informed decision, we recommend sharing a snapshot of your user information.
                    </p>
                    <ToggleSwitch
                        id="shareUserInfo"
                        checked={shareUserInfo}
                        onChange={(e) => setShareUserInfo(e.target.checked)}
                        label={shareUserInfo ? "Info will be shared" : "Info will NOT be shared"}
                        description={shareUserInfo ? "A snapshot of your profile will be sent." : "Only your name and proposal will be sent."}
                    />
                </div>
            </form>

            <div className="p-4 border-t bg-gray-50">
                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit} // This will trigger the form's onSubmit
                        className="px-8 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                    >
                        Submit Bid
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceBidPanel;
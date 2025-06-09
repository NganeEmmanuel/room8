
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Save } from 'lucide-react';
import {
    BasicProfileInfoSection,
    LifestyleHabitsSection,
    AboutMePrefSection,
    HealthInformationSection,
    PersonalitySocialHabitsSection,
    FinancialResponsibilitySection,
} from './SettingSections.jsx';


const backdropVariants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
};


const panelVariants = {
    visible: { x: 0 },
    hidden: { x: '100%' },
};

const EditProfilePanel = ({ isOpen, onClose, onSave, initialData }) => {
    const [userData, setUserData] = useState(initialData || {});

    useEffect(() => {
        if (isOpen) {
            setUserData(initialData || {});
        }
    }, [initialData, isOpen]);

    const handleInputChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (!name) return;

        if (type === 'file') {
            const reader = new FileReader();
            reader.onload = (upload) => setUserData(prev => ({ ...prev, [name]: upload.target.result }));
            if (files[0]) reader.readAsDataURL(files[0]);
        } else if (type === 'checkbox') {
            setUserData(prev => ({ ...prev, [name]: checked }));
        } else {
            setUserData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSave = () => {
        if (onSave) onSave(userData);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop Overlay */}
                    <motion.div
                        className="fixed inset-0 bg-black/50 z-40"
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        transition={{ duration: 0.3 }}
                        onClick={onClose}
                    >
                    </motion.div>

                    {/* The Sliding Panel */}
                    <motion.div
                        className="fixed top-0 right-0 h-full w-full max-w-2xl bg-gray-50 text-gray-900 shadow-2xl z-50"
                        variants={panelVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex flex-col h-full">
                            {/* Header - FIX: Removed all dark: classes */}
                            <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-white shrink-0">
                                <h2 className="text-xl font-semibold text-gray-900">Edit Profile</h2>
                                <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800">
                                    <X />
                                </button>
                            </header>

                            {/* Main Scrollable Content */}
                            <main className="flex-1 p-6 overflow-y-auto">
                                 <AboutMePrefSection userData={userData} handleChange={handleInputChange} />
                                <BasicProfileInfoSection userData={userData} handleChange={handleInputChange} />
                                <LifestyleHabitsSection userData={userData} handleChange={handleInputChange} />
                                <PersonalitySocialHabitsSection userData={userData} handleChange={handleInputChange} />
                                <FinancialResponsibilitySection userData={userData} handleChange={handleInputChange} />
                                <HealthInformationSection userData={userData} handleChange={handleInputChange} />

                            </main>

                            {/* Footer - FIX: Removed all dark: classes */}
                            <footer className="flex justify-end p-4 border-t border-gray-200 bg-white shrink-0">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 mr-2 border border-gray-300 rounded-md hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700"
                                >
                                    <Save size={16} className="mr-2" /> Save Changes
                                </button>
                            </footer>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default EditProfilePanel;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    PersonalInformationSection,
    SecuritySettingsSection,
    AccountManagementSection,
    DisplayAccessibilitySection,
    PrivacySettingsSection
} from './SettingSections.jsx';
import { User, Shield, Palette, Eye, Settings2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext.jsx';


const SettingsPage = () => {
    const [userData, setUserData] = useState({}); // State is kept for form inputs
    const [activeSection, setActiveSection] = useState('personal-info');
    const { authDataState } = useAuth();
    const { userInfo } = authDataState;
    useNavigate();

    // In a real app, you would fetch the user's settings data here
    useEffect(() => {
        // const fetchedData = await api.getUserSettings();
        // setUserData(fetchedData);
        setUserData(userInfo)
    }, [userInfo]);


    useEffect(() => {

        document.documentElement.classList.remove('dark');
    }, []);


    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUserData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSaveSettings = () => {
        // await api.saveUserSettings(userData);
        alert("Settings Saved!");
    };

    const navigationItems = [
        { id: 'personal-info', label: 'Personal Information', icon: User },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'privacy', label: 'Privacy Settings', icon: Eye },
        { id: 'display', label: 'Display', icon: Palette },
        { id: 'account', label: 'Account Management', icon: Settings2 },
    ];

    const renderContent = () => {
        switch (activeSection) {
            case 'personal-info': return <PersonalInformationSection userData={userData} handleChange={handleInputChange} />;
            case 'security': return <SecuritySettingsSection />;
            case 'privacy': return <PrivacySettingsSection userData={userData} handleChange={handleInputChange} />;
            case 'display': return <DisplayAccessibilitySection userData={userData} handleChange={handleInputChange} />;
            case 'account': return <AccountManagementSection />;
            default: return null;
        }
    };

      return (
        <div className="bg-gray-100 min-h-screen">
            <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
                    <p className="mt-1 text-sm text-gray-600">Manage your account, privacy, and display preferences.</p>
                </header>
                <div className="flex flex-col md:flex-row gap-8">
                    <nav className="md:w-1/4 lg:w-1/5">
                        <ul className="space-y-1">
                            {navigationItems.map(item => (
                                <li key={item.id}>
                                    <button
                                        onClick={() => setActiveSection(item.id)}
                                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-left ${activeSection === item.id ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-200'}`}
                                    >
                                        <item.icon className="mr-3 h-5 w-5" />
                                        {item.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <main className="md:w-3/4 lg:w-4/5">
                        {renderContent()}
                        <div className="mt-6 flex justify-end">
                             <button onClick={handleSaveSettings} className="px-6 py-2.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">Save All Changes</button>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
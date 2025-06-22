import React from 'react';

import {
  InputField, SelectField, TextareaField, ToggleSwitch, TagInput, SectionCard
} from './SettingsFieldComponents';
import {User, Shield, Info, Palette, Eye, LogOut, Trash2, Settings2, Sparkles, FileText, Users2, Activity, TrendingUp} from 'lucide-react';



/**
 * ----------------------------------------------------------
 * [Personal information section start
 * ----------------------------------------------------------
 */
export const PersonalInformationSection = ({ userData, handleChange }) => (
  <SectionCard title="Personal Information" icon={User}>
    <InputField label="First Name" id="firstName" name="firstName" value={userData.firstName} onChange={handleChange} required />
    <InputField label="Last Name" id="lastName" name="lastName" value={userData.lastName} onChange={handleChange} required />
    <InputField label="Email Address" id="email" name="email" type="email" value={userData.email} onChange={handleChange} required helpText={userData.isEmailVerified ? "Email is verified." : "Email not verified."} />
    <InputField label="Phone Number" id="phoneNumber" name="phoneNumber" type="tel" value={userData.phoneNumber} onChange={handleChange} helpText={userData.isPhoneVerified ? "Phone is verified." : "Phone not verified."} />
  </SectionCard>
);



/**
 * ----------------------------------------------------------
 * Security section start
 * ----------------------------------------------------------
 */
export const SecuritySettingsSection = () => {

    const [currentPassword, setCurrentPassword] = React.useState('');
    const [newPassword, setNewPassword] = React.useState('');
    const [confirmNewPassword, setConfirmNewPassword] = React.useState('');

    const handlePasswordChange = (e) => {
        e.preventDefault();
        if (newPassword !== confirmNewPassword) {
            alert("New passwords do not match!");
            return;
        }
        alert("Password change submitted (placeholder)!");
        setCurrentPassword(''); setNewPassword(''); setConfirmNewPassword('');
    };

    return (
        <SectionCard title="Security" icon={Shield}>
        <form onSubmit={handlePasswordChange} className="space-y-4">
            <InputField label="Current Password" id="currentPassword" name="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
            <InputField label="New Password" id="newPassword" name="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            <InputField label="Confirm New Password" id="confirmNewPassword" name="confirmNewPassword" type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required />
            <div className="flex justify-end">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Change Password
            </button>
            </div>
        </form>
        </SectionCard>
    );
};


/**
 * ----------------------------------------------------------
 * Account management section start
 * ----------------------------------------------------------
 */
export const AccountManagementSection = () => (
    <SectionCard title="Account Management" icon={Settings2}>
        <div className="space-y-4">
        <div>
          <h4 className="text-md font-medium text-gray-800 dark:text-gray-200">Deactivate Account</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Your profile will be hidden and you will be logged out. You can reactivate by logging back in.</p>
          <button onClick={() => { if (window.confirm("Are you sure?")) alert("Account deactivation placeholder.");}} className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 flex items-center"><LogOut size={16} className="mr-2" /> Deactivate Account</button>
        </div>
        <div className="border-t dark:border-gray-700 pt-4">
          <h4 className="text-md font-medium text-red-700 dark:text-red-500">Delete Account</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">This is permanent. All of your data will be erased forever.</p>
          <button onClick={() => { if (window.confirm("ARE YOU ABSOLUTELY SURE? THIS CANNOT BE UNDONE.")) alert("Account deletion placeholder.");}} className="px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-800 flex items-center"><Trash2 size={16} className="mr-2" /> Delete Account Permanently</button>
        </div>
      </div>
    </SectionCard>
);


/**
 * ----------------------------------------------------------
 * Basic info section start
 * ----------------------------------------------------------
 */
export const BasicProfileInfoSection = ({ userData, handleChange }) => (
  <SectionCard title="Basic Personal Information" icon={Info}>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Profile Picture</label>
        <div className="flex items-center gap-4">
          <img src={userData.profileImagePath || `https://placehold.co/100x100/E2E8F0/718096?text=${userData.firstName?.[0] || 'U'}${userData.lastName?.[0] || 'P'}`} alt="Profile" className="w-24 h-24 rounded-full object-cover border"/>
          <input type="file" id="profileImagePath" name="profileImagePath" onChange={handleChange} accept="image/*" className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
        </div>
      </div>
      <InputField label="Date of Birth" id="dateOfBirth" name="dateOfBirth" type="date" value={userData.dateOfBirth} onChange={handleChange} />
      <SelectField label="Sex/Gender" id="sex" name="sex" value={userData.sex} onChange={handleChange} options={["Male", "Female", "Non-binary", "Prefer not to say"]} />
      <InputField label="Nationality" id="nationality" name="nationality" value={userData.nationality} onChange={handleChange} />
      <TagInput label="Languages Spoken" id="languagesSpoken" name="languagesSpoken" value={userData.languagesSpoken} onChange={handleChange} />
      <InputField label="Occupation" id="occupation" name="occupation" value={userData.occupation} onChange={handleChange} />
  </SectionCard>
);


/**
 * ----------------------------------------------------------
 * Lifestyle and habbits section start
 * ----------------------------------------------------------
 */


export const LifestyleHabitsSection = ({ userData, handleChange }) => {
  const smokingOptions = [
  { label: "Never Smoked", value: "NEVER" },
  { label: "Smokes Occasionally", value: "OCCASIONAL" },
  { label: "Smokes Frequently", value: "FREQUENT" },
  { label: "Used to Smoke (Quit)", value: "QUIT" },
  { label: "Only Smokes Outside", value: "ONLY_OUTSIDE" }
];

const cleanlinessOptions = [
  { label: "Messy", value: "MESSY" },
  { label: "Average", value: "AVERAGE" },
  { label: "Very Clean", value: "VERY_CLEAN" },
  { label: "OCD Clean", value: "OCD_CLEAN" }
];

const dietaryOptions = [
  { label: "None", value: "NONE" },
  { label: "Vegetarian", value: "VEGETARIAN" },
  { label: "Vegan", value: "VEGAN" },
  { label: "Pescatarian", value: "PESCATARIAN" },
  { label: "Gluten-Free", value: "GLUTEN_FREE" },
  { label: "Halal", value: "HALAL" },
  { label: "Kosher", value: "KOSHER" },
  { label: "Dairy-Free", value: "DAIRY_FREE" },
  { label: "Nut Allergy", value: "NUT_ALLERGY" },
  { label: "Other", value: "OTHER" }
];

const sleepScheduleOptions = [
  { label: "Early Bird", value: "EARLY_BIRD" },
  { label: "Night Owl", value: "NIGHT_OWL" },
  { label: "Flexible", value: "FLEXIBLE" },
  { label: "Light Sleeper", value: "LIGHT_SLEEPER" },
  { label: "Heavy Sleeper", value: "HEAVY_SLEEPER" }
];

const comfortableWithGuestsOptions = [
  { label: "Frequent Guests", value: "FREQUENT_GUESTS" },
  { label: "Occasional Guests", value: "OCCASIONAL_GUESTS" },
  { label: "Prefers Privacy", value: "PREFERS_PRIVACY" },
  { label: "Only Approved Guests", value: "ONLY_APPROVED_GUESTS" }
];

const partyHabitsOptions = [
  { label: "Frequently", value: "FREQUENTLY" },
  { label: "Occasionally", value: "OCCASIONALLY" },
  { label: "Never", value: "NEVER" },
  { label: "Hosts Parties", value: "HOSTS_PARTIES" },
  { label: "Attends but Does Not Host", value: "ATTENDS_BUT_DOES_NOT_HOST" }
];

const sharesFoodOptions = [
  { label: "Willing to Share All", value: "WILLING_TO_SHARE_ALL" },
  { label: "Willing to Share Some", value: "WILLING_TO_SHARE_SOME" },
  { label: "Prefers Own Food", value: "PREFERS_OWN_FOOD" }
];

const preferredRoomTemperatureOptions = [
  { label: "Cold", value: "COLD" },
  { label: "Warm", value: "WARM" },
  { label: "Neutral", value: "NEUTRAL" },
  { label: "Any", value: "ANY" }
];


  
  return (
    <SectionCard title="Lifestyle & Habits" icon={Sparkles}>
      <SelectField
        label="Smoking Status"
        id="smokingStatus"
        name="smokingStatus"
        value={userData.smokingStatus}
        onChange={handleChange}
        options={smokingOptions}
      />

      <ToggleSwitch
        label="Do you have pets?"
        id="hasPets"
        name="hasPets"
        checked={!!userData.hasPets}
        onChange={handleChange}
      />
      {userData.hasPets && (
        <TagInput
          label="Pets Allowed/Owned"
          id="petsAllowed"
          name="petsAllowed"
          value={userData.petsAllowed}
          onChange={handleChange}
          placeholder="e.g., Cat"
        />
      )}

      <SelectField
        label="Cleanliness Level"
        id="cleanlinessLevel"
        name="cleanlinessLevel"
        value={userData.cleanlinessLevel}
        onChange={handleChange}
        options={cleanlinessOptions}
      />

      <SelectField
        label="Dietary Restrictions"
        id="dietaryRestrictions"
        name="dietaryRestrictions"
        value={userData.dietaryRestrictions}
        onChange={handleChange}
        options={dietaryOptions}
      />
      {userData.dietaryRestrictions === 'OTHER' && (
        <TagInput
          label="Other Dietary Restrictions"
          id="otherDietaryRestrictions"
          name="otherDietaryRestrictions"
          value={userData.otherDietaryRestrictions}
          onChange={handleChange}
          placeholder="e.g., Nut Allergy"
        />
      )}
      <SelectField label="Sleep Schedule" id="sleepSchedule" name="sleepSchedule" value={userData.sleepSchedule} onChange={handleChange} options={sleepScheduleOptions} />
      <SelectField label="Comfortable With Guests" id="comfortableWithGuests" name="comfortableWithGuests" value={userData.comfortableWithGuests} onChange={handleChange} options={comfortableWithGuestsOptions} />
      <SelectField label="Party Habits" id="partyHabits" name="partyHabits" value={userData.partyHabits} onChange={handleChange} options={partyHabitsOptions} />
      <SelectField label="Shares Food" id="sharesFood" name="sharesFood" value={userData.sharesFood} onChange={handleChange} options={sharesFoodOptions} />
      <SelectField label="Preferred Room Temperature" id="preferredRoomTemperature" name="preferredRoomTemperature" value={userData.preferredRoomTemperature} onChange={handleChange} options={preferredRoomTemperatureOptions} />
      <ToggleSwitch label="Willing to Share Bathroom" id="willingToShareBathroom" name="willingToShareBathroom" checked={!!userData.willingToShareBathroom} onChange={handleChange} />
    </SectionCard>
  )
};


/**
 * ----------------------------------------------------------
 * Health information section start
 * ----------------------------------------------------------
 */
// NEW SECTION
export const HealthInformationSection = ({ userData, handleChange }) =>{ 

  const addictionStatusOptions = [
    { label: "None", value: "NONE" },
    { label: "Alcohol", value: "ALCOHOL" },
    { label: "Drugs", value: "DRUGS" },
    { label: "Nicotine", value: "NICOTINE" },
    { label: "Multiple", value: "MULTIPLE" }
  ];


  return (
    <SectionCard title="Health & Accessibility" icon={Activity}>
        <ToggleSwitch label="Have existing medical conditions?" id="hasMedicalConditions" name="hasMedicalConditions" checked={!!userData.hasMedicalConditions} onChange={handleChange} />
        {userData.hasMedicalConditions && (
            <TagInput label="Medical Conditions" id="medicalConditions" name="medicalConditions" value={userData.medicalConditions} onChange={handleChange} placeholder="e.g., Asthma" helpText="Only shared with confirmed roommates." />
        )}
        <ToggleSwitch label="Do you have a disability?" id="isDisabled" name="isDisabled" checked={!!userData.isDisabled} onChange={handleChange} />
        {userData.isDisabled && (
            <InputField label="Disability Details" id="disability" name="disability" value={userData.disability} onChange={handleChange} placeholder="e.g., Wheelchair user" />
        )}
    </SectionCard>
)};


/**
 * ----------------------------------------------------------
 * Personality and social habit section start
 * ----------------------------------------------------------
 */
// NEW SECTION
export const PersonalitySocialHabitsSection = ({ userData, handleChange }) => {
  const personalityTypeOptions = [
    { label: "Introvert", value: "INTROVERT" },
    { label: "Extrovert", value: "EXTROVERT" },
    { label: "Ambivert", value: "AMBIVERT" }
  ];

  const noiseToleranceOptions = [
    { label: "High", value: "HIGH" },
    { label: "Medium", value: "MEDIUM" },
    { label: "Low", value: "LOW" }
  ];

  const enjoysSocializingWithRoommatesOptions = [
    { label: "Yes", value: "YES" },
    { label: "No", value: "NO" },
    { label: "Sometimes", value: "SOMETIMES" }
  ];


  
  return (
    <SectionCard title="Personality & Social Habits" icon={Users2}>
        <SelectField label="Personality Type" id="personalityType" name="personalityType" value={userData.personalityType} onChange={handleChange} options={personalityTypeOptions} />
        <SelectField label="Noise Tolerance" id="noiseTolerance" name="noiseTolerance" value={userData.noiseTolerance} onChange={handleChange} options={noiseToleranceOptions} />
        <SelectField label="Socializing with Roommates" id="enjoysSocializingWithRoommates" name="enjoysSocializingWithRoommates" value={userData.enjoysSocializingWithRoommates} onChange={handleChange} options={enjoysSocializingWithRoommatesOptions} />
    </SectionCard>
)};


/**
 * ----------------------------------------------------------
 * Financial section start
 * ----------------------------------------------------------
 */

// NEW SECTION
export const FinancialResponsibilitySection = ({ userData, handleChange }) => (
  <SectionCard title="Financial Responsibility" icon={TrendingUp}>
    <ToggleSwitch label="Willing to Split Utilities" id="willingToSplitUtilities" name="willingToSplitUtilities" checked={!!userData.willingToSplitUtilities} onChange={handleChange} />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InputField label="Monthly Income (Optional)" id="monthlyIncome" name="monthlyIncome" type="number" value={userData.monthlyIncome} onChange={handleChange} />
      <InputField label="Income Currency" id="incomeCurrency" name="incomeCurrency" value={userData.incomeCurrency} onChange={handleChange} placeholder="e.g., USD" />
    </div>
  </SectionCard>
);


/**
 * ----------------------------------------------------------
 * About me section start
 * ----------------------------------------------------------
 */
export const AboutMePrefSection = ({ userData, handleChange }) => (
  <SectionCard title="About Me" icon={FileText}>
    <TextareaField label="Bio / About Me" id="aboutMe" name="aboutMe" value={userData.aboutMe} onChange={handleChange} rows={5} maxLength={5000} />
  </SectionCard>
);


/**
 * ----------------------------------------------------------
 * Accessibility section section start
 * ----------------------------------------------------------
 */

export const DisplayAccessibilitySection = ({ userData, handleChange }) => (
  <SectionCard title="Display & Accessibility" icon={Palette}>
    <SelectField label="Theme" id="theme" name="theme" value={userData.theme} onChange={handleChange} options={["Light Mode", "Dark Mode", "System Default"]} />
  </SectionCard>
);


/**
 * ----------------------------------------------------------
 * Privacy section start
 * ----------------------------------------------------------
 */

export const PrivacySettingsSection = ({ userData, handleChange }) => (
  <SectionCard title="Privacy Settings" icon={Eye}>
    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Control who can see certain parts of your profile.</p>
    <SelectField label="Phone Number Visibility" id="phoneNumberVisibility" name="phoneNumberVisibility" value={userData.phoneNumberVisibility} onChange={handleChange} options={["Everyone", "Connections Only", "Only Me"]} />
    <SelectField label="Email Visibility" id="emailVisibility" name="emailVisibility" value={userData.emailVisibility} onChange={handleChange} options={["Everyone", "Connections Only", "Only Me"]} />
    <SelectField label="Lifestyle Habits Visibility" id="lifestyleHabitsVisibility" name="lifestyleHabitsVisibility" value={userData.lifestyleHabitsVisibility} onChange={handleChange} options={["Everyone", "Connections Only"]} />
  </SectionCard>
);
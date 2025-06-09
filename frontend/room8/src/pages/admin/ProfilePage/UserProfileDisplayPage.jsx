
import React from 'react';
import {
    Mail,
    Phone,
    Briefcase,
    Languages,
    Globe,
    Info,
    Edit,
    Award,
    ShieldCheck,
    Sparkles,
    Cigarette,
    PawPrint,
    FileText,
    Users2,
    TrendingUp,
    Activity
} from 'lucide-react';


const getDisplayValue = (value, visibility = 'Everyone') => {
  const viewerIsOwner = true;
  const viewerIsConnection = true;

  if (visibility === 'Everyone') return value || 'N/A';
  if (visibility === 'Connections Only' && (viewerIsOwner || viewerIsConnection)) return value || 'N/A';
  if (visibility === 'Only Me' && viewerIsOwner) return value || 'N/A';

  return `Private`;
};

const DetailItem = ({ icon: Icon, label, value }) => {
  let valueClass = "text-gray-700";
  if (!value || value === 'N/A') valueClass = "text-gray-400";
  if (value === 'Private') valueClass = "text-gray-500 italic";

  return (
    <div className="flex items-start space-x-3">
      {Icon && <Icon className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />}
      <div>
        <span className="font-medium text-gray-800">{label}:</span>
        <span className={`ml-2 ${valueClass}`}>{value}</span>
      </div>
    </div>
  );
};

// This component creates a styled section container.
// FIX: Removed dark mode classes to ensure visibility on a white background
const ProfileSection = ({ title, icon: Icon, children }) => (
  <div className="mb-8 p-6 bg-white rounded-lg shadow">
    <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200 flex items-center">
      {Icon && <Icon className="w-6 h-6 mr-3 text-blue-600" />}
      {title}
    </h2>
    <div className="space-y-4">{children}</div>
  </div>
);


const UserProfileDisplayPage = ({ profileData, onEditProfile }) => {
    if (!profileData) {
        return <div className="text-center p-10">No profile data available.</div>;
    }

     const {
        firstName = '', lastName = '', email = '', phoneNumber = '', role = [], profileImagePath = '',
        occupation = '', nationality = '', languagesSpoken = [], aboutMe = '',
        smokingStatus = '', hasPets = false, petsAllowed = [], cleanlinessLevel = '',
        phoneNumberVisibility = 'Only Me', emailVisibility = 'Only Me', lifestyleHabitsVisibility = 'Connections Only',
        isEmailVerified = false, isPhoneVerified = false,
        // New fields
        dietaryRestrictions, otherDietaryRestrictions = [], sleepSchedule, comfortableWithGuests,
        partyHabits, sharesFood, preferredRoomTemperature, willingToShareBathroom,
        hasMedicalConditions, medicalConditions = [], isDisabled, disability,
        personalityType, noiseTolerance, enjoysSocializingWithRoommates,
        willingToSplitUtilities, monthlyIncome, incomeCurrency
    } = profileData;

    const displayName = `${firstName} ${lastName}`.trim() || 'User';
    const isOwner = true; // Placeholder for your app's auth logic

    const displayEmail = getDisplayValue(email, emailVisibility);
    const displayPhone = getDisplayValue(phoneNumber, phoneNumberVisibility);

    const lifestyleInfoVisible = lifestyleHabitsVisibility === 'Everyone' || isOwner;


    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Profile Header */}
                <div className="bg-white shadow-xl rounded-lg overflow-hidden mb-8">
                    <div className="relative h-48 sm:h-56 bg-gradient-to-r from-blue-500 to-indigo-600">
                        <img
                            src={profileImagePath || `https://placehold.co/150x150/E2E8F0/718096?text=${firstName?.[0] || 'U'}${lastName?.[0] || 'P'}`}
                            alt="Profile"
                            className="w-32 h-32 sm:w-36 sm:h-36 rounded-full border-4 border-white object-cover shadow-lg absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"
                        />
                         {role.length > 0 && (
                            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium capitalize">
                                <Award className="inline w-4 h-4 mr-1.5" />
                                {(Array.isArray(role) ? role.join(' & ') : role)}
                            </div>
                        )}
                    </div>
                    {/* FIX: Removed dark mode text classes to ensure visibility */}
                    <div className="pt-20 pb-8 px-6 text-center">
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">{displayName}</h1>
                        {occupation && <p className="text-md text-gray-600 mb-3 flex items-center justify-center"><Briefcase size={16} className="mr-2 text-gray-500" /> {occupation}</p>}

                        <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-gray-500 mb-6">
                            <span className="flex items-center">
                                <Mail size={14} className="mr-1.5" /> {displayEmail}
                                {isEmailVerified && displayEmail !== 'Private' && <ShieldCheck size={14} className="ml-1 text-green-500" title="Email Verified" />}
                            </span>
                            <span className="flex items-center">
                                <Phone size={14} className="mr-1.5" /> {displayPhone}
                                {isPhoneVerified && displayPhone !== 'Private' && <ShieldCheck size={14} className="ml-1 text-green-500" title="Phone Verified" />}
                            </span>
                        </div>

                        {isOwner && (
                            <button onClick={onEditProfile} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-colors duration-150 flex items-center mx-auto">
                                <Edit size={18} className="mr-2" /> Edit Profile
                            </button>
                        )}
                    </div>
                </div>

                {/* Sections */}
                {/* FIX: The 'p' tag below will now inherit the correct text color from the updated ProfileSection component */}
                {aboutMe && <ProfileSection title="About Me" icon={Info}><p className="text-gray-700 whitespace-pre-line leading-relaxed">{aboutMe}</p></ProfileSection>}

                <ProfileSection title="Key Information" icon={FileText}>
                    <DetailItem icon={Globe} label="Nationality" value={nationality} />
                    {languagesSpoken.length > 0 && <DetailItem icon={Languages} label="Languages Spoken" value={languagesSpoken.join(', ')} />}
                </ProfileSection>

                {lifestyleInfoVisible && (
                    <ProfileSection title="Lifestyle & Habits" icon={Sparkles}>
                    <DetailItem icon={Sparkles} label="Cleanliness Level" value={cleanlinessLevel} />
                    <DetailItem icon={Cigarette} label="Smoking Status" value={smokingStatus} />
                    <DetailItem icon={PawPrint} label="Pets" value={hasPets ? (petsAllowed.length > 0 ? `Yes (${petsAllowed.join(', ')})` : "Yes") : "No pets"} />
                    <DetailItem label="Dietary Restrictions" value={dietaryRestrictions === 'Other' && otherDietaryRestrictions.length > 0 ? `Other (${otherDietaryRestrictions.join(', ')})` : dietaryRestrictions} />
                    <DetailItem label="Sleep Schedule" value={sleepSchedule} />
                    <DetailItem label="Guests" value={comfortableWithGuests} />
                    <DetailItem label="Party Habits" value={partyHabits} />
                    <DetailItem label="Shares Food" value={sharesFood} />
                    <DetailItem label="Room Temperature" value={preferredRoomTemperature} />
                    <DetailItem label="Willing to Share Bathroom" value={willingToShareBathroom ? 'Yes' : 'No'} />
                </ProfileSection>
                )}
                  {/* NEW: Personality & Social Habits Section */}
                <ProfileSection title="Personality & Social Habits" icon={Users2}>
                    <DetailItem label="Personality Type" value={personalityType} />
                    <DetailItem label="Noise Tolerance" value={noiseTolerance} />
                    <DetailItem label="Enjoys Socializing" value={enjoysSocializingWithRoommates} />
                </ProfileSection>

                {/* NEW: Financial Responsibility Section */}
                <ProfileSection title="Financial Snapshot" icon={TrendingUp}>
                    <DetailItem label="Willing to Split Utilities" value={willingToSplitUtilities ? 'Yes' : 'No'} />
                    {monthlyIncome && <DetailItem label="Monthly Income" value={`${monthlyIncome.toLocaleString()} ${incomeCurrency}`} />}
                </ProfileSection>

                {/* NEW: Health & Accessibility Section */}
                <ProfileSection title="Health & Accessibility" icon={Activity}>
                    <DetailItem label="Has Medical Conditions" value={hasMedicalConditions ? `Yes (${medicalConditions.join(', ')})` : 'No'} />
                    <DetailItem label="Has a Disability" value={isDisabled ? `Yes (${disability})` : 'No'} />
                </ProfileSection>
            </div>
        </div>
    );
};

export default UserProfileDisplayPage;
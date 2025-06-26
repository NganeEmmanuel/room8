import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useBidService } from '../../../services/useBidService';
import { useUserService } from '../../../services/userService/userService.js';
import ConfirmModal from '../../../components/shared/ConfirmModal';
import Spinner from '../../ListingDetailsPage/components/Spinner';

// --- ICON IMPORTS ---
import {
  ChevronLeft, User, Mail, Phone, FileText, Check, X, Trash2, EyeOff, Home,
  Building, Languages, Droplets, Utensils, BedDouble, Thermometer,
  UserCheck, Heart, Users, DollarSign, Snowflake, PlusCircle, Bath, PartyPopper
} from 'lucide-react';

// --- HELPER COMPONENTS ---
const ToggleSwitch = ({ id, checked, onChange, label, description }) => (
    <div className="flex items-center justify-between p-4 rounded-lg bg-gray-100 border border-gray-200">
        <div className="pr-4">
            <label htmlFor={id} className="font-medium text-gray-900">{label}</label>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
        <button type="button" id={id} onClick={() => onChange(!checked)} className={`${checked ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`} role="switch" aria-checked={checked}>
            <span aria-hidden="true" className={`${checked ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}/>
        </button>
    </div>
);
const InfoItem = ({ icon: Icon, label, value, isBoolean = false }) => {
    let displayValue = value;
    if (isBoolean) displayValue = value ? 'Yes' : 'No';
    return (
        <div className="p-4 bg-gray-50 rounded-lg"><div className="flex items-start space-x-3">{Icon && <Icon className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />}<div><p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p><p className="text-md font-medium text-gray-800 break-words">{displayValue || 'N/A'}</p></div></div></div>
    );
};
const InfoSection = ({ title, children }) => (
    <section className="bg-white shadow rounded-lg p-6 mb-8"><h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">{title}</h3><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{children}</div></section>
);


// --- MAIN PAGE COMPONENT ---
const BidDetailsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { bidId } = useParams();

  const { removeBid, updateBid, updateBidStatus, getBid } = useBidService();
  const { getUserData } = useUserService();

  const [bid, setBid] = useState(location.state?.bid || null);
  const [detailedUserInfo, setDetailedUserInfo] = useState(bid?.bidderInfo?.userInfo || null);
  const [isLoading, setIsLoading] = useState(!bid);
  const [isConfirmingWithdraw, setIsConfirmingWithdraw] = useState(false);

  const [shareInfo, setShareInfo] = useState(bid?.isShareInfo || false);

  const fetchBidAndUserDetails = useCallback(async () => {
      setIsLoading(true);
      try {
        const bidData = await getBid(bidId);
        setBid(bidData);
        setShareInfo(bidData.isShareInfo);

        // If sharing is enabled, fetch the detailed user profile.
        if (bidData.isShareInfo) {
          const profileData = await getUserData(bidData.bidderId);
          setDetailedUserInfo(profileData);
        }
      } catch (error) {
        toast.error("Could not load bid details.");
        navigate("/admin/dashboard");
      } finally {
        setIsLoading(false);
      }
    }, [bidId, navigate, getBid, getUserData]);

  useEffect(() => {
    // If we have the basic bid data but not the user details (e.g., from a previous page),
    // or if we have nothing at all (e.g., page refresh), we need to fetch.
    if (!bid || (bid.isShareInfo && !detailedUserInfo)) {
        fetchBidAndUserDetails();
    }
  }, [bid, detailedUserInfo, fetchBidAndUserDetails]);


  const handleSharingToggle = async (newSharingStatus) => {
    if (!bid) return;
    setShareInfo(newSharingStatus);
    try {
        const updatedBidData = { proposal: bid.proposal, shareUserInfo: newSharingStatus };
        await updateBid(bid.id, updatedBidData, bid.listingId);
        toast.success("Sharing preference updated.");
    } catch(error) {
        toast.error("Failed to update preference.");
        setShareInfo(!newSharingStatus);
    }
  };

  const handleWithdraw = async () => {
    if (!bid) return;
    try {
      await removeBid(bid.id);
      toast.success(`Your bid for "${bid.listingTitle}" has been withdrawn.`);
      navigate(-1);
    } catch (error) {
      console.error(error);
    } finally {
      setIsConfirmingWithdraw(false);
    }
  };

  const handleAccept = async () => {
      if (!bid) return;
      try {
          await updateBidStatus(bid.id, 'ACCEPTED');
          navigate(-1);
      } catch (error) {
          console.error("Failed to accept bid:", error);
      }
  };

  const handleReject = async () => {
      if (!bid) return;
      try {
          await updateBidStatus(bid.id, 'REJECTED');
          navigate(-1);
      } catch (error) {
          console.error("Failed to reject bid:", error);
      }
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (!bid) {
    return <div className="p-8 text-center text-red-500">Bid not found. Please go back.</div>;
  }

  const { listingTitle, bidderInfo, proposal, bidStatus, listingId } = bid;
  const userInfoToDisplay = detailedUserInfo || bid?.bidderInfo?.userInfo || {};
  const shouldDisplayInfo = location.state?.isLandlordView && shareInfo;

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
            <button onClick={() => navigate(-1)} className="flex items-center text-sm font-medium text-gray-600 hover:text-blue-600"><ChevronLeft size={20} className="mr-1" /> Back to Bids</button>
            <div className="text-right"><p className="text-xs text-gray-500">Bid for</p><Link to={`/listingDetails/${listingId}`} className="text-md font-semibold text-blue-600 truncate hover:underline">{listingTitle}</Link></div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center">
              <img className="h-16 w-16 rounded-full object-cover mr-4" src={bidderInfo?.profileImage || `https://ui-avatars.com/api/?name=${bidderInfo?.name.replace(/\s/g, '+')}`} alt="Bidder" />
              <div>
                  <h1 className="text-2xl font-bold text-gray-900">{bidderInfo?.name}</h1>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-gray-500 mt-1">
                      <span className="flex items-center"><Mail size={14} className="mr-1.5" /> {bidderInfo?.email}</span>
                      <span className="flex items-center mt-1 sm:mt-0"><Phone size={14} className="mr-1.5" /> {bidderInfo?.phoneNumber}</span>
                  </div>
              </div>
          </div>
          <div className={`px-3 py-1 text-sm font-semibold rounded-full shrink-0 ${bidStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>{bidStatus ? bidStatus.charAt(0).toUpperCase() + bidStatus.slice(1).toLowerCase() : 'Unknown'}</div>
        </div>

        <section className="bg-white shadow rounded-lg p-6 mb-8">
            <h3 className="text-lg font-medium text-gray-900 flex items-center mb-3"><FileText size={18} className="mr-2 text-blue-500" /> Bid Proposal</h3>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">{proposal}</p>
        </section>

        {location.state?.isTenantView && (
          <InfoSection title="Profile Sharing Settings">
              <div className="md:col-span-2 lg:col-span-3">
                <p className="text-gray-600 mb-4 text-sm">You control whether the landlord can see your detailed profile. This can be changed any time before the bid is actioned.</p>
                <ToggleSwitch
                    id="shareUserInfoTenantView"
                    checked={shareInfo}
                    onChange={handleSharingToggle}
                    label={shareInfo ? "Information is being shared" : "Information is Private"}
                    description={shareInfo ? "The landlord can see your detailed profile." : "The landlord can only see your name and proposal."}
                />
              </div>
          </InfoSection>
        )}

        {shouldDisplayInfo ? (

          <>
            <InfoSection title="Basic & Professional Information">
                <InfoItem icon={Building} label="Occupation" value={userInfoToDisplay.occupation}  />
                <InfoItem icon={UserCheck} label="Employment Status" value={userInfoToDisplay.employmentStatus} />
                <InfoItem icon={Home} label="Nationality" value={userInfoToDisplay.nationality} />
                <InfoItem icon={Languages} label="Languages Spoken" value={Array.isArray(userInfoToDisplay.languagesSpoken) ? userInfoToDisplay.languagesSpoken.join(', ') : 'N/A'} />
            </InfoSection>
            <InfoSection title="Lifestyle & Habits">
                <InfoItem icon={Snowflake} label="Smoking Status" value={userInfoToDisplay.smokingStatus} />
                <InfoItem icon={EyeOff} label="Addiction Status" value={userInfoToDisplay.addictionStatus} />
                <InfoItem icon={Heart} label="Has Pets" value={userInfoToDisplay.hasPets ? `Yes (${userInfoToDisplay.petPreference || 'unspecified'})` : 'No'} />
                <InfoItem icon={Droplets} label="Cleanliness Level" value={userInfoToDisplay.cleanlinessLevel} />
                <InfoItem icon={BedDouble} label="Sleep Schedule" value={userInfoToDisplay.sleepSchedule} />
                <InfoItem icon={Users} label="Comfortable With Guests" value={userInfoToDisplay.comfortableWithGuests} />
                <InfoItem icon={PartyPopper} label="Party Habits" value={userInfoToDisplay.partyHabits} />
                <InfoItem icon={Utensils} label="Shares Food" value={userInfoToDisplay.sharesFood} />
                <InfoItem icon={Thermometer} label="Preferred Room Temperature" value={userInfoToDisplay.preferredRoomTemperature} />
                <InfoItem icon={Bath} label="Willing to Share Bathroom" isBoolean value={userInfoToDisplay.willingToShareBathroom} />
                <InfoItem icon={Utensils} label="Dietary Restrictions" value={userInfoToDisplay.dietaryRestrictions} />
            </InfoSection>
            <InfoSection title="Health Information">
                <InfoItem icon={PlusCircle} label="Has Medical Conditions" isBoolean value={userInfoToDisplay.hasMedicalConditions} />
                {userInfoToDisplay.hasMedicalConditions && <InfoItem icon={Heart} label="Conditions" value={Array.isArray(userInfoToDisplay.medicalConditions) ? userInfoToDisplay.medicalConditions.join(', ') : 'N/A'} />}
                <InfoItem icon={User} label="Has Disability" isBoolean value={userInfoToDisplay.isDisabled} />
                {userInfoToDisplay.isDisabled && <InfoItem icon={FileText} label="Disability Details" value={userInfoToDisplay.disability} />}
            </InfoSection>
            <InfoSection title="Personality & Social Habits">
                <InfoItem icon={User} label="Personality Type" value={userInfoToDisplay.personalityType} />
                <InfoItem icon={UserCheck} label="Noise Tolerance" value={userInfoToDisplay.noiseTolerance} />
                <InfoItem icon={Users} label="Enjoys Socializing?" value={userInfoToDisplay.enjoysSocializingWithRoommates} />
            </InfoSection>
            <InfoSection title="Financial Responsibility">
                <InfoItem icon={DollarSign} label="Willing to Split Utilities" isBoolean value={userInfoToDisplay.willingToSplitUtilities} />
                <InfoItem icon={DollarSign} label="Monthly Income" value={userInfoToDisplay.monthlyIncome ? `${userInfoToDisplay.incomeCurrency} ${userInfoToDisplay.monthlyIncome.toLocaleString()}` : 'Not Disclosed'} />
            </InfoSection>
          </>
        ) : (
          !location.state?.isTenantView && (
            <div className="text-center py-12 px-6 bg-white rounded-lg shadow border">
                <EyeOff className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800">Detailed Profile is Private</h3>
                <p className="text-gray-500 mt-2 max-w-md mx-auto">
                  The tenant has chosen not to share their detailed profile information for this bid.
                </p>
            </div>
          )
        )}
      </main>

      <footer className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-lg z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-end space-x-4">
            {location.state?.isTenantView && bidStatus === 'PENDING' && (
              <button onClick={() => setIsConfirmingWithdraw(true)} className="px-6 py-3 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 flex items-center">
                <Trash2 size={18} className="mr-2" /> Withdraw Bid
              </button>
            )}
            {location.state?.isLandlordView && bidStatus === 'PENDING' && (
              <>
                <button onClick={handleReject} className="px-6 py-3 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center"><X size={18} className="mr-2" /> Reject</button>
                <button onClick={handleAccept} className="px-6 py-3 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 flex items-center"><Check size={18} className="mr-2" /> Accept Bid</button>
              </>
            )}
          </div>
        </footer>

      <ConfirmModal
        isOpen={isConfirmingWithdraw}
        onClose={() => setIsConfirmingWithdraw(false)}
        onConfirm={handleWithdraw}
        title="Confirm Withdrawal"
      >
        Are you sure you want to withdraw this bid? This cannot be undone.
      </ConfirmModal>
    </div>
  );
};

export default BidDetailsPage;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, XSquare, Eye, ChevronLeft, ChevronRight, Save } from 'lucide-react';
import ListingCard from '../../../components/ListingCard/ListingCard';
import { FormInput, FormTextarea, FormSelect, FormToggle } from '../../../components/shared/FormComponents';

// eslint-disable-next-line react-refresh/only-export-components
export const BathroomLocation = { INDOOR: 'Indoor', OUTDOOR: 'Outdoor' };
// eslint-disable-next-line react-refresh/only-export-components
export const ListingStyle = { MODERN: 'Modern', CONCRETE: 'Concrete', WOODEN: 'Wooden', CLASSIC: 'Classic' };

const ListingForm = ({ initialData, onFormSubmit, pageTitle, submitButtonText }) => {
  const navigate = useNavigate();
  const [listingData, setListingData] = useState(initialData);
  const [imagePreviews, setImagePreviews] = useState(initialData.imagePreviews || []);
  const [showPreviewPane, setShowPreviewPane] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setListingData(initialData);
    setImagePreviews(initialData.imagePreviews || []);
  }, [initialData]);

  useEffect(() => {
    const handleResize = () => {
      const mobileCheck = window.innerWidth < 768;
      setIsMobile(mobileCheck);
      setShowPreviewPane(!mobileCheck);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (errors[name]) {
        setErrors(prev => { const newErrors = { ...prev }; delete newErrors[name]; return newErrors; });
    }

    if (type === 'file' && name === 'images') {
      if (errors.images) {
        setErrors(prev => { const newErrors = { ...prev }; delete newErrors.images; return newErrors; });
      }
      if (files && files.length > 0) {
        const newImageFiles = Array.from(files);
        setListingData(prev => ({ ...prev, images: [...(prev.images || []), ...newImageFiles].slice(0, 5) }));
        const currentPreviewsCount = imagePreviews.length;
        const filesToPreview = newImageFiles.slice(0, 5 - currentPreviewsCount);
        filesToPreview.forEach(file => {
          const reader = new FileReader();
          reader.onloadend = () => { setImagePreviews(prev => [...prev, reader.result].slice(0, 5)); };
          reader.readAsDataURL(file);
        });
      }
    } else if (type === 'checkbox') {
      setListingData(prev => ({ ...prev, [name]: checked }));
    } else {
      setListingData(prev => ({ ...prev, [name]: value }));
    }
  };

  const removeImage = (indexToRemove) => {
    setListingData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== indexToRemove) }));
    setImagePreviews(prev => prev.filter((_, i) => i !== indexToRemove));
  };

  const sections = [ 'Basic Info', 'Location & Price', 'Property Details', 'Household', 'Images' ];

  const validateStep = () => {
    const newErrors = {};
    const requiredFields = {
      0: ['listingTitle', 'listingDescription', 'listingStyle'],
      1: ['listingCountry', 'listingState', 'listingCity', 'listingStreet', 'listingPrice'],
      2: ['numberOfRooms', 'roomArea', 'numberOfBathrooms', 'numberOfKitchens'],
      3: ['numberOfHouseMates'],
      4: [],
    };

    if (requiredFields[currentStep]) {
        requiredFields[currentStep].forEach(field => {
            const value = listingData[field];
            if (value === null || value === undefined || value === '') { newErrors[field] = 'This field is required'; }
        });
    }

    if (currentStep === 4) {
      if (listingData.images.length === 0 && imagePreviews.length === 0) {
        newErrors.images = "At least one image is required.";
        alert("Please upload at least one image to continue.");
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, sections.length - 1));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    for (let i = 0; i < sections.length; i++) {
      const tempStepCheck = { ...listingData };
      const stepFields = {
          0: ['listingTitle', 'listingDescription', 'listingStyle'],
          1: ['listingCountry', 'listingState', 'listingCity', 'listingStreet', 'listingPrice'],
          2: ['numberOfRooms', 'roomArea', 'numberOfBathrooms', 'numberOfKitchens'],
          3: ['numberOfHouseMates'],
          4: [],
      }[i];

      let stepIsValid = true;
      stepFields.forEach(field => {
          if (tempStepCheck[field] === null || tempStepCheck[field] === undefined || tempStepCheck[field] === '') {
              stepIsValid = false;
          }
      });

      if (i === 4 && tempStepCheck.images.length === 0 && (tempStepCheck.imagePreviews || []).length === 0) {
          stepIsValid = false;
      }

      if (!stepIsValid) {
          setCurrentStep(i);
          alert(`Please fill out all required fields on the '${sections[i]}' step before submitting.`);
          return;
      }
    }
    onFormSubmit(listingData);
  };

  const listingCardPreviewProps = {
    title: listingData.listingTitle || "Your Listing Title",
    location: `${listingData.listingCity || 'City'}, ${listingData.listingState || 'State'}`,
    price: listingData.listingPrice ? `${Number(listingData.listingPrice).toLocaleString()}` : "0 ",
    currency: "FCFA",
    image: imagePreviews[0] || 'https://placehold.co/400x250/E2E8F0/A0AEC0?text=Upload+Image',
    roomType: ListingStyle[listingData.listingStyle] || 'N/A',
    toilets: Number(listingData.numberOfBathrooms) || 0,
    kitchen: Number(listingData.numberOfKitchens) || 0,
    roommates: Number(listingData.numberOfHouseMates) || 0,
    rooms: Number(listingData.numberOfRooms) || 0,
    size: listingData.roomArea ? `${listingData.roomArea} sq m` : 'N/A',
    listingId: 'preview-id',
    isLandlordView: true,
    buttonsDisabled: true,
    views: 0,
    bids: 0,
  };

  return (
    <div className="min-h-screen bg-gray-100">
        <div className="bg-white shadow-sm sticky top-0 z-30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-blue-600 p-2 rounded-md -ml-2">
                            <ChevronLeft size={24} />
                        </button>
                        <h1 className="text-xl font-semibold text-gray-900 ml-2">{pageTitle}</h1>
                    </div>
                    <div className="flex items-center space-x-3">
                        {isMobile && (
                            <button onClick={() => setShowPreviewPane(!showPreviewPane)} className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 flex items-center">
                                <Eye size={16} className="mr-2" /> Preview
                            </button>
                        )}
                        <button type="button" onClick={handleSubmit} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center">
                            <Save size={16} className="mr-2"/> {submitButtonText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className={`flex flex-col ${isMobile ? '' : 'md:flex-row'} gap-8`}>
                <div className={`w-full ${isMobile ? (showPreviewPane ? 'hidden' : 'block') : 'md:w-3/5 lg:w-2/3'} order-2 md:order-1`}>
                    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg">
                        <div className="mb-8">
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-blue-700">{sections[currentStep]}</span>
                                <span className="text-sm text-gray-500">Step {currentStep + 1} of {sections.length}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${((currentStep + 1) / sections.length) * 100}%` }}></div>
                            </div>
                        </div>
                        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                            {currentStep === 0 && (
                                <section>
                                    <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4 border-b pb-2">Basic Information</h3>
                                    <FormInput label="Listing Title" name="listingTitle" value={listingData.listingTitle} onChange={handleChange} required error={errors.listingTitle} placeholder="e.g., Cozy Room in Downtown Apartment" />
                                    <FormTextarea label="Listing Description" name="listingDescription" value={listingData.listingDescription} onChange={handleChange} required rows={5} error={errors.listingDescription} placeholder="Detailed description of the property..." />
                                    <FormSelect label="Property Type/Style" name="listingStyle" value={listingData.listingStyle} onChange={handleChange} options={ListingStyle} required error={errors.listingStyle} />
                                </section>
                            )}
                            {currentStep === 1 && (
                                <section>
                                    <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4 border-b pb-2">Location & Price</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                                        <FormInput label="Country" name="listingCountry" value={listingData.listingCountry} onChange={handleChange} required error={errors.listingCountry} placeholder="e.g., Cameroon" />
                                        <FormInput label="State/Province" name="listingState" value={listingData.listingState} onChange={handleChange} required error={errors.listingState} placeholder="e.g., Centre" />
                                    </div>
                                    <FormInput label="City" name="listingCity" value={listingData.listingCity} onChange={handleChange} required error={errors.listingCity} placeholder="e.g., Yaoundé" />
                                    <FormInput label="Street Address" name="listingStreet" value={listingData.listingStreet} onChange={handleChange} required error={errors.listingStreet} placeholder="e.g., 123 Main St" />
                                    <FormInput label="Price per Month (FCFA)" name="listingPrice" type="number" value={listingData.listingPrice} onChange={handleChange} required error={errors.listingPrice} placeholder="e.g., 80000" min="0" />
                                </section>
                            )}
                            {currentStep === 2 && (
                                <section>
                                    <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4 border-b pb-2">Property Details</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                                        <FormInput label="Number of Rooms" name="numberOfRooms" type="number" value={listingData.numberOfRooms} onChange={handleChange} required min="1" error={errors.numberOfRooms} />
                                        <FormInput label="Total Area (sq m)" name="roomArea" type="number" value={listingData.roomArea} onChange={handleChange} required placeholder="e.g., 15" min="1" error={errors.roomArea} />
                                        <FormInput label="Number of Bathrooms" name="numberOfBathrooms" type="number" value={listingData.numberOfBathrooms} onChange={handleChange} required min="0" error={errors.numberOfBathrooms} />
                                        <FormInput label="Bathroom Area (sq m)" name="bathroomArea" type="number" value={listingData.bathroomArea} onChange={handleChange} placeholder="e.g., 5" min="0"/>
                                        <FormInput label="Number of Kitchens" name="numberOfKitchens" type="number" value={listingData.numberOfKitchens} onChange={handleChange} required min="0" error={errors.numberOfKitchens} />
                                        <FormInput label="Kitchen Area (sq m)" name="kitchenArea" type="number" value={listingData.kitchenArea} onChange={handleChange} placeholder="e.g., 10" min="0"/>
                                    </div>
                                    <FormSelect label="Bathroom Location" name="bathroomLocation" value={listingData.bathroomLocation} onChange={handleChange} options={BathroomLocation} required />
                                    <FormToggle label="Shared Bathroom?" name="isSharedBathroom" checked={listingData.isSharedBathroom} onChange={handleChange} />
                                    <FormToggle label="Shared Kitchen?" name="isSharedKitchen" checked={listingData.isSharedKitchen} onChange={handleChange} />
                                </section>
                            )}
                            {currentStep === 3 && (
                                <section>
                                    <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4 border-b pb-2">Household & Roommates</h3>
                                    <FormInput label="Current/Expected Housemates" name="numberOfHouseMates" type="number" value={listingData.numberOfHouseMates} onChange={handleChange} required min="0" error={errors.numberOfHouseMates} helpText="Excluding yourself, if you live there." />
                                </section>
                            )}
                            {currentStep === 4 && (
                                <section>
                                    <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4 border-b pb-2">Upload Images (Max 5)</h3>
                                    <div className="mt-1">
                                        <label htmlFor="images" className="flex justify-center w-full h-full px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-blue-500 transition-colors">
                                            <div className="space-y-1 text-center">
                                                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                                                <div className="flex text-sm text-gray-600">
                                                    <span className="relative font-medium text-blue-600">Upload files</span>
                                                    <p className="pl-1">or drag and drop</p>
                                                </div>
                                                <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                                            </div>
                                            <input id="images" name="images" type="file" className="sr-only" onChange={handleChange} multiple accept="image/*"/>
                                        </label>
                                    </div>
                                    {imagePreviews.length > 0 && (
                                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                        {imagePreviews.map((previewUrl, index) => (
                                        <div key={index} className="relative group">
                                            <img src={previewUrl} alt={`Preview ${index + 1}`} className="h-24 w-full object-cover rounded-md shadow-md" />
                                            <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity" title="Remove image" >
                                            <XSquare size={16} />
                                            </button>
                                        </div>
                                        ))}
                                    </div>
                                    )}
                                </section>
                            )}
                            <div className="pt-5 flex justify-between">
                                {currentStep > 0 ? (
                                    <button type="button" onClick={handleBack} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 flex items-center">
                                        <ChevronLeft size={16} className="mr-2"/> Back
                                    </button>
                                ) : ( <div></div> )}
                                {currentStep < sections.length - 1 ? (
                                    <button type="button" onClick={handleNext} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 flex items-center">
                                        Next <ChevronRight size={16} className="ml-2"/>
                                    </button>
                                ) : (
                                    <button type="button" onClick={handleSubmit} className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 flex items-center">
                                        <Save size={16} className="mr-2"/> {submitButtonText}
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
                {showPreviewPane && (
                    <div className={`w-full ${isMobile ? 'fixed inset-0 bg-gray-100 z-40 flex flex-col items-center justify-center p-4' : 'md:w-2/5 lg:w-1/3 order-1 md:order-2 md:sticky md:top-24 self-start'}`}>
                        <div className="w-full max-w-md bg-white p-4 sm:p-6 rounded-lg shadow-xl relative">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900">Live Preview</h3>
                                {isMobile && (
                                    <button onClick={() => setShowPreviewPane(false)} className="text-gray-500 hover:text-red-600 p-1 rounded-md absolute top-2 right-2">
                                        <XSquare size={24} />
                                    </button>
                                )}
                            </div>
                            <div className="max-w-sm mx-auto">
                                <ListingCard {...listingCardPreviewProps} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default ListingForm;
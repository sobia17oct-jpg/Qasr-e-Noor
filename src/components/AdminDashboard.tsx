import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import type { Session } from '@supabase/supabase-js';
import {
  ArrowLeft,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  Loader2,
  Lock,
  LogOut,
  MessageCircle,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
  XCircle,
} from 'lucide-react';
import {
  EVENT_TYPES,
  PACKAGES_DATA,
  VENUE_CONTACT,
  formatPKR,
  type PackageTier,
} from '../data/venueData';
import {
  createAdminBooking,
  deleteBookingInquiry,
  fetchAllBookingInquiries,
  supabase,
  updateBookingInquiry,
  type BookingInquiryRecord,
  type BookingStatus,
} from '../lib/supabase';

interface AdminDashboardProps {
  onBackToSite: () => void;
}

const SETUP_SQL_SNIPPET = `create table if not exists public.booking_inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  phone text not null,
  event_type text not null,
  preferred_date date not null,
  event_shift text not null check (event_shift in ('Day / Lunch', 'Night / Dinner')),
  estimated_guests integer not null check (estimated_guests >= 50 and estimated_guests <= 1500),
  package_id text not null check (package_id in ('silver', 'gold', 'royal')),
  package_name text not null,
  estimated_total_pkr integer not null check (estimated_total_pkr > 0),
  hall_preference text not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  admin_notes text not null default ''
);

alter table public.booking_inquiries enable row level security;

create policy "Allow public booking inquiry inserts"
  on public.booking_inquiries for insert to anon, authenticated with check (true);
create policy "Allow authenticated admins to view bookings"
  on public.booking_inquiries for select to authenticated using (true);
create policy "Allow authenticated admins to update bookings"
  on public.booking_inquiries for update to authenticated using (true) with check (true);
create policy "Allow authenticated admins to delete bookings"
  on public.booking_inquiries for delete to authenticated using (true);`;

function formatGuestWhatsAppUrl(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, '');
  let normalized = digits;
  if (digits.startsWith('03') && digits.length === 11) {
    normalized = `92${digits.slice(1)}`;
  } else if (digits.startsWith('3') && digits.length === 10) {
    normalized = `92${digits}`;
  }
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

export default function AdminDashboard({ onBackToSite }: AdminDashboardProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [signingIn, setSigningIn] = useState(false);

  // Bookings data state
  const [bookings, setBookings] = useState<BookingInquiryRecord[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [missingSchema, setMissingSchema] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState<'all' | BookingStatus>('all');
  const [shiftFilter, setShiftFilter] = useState<'all' | 'Day / Lunch' | 'Night / Dinner'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Row-level interactive state
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState('');
  const [feedbackBanner, setFeedbackBanner] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // New Walk-in Booking modal
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEventType, setNewEventType] = useState<string>('Barat');
  const [newDate, setNewDate] = useState('');
  const [newShift, setNewShift] = useState<'Day / Lunch' | 'Night / Dinner'>('Night / Dinner');
  const [newGuests, setNewGuests] = useState(400);
  const [newPackageId, setNewPackageId] = useState<PackageTier['id']>('gold');
  const [newHall, setNewHall] = useState('Both Halls (Separate Darbar & Noor Mahal)');
  const [newStatus, setNewStatus] = useState<BookingStatus>('confirmed');
  const [newNotes, setNewNotes] = useState('');
  const [creatingBooking, setCreatingBooking] = useState(false);
  const [createError, setCreateError] = useState('');

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session ?? null);
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession ?? null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const loadBookings = useCallback(async () => {
    setLoadingBookings(true);
    setFetchError('');
    setMissingSchema(false);
    const res = await fetchAllBookingInquiries();
    setLoadingBookings(false);

    if (res.error) {
      setFetchError(res.error);
      setMissingSchema(Boolean(res.missingSchema));
      return;
    }

    setBookings(res.data);
  }, []);

  useEffect(() => {
    if (session) {
      loadBookings();
    }
  }, [session, loadBookings]);

  const showBanner = (type: 'success' | 'error', text: string) => {
    setFeedbackBanner({ type, text });
    window.setTimeout(() => {
      setFeedbackBanner((current) => (current?.text === text ? null : current));
    }, 4500);
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setAuthError('Please enter your admin email and password.');
      return;
    }

    setAuthError('');
    setSigningIn(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setSigningIn(false);

    if (error) {
      setAuthError(error.message || 'Invalid credentials. Please try again.');
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setBookings([]);
  };

  const handleStatusChange = async (id: string, nextStatus: BookingStatus) => {
    setBusyId(id);
    const res = await updateBookingInquiry(id, { status: nextStatus });
    setBusyId(null);

    if (res.error || !res.data) {
      showBanner('error', res.error || 'Could not update booking status.');
      return;
    }

    setBookings((prev) => prev.map((item) => (item.id === id ? res.data! : item)));
    showBanner('success', `Booking marked as ${nextStatus}.`);
  };

  const handleSaveNotes = async (id: string) => {
    setBusyId(id);
    const res = await updateBookingInquiry(id, { admin_notes: notesDraft.trim() });
    setBusyId(null);

    if (res.error || !res.data) {
      showBanner('error', res.error || 'Could not save notes.');
      return;
    }

    setBookings((prev) => prev.map((item) => (item.id === id ? res.data! : item)));
    setEditingNotesId(null);
    showBanner('success', 'Internal notes saved.');
  };

  const handleDelete = async (id: string) => {
    setBusyId(id);
    const res = await deleteBookingInquiry(id);
    setBusyId(null);

    if (!res.success) {
      showBanner('error', res.error || 'Could not delete booking.');
      return;
    }

    setBookings((prev) => prev.filter((item) => item.id !== id));
    setConfirmDeleteId(null);
    showBanner('success', 'Booking record deleted.');
  };

  const handleCreateWalkIn = async (e: FormEvent) => {
    e.preventDefault();
    if (newFullName.trim().length < 2) {
      setCreateError('Please enter the guest or host full name.');
      return;
    }
    if (newPhone.replace(/\D/g, '').length < 10) {
      setCreateError('Please enter a valid 10–12 digit phone number.');
      return;
    }
    if (!newDate) {
      setCreateError('Please select the event date.');
      return;
    }

    const pkg = PACKAGES_DATA.find((p) => p.id === newPackageId) ?? PACKAGES_DATA[1];
    const validGuests = Math.min(1500, Math.max(50, Number(newGuests) || 100));

    setCreateError('');
    setCreatingBooking(true);
    const res = await createAdminBooking({
      full_name: newFullName.trim(),
      phone: newPhone.trim(),
      event_type: newEventType,
      preferred_date: newDate,
      event_shift: newShift,
      estimated_guests: validGuests,
      package_id: pkg.id,
      package_name: pkg.name,
      estimated_total_pkr: pkg.pricePerHead * validGuests,
      hall_preference: newHall,
      status: newStatus,
      admin_notes: newNotes.trim(),
    });
    setCreatingBooking(false);

    if (res.error || !res.data) {
      setCreateError(res.error || 'Could not save booking. Ensure schema.sql has been run.');
      return;
    }

    setBookings((prev) => [res.data!, ...prev]);
    setIsNewModalOpen(false);
    setNewFullName('');
    setNewPhone('');
    setNewDate('');
    setNewNotes('');
    showBanner('success', 'Walk-in booking added to schedule.');
  };

  const filteredBookings = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return bookings.filter((b) => {
      if (statusFilter !== 'all' && b.status !== statusFilter) return false;
      if (shiftFilter !== 'all' && b.event_shift !== shiftFilter) return false;
      if (!q) return true;
      const refCode = b.id.slice(0, 8).toLowerCase();
      return (
        b.full_name.toLowerCase().includes(q) ||
        b.phone.toLowerCase().includes(q) ||
        b.event_type.toLowerCase().includes(q) ||
        b.preferred_date.toLowerCase().includes(q) ||
        b.package_name.toLowerCase().includes(q) ||
        refCode.includes(q.replace('#', ''))
      );
    });
  }, [bookings, statusFilter, shiftFilter, searchQuery]);

  const metrics = useMemo(() => {
    const total = bookings.length;
    const pending = bookings.filter((b) => b.status === 'pending').length;
    const confirmedList = bookings.filter((b) => b.status === 'confirmed');
    const confirmedRevenue = confirmedList.reduce(
      (sum, b) => sum + (Number(b.estimated_total_pkr) || 0),
      0
    );
    return {
      total,
      pending,
      confirmed: confirmedList.length,
      confirmedRevenue,
    };
  }, [bookings]);

  const handleExportCsv = () => {
    const headers = [
      'Reference',
      'Date',
      'Shift',
      'Status',
      'Full Name',
      'Phone',
      'Event Type',
      'Hall',
      'Package',
      'Guests',
      'Estimated Total (PKR)',
      'Notes',
    ];
    const escapeCell = (val: string | number) =>
      `"${String(val).replaceAll('"', '""')}"`;

    const rows = filteredBookings.map((b) =>
      [
        b.id.slice(0, 8).toUpperCase(),
        b.preferred_date,
        b.event_shift,
        b.status,
        b.full_name,
        b.phone,
        b.event_type,
        b.hall_preference,
        b.package_name,
        b.estimated_guests,
        b.estimated_total_pkr,
        b.admin_notes ?? '',
      ]
        .map(escapeCell)
        .join(',')
    );

    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `qasr-e-noor-bookings-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopySql = async () => {
    try {
      await navigator.clipboard.writeText(SETUP_SQL_SNIPPET);
      setCopiedSql(true);
      window.setTimeout(() => setCopiedSql(false), 2500);
    } catch {
      showBanner('error', 'Unable to copy automatically. Please copy from supabase/schema.sql.');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#fef9f1] flex items-center justify-center p-6">
        <div className="flex items-center gap-3 text-[#003527]">
          <Loader2 className="w-5 h-5 animate-spin text-[#d97706]" aria-hidden="true" />
          <span className="text-sm font-medium">Loading Qasr-e-Noor Admin Portal...</span>
        </div>
      </div>
    );
  }

  // --- Admin Sign-In Gate ---
  if (!session) {
    return (
      <div className="min-h-screen bg-[#fef9f1] flex flex-col">
        <header className="w-full bg-[#022c22] text-[#fef9f1] border-b border-[#d97706]/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between gap-6">
            <span className="font-display text-lg font-semibold tracking-tight text-white whitespace-nowrap shrink-0">
              {VENUE_CONTACT.brandEnglish} — Admin
            </span>
            <button
              type="button"
              onClick={onBackToSite}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.06em] text-[#fef3c7] hover:text-white whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#f59e0b]" aria-hidden="true" />
              <span>Back to Website</span>
            </button>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-md bg-white rounded border border-[#d97706]/25 shadow-palace overflow-hidden">
            <div className="bg-[#003527] px-6 py-6 text-white border-b border-[#d97706]/30">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#f59e0b]">
                  Management Console
                </p>
                <span className="font-urdu text-lg text-[#fef3c7]">
                  {VENUE_CONTACT.brandUrdu}
                </span>
              </div>
              <h1 className="font-display text-2xl font-semibold text-white mt-1">
                Admin Sign In
              </h1>
              <p className="text-xs text-[#95d3ba] mt-1">
                Sign in with your Supabase Auth manager credentials to manage Mingora
                event bookings.
              </p>
            </div>

            <form onSubmit={handleLogin} noValidate className="p-6 sm:p-8 space-y-5">
              {authError && (
                <div
                  role="alert"
                  className="px-4 py-3 text-sm font-medium text-[#93000a] bg-[#ffdad6] border border-[#ba1a1a]/30 rounded"
                >
                  {authError}
                </div>
              )}

              <div>
                <label
                  htmlFor="admin-email"
                  className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#1d1c17] mb-1.5"
                >
                  Admin Email
                </label>
                <input
                  id="admin-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="manager@qasrenoor.pk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:border-[#064e3b] focus:ring-2 focus:ring-[#d97706]/30"
                />
              </div>

              <div>
                <label
                  htmlFor="admin-password"
                  className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#1d1c17] mb-1.5"
                >
                  Password
                </label>
                <input
                  id="admin-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:border-[#064e3b] focus:ring-2 focus:ring-[#d97706]/30"
                />
              </div>

              <button
                type="submit"
                disabled={signingIn}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 text-xs font-semibold uppercase tracking-[0.06em] text-[#002117] bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:from-[#fbbf24] hover:to-[#f59e0b] disabled:opacity-70 rounded transition-colors cursor-pointer"
              >
                {signingIn ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" aria-hidden="true" />
                    <span>Sign In to Admin Portal</span>
                  </>
                )}
              </button>

              <div className="pt-4 border-t border-[#d97706]/15 text-xs text-[#404944] leading-relaxed">
                Create your admin account in{' '}
                <strong className="text-[#003527]">
                  Supabase Dashboard → Authentication → Users → Add User
                </strong>{' '}
                for project <span className="font-mono">kgweeslcywiqrixzhxxt</span>.
              </div>
            </form>
          </div>
        </main>
      </div>
    );
  }

  // --- Authenticated Admin Management Console ---
  const todayIso = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-[#fef9f1] text-[#1d1c17] flex flex-col">
      {/* Top Bar (3-zone contract) */}
      <header className="sticky top-0 z-30 w-full bg-[#022c22] text-[#fef9f1] border-b border-[#d97706]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between gap-6">
          <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
            <span className="font-display text-lg font-semibold text-white">
              Qasr-e-Noor Admin
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs text-[#95d3ba] whitespace-nowrap">
            <span>Signed in as {session.user.email}</span>
            <button
              type="button"
              onClick={onBackToSite}
              className="text-[#fef3c7] hover:text-white underline underline-offset-4 cursor-pointer"
            >
              View Public Website
            </button>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsNewModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.06em] text-[#002117] bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:from-[#fbbf24] hover:to-[#f59e0b] rounded whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span>Add Booking</span>
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              aria-label="Sign out of Admin Portal"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#fef3c7] border border-[#f59e0b]/40 hover:bg-[#064e3b] rounded whitespace-nowrap shrink-0 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-8">
        {/* Page Heading + Utility Actions */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#904d00]">
              Bookings &amp; Schedule Desk
            </p>
            <h1 className="font-display text-3xl font-semibold text-[#003527] mt-1">
              Wedding &amp; Event Inquiries
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={onBackToSite}
              className="md:hidden inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#003527] bg-white border border-[#d97706]/30 rounded cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Website</span>
            </button>

            <button
              type="button"
              onClick={loadBookings}
              disabled={loadingBookings}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#003527] bg-white border border-[#d97706]/30 hover:bg-[#f8f3eb] rounded transition-colors cursor-pointer"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${loadingBookings ? 'animate-spin' : ''}`}
                aria-hidden="true"
              />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              onClick={handleExportCsv}
              disabled={filteredBookings.length === 0}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#003527] bg-white border border-[#d97706]/30 hover:bg-[#f8f3eb] disabled:opacity-50 rounded transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Feedback Banner */}
        {feedbackBanner && (
          <div
            role="status"
            className={`px-4 py-3 rounded border text-sm font-medium flex items-center justify-between ${
              feedbackBanner.type === 'success'
                ? 'bg-[#f8f3eb] border-[#064e3b]/30 text-[#003527]'
                : 'bg-[#ffdad6] border-[#ba1a1a]/30 text-[#93000a]'
            }`}
          >
            <span>{feedbackBanner.text}</span>
            <button
              type="button"
              onClick={() => setFeedbackBanner(null)}
              aria-label="Dismiss notification"
              className="p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* KPI Summary Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded border border-[#d97706]/25 p-5 shadow-candlelit">
            <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#404944]">
              Total Inquiries
            </p>
            <p className="font-display text-3xl font-semibold text-[#003527] mt-1 tabular-nums">
              {metrics.total}
            </p>
          </div>
          <div className="bg-white rounded border border-[#d97706]/25 p-5 shadow-candlelit">
            <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#904d00]">
              Pending Review
            </p>
            <p className="font-display text-3xl font-semibold text-[#904d00] mt-1 tabular-nums">
              {metrics.pending}
            </p>
          </div>
          <div className="bg-white rounded border border-[#d97706]/25 p-5 shadow-candlelit">
            <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#064e3b]">
              Confirmed Events
            </p>
            <p className="font-display text-3xl font-semibold text-[#064e3b] mt-1 tabular-nums">
              {metrics.confirmed}
            </p>
          </div>
          <div className="bg-[#003527] text-white rounded border border-[#f59e0b]/40 p-5 shadow-candlelit">
            <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#f59e0b]">
              Confirmed Revenue
            </p>
            <p className="font-display text-2xl sm:text-3xl font-semibold text-[#fef3c7] mt-1 tabular-nums truncate">
              {formatPKR(metrics.confirmedRevenue)}
            </p>
          </div>
        </div>

        {/* Missing Schema Guidance */}
        {fetchError && (
          <div className="bg-white rounded border border-[#ba1a1a]/30 p-6 shadow-candlelit space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-xl font-semibold text-[#93000a]">
                  {missingSchema
                    ? 'Database Table Setup Needed in Supabase'
                    : 'Unable to Load Bookings'}
                </h2>
                <p className="text-sm text-[#404944] mt-1">{fetchError}</p>
              </div>
              {missingSchema && (
                <button
                  type="button"
                  onClick={handleCopySql}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#064e3b] hover:bg-[#022c22] rounded whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {copiedSql ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#f59e0b]" />
                      <span>Copied SQL</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#f59e0b]" />
                      <span>Copy Setup SQL</span>
                    </>
                  )}
                </button>
              )}
            </div>
            {missingSchema && (
              <p className="text-xs text-[#404944]">
                Open your Supabase SQL Editor for project{' '}
                <span className="font-mono font-semibold text-[#003527]">
                  kgweeslcywiqrixzhxxt
                </span>
                , paste the SQL from <span className="font-mono">supabase/schema.sql</span>,
                click <strong>Run</strong>, and then click <strong>Refresh</strong> above.
              </p>
            )}
          </div>
        )}

        {/* Filter & Search Controls */}
        <div className="bg-white rounded border border-[#d97706]/25 p-4 sm:p-5 shadow-candlelit flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div
            role="tablist"
            aria-label="Filter bookings by status"
            className="flex flex-wrap items-center gap-1.5 p-1 bg-[#f8f3eb] border border-[#d97706]/20 rounded"
          >
            {(
              [
                ['all', 'All'],
                ['pending', 'Pending'],
                ['confirmed', 'Confirmed'],
                ['cancelled', 'Cancelled'],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={statusFilter === value}
                onClick={() => setStatusFilter(value)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  statusFilter === value
                    ? 'bg-[#064e3b] text-[#fef3c7]'
                    : 'text-[#404944] hover:text-[#003527]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <select
              aria-label="Filter by event shift"
              value={shiftFilter}
              onChange={(e) =>
                setShiftFilter(
                  e.target.value as 'all' | 'Day / Lunch' | 'Night / Dinner'
                )
              }
              className="px-3 py-2 text-xs font-medium bg-[#fef9f1] border border-[#d97706]/30 rounded focus:outline-none focus:border-[#064e3b]"
            >
              <option value="all">All Shifts</option>
              <option value="Day / Lunch">Day / Lunch</option>
              <option value="Night / Dinner">Night / Dinner</option>
            </select>

            <div className="relative flex-1 sm:w-64">
              <Search
                className="w-4 h-4 text-[#404944] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search guest, phone, ref, date..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-[#fef9f1] border border-[#d97706]/30 rounded focus:outline-none focus:border-[#064e3b]"
              />
            </div>
          </div>
        </div>

        {/* Bookings List / Table */}
        <div className="bg-white rounded border border-[#d97706]/25 shadow-candlelit overflow-hidden">
          {loadingBookings ? (
            <div className="p-12 flex items-center justify-center gap-3 text-sm text-[#404944]">
              <Loader2 className="w-5 h-5 animate-spin text-[#064e3b]" aria-hidden="true" />
              <span>Loading bookings from Supabase...</span>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <Calendar className="w-8 h-8 text-[#d97706]/60 mx-auto" aria-hidden="true" />
              <h3 className="font-display text-xl font-semibold text-[#003527]">
                No Matching Bookings Found
              </h3>
              <p className="text-sm text-[#404944]">
                {bookings.length === 0
                  ? 'New inquiries submitted on the website or logged via "Add Booking" will appear here.'
                  : 'Try adjusting your status filter, shift filter, or search text.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#d97706]/15">
              {filteredBookings.map((booking) => {
                const refCode = booking.id.slice(0, 8).toUpperCase();
                const isBusy = busyId === booking.id;
                const isEditingNotes = editingNotesId === booking.id;
                const isConfirmingDelete = confirmDeleteId === booking.id;

                const whatsappReplyText =
                  booking.status === 'confirmed'
                    ? `Assalam-o-Alaikum ${booking.full_name}, your ${booking.event_type} booking at Qasr-e-Noor Wedding Hall (Ref #${refCode}) for ${booking.preferred_date} (${booking.event_shift}) is CONFIRMED. We look forward to hosting your family in Mingora, Swat.`
                    : `Assalam-o-Alaikum ${booking.full_name}, regarding your Qasr-e-Noor Wedding Hall inquiry (Ref #${refCode}) for ${booking.event_type} on ${booking.preferred_date} (${booking.event_shift}).`;

                return (
                  <div
                    key={booking.id}
                    className="p-5 sm:p-6 hover:bg-[#fef9f1]/60 transition-colors space-y-4"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      {/* Left Primary Info */}
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-semibold uppercase tracking-[0.06em]">
                          <span className="text-[#904d00] tabular-nums">
                            Ref #{refCode}
                          </span>
                          <span aria-hidden="true" className="text-[#d97706]/40">
                            ·
                          </span>
                          <span className="inline-flex items-center gap-1">
                            {booking.status === 'confirmed' ? (
                              <>
                                <CheckCircle2
                                  className="w-3.5 h-3.5 text-[#064e3b]"
                                  aria-hidden="true"
                                />
                                <span className="text-[#064e3b]">Confirmed</span>
                              </>
                            ) : booking.status === 'cancelled' ? (
                              <>
                                <XCircle
                                  className="w-3.5 h-3.5 text-[#ba1a1a]"
                                  aria-hidden="true"
                                />
                                <span className="text-[#93000a]">Cancelled</span>
                              </>
                            ) : (
                              <>
                                <Clock
                                  className="w-3.5 h-3.5 text-[#904d00]"
                                  aria-hidden="true"
                                />
                                <span className="text-[#904d00]">Pending</span>
                              </>
                            )}
                          </span>
                          <span aria-hidden="true" className="text-[#d97706]/40">
                            ·
                          </span>
                          <span className="text-[#404944] tabular-nums">
                            {booking.preferred_date} ({booking.event_shift})
                          </span>
                        </div>

                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <h3 className="font-display text-xl font-semibold text-[#003527]">
                            {booking.full_name}
                          </h3>
                          <a
                            href={`tel:${booking.phone}`}
                            className="text-sm font-medium text-[#404944] hover:text-[#064e3b] tabular-nums"
                          >
                            {booking.phone}
                          </a>
                        </div>

                        <p className="text-sm text-[#404944]">
                          <strong className="text-[#1d1c17]">{booking.event_type}</strong>
                          {' · '}
                          {booking.hall_preference}
                          {' · '}
                          <span className="tabular-nums">
                            {booking.estimated_guests} Guests
                          </span>
                          {' · '}
                          {booking.package_name}
                        </p>
                      </div>

                      {/* Right Budget + Status Actions */}
                      <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-3 shrink-0">
                        <div className="font-display text-xl font-semibold text-[#064e3b] tabular-nums">
                          {formatPKR(booking.estimated_total_pkr)}
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {booking.status !== 'confirmed' && (
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => handleStatusChange(booking.id, 'confirmed')}
                              className="px-3 py-1.5 text-xs font-semibold text-white bg-[#064e3b] hover:bg-[#022c22] disabled:opacity-60 rounded cursor-pointer"
                            >
                              Confirm
                            </button>
                          )}
                          {booking.status !== 'pending' && (
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => handleStatusChange(booking.id, 'pending')}
                              className="px-3 py-1.5 text-xs font-semibold text-[#904d00] border border-[#d97706]/40 hover:bg-[#f8f3eb] disabled:opacity-60 rounded cursor-pointer"
                            >
                              Mark Pending
                            </button>
                          )}
                          {booking.status !== 'cancelled' && (
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => handleStatusChange(booking.id, 'cancelled')}
                              className="px-3 py-1.5 text-xs font-semibold text-[#93000a] border border-[#ba1a1a]/30 hover:bg-[#ffdad6]/40 disabled:opacity-60 rounded cursor-pointer"
                            >
                              Cancel
                            </button>
                          )}

                          <a
                            href={formatGuestWhatsAppUrl(booking.phone, whatsappReplyText)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#002117] bg-[#f59e0b] hover:bg-[#fbbf24] rounded transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>WhatsApp</span>
                          </a>

                          {isConfirmingDelete ? (
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                type="button"
                                disabled={isBusy}
                                onClick={() => handleDelete(booking.id)}
                                className="px-2.5 py-1.5 text-xs font-semibold text-white bg-[#ba1a1a] hover:bg-[#93000a] rounded cursor-pointer"
                              >
                                Confirm Delete
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-2 py-1.5 text-xs font-medium text-[#404944] hover:text-[#1d1c17] cursor-pointer"
                              >
                                Keep
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(booking.id)}
                              aria-label={`Delete booking for ${booking.full_name}`}
                              className="p-1.5 text-[#404944] hover:text-[#ba1a1a] rounded cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Admin Notes Row */}
                    <div className="pt-3 border-t border-[#d97706]/10">
                      {isEditingNotes ? (
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                          <input
                            type="text"
                            value={notesDraft}
                            onChange={(e) => setNotesDraft(e.target.value)}
                            placeholder="Add advance payment, stage decor, or menu notes..."
                            className="flex-1 px-3 py-1.5 text-xs bg-white border border-[#064e3b]/50 rounded focus:outline-none focus:ring-2 focus:ring-[#d97706]/30"
                          />
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => handleSaveNotes(booking.id)}
                              className="px-3 py-1.5 text-xs font-semibold text-white bg-[#064e3b] hover:bg-[#022c22] rounded cursor-pointer"
                            >
                              Save Note
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingNotesId(null)}
                              className="px-2.5 py-1.5 text-xs font-medium text-[#404944] hover:text-[#1d1c17] cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-3 text-xs">
                          <p className="text-[#404944]">
                            <strong className="text-[#1d1c17]">Internal Notes:</strong>{' '}
                            {booking.admin_notes ? booking.admin_notes : 'None added yet.'}
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingNotesId(booking.id);
                              setNotesDraft(booking.admin_notes ?? '');
                            }}
                            className="text-[#064e3b] hover:text-[#904d00] font-semibold whitespace-nowrap shrink-0 cursor-pointer"
                          >
                            {booking.admin_notes ? 'Edit Note' : 'Add Note'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Walk-In / Phone Booking Modal */}
      {isNewModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-booking-title"
          className="fixed inset-0 z-50 bg-[#022c22]/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          onClick={() => setIsNewModalOpen(false)}
        >
          <div
            className="w-full max-w-xl bg-[#fef9f1] rounded-lg border border-[#d97706]/40 shadow-palace overflow-hidden my-auto max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 bg-[#003527] text-white border-b border-[#d97706]/30 flex items-center justify-between">
              <h2 id="add-booking-title" className="font-display text-xl font-semibold">
                Add Walk-In / Phone Booking
              </h2>
              <button
                type="button"
                onClick={() => setIsNewModalOpen(false)}
                aria-label="Close modal"
                className="w-9 h-9 rounded border border-[#f59e0b]/40 text-[#fef3c7] hover:bg-[#064e3b] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleCreateWalkIn}
              noValidate
              className="p-6 space-y-4 overflow-y-auto"
            >
              {createError && (
                <div
                  role="alert"
                  className="px-4 py-3 text-xs font-medium text-[#93000a] bg-[#ffdad6] border border-[#ba1a1a]/30 rounded"
                >
                  {createError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="walkin-name"
                    className="block text-xs font-semibold uppercase tracking-[0.06em] text-[#1d1c17] mb-1"
                  >
                    Host Full Name *
                  </label>
                  <input
                    id="walkin-name"
                    type="text"
                    required
                    value={newFullName}
                    onChange={(e) => setNewFullName(e.target.value)}
                    placeholder="e.g. Haji Fazal Rahman"
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:border-[#064e3b]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="walkin-phone"
                    className="block text-xs font-semibold uppercase tracking-[0.06em] text-[#1d1c17] mb-1"
                  >
                    Phone / WhatsApp *
                  </label>
                  <input
                    id="walkin-phone"
                    type="tel"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="03XX-XXXXXXX"
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded tabular-nums focus:outline-none focus:border-[#064e3b]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="walkin-event"
                    className="block text-xs font-semibold uppercase tracking-[0.06em] text-[#1d1c17] mb-1"
                  >
                    Event Type
                  </label>
                  <select
                    id="walkin-event"
                    value={newEventType}
                    onChange={(e) => setNewEventType(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:border-[#064e3b]"
                  >
                    {EVENT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="walkin-date"
                    className="block text-xs font-semibold uppercase tracking-[0.06em] text-[#1d1c17] mb-1"
                  >
                    Event Date *
                  </label>
                  <input
                    id="walkin-date"
                    type="date"
                    required
                    min={todayIso}
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded tabular-nums focus:outline-none focus:border-[#064e3b]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="walkin-shift"
                    className="block text-xs font-semibold uppercase tracking-[0.06em] text-[#1d1c17] mb-1"
                  >
                    Shift
                  </label>
                  <select
                    id="walkin-shift"
                    value={newShift}
                    onChange={(e) =>
                      setNewShift(e.target.value as 'Day / Lunch' | 'Night / Dinner')
                    }
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:border-[#064e3b]"
                  >
                    <option value="Day / Lunch">Day / Lunch</option>
                    <option value="Night / Dinner">Night / Dinner</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="walkin-guests"
                    className="block text-xs font-semibold uppercase tracking-[0.06em] text-[#1d1c17] mb-1"
                  >
                    Estimated Guests
                  </label>
                  <input
                    id="walkin-guests"
                    type="number"
                    min={50}
                    max={1500}
                    step={25}
                    value={newGuests}
                    onChange={(e) => setNewGuests(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded tabular-nums focus:outline-none focus:border-[#064e3b]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="walkin-package"
                    className="block text-xs font-semibold uppercase tracking-[0.06em] text-[#1d1c17] mb-1"
                  >
                    Package
                  </label>
                  <select
                    id="walkin-package"
                    value={newPackageId}
                    onChange={(e) => setNewPackageId(e.target.value as PackageTier['id'])}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:border-[#064e3b]"
                  >
                    {PACKAGES_DATA.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — {formatPKR(p.pricePerHead)}/head
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="walkin-status"
                    className="block text-xs font-semibold uppercase tracking-[0.06em] text-[#1d1c17] mb-1"
                  >
                    Initial Status
                  </label>
                  <select
                    id="walkin-status"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as BookingStatus)}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:border-[#064e3b]"
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="walkin-hall"
                  className="block text-xs font-semibold uppercase tracking-[0.06em] text-[#1d1c17] mb-1"
                >
                  Hall Selection
                </label>
                <select
                  id="walkin-hall"
                  value={newHall}
                  onChange={(e) => setNewHall(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:border-[#064e3b]"
                >
                  <option value="Both Halls (Separate Darbar & Noor Mahal)">
                    Both Halls (Separate Darbar &amp; Noor Mahal)
                  </option>
                  <option value="Grand Gents Hall (Darbar Hall)">
                    Grand Gents Hall (Darbar Hall)
                  </option>
                  <option value="Exclusive Ladies Hall (Noor Mahal)">
                    Exclusive Ladies Hall (Noor Mahal)
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="walkin-notes"
                  className="block text-xs font-semibold uppercase tracking-[0.06em] text-[#1d1c17] mb-1"
                >
                  Internal Notes (Advance, Decor, Menu Requests)
                </label>
                <textarea
                  id="walkin-notes"
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. PKR 100,000 token advance received. Custom ivory floral stage."
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:border-[#064e3b]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#d97706]/20">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#404944] hover:text-[#1d1c17] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingBooking}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.06em] text-[#002117] bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:from-[#fbbf24] hover:to-[#f59e0b] disabled:opacity-70 rounded cursor-pointer"
                >
                  {creatingBooking ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Booking</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

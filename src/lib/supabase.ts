import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ||
  'https://kgweeslcywiqrixzhxxt.supabase.co';
const supabasePublishableKey =
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) ||
  'sb_publishable_6PVWcxSoTaINPi4qwLTPCg_TO5864sz';

export const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabasePublishableKey
);

export interface BookingInquiryPayload {
  full_name: string;
  phone: string;
  event_type: string;
  preferred_date: string;
  event_shift: 'Day / Lunch' | 'Night / Dinner';
  estimated_guests: number;
  package_id: 'silver' | 'gold' | 'royal';
  package_name: string;
  estimated_total_pkr: number;
  hall_preference: string;
}

export interface BookedSlotInfo {
  event_shift: 'Day / Lunch' | 'Night / Dinner';
  hall_preference: string;
  status: string;
}

export interface AvailabilityResult {
  checked: boolean;
  bookedSlots: BookedSlotInfo[];
}

export interface SubmitInquiryResult {
  saved: boolean;
  referenceId?: string;
}

export interface InquiryLookupRecord {
  reference_code: string;
  full_name: string;
  event_type: string;
  preferred_date: string;
  event_shift: 'Day / Lunch' | 'Night / Dinner';
  estimated_guests: number;
  package_name: string;
  estimated_total_pkr: number;
  hall_preference: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
}

export interface LookupResult {
  found: boolean;
  record?: InquiryLookupRecord;
  unavailable?: boolean;
}

export async function checkDateAvailability(
  preferredDate: string
): Promise<AvailabilityResult> {
  if (!preferredDate) {
    return { checked: false, bookedSlots: [] };
  }

  try {
    const { data, error } = await supabase.rpc('get_booked_slots', {
      target_date: preferredDate,
    });

    if (error || !Array.isArray(data)) {
      return { checked: false, bookedSlots: [] };
    }

    return {
      checked: true,
      bookedSlots: data as BookedSlotInfo[],
    };
  } catch {
    return { checked: false, bookedSlots: [] };
  }
}

export async function submitBookingInquiry(
  payload: BookingInquiryPayload
): Promise<SubmitInquiryResult> {
  try {
    const { data, error } = await supabase
      .from('booking_inquiries')
      .insert([payload])
      .select('id')
      .single();

    if (error) {
      return { saved: false };
    }

    const shortRef =
      typeof data?.id === 'string' ? data.id.slice(0, 8).toUpperCase() : undefined;

    return {
      saved: true,
      referenceId: shortRef,
    };
  } catch {
    return { saved: false };
  }
}

export async function lookupBookingInquiry(
  refCode: string,
  phone: string
): Promise<LookupResult> {
  try {
    const { data, error } = await supabase.rpc('lookup_booking_inquiry', {
      ref_prefix: refCode,
      phone_query: phone,
    });

    if (error) {
      return { found: false, unavailable: true };
    }

    if (!Array.isArray(data) || data.length === 0) {
      return { found: false };
    }

    return {
      found: true,
      record: data[0] as InquiryLookupRecord,
    };
  } catch {
    return { found: false, unavailable: true };
  }
}

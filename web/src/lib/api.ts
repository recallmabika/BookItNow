const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export interface PropertyListItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  property_type: string;
  address_line: string;
  city: string;
  country: string;
  amenities: string[];
  photos: string[];
  cancellation_policy: string;
  room_types: {
    id: string;
    name: string;
    description: string;
    max_adults: number;
    max_children: number;
    base_price_per_night: number;
    currency: string;
    amenities: string[];
    photos: string[];
    rate_plans: {
      id: string;
      name: string;
      includes_breakfast: boolean;
      is_non_refundable: boolean;
    }[];
  }[];
}

export async function fetchProperties(params?: {
  city?: string;
  check_in?: string;
  check_out?: string;
  guests?: number;
  min_price?: number;
  max_price?: number;
}): Promise<PropertyListItem[]> {
  try {
    const query = new URLSearchParams();
    if (params?.city) query.append("city", params.city);
    if (params?.check_in) query.append("check_in", params.check_in);
    if (params?.check_out) query.append("check_out", params.check_out);
    if (params?.guests) query.append("guests", params.guests.toString());
    if (params?.min_price) query.append("min_price", params.min_price.toString());
    if (params?.max_price) query.append("max_price", params.max_price.toString());

    const res = await fetch(`${API_BASE_URL}/properties/search?${query.toString()}`, {
      cache: "no-store"
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error("fetchProperties error:", err);
    return [];
  }
}

export async function fetchPropertyBySlug(slug: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/properties/${slug}`, {
      cache: "no-store"
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("fetchPropertyBySlug error:", err);
    return null;
  }
}

export async function createRealBooking(payload: {
  room_type_id: string;
  rate_plan_id?: string;
  check_in_date: string;
  check_out_date: string;
  rooms_count: number;
  adults_count: number;
  children_count: number;
  special_requests?: string;
  payment_method: string;
  idempotency_key: string;
  token: string;
}) {
  const res = await fetch(`${API_BASE_URL}/bookings/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${payload.token}`
    },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to create booking");
  }
  return await res.json();
}

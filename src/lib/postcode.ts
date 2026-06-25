import { POSTCODES_API } from "./constants";
import type { PostcodeResult } from "./types";

export async function lookupPostcode(
  postcode: string
): Promise<PostcodeResult | null> {
  const res = await fetch(
    `${POSTCODES_API}/${encodeURIComponent(postcode.trim())}`,
    { next: { revalidate: 86400 } }
  );
  if (!res.ok) return null;

  const data = await res.json();
  if (data.status !== 200 || !data.result) return null;

  return {
    postcode: data.result.postcode,
    latitude: data.result.latitude,
    longitude: data.result.longitude,
    adminDistrict: data.result.admin_district ?? "",
    region: data.result.region ?? "",
  };
}

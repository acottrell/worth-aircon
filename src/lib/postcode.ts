import { POSTCODES_API } from "./constants";
import { cacheGet, cacheSet } from "./cache";
import type { PostcodeResult } from "./types";

const POSTCODE_TTL_S = 30 * 24 * 60 * 60; // 30 days

export async function lookupPostcode(
  postcode: string
): Promise<PostcodeResult | null> {
  const normalized = postcode.trim().toUpperCase().replace(/\s+/g, "");
  const cacheKey = `postcode:${normalized}`;

  const cached = await cacheGet<PostcodeResult>(cacheKey);
  if (cached) return cached;

  const res = await fetch(
    `${POSTCODES_API}/${encodeURIComponent(postcode.trim())}`,
    { next: { revalidate: 86400 } }
  );
  if (!res.ok) return null;

  const data = await res.json();
  if (data.status !== 200 || !data.result) return null;

  const result: PostcodeResult = {
    postcode: data.result.postcode,
    latitude: data.result.latitude,
    longitude: data.result.longitude,
    adminDistrict: data.result.admin_district ?? "",
    region: data.result.region ?? "",
  };

  await cacheSet(cacheKey, result, POSTCODE_TTL_S);
  return result;
}

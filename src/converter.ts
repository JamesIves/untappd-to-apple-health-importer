import type { CheckinItem, ConversionResult } from "./types";

/**
 * Convert ounces to milliliters.
 * @param oz - Fluid ounces
 * @returns Volume in milliliters
 */
export function ozToMl(oz: number): number {
  return oz * 29.5735;
}

/**
 * Infer an approximate serving volume in mL from a serving type string and ABV.
 * Falls back to ~12 oz if unknown. This is a best-effort heuristic as Untappd
 * does not provide exact volume data in the checkin export.
 *
 * @param servingType - e.g. "Draft", "Pint", "Can"
 * @param abv - ABV percentage, used to refine draft size
 * @returns Volume in milliliters
 */
export function inferVolumeMl(servingType?: string, abv?: number): number {
  const t = (servingType ?? "").toLowerCase();

  switch (true) {
    case t.includes("pint"):
    case t.includes("cask"):
    case t.includes("nitro"):
      return ozToMl(16);

    case t.includes("draft"):
      // If the ABV > 7%, assume a 12oz pour (stronger beers are often served in smaller sizes at breweries).
      return abv && abv > 7 ? ozToMl(12) : ozToMl(16);

    case t.includes("can"):
    case t.includes("bottle"):
    case t.includes("glass"):
      // If ABV > 7%, assume 16oz tallboy, otherwise 12oz.
      // An example of this is tallboy cans from craft breweries (Other Half, Monkish, etc).
      return abv && abv > 7 ? ozToMl(16) : ozToMl(12);

    case t.includes("flight"):
    case t.includes("sample"):
      return ozToMl(5);

    default:
      return ozToMl(12);
  }
}

/**
 * Compute number of US standard drinks from ABV (%) and volume (mL).
 * Uses density 0.789 g/mL for ethanol and 14 g per US standard drink.
 * Returns null when ABV is missing or invalid.
 *
 * @param abvPercent - ABV as number or numeric string
 * @param volumeMl - Volume in milliliters
 * @returns Number of standard drinks, or null if ABV is invalid
 */
export function computeStandardDrinks(
  abvPercent: number | string | undefined,
  volumeMl: number
): number | null {
  if (abvPercent === undefined || abvPercent === null) {
    return null;
  }
  const abv = Number(abvPercent);
  if (Number.isNaN(abv)) {
    return null;
  }
  const alcoholGrams = volumeMl * (abv / 100) * 0.789; // density g/ml
  const standardDrinks = alcoholGrams / 14.0; // US standard drink
  return Number(standardDrinks.toFixed(3));
}

/**
 * Convert an array of checkins to CSV format with date and standard_drinks columns.
 *
 * @param checkins - Array of checkin items from Untappd export
 * @returns Conversion result containing CSV string and statistics
 */
export function convertToCSV(checkins: CheckinItem[]): ConversionResult {
  const csvRows: string[] = ["date,standard_drinks"];
  let processed = 0;
  let skipped = 0;

  for (const item of checkins) {
    const abv = item.beer_abv ? Number(item.beer_abv) : undefined;
    const volumeMl = inferVolumeMl(item.serving_type, abv);
    const standardDrinks = computeStandardDrinks(item.beer_abv, volumeMl);

    if (standardDrinks === null) {
      skipped++;
      continue;
    }

    const createdAt = item.created_at
      ? new Date(String(item.created_at)).toISOString()
      : new Date().toISOString();

    csvRows.push(`${createdAt},${standardDrinks}`);
    processed++;
  }

  return {
    csv: csvRows.join("\n"),
    total: checkins.length,
    processed,
    skipped,
  };
}

/**
 * Checkin item from Untappd export
 */
export interface CheckinItem {
  checkin_id?: number | string;
  bid?: number | string;
  beer_name?: string;
  beer_abv?: number | string;
  serving_type?: string;
  created_at?: string | Date;
}

/**
 * Result of CSV conversion
 */
export interface ConversionResult {
  csv: string;
  total: number;
  processed: number;
  skipped: number;
}

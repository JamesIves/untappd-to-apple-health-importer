/**
 * Download a CSV file to the user's device. If the CSV has more than 500 lines,
 * it will be automatically split into multiple files.
 *
 * @param csvContent - The CSV content as a string
 * @param filename - The base filename for the download (default: 'untappd_health_data.csv')
 */
export function downloadCSV(
  csvContent: string,
  filename = "untappd_health_data.csv"
): void {
  const lines = csvContent.split("\n");
  const MAX_LINES = 500;

  // If file is small enough, download as single file
  if (lines.length <= MAX_LINES + 1) {
    // +1 for header
    downloadSingleCSV(csvContent, filename);
    return;
  }

  // Split into multiple files
  const header = lines[0];
  const dataLines = lines.slice(1);
  const numberOfChunks = Math.ceil(dataLines.length / MAX_LINES);

  for (let i = 0; i < numberOfChunks; i++) {
    const start = i * MAX_LINES;
    const end = Math.min((i + 1) * MAX_LINES, dataLines.length);
    const chunkLines = [header, ...dataLines.slice(start, end)];
    const chunkContent = chunkLines.join("\n");

    const baseName = filename.replace(".csv", "");
    const chunkFilename = `${baseName}_part${i + 1}_of_${numberOfChunks}.csv`;

    // Add small delay between downloads to avoid browser blocking
    setTimeout(() => {
      downloadSingleCSV(chunkContent, chunkFilename);
    }, i * 100);
  }
}

/**
 * Download a single CSV file without splitting.
 *
 * @param csvContent - The CSV content as a string
 * @param filename - The filename for the download
 */
function downloadSingleCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Show an error message to the user.
 *
 * @param message - The error message to display
 */
export function showError(message: string): void {
  const errorEl = document.getElementById("error");
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add("visible");
  }
}

/**
 * Hide the error message.
 */
export function hideError(): void {
  const errorEl = document.getElementById("error");
  if (errorEl) {
    errorEl.classList.remove("visible");
  }
}

/**
 * Update the statistics display with conversion results.
 *
 * @param total - Total number of checkins
 * @param processed - Number of checkins successfully processed
 * @param skipped - Number of checkins skipped (missing ABV)
 */
export function updateStats(
  total: number,
  processed: number,
  skipped: number
): void {
  const totalEl = document.getElementById("totalCheckins");
  const processedEl = document.getElementById("processedCount");
  const skippedEl = document.getElementById("skippedCount");
  const statsEl = document.getElementById("stats");
  const calloutEl = document.getElementById("shortcutCallout");
  const calloutSubtitle = document.querySelector(".callout-subtitle");

  if (totalEl) totalEl.textContent = String(total);
  if (processedEl) processedEl.textContent = String(processed);
  if (skippedEl) skippedEl.textContent = String(skipped);
  if (statsEl) statsEl.classList.add("visible");
  if (calloutEl) calloutEl.classList.add("visible");

  // Update callout message if files were split
  const MAX_LINES = 500;
  if (processed > MAX_LINES && calloutSubtitle) {
    const numberOfFiles = Math.ceil(processed / MAX_LINES);
    calloutSubtitle.textContent = `Your data has been split into ${numberOfFiles} CSV files to prevent memory issues. Import each file separately using the Shortcuts app.`;
  }
}

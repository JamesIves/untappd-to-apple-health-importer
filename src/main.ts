import "./style.css";
import { convertToCSV } from "./converter";
import { downloadCSV, showError, hideError, updateStats } from "./ui";
import type { CheckinItem } from "./types";

/**
 * Process the conversion from JSON to CSV and trigger download.
 */
function processConversion(): void {
  hideError();

  const jsonInput = document.getElementById("jsonInput") as HTMLTextAreaElement;
  const inputValue = jsonInput?.value.trim();

  if (!inputValue) {
    showError("Please upload a file or paste JSON data");
    return;
  }

  try {
    const checkins = JSON.parse(inputValue) as CheckinItem[];

    if (!Array.isArray(checkins)) {
      showError("JSON data must be an array of checkins");
      return;
    }

    const result = convertToCSV(checkins);
    updateStats(result.total, result.processed, result.skipped);
    downloadCSV(result.csv);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    showError(`Error: ${message}`);
  }
}

/**
 * Handle file upload from the file input.
 *
 * @param file - The uploaded file
 */
function handleFile(file: File): void {
  if (!file.name.endsWith(".json")) {
    showError("Please upload a JSON file");
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const jsonInput = document.getElementById(
      "jsonInput"
    ) as HTMLTextAreaElement;
    if (jsonInput && e.target?.result) {
      jsonInput.value = e.target.result as string;
      hideError();
    }
  };
  reader.onerror = () => {
    showError("Error reading file");
  };
  reader.readAsText(file);
}

/**
 * Initialize the application and set up event listeners.
 */
function init(): void {
  const uploadArea = document.getElementById("uploadArea");
  const fileInput = document.getElementById("fileInput") as HTMLInputElement;
  const convertBtn = document.getElementById("convertBtn");

  // Click to upload
  uploadArea?.addEventListener("click", () => fileInput?.click());

  // Drag and drop
  uploadArea?.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadArea.classList.add("dragover");
  });

  uploadArea?.addEventListener("dragleave", () => {
    uploadArea.classList.remove("dragover");
  });

  uploadArea?.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadArea.classList.remove("dragover");

    const files = (e as DragEvent).dataTransfer?.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  });

  // File input change
  fileInput?.addEventListener("change", (e) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      handleFile(target.files[0]);
    }
  });

  // Convert button
  convertBtn?.addEventListener("click", processConversion);
}

init();

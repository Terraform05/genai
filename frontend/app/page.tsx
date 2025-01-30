"use client";

import { useState } from "react";
import FinancialDocuments from "./components/financialDocumentSelection";
import UploadDocument from "./components/uploadDocument";
import AnalyzeDocuments from "./components/analyzeDocuments";
import CompanySearch from "./components/companySearch";
import CompanyDetails from "./components/companyDetails";
import { Company, Filing, CompanyData } from "../public/types/types"; // Import types
import AiAnalysisDisplay from "./components/AIAnalysisDisplay";

// Function to fetch company data
async function fetchRecentCompanyData(
  CIK: string,
  formTypes: string[]
): Promise<{ companyData: CompanyData; filings: Filing[] }> {
  try {
    const response = await fetch(
      `http://localhost:4000/api/filings?CIK=${CIK}&formTypes=${formTypes.join(
        ","
      )}`
    );

    if (!response.ok) {
      throw new Error(`Error fetching company data: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch company data:", error);
    throw error;
  }
}

export default function Home() {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [filings, setFilings] = useState<Filing[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [AiAnalysisTextResponse, setAiAnalysisTextResponse] = useState<
    string | null
  >(null);
  const [loading, setLoading] = useState<boolean>(false);

  const documentTypes: string[] = ["10-K", "10-Q", "8-K"];

  const toggleSelection = (item: string): void => {
    setSelectedItems((prevItems) =>
      prevItems.includes(item)
        ? prevItems.filter((i) => i !== item)
        : [...prevItems, item]
    );
  };

  const handleCompanySelect = async (company: Company): Promise<void> => {
    try {
      setSelectedCompany(company);
      setLoading(true);
      const { companyData, filings } = await fetchRecentCompanyData(
        company.cik_str,
        documentTypes
      );
      setCompanyData(companyData);
      setFilings(filings);
    } catch (error) {
      console.error("Failed to fetch company data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async (): Promise<void> => {
    if (!selectedCompany) {
      setUploadError("No company selected for analysis.");
      return;
    }

    if (selectedItems.length === 0 && uploadedFiles.length === 0) {
      setUploadError("No files or filings selected for analysis.");
      return;
    }

    setLoading(true);
    setUploadError(null);
    setAiAnalysisTextResponse(null);

    try {
      const formData = new FormData();

      if (selectedItems.length > 0) {
        const filingsData = JSON.stringify(
          filings.filter((filing) => selectedItems.includes(filing.formType))
        );
        formData.append("selectedFilings", filingsData);
      }

      if (uploadedFiles.length > 0) {
        uploadedFiles.forEach((file) => formData.append("uploadedFiles", file));
      }

      const companyDataBody = {
        name: selectedCompany.title,
        industry: companyData?.sicDescription,
      };
      formData.append("companyData", JSON.stringify(companyDataBody));

      const response = await fetch("http://localhost:4000/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`);
      }

      const data = await response.json();
      setAiAnalysisTextResponse(
        data.AiAnalysisTextResponse || "No response received."
      );
    } catch (error) {
      console.error("Failed to analyze documents:", error);
      setUploadError("Failed to analyze the documents. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const validateFiles = (files: FileList) => {
    const validFiles = Array.from(files).filter(
      (file) => file.type === "application/pdf"
    );

    if (validFiles.length === 0) {
      setUploadError("Only PDF files are allowed.");
    } else {
      setUploadedFiles((prev) => [...prev, ...validFiles]);
      setUploadError(null);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 p-4">
      <header className="bg-blue-600 text-white py-2 text-center rounded-md mb-4">
        <h1 className="text-3xl font-extrabold">CFT GENAI</h1>
      </header>

      <main className="space-y-4">
        <section className="mx-auto">
          <CompanySearch onCompanySelect={handleCompanySelect} />
        </section>

        {companyData && <CompanyDetails companyData={companyData} />}

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mx-auto">
          <FinancialDocuments
            documentTypes={documentTypes}
            filings={filings}
            selectedItems={selectedItems}
            toggleSelection={toggleSelection}
          />
          <UploadDocument
            uploadedFiles={uploadedFiles.map((file) => ({ name: file.name }))}
            validateFiles={validateFiles}
            removeFile={removeFile}
          />
        </section>

        <section className="mx-auto">
          <AnalyzeDocuments onAnalyze={handleAnalyze} loading={loading} />
        </section>

        {uploadError && <p className="text-red-500">{uploadError}</p>}

        {AiAnalysisTextResponse && (
          <AiAnalysisDisplay analysisResponse={AiAnalysisTextResponse} />
        )}
      </main>
    </div>
  );
}

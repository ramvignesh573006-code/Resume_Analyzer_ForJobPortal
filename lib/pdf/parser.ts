// PDF text extraction utility
export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    // Check if file is PDF
    if (file.type !== 'application/pdf') {
      throw new Error('File must be a PDF');
    }

    // Read file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Import pdfjs dynamically to avoid SSR issues
    const pdfjsLib = await import('pdfjs-dist');
    
    // Set worker source for pdfjs-dist v4+
    // Use the legacy build which is more compatible with diverse environments
    const workerUrl = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/legacy/build/pdf.worker.min.mjs`;
    
    if (pdfjsLib.GlobalWorkerOptions) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
    } else {
      // @ts-ignore - for older versions or different bundle structures
      (window as any).pdfjsWorker = workerUrl;
    }
    
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let text = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item: any) => (item.str ? item.str : ''))
        .join(' ');
      text += pageText + '\n';
    }

    return text.trim();
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

// Extract text from DOCX files
export async function extractTextFromDOCX(file: File): Promise<string> {
  try {
    if (!file.type.includes('openxmlformats') && file.type !== 'application/msword') {
      throw new Error('File must be a Word document');
    }

    const mammoth = await import('mammoth');
    const arrayBuffer = await file.arrayBuffer();

    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value.trim();
  } catch (error) {
    console.error('Error extracting text from DOCX:', error);
    throw new Error('Failed to extract text from document');
  }
}

// Generic extract function
export async function extractTextFromFile(file: File): Promise<string> {
  const fileName = file.name.toLowerCase();

  if (fileName.endsWith('.pdf')) {
    return extractTextFromPDF(file);
  } else if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
    return extractTextFromDOCX(file);
  } else {
    throw new Error('Unsupported file format. Please use PDF or Word document.');
  }
}

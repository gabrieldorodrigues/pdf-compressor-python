import { PDFDocument } from "pdf-lib";

export class PDFCompressorService {
  static async compressPDF(fileBuffer, compressionLevel = "medium") {
    try {
      const pdfDoc = await PDFDocument.load(fileBuffer);

      const compressionSettings = {
        low: {
          useObjectStreams: true,
          addDefaultPage: false,
          compress: true,
        },
        medium: {
          useObjectStreams: true,
          addDefaultPage: false,
          compress: true,
        },
        high: {
          useObjectStreams: false,
          addDefaultPage: false,
          compress: true,
        },
      };

      const settings =
        compressionSettings[compressionLevel] || compressionSettings.medium;

      const newPdfDoc = await PDFDocument.create();

      const pageCount = pdfDoc.getPageCount();
      const pageIndices = Array.from({ length: pageCount }, (_, i) => i);
      const copiedPages = await newPdfDoc.copyPages(pdfDoc, pageIndices);

      copiedPages.forEach((page) => {
        newPdfDoc.addPage(page);
      });

      const compressedBytes = await newPdfDoc.save(settings);

      return {
        success: true,
        data: compressedBytes,
        originalSize: fileBuffer.length,
        compressedSize: compressedBytes.length,
        compressionRatio: (
          ((fileBuffer.length - compressedBytes.length) / fileBuffer.length) *
          100
        ).toFixed(1),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  static formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }
}

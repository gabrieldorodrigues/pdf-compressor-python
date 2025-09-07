import { PDFCompressorService } from "./PDFCompressorService";
import { ImageCompressorService } from "./ImageCompressorService";
import { BrowserImageCompressorService } from "./BrowserImageCompressorService";

export class FileCompressorService {
  static getSupportedTypes() {
    return {
      pdf: {
        name: "PDF",
        icon: "📄",
        extensions: ["pdf"],
        description: "Documentos PDF",
      },
      image: {
        name: "Imagens",
        icon: "🖼️",
        extensions: ["jpg", "jpeg", "png"],
        description: "Imagens JPEG e PNG",
      },
    };
  }

  static getFileType(fileName) {
    const extension = fileName.split(".").pop().toLowerCase();

    if (extension === "pdf") {
      return "pdf";
    } else if (["jpg", "jpeg", "png"].includes(extension)) {
      return "image";
    }

    return null;
  }

  static getFileExtension(fileName) {
    return fileName.split(".").pop().toLowerCase();
  }

  static async compressFile(fileBuffer, fileName, compressionLevel = "medium") {
    const fileType = this.getFileType(fileName);
    const fileExtension = this.getFileExtension(fileName);

    if (!fileType) {
      return {
        success: false,
        error: "Tipo de arquivo não suportado",
      };
    }

    try {
      let result;

      if (fileType === "pdf") {
        result = await PDFCompressorService.compressPDF(
          fileBuffer,
          compressionLevel
        );
      } else if (fileType === "image") {
        try {
          // Usar compressor do browser como padrão (mais confiável)
          result = await BrowserImageCompressorService.compressImage(
            fileBuffer,
            compressionLevel,
            fileExtension
          );
        } catch (browserError) {
          console.warn(
            "Browser compressor falhou, tentando JIMP:",
            browserError
          );
          // Fallback para JIMP
          result = await ImageCompressorService.compressImage(
            fileBuffer,
            compressionLevel,
            fileExtension
          );
        }
      }

      return {
        ...result,
        fileType,
        fileExtension,
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

import Jimp from "jimp";

export class ImageCompressorService {
  static async compressImage(
    fileBuffer,
    compressionLevel = "medium",
    fileType
  ) {
    try {
      // Garantir que temos um buffer válido
      let buffer;
      if (fileBuffer instanceof Uint8Array) {
        buffer = Buffer.from(fileBuffer);
      } else if (fileBuffer instanceof ArrayBuffer) {
        buffer = Buffer.from(fileBuffer);
      } else {
        buffer = fileBuffer;
      }

      // Usar Jimp de forma mais simples
      const image = await Jimp.read(buffer);

      const compressionSettings = {
        low: { quality: 30, resize: 0.7 },
        medium: { quality: 60, resize: 0.85 },
        high: { quality: 80, resize: 0.95 },
      };

      const settings =
        compressionSettings[compressionLevel] || compressionSettings.medium;

      const originalWidth = image.getWidth();
      const originalHeight = image.getHeight();

      const newWidth = Math.round(originalWidth * settings.resize);
      const newHeight = Math.round(originalHeight * settings.resize);

      image.resize(newWidth, newHeight);

      let compressedBuffer;

      if (fileType === "jpeg" || fileType === "jpg") {
        compressedBuffer = await image
          .quality(settings.quality)
          .getBufferAsync(Jimp.MIME_JPEG);
      } else if (fileType === "png") {
        compressedBuffer = await image.getBufferAsync(Jimp.MIME_PNG);
      } else {
        throw new Error("Tipo de arquivo não suportado");
      }

      return {
        success: true,
        data: new Uint8Array(compressedBuffer),
        originalSize: fileBuffer.length,
        compressedSize: compressedBuffer.length,
        compressionRatio: (
          ((fileBuffer.length - compressedBuffer.length) / fileBuffer.length) *
          100
        ).toFixed(1),
        originalDimensions: `${originalWidth}x${originalHeight}`,
        newDimensions: `${newWidth}x${newHeight}`,
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

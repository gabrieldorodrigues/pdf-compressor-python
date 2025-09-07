export class BrowserImageCompressorService {
  static async compressImage(
    fileBuffer,
    compressionLevel = "medium",
    fileType
  ) {
    try {
      const compressionSettings = {
        low: { quality: 0.3, maxWidth: 800, maxHeight: 600 },
        medium: { quality: 0.6, maxWidth: 1200, maxHeight: 900 },
        high: { quality: 0.8, maxWidth: 1600, maxHeight: 1200 },
      };

      const settings =
        compressionSettings[compressionLevel] || compressionSettings.medium;

      // Criar um blob da imagem
      const blob = new Blob([fileBuffer], {
        type: fileType === "png" ? "image/png" : "image/jpeg",
      });

      // Criar uma imagem para obter dimensões originais
      const img = new Image();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      return new Promise((resolve, reject) => {
        img.onload = () => {
          const originalWidth = img.width;
          const originalHeight = img.height;

          // Calcular novas dimensões mantendo aspect ratio
          let { width: newWidth, height: newHeight } =
            this.calculateNewDimensions(
              originalWidth,
              originalHeight,
              settings.maxWidth,
              settings.maxHeight
            );

          // Configurar canvas
          canvas.width = newWidth;
          canvas.height = newHeight;

          // Desenhar imagem redimensionada
          ctx.drawImage(img, 0, 0, newWidth, newHeight);

          // Converter para blob comprimido
          canvas.toBlob(
            (compressedBlob) => {
              if (compressedBlob) {
                const reader = new FileReader();
                reader.onload = () => {
                  const compressedBuffer = new Uint8Array(reader.result);
                  resolve({
                    success: true,
                    data: compressedBuffer,
                    originalSize: fileBuffer.length,
                    compressedSize: compressedBuffer.length,
                    compressionRatio: (
                      ((fileBuffer.length - compressedBuffer.length) /
                        fileBuffer.length) *
                      100
                    ).toFixed(1),
                    originalDimensions: `${originalWidth}x${originalHeight}`,
                    newDimensions: `${newWidth}x${newHeight}`,
                  });
                };
                reader.onerror = () =>
                  reject(new Error("Erro ao ler arquivo comprimido"));
                reader.readAsArrayBuffer(compressedBlob);
              } else {
                reject(new Error("Erro ao comprimir imagem"));
              }
            },
            fileType === "png" ? "image/png" : "image/jpeg",
            settings.quality
          );
        };

        img.onerror = () => reject(new Error("Erro ao carregar imagem"));
        img.src = URL.createObjectURL(blob);
      });
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  static calculateNewDimensions(
    originalWidth,
    originalHeight,
    maxWidth,
    maxHeight
  ) {
    let width = originalWidth;
    let height = originalHeight;

    // Se a imagem for maior que o máximo, redimensionar mantendo aspect ratio
    if (width > maxWidth || height > maxHeight) {
      const aspectRatio = width / height;

      if (width > height) {
        width = maxWidth;
        height = width / aspectRatio;

        if (height > maxHeight) {
          height = maxHeight;
          width = height * aspectRatio;
        }
      } else {
        height = maxHeight;
        width = height * aspectRatio;

        if (width > maxWidth) {
          width = maxWidth;
          height = width / aspectRatio;
        }
      }
    }

    return {
      width: Math.round(width),
      height: Math.round(height),
    };
  }

  static formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }
}

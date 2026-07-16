/**
 * Compresses and resizes an image file in the browser using HTML5 Canvas.
 * 
 * @param file The original File object selected by the user.
 * @param maxWidth The maximum width constraint.
 * @param maxHeight The maximum height constraint.
 * @param quality The JPEG compression quality (0.0 to 1.0).
 * @returns A Promise that resolves to the new compressed File object.
 */
export async function compressImage(
  file: File,
  maxWidth = 1000,
  maxHeight = 1000,
  quality = 0.8
): Promise<File> {
  return new Promise((resolve) => {
    // If the file is not an image, bypass compression
    if (!file.type.startsWith('image/')) {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions maintaining aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert the canvas content to a compressed JPEG Blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Create a new File object with a .jpg extension
              const cleanedName = file.name.replace(/\.[^/.]+$/, "");
              const compressedFile = new File(
                [blob], 
                `${cleanedName}-optimized.jpg`, 
                {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                }
              );
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          quality
        );
      };
      
      img.onerror = () => resolve(file);
    };
    
    reader.onerror = () => resolve(file);
  });
}

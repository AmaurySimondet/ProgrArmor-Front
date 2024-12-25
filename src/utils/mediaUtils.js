export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

// Client-side image resize before upload
export const resizeImage = async (file) => {
    if (!file.type.startsWith('image/')) {
        return file; // Return original file if not an image
    }

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Calculate new dimensions while maintaining aspect ratio
                const MAX_WIDTH = 1200;
                const MAX_HEIGHT = 1200;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height = Math.round((height * MAX_WIDTH) / width);
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width = Math.round((width * MAX_HEIGHT) / height);
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Convert to blob with reduced quality
                canvas.toBlob(
                    (blob) => {
                        const resizedFile = new File([blob], file.name, {
                            type: 'image/jpeg',
                            lastModified: Date.now(),
                        });
                        resolve(resizedFile);
                    },
                    'image/jpeg',
                    0.7 // Reduce quality to 70%
                );
            };
        };
        reader.onerror = (error) => reject(error);
    });
};

export const validateFileSize = (file) => {
    if (file.size > MAX_FILE_SIZE) {
        throw new Error(`Le fichier est trop volumineux. La taille maximum est de ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
    }
};
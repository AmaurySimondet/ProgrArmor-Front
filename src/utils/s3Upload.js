import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

const s3Client = new S3Client({
    region: process.env.REACT_APP_AWS_REGION,
    credentials: {
        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
    }
});

export const uploadToS3 = async (file, userId) => {
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const key = `${userId}-${Date.now()}.${fileExtension}`;

    const params = {
        Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
        Key: key,
        Body: file,
        ContentType: file.type,
        CacheControl: 'max-age=31536000'
    };

    try {
        const upload = new Upload({
            client: s3Client,
            params: params
        });

        const uploadResult = await upload.done();

        return {
            key: key,
            bucket: params.Bucket,
            location: uploadResult.Location,
            cloudfrontUrl: `https://${process.env.REACT_APP_AWS_CLOUDFRONT_DOMAIN}/${key}`
        };
    } catch (error) {
        console.error('Error uploading to S3:', error);
        throw error;
    }
}; 
import * as ImageManipulator from 'expo-image-manipulator';
import { createApiClient } from '@upshot/api-client';
import { decode } from 'base64-arraybuffer';

const api = createApiClient();

const BUCKET = 'event-covers';

/**
 * Compress a local image URI, upload to Supabase Storage,
 * and return the public URL.
 */
export async function uploadEventImage(
  localUri: string,
  userId: string,
): Promise<string | null> {
  try {
    // Ensure bucket exists (ignore if already exists)
    await api.supabase.storage.createBucket(BUCKET, { public: true }).catch(() => {});

    // Compress image
    const manipulated = await ImageManipulator.manipulateAsync(
      localUri,
      [{ resize: { width: 1200 } }],
      { compress: 0.75, format: ImageManipulator.SaveFormat.JPEG, base64: true },
    );

    if (!manipulated.base64) {
      throw new Error('Failed to get base64 from compressed image');
    }

    const fileName = `${userId}_${Date.now()}.jpg`;
    const filePath = fileName;

    const { error: uploadError } = await api.supabase.storage
      .from(BUCKET)
      .upload(filePath, decode(manipulated.base64), {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const { data: urlData } = api.supabase.storage
      .from(BUCKET)
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (e) {
    console.warn('Image upload failed:', e);
    return null;
  }
}

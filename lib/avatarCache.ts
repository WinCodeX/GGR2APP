// lib/avatarCache.ts
import * as FileSystem from 'expo-file-system';

const CACHE_DIR = FileSystem.cacheDirectory + 'avatars/';

/**
 * Given a remote URL, returns a local file URI.
 * Downloads & caches if necessary.
 */
export async function getCachedAvatarUri(remoteUrl: string): Promise<string> {
  if (!remoteUrl) return '';

  // ensure cache folder exists
  await FileSystem.makeDirectoryAsync(CACHE_DIR, { intermediates: true });

  // filename = last part of URL
  const filename = remoteUrl.split('/').pop();
  const localPath = CACHE_DIR + filename;

  // if already downloaded, just return
  const info = await FileSystem.getInfoAsync(localPath);
  if (info.exists) {
    return localPath;
  }

  // otherwise, download, then return
  try {
    const result = await FileSystem.downloadAsync(remoteUrl, localPath);
    return result.uri;
  } catch (e) {
    console.warn('Failed to cache avatar', e);
    return remoteUrl; // fallback to remote
  }
}
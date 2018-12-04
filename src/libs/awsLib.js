import { Storage } from 'aws-amplify';

export async function s3Upload(file) {
  if (file) {
    const fileName = `${Date.now()}-${file.name}`;

    const stored = await Storage.vault.put(fileName, file, {
      level: 'private',
      contentType: file.type
    });

    return stored.key;
  }
  return null;
}

export async function s3Delete(fileName) {
  if (fileName) {
    await Storage.vault.remove(fileName);
  }
}

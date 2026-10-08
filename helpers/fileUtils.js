const fs = require('fs');
const path = require('path');

const UPLOADS_DIR = path.join(__dirname, '..', 'public', 'uploads');
const RESUME_DIR = path.join(UPLOADS_DIR, 'resume');

/**
 * Delete a file only if it resolves inside the given base directory.
 * Never touches external URLs or paths outside the directory.
 */
function removeFileInside(baseDir, fileName) {
  if (!fileName || /^https?:\/\//i.test(fileName)) return false;
  const target = path.resolve(baseDir, path.basename(fileName));
  if (!target.startsWith(path.resolve(baseDir) + path.sep)) return false;
  try {
    if (fs.existsSync(target)) {
      fs.unlinkSync(target);
      return true;
    }
  } catch (e) {
    console.error('Failed to delete file:', e.message);
  }
  return false;
}

/** True if the file begins with the PDF magic bytes ("%PDF-"). */
function isPdfFile(filePath) {
  try {
    const fd = fs.openSync(filePath, 'r');
    const buf = Buffer.alloc(5);
    fs.readSync(fd, buf, 0, 5, 0);
    fs.closeSync(fd);
    return buf.toString('latin1') === '%PDF-';
  } catch (e) {
    return false;
  }
}

/** True if the file begins with valid image magic bytes (JPEG, PNG, GIF, WebP). */
function isImageFile(filePath) {
  try {
    const fd = fs.openSync(filePath, 'r');
    const buf = Buffer.alloc(12);
    fs.readSync(fd, buf, 0, 12, 0);
    fs.closeSync(fd);

    // JPEG: FF D8 FF
    if (buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF) return true;
    // PNG: 89 50 4E 47
    if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) return true;
    // GIF: GIF87a or GIF89a
    if (buf.slice(0, 3).toString('latin1') === 'GIF') return true;
    // WebP: RIFF ... WEBP
    if (buf.slice(0, 4).toString('latin1') === 'RIFF' && buf.slice(8, 12).toString('latin1') === 'WEBP') return true;

    return false;
  } catch (e) {
    return false;
  }
}

module.exports = { UPLOADS_DIR, RESUME_DIR, removeFileInside, isPdfFile, isImageFile };

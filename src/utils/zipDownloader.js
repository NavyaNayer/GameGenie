import JSZip from 'jszip';

export class ZipDownloader {
  static async createPrototypeZip(prototypeData, files) {
    const zip = new JSZip();
    
    // Add all generated files to the zip
    Object.entries(files).forEach(([filename, content]) => {
      if (filename.includes('/')) {
        // Handle subdirectories
        const parts = filename.split('/');
        const folder = parts.slice(0, -1).join('/');
        const file = parts[parts.length - 1];
        
        if (!zip.folder(folder)) {
          zip.folder(folder);
        }
        zip.file(filename, content);
      } else {
        zip.file(filename, content);
      }
    });

    // Generate the zip file
    const content = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 6
      }
    });

    return content;
  }

  static downloadZip(zipBlob, prototypeName) {
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${prototypeName.toLowerCase().replace(/\s+/g, '-')}-prototype.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  static async downloadPrototypeFiles(prototypeData, files) {
    try {
      const zipBlob = await this.createPrototypeZip(prototypeData, files);
      this.downloadZip(zipBlob, prototypeData.gameName);
    } catch (error) {
      console.error('Failed to create zip download:', error);
      throw new Error('Failed to create downloadable prototype package');
    }
  }
}
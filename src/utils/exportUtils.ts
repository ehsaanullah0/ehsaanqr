import confetti from 'canvas-confetti';
import { jsPDF } from 'jspdf';
import { ExportFormat, QrStyleOptions } from '../types';
import { generateQrSvg, renderQrToCanvas } from './qrRenderer';

/**
 * Triggers a subtle, elegant celebratory confetti burst
 */
export function triggerDownloadCelebration() {
  confetti({
    particleCount: 40,
    spread: 55,
    origin: { y: 0.85 },
    colors: ['#DC2626', '#EF4444', '#F87171', '#FEE2E2', '#18181B'],
    disableForReducedMotion: true,
  });
}

/**
 * Helper to download a blob as a file
 */
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export QR code in selected format
 */
export async function exportQrCode(
  format: ExportFormat,
  payload: string,
  options: QrStyleOptions,
  customResolution?: number,
  baseFilename: string = 'ehsaan-qr'
): Promise<boolean> {
  const exportResolution = customResolution || options.size || 1024;
  const filename = `${baseFilename}-${exportResolution}x${exportResolution}.${format}`;

  if (format === 'svg') {
    const svgString = generateQrSvg(payload, {
      ...options,
      size: exportResolution,
    });
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    downloadBlob(blob, `${baseFilename}-vector.svg`);
    triggerDownloadCelebration();
    return true;
  }

  // Create an offscreen canvas for rendering at exact requested resolution
  const canvas = document.createElement('canvas');
  await renderQrToCanvas(canvas, payload, {
    ...options,
    size: exportResolution,
  });

  if (format === 'png') {
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          downloadBlob(blob, filename);
          triggerDownloadCelebration();
          resolve(true);
        } else {
          resolve(false);
        }
      }, 'image/png');
    });
  }

  if (format === 'jpg') {
    // Fill outer canvas with white background so smooth corners and transparent areas render cleanly for JPEG
    const jpgCanvas = document.createElement('canvas');
    jpgCanvas.width = exportResolution;
    jpgCanvas.height = exportResolution;
    const ctx = jpgCanvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, exportResolution, exportResolution);
      ctx.drawImage(canvas, 0, 0);
    }

    return new Promise((resolve) => {
      jpgCanvas.toBlob(
        (blob) => {
          if (blob) {
            downloadBlob(blob, filename);
            triggerDownloadCelebration();
            resolve(true);
          } else {
            resolve(false);
          }
        },
        'image/jpeg',
        0.95
      );
    });
  }

  if (format === 'pdf') {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const qrMm = 110; // QR width in mm
    const x = (pageWidth - qrMm) / 2;
    const y = 50;

    // Header styling
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(220, 38, 38); // Ehsaan crimson #DC2626
    doc.text('EHSAAN QR', pageWidth / 2, 28, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text('Scan-ready vector document • Generated in-browser', pageWidth / 2, 36, {
      align: 'center',
    });

    // Add border frame around QR
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.5);
    doc.roundedRect(x - 5, y - 5, qrMm + 10, qrMm + 10, 4, 4);

    const imgData = canvas.toDataURL('image/png');
    doc.addImage(imgData, 'PNG', x, y, qrMm, qrMm);

    // Meta details below QR
    const infoY = y + qrMm + 18;
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text(`Resolution: ${exportResolution}×${exportResolution} px`, pageWidth / 2, infoY, {
      align: 'center',
    });
    doc.text(`Error Correction: Level ${options.errorCorrection}`, pageWidth / 2, infoY + 6, {
      align: 'center',
    });
    doc.text('Privacy guaranteed: Data never leaves your device.', pageWidth / 2, infoY + 14, {
      align: 'center',
    });

    doc.save(`${baseFilename}-print.pdf`);
    triggerDownloadCelebration();
    return true;
  }

  return false;
}

/**
 * Direct print QR code without downloading, preserving target resolution & format
 */
export async function printQrCode(
  format: ExportFormat,
  payload: string,
  options: QrStyleOptions,
  customResolution?: number
): Promise<boolean> {
  const exportResolution = customResolution || options.size || 1024;

  return new Promise(async (resolve) => {
    try {
      let printContentUrl = '';
      let isPdfBlob = false;

      if (format === 'svg') {
        const svgString = generateQrSvg(payload, {
          ...options,
          size: exportResolution,
        });
        const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        printContentUrl = URL.createObjectURL(blob);
      } else if (format === 'pdf') {
        const canvas = document.createElement('canvas');
        await renderQrToCanvas(canvas, payload, {
          ...options,
          size: exportResolution,
        });

        const doc = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const qrMm = 130;
        const x = (pageWidth - qrMm) / 2;
        const y = (pageHeight - qrMm) / 2;

        const imgData = canvas.toDataURL('image/png');
        doc.addImage(imgData, 'PNG', x, y, qrMm, qrMm);

        doc.autoPrint();
        const pdfBlob = doc.output('blob');
        printContentUrl = URL.createObjectURL(pdfBlob);
        isPdfBlob = true;
      } else if (format === 'jpg') {
        const canvas = document.createElement('canvas');
        await renderQrToCanvas(canvas, payload, {
          ...options,
          size: exportResolution,
        });

        const jpgCanvas = document.createElement('canvas');
        jpgCanvas.width = exportResolution;
        jpgCanvas.height = exportResolution;
        const ctx = jpgCanvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, exportResolution, exportResolution);
          ctx.drawImage(canvas, 0, 0);
        }
        printContentUrl = jpgCanvas.toDataURL('image/jpeg', 0.98);
      } else {
        // PNG default
        const canvas = document.createElement('canvas');
        await renderQrToCanvas(canvas, payload, {
          ...options,
          size: exportResolution,
        });
        printContentUrl = canvas.toDataURL('image/png');
      }

      // Create isolated print iframe
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      iframe.setAttribute('title', 'Print QR Code Frame');

      document.body.appendChild(iframe);

      if (isPdfBlob) {
        iframe.src = printContentUrl;
        iframe.onload = () => {
          setTimeout(() => {
            try {
              iframe.contentWindow?.focus();
              iframe.contentWindow?.print();
            } catch (e) {
              console.error('Print error:', e);
            }
            setTimeout(() => {
              if (document.body.contains(iframe)) {
                document.body.removeChild(iframe);
              }
              if (printContentUrl.startsWith('blob:')) {
                URL.revokeObjectURL(printContentUrl);
              }
              resolve(true);
            }, 1000);
          }, 300);
        };
      } else {
        const doc = iframe.contentWindow?.document;
        if (!doc) {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
          resolve(false);
          return;
        }

        doc.open();
        doc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Print QR Code (${format.toUpperCase()})</title>
              <style>
                @page { margin: 1cm; size: auto; }
                body {
                  margin: 0;
                  padding: 20px;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  min-height: 90vh;
                  font-family: system-ui, -apple-system, sans-serif;
                  background: #ffffff;
                }
                .qr-container {
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  text-align: center;
                }
                .qr-img {
                  max-width: 80vw;
                  max-height: 70vh;
                  width: auto;
                  height: auto;
                  object-fit: contain;
                  margin-bottom: 12px;
                }
                .qr-meta {
                  font-size: 11px;
                  color: #64748b;
                  font-family: monospace;
                }
              </style>
            </head>
            <body>
              <div class="qr-container">
                <img src="${printContentUrl}" class="qr-img" alt="QR Code" />
              </div>
              <script>
                window.onload = function() {
                  setTimeout(function() {
                    window.focus();
                    window.print();
                  }, 150);
                };
              </script>
            </body>
          </html>
        `);
        doc.close();

        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
          if (printContentUrl.startsWith('blob:')) {
            URL.revokeObjectURL(printContentUrl);
          }
          resolve(true);
        }, 3000);
      }
    } catch (err) {
      console.error('Failed to print QR code:', err);
      resolve(false);
    }
  });
}

/**
 * Copies the rendered QR code directly to the user's OS clipboard
 */
export async function copyQrImageToClipboard(
  payload: string,
  options: QrStyleOptions
): Promise<boolean> {
  try {
    const canvas = document.createElement('canvas');
    await renderQrToCanvas(canvas, payload, {
      ...options,
      size: Math.min(1024, options.size),
    });

    return new Promise((resolve) => {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          resolve(false);
          return;
        }
        try {
          if (navigator.clipboard && window.ClipboardItem) {
            await navigator.clipboard.write([
              new ClipboardItem({
                'image/png': blob,
              }),
            ]);
            resolve(true);
          } else {
            resolve(false);
          }
        } catch (e) {
          console.warn('Clipboard write failed:', e);
          resolve(false);
        }
      }, 'image/png');
    });
  } catch (err) {
    console.error(err);
    return false;
  }
}

/**
 * Shares via native Web Share API where supported
 */
export async function shareQr(
  payload: string,
  options: QrStyleOptions,
  title: string = 'Ehsaan QR Code'
): Promise<boolean> {
  if (!navigator.share) return false;

  try {
    const canvas = document.createElement('canvas');
    await renderQrToCanvas(canvas, payload, {
      ...options,
      size: 512,
    });

    return new Promise((resolve) => {
      canvas.toBlob(async (blob) => {
        if (blob && navigator.canShare && navigator.canShare({ files: [new File([blob], 'qr.png', { type: 'image/png' })] })) {
          const file = new File([blob], 'ehsaan-qr.png', { type: 'image/png' });
          await navigator.share({
            title,
            text: 'Here is my scan-ready QR code created with Ehsaan QR.',
            files: [file],
          });
          resolve(true);
        } else {
          await navigator.share({
            title,
            text: payload,
          });
          resolve(true);
        }
      }, 'image/png');
    });
  } catch (e) {
    if ((e as Error).name !== 'AbortError') {
      console.warn('Share error:', e);
    }
    return false;
  }
}

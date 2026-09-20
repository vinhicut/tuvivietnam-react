/**
 * export-engine.js
 * Quản lý xuất bản lá số: PDF CMYK chuẩn in offset, PDF Đen trắng in laser, và Ảnh 4K A4 (300 DPI).
 * Đã loại bỏ chuỗi Base64 218KB, sử dụng trực tiếp tài nguyên logo và sửa lỗi watermark.
 */

function showExportToast(msg, spinning = true) {
    const toast = document.getElementById('exportToast');
    const toastMsg = document.getElementById('exportToastMsg');
    const spinner = document.getElementById('exportSpinner');
    if (!toast || !toastMsg) return;
    toastMsg.textContent = msg;
    if (spinner) spinner.style.display = spinning ? 'block' : 'none';
    toast.style.display = 'flex';
}

function hideExportToast(delay = 2500) {
    setTimeout(() => {
        const toast = document.getElementById('exportToast');
        if (toast) toast.style.display = 'none';
    }, delay);
}

function setExportButtonsDisabled(disabled) {
    const btn1 = document.getElementById('btnExportCmyk');
    const btn2 = document.getElementById('btnExportBw');
    const btn3 = document.getElementById('btnExportImg');
    if (btn1) btn1.disabled = disabled;
    if (btn2) btn2.disabled = disabled;
    if (btn3) btn3.disabled = disabled;
}

function getExportFileName(ext, variant = '') {
    const nameEl = document.getElementById('txtName');
    let name = nameEl ? nameEl.value.trim() : '';
    if (!name && window.currentChartData && window.currentChartData.thien_ban) {
        name = window.currentChartData.thien_ban.ho_ten || '';
    }
    const safeName = name.replace(/[/\\:*?"<>|]/g, '').trim() || 'La-so-Tu-Vi';
    const suffix = variant ? ` ${variant}` : '';
    return `${safeName}${suffix}.${ext}`;
}

function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 150);
}

// Chụp canvas lá số độ nét cao chuẩn in ấn 300 DPI
async function captureTuviBoard(scale = 3.5, options = {}) {
    const wrapper = document.querySelector('.tuvi-board-wrapper');
    const watermark = document.querySelector('.tb-watermark-bg');
    const staleOverlay = document.getElementById('tuviStaleOverlay');
    if (!wrapper) throw new Error('Không tìm thấy .tuvi-board-wrapper');

    if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
    }

    const prevZoom = wrapper.style.zoom;
    const prevWmOpacity = watermark ? watermark.style.opacity : '';
    const prevStaleDisplay = staleOverlay ? staleOverlay.style.display : '';

    const origCreatePattern = CanvasRenderingContext2D.prototype.createPattern;
    CanvasRenderingContext2D.prototype.createPattern = function(image, repetition) {
        if (image && (image.width === 0 || image.height === 0)) {
            const fallback = document.createElement('canvas');
            fallback.width = 1;
            fallback.height = 1;
            return origCreatePattern.call(this, fallback, repetition);
        }
        return origCreatePattern.call(this, image, repetition);
    };

    try {
        wrapper.style.zoom = '1';
        if (watermark && options.watermarkOpacity) {
            watermark.style.opacity = options.watermarkOpacity;
        }
        if (staleOverlay) {
            staleOverlay.style.display = 'none';
        }

        await new Promise(r => requestAnimationFrame(r));
        await new Promise(r => setTimeout(r, 60));

        const canvas = await html2canvas(wrapper, {
            scale: scale,
            useCORS: true,
            allowTaint: false,
            backgroundColor: '#ffffff',
            logging: false,
            imageTimeout: 0
        });

        return canvas;
    } finally {
        CanvasRenderingContext2D.prototype.createPattern = origCreatePattern;
        wrapper.style.zoom = prevZoom;
        if (watermark) {
            watermark.style.opacity = prevWmOpacity;
        }
        if (staleOverlay) {
            staleOverlay.style.display = prevStaleDisplay;
        }
    }
}

function rgbToCmyk(r, g, b) {
    const r_ = r / 255;
    const g_ = g / 255;
    const b_ = b / 255;
    const k = 1 - Math.max(r_, g_, b_);
    if (k >= 0.9999) {
        return [0, 0, 0, 255];
    }
    const c = Math.round(((1 - r_ - k) / (1 - k)) * 255);
    const m = Math.round(((1 - g_ - k) / (1 - k)) * 255);
    const y = Math.round(((1 - b_ - k) / (1 - k)) * 255);
    const kVal = Math.round(k * 255);
    return [c, m, y, kVal];
}

function rgbToGrayscale(r, g, b) {
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    if (gray > 248) {
        return 255;
    } else if (gray >= 215) {
        return Math.min(250, Math.round(gray));
    } else {
        return Math.max(0, Math.round(gray * 0.82));
    }
}

async function generatePdfDocument({
    pageWidthPt = 595.28,
    pageHeightPt = 841.89,
    marginPt = 20,
    imgWidthPx,
    imgHeightPx,
    colorSpace = 'DeviceCMYK',
    bitsPerComponent = 8,
    rawBytes
}) {
    let streamData = rawBytes;
    let isCompressed = false;

    if (typeof CompressionStream !== 'undefined') {
        try {
            const cs = new CompressionStream('deflate');
            const writer = cs.writable.getWriter();
            writer.write(rawBytes);
            writer.close();
            const reader = cs.readable.getReader();
            const chunks = [];
            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                chunks.push(value);
            }
            let total = 0;
            chunks.forEach(c => total += c.length);
            const res = new Uint8Array(total);
            let offset = 0;
            chunks.forEach(c => {
                res.set(c, offset);
                offset += c.length;
            });
            streamData = res;
            isCompressed = true;
        } catch (e) {
            console.warn('Nén FlateDecode không khả dụng, sử dụng raw stream:', e);
        }
    }

    const imgWidthPt = (pageWidthPt - 2 * marginPt).toFixed(2);
    const imgHeightPt = (pageHeightPt - 2 * marginPt).toFixed(2);
    const x = marginPt.toFixed(2);
    const y = marginPt.toFixed(2);
    const contentStr = `q\n${imgWidthPt} 0 0 ${imgHeightPt} ${x} ${y} cm\n/Im1 Do\nQ\n`;
    const contentBytes = new TextEncoder().encode(contentStr);

    const filterLine = isCompressed ? '/Filter /FlateDecode\n' : '';
    const chunks = [];
    const offsets = [];
    let currentOffset = 0;

    function append(data) {
        const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : data;
        chunks.push(bytes);
        currentOffset += bytes.length;
    }

    append('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');

    offsets[1] = currentOffset;
    append('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');

    offsets[2] = currentOffset;
    append('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n');

    offsets[3] = currentOffset;
    append(`3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidthPt.toFixed(2)} ${pageHeightPt.toFixed(2)}] /Contents 5 0 R /Resources << /XObject << /Im1 4 0 R >> >> >>\nendobj\n`);

    offsets[4] = currentOffset;
    append(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${imgWidthPx} /Height ${imgHeightPx} /ColorSpace /${colorSpace} /BitsPerComponent ${bitsPerComponent} ${filterLine}/Length ${streamData.length} >>\nstream\n`);
    append(streamData);
    append('\nendstream\nendobj\n');

    offsets[5] = currentOffset;
    append(`5 0 obj\n<< /Length ${contentBytes.length} >>\nstream\n`);
    append(contentBytes);
    append('endstream\nendobj\n');

    const startxref = currentOffset;
    append('xref\n0 6\n0000000000 65535 f \n');
    for (let i = 1; i <= 5; i++) {
        append(String(offsets[i]).padStart(10, '0') + ' 00000 n \n');
    }
    append(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${startxref}\n%%EOF\n`);

    return new Blob(chunks, { type: 'application/pdf' });
}

async function exportPdfCmyk() {
    try {
        setExportButtonsDisabled(true);
        showExportToast('Đang render PDF Màu chuẩn in CMYK...', true);

        const canvas = await captureTuviBoard(3.5);
        const w = canvas.width;
        const h = canvas.height;
        const ctx = canvas.getContext('2d');
        const imgData = ctx.getImageData(0, 0, w, h);
        const rgba = imgData.data;

        showExportToast('Đang tách 4 bản màu CMYK & nén file...', true);
        await new Promise(r => setTimeout(r, 20));

        const totalPixels = w * h;
        const cmykBytes = new Uint8Array(totalPixels * 4);

        let srcIdx = 0;
        let dstIdx = 0;
        for (let i = 0; i < totalPixels; i++) {
            const cmyk = rgbToCmyk(rgba[srcIdx], rgba[srcIdx + 1], rgba[srcIdx + 2]);
            cmykBytes[dstIdx] = cmyk[0];
            cmykBytes[dstIdx + 1] = cmyk[1];
            cmykBytes[dstIdx + 2] = cmyk[2];
            cmykBytes[dstIdx + 3] = cmyk[3];
            srcIdx += 4;
            dstIdx += 4;
        }

        const pdfBlob = await generatePdfDocument({
            pageWidthPt: 595.28,
            pageHeightPt: 841.89,
            marginPt: 20,
            imgWidthPx: w,
            imgHeightPx: h,
            colorSpace: 'DeviceCMYK',
            rawBytes: cmykBytes
        });

        const filename = getExportFileName('pdf');
        downloadBlob(pdfBlob, filename);
        showExportToast('✓ Xuất PDF Màu hoàn tất!', false);
        hideExportToast();
    } catch (e) {
        console.error('Lỗi khi xuất PDF CMYK:', e);
        showExportToast('Lỗi: ' + e.message, false);
        hideExportToast(4000);
    } finally {
        setExportButtonsDisabled(false);
    }
}

async function exportPdfGrayscale() {
    try {
        setExportButtonsDisabled(true);
        showExportToast('Đang render PDF Đen Trắng laser...', true);

        const canvas = await captureTuviBoard(3.5, { watermarkOpacity: '0.14' });
        const w = canvas.width;
        const h = canvas.height;
        const ctx = canvas.getContext('2d');
        const imgData = ctx.getImageData(0, 0, w, h);
        const rgba = imgData.data;

        showExportToast('Đang xử lý dải xám Grayscale & tăng tương phản...', true);
        await new Promise(r => setTimeout(r, 20));

        const totalPixels = w * h;
        const grayBytes = new Uint8Array(totalPixels);

        let srcIdx = 0;
        for (let i = 0; i < totalPixels; i++) {
            grayBytes[i] = rgbToGrayscale(rgba[srcIdx], rgba[srcIdx + 1], rgba[srcIdx + 2]);
            srcIdx += 4;
        }

        const pdfBlob = await generatePdfDocument({
            pageWidthPt: 595.28,
            pageHeightPt: 841.89,
            marginPt: 20,
            imgWidthPx: w,
            imgHeightPx: h,
            colorSpace: 'DeviceGray',
            rawBytes: grayBytes
        });

        const filename = getExportFileName('pdf', '(Đen trắng)');
        downloadBlob(pdfBlob, filename);
        showExportToast('✓ Xuất PDF Đen Trắng hoàn tất!', false);
        hideExportToast();
    } catch (e) {
        console.error('Lỗi khi xuất PDF Grayscale:', e);
        showExportToast('Lỗi: ' + e.message, false);
        hideExportToast(4000);
    } finally {
        setExportButtonsDisabled(false);
    }
}

async function exportImage4K() {
    try {
        setExportButtonsDisabled(true);
        showExportToast('Đang kết xuất ảnh 4K chuẩn A4 300 DPI...', true);

        const boardCanvas = await captureTuviBoard(3.5);

        const A4_WIDTH = 2480;
        const A4_HEIGHT = 3508;

        const a4Canvas = document.createElement('canvas');
        a4Canvas.width = A4_WIDTH;
        a4Canvas.height = A4_HEIGHT;

        const ctx = a4Canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, A4_WIDTH, A4_HEIGHT);

        const minMargin = 85;
        const maxAvailableWidth = A4_WIDTH - 2 * minMargin;
        const maxAvailableHeight = A4_HEIGHT - 2 * minMargin;

        const boardRatio = boardCanvas.width / boardCanvas.height;
        let targetWidth = maxAvailableWidth;
        let targetHeight = targetWidth / boardRatio;

        if (targetHeight > maxAvailableHeight) {
            targetHeight = maxAvailableHeight;
            targetWidth = targetHeight * boardRatio;
        }

        targetWidth = Math.round(targetWidth);
        targetHeight = Math.round(targetHeight);

        const posX = Math.round((A4_WIDTH - targetWidth) / 2);
        const posY = Math.round((A4_HEIGHT - targetHeight) / 2);

        ctx.drawImage(
            boardCanvas,
            0, 0, boardCanvas.width, boardCanvas.height,
            posX, posY, targetWidth, targetHeight
        );

        const rawBlob = await new Promise((resolve, reject) => {
            a4Canvas.toBlob(blob => {
                if (blob) resolve(blob);
                else reject(new Error('Không thể chuyển canvas sang blob PNG'));
            }, 'image/png');
        });

        const finalBlob = await embedDpiInPngBlob(rawBlob, 300);

        const filename = getExportFileName('png');
        downloadBlob(finalBlob, filename);
        showExportToast('✓ Xuất ảnh A4 300 DPI thành công!', false);
        hideExportToast();
    } catch (e) {
        console.error('Lỗi khi xuất ảnh 4K:', e);
        showExportToast('Lỗi: ' + e.message, false);
        hideExportToast(4000);
    } finally {
        setExportButtonsDisabled(false);
    }
}

async function embedDpiInPngBlob(blob, dpi = 300) {
    try {
        const arrayBuffer = await blob.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);

        if (bytes[0] !== 137 || bytes[1] !== 80 || bytes[2] !== 78 || bytes[3] !== 71) {
            return blob;
        }

        const ppm = Math.round(dpi / 0.0254);

        const physChunk = new Uint8Array(21);
        const view = new DataView(physChunk.buffer);
        view.setUint32(0, 9);
        physChunk[4] = 0x70; physChunk[5] = 0x48; physChunk[6] = 0x59; physChunk[7] = 0x73;
        view.setUint32(8, ppm);
        view.setUint32(12, ppm);
        physChunk[16] = 1;

        const crcTable = new Uint32Array(256);
        for (let i = 0; i < 256; i++) {
            let c = i;
            for (let k = 0; k < 8; k++) {
                c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
            }
            crcTable[i] = c;
        }
        let crc = 0 ^ (-1);
        for (let i = 4; i < 17; i++) {
            crc = (crc >>> 8) ^ crcTable[(crc ^ physChunk[i]) & 0xFF];
        }
        crc = (crc ^ (-1)) >>> 0;
        view.setUint32(17, crc);

        const dataView = new DataView(arrayBuffer);
        const ihdrLen = dataView.getUint32(8);
        const ihdrEnd = 8 + 4 + 4 + ihdrLen + 4;

        const newBytes = new Uint8Array(bytes.length + 21);
        newBytes.set(bytes.subarray(0, ihdrEnd), 0);
        newBytes.set(physChunk, ihdrEnd);
        newBytes.set(bytes.subarray(ihdrEnd), ihdrEnd + 21);

        return new Blob([newBytes], { type: 'image/png' });
    } catch (e) {
        console.warn('Không thể nhúng pHYs chunk vào PNG:', e);
        return blob;
    }
}

window.exportPdfCmyk = exportPdfCmyk;
window.exportPdfGrayscale = exportPdfGrayscale;
window.exportImage4K = exportImage4K;
window.captureTuviBoard = captureTuviBoard;
window.getExportFileName = getExportFileName;
window.downloadBlob = downloadBlob;

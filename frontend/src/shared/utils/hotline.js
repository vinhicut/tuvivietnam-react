/**
 * Quản lý số điện thoại Hotline ngẫu nhiên theo phiên (Session-based)
 * Danh sách số:
 * 1. 0924616199
 * 2. 0385497085
 */

export const HOTLINES = ['0924616199', '0385497085'];

export function getSessionHotline() {
  try {
    let saved = sessionStorage.getItem('tuvi_hotline');
    if (!saved || !HOTLINES.includes(saved)) {
      saved = HOTLINES[Math.floor(Math.random() * HOTLINES.length)];
      sessionStorage.setItem('tuvi_hotline', saved);
    }
    return saved;
  } catch {
    return HOTLINES[0];
  }
}

export function formatHotline(phone) {
  if (!phone || phone.length !== 10) return phone || '';
  return `${phone.slice(0, 4)}.${phone.slice(4, 7)}.${phone.slice(7)}`;
}

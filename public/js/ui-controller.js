/**
 * ui-controller.js
 * Điều khiển bảng nhập liệu, trạng thái lịch âm/dương, debounce và lớp phủ loading.
 * Độc lập hóa trường họ tên để không kích hoạt request tính toán thừa.
 */

let tuviLoadingStartTime = 0;
const MIN_LOADING_TIME = 560; // ms

function showTuViLoading() {
    tuviLoadingStartTime = Date.now();
    const overlay = document.getElementById("tuviLoadingOverlay");
    const board = document.getElementById("tuviBoard");
    if (overlay) {
        overlay.classList.remove("hidden");
        void overlay.offsetWidth; // Force Reflow
    }
    if (board) board.classList.add("is-updating");
}

async function hideTuViLoading() {
    const elapsedTime = Date.now() - tuviLoadingStartTime;
    const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsedTime);
    if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime));
    }
    const overlay = document.getElementById("tuviLoadingOverlay");
    const board = document.getElementById("tuviBoard");
    if (overlay) overlay.classList.add("hidden");
    if (board) board.classList.remove("is-updating");
}

function debounce(func, wait = 300) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function populateSelect(id, start, end, selected) {
    const select = document.getElementById(id);
    if (!select) return;
    select.innerHTML = "";
    for (let i = start; i <= end; i++) {
        let val = i.toString().padStart(2, '0');
        let option = new Option(val, i);
        if (i === selected) option.selected = true;
        select.add(option);
    }
}

function updateDaysInMonth() {
    let year = parseInt(document.getElementById("txtYear").value) || 2006;
    let month = parseInt(document.getElementById("txtMonth").value) || 1;
    let isSolar = document.querySelector('input[name="calendar"]:checked')?.value === "solar";
    let maxDays = 31;
    if (isSolar) {
        maxDays = new Date(year, month, 0).getDate();
    } else {
        maxDays = 30;
    }
    const daySelect = document.getElementById("txtDay");
    if (!daySelect) return;
    let currentDay = parseInt(daySelect.value) || 1;
    if (daySelect.options.length !== maxDays) {
        daySelect.innerHTML = "";
        for (let i = 1; i <= maxDays; i++) {
            let val = i.toString().padStart(2, '0');
            let option = new Option(val, i);
            if (i === currentDay) option.selected = true;
            daySelect.add(option);
        }
        if (currentDay > maxDays) {
            currentDay = maxDays;
            daySelect.value = currentDay;
        }
    }
}

function initDropdowns() {
    populateSelect("txtYear", 1900, 2100, 2006);
    populateSelect("txtMonth", 1, 12, 1);
    populateSelect("txtDay", 1, 31, 1);
    populateSelect("txtHour", 0, 23, 0);
    populateSelect("txtMinute", 0, 59, 0);
    populateSelect("txtLimitYear", 2000, 2100, 2027);
}

function toggleCalendarType() {
    const calRadio = document.querySelector('input[name="calendar"]:checked');
    let isLunar = calRadio ? (calRadio.value === "lunar") : false;
    const leapRow = document.getElementById("rowLeapMonth");
    if (leapRow) leapRow.style.display = isLunar ? "flex" : "none";
}

function collectInputParams() {
    let name = document.getElementById("txtName") ? (document.getElementById("txtName").value.trim() || "Vô Danh") : "Vô Danh";
    let gender = document.querySelector('input[name="gender"]:checked')?.value || "Nam";
    let isSolar = (document.querySelector('input[name="calendar"]:checked')?.value === "solar");
    let isLeapMonthInput = document.getElementById("chkIsLeap") ? document.getElementById("chkIsLeap").checked : false;

    let year = parseInt(document.getElementById("txtYear")?.value) || 2006;
    let month = parseInt(document.getElementById("txtMonth")?.value) || 1;
    let day = parseInt(document.getElementById("txtDay")?.value) || 1;
    let hour = parseInt(document.getElementById("txtHour")?.value) || 0;
    let minute = parseInt(document.getElementById("txtMinute")?.value) || 0;
    let limitYear = parseInt(document.getElementById("txtLimitYear")?.value) || 2027;

    return {
        name,
        gender,
        is_solar: isSolar,
        isSolar: isSolar,
        day,
        month,
        year,
        hour,
        minute,
        is_leap_month_input: isLeapMonthInput,
        isLeapMonthInput: isLeapMonthInput,
        limit_year: limitYear,
        limitYear
    };
}

function showTuViStaleNotice() {
    const overlay = document.getElementById("tuviStaleOverlay");
    if (overlay) {
        overlay.classList.remove("hidden");
    }
}

function hideTuViStaleNotice() {
    const overlay = document.getElementById("tuviStaleOverlay");
    if (overlay) {
        overlay.classList.add("hidden");
    }
}

function initEventListeners() {
    // 1. Họ và tên: Cập nhật tên và hiển thị thông báo yêu cầu bấm nút Lập lá số
    const nameEl = document.getElementById("txtName");
    if (nameEl) {
        nameEl.addEventListener("input", (e) => {
            if (typeof updateBoardNameOnly === "function") {
                updateBoardNameOnly(e.target.value);
            }
            showTuViStaleNotice();
        });
    }

    // 2. Giới tính
    document.querySelectorAll('input[name="gender"]').forEach(el => {
        el.addEventListener("change", () => {
            showTuViStaleNotice();
        });
    });

    // 3. Loại lịch (Dương lịch / Âm lịch)
    document.querySelectorAll('input[name="calendar"]').forEach(el => {
        el.addEventListener("change", () => {
            toggleCalendarType();
            updateDaysInMonth();
            showTuViStaleNotice();
        });
    });

    // 4. Tháng nhuận
    const leapEl = document.getElementById("chkIsLeap");
    if (leapEl) {
        leapEl.addEventListener("change", () => {
            showTuViStaleNotice();
        });
    }

    // 5. Năm sinh, Tháng sinh, Ngày sinh
    const yearEl = document.getElementById("txtYear");
    if (yearEl) {
        yearEl.addEventListener("change", () => {
            updateDaysInMonth();
            showTuViStaleNotice();
        });
    }
    const monthEl = document.getElementById("txtMonth");
    if (monthEl) {
        monthEl.addEventListener("change", () => {
            updateDaysInMonth();
            showTuViStaleNotice();
        });
    }
    const dayEl = document.getElementById("txtDay");
    if (dayEl) {
        dayEl.addEventListener("change", () => {
            showTuViStaleNotice();
        });
    }

    // 6. Giờ sinh, Phút sinh
    const hourEl = document.getElementById("txtHour");
    if (hourEl) {
        hourEl.addEventListener("change", () => {
            showTuViStaleNotice();
        });
    }
    const minuteEl = document.getElementById("txtMinute");
    if (minuteEl) {
        minuteEl.addEventListener("change", () => {
            showTuViStaleNotice();
        });
    }

    // 7. Năm xem hạn
    const limitYearEl = document.getElementById("txtLimitYear");
    if (limitYearEl) {
        limitYearEl.addEventListener("change", () => {
            showTuViStaleNotice();
        });
    }
}

// Điều chỉnh bố cục linh hoạt giữa Máy tính (>1024px) và Điện thoại (<=1024px)
function syncResponsiveWidths() {
    try {
        const wrapper = document.querySelector('.tuvi-board-wrapper');
        const outputPanel = document.querySelector('.output-panel');
        const inputPanel = document.querySelector('.input-panel');
        const exportSection = document.querySelector('.export-section');
        const footerNote = document.querySelector('.panel-footer-note');
        if (!wrapper || !outputPanel || !inputPanel || !exportSection) return;

        const isMobile = window.innerWidth <= 1024;

        if (isMobile) {
            // Giao diện Điện thoại: Chuyển khối Xuất lá số xuống dưới Preview lá số
            if (exportSection.parentElement !== outputPanel) {
                outputPanel.appendChild(exportSection);
            }
            const rect = wrapper.getBoundingClientRect();
            const boardWidth = Math.round(rect.width);
            if (boardWidth > 0) {
                exportSection.style.width = `${boardWidth}px`;
                exportSection.style.maxWidth = `${boardWidth}px`;
                inputPanel.style.width = `${boardWidth}px`;
                inputPanel.style.maxWidth = `${boardWidth}px`;
            }
        } else {
            // Giao diện Máy tính: Khôi phục 100% giao diện gốc bên trong Bảng nhập liệu
            if (exportSection.parentElement !== inputPanel) {
                if (footerNote) {
                    inputPanel.insertBefore(exportSection, footerNote);
                } else {
                    inputPanel.appendChild(exportSection);
                }
            }
            // Xóa style inline để sử dụng CSS máy tính gốc
            exportSection.style.width = '';
            exportSection.style.maxWidth = '';
            inputPanel.style.width = '';
            inputPanel.style.maxWidth = '';
        }
    } catch (e) {}
}

// Báo cáo chiều cao thực tế về trang cha để tự động co giãn iframe (Zero scrollbars)
function notifyParentHeight() {
    syncResponsiveWidths();
    try {
        if (window.parent && window.parent !== window) {
            const board = document.querySelector('.tuvi-board-wrapper');
            const panel = document.querySelector('.input-panel');
            const exportSec = document.querySelector('.export-section');
            let maxBottom = 0;
            [board, panel, exportSec].forEach(el => {
                if (el) {
                    const r = el.getBoundingClientRect();
                    const b = r.bottom + (window.pageYOffset || document.documentElement.scrollTop || 0);
                    if (b > maxBottom) maxBottom = b;
                }
            });
            const h = maxBottom > 0 ? Math.ceil(maxBottom) + 20 : 1040;
            window.parent.postMessage({ type: 'TUVI_IFRAME_RESIZE', height: h }, '*');
        }
    } catch (e) {}
}

window.showTuViLoading = showTuViLoading;
window.hideTuViLoading = hideTuViLoading;
window.showTuViStaleNotice = showTuViStaleNotice;
window.hideTuViStaleNotice = hideTuViStaleNotice;
window.debounce = debounce;
window.populateSelect = populateSelect;
window.updateDaysInMonth = updateDaysInMonth;
window.initDropdowns = initDropdowns;
window.toggleCalendarType = toggleCalendarType;
window.collectInputParams = collectInputParams;
window.initEventListeners = initEventListeners;
window.notifyParentHeight = notifyParentHeight;
window.syncResponsiveWidths = syncResponsiveWidths;

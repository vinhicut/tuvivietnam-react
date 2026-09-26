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

function showGenerateButton() {
    const btn = document.getElementById("btnGenerateTuVi");
    if (btn) {
        btn.classList.remove("is-hidden");
        btn.classList.add("btn-reappear");
    }
}

function hideGenerateButton() {
    const btn = document.getElementById("btnGenerateTuVi");
    if (btn) {
        btn.classList.remove("btn-reappear");
        btn.classList.add("is-hidden");
    }
}

function showTuViStaleNotice() {
    const overlay = document.getElementById("tuviStaleOverlay");
    if (overlay) {
        overlay.classList.remove("hidden");
    }
    showGenerateButton();
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

    // 8. Tối ưu bộ chọn ngày/tháng/năm trên Mobile (Full-Screen Modal/Sheet)
    const dateRowGroup = document.querySelector(".date-row-group");
    const daySelect = document.getElementById("txtDay");
    const monthSelect = document.getElementById("txtMonth");
    const yearSelect = document.getElementById("txtYear");

    function triggerMobilePicker(e) {
        if (window.innerWidth <= 768) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            if (daySelect) daySelect.blur();
            if (monthSelect) monthSelect.blur();
            if (yearSelect) yearSelect.blur();
            openMobileDatePicker();
        }
    }

    if (dateRowGroup) {
        dateRowGroup.addEventListener("click", triggerMobilePicker);
    }
    [daySelect, monthSelect, yearSelect].forEach(el => {
        if (el) {
            el.addEventListener("mousedown", triggerMobilePicker);
            el.addEventListener("focus", triggerMobilePicker);
        }
    });

    // 9. Đồng bộ số điện thoại Hotline ngẫu nhiên theo phiên (Session-based)
    syncBoardHotline();
}

let selectedPickerDay = 1;
let selectedPickerMonth = 1;
let selectedPickerYear = 2006;

function openMobileDatePicker() {
    const modal = document.getElementById("mobileDatePickerModal");
    if (!modal) return;

    selectedPickerDay = parseInt(document.getElementById("txtDay")?.value) || 1;
    selectedPickerMonth = parseInt(document.getElementById("txtMonth")?.value) || 1;
    selectedPickerYear = parseInt(document.getElementById("txtYear")?.value) || 2006;

    renderMobilePickerYear();
    renderMobilePickerMonth();
    renderMobilePickerDay();

    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";

    // Tự động cuộn đến mục đang được chọn
    setTimeout(() => {
        document.querySelector("#pickerListDay .picker-opt-btn.selected")?.scrollIntoView({ block: "center", behavior: "smooth" });
        document.querySelector("#pickerListMonth .picker-opt-btn.selected")?.scrollIntoView({ block: "center", behavior: "smooth" });
        document.querySelector("#pickerListYear .picker-opt-btn.selected")?.scrollIntoView({ block: "center", behavior: "smooth" });
    }, 80);
}

function closeMobileDatePicker() {
    const modal = document.getElementById("mobileDatePickerModal");
    if (modal) modal.classList.add("hidden");
    document.body.style.overflow = "";
}

function confirmMobileDatePicker() {
    const daySelect = document.getElementById("txtDay");
    const monthSelect = document.getElementById("txtMonth");
    const yearSelect = document.getElementById("txtYear");

    if (yearSelect) yearSelect.value = selectedPickerYear;
    if (monthSelect) monthSelect.value = selectedPickerMonth;
    updateDaysInMonth();
    if (daySelect) daySelect.value = selectedPickerDay;

    showTuViStaleNotice();
    closeMobileDatePicker();
}

function renderMobilePickerYear() {
    const list = document.getElementById("pickerListYear");
    if (!list) return;
    list.innerHTML = "";
    for (let y = 1900; y <= 2100; y++) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "picker-opt-btn" + (y === selectedPickerYear ? " selected" : "");
        btn.textContent = y;
        btn.onclick = () => {
            selectedPickerYear = y;
            document.querySelectorAll("#pickerListYear .picker-opt-btn").forEach(el => el.classList.remove("selected"));
            btn.classList.add("selected");
            renderMobilePickerDay();
        };
        list.appendChild(btn);
    }
}

function renderMobilePickerMonth() {
    const list = document.getElementById("pickerListMonth");
    if (!list) return;
    list.innerHTML = "";
    for (let m = 1; m <= 12; m++) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "picker-opt-btn" + (m === selectedPickerMonth ? " selected" : "");
        btn.textContent = "Tháng " + m;
        btn.onclick = () => {
            selectedPickerMonth = m;
            document.querySelectorAll("#pickerListMonth .picker-opt-btn").forEach(el => el.classList.remove("selected"));
            btn.classList.add("selected");
            renderMobilePickerDay();
        };
        list.appendChild(btn);
    }
}

function renderMobilePickerDay() {
    const list = document.getElementById("pickerListDay");
    if (!list) return;
    list.innerHTML = "";
    let isSolar = document.querySelector('input[name="calendar"]:checked')?.value === "solar";
    let maxDays = 31;
    if (isSolar) {
        maxDays = new Date(selectedPickerYear, selectedPickerMonth, 0).getDate();
    } else {
        maxDays = 30;
    }
    if (selectedPickerDay > maxDays) selectedPickerDay = maxDays;

    for (let d = 1; d <= maxDays; d++) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "picker-opt-btn" + (d === selectedPickerDay ? " selected" : "");
        btn.textContent = d.toString().padStart(2, "0");
        btn.onclick = () => {
            selectedPickerDay = d;
            document.querySelectorAll("#pickerListDay .picker-opt-btn").forEach(el => el.classList.remove("selected"));
            btn.classList.add("selected");
        };
        list.appendChild(btn);
    }
}

function syncBoardHotline() {
    try {
        const savedHotline = sessionStorage.getItem("tuvi_hotline");
        const phoneEl = document.querySelector(".tb-header-phone");
        if (savedHotline && phoneEl && savedHotline.length === 10) {
            phoneEl.textContent = `${savedHotline.slice(0, 4)}.${savedHotline.slice(4, 7)}.${savedHotline.slice(7)}`;
        }
    } catch (_e) {}
}

// Điều chỉnh bố cục linh hoạt giữa Máy tính (>1024px) và Điện thoại (<=1024px)
function syncResponsiveWidths() {
    try {
        const wrapper = document.querySelector('.tuvi-board-wrapper');
        const outputPanel = document.querySelector('.output-panel');
        const inputPanel = document.querySelector('.input-panel');
        const exportSection = document.querySelector('.export-section');
        const footerNote = document.querySelector('.panel-footer-note');
        const board = document.getElementById('tuviBoard');
        if (!wrapper || !outputPanel || !inputPanel || !exportSection || !board) return;

        const isMobile = window.innerWidth <= 1024;
        
        // Chuẩn hóa kích thước gốc của Lá Số Tử Vi (195mm x 268mm)
        const BASE_WIDTH = 737; // 195mm
        const BASE_HEIGHT = 1013; // 268mm
        let scale = 1.0;
        
        if (isMobile) {
            const containerWidth = document.documentElement.clientWidth || window.innerWidth || (document.body ? document.body.clientWidth : 390);
            const padding = 20; // safe area padding
            const availableWidth = Math.max(280, containerWidth - padding);
            scale = Math.min(1.0, Math.floor((availableWidth / BASE_WIDTH) * 1000) / 1000);
        }
        
        board.style.transform = `scale(${scale})`;
        board.style.transformOrigin = 'top left';

        // Kích thước wrapper chuẩn (box-sizing: content-box đảm bảo viền 2px nằm ngoài)
        const scaledWidth = Math.round(BASE_WIDTH * scale);
        const scaledHeight = Math.round(BASE_HEIGHT * scale);
        wrapper.style.width = `${scaledWidth}px`;
        wrapper.style.height = `${scaledHeight}px`;

        if (isMobile) {
            // Giao diện Điện thoại: Chuyển khối Xuất lá số xuống dưới Preview lá số
            if (exportSection.parentElement !== outputPanel) {
                outputPanel.appendChild(exportSection);
            }
            if (scaledWidth > 0) {
                exportSection.style.width = `${scaledWidth}px`;
                exportSection.style.maxWidth = `${scaledWidth}px`;
                inputPanel.style.width = `${scaledWidth}px`;
                inputPanel.style.maxWidth = `${scaledWidth}px`;
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
    } catch (_e) {}
}

let lastReportedTuViHeight = 0;

// Báo cáo chiều cao thực tế về trang cha để tự động co giãn iframe (Zero scrollbars)
function notifyParentHeight() {
    syncResponsiveWidths();
    try {
        if (window.parent && window.parent !== window) {
            const board = document.querySelector('.tuvi-board-wrapper');
            const panel = document.querySelector('.input-panel');
            const exportSec = document.querySelector('.export-section');
            const outputPanel = document.querySelector('.output-panel');

            let maxBottom = 0;
            const measureTargets = [board, panel, exportSec, outputPanel];
            measureTargets.forEach(el => {
                if (el) {
                    const r = el.getBoundingClientRect();
                    const b = r.bottom + (window.pageYOffset || document.documentElement.scrollTop || 0);
                    if (b > maxBottom) maxBottom = b;
                }
            });

            if (maxBottom <= 0) {
                maxBottom = 960;
            }

            const h = Math.max(680, Math.ceil(maxBottom) + 8);

            // Chỉ gửi khi chiều cao thay đổi thực sự tối thiểu 4px để tránh vòng lặp vô hạn
            if (Math.abs(h - lastReportedTuViHeight) >= 4) {
                lastReportedTuViHeight = h;
                window.parent.postMessage({ type: 'TUVI_IFRAME_RESIZE', height: h }, '*');
            }
        }
    } catch (_e) {}
}

window.addEventListener('message', (e) => {
    if (e.data && e.data.type === 'REQUEST_TUVI_HEIGHT') {
        notifyParentHeight();
        setTimeout(notifyParentHeight, 150);
    }
});

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
window.openMobileDatePicker = openMobileDatePicker;
window.closeMobileDatePicker = closeMobileDatePicker;
window.confirmMobileDatePicker = confirmMobileDatePicker;
window.showGenerateButton = showGenerateButton;
window.hideGenerateButton = hideGenerateButton;



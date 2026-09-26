#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
start_beta.py
Kịch bản 1-click khởi chạy Bản Thử Nghiệm Tử Vi Hồng Ân (Release 2509).
Chế độ: On-Demand (Bật khi test, tắt cửa sổ là đóng hoàn toàn).
Cơ chế:
  - Máy chủ cục bộ (Web + Core API Engine) chạy tại cổng 8080.
  - Tích hợp bộ giới hạn tối đa 20 thiết bị đồng thời (Device Limiter).
  - Tự động kết nối Cloudflare Quick Tunnel (TryCloudflare) miễn phí 100%.
  - Tự động lấy và in ra đường link HTTPS công khai để gửi cho mọi người test ngay.
"""

import os
import sys
import subprocess
import time
import webbrowser
import urllib.request
import urllib.error
import shutil
import re
import threading

PORT = 8080

def free_port(port):
    """Giải phóng cổng nếu bị chiếm giữ bởi tiến trình cũ trên Windows."""
    if os.name == 'nt':
        try:
            output = subprocess.check_output(f'netstat -ano | findstr :{port}', shell=True, text=True, stderr=subprocess.DEVNULL)
            pids = set()
            for line in output.strip().splitlines():
                parts = line.split()
                if len(parts) >= 5 and "LISTENING" in parts[3].upper():
                    pid = parts[-1]
                    if pid != '0' and int(pid) != os.getpid():
                        pids.add(pid)
            for pid in pids:
                print(f"🧹 Đang giải phóng cổng {port} (PID {pid})...")
                subprocess.run(f'taskkill /F /PID {pid}', shell=True, capture_output=True)
                time.sleep(0.5)
        except Exception:
            pass

def find_cloudflared():
    """Tìm file thực thi cloudflared."""
    path_bin = shutil.which("cloudflared")
    if path_bin:
        return path_bin

    user_home = os.path.expanduser("~")
    common_locations = [
        r"C:\Program Files (x86)\cloudflared\cloudflared.exe",
        r"C:\Program Files\cloudflared\cloudflared.exe",
        os.path.join(user_home, "AppData", "Local", "Microsoft", "WinGet", "Links", "cloudflared.exe"),
        os.path.join(user_home, ".cloudflared", "cloudflared.exe")
    ]
    for loc in common_locations:
        if os.path.exists(loc):
            return loc
    return None

def main():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    backend_src = os.path.join(root_dir, "backend", "src")
    server_script = os.path.join(backend_src, "server.py")

    os.chdir(root_dir)

    print("=" * 68)
    print("🌟 KHỞI CHẠY BẢN THỬ NGHIỆM TỬ VI HỒNG ÂN (RELEASE 2509)")
    print("   👉 Chế độ: On-Demand (Bật lên là chạy, Đóng cửa sổ là tắt 100%)")
    print("   👉 Hạ tầng: Cloudflare Quick Tunnel (TryCloudflare Miễn phí)")
    print("   👉 Giới hạn: Mở công khai, Tối đa 20 thiết bị đồng thời")
    print("=" * 68)

    # 1. Dọn dẹp port 8080
    free_port(PORT)

    # 2. Bật Web & Backend API Server
    if not os.path.exists(server_script):
        print(f"❌ Không tìm thấy {server_script}!")
        input("Nhấn Enter để thoát...")
        sys.exit(1)

    print(f"🚀 [1/3] Đang khởi động Máy chủ Web & API nội bộ (Port {PORT})...")
    server_proc = subprocess.Popen([sys.executable, server_script, str(PORT)], cwd=backend_src)

    # Chờ Health Check
    health_url = f"http://127.0.0.1:{PORT}/api/health"
    ready = False
    for _ in range(15):
        time.sleep(0.5)
        if server_proc.poll() is not None:
            print("❌ Máy chủ nội bộ bị dừng đột ngột!")
            sys.exit(1)
        try:
            with urllib.request.urlopen(health_url, timeout=1) as resp:
                if resp.status == 200:
                    ready = True
                    break
        except Exception:
            pass

    if ready:
        print("✅ Máy chủ Web & API nội bộ đã sẵn sàng!")
    else:
        print("⚠️ Tiếp tục tiến trình kết nối...")

    # 3. Khởi chạy Cloudflare Quick Tunnel
    cloudflared_bin = find_cloudflared()
    if not cloudflared_bin:
        print("❌ Không tìm thấy cloudflared trên hệ thống!")
        input("Nhấn Enter để thoát...")
        sys.exit(1)

    print(f"🌐 [2/3] Đang kết nối Cloudflare Quick Tunnel...")
    # Lệnh tạo quick tunnel miễn phí: cloudflared tunnel --url http://localhost:8080
    tunnel_cmd = [cloudflared_bin, "tunnel", "--url", f"http://localhost:{PORT}"]
    tunnel_proc = subprocess.Popen(
        tunnel_cmd,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1
    )

    public_url = None
    url_pattern = re.compile(r"https://[a-zA-Z0-9\-]+\.trycloudflare\.com")

    # Đọc log của cloudflared để lấy public url
    start_time = time.time()
    print("⏳ Đang nhận địa chỉ liên kết HTTPS công khai từ Cloudflare...")
    
    while time.time() - start_time < 30:
        line = tunnel_proc.stdout.readline()
        if not line and tunnel_proc.poll() is not None:
            break
        match = url_pattern.search(line)
        if match:
            public_url = match.group(0)
            break

    # Tiếp tục cho thread đọc stderr/stdout để không bị tràn buffer
    def discard_tunnel_logs(proc):
        try:
            for _ in proc.stdout:
                pass
        except Exception:
            pass

    log_thread = threading.Thread(target=discard_tunnel_logs, args=(tunnel_proc,), daemon=True)
    log_thread.start()

    local_url = f"http://localhost:{PORT}"
    print("\n" + "=" * 68)
    print("🎉 HỆ THỐNG THỬ NGHIỆM ĐÃ SẴN SÀNG HOẠT ĐỘNG HOÀN TOÀN!")
    print(f"   🔹 Link cục bộ (Trên máy này): {local_url}")
    if public_url:
        print(f"   🔥 ĐƯỜNG LINK CÔNG KHAI (GỬI CHO MỌI NGƯỜI):")
        print(f"   👉 {public_url}")
    else:
        print("   ⚠️ Đang kết nối đường hầm trong nền, hãy kiểm tra lại kết nối mạng.")
    print(f"   🔹 Giới hạn thiết bị:         Tối đa 20 máy đồng thời")
    print(f"   🔹 Giám sát số máy:          {local_url}/api/beta/status")
    print("=" * 68)
    print("💡 HƯỚNG DẪN:")
    print("   - Bạn gửi đường link công khai ở trên cho bất kỳ ai muốn test.")
    print("   - Khi muốn DỪNG HOÀN TOÀN: Hãy nhấn [Ctrl + C] hoặc ĐÓNG CỬA SỔ NÀY.")
    print("   - Khi đóng, đường link sẽ tự động ngắt kết nối an toàn.")
    print("=" * 68 + "\n")

    # Tự động mở trình duyệt với đường link công khai hoặc local
    target_to_open = public_url if public_url else local_url
    webbrowser.open(target_to_open)

    try:
        while True:
            time.sleep(1)
            if server_proc.poll() is not None:
                break
    except KeyboardInterrupt:
        print("\n🛑 Đang dừng toàn bộ dịch vụ...")
    finally:
        if tunnel_proc:
            tunnel_proc.terminate()
        if server_proc:
            server_proc.terminate()
        print("👋 Đã tắt Web Server và đóng Cloudflare Tunnel an toàn 100%!")

if __name__ == "__main__":
    main()

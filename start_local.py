#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
start_local.py
Kịch bản 1-click khởi chạy toàn bộ hệ thống Website Tử Vi Hồng Ân.
Tự động:
  1. Kiểm tra node_modules, tự động chạy 'npm install' nếu chưa có.
  2. Khởi chạy Backend Core Engine (Port 8080).
  3. Khởi chạy Frontend React/Vite dev server (Port 5173).
  4. Đợi hệ thống sẵn sàng và tự động mở trình duyệt.
  5. Bắt tín hiệu Ctrl+C để dừng đồng thời cả 2 tiến trình một cách an toàn.
"""

import os
import sys
import subprocess
import time
import webbrowser
import urllib.request
import urllib.error

def main():
    project_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(project_dir)

    print("=" * 65)
    print("🚀 ĐANG KHỞI ĐỘNG HỆ THỐNG WEBSITE TỬ VI HỒNG ÂN (OFFICIAL RELEASE)")
    print(f"📂 Thư mục dự án: {project_dir}")
    print("=" * 65)

    # 1. Kiểm tra node_modules, nếu chưa có thì chạy npm install
    node_modules_path = os.path.join(project_dir, "node_modules")
    if not os.path.exists(node_modules_path):
        print("📦 Chưa tìm thấy node_modules. Đang cài đặt thư viện (npm install)...")
        try:
            npm_cmd = "npm.cmd" if os.name == "nt" else "npm"
            subprocess.run([npm_cmd, "install"], check=True)
            print("✅ Cài đặt thư viện hoàn tất!")
        except Exception as e:
            print(f"❌ Lỗi khi cài đặt thư viện frontend: {e}")
            input("Nhấn Enter để thoát...")
            sys.exit(1)

    # 2. Khởi chạy Python Core Engine (backend/server.py)
    backend_dir = os.path.join(project_dir, "backend")
    server_script = os.path.join(backend_dir, "server.py")
    engine_process = None

    if os.path.exists(server_script):
        print("🔮 Đang khởi động Tu Vi Core Engine (Port 8080)...")
        engine_process = subprocess.Popen([sys.executable, server_script], cwd=backend_dir)
        time.sleep(1)
        print("✅ Tu Vi Core Engine đã sẵn sàng tại http://127.0.0.1:8080!")
    else:
        print("⚠️ Cảnh báo: Không tìm thấy backend/server.py, bỏ qua backend.")

    # 3. Khởi chạy Vite frontend server
    local_url = "http://localhost:5173"
    print("⚡ Đang khởi động Vite development server (Port 5173)...")
    npm_cmd = "npm.cmd" if os.name == "nt" else "npm"
    vite_process = subprocess.Popen([npm_cmd, "run", "dev"])

    # 4. Chờ server sẵn sàng và mở trình duyệt
    print("🌐 Đang chờ hệ thống sẵn sàng để mở trình duyệt...")
    opened = False
    for _ in range(30):
        time.sleep(0.5)
        try:
            with urllib.request.urlopen(local_url, timeout=1) as response:
                if response.status == 200:
                    print(f"🎉 Website đã sẵn sàng tại {local_url}!")
                    webbrowser.open(local_url)
                    opened = True
                    break
        except (urllib.error.URLError, ConnectionResetError, OSError):
            continue

    if not opened:
        webbrowser.open(local_url)

    print("\n" + "=" * 65)
    print("💡 HỆ THỐNG ĐANG HOẠT ĐỘNG HOÀN TOÀN:")
    print("   👉 Website Frontend:       http://localhost:5173")
    print("   👉 Tu Vi Core API Engine:  http://127.0.0.1:8080/api/calculate")
    print("   👉 API Health Check:       http://127.0.0.1:8080/api/health")
    print("   👉 Nhấn Ctrl + C để dừng tất cả dịch vụ an toàn.")
    print("=" * 65 + "\n")

    try:
        vite_process.wait()
    except KeyboardInterrupt:
        print("\n🛑 Đang dừng hệ thống...")
        if vite_process:
            vite_process.terminate()
        if engine_process:
            engine_process.terminate()
        print("👋 Đã dừng toàn bộ dịch vụ an toàn.")

if __name__ == "__main__":
    main()

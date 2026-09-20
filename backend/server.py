#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
backend/server.py
Máy chủ HTTP & REST API phục vụ Website Tử Vi Hồng Ân (Official Release).
Cung cấp:
  - REST API /api/calculate : Tính toán và an sao Tử Vi Đẩu Số 14 chính tinh & 110+ phụ tinh.
  - REST API /api/health    : Kiểm tra trạng thái máy chủ (Health Check).
  - Phục vụ Static Files     : Hỗ trợ phục vụ thư mục dist/ (production) hoặc public/ (dev fallback).
  - An toàn đa luồng        : SafeThreadingHTTPServer chống xung đột cổng trên Windows/Linux.
"""

import os
import sys
import json
import posixpath
import urllib.parse
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

# Thêm thư mục backend vào sys.path
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(BACKEND_DIR, ".."))
DIST_DIR = os.path.join(PROJECT_ROOT, "dist")
PUBLIC_DIR = os.path.join(PROJECT_ROOT, "public")

if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from tuvi_engine import calculate_tuvi_chart

# Cấu hình mặc định
CONFIG = {
    "HOST": os.getenv("HOST", "0.0.0.0"),
    "PORT": int(os.getenv("PORT", "8080")),
    "CORS_ORIGIN": os.getenv("CORS_ORIGIN", "*"),
}


class TuViRequestHandler(SimpleHTTPRequestHandler):
    """Bộ xử lý yêu cầu HTTP cho API và Static files."""

    FORBIDDEN_EXTENSIONS = {".py", ".pyc", ".env", ".git", ".bak", ".swp", ".key", ".log", ".DS_Store"}
    FORBIDDEN_FILENAMES = {".env", ".gitignore", "requirements.txt", "package.json", "vite.config.js"}

    extensions_map = {
        **SimpleHTTPRequestHandler.extensions_map,
        "": "application/octet-stream",
        ".js": "application/javascript; charset=utf-8",
        ".mjs": "application/javascript; charset=utf-8",
        ".css": "text/css; charset=utf-8",
        ".html": "text/html; charset=utf-8",
        ".htm": "text/html; charset=utf-8",
        ".json": "application/json; charset=utf-8",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".gif": "image/gif",
        ".svg": "image/svg+xml",
        ".ico": "image/x-icon",
        ".webp": "image/webp",
        ".avif": "image/avif",
        ".woff2": "font/woff2",
        ".woff": "font/woff",
        ".ttf": "font/ttf",
        ".otf": "font/otf",
        ".wasm": "application/wasm",
        ".pdf": "application/pdf",
        ".txt": "text/plain; charset=utf-8",
    }

    def __init__(self, *args, **kwargs):
        # Xác định thư mục tĩnh ưu tiên: dist/ nếu đã build, ngược lại dùng public/
        serve_dir = DIST_DIR if os.path.exists(DIST_DIR) else PUBLIC_DIR
        if not os.path.exists(serve_dir):
            os.makedirs(serve_dir, exist_ok=True)
        super().__init__(*args, directory=serve_dir, **kwargs)

    def list_directory(self, path):
        """Chặn duyệt cây thư mục vì lý do an toàn."""
        self.send_error(403, "Duyệt thư mục bị từ chối")
        return None

    def _send_cors_headers(self):
        """Gửi các tiêu đề CORS cho phép gọi API liên miền an toàn."""
        self.send_header("Access-Control-Allow-Origin", CONFIG["CORS_ORIGIN"])
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, HEAD")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization, If-None-Match")

    def _is_forbidden(self, rel_path: str) -> bool:
        """Kiểm tra tệp tin nhạy cảm."""
        base = os.path.basename(rel_path).lower()
        if base in self.FORBIDDEN_FILENAMES:
            return True
        ext = os.path.splitext(base)[1].lower()
        if ext in self.FORBIDDEN_EXTENSIONS:
            return True
        if base.startswith(".") and base not in (".", ".."):
            return True
        if ".." in rel_path.split("/"):
            return True
        return False

    def do_OPTIONS(self):
        """Xử lý Preflight CORS."""
        self.send_response(200)
        self._send_cors_headers()
        self.end_headers()

    def do_HEAD(self):
        if self.path in ["/api/health", "/api/health/"]:
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self._send_cors_headers()
            self.end_headers()
            return
        return super().do_HEAD()

    def do_GET(self):
        # 1. API Health Check
        if self.path in ["/api/health", "/api/health/"]:
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self._send_cors_headers()
            self.end_headers()
            payload = {
                "status": "ok",
                "service": "Tu Vi Hong An Core API Engine",
                "version": "1.0.0-release-1909",
                "static_directory": "dist" if os.path.exists(DIST_DIR) else "public"
            }
            self.wfile.write(json.dumps(payload, ensure_ascii=False).encode("utf-8"))
            return

        # 2. Xử lý phục vụ tệp tĩnh
        clean_path = urllib.parse.unquote(self.path.split("?")[0].split("#")[0]).replace("\\", "/")
        norm_path = posixpath.normpath(clean_path).lstrip("/")

        if self._is_forbidden(norm_path):
            self.send_error(403, "Quyền truy cập bị từ chối")
            return

        if norm_path in ("", ".", "/"):
            norm_path = "index.html"

        target_file = os.path.join(self.directory, norm_path)
        if os.path.isdir(target_file):
            index_in_dir = os.path.join(target_file, "index.html")
            if os.path.isfile(index_in_dir):
                self.path = "/" + norm_path.rstrip("/") + "/index.html"
            else:
                self.send_error(403, "Duyệt thư mục bị từ chối")
                return
        else:
            self.path = "/" + norm_path

        return super().do_GET()

    def do_POST(self):
        if self.path == "/api/calculate":
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length).decode("utf-8")

            try:
                params = json.loads(post_data) if post_data else {}
                chart_data = calculate_tuvi_chart(params)
                response_json = json.dumps(chart_data, ensure_ascii=False)

                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write(response_json.encode("utf-8"))
            except Exception as e:
                error_resp = json.dumps({"error": str(e)}, ensure_ascii=False)
                self.send_response(500)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write(error_resp.encode("utf-8"))
        else:
            self.send_error(404, "Không tìm thấy endpoint API")

    def log_message(self, format, *args):
        # Format log ngắn gọn
        sys.stderr.write(f"[{self.log_date_time_string()}] {format % args}\n")


class SafeThreadingHTTPServer(ThreadingHTTPServer):
    """Máy chủ HTTP đa luồng an toàn, chống giữ port trên Windows."""

    def server_bind(self):
        if sys.platform == "win32":
            import socket
            if hasattr(socket, "SO_EXCLUSIVEADDRUSE"):
                self.allow_reuse_address = 0
                self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 0)
                self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_EXCLUSIVEADDRUSE, 1)
        super().server_bind()


def run_server(host: str = None, port: int = None):
    host = host or CONFIG["HOST"]
    port = port or CONFIG["PORT"]
    server_address = (host, port)

    try:
        httpd = SafeThreadingHTTPServer(server_address, TuViRequestHandler)
    except OSError as err:
        print(f"\n❌ [LỖI KHỞI ĐỘNG] Cổng {port} đang bị chiếm dụng. Vui lòng kiểm tra lại.")
        print(f"   Chi tiết: {err}\n")
        raise

    display_host = "localhost" if host in ["0.0.0.0", ""] else host
    print(f"=" * 60)
    print(f"  🚀 MÁY CHỦ TỬ VI HỒNG ÂN - CORE API ENGINE")
    print(f"  👉 API Endpoint:    http://{display_host}:{port}/api/calculate")
    print(f"  👉 Health Check:     http://{display_host}:{port}/api/health")
    print(f"  👉 Static Files:     {httpd.RequestHandlerClass(None, None, httpd, directory=httpd.RequestHandlerClass.directory if hasattr(httpd.RequestHandlerClass, 'directory') else DIST_DIR if os.path.exists(DIST_DIR) else PUBLIC_DIR).directory}")
    print(f"=" * 60)
    print(f"  Nhấn Ctrl + C để dừng máy chủ.\n")

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Đang dừng máy chủ...")
        httpd.server_close()
        print("✓ Máy chủ đã dừng an toàn.")


if __name__ == "__main__":
    p = CONFIG["PORT"]
    h = CONFIG["HOST"]
    if len(sys.argv) > 1:
        try:
            p = int(sys.argv[1])
        except ValueError:
            pass
    if len(sys.argv) > 2:
        h = sys.argv[2]
    run_server(h, p)

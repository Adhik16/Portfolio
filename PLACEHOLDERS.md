# Placeholder Content Guide

> Use this file to track what needs to be replaced with real data.
> Check off items as you fill them in.

---

## 1. Metadata — `app/layout.tsx`

- [ ] **Title**: `title: "Adhik Shakya — SOC Analyst | Cybersecurity Portfolio"` → replace with your preferred title
- [ ] **Description**: `description: "Cybersecurity portfolio of Adhik Shakya..."` → write your own description
- [ ] **Keywords**: `keywords: ["cybersecurity", "SOC analyst", ...]` → add relevant keywords
- [ ] **Open Graph**: `openGraph.title`, `openGraph.description` → update for social sharing

---

## 2. About — `components/sections/about.tsx`

- [ ] **Bio paragraph 1** (line ~77): `"I'm a SOC Analyst with a deep passion for cybersecurity..."` → replace with your real bio
- [ ] **Bio paragraph 2** (line ~83): `"When I'm not in the SOC, I'm sharpening my skills..."` → replace or remove
- [ ] **Stats** (line ~14-18):
  - `"5+ Projects Completed"` → real number
  - `"3+ Certifications"` → real number
  - `"20+ CTF Challenges"` → real number
- [ ] **Focus Areas** (line ~93-101): 8 badges — add/remove as needed
  - `Threat Detection`, `SIEM (Splunk / ELK)`, `Incident Response`, `Network Security`, `Log Analysis`, `Python Scripting`, `Wireshark`, `MITRE ATT&CK`
- [ ] **Resume link**: Consider adding a real resume download button (currently removed)

---

## 3. Skills — `components/sections/skills.tsx`

- [ ] **All 6 skill categories** (line ~17-54): Replace titles, descriptions, and tags with real skills
  - `Network Security` → real title
  - `SIEM & Monitoring` → real title
  - `Incident Response` → real title
  - `Threat Intelligence` → real title
  - `Pentesting Basics` → real title
  - `Security Tools` → real title
- [ ] **Tags in each category**: Replace with tools/technologies you actually use

---

## 4. Projects — `components/sections/projects.tsx`

- [ ] **SOC Dashboard** (featured, ~line 13-20): Real project name, description, tags, GitHub URL, live URL
- [ ] **Log Analyzer CLI** (~line 21-28): Real project or remove
- [ ] **Phishing Email Detector** (~line 29-36): Real project or remove
- [ ] **CTF Writeup Repository** (~line 37-44): Real project or remove
- [ ] **Threat Intel Aggregator** (~line 45-52): Real project or remove
- [ ] **Network Scanner** (~line 53-60): Real project or remove
- [ ] **GitHub URLs**: Replace `"#"` with real links
- [ ] **Live URLs**: Replace `"#"` with real links, or set to `null` to hide link button

---

## 5. Blog — `components/sections/blog.tsx`

- [ ] **Post 1** (~line 14-20): Real title, date, read time, excerpt, tags
- [ ] **Post 2** (~line 21-28): Real or remove
- [ ] **Post 3** (~line 29-36): Real or remove
- [ ] **Post 4** (~line 37-44): Real or remove
- [ ] Add actual links to blog posts (currently the "Read" buttons have no href)

---

## 6. Footer — `components/layout/footer.tsx`

- [ ] **GitHub URL** (line ~8): `"https://github.com"` → your GitHub profile
- [ ] **LinkedIn URL** (line ~9): `"https://linkedin.com"` → your LinkedIn profile
- [ ] **Twitter/X URL** (line ~10): `"https://twitter.com"` → your Twitter/X profile (or remove)
- [ ] **Email** (line ~11): `"mailto:hello@example.com"` → your email
- [ ] **Name** (line ~22): `"Adhik Shakya"` → confirm or update
- [ ] **Tagline** (line ~25): `"SOC Analyst • Cybersecurity Enthusiast"` → update if needed

---

## 7. Contact — `components/sections/contact.tsx`

- [ ] **Email address** (line ~249): `"mailto:hello@example.com"` → your real email
- [ ] **Location** (line ~252): `"Available for remote opportunities"` → update if needed
- [ ] **GitHub link** (line ~268): `"https://github.com"` → your GitHub
- [ ] **LinkedIn link** (line ~287): `"https://linkedin.com"` → your LinkedIn
- [ ] **Form backend**: Currently console.logs only. Connect to Web3Forms/Formspree/etc. for real submissions (see Phase 6)

---

## Quick Replace Checklist

| Priority | File | Lines | What |
|---|---|---|---|
| 🔴 High | `footer.tsx` | 8-11 | Social URLs + email |
| 🔴 High | `contact.tsx` | 249, 268, 287 | Email + social links |
| 🟡 Medium | `about.tsx` | 77-85 | Bio paragraphs |
| 🟡 Medium | `projects.tsx` | 13-60 | Project data |
| 🟢 Low | `blog.tsx` | 14-44 | Blog post data |
| 🟢 Low | `skills.tsx` | 17-54 | Skill categories |
| 🟢 Low | `layout.tsx` | 19-35 | Metadata + OG |

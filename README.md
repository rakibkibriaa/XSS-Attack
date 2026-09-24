# XSS Attack and Self-Propagating Worm on Elgg

A study of stored Cross-Site Scripting (XSS) vulnerabilities using [SEED Labs'](https://seedsecuritylabs.org/) Elgg social networking platform. The project covers how XSS enables session hijacking, unauthorized HTTP requests from a victim's browser, and self-replicating JavaScript worms — all without the victim taking any deliberate action beyond visiting a page.

The full write-up with screenshots of each step is in `Code/1905098_Report.pdf`.

## Background

Elgg is a deliberately vulnerable web application used for security education. The lab environment runs in Docker and is isolated to `www.seed-server.com` — a local address that never touches the public internet.

A stored XSS attack works like this: an attacker injects a JavaScript payload into a field that gets saved to the database (a profile description, a post, etc.). Every time another user's browser renders that field, it executes the injected script in that user's session — with that user's cookies, tokens, and privileges.

The key observation that makes these attacks possible is that Elgg includes its CSRF protection tokens directly in the page's JavaScript context (`elgg.security.token.__elgg_ts` and `elgg.security.token.__elgg_token`). An injected script running on that page can read them just as easily as Elgg's own code can, which means it can forge authenticated requests on the victim's behalf.

## Environment

```bash
# Add the DNS entry
echo "10.9.0.5 www.seed-server.com" | sudo tee -a /etc/hosts

# Start the lab containers
wget https://seedsecuritylabs.org/Labs_20.04/Files/Web_XSS_Elgg/Labsetup.zip
unzip Labsetup.zip && cd Labsetup
docker-compose build
docker-compose up
```

The containers expose `www.seed-server.com` (web server at 10.9.0.5) and a MySQL database at 10.9.0.6. To reset all data: `sudo rm -rf mysql_data`.

## Scripts

All scripts are injected as stored XSS payloads into Samy's Elgg profile. Every script guards against self-infection by checking `user_guid != page_owner_guid`: since Samy's own GUID equals `page_owner_guid` when he visits his own profile, the payload skips execution for him.

### Task 1 — Force-add the profile owner as a friend (`1905098_Task_1.js`)

Forges a GET request to Elgg's friend-add endpoint using the CSRF tokens read from the page context. The target GUID comes from `elgg.page_owner.guid`, so whoever visits Samy's profile ends up sending a friend request to themselves (i.e., to Samy) without clicking anything.

The interesting discovery here was that Elgg's friend-add URL requires the `__elgg_ts` and `__elgg_token` parameters to appear **twice** each, which only became clear by inspecting the legitimate request in Firefox's network tab.

### Task 2 — Modify the victim's profile (`1905098_Task_2.js`)

Forges a POST request to `/action/profile/edit`. The victim's GUID is read from `elgg.session.user.guid` and inserted as the `guid` field, so the edit targets the visitor's own account. The body overwrites every profile field with fixed strings, and sets all access levels to "Logged in Users" (`&accesslevel[field_name]=1`).

The content-type is `application/x-www-form-urlencoded`, so all field values are passed as `&fieldname=value` pairs in the POST body. The full list of fields was found by inspecting the request payload of a legitimate profile edit in Firefox's network inspector.

### Task 3 — Post on the wire on behalf of the victim (`1905098_Task_3.js`)

Same pattern as Task 2, but targets `/action/thewire/add`. Posts a fixed message body containing a link to Samy's profile, attributed to the visitor's account.

### Task 4 — Self-propagating worm (`1905098_Task_4.js`)

Combines all three actions above into a single payload that also replicates itself. When any user (other than Samy) visits an infected profile, the worm:

1. Sends a friend request to the profile owner (Task 1 logic)
2. Posts the visitor's own profile URL to the wire (Task 3 logic)
3. Copies itself into the visitor's profile description (Task 2 logic), so anyone who later visits the visitor's profile is infected in turn

Self-copying is the technically interesting part. The script tag is given `id="worm"`. At runtime, the worm reads its own source with `document.getElementById("worm").innerHTML`, wraps the opening and closing script tags around it, URL-encodes the whole thing with `encodeURIComponent`, and writes that as the `description` field of the profile-edit POST. The `encodeURIComponent` step is essential: without it, the embedded angle brackets and quotes would break the URL-encoded form body.

The propagation guard is `user_guid != page_owner_guid && user_guid != 59`. Samy's GUID is 59, so the worm skips him even if an already-propagated copy ends up on a page he visits.

## What this demonstrates

- **Stored XSS bypasses same-origin policy** as long as the malicious script is served from the target origin. Because the payload lives in Elgg's own database and is served from `www.seed-server.com`, the browser treats it as a first-party script with full access to cookies and the DOM.
- **CSRF tokens don't protect against XSS** when the tokens are readable from the DOM. The standard CSRF defence assumes the attacker cannot read the page; XSS breaks that assumption entirely.
- **Self-replicating worms spread exponentially.** Each newly infected profile becomes a vector. The more people view infected profiles, the faster the worm propagates, without the original attacker doing anything more after the first injection.
- **Protecting the attacker's own account** requires only knowing their own GUID and checking it before executing — a trivial addition to any payload.

## Repository layout

```
1905098_Task_1.js     # force friend-add via GET
1905098_Task_2.js     # profile modification via POST
1905098_Task_3.js     # wire post via POST
1905098_Task_4.js     # self-propagating worm (combines all three)
1905098_Report.pdf    # full write-up with network inspection screenshots
```

## Author

**Rakib Kibria** (1905098) · [GitHub](https://github.com/rakibkibriaa)
Department of Computer Science and Engineering, BUET

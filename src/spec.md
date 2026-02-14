# Specification

## Summary
**Goal:** Let admins upload multiple LIC plan posters in one session, auto-map them to the correct plan titles (with best-match selection), prevent duplicate plan entries, persist plans across upgrades, and fix the current build/deploy configuration error with clearer UI failures.

**Planned changes:**
- Update the LIC Plans admin upload UI to accept multiple images per session (or maintain a pending queue across repeated selections).
- Derive a plan title for each selected image from its filename and show the derived title in the UI before upload (including explicit mapping for “jivan/jeevan utsav” → “Jeevan Utsav” and “jivan/jeevan umang” → “Jeevan Umang”).
- When multiple uploads map to the same plan title, deterministically select the “best-matched” poster using filename specificity (prefer names containing “LIC” and the exact plan name; if still tied, prefer the highest numeric suffix) and show the chosen file to the admin before submission.
- On upload/apply: update an existing plan (matching `metadata.title`) instead of creating duplicates; create a new plan only when no match exists.
- Make backend plan storage upgrade-safe so plans (including poster reference/blob and structured content) persist across canister upgrades/redeploys while keeping existing authorization behavior.
- Resolve the build/deploy failure that reports “Configuration error detected” and add a clear, actionable English UI error when an upload/apply step fails due to configuration issues.

**User-visible outcome:** Admins can select and upload many plan images at once, preview how each image will map to a plan title (and which file is chosen when there are duplicates), update existing plans without creating duplicates, and see plans/posters remain after refreshes and redeploys; configuration-related failures no longer block builds and show clearer UI messages if they occur at runtime.

# Specification

## Summary
**Goal:** Enable admin upload of LIC plan poster images (Jeevan Utsav, Jivan Umang), extract text via client-side OCR, and persist plan entries so they remain available after refresh/redeploy.

**Planned changes:**
- Add persistent backend storage for plan entries including plan name, structured/extracted plan content, and the uploaded JPEG image bytes.
- Add admin-only backend methods to create plan entries and fetch plan image bytes; add public backend queries to list plans for the Plans page.
- Update the Plans page (`frontend/src/pages/LICPlans.tsx`) to include an admin-only upload UI that creates two separate plan entries named exactly “Jeevan Utsav” (from `jivan utsav plan-1.jpg`) and “Jivan Umang” (from `Jivan Umang-1.jpg`).
- Implement client-side OCR on upload and store both raw extracted text and a minimal parsed/structured representation with the plan entry.
- Render the Plans page dynamically from backend plan entries, showing plan name, structured details, and the poster image, plus a CTA that scrolls to the existing Contact section on the home page.

**User-visible outcome:** Admins can upload the two plan posters on the Plans page to create persistent plan entries with OCR-extracted details; all users can view the dynamically rendered plan list with images and readable plan details, and use a CTA to scroll to Contact.

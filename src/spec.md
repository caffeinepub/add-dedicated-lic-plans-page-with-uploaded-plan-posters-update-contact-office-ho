# Specification

## Summary
**Goal:** Allow admins to upload a poster image for the LIC plan “Jeevan Utsav” and display plan poster images throughout the LIC Plans UI.

**Planned changes:**
- Update the LIC Plans admin upload workflow to accept the uploaded file `jivan utsav-6.jpg` and map it to the plan title “Jeevan Utsav” (handling Jivan/Jeevan spelling variants).
- When Upload & Process runs, create or update the “Jeevan Utsav” plan entry to store the uploaded image as the plan poster and populate structured plan content using the existing OCR simulation.
- Render each plan’s stored poster image in the LIC Plans UI (in plan list cards and in the expanded/detail view), with sensible sizing/aspect handling and a fallback placeholder when no image is available or rendering fails.

**User-visible outcome:** An authenticated admin can upload `jivan utsav-6.jpg` to attach it to “Jeevan Utsav”, and users can see plan poster thumbnails on the LIC Plans list and in each plan’s detail view, with a clean placeholder if an image is missing.

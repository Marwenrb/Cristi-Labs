# Contact Form — Developer Integration Guide

> Step-by-step guide to connect the Cristi Labs Contact form to your email service or backend API.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Form Fields & State](#2-form-fields--state)
3. [Where to Insert the API Call](#3-where-to-insert-the-api-call)
4. [Option A: EmailJS](#4-option-a-emailjs)
5. [Option B: Formspree](#5-option-b-formspree)
6. [Option C: Custom Backend](#6-option-c-custom-backend)
7. [Environment Variables](#7-environment-variables)
8. [Customizing Success & Error Messages](#8-customizing-success--error-messages)
9. [Error Handling](#9-error-handling)
10. [Testing](#10-testing)

---

## 1. Overview

**File**: `frontend/src/pages/Contact/Contact.jsx`

The Contact page includes:

- **Floating label inputs** (Name, Email, Company, Message)
- **Client-side validation** (required fields, email regex)
- **GSAP animations** (magnetic button, success state)
- **Simulation mode** — Currently uses `setTimeout(2000)` to mimic a network request

Your task: Replace the simulation with a real API call.

---

## 2. Form Fields & State

### Form Data Structure

```javascript
formData = {
  name: "",      // Required
  email: "",     // Required, validated with regex
  company: "",   // Optional
  message: "",   // Required
}
```

### State Variables

| State | Type | Purpose |
|-------|------|---------|
| `formData` | object | Input values |
| `errors` | object | `{ name: true, email: true, message: true }` for validation |
| `focused` | string \| null | Active field for floating label |
| `isSubmitting` | boolean | Disables button, shows "TRANSMITTING..." |
| `isSuccess` | boolean | Hides form, shows success message |

### Validation Rules

- **name**: Required (non-empty after trim)
- **email**: Required + must match `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- **message**: Required (non-empty after trim)
- **company**: Optional

---

## 3. Where to Insert the API Call

**Location**: `frontend/src/pages/Contact/Contact.jsx` → `handleSubmit` function

Find this block:

```javascript
/* ────────────────────────────────────────────────────────
 *  INTEGRATION POINT
 *  Replace the setTimeout below with your API call.
 * ──────────────────────────────────────────────────────── */
setTimeout(() => {
    setIsSubmitting(false);
    setIsSuccess(true);
    // ... GSAP animations
}, 2000);
```

**Replace** the `setTimeout` block with your actual API logic. Keep the success animations (form fade-out, success message reveal) — only change how you get to `isSuccess === true`.

---

## 4. Option A: EmailJS

[EmailJS](https://www.emailjs.com/) sends emails from the frontend without a backend.

### Step 1: Install

```bash
npm install @emailjs/browser
```

### Step 2: Create EmailJS Account

1. Sign up at [emailjs.com](https://www.emailjs.com/)
2. Add an **Email Service** (Gmail, Outlook, etc.)
3. Create an **Email Template** with variables: `{{from_name}}`, `{{from_email}}`, `{{company}}`, `{{message}}`
4. Note your **Service ID**, **Template ID**, and **Public Key**

### Step 3: Add to Contact.jsx

```javascript
import emailjs from "@emailjs/browser";

// In handleSubmit, after validate() passes and setIsSubmitting(true):

try {
  await emailjs.send(
    import.meta.env.VITE_EMAILJS_SERVICE_ID,
    import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    {
      from_name: formData.name,
      from_email: formData.email,
      company: formData.company,
      message: formData.message,
    },
    import.meta.env.VITE_EMAILJS_PUBLIC_KEY
  );

  setIsSubmitting(false);
  setIsSuccess(true);

  // Keep the GSAP animations below (form fade-out, success reveal)
  if (formRef.current) {
    gsap.to(formRef.current, { opacity: 0, yPercent: -3, duration: 0.5, ease: "power3.in" });
  }
  setTimeout(() => {
    if (successRef.current) {
      gsap.fromTo(successRef.current, { opacity: 0, scale: 0.95, yPercent: 10 }, {
        opacity: 1, scale: 1, yPercent: 0, duration: 0.8, ease: "power3.out",
      });
    }
  }, 600);
} catch (err) {
  setIsSubmitting(false);
  setErrors({ submit: "Failed to send. Please try again." });
  // Optional: gsap shake on error
}
```

### Step 4: Environment Variables

Create `frontend/.env`:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

---

## 5. Option B: Formspree

[Formspree](https://formspree.io/) provides a form endpoint with no backend code.

### Step 1: Create Formspree Form

1. Sign up at [formspree.io](https://formspree.io/)
2. Create a new form
3. Copy the form ID (e.g. `xyzabcde`)

### Step 2: Replace handleSubmit Logic

```javascript
try {
  const res = await fetch("https://formspree.io/f/YOUR_FORM_ID", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: formData.name,
      email: formData.email,
      company: formData.company,
      message: formData.message,
    }),
  });

  if (!res.ok) throw new Error("Failed to send");

  setIsSubmitting(false);
  setIsSuccess(true);

  // Keep GSAP animations (same as above)
  if (formRef.current) {
    gsap.to(formRef.current, { opacity: 0, yPercent: -3, duration: 0.5, ease: "power3.in" });
  }
  setTimeout(() => {
    if (successRef.current) {
      gsap.fromTo(successRef.current, { opacity: 0, scale: 0.95, yPercent: 10 }, {
        opacity: 1, scale: 1, yPercent: 0, duration: 0.8, ease: "power3.out",
      });
    }
  }, 600);
} catch (err) {
  setIsSubmitting(false);
  setErrors({ submit: "Failed to send. Please try again." });
}
```

### Step 3: Use Environment Variable (Recommended)

```env
VITE_FORMSPREE_FORM_ID=your_form_id
```

```javascript
const formId = import.meta.env.VITE_FORMSPREE_FORM_ID;
const res = await fetch(`https://formspree.io/f/${formId}`, { ... });
```

---

## 6. Option C: Custom Backend

Use your own API (Express, Next.js, etc.) to receive the form and send email via Nodemailer, SendGrid, Resend, etc.

### Example: Express + Nodemailer

**Backend** (Node.js):

```javascript
// POST /api/contact
app.post("/api/contact", async (req, res) => {
  const { name, email, company, message } = req.body;
  // Validate, then send via Nodemailer/SendGrid
  // ...
  res.json({ success: true });
});
```

**Frontend** (Contact.jsx):

```javascript
const apiUrl = import.meta.env.VITE_CONTACT_API_URL || "/api/contact";

const res = await fetch(apiUrl, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(formData),
});

if (!res.ok) throw new Error("Failed to send");

setIsSubmitting(false);
setIsSuccess(true);
// ... GSAP animations
```

### CORS

Ensure your backend allows requests from your frontend origin:

```javascript
// Express example
app.use(cors({ origin: "https://your-domain.com" }));
```

---

## 7. Environment Variables

Create `frontend/.env` (and `.env.production` for production):

```env
# EmailJS
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=

# Or Formspree
VITE_FORMSPREE_FORM_ID=

# Or Custom API
VITE_CONTACT_API_URL=https://api.yourdomain.com/contact
```

**Important**: Restart the dev server after changing `.env`.

---

## 8. Customizing Success & Error Messages

### Success Message

**Location**: `Contact.jsx` → Success State block (`isSuccess && (...)`)

```jsx
<h3 className="...">DATA PACKET TRANSMITTED.</h3>
<p className="...">Your inquiry has been received by our executive team.
Expect a response within 24–48 business hours.</p>
```

Edit the text inside these elements. You can also change the checkmark icon or teal color (`#14b8a6`).

### Error Message (Submit Failure)

Add a `submit` error key and display it:

```jsx
{errors.submit && (
  <p className="text-[#f97316] text-sm mt-4">{errors.submit}</p>
)}
```

---

## 9. Error Handling

### Recommended Pattern

```javascript
try {
  const res = await fetch(/* ... */);
  if (!res.ok) throw new Error("Server error");
  const data = await res.json();
  if (data.error) throw new Error(data.error);

  setIsSubmitting(false);
  setIsSuccess(true);
  // ... animations
} catch (err) {
  setIsSubmitting(false);
  setErrors({ submit: err.message || "Failed to send. Please try again." });
}
```

### User Feedback

- **Validation errors**: Orange border + GSAP shake on invalid fields
- **Network errors**: Set `errors.submit` and show a message below the button

---

## 10. Testing

### Local Testing

1. Use Formspree or EmailJS in test mode first
2. Check browser Network tab for 200 responses
3. Verify email arrives at configured inbox

### Production Checklist

- [ ] Environment variables set in hosting (Vercel, Netlify, etc.)
- [ ] CORS configured if using custom API
- [ ] Rate limiting considered for public endpoint
- [ ] Success/error messages reviewed for tone and clarity

---

## Quick Reference

| Item | Location |
|------|----------|
| Integration point | `Contact.jsx` → `handleSubmit` |
| Form fields | `formData` (name, email, company, message) |
| Success UI | `isSuccess && (...)` block |
| Validation | `validate()` function |
| Env vars | `frontend/.env` (VITE_* prefix) |

---

*Last updated: 2026 — Cristi Labs LLC*

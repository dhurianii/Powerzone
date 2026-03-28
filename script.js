/* =============================================================
   PowerZone Fitness — script.js

   TABLE OF CONTENTS:
   1.  Navbar — scroll effect + hamburger menu
   2.  Smooth active link highlight
   3.  WhatsApp form — build wa.me URL and open it
   4.  Plan cards — "Join Now" buttons open WhatsApp
   5.  Gallery lightbox — open/close on click
   6.  Scroll animations — fade-up on viewport entry
   7.  Hero parallax — subtle background move on scroll
============================================================= */


/* ─────────────────────────────────────────────
   1. NAVBAR
   
   What it does:
   - Adds "scrolled" class to navbar after 80px scroll
     → CSS uses this to add dark background + blur
   - Toggles mobile menu open/close on hamburger click
   - Closes mobile menu when a nav link is clicked
────────────────────────────────────────────── */

const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

// Add/remove "scrolled" class based on scroll position
window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Also run parallax on scroll (see Section 7)
  parallaxHero();
});

// Toggle mobile menu open/closed
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');   // Animates hamburger → X
  navLinks.classList.toggle('open');    // Slides menu in from right
});

// Close mobile menu when any nav link is clicked
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});


/* ─────────────────────────────────────────────
   2. ACTIVE NAV LINK HIGHLIGHT
   
   What it does:
   - Watches which section is currently in view
   - Adds "active" style to matching nav link
   - Uses IntersectionObserver (efficient, no scroll math)
────────────────────────────────────────────── */

const sections = document.querySelectorAll('section[id]');

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Remove active from all links
        document.querySelectorAll('.nav-link').forEach(l => {
          l.style.color = '';          // Reset to CSS default
        });
        // Add active to matching link
        const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (activeLink) {
          activeLink.style.color = '#39FF14';   // Neon green
        }
      }
    });
  },
  {
    threshold: 0.4,    // Section must be 40% visible to trigger
    rootMargin: '-80px 0px 0px 0px'  // Offset for fixed navbar height
  }
);

sections.forEach(section => navObserver.observe(section));


/* ─────────────────────────────────────────────
   3. WHATSAPP LEAD FORM
   
   What it does:
   - Reads Name, Phone, and Goal from the form fields
   - Validates they are not empty
   - Builds a wa.me URL with a pre-filled message
   - Opens WhatsApp in a new tab

   HOW TO CUSTOMISE:
   Change the phone number below to the real gym's
   WhatsApp number (include country code, no + or spaces)
   Example: India +91 98765 43210 → 919876543210
────────────────────────────────────────────── */

// ⚠️ CHANGE THIS to the gym's real WhatsApp number
const GYM_WHATSAPP = '919876543210';

const submitBtn = document.getElementById('submitBtn');

function sendToWhatsApp() {
  // Get values from form fields
  const name  = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const goal  = document.getElementById('goal').value;

  // Basic validation — don't send if fields are empty
  if (!name) {
    showFormError('Please enter your name');
    return;
  }
  if (!phone) {
    showFormError('Please enter your phone number');
    return;
  }

  // Build the pre-filled WhatsApp message
  // encodeURIComponent converts spaces and special chars to URL-safe format
  const message = encodeURIComponent(
    `Hi PowerZone Fitness! 👋\n\n` +
    `I'd like to book a FREE TRIAL.\n\n` +
    `Name: ${name}\n` +
    `Phone: ${phone}\n` +
    `Goal: ${goal}\n\n` +
    `Please let me know the next available slot!`
  );

  // Build the full WhatsApp URL
  const waURL = `https://wa.me/${GYM_WHATSAPP}?text=${message}`;

  // Open in new tab (works on mobile too — opens WhatsApp app)
  window.open(waURL, '_blank');

  // Show success feedback on the button
  submitBtn.textContent = '✓ Opening WhatsApp...';
  submitBtn.style.background = '#27cc0e';

  // Reset button after 3 seconds
  setTimeout(() => {
    submitBtn.textContent = 'Send on WhatsApp 💬';
    submitBtn.style.background = '';
  }, 3000);
}

// Helper: show a quick error message below the button
function showFormError(message) {
  // Remove any existing error first
  const existing = document.querySelector('.form-error');
  if (existing) existing.remove();

  const error = document.createElement('p');
  error.className = 'form-error';
  error.textContent = message;
  error.style.cssText = `
    color: #ff4444;
    font-size: 13px;
    text-align: center;
    margin-top: -12px;
  `;

  submitBtn.parentNode.insertBefore(error, submitBtn.nextSibling);

  // Auto-remove error after 3 seconds
  setTimeout(() => error.remove(), 3000);
}

// Attach click handler to the submit button
if (submitBtn) {
  submitBtn.addEventListener('click', sendToWhatsApp);
}

// Also allow pressing Enter in phone field to submit
document.getElementById('phone')?.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendToWhatsApp();
});


/* ─────────────────────────────────────────────
   4. PLAN CARDS — "JOIN NOW" BUTTONS
   
   What it does:
   - Each plan card has data-plan attribute (e.g. "Pro ₹2499/mo")
   - Clicking "Join Now" opens WhatsApp with that plan pre-filled
────────────────────────────────────────────── */

document.querySelectorAll('.plan-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    // Read which plan was clicked from the data attribute
    const plan = btn.getAttribute('data-plan');

    const message = encodeURIComponent(
      `Hi PowerZone Fitness! 💪\n\n` +
      `I'm interested in the *${plan}* membership.\n\n` +
      `Can you share more details and help me get started?`
    );

    window.open(`https://wa.me/${GYM_WHATSAPP}?text=${message}`, '_blank');
  });
});


/* ─────────────────────────────────────────────
   5. GALLERY LIGHTBOX
   
   What it does:
   - Clicking a gallery image opens a full-screen overlay
   - Shows the full-size version of that image
   - Clicking X or clicking outside the image closes it
   - Pressing Escape key also closes it
────────────────────────────────────────────── */

const lightbox      = document.getElementById('lightbox');
const lightboxImg   = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

// Open lightbox when any gallery item is clicked
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    // Get the full-size URL from data-full attribute
    const fullSrc = item.getAttribute('data-full');
    const altText = item.querySelector('img').getAttribute('alt');

    lightboxImg.src = fullSrc;
    lightboxImg.alt = altText;

    // Show the lightbox (CSS transitions opacity in)
    lightbox.classList.add('active');

    // Prevent background from scrolling while lightbox is open
    document.body.style.overflow = 'hidden';
  });
});

// Close lightbox when X button is clicked
lightboxClose.addEventListener('click', closeLightbox);

// Close lightbox when clicking the dark background (outside the image)
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) {    // Only if clicking the overlay, not the image
    closeLightbox();
  }
});

// Close lightbox on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';   // Restore background scrolling
  // Clear src to stop loading the image
  setTimeout(() => {
    lightboxImg.src = '';
  }, 300);   // Wait for fade-out transition to finish
}


/* ─────────────────────────────────────────────
   6. SCROLL ANIMATIONS — FADE UP
   
   What it does:
   - All elements with class "fade-up" start invisible
   - IntersectionObserver watches when they enter viewport
   - Adds "visible" class to trigger CSS transition
   - Much more efficient than listening to scroll events
   
   HOW TO USE:
   Add class="fade-up" to any element in HTML
   and it will animate in when scrolled into view
────────────────────────────────────────────── */

// Add fade-up class to all the grid items we want to animate
// (We do this in JS so the HTML stays cleaner)
const animateTargets = [
  '.plan-card',
  '.trainer-card',
  '.gallery-item',
  '.testimonial-card',
  '.stat-item',
  '.contact-form-wrap',
  '.contact-info-wrap',
];

animateTargets.forEach(selector => {
  document.querySelectorAll(selector).forEach(el => {
    el.classList.add('fade-up');
  });
});

// Observer that triggers when elements are 10% visible
const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Stop observing once animated — no need to watch it anymore
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.1,            // Trigger when 10% is visible
    rootMargin: '0px 0px -40px 0px'  // Trigger 40px before reaching bottom
  }
);

// Start observing all fade-up elements
document.querySelectorAll('.fade-up').forEach(el => {
  fadeObserver.observe(el);
});


/* ─────────────────────────────────────────────
   7. HERO PARALLAX
   
   What it does:
   - As you scroll down, the hero background image
     moves up slightly slower than the page
   - Creates a depth / layered effect
   - Very subtle — just 30% of scroll speed
────────────────────────────────────────────── */

const heroBg = document.querySelector('.hero-bg');

function parallaxHero() {
  if (!heroBg) return;

  // Only apply parallax if we're near the hero (first 800px of scroll)
  if (window.scrollY < 800) {
    const offset = window.scrollY * 0.3;    // 30% of scroll speed
    heroBg.style.transform = `scale(1.05) translateY(${offset}px)`;
  }
}


/* ─────────────────────────────────────────────
   INITIALISATION
   Run once when the page fully loads
────────────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {
  // Trigger scroll handler once on load
  // (in case user refreshes mid-page)
  parallaxHero();

  console.log('PowerZone Fitness — site loaded ✓');
  console.log('To customise: change GYM_WHATSAPP number at line ~60 of script.js');
});

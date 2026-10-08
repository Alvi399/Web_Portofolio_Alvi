document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Toggle
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', String(navLinks.classList.toggle('active')));
      navToggle.classList.toggle('active');
    });
  }

  // Smooth Scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth'
        });
        // Close nav on mobile
        if (navLinks.classList.contains('active')) {
          navLinks.classList.remove('active');
        }
      }
    });
  });

  // ===== MODERN SCROLL ANIMATIONS =====
  // Intersection Observer for scroll animations
  const animateElements = document.querySelectorAll('.animate-on-scroll');
  
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        // Unobserve after animation for better performance
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animateElements.forEach(el => observer.observe(el));
});

// ===== ANALYTICS TRACKING (T-40) =====
document.addEventListener('DOMContentLoaded', () => {
  const track = (eventType, targetId = null) => {
    fetch('/api/track-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_type: eventType, target_id: targetId })
    }).catch(() => {});
  };

  // Track CV downloads
  document.querySelectorAll('a[href^="/resume"]').forEach(el => {
    el.addEventListener('click', () => track('cv_download'));
  });

  // Track Contact page clicks & mailto
  document.querySelectorAll('a[href^="/contact"]').forEach(el => {
    el.addEventListener('click', () => track('contact_click'));
  });
  document.querySelectorAll('a[href^="mailto:"]').forEach(el => {
    el.addEventListener('click', () => track('email_click'));
  });

  // Track WhatsApp clicks
  document.querySelectorAll('a[href*="wa.me/"]').forEach(el => {
    el.addEventListener('click', () => track('whatsapp_click'));
  });

  // Track Project Views
  const isProjectDetail = window.location.pathname.startsWith('/projects/') && window.location.pathname !== '/projects/';
  if (isProjectDetail) {
    const slug = window.location.pathname.split('/').pop();
    // Fire event after a short delay to ensure it's a real view, not a bounce
    setTimeout(() => track('project_view', slug), 2000);
  }
});

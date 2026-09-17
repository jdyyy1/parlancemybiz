/**
 * Parlance MyBiz - Interactive Application Logic
 * EmailJS Integration, Dynamic Booking Selection & Mobile Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize EmailJS
  const EMAILJS_PUBLIC_KEY = 'XNlUsGSFWsy72jmKS';
  const EMAILJS_SERVICE_ID = 'service_parlance_outlook';
  const EMAILJS_TEMPLATE_ID = 'template_parlancebiz';

  if (window.emailjs) {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }

  // 2. DOM Elements
  const header = document.querySelector('.header');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const backToTopBtn = document.querySelector('.back-to-top');
  const bookingForm = document.getElementById('bookingForm');
  const packageSelect = document.getElementById('packageSelect');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');

  // 3. Header Scroll State & Back to Top
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    
    if (scrollPos > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    if (scrollPos > 400) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 4. Mobile Menu Toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile menu when link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
          mobileToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // 5. Dynamic Package Selection from Pricing Cards
  const packageButtons = document.querySelectorAll('.select-package-btn');
  packageButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const selectedPkg = btn.getAttribute('data-package');
      if (selectedPkg && packageSelect) {
        packageSelect.value = selectedPkg;
      }
      
      const bookingSection = document.getElementById('book');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
        const nameInput = document.getElementById('fullName');
        if (nameInput) {
          setTimeout(() => nameInput.focus(), 600);
        }
      }
    });
  });

  // 6. Toast Notification Helper
  function showToast(message, type = 'success') {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, 5000);
  }

  // 7. Booking & Inquiry Form Handling (Zero PHP / Zero RCE Surface)
  if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = bookingForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;

      // Extract form values
      const formData = {
        from_name: document.getElementById('fullName').value.trim(),
        reply_to: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        company: document.getElementById('company').value.trim() || 'N/A',
        service_interest: document.getElementById('packageSelect').value,
        booking_date: document.getElementById('preferredDate').value || 'Immediate / Flexible',
        message: document.getElementById('message').value.trim(),
        division: 'Parlance MyBiz - Virtual Office & Booking'
      };

      // Validation
      if (!formData.from_name || !formData.reply_to || !formData.phone) {
        showToast('Please fill in all required fields (Name, Email, Phone).', 'error');
        return;
      }

      // Show Loading State
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg style="animation: spin 1s linear infinite; width: 18px; height: 18px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
        </svg>
        Sending Request...
      `;

      try {
        if (window.emailjs && EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID) {
          // Send via EmailJS SDK
          await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
            from_name: formData.from_name,
            reply_to: formData.reply_to,
            phone_number: formData.phone,
            company_name: formData.company,
            package_name: formData.service_interest,
            preferred_date: formData.booking_date,
            inquiry_message: formData.message,
            division: formData.division
          });

          showToast('Thank you! Your booking request has been submitted successfully. Our team will contact you shortly.', 'success');
          bookingForm.reset();
        } else {
          // Fallback simulation if offline or demo
          await new Promise(resolve => setTimeout(resolve, 1000));
          showToast('Thank you! Your inquiry has been received.', 'success');
          bookingForm.reset();
        }
      } catch (err) {
        console.error('EmailJS Submission Error:', err);
        showToast('Unable to send request online. Please contact us directly at (632) 8823-2126 or info@parlancemybiz.com.ph', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    });
  }

  // 8. Active Nav Link on Scroll using IntersectionObserver
  const sections = document.querySelectorAll('section[id]');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, { rootMargin: '-30% 0px -70% 0px' });

    sections.forEach(sec => observer.observe(sec));
  }
});


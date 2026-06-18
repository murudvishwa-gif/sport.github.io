/* ==========================================================
   GLOBAL BUTTON + MENU FIXES
   - No JavaScript errors when an element is missing
   - Sign Up / Create Account buttons open signup.html
   - Login modal still works where the modal exists
========================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);

  const hamburger = $('#hamburger');
  const mobileMenu = $('#mobileMenu');
  const overlay = $('#authOverlay');

  function closeMobileMenu() {
    if (hamburger) hamburger.classList.remove('open', 'active', 'show');
    if (mobileMenu) mobileMenu.classList.remove('open', 'active', 'show');
    document.body.classList.remove('menu-open');
  }

  function goSignup() {
    closeMobileMenu();
    window.location.href = 'signup.html';
  }

  function setTab(name) {
    $$('.auth-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === name);
    });
    $$('.auth-panel').forEach(panel => {
      panel.classList.toggle('active', panel.id === 'panel-' + name);
    });
  }

  function openModal(tab = 'login') {
    if (!overlay) return;
    overlay.classList.add('open', 'active', 'show');
    document.body.style.overflow = 'hidden';
    document.body.classList.add('auth-open');
    closeMobileMenu();
    setTab(tab);
  }

  function closeModal() {
    if (!overlay) return;
    overlay.classList.remove('open', 'active', 'show');
    document.body.style.overflow = '';
    document.body.classList.remove('auth-open');
  }

  /* Hamburger */
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      mobileMenu.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });
  }

  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  /* Sign up / Create Account buttons now open the separate signup page */
  ['#openSignup', '#openSignupMobile', '#openSignupCta'].forEach(selector => {
    const btn = $(selector);
    if (btn) btn.addEventListener('click', (e) => {
      e.preventDefault();
      goSignup();
    });
  });

  /* Login buttons open modal if present */
  ['#openLogin', '#openLoginMobile'].forEach(selector => {
    const btn = $(selector);
    if (btn) btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('login');
    });
  });

  const closeBtn = $('#authClose');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (overlay) overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      closeMobileMenu();
    }
  });

  /* Modal tab and small switch buttons */
  $$('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      if (tab.dataset.tab === 'signup') goSignup();
      else setTab(tab.dataset.tab);
    });
  });

  const switchToSignup = $('#switchToSignup');
  if (switchToSignup) switchToSignup.addEventListener('click', (e) => {
    e.preventDefault();
    goSignup();
  });

  const switchToLogin = $('#switchToLogin');
  if (switchToLogin) switchToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    setTab('login');
  });

  /* Password strength meter */
  const pwInput = $('#signupPassword');
  if (pwInput) {
    pwInput.addEventListener('input', () => {
      const v = pwInput.value;
      const score = [v.length >= 8, /[A-Z]/.test(v), /[0-9]/.test(v), /[^A-Za-z0-9]/.test(v)].filter(Boolean).length;
      const cls = score <= 1 ? 'weak' : score <= 2 ? 'medium' : 'strong';
      ['s1','s2','s3','s4'].forEach((id, i) => {
        const bar = document.getElementById(id);
        if (!bar) return;
        bar.className = 'strength-bar';
        if (i < score) bar.classList.add(cls, 'active');
      });
    });
  }

  function validateAuthPanel(panel) {
    if (!panel) return false;
    const inputs = Array.from(panel.querySelectorAll('input'));
    let valid = true;

    inputs.forEach(input => {
      const empty = !input.value.trim();
      const badEmail = input.type === 'email' && input.value.trim() && !input.checkValidity();
      input.classList.toggle('input-error', empty || badEmail);
      if (empty || badEmail) valid = false;
    });

    if (!valid) {
      alert('Please fill all the boxes before continuing.');
      const firstError = panel.querySelector('.input-error');
      if (firstError) firstError.focus();
    }
    return valid;
  }

  document.addEventListener('input', (e) => {
    if (e.target.matches('.auth-panel input')) e.target.classList.remove('input-error');
  });

  /* Auth submit buttons */
  $$('.auth-submit').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const panel = button.closest('.auth-panel');
      if (!validateAuthPanel(panel)) return;
      const isSignup = panel && panel.id === 'panel-signup';
      if (isSignup) {
        alert('Account created successfully!');
        closeModal();
        window.location.href = 'dashboard.html';
      }
      else {
        alert('Logged in successfully!');
        closeModal();
        window.location.href = 'dashboard.html';
      }
    });
  });

  /* Demo links/buttons that were previously empty */
  const forgot = $('.auth-forgot');
  if (forgot) forgot.addEventListener('click', (e) => {
    e.preventDefault();
    alert('Password reset link will be sent to your email.');
  });

  $$('.auth-social-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      alert(button.textContent.trim() + ' login coming soon!');
    });
  });

  /* Newsletter form fix */
  $$('.newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you for subscribing!');
      form.reset();
    });
  });

  /* Reveal animations */
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1 });
    reveals.forEach(el => revealObserver.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }

  /* Active link for separate pages */
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  $$('.nav-links a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) link.classList.add('active');
  });
});

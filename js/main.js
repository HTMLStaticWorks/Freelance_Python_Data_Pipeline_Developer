/**
 * Main JavaScript File for Freelance Python & Data Pipeline Developer Portfolio
 * Vanilla JS logic for navs, menus, modals, scroll tracking, sliders, and animation triggers.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Initialize Lucide Icons ---
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // --- Initialize AOS (Animate on Scroll) ---
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out-quad',
    });
  }

  // --- Sticky Header ---
  const header = document.querySelector('header');
  
  // --- Back to Top Button ---
  const backToTopBtn = document.createElement('button');
  backToTopBtn.id = 'back-to-top';
  backToTopBtn.className = 'fixed bottom-6 right-6 rtl:right-auto rtl:left-6 z-50 p-3 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/30 border border-cyan-400/20 transition-all duration-300 translate-y-20 opacity-0 pointer-events-none hover:scale-110 hover:shadow-cyan-500/50 active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-400 flex items-center justify-center';
  backToTopBtn.setAttribute('aria-label', 'Back to top');
  backToTopBtn.innerHTML = '<i data-lucide="arrow-up" class="w-5 h-5"></i>';
  document.body.appendChild(backToTopBtn);

  // Initialize Lucide icons again to pick up the new button icon
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  window.addEventListener('scroll', () => {
    // Sticky Nav
    if (window.scrollY > 20) {
      header.classList.add('glass-navbar', 'py-3');
      header.classList.remove('py-5', 'bg-transparent');
    } else {
      header.classList.remove('glass-navbar', 'py-3');
      header.classList.add('py-5', 'bg-transparent');
    }

    // Back to top visibility
    if (window.scrollY > 300) {
      backToTopBtn.classList.remove('translate-y-20', 'opacity-0', 'pointer-events-none');
      backToTopBtn.classList.add('translate-y-0', 'opacity-100');
    } else {
      backToTopBtn.classList.add('translate-y-20', 'opacity-0', 'pointer-events-none');
      backToTopBtn.classList.remove('translate-y-0', 'opacity-100');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Trigger scroll listener on load to set initial state
  window.dispatchEvent(new Event('scroll'));

  // --- Mobile Menu Toggle ---
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIconOpen = document.getElementById('menu-icon-open');
  const menuIconClose = document.getElementById('menu-icon-close');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
      
      mobileMenu.classList.toggle('hidden');
      mobileMenu.classList.toggle('flex');
      
      if (menuIconOpen && menuIconClose) {
        menuIconOpen.classList.toggle('hidden');
        menuIconClose.classList.toggle('hidden');
      }
    });
  }

  // --- Active Nav Link Detection ---
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href) {
      // Check if current path ends with href or if current path is root and href is index.html
      const isHome = (currentPath === '/' || currentPath.endsWith('index.html')) && href === 'index.html';
      const isOtherPage = href !== 'index.html' && currentPath.includes(href);
      
      if (isHome || isOtherPage) {
        link.classList.add('nav-link-active');
        link.classList.remove('text-gray-300', 'hover:text-blue-400');
      }
    }
  });

  // --- Animated Statistics Counters ---
  const counters = document.querySelectorAll('.stat-counter');
  const speed = 200; // Counter animation speed coefficient

  const animateCounter = (counter) => {
    const target = +counter.getAttribute('data-target');
    const suffix = counter.getAttribute('data-suffix') || '';
    let count = 0;
    
    // Determine increment based on target size
    const increment = Math.max(1, Math.ceil(target / speed));
    
    const updateCount = () => {
      count += increment;
      if (count < target) {
        counter.innerText = count + suffix;
        setTimeout(updateCount, 15);
      } else {
        counter.innerText = target + suffix;
      }
    };
    
    updateCount();
  };

  // Setup intersection observer to start counting when visible
  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target); // Trigger only once
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
  }

  // --- FAQ Accordion Interactive Logic ---
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const content = header.nextElementSibling;
      const icon = header.querySelector('.accordion-icon');
      
      // Close other accordions in the same list
      const allContents = header.closest('.accordion-list').querySelectorAll('.accordion-content');
      const allIcons = header.closest('.accordion-list').querySelectorAll('.accordion-icon');
      
      allContents.forEach(c => {
        if (c !== content) {
          c.classList.remove('open');
          c.style.maxHeight = null;
        }
      });
      
      allIcons.forEach(i => {
        if (i !== icon) {
          i.style.transform = 'rotate(0deg)';
        }
      });

      // Toggle current accordion
      content.classList.toggle('open');
      if (content.classList.contains('open')) {
        content.style.maxHeight = content.scrollHeight + "px";
        if (icon) icon.style.transform = 'rotate(180deg)';
      } else {
        content.style.maxHeight = null;
        if (icon) icon.style.transform = 'rotate(0deg)';
      }
    });
  });

  // --- Portfolio Filtering and Search Logic ---
  const filterBtns = document.querySelectorAll('.portfolio-filter-btn');
  const portfolioGrid = document.getElementById('portfolio-grid');
  const portfolioSearch = document.getElementById('portfolio-search');
  
  if (portfolioGrid) {
    const portfolioCards = portfolioGrid.querySelectorAll('.portfolio-item');

    const filterPortfolio = () => {
      const activeFilterBtn = document.querySelector('.portfolio-filter-btn.active');
      const category = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';
      const searchQuery = portfolioSearch ? portfolioSearch.value.toLowerCase().trim() : '';

      portfolioCards.forEach(card => {
        const itemCategory = card.getAttribute('data-category');
        const title = card.querySelector('.portfolio-title').innerText.toLowerCase();
        const description = card.querySelector('.portfolio-desc').innerText.toLowerCase();
        const tags = Array.from(card.querySelectorAll('.portfolio-tag')).map(t => t.innerText.toLowerCase());
        
        const matchesCategory = category === 'all' || itemCategory === category;
        const matchesSearch = searchQuery === '' || 
          title.includes(searchQuery) || 
          description.includes(searchQuery) ||
          tags.some(t => t.includes(searchQuery));

        if (matchesCategory && matchesSearch) {
          card.classList.remove('hidden');
          // Re-trigger layout animations
          card.style.opacity = '0';
          setTimeout(() => { card.style.opacity = '1'; }, 50);
        } else {
          card.classList.add('hidden');
        }
      });
    };

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active', 'bg-blue-600', 'text-white'));
        filterBtns.forEach(b => b.classList.add('bg-slate-800', 'text-gray-300'));
        
        btn.classList.add('active', 'bg-blue-600', 'text-white');
        btn.classList.remove('bg-slate-800', 'text-gray-300');
        
        filterPortfolio();
      });
    });

    if (portfolioSearch) {
      portfolioSearch.addEventListener('input', filterPortfolio);
    }
  }

  // --- Portfolio Modals Overlay Logic ---
  const modalTriggers = document.querySelectorAll('.portfolio-modal-trigger');
  const modalOverlay = document.getElementById('portfolio-modal-overlay');
  const modalClose = document.getElementById('portfolio-modal-close');

  if (modalOverlay && modalClose) {
    modalTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Retrieve card values to populate Modal
        const card = trigger.closest('.portfolio-item');
        const title = card.querySelector('.portfolio-title').innerText;
        const category = card.getAttribute('data-category').toUpperCase();
        const problem = card.getAttribute('data-problem') || 'No problem description provided.';
        const solution = card.getAttribute('data-solution') || 'No solution description provided.';
        const results = card.getAttribute('data-results') || 'No results description provided.';
        const techStr = card.getAttribute('data-tech') || 'Python, ETL';
        const metricsStr = card.getAttribute('data-metrics') || '100% Automated';

        // Set modal items
        document.getElementById('modal-title').innerText = title;
        document.getElementById('modal-category').innerText = category;
        document.getElementById('modal-problem').innerText = problem;
        document.getElementById('modal-solution').innerText = solution;
        document.getElementById('modal-results').innerText = results;
        
        // Tags representation
        const techContainer = document.getElementById('modal-tech');
        techContainer.innerHTML = '';
        techStr.split(',').forEach(tech => {
          const badge = document.createElement('span');
          badge.className = 'px-3 py-1 bg-blue-900/40 text-blue-300 border border-blue-800/50 rounded-full text-xs font-semibold';
          badge.innerText = tech.trim();
          techContainer.appendChild(badge);
        });

        // Metrics representation
        const metricsContainer = document.getElementById('modal-metrics');
        metricsContainer.innerHTML = '';
        metricsStr.split(',').forEach(metric => {
          const parts = metric.split(':');
          if (parts.length >= 2) {
            const block = document.createElement('div');
            block.className = 'p-3 bg-slate-900/80 border border-slate-700/50 rounded-lg text-center';
            block.innerHTML = `<div class="text-xl font-bold text-cyan-400 font-display">${parts[0].trim()}</div><div class="text-xs text-gray-400 mt-1">${parts[1].trim()}</div>`;
            metricsContainer.appendChild(block);
          }
        });

        // Show Modal
        modalOverlay.classList.remove('hidden');
        modalOverlay.classList.add('flex');
        document.body.style.overflow = 'hidden'; // Lock background scroll
      });
    });

    const closeModal = () => {
      modalOverlay.classList.add('hidden');
      modalOverlay.classList.remove('flex');
      document.body.style.overflow = ''; // Unlock scroll
    };

    modalClose.addEventListener('click', closeModal);
    
    // Close on clicking backdrop
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });
  }

  // --- Blog Searching and Filtering Logic ---
  const blogSearch = document.getElementById('blog-search');
  const blogFilterBtns = document.querySelectorAll('.blog-filter-btn');
  const blogGrid = document.getElementById('blog-grid');

  if (blogGrid) {
    const blogPosts = blogGrid.querySelectorAll('.blog-post');

    const filterBlog = () => {
      const activeBtn = document.querySelector('.blog-filter-btn.active');
      const category = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';
      const searchQuery = blogSearch ? blogSearch.value.toLowerCase().trim() : '';

      blogPosts.forEach(post => {
        const itemCategory = post.getAttribute('data-category');
        const title = post.querySelector('.blog-title').innerText.toLowerCase();
        const excerpt = post.querySelector('.blog-excerpt').innerText.toLowerCase();
        
        const matchesCategory = category === 'all' || itemCategory === category;
        const matchesSearch = searchQuery === '' || 
          title.includes(searchQuery) || 
          excerpt.includes(searchQuery);

        if (matchesCategory && matchesSearch) {
          post.classList.remove('hidden');
        } else {
          post.classList.add('hidden');
        }
      });
    };

    blogFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        blogFilterBtns.forEach(b => b.classList.remove('active', 'bg-blue-600', 'text-white'));
        blogFilterBtns.forEach(b => b.classList.add('bg-slate-800', 'text-gray-300'));
        
        btn.classList.add('active', 'bg-blue-600', 'text-white');
        btn.classList.remove('bg-slate-800', 'text-gray-300');
        
        filterBlog();
      });
    });

    if (blogSearch) {
      blogSearch.addEventListener('input', filterBlog);
    }
  }

  // --- Before/After Automation Slider (Home 2) ---
  const sliderContainer = document.getElementById('automation-slider');
  const sliderInput = document.getElementById('automation-slider-range');
  const manualSide = document.getElementById('slider-manual');
  const handleLine = document.getElementById('slider-handle-line');

  if (sliderContainer && sliderInput && manualSide && handleLine) {
    const updateSlider = () => {
      const val = sliderInput.value;
      manualSide.style.clipPath = `polygon(0 0, ${val}% 0, ${val}% 100%, 0 100%)`;
      handleLine.style.left = `${val}%`;
    };

    sliderInput.addEventListener('input', updateSlider);
    updateSlider(); // Initial call
  }

  // --- Lead Submission Form Submit Handlers ---
  const projectBriefForm = document.getElementById('project-brief-form');
  const briefSuccessMsg = document.getElementById('brief-success-message');

  if (projectBriefForm) {
    projectBriefForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Collect values
      const name = document.getElementById('brief-name').value;
      const email = document.getElementById('brief-email').value;
      const projectType = document.getElementById('brief-project-type').value;

      if (!name || !email || !projectType) {
        alert('Please fill out all required fields.');
        return;
      }

      // Hide form and show custom success notice
      projectBriefForm.classList.add('hidden');
      if (briefSuccessMsg) {
        briefSuccessMsg.classList.remove('hidden');
        briefSuccessMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  // --- General Contact Form Submit Handlers ---
  const generalContactForm = document.getElementById('general-contact-form');
  const contactSuccessMsg = document.getElementById('contact-success-message');

  if (generalContactForm) {
    generalContactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Collect values
      const name = document.getElementById('contact-name').value;
      const email = document.getElementById('contact-email').value;
      const subject = document.getElementById('contact-subject').value;
      const message = document.getElementById('contact-message').value;

      if (!name || !email || !subject || !message) {
        alert('Please fill out all required fields.');
        return;
      }

      // Hide form and show custom success notice
      generalContactForm.classList.add('hidden');
      if (contactSuccessMsg) {
        contactSuccessMsg.classList.remove('hidden');
        contactSuccessMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  // --- Inline Newsletter Form Submissions ---
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const button = form.querySelector('button');
      
      if (input && input.value.trim() !== '') {
        const originalText = button.innerHTML;
        button.innerHTML = 'Subscribed!';
        button.disabled = true;
        button.classList.add('bg-green-600');
        button.classList.remove('bg-blue-600', 'hover:bg-blue-700');
        input.value = '';
        
        setTimeout(() => {
          button.innerHTML = originalText;
          button.disabled = false;
          button.classList.remove('bg-green-600');
          button.classList.add('bg-blue-600', 'hover:bg-blue-700');
        }, 5000);
      }
    });
  });

  // --- Home 1 Testimonials Carousel Slider ---
  const testimonials = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.getElementById('testimonial-prev');
  const nextBtn = document.getElementById('testimonial-next');
  let currentTestimonial = 0;

  if (testimonials.length > 0 && prevBtn && nextBtn) {
    const showTestimonial = (index) => {
      testimonials.forEach((t, i) => {
        t.classList.add('hidden');
        t.classList.remove('block');
      });
      testimonials[index].classList.remove('hidden');
      testimonials[index].classList.add('block');
    };

    prevBtn.addEventListener('click', () => {
      currentTestimonial = (currentTestimonial === 0) ? testimonials.length - 1 : currentTestimonial - 1;
      showTestimonial(currentTestimonial);
    });

    nextBtn.addEventListener('click', () => {
      currentTestimonial = (currentTestimonial === testimonials.length - 1) ? 0 : currentTestimonial + 1;
      showTestimonial(currentTestimonial);
    });

    showTestimonial(currentTestimonial);
  }

  // --- Theme Toggle Logic ---
  const themeToggleBtns = document.querySelectorAll('#theme-toggle, #mobile-theme-toggle');
  const sunIcons = document.querySelectorAll('.theme-icon-sun, .mobile-theme-icon-sun');
  const moonIcons = document.querySelectorAll('.theme-icon-moon, .mobile-theme-icon-moon');
  
  // Set initial theme based on localStorage
  const currentTheme = localStorage.getItem('theme') || 'dark'; // default to dark first
  if (currentTheme === 'light') {
    document.documentElement.classList.remove('dark');
    sunIcons.forEach(i => i.classList.add('hidden'));
    moonIcons.forEach(i => i.classList.remove('hidden'));
  } else {
    document.documentElement.classList.add('dark');
    sunIcons.forEach(i => i.classList.remove('hidden'));
    moonIcons.forEach(i => i.classList.add('hidden'));
  }

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const isDark = document.documentElement.classList.contains('dark');
      if (isDark) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        sunIcons.forEach(i => i.classList.add('hidden'));
        moonIcons.forEach(i => i.classList.remove('hidden'));
      } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        sunIcons.forEach(i => i.classList.remove('hidden'));
        moonIcons.forEach(i => i.classList.add('hidden'));
      }
    });
  });

  // --- RTL Toggle Logic ---
  const rtlToggleBtns = document.querySelectorAll('#rtl-toggle, #mobile-rtl-toggle');
  
  // Set initial direction based on localStorage
  const currentDir = localStorage.getItem('dir') || 'ltr';
  if (currentDir === 'rtl') {
    document.documentElement.setAttribute('dir', 'rtl');
    rtlToggleBtns.forEach(btn => {
      btn.classList.add('border-cyan-500', 'text-cyan-400');
      btn.classList.remove('text-gray-300', 'border-slate-700');
    });
  } else {
    document.documentElement.setAttribute('dir', 'ltr');
    rtlToggleBtns.forEach(btn => {
      btn.classList.remove('border-cyan-500', 'text-cyan-400');
      btn.classList.add('text-gray-300', 'border-slate-700');
    });
  }

  rtlToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
      if (isRtl) {
        document.documentElement.setAttribute('dir', 'ltr');
        localStorage.setItem('dir', 'ltr');
        rtlToggleBtns.forEach(b => {
          b.classList.remove('border-cyan-500', 'text-cyan-400');
          b.classList.add('text-gray-300', 'border-slate-700');
        });
      } else {
        document.documentElement.setAttribute('dir', 'rtl');
        localStorage.setItem('dir', 'rtl');
        rtlToggleBtns.forEach(b => {
          b.classList.add('border-cyan-500', 'text-cyan-400');
          b.classList.remove('text-gray-300', 'border-slate-700');
        });
      }
    });
  });
});


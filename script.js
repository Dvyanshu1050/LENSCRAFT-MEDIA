//  <script type="text/javascript">

  (function () {
    emailjs.init("wYzmPg9O2uWLjYf_H"); // ⚡ EmailJS se User ID
  })();

  document.getElementById("contact-form").addEventListener("submit", function (event) {
    event.preventDefault();

    emailjs.sendForm("service_xcgkt8q", "template_tk9d9ui", this)
      .then(() => {
        alert("✅ Message sent successfully!");
        this.reset(); // form clear ho jayega
      }, (err) => {
        alert("❌ Failed to send message: " + JSON.stringify(err));
      });
  });
      // Year
      document.getElementById('year').textContent = new Date().getFullYear();

      // Mobile nav build from desktop links for a11y parity
      const desktopNav = document.querySelector('.desktop-nav ul');
      const mobileNav = document.getElementById('mobile-nav');
      if (desktopNav && mobileNav) {
        const ul = desktopNav.cloneNode(true);
        mobileNav.appendChild(ul);
      }

      // Mobile menu toggle
      const burger = document.querySelector('.hamburger');
      const mobile = document.getElementById('mobile-nav');
      function setMobile(open){
        burger.setAttribute('aria-expanded', String(open));
        mobile.style.display = open ? 'block' : 'none';
      }
      burger?.addEventListener('click', () => {
        const open = burger.getAttribute('aria-expanded') !== 'true';
        setMobile(open);
      });
      mobile?.addEventListener('click', (e)=>{
        if (e.target.tagName === 'A') setMobile(false);
      });

      // Magnetic buttons
      document.querySelectorAll('.magnetic').forEach(btn=>{
        const strength = 20;
        btn.addEventListener('mousemove', (e)=>{
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width/2;
          const y = e.clientY - rect.top - rect.height/2;
          btn.style.transform = `translate(${x/12}px, ${y/12}px)`;
          btn.style.boxShadow = `0 10px 30px rgba(14,165,164,.22)`;
        });
        btn.addEventListener('mouseleave', ()=>{
          btn.style.transform = 'translate(0,0)';
          btn.style.boxShadow = 'none';
        });
      });

      // GSAP + Locomotive integration
      gsap.registerPlugin(ScrollTrigger);
      const scrollContainer = document.querySelector('[data-scroll-container]');

      const loco = new LocomotiveScroll({
        el: scrollContainer,
        smooth: true,
        smartphone: { smooth: true },
        tablet: { smooth: true },
      });

      loco.on('scroll', ScrollTrigger.update);

      ScrollTrigger.scrollerProxy(scrollContainer, {
        scrollTop(value) {
          return arguments.length ? loco.scrollTo(value, {duration:0, disableLerp:true}) : loco.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
          return { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
        },
        pinType: scrollContainer.style.transform ? 'transform' : 'fixed'
      });

      // Reveal animations
      gsap.utils.toArray('.reveal').forEach((el, i) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: .9,
          ease: 'power3.out',
          delay: Math.min(i * 0.03, 0.3),
          scrollTrigger: {
            scroller: scrollContainer,
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        });
      });

      // Parallax hero heading (extra polish)
      gsap.to('.hero .heading', {
        yPercent: -8,
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          scroller: scrollContainer,
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });

      // Portfolio filters
      const filterButtons = document.querySelectorAll('.filter-btn');
      const items = gsap.utils.toArray('.portfolio-item');
      function applyFilter(category){
        filterButtons.forEach(b => b.classList.toggle('active', b.dataset.filter === category || (category==='all' && b.dataset.filter==='all')));
        const showAll = category === 'all';
        const timeline = gsap.timeline({ defaults:{ duration:.45, ease:'power2.out' } });
        items.forEach(item=>{
          const match = showAll || item.dataset.category === category;
          timeline.to(item, { opacity: match?1:0.0, scale: match?1:0.95, pointerEvents: match?'auto':'none' }, 0);
        });
        // Slight stagger entrance for visible items
        gsap.fromTo(items.filter(i => showAll || i.dataset.category===category), { y: 18, opacity: .0 }, {
          y: 0, opacity: 1, duration: .6, ease: 'power3.out', stagger: .06
        });
      }
      filterButtons.forEach(btn=>{
        btn.addEventListener('click', ()=>{
          applyFilter(btn.dataset.filter);
          // Keep scroll updated after layout changes
          setTimeout(()=>loco.update(), 300);
        });
      });

      // Testimonials marquee
      const track = document.getElementById('marquee-track');
      if (track) {
        gsap.to(track, {
          xPercent: -50,
          repeat: -1,
          ease: 'linear',
          duration: 25,
          scrollTrigger: {
            scroller: scrollContainer,
            trigger: track,
            start: 'top bottom',
            end: 'bottom top',
            toggleActions: 'play pause resume pause'
          }
        });
      }

      // Refresh on update
      ScrollTrigger.addEventListener('refresh', () => loco.update());
      ScrollTrigger.refresh();
      
      // Accessibility: smooth jump on in-page links via Locomotive
      document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e)=>{
          const id = link.getAttribute('href');
          if (!id || id === '#') return;
          const target = document.querySelector(id);
          if (!target) return;
          e.preventDefault();
          loco.scrollTo(target, { offset: -60, duration: 800 });
          setMobile(false);
        });
      });

      // Make header background solid after some scroll
      const header = document.querySelector('.site-header');
      loco.on('scroll', ({ scroll }) => {
        const y = scroll.y || 0;
        header.style.background = y > 40
          ? 'rgba(11,15,20,.8)'
          : 'linear-gradient(to bottom, rgba(11,15,20,.45), rgba(11,15,20,0))';
        header.style.backdropFilter = y > 40 ? 'saturate(140%) blur(6px)' : 'none';
        header.style.borderBottom = y > 40 ? '1px solid rgba(255,255,255,.08)' : '1px solid transparent';
      });

      // Responsive: show hamburger under 960px
      const mq = window.matchMedia('(max-width: 960px)');
      function handleMQ(e){
        document.querySelector('.desktop-nav').style.display = e.matches ? 'none' : 'block';
        document.querySelector('.hamburger').style.display = e.matches ? 'inline-block' : 'none';
        if (!e.matches) setMobile(false);
      }
      handleMQ(mq); mq.addEventListener('change', handleMQ);
  
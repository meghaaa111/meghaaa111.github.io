document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Custom Lerp Cursor ---
    const cursor = document.querySelector('.custom-cursor');
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;
    
    if (!isTouchDevice && cursor) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        const lerp = (a, b, n) => (1 - n) * a + n * b;
        
        const renderCursor = () => {
            // 8ms lerp feel ~0.2 interpolation factor
            cursorX = lerp(cursorX, mouseX, 0.2);
            cursorY = lerp(cursorY, mouseY, 0.2);
            cursor.style.left = `${cursorX}px`;
            cursor.style.top = `${cursorY}px`;
            requestAnimationFrame(renderCursor);
        };
        requestAnimationFrame(renderCursor);
        
        const hoverTargets = document.querySelectorAll('a, button, .project-card, .expertise-card, .cert-card');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    } else if (cursor) {
        cursor.style.display = 'none';
        document.body.style.cursor = 'auto';
    }

    // --- 2. Page Load Cinematic Timeline ---
    const loadingScreen = document.getElementById('loading-screen');
    const whisper = document.querySelector('.hero-whisper');
    const letters = document.querySelectorAll('.hero-letter');
    const role = document.querySelector('.hero-role');
    const scrollInd = document.querySelector('.scroll-indicator');
    
    const isMobile = window.innerWidth < 768;
    const baseDelay = isMobile ? 100 : 200;
    const transWait = isMobile ? 400 : 800;
    const letterStagger = isMobile ? 40 : 80;
    const roleWait = isMobile ? 200 : 600;
    
    setTimeout(() => {
        if(loadingScreen) loadingScreen.style.opacity = '0';
        
        setTimeout(() => {
            if(whisper) {
                whisper.style.transition = 'opacity 1s ease';
                whisper.style.opacity = '1';
            }
            
            setTimeout(() => {
                letters.forEach((l, i) => {
                    setTimeout(() => {
                        l.style.transition = 'opacity 0.5s ease, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)';
                        l.style.opacity = '1';
                        l.style.transform = 'translateY(0)';
                    }, i * letterStagger);
                });
                
                setTimeout(() => {
                    if(role) {
                        role.style.transition = 'opacity 1.5s ease';
                        role.style.opacity = '1';
                    }
                    if(scrollInd) scrollInd.classList.add('is-visible');
                }, letters.length * letterStagger + roleWait);
            }, transWait - 200);
        }, transWait);
    }, baseDelay);

    // --- 2.5 Aesthetic Sparkles (Evenly Spread) ---
    const generateSparkles = () => {
        const heroWrap = document.querySelector('.hero-parallax-wrapper');
        if (!heroWrap) return;
        
        const cols = 8;
        const rows = 8;
        
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                // Generate a sparkle only 25% of the time for a very minimal, elegant spread (~15-20 sparkles total)
                if (Math.random() > 0.25) continue; 
                
                const s = document.createElement('div');
                s.className = 'sparkle-icon';
                s.innerHTML = '✦';
                s.style.position = 'absolute';
                s.style.pointerEvents = 'none';
                
                const x = (100 / cols) * i + Math.random() * (100 / cols);
                const y = (100 / rows) * j + Math.random() * (100 / rows);
                
                s.style.left = `${x}%`;
                s.style.top = `${y}%`;
                
                // Minimal and delicate sizes
                const size = 0.3 + Math.random() * 0.5; // 0.3rem to 0.8rem
                s.style.fontSize = `${size}rem`;
                
                // Randomize animations
                s.style.animationDelay = `${Math.random() * 3}s`;
                s.style.opacity = `${0.3 + Math.random() * 0.6}`; // Brighten them slightly
                s.style.zIndex = '1';
                
                heroWrap.appendChild(s);
            }
        }
    };
    generateSparkles();

    // --- 3. Parallax Hero ---
    const heroWrapper = document.querySelector('.hero-parallax-wrapper');
    const heroNameWrapper = document.querySelector('.hero-name-wrapper');
    const sparkles = document.querySelectorAll('.hero .sparkle-icon, .hero .minimal-flower');
    
    if(!isTouchDevice && heroWrapper) {
        document.addEventListener('mousemove', (e) => {
            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;
            const dx = (e.clientX - cx) / cx;
            const dy = (e.clientY - cy) / cy;
            
            if(heroNameWrapper) heroNameWrapper.style.transform = `translate(${dx * 10}px, ${dy * 10}px)`;
            
            sparkles.forEach(s => {
                s.style.transform = `translate(${dx * 30}px, ${dy * 30}px)`;
            });
        });
    }

    // --- 4. Terminal Typewriter Effect ---
    const terminalLines = [
        "> Department 2nd Rank",
        "> Hackathon Winner × 2",
        "> 9.13 CGPA",
        "> Initializing Intelligence Engine..."
    ];
    const terminalContainer = document.getElementById('terminal-content');
    
    let hasTyped = false;
    async function typeWriter() {
        if(hasTyped || !terminalContainer) return;
        hasTyped = true;
        
        for (let i = 0; i < terminalLines.length; i++) {
            const lineHtml = document.createElement('div');
            lineHtml.classList.add('terminal-line');
            lineHtml.innerHTML = `<span class="terminal-prefix">SYS@AIML:~$</span><span class="line-text"></span><span class="typewriter-cursor"></span>`;
            terminalContainer.appendChild(lineHtml);
            
            const textSpan = lineHtml.querySelector('.line-text');
            const cursor = lineHtml.querySelector('.typewriter-cursor');
            const textToType = terminalLines[i];
            
            for(let c = 0; c < textToType.length; c++) {
                textSpan.textContent += textToType[c];
                await new Promise(r => setTimeout(r, 40 + Math.random() * 30));
            }
            if(i < terminalLines.length - 1) {
                cursor.remove();
                await new Promise(r => setTimeout(r, 200));
            }
        }
    }

    // --- 5. Generate Skills Ticker ---
    const tickerTrack = document.getElementById('skills-ticker');
    const skillsToTick = ["Machine Learning", "Deep Learning", "NLP", "Python", "Predictive Modeling", "Feature Engineering", "Data Analytics", "Exoplanet Detection", "SQL", "Voice AI"];
    
    if(tickerTrack) {
        const createSet = () => {
            let html = '';
            skillsToTick.forEach(skill => {
                html += `<div class="ticker-item"><span class="sparkle-icon" style="font-size:0.8rem;">✦</span> ${skill} </div>`;
            });
            return html;
        };
        // clone multiple times to ensure seamless infinite scroll
        tickerTrack.innerHTML = createSet() + createSet() + createSet() + createSet();
    }

    // --- 6. Intersection Observer ---
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };

    function easeOutExpo(x) {
        return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
    }

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                
                // Trigger typing if terminal section 
                if(entry.target.id === 'about' || entry.target.contains(terminalContainer)) {
                    typeWriter();
                }

                // Trigger skills bars
                const bars = entry.target.querySelectorAll('.bar-fill');
                bars.forEach(bar => {
                    const width = bar.getAttribute('data-width');
                    bar.style.width = width;
                });
                
                // Array staggered classes (Skill pills, achievement items)
                const staggerClasses = ['.skill-pill', '.achieve-item'];
                staggerClasses.forEach(cls => {
                    const items = entry.target.querySelectorAll(cls);
                    items.forEach((item, index) => {
                        item.style.transitionDelay = `${index * 0.1}s`;
                    });
                });

                // Trigger Number Count up
                if (entry.target.classList.contains('stats') || entry.target.id === 'stats') {
                    const stats = entry.target.querySelectorAll('.count-up');
                    stats.forEach(stat => {
                        if(stat.classList.contains('counted')) return;
                        stat.classList.add('counted');
                        let endVal = parseInt(stat.getAttribute('data-val'), 10);
                        let duration = 2000;
                        let start = null;
                        const step = (timestamp) => {
                            if (!start) start = timestamp;
                            const progress = Math.min((timestamp - start) / duration, 1);
                            const eased = easeOutExpo(progress);
                            stat.textContent = Math.floor(eased * endVal);
                            if (progress < 1) {
                                window.requestAnimationFrame(step);
                            } else {
                                stat.textContent = endVal;
                            }
                        };
                        window.requestAnimationFrame(step);
                    });
                }

                if(entry.target.classList.contains('anim-el') || entry.target.classList.contains('project-card')) {
                    observer.unobserve(entry.target);
                }
            }
        });
    }, observerOptions);

    const observeElements = document.querySelectorAll('.anim-el, .wipe, .project-card, .skills-grid, .achieve-grid, .stats, section');
    observeElements.forEach(el => scrollObserver.observe(el));

    // --- 7. Hamburger Menu Logic ---
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const mobileMenu = document.querySelector('.mobile-overlay-menu');
    const closeBtn = document.querySelector('.close-menu-btn');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (hamburgerBtn && mobileMenu && closeBtn) {
        hamburgerBtn.addEventListener('click', () => {
            mobileMenu.classList.add('open');
            document.body.style.overflow = 'hidden'; // Prevent scroll
        });

        closeBtn.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // --- 8. Hide Scroll Indicator on Scroll ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            if (scrollInd && scrollInd.style.opacity !== '0') {
                scrollInd.style.opacity = '0';
                scrollInd.style.pointerEvents = 'none';
            }
        }
    });

});

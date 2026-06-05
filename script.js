/* ============================================================
   Site interactivity: project rendering, nav, accordion,
   skill tabs, typing effect, scroll reveal.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
    renderProjects();
    initNav();
    initAccordion();
    initSkillTabs();
    initTyping();
    initReveal();
    initHeroRobot();
    setYear();
});

/* ---------- Hero robot: glowy intro fade-in ---------- */
function initHeroRobot() {
    const svg = document.querySelector(".hero-robot svg");
    if (!svg) return;

    // Smooth fade/scale-in on load before the looping glow takes over.
    svg.style.opacity = "0";
    svg.style.transform = "scale(0.92)";
    svg.style.transition = "opacity 1.2s ease, transform 1.2s ease";
    requestAnimationFrame(() => {
        setTimeout(() => {
            svg.style.removeProperty("opacity");
            svg.style.removeProperty("transform");
            svg.style.removeProperty("transition");
        }, 120);
    });
}

/* ---------- Render projects from projects.js ---------- */
function renderProjects() {
    const grid = document.getElementById("project-grid");
    if (!grid || typeof PROJECTS === "undefined") return;

    grid.innerHTML = PROJECTS.map((p) => {
        const media =
            p.media.type === "video"
                ? `<video src="${p.media.src}" muted loop playsinline preload="metadata"
                          onmouseover="this.play()" onmouseout="this.pause()"></video>`
                : `<img src="${p.media.src}" alt="${escapeHtml(p.title)}" loading="lazy">`;

        const tags = (p.tags || [])
            .map((t) => `<span class="tag">${escapeHtml(t)}</span>`)
            .join("");

        return `
        <article class="project-card reveal">
            <a class="project-media" href="${p.link}" aria-label="${escapeHtml(p.title)}">
                ${media}
            </a>
            <div class="project-body">
                <h3>${escapeHtml(p.title)}</h3>
                <div class="project-tags">${tags}</div>
                <a class="project-link" href="${p.link}">
                    View project <i class="fa fa-arrow-right"></i>
                </a>
            </div>
        </article>`;
    }).join("");
}

function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
    }[c]));
}

/* ---------- Navbar: scroll state + mobile toggle ---------- */
function initNav() {
    const nav = document.getElementById("nav-bar");
    const toggle = document.querySelector(".nav-toggle");
    const menu = document.getElementById("nav-menu");

    const onScroll = () => {
        if (!nav) return;
        nav.classList.toggle("scrolled", window.scrollY > 30);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    if (toggle && menu) {
        toggle.addEventListener("click", () => {
            const open = menu.classList.toggle("open");
            toggle.setAttribute("aria-expanded", open);
            toggle.innerHTML = open
                ? '<i class="fa fa-times"></i>'
                : '<i class="fa fa-bars"></i>';
        });

        menu.querySelectorAll("a").forEach((a) =>
            a.addEventListener("click", () => {
                menu.classList.remove("open");
                toggle.setAttribute("aria-expanded", "false");
                toggle.innerHTML = '<i class="fa fa-bars"></i>';
            })
        );
    }
}

/* ---------- Courses accordion ---------- */
function initAccordion() {
    document.querySelectorAll(".collapsible").forEach((btn) => {
        btn.addEventListener("click", () => {
            const content = btn.nextElementSibling;
            const isOpen = btn.classList.contains("active");

            // Close all
            document.querySelectorAll(".collapsible").forEach((b) => {
                b.classList.remove("active");
                const c = b.nextElementSibling;
                c.classList.remove("open");
                c.style.maxHeight = null;
            });

            if (!isOpen) {
                btn.classList.add("active");
                content.classList.add("open");
                content.style.maxHeight = content.scrollHeight + 40 + "px";
            }
        });
    });
}

/* ---------- Skill tabs ---------- */
function initSkillTabs() {
    const tabs = document.querySelectorAll(".skill-tab");
    const panels = document.querySelectorAll(".skill-panel");

    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            tabs.forEach((t) => t.classList.remove("active"));
            panels.forEach((p) => p.classList.remove("active"));
            tab.classList.add("active");
            const panel = document.getElementById(tab.dataset.target);
            if (panel) panel.classList.add("active");
        });
    });
}

/* ---------- Hero typing effect ---------- */
function initTyping() {
    const el = document.querySelector(".hero .typed");
    if (!el) return;

    const words = [
        "Autonomy",
        "Sensor Filtering",
        "Perception",
        "Machine Learning",
    ];
    let w = 0,
        c = 0,
        deleting = false;

    function tick() {
        const word = words[w];
        el.textContent = word.slice(0, c);

        if (!deleting && c < word.length) {
            c++;
        } else if (deleting && c > 0) {
            c--;
        } else if (!deleting && c === word.length) {
            deleting = true;
            setTimeout(tick, 1600);
            return;
        } else if (deleting && c === 0) {
            deleting = false;
            w = (w + 1) % words.length;
        }
        setTimeout(tick, deleting ? 45 : 90);
    }
    tick();
}

/* ---------- Scroll reveal ---------- */
function initReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
        items.forEach((i) => i.classList.add("visible"));
        return;
    }
    const obs = new IntersectionObserver(
        (entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) {
                    e.target.classList.add("visible");
                    obs.unobserve(e.target);
                }
            });
        },
        { threshold: 0.12 }
    );
    items.forEach((i) => obs.observe(i));
}

/* ---------- Footer year ---------- */
function setYear() {
    const y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
}

/* ============================================================
   Site interactivity: project rendering, nav, accordion,
   skill tabs, typing effect, scroll reveal.
   ============================================================ */

/* ============================================================
   ABOUT PHOTO STACK — add your photos here.
   ------------------------------------------------------------
   List the image paths you want to cycle through behind the
   About-section headshot. The FIRST entry is the primary
   headshot and keeps the descriptive alt text; the rest are
   decorative cards that peek out behind it (and are marked
   aria-hidden automatically).

   - Add more entries to create a cycling "polaroid stack".
   - Leave just one entry to show a single static photo
     (no stack, no cycling).

   THEMED BACKGROUNDS
   ------------------------------------------------------------
   Each entry can be EITHER a plain string (no themed scene,
   just the normal subtle starfield) OR an object with an
   optional `theme` so that, when that photo is at the front of
   the stack, a matching full-section ambient scene fades in
   behind the About content:

       { src: "images/lahari_stargazing.jpg", theme: "stargazing" }

   Supported themes: "stargazing", "reading", and "legos".
   Omit `theme` (or use a plain string) for the default look.

   Example:
       const ABOUT_PHOTOS = [
           "images/dp.jpeg",                                           // default scene
           { src: "images/placeholder-stargazing.png", theme: "stargazing" },
           { src: "images/placeholder-reading.png",    theme: "reading" },
           { src: "images/placeholder-legos.png",      theme: "legos" },
       ];
   ============================================================ */
const ABOUT_PHOTOS = [
    "images/dp.jpeg",
    { src: "images/placeholder-stargazing.png", theme: "stargazing" },
    { src: "images/placeholder-reading.png", theme: "reading" },
    { src: "images/placeholder-legos.png", theme: "legos" },
];

document.addEventListener("DOMContentLoaded", () => {
    renderProjects();
    initNav();
    initAccordion();
    initSkillTabs();
    initTyping();
    initReveal();
    initHeroRobot();
    initAboutStars();
    initPhotoStack();
    setYear();
});

/* ---------- About headshot: cycling photo stack + background reaction ---------- */
function initPhotoStack() {
    const stack = document.querySelector("[data-photo-stack]");
    if (!stack) return;

    // Accept either plain strings ("images/x.jpg") or objects with an optional
    // theme ({ src: "images/x.jpg", theme: "stargazing" }) and normalize both
    // into { src, theme } so the rest of the code is uniform.
    const rawPhotos =
        typeof ABOUT_PHOTOS !== "undefined" &&
        Array.isArray(ABOUT_PHOTOS) &&
        ABOUT_PHOTOS.length
            ? ABOUT_PHOTOS.slice()
            : ["images/dp.jpeg"];

    const photos = rawPhotos.map((p) =>
        typeof p === "string"
            ? { src: p, theme: "" }
            : { src: p.src, theme: p.theme || "" }
    );

    // The About section toggles a themed ambient background via data-theme.
    const about = document.getElementById("about");
    const applyTheme = (theme) => {
        if (about) about.setAttribute("data-theme", theme || "");
    };

    // Preserve the descriptive alt from the original markup for the headshot.
    const baseImg = stack.querySelector("img");
    const altText =
        (baseImg && baseImg.getAttribute("alt")) || "Lahari Madhusudhan";

    stack.innerHTML = "";

    // Wheat-accent glow that bursts behind the stack when the photo changes.
    const glow = document.createElement("span");
    glow.className = "photo-glow";
    glow.setAttribute("aria-hidden", "true");
    stack.appendChild(glow);

    const vignette = document.createElement("span");
    vignette.className = "photo-vignette";
    vignette.setAttribute("aria-hidden", "true");
    stack.appendChild(vignette);

    const padIndex = (n) => String(n).padStart(2, "0");

    const layers = photos.map((photo, i) => {
        const src = photo.src;
        const layer = document.createElement("div");
        layer.className = "stack-photo";
        const img = document.createElement("img");
        img.src = src;
        img.draggable = false;
        if (i === 0) {
            img.alt = altText;
        } else {
            img.alt = "";
            img.loading = "lazy";
            layer.setAttribute("aria-hidden", "true");
        }
        const ghost = document.createElement("span");
        ghost.className = "slide-ghost";
        ghost.textContent = padIndex(i + 1);
        ghost.setAttribute("aria-hidden", "true");
        layer.appendChild(img);
        layer.appendChild(ghost);
        stack.appendChild(layer);
        return layer;
    });

    const setActive = (frontIdx) => {
        layers.forEach((layer, i) => {
            layer.classList.toggle("active", i === frontIdx);
        });
    };

    // Single photo: show it statically, no cycling.
    if (layers.length < 2) {
        layers[0].classList.add("active");
        applyTheme(photos[0].theme);
        return;
    }

    stack.classList.add("is-stack");

    let front = 0;
    setActive(front);
    applyTheme(photos[front].theme);

    const aboutStars = document.querySelector(".about-stars");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Trigger the background reaction: a glow burst + a quick starfield nudge.
    const react = () => {
        glow.classList.remove("reacting");
        void glow.offsetWidth; // force reflow so the animation restarts
        glow.classList.add("reacting");
        if (aboutStars) {
            aboutStars.classList.remove("react");
            void aboutStars.offsetWidth;
            aboutStars.classList.add("react");
        }
    };

    const cycle = () => {
        front = (front + 1) % layers.length;
        setActive(front);
        applyTheme(photos[front].theme);
        react();
    };

    let timer = null;
    const start = () => {
        if (!reduce && !timer) timer = setInterval(cycle, 4200);
    };
    const stop = () => {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
    };

    // Click / tap cycles immediately and restarts the auto timer.
    stack.addEventListener("click", () => {
        cycle();
        stop();
        start();
    });
    // Pause auto-cycling while hovering for a calmer reading experience.
    stack.addEventListener("mouseenter", stop);
    stack.addEventListener("mouseleave", start);

    start();
}

/* ---------- Hero robot: glowy intro fade-in + cursor following ---------- */
function initHeroRobot() {
    const robot = document.querySelector(".hero-robot");
    const svg = robot && robot.querySelector("svg");
    const pupils = robot && robot.querySelector(".pupils");
    const hero = document.getElementById("hero");
    if (!robot || !svg || !hero) return;

    // Smooth fade/scale-in on load before the looping glow takes over.
    svg.style.opacity = "0";
    svg.style.transform = "scale(0.92)";
    svg.style.transition = "opacity 1.2s ease, transform 1.2s ease";
    requestAnimationFrame(() => {
        setTimeout(() => {
            svg.style.removeProperty("opacity");
            svg.style.removeProperty("transform");
            svg.style.transition = "transform 0.18s ease-out";
        }, 120);
    });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Robot follows the cursor while it's over the hero.
    let raf = null;
    let tx = 0, ty = 0, rot = 0, px = 0, py = 0;

    const onMove = (e) => {
        const r = robot.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        // Normalized direction to cursor, clamped to [-1, 1].
        const nx = Math.max(-1, Math.min(1, (e.clientX - cx) / (window.innerWidth / 2)));
        const ny = Math.max(-1, Math.min(1, (e.clientY - cy) / (window.innerHeight / 2)));

        // Head: gentle translate + tilt toward cursor.
        tx = nx * 16;
        ty = ny * 12;
        rot = nx * 5;
        // Pupils: move within the eye sockets (SVG viewBox units).
        px = nx * 4.5;
        py = ny * 3.5;

        if (!raf) raf = requestAnimationFrame(apply);
    };

    const apply = () => {
        svg.style.transform = `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) rotate(${rot.toFixed(2)}deg)`;
        if (pupils) {
            pupils.setAttribute("transform", `translate(${px.toFixed(2)} ${py.toFixed(2)})`);
        }
        raf = null;
    };

    const reset = () => {
        tx = ty = rot = px = py = 0;
        if (!raf) raf = requestAnimationFrame(apply);
    };

    hero.addEventListener("mousemove", onMove);
    hero.addEventListener("mouseleave", reset);
}

/* ---------- About section: subtle star parallax ---------- */
function initAboutStars() {
    const about = document.getElementById("about");
    const layers = document.querySelectorAll(".about-stars .stars");
    if (!about || !layers.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = null;
    const strengths = [8, 14, 20];

    const move = (e) => {
        const rect = about.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;

        if (raf) return;
        raf = requestAnimationFrame(() => {
            layers.forEach((layer, i) => {
                const s = strengths[i] || 10;
                layer.style.marginLeft = `${(-nx * s).toFixed(1)}px`;
                layer.style.marginTop = `${(-ny * s).toFixed(1)}px`;
            });
            raf = null;
        });
    };

    const reset = () => {
        layers.forEach((layer) => {
            layer.style.marginLeft = "";
            layer.style.marginTop = "";
        });
    };

    about.addEventListener("mousemove", move);
    about.addEventListener("mouseleave", reset);
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

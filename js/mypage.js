"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const header = document.getElementById("site-header");
    const toggle = document.getElementById("nav-toggle");
    const backdrop = document.getElementById("nav-backdrop");
    const nav = document.getElementById("site-nav");
    const yearEl = document.getElementById("footer-year");
    if (yearEl) {
        yearEl.textContent = String(new Date().getFullYear());
    }

    const syncHeaderHeight = () => {
        if (!header) return;
        document.documentElement.style.setProperty("--header-h", `${header.offsetHeight}px`);
    };

    syncHeaderHeight();

    const isMobileNav = () => window.matchMedia("(max-width: 767.98px)").matches;

    const setNavOpen = (open) => {
        if (!header || !toggle) return;
        header.classList.toggle("is-open", open);
        toggle.setAttribute("aria-expanded", String(open));
        document.body.style.overflow = open ? "hidden" : "";
        if (backdrop) {
            backdrop.setAttribute("aria-hidden", String(!open));
        }
        if (nav) {
            if (open && isMobileNav()) {
                nav.setAttribute("aria-modal", "true");
            } else {
                nav.removeAttribute("aria-modal");
            }
        }
    };

    toggle?.addEventListener("click", () => {
        const open = !header?.classList.contains("is-open");
        setNavOpen(open);
    });

    backdrop?.addEventListener("click", () => setNavOpen(false));

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            setNavOpen(false);
        }
    });

    document.getElementById("site-menu")?.addEventListener("click", (e) => {
        if (e.target instanceof HTMLAnchorElement && isMobileNav()) {
            setNavOpen(false);
        }
    });

    document.querySelectorAll("[data-close-nav]").forEach((el) => {
        el.addEventListener("click", () => {
            if (isMobileNav()) setNavOpen(false);
        });
    });

    window.addEventListener("resize", () => {
        syncHeaderHeight();
        if (!isMobileNav()) {
            setNavOpen(false);
        }
    });

    const onScroll = () => {
        if (!header) return;
        header.classList.toggle("site-header--shadow", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
});

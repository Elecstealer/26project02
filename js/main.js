"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const header = document.getElementById("site-header");
    const toggle = document.getElementById("nav-toggle");
    const backdrop = document.getElementById("nav-backdrop");
    const nav = document.getElementById("site-nav");
    const fpRoot = document.getElementById("fullpage");
    const yearEl = document.getElementById("footer-year");
    let fpApi = null;

    if (yearEl) {
        yearEl.textContent = String(new Date().getFullYear());
    }

    const syncHeaderHeight = () => {
        if (!header) return;
        document.documentElement.style.setProperty("--header-h", `${header.offsetHeight}px`);
    };

    syncHeaderHeight();

    const setHeaderShadow = (sectionIndex) => {
        if (!header) return;
        header.classList.toggle("site-header--shadow", sectionIndex > 0);
    };

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

    const closeNavIfMobile = () => {
        if (isMobileNav()) {
            setNavOpen(false);
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

    document.getElementById("fp-menu")?.addEventListener("click", (e) => {
        const t = e.target;
        if (t instanceof HTMLAnchorElement) {
            closeNavIfMobile();
        }
    });

    document.querySelectorAll("[data-close-nav]").forEach((el) => {
        el.addEventListener("click", () => closeNavIfMobile());
    });

    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
            syncHeaderHeight();
            if (!isMobileNav()) {
                setNavOpen(false);
            }
            if (fpApi && typeof fpApi.getFullpageData === "function" && typeof fpApi.reBuild === "function") {
                const opts = fpApi.getFullpageData();
                if (opts) {
                    opts.paddingTop = header ? `${header.offsetHeight}px` : "0px";
                }
                fpApi.reBuild();
            }
        }, 120);
    });

    if (!fpRoot || typeof fullpage !== "function") {
        return;
    }

    const paddingTop = header ? `${header.offsetHeight}px` : "0px";

    fpApi = new fullpage("#fullpage", {
        anchors: ["home", "product", "subscribe", "story", "mypage", "footer"],
        menu: "#fp-menu",
        navigation: true,
        navigationPosition: "right",
        paddingTop,
        scrollingSpeed: 650,
        autoScrolling: true,
        verticalCentered: false,
        fixedElements: "#site-header",
        afterLoad(_origin, destination) {
            setHeaderShadow(destination.index);
            closeNavIfMobile();
        },
    });

    syncHeaderHeight();
});

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

    /** 스크롤 시 헤더 그림자 */
    const onScroll = () => {
        if (!header) return;
        header.classList.toggle("site-header--shadow", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /** 탭 필터 */
    const tabs = document.querySelectorAll(".products-tab");
    const cards = document.querySelectorAll(".product-card");
    const live = document.getElementById("products-live");

    const setActiveTab = (activeBtn) => {
        tabs.forEach((btn) => {
            const on = btn === activeBtn;
            btn.classList.toggle("is-active", on);
            btn.setAttribute("aria-selected", String(on));
        });
    };

    const applyFilter = (filter) => {
        let visible = 0;
        cards.forEach((card) => {
            const cat = card.getAttribute("data-category");
            const show = filter === "all" || cat === filter;
            card.classList.toggle("is-hidden", !show);
            if (show) visible += 1;
        });
        if (live) {
            live.textContent = `총 ${visible}개 상품이 표시됩니다.`;
        }
    };

    tabs.forEach((btn) => {
        btn.addEventListener("click", () => {
            setActiveTab(btn);
            applyFilter(btn.getAttribute("data-filter") || "all");
        });
    });

    applyFilter("all");

    /** 정렬 (가격 기준 더미) */
    const grid = document.getElementById("product-grid");
    const sortSelect = document.getElementById("product-sort");

    const sortCards = () => {
        if (!grid || !sortSelect) return;
        const mode = sortSelect.value;
        const items = Array.from(grid.querySelectorAll(".product-card"));

        const getPrice = (el) => Number(el.getAttribute("data-price")) || 0;

        items.sort((a, b) => {
            if (mode === "price-asc") return getPrice(a) - getPrice(b);
            if (mode === "price-desc") return getPrice(b) - getPrice(a);
            return 0;
        });

        items.forEach((node) => grid.appendChild(node));
    };

    sortSelect?.addEventListener("change", sortCards);

    /** 필터 버튼 (데모) */
    document.getElementById("filter-demo-btn")?.addEventListener("click", () => {
        window.alert("필터 패널은 연결 예정입니다. (데모)");
    });
});

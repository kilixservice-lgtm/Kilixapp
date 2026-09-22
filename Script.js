document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       1. MENU
    ========================================== */

    const menuToggle = document.getElementById("menuToggle");
    const menuWrapper = document.querySelector(".menu-wrapper");
    const menuDropdown = document.getElementById("menuDropdown");

    if (menuToggle && menuWrapper && menuDropdown) {

        function openMenu() {
            menuWrapper.classList.add("open");
            menuToggle.classList.add("active");

            menuToggle.setAttribute("aria-expanded", "true");
        }

        function closeMenu() {
            menuWrapper.classList.remove("open");
            menuToggle.classList.remove("active");

            menuToggle.setAttribute("aria-expanded", "false");
        }

        /* فتح / غلق القائمة */
        menuToggle.addEventListener("click", function (event) {

            event.preventDefault();
            event.stopPropagation();

            if (menuWrapper.classList.contains("open")) {
                closeMenu();
            } else {
                openMenu();
            }

        });

        /* منع الضغط داخل القائمة من غلقها */
        menuDropdown.addEventListener("click", function (event) {
            event.stopPropagation();
        });

        /* إغلاق عند الضغط خارج القائمة */
        document.addEventListener("click", function (event) {

            if (!menuWrapper.contains(event.target)) {
                closeMenu();
            }

        });

        /* روابط القائمة */
        const menuLinks = menuDropdown.querySelectorAll("a");

        menuLinks.forEach(function (link) {

            link.addEventListener("click", function (event) {

                const href = link.getAttribute("href");

                /* تحميل التطبيق */
                if (href === "#download") {
                    closeMenu();
                    return;
                }

                /* اتصل بنا */
                if (href === "#contact") {

                    event.preventDefault();

                    closeMenu();

                    const contactSection =
                        document.getElementById("contact");

                    if (contactSection) {

                        const navbar =
                            document.querySelector(".navbar");

                        const headerHeight =
                            navbar ? navbar.offsetHeight : 0;

                        const targetPosition =
                            contactSection.getBoundingClientRect().top +
                            window.scrollY -
                            headerHeight;

                        window.scrollTo({
                            top: targetPosition,
                            behavior: "smooth"
                        });
                    }

                }

            });

        });

        /* إغلاق بزر ESC */
        document.addEventListener("keydown", function (event) {

            if (event.key === "Escape") {
                closeMenu();
            }

        });

    }


    /* =========================================
       2. SUPABASE DOWNLOAD + IOS APP STORE
    ========================================== */

    const SUPABASE_URL =
        "https://xsswxjaaqhkbsheeclge.supabase.co";

    const SUPABASE_PUBLISHABLE_KEY =
        "sb_publishable_4Zq8XdOzwyqElOEd-4tPvQ_70y1weCa";

    const ANDROID_BUCKET = "android-apps";
    const ANDROID_FILE = "kilix.apk";

    let supabase = null;

    if (
        window.supabase &&
        window.supabase.createClient
    ) {
        supabase = window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_PUBLISHABLE_KEY
        );
    }


    /* =========================================
       ANDROID DOWNLOAD
    ========================================== */

    const androidDownloadButton =
        document.querySelector(".btn-primary");

    if (androidDownloadButton) {

        androidDownloadButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                if (!supabase) {

                    alert(
                        "تعذر الاتصال بخادم التحميل. حاول مرة أخرى."
                    );

                    return;
                }

                const { data } =
                    supabase.storage
                        .from(ANDROID_BUCKET)
                        .getPublicUrl(
                            ANDROID_FILE,
                            {
                                download: "kilix.apk"
                            }
                        );

                if (
                    !data ||
                    !data.publicUrl
                ) {

                    alert(
                        "تعذر تجهيز تحميل التطبيق. حاول مرة أخرى."
                    );

                    return;
                }

                window.location.href =
                    data.publicUrl;

            }
        );

    }


    /* =========================================
       IOS BUTTON REMOVED — WEB BUTTON USES DIRECT LINK
    ========================================== */

    /* =========================================
       3. SMOOTH SCROLL
    ========================================== */

    const internalLinks =
        document.querySelectorAll(
            'a[href^="#"]:not([href="#"])'
        );


    internalLinks.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function (event) {

                    const targetId =
                        link.getAttribute(
                            "href"
                        );


                    if (!targetId) {
                        return;
                    }


                    const target =
                        document.querySelector(
                            targetId
                        );


                    if (!target) {
                        return;
                    }


                    /*
                     * رابط القائمة #contact
                     * تتم معالجته في قسم MENU
                     */
                    if (
                        link.closest(
                            ".menu-dropdown"
                        ) &&
                        targetId === "#contact"
                    ) {
                        return;
                    }


                    event.preventDefault();


                    const header =
                        document.querySelector(
                            ".navbar"
                        );


                    const headerHeight =
                        header
                            ? header.offsetHeight
                            : 0;


                    const targetPosition =
                        target.getBoundingClientRect()
                            .top +
                        window.scrollY -
                        headerHeight;


                    window.scrollTo({

                        top:
                            targetPosition,

                        behavior:
                            "smooth"

                    });

                }
            );

        }
    );


    /* =========================================
       4. SCROLL REVEAL
    ========================================== */

    const revealElements =
        document.querySelectorAll(
            ".hero-content, .feature-card"
        );


    if (
        "IntersectionObserver"
        in window
    ) {

        const observer =
            new IntersectionObserver(
                function (
                    entries,
                    observer
                ) {

                    entries.forEach(
                        function (entry) {

                            if (
                                !entry.isIntersecting
                            ) {
                                return;
                            }


                            entry.target.classList.add(
                                "is-visible"
                            );


                            observer.unobserve(
                                entry.target
                            );

                        }
                    );

                },
                {
                    threshold: 0.1,

                    rootMargin:
                        "0px 0px -30px 0px"
                }
            );


        revealElements.forEach(
            function (
                element,
                index
            ) {

                element.style.transitionDelay =
                    (index * 0.08) + "s";


                element.classList.add(
                    "reveal-element"
                );


                observer.observe(
                    element
                );

            }
        );

    } else {

        revealElements.forEach(
            function (element) {

                element.classList.add(
                    "is-visible"
                );

            }
        );

    }


    /* =========================================
       5. REDUCE MOTION
    ========================================== */

    const prefersReducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    if (prefersReducedMotion) {

        document.documentElement.classList.add(
            "reduce-motion"
        );

    }

});

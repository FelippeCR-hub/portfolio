(function () {
    const translations = {
        pt: {
            nav: {
                home: "HOME",
                projects: "PROJETOS",
                journey: "TRAJETÓRIA",
                contact: "CONTATO"
            },
            common: {
                resume: "Currículo",
                downloadResume: "BAIXAR CURRÍCULO",
                footer: "Todos os direitos reservados.",
                email: "Email",
                networks: "Redes",
                close: "FECHAR"
            },
            home: {
                stackLabel: "STACK",
                focusLabel: "FOCO",
                ageLabel: "IDADE",
                contactMiniLabel: "CONTATO",
                professionalSection: "SEÇÃO PROFISSIONAL",
                journeySection: "TRAJETÓRIA PROFISSIONAL",
                certificatesSection: "CERTIFICADOS / DIPLOMAS",
                featuredSection: "PROJETOS EM DESTAQUE",
                viewProjects: "VER PROJETOS",
                viewAllProjects: "VER TODOS OS PROJETOS",
                contactSection: "CONTATO",
                contactIntro: "Entre em contato direto:"
            },
            projects: {
                breadcrumbHome: "Home",
                breadcrumbCurrent: "Projetos",
                title: "PROJETOS",
                searchPlaceholder: "Buscar: nome, stack, descrição...",
                searchAria: "Buscar projetos",
                searchHint: "Busca interna",
                all: "TODOS",
                web: "WEB",
                database: "DATABASE",
                hardware: "HARDWARE",
                open: "ABRIR",
                repo: "REPO",
                live: "LIVE",
                noResults: "Nenhum projeto encontrado."
            },
            project: {
                badge: "PROJETO",
                objective: "Objetivo",
                highlights: "Destaques",
                gallery: "GALERIA",
                links: "LINKS",
                repository: "REPOSITÓRIO",
                demo: "DEMO",
                previous: "◀ ANTERIOR",
                next: "PRÓXIMO ▶",
                back: "VOLTAR",
                breadcrumbHome: "Home",
                breadcrumbProjects: "Projetos",
                imageAlt: "Imagem do projeto"
            }
        },
        en: {
            nav: {
                home: "HOME",
                projects: "PROJECTS",
                journey: "JOURNEY",
                contact: "CONTACT"
            },
            common: {
                resume: "Resume",
                downloadResume: "DOWNLOAD RESUME",
                footer: "All rights reserved.",
                email: "Email",
                networks: "Networks",
                close: "CLOSE"
            },
            home: {
                stackLabel: "STACK",
                focusLabel: "FOCUS",
                ageLabel: "AGE",
                contactMiniLabel: "CONTACT",
                professionalSection: "PROFESSIONAL SECTION",
                journeySection: "PROFESSIONAL JOURNEY",
                certificatesSection: "CERTIFICATES / DIPLOMAS",
                featuredSection: "FEATURED PROJECTS",
                viewProjects: "VIEW PROJECTS",
                viewAllProjects: "VIEW ALL PROJECTS",
                contactSection: "CONTACT",
                contactIntro: "Get in touch directly:"
            },
            projects: {
                breadcrumbHome: "Home",
                breadcrumbCurrent: "Projects",
                title: "PROJECTS",
                searchPlaceholder: "Search: name, stack, description...",
                searchAria: "Search projects",
                searchHint: "Internal search",
                all: "ALL",
                web: "WEB",
                database: "DATABASE",
                hardware: "HARDWARE",
                open: "OPEN",
                repo: "REPO",
                live: "LIVE",
                noResults: "No projects found."
            },
            project: {
                badge: "PROJECT",
                objective: "Objective",
                highlights: "Highlights",
                gallery: "GALLERY",
                links: "LINKS",
                repository: "REPOSITORY",
                demo: "DEMO",
                previous: "◀ PREVIOUS",
                next: "NEXT ▶",
                back: "BACK",
                breadcrumbHome: "Home",
                breadcrumbProjects: "Projects",
                imageAlt: "Project image"
            }
        }
    };

    function getNestedValue(obj, path) {
        return path.split(".").reduce((acc, key) => {
            if (acc && typeof acc === "object" && key in acc) return acc[key];
            return undefined;
        }, obj);
    }

    function detectLanguage() {
        const saved = localStorage.getItem("language");
        if (saved === "pt" || saved === "en") return saved;

        const browserLang = (navigator.language || "").toLowerCase();
        return browserLang.startsWith("pt") ? "pt" : "en";
    }

    function getLanguage() {
        return detectLanguage();
    }

    function t(key, fallback = "") {
        const lang = getLanguage();
        return (
            getNestedValue(translations[lang], key) ? ?
            getNestedValue(translations.pt, key) ? ?
            fallback
        );
    }

    function applyTranslations(root = document) {
        const lang = getLanguage();

        document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";

        root.querySelectorAll("[data-i18n]").forEach((el) => {
            const key = el.getAttribute("data-i18n");
            const value = t(key, el.textContent.trim());
            el.textContent = value;
        });

        root.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
            const key = el.getAttribute("data-i18n-placeholder");
            const value = t(key, el.getAttribute("placeholder") || "");
            el.setAttribute("placeholder", value);
        });

        root.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
            const key = el.getAttribute("data-i18n-aria-label");
            const value = t(key, el.getAttribute("aria-label") || "");
            el.setAttribute("aria-label", value);
        });

        const resumeFile =
            lang === "pt" ?
            "./Felippe_Santos_Currículo.pdf" :
            "./Felippe_Santos_Resume_EN.pdf";

        root.querySelectorAll("[data-resume-link]").forEach((el) => {
            el.setAttribute("href", resumeFile);
            if (el.hasAttribute("download")) {
                const filename =
                    lang === "pt" ?
                    "Felippe_Santos_Currículo.pdf" :
                    "Felippe_Santos_Resume_EN.pdf";
                el.setAttribute("download", filename);
            }
        });

        document.querySelectorAll("[data-lang]").forEach((btn) => {
            btn.classList.toggle("is-active", btn.getAttribute("data-lang") === lang);
        });
    }

    function setLanguage(lang) {
        const normalized = lang === "en" ? "en" : "pt";
        localStorage.setItem("language", normalized);
        applyTranslations();
        window.dispatchEvent(
            new CustomEvent("app:language-change", {
                detail: {
                    lang: normalized
                }
            })
        );
    }

    document.addEventListener("DOMContentLoaded", () => {
        document.querySelectorAll("[data-lang]").forEach((btn) => {
            if (btn.dataset.i18nBound === "1") return;
            btn.dataset.i18nBound = "1";

            btn.addEventListener("click", () => {
                const lang = btn.getAttribute("data-lang");
                setLanguage(lang);
            });
        });

        applyTranslations();
    });

    window.I18N = {
        t,
        getLanguage,
        setLanguage,
        applyTranslations
    };
})();
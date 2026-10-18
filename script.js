document.addEventListener("DOMContentLoaded", () => {
  const languageToggle = document.getElementById("languageToggle");
  const supportedLanguages = ["en", "de"];
  const savedLanguage = localStorage.getItem("portfolio-language");
  let currentLanguage = supportedLanguages.includes(savedLanguage) ? savedLanguage : "en";

  const applyLanguage = (language) => {
    currentLanguage = language;
    document.documentElement.lang = language;

    document.querySelectorAll("[data-en][data-de]").forEach((element) => {
      element.textContent = element.dataset[language];
    });

    document.querySelectorAll("[data-en-placeholder][data-de-placeholder]").forEach((element) => {
      element.placeholder = element.dataset[`${language}Placeholder`];
    });

    document.querySelectorAll("[data-en-aria-label][data-de-aria-label]").forEach((element) => {
      element.setAttribute("aria-label", element.dataset[`${language}AriaLabel`]);
    });

    const description = document.getElementById("pageDescription");
    if (description) description.content = description.dataset[`${language}Content`];

    if (languageToggle) {
      languageToggle.setAttribute(
        "aria-label",
        language === "en" ? "Switch language to German" : "Sprache zu Englisch wechseln"
      );
      languageToggle.setAttribute("aria-pressed", String(language === "de"));
    }
  };

  applyLanguage(currentLanguage);

  languageToggle?.addEventListener("click", () => {
    const nextLanguage = currentLanguage === "en" ? "de" : "en";
    localStorage.setItem("portfolio-language", nextLanguage);
    applyLanguage(nextLanguage);
  });

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const form = document.getElementById("contactForm");
  const statusEl = document.getElementById("formStatus");
  if (!form || !statusEl) return;

  const setFormStatus = (status) => {
    const messages = {
      en: {
        invalid: "Please fill in your name, email, and message.",
        sending: "Sending message...",
        success: "Your message has been sent successfully.",
        error: "Message could not be sent. Please try again later.",
      },
      de: {
        invalid: "Bitte gib deinen Namen, deine E-Mail-Adresse und eine Nachricht ein.",
        sending: "Nachricht wird gesendet...",
        success: "Deine Nachricht wurde erfolgreich gesendet.",
        error: "Nachricht konnte nicht gesendet werden. Bitte versuche es später erneut.",
      },
    };
    statusEl.textContent = messages[currentLanguage][status];
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const submitButton = form.querySelector('button[type="submit"]');
    const name = form.elements.namedItem("name").value.trim();
    const email = form.elements.namedItem("email").value.trim();
    const message = form.elements.namedItem("message").value.trim();
    const company = form.elements.namedItem("company").value.trim();

    if (!name || !email || !message) {
      setFormStatus("invalid");
      return;
    }

    submitButton.disabled = true;
    setFormStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, company }),
      });

      if (!response.ok) throw new Error("Contact request failed");
      setFormStatus("success");
      form.reset();
    } catch (error) {
      console.error("Contact form send failed:", error);
      setFormStatus("error");
    } finally {
      submitButton.disabled = false;
    }
  });
});

const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector("#primary-nav");
const appointmentDialog = document.querySelector(".appointment-dialog");

document.querySelector("#year").textContent = new Date().getFullYear();

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  primaryNav.classList.toggle("is-open", !isOpen);
});

primaryNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    primaryNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  });
});

document.querySelectorAll(".js-open-appointment, a[href='#appointment']").forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    if (primaryNav.classList.contains("is-open")) {
      primaryNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
    }
    appointmentDialog.showModal();
  });
});

appointmentDialog.addEventListener("click", (event) => {
  if (event.target === appointmentDialog) appointmentDialog.close();
});

const practiceEmail = "[[PRACTICE_EMAIL]]";
const practicePhone = "[[PRACTICE_PHONE]]";

if (practicePhone !== "[[PRACTICE_PHONE]]") {
  const phoneLink = document.querySelector("[data-practice-phone]");
  phoneLink.href = `tel:${practicePhone.replace(/[^\d+]/g, "")}`;
  phoneLink.querySelector("strong").textContent = practicePhone;
}

if (practiceEmail !== "[[PRACTICE_EMAIL]]") {
  const emailLink = document.querySelector("[data-practice-email]");
  emailLink.href = `mailto:${practiceEmail}`;
  emailLink.querySelector("strong").textContent = practiceEmail;
}

function connectForm(formId, fields, kind) {
  const form = document.querySelector(formId);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = form.querySelector(".form-status");
    if (practiceEmail === "[[PRACTICE_EMAIL]]") {
      status.textContent = "This form is ready to use once the practice email is added in script.js. No message has been sent.";
      return;
    }

    const data = new FormData(form);
    const subject = kind === "appointment" ? "Appointment request" : "Website enquiry";
    const body = fields.map(([key, label]) => `${label}: ${data.get(key) || "Not provided"}`).join("\n");
    const mailto = `mailto:${practiceEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    status.textContent = "Your email app should open with your request. Please send the email there; your appointment is not confirmed until the practice replies.";
  });
}

connectForm("#contact-form", [
  ["name", "Name"],
  ["email", "Email"],
  ["message", "Message"]
], "contact");

connectForm("#appointment-form", [
  ["name", "Name"],
  ["email", "Email"],
  ["phone", "Phone"],
  ["preference", "Preferred day or time"],
  ["reason", "General reason for request"]
], "appointment");

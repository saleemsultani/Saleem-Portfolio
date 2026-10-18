const EMAILJS_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";
const CONTACT_EMAIL = "saleem.sultani.jobs@gmail.com";

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, message, company } = req.body || {};

  if (typeof company === "string" && company.trim()) {
    return res.status(200).json({ success: true });
  }

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string"
  ) {
    return res.status(400).json({ error: "Name, email, and message are required." });
  }

  const cleanName = name.trim();
  const cleanEmail = email.trim();
  const cleanMessage = message.trim();

  if (
    !cleanName || cleanName.length > 120 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) || cleanEmail.length > 254 ||
    !cleanMessage || cleanMessage.length > 5000
  ) {
    return res.status(400).json({ error: "Please check the submitted details." });
  }

  const { EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY, EMAILJS_PRIVATE_KEY } = process.env;
  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY || !EMAILJS_PRIVATE_KEY) {
    console.error("EmailJS environment variables are not configured.");
    return res.status(500).json({ error: "Email service is not configured." });
  }

  try {
    const emailResponse = await fetch(EMAILJS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        accessToken: EMAILJS_PRIVATE_KEY,
        template_params: {
          from_name: cleanName,
          from_email: cleanEmail,
          message: cleanMessage,
          to_email: CONTACT_EMAIL,
        },
      }),
    });

    if (!emailResponse.ok) {
      console.error("EmailJS rejected the contact request:", await emailResponse.text());
      return res.status(502).json({ error: "Could not send message." });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("EmailJS request failed:", error);
    return res.status(502).json({ error: "Could not send message." });
  }
};
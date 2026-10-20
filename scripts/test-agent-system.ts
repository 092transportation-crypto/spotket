/**
 * Lightweight resilience tests for the agent system's lib/ helpers,
 * run directly against the TypeScript source via `npx tsx`.
 * No real Supabase/Twilio/SMTP/Anthropic credentials are used or needed —
 * everything here verifies graceful no-op behavior when they're unset,
 * plus the auth/crypto logic which needs no network at all.
 *
 * Run: npx tsx scripts/test-agent-system.ts
 */
let failures = 0;
function check(name: string, ok: boolean, detail?: string) {
  console.log(`[${name}] ${ok ? "PASS" : "FAIL"}${detail ? ` (${detail})` : ""}`);
  if (!ok) failures++;
}

async function run() {
  // --- lib/auth.ts: cron auth with NO secret configured must always reject ---
  delete process.env.CRON_SECRET;
  const { verifyCronAuth } = await import("../lib/auth");
  check("cron auth: no CRON_SECRET configured always rejects", !verifyCronAuth("Bearer anything"));

  // --- lib/auth.ts: now configure secrets for the rest of the auth tests ---
  process.env.SESSION_SECRET = "test-secret";
  process.env.ADMIN_DASHBOARD_PASSWORD = "test-only-dummy-password";
  process.env.CRON_SECRET = "cron-test-secret";
  const { createSessionToken, verifySessionToken, checkAdminPassword } = await import("../lib/auth");

  check("admin password: correct accepted", checkAdminPassword("test-only-dummy-password"));
  check("admin password: wrong rejected", !checkAdminPassword("wrong"));
  check("admin password: empty rejected", !checkAdminPassword(""));

  const token = createSessionToken();
  check("session token: valid accepted", verifySessionToken(token));
  check("session token: missing rejected", !verifySessionToken(undefined));
  check("session token: garbage rejected", !verifySessionToken("not-a-real-token"));
  check(
    "session token: forged mac rejected",
    !verifySessionToken(`${Date.now() + 100000}.0000000000000000000000000000000000000000000000000000000000000000`),
  );
  check("session token: expired rejected", !verifySessionToken(`${Date.now() - 1000}.${token.split(".")[1]}`));

  check("cron auth: correct bearer accepted", verifyCronAuth("Bearer cron-test-secret"));
  check("cron auth: wrong bearer rejected", !verifyCronAuth("Bearer wrong"));
  check("cron auth: missing header rejected", !verifyCronAuth(null));
  check("cron auth: malformed header rejected", !verifyCronAuth("cron-test-secret"));

  // --- lib/sms.ts: no env vars configured — must no-op, never throw ---
  delete process.env.TWILIO_ACCOUNT_SID;
  delete process.env.TWILIO_AUTH_TOKEN;
  delete process.env.TWILIO_FROM_NUMBER;
  delete process.env.ALERT_PHONE_NUMBER;
  const { sendSms } = await import("../lib/sms");
  check("sendSms: no-ops cleanly when unconfigured", (await sendSms("test")) === false);

  // --- lib/sms.ts: a real call (fake creds, real Twilio URL) must still be
  // bounded by its own 6s timeout rather than hanging indefinitely ---
  process.env.TWILIO_ACCOUNT_SID = "AC_test";
  process.env.TWILIO_AUTH_TOKEN = "test_token";
  process.env.TWILIO_FROM_NUMBER = "+15555550100";
  process.env.ALERT_PHONE_NUMBER = "+15555550101";
  const twilioStart = Date.now();
  const smsLiveAttempt = await Promise.race([
    sendSms("timeout-check"),
    new Promise<string>((resolve) => setTimeout(() => resolve("TIMED_OUT_TEST_HARNESS"), 8000)),
  ]);
  check(
    "sendSms: bounded by its own timeout, doesn't hang past ~6s",
    smsLiveAttempt !== "TIMED_OUT_TEST_HARNESS",
    `took ${Date.now() - twilioStart}ms, result=${smsLiveAttempt}`,
  );

  // --- lib/mailer.ts: no env vars configured — must no-op, never throw ---
  delete process.env.SMTP_USER;
  delete process.env.SMTP_PASSWORD;
  const { sendEmail, buildFollowUpEmail } = await import("../lib/mailer");
  check("sendEmail: no-ops cleanly when unconfigured", (await sendEmail("test@example.com", "subj", "body")) === false);
  const followUp = buildFollowUpEmail("Jane Smith");
  check(
    "buildFollowUpEmail: matches the required copy",
    followUp.text === "Hey Jane — just following up on your interest in Spotket. Would love to show you a quick demo.",
    followUp.text,
  );

  // --- lib/supabase.ts: no env vars configured — every helper must degrade safely ---
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supa = await import("../lib/supabase");
  supa._resetSupabaseClientForTests();
  check("isAgentEnabled: defaults true when Supabase unconfigured", (await supa.isAgentEnabled("sales_agent")) === true);
  check("setAgentEnabled: returns false (no-op) when unconfigured", (await supa.setAgentEnabled("sales_agent", false)) === false);
  check("listAgentSettings: returns [] when unconfigured", (await supa.listAgentSettings()).length === 0);
  check(
    "insertLead: returns false (no-op) when unconfigured",
    (await supa.insertLead({ name: "Test", phone: "555", source: "test" })) === false,
  );
  check("recentActivity: returns [] when unconfigured", (await supa.recentActivity()).length === 0);
  await supa.logActivity("sales_agent", "test message"); // must not throw
  check("logActivity: does not throw when unconfigured", true);
  const stats = await supa.leadStats();
  check("leadStats: returns zeroed stats when unconfigured", stats.totalLeads === 0 && stats.followUpsSent === 0);

  // --- lib/anthropic.ts: no API key configured ---
  delete process.env.ANTHROPIC_API_KEY;
  const { callAnthropic, extractText, slugify } = await import("../lib/anthropic");
  const anthropicResult = await callAnthropic({ system: "test", messages: [{ role: "user", content: "hi" }] });
  check("callAnthropic: returns null when ANTHROPIC_API_KEY unset", anthropicResult === null);
  check("slugify: produces a clean slug", slugify("AI Automation for Dentists!") === "ai-automation-for-dentists");
  check(
    "extractText: joins text blocks",
    extractText([{ type: "text", text: "a" }, { type: "tool_use" }, { type: "text", text: "b" }]) === "a\nb",
  );

  // --- lib/mailer.ts: contact confirmation + follow-up copy must match spec exactly ---
  const { buildContactConfirmationEmail } = await import("../lib/mailer");
  const confirmation = buildContactConfirmationEmail("Jane Smith");
  check(
    "buildContactConfirmationEmail: matches the required copy",
    confirmation.text.includes("Thanks for reaching out to Spotket. We'll be in touch within 24 hours."),
  );
  check(
    "buildContactConfirmationEmail: escapes HTML in the name",
    !buildContactConfirmationEmail("<script>alert(1)</script>").html.includes("<script>alert"),
  );
  check(
    "buildFollowUpEmail: escapes HTML in the name",
    !buildFollowUpEmail("<script>alert(1)</script>").html.includes("<script>alert"),
  );

  // --- app/api/contact-inquiry/route.ts: exercise the real handler, no network needed ---
  supa._resetSupabaseClientForTests();
  const { POST: contactInquiryPost } = await import("../app/api/contact-inquiry/route");
  function fakeRequest(body: unknown) {
    return { json: async () => body } as unknown as Parameters<typeof contactInquiryPost>[0];
  }
  const missingFieldsRes = await contactInquiryPost(fakeRequest({ name: "Jane" }));
  check("contact-inquiry: 400 on missing required fields", missingFieldsRes.status === 400);

  const badEmailRes = await contactInquiryPost(
    fakeRequest({
      name: "Jane",
      business_name: "Jane's Shop",
      business_type: "Barbershop",
      phone: "4105551234",
      email: "not-an-email",
      biggest_challenge: "Not enough leads",
      heard_about_us: "Google",
    }),
  );
  check("contact-inquiry: 400 on invalid email", badEmailRes.status === 400);

  const validRes = await contactInquiryPost(
    fakeRequest({
      name: "Jane Smith",
      business_name: "Jane's Barbershop",
      business_type: "Barbershop",
      phone: "4105551234",
      email: "jane@example.org",
      website_url: "https://janesbarbershop.example",
      revenue_range: "$5k-$20k",
      biggest_challenge: "Not enough leads",
      heard_about_us: "Google",
      message: "Call me after 5pm.",
    }),
  );
  check(
    "contact-inquiry: 201 + ok on valid input, even with no Twilio/SMTP/Supabase configured",
    validRes.status === 201 && (await validRes.json()).ok === true,
  );

  // --- lib/markdown.ts ---
  const { renderMarkdown } = await import("../lib/markdown");
  const rendered = renderMarkdown("## Heading\n\nSome text\n\n- item one\n- item two");
  check("renderMarkdown: renders heading", rendered.includes("<h2"));
  check("renderMarkdown: renders list items", rendered.includes("<li>item one</li>"));
  check("renderMarkdown: escapes HTML", renderMarkdown("<script>alert(1)</script>").includes("&lt;script&gt;"));

  console.log(failures === 0 ? "\nALL TESTS PASSED" : `\n${failures} TEST(S) FAILED`);
  process.exit(failures === 0 ? 0 : 1);
}

run().catch((err) => {
  console.error("Test run crashed:", err);
  process.exit(1);
});

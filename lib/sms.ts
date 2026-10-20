/**
 * Fire-and-forget SMS alert dispatch via the Twilio REST API directly
 * (no SDK). No-ops and logs when Twilio env vars aren't set; never throws
 * past the caller; bounded by a timeout so a slow/unreachable Twilio never
 * hangs a request.
 */
const TIMEOUT_MS = 6000;

export async function sendSms(body: string): Promise<boolean> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;
  const to = process.env.ALERT_PHONE_NUMBER;
  if (!sid || !token || !from || !to) {
    console.log("Twilio not configured — skipping SMS dispatch.");
    return false;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const auth = Buffer.from(`${sid}:${token}`).toString("base64");
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ To: to, From: from, Body: body }),
      signal: controller.signal,
    });
    if (!res.ok) {
      console.error(`Twilio responded ${res.status} ${res.statusText}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Twilio SMS dispatch failed:", (err as Error).message);
    return false;
  } finally {
    clearTimeout(timer);
  }
}

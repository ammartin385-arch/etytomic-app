import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

type ReminderPreference = {
  id: string;
  user_id: string;
  daily_enabled: boolean | null;
  daily_time: string | null;
  weekly_enabled: boolean | null;
  weekly_day: string | null;
  weekly_time: string | null;
  monthly_enabled: boolean | null;
  monthly_day: number | null;
  monthly_time: string | null;
  timezone: string | null;
};

type ReminderKind = "daily" | "weekly" | "monthly";

type DueReminder = {
  kind: ReminderKind;
  title: string;
  subject: string;
  body: string;
};

type ReminderDiagnostic = {
  user_id: string;
  timezone: string;
  local_weekday: string;
  local_day: number;
  local_minutes: number;
  date_key: string;
  daily_enabled: boolean;
  daily_time: string | null;
  weekly_enabled: boolean;
  weekly_day: string | null;
  weekly_time: string | null;
  monthly_enabled: boolean;
  monthly_day: number | null;
  monthly_time: string | null;
  due: ReminderKind[];
};

type LocalDateParts = {
  weekday: string;
  day: number;
  dateKey: string;
  minutes: number;
};

const FROM_EMAIL = Deno.env.get("REMINDER_FROM_EMAIL") || "Etytomic Alignment <reminders@etytomic.com>";
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const WINDOW_MINUTES = Number(Deno.env.get("REMINDER_WINDOW_MINUTES") || "60");

const WEEKDAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const normalizeTime = (value: string | null | undefined, fallback: string) => {
  const text = value || fallback;
  const match = text.match(/^(\d{1,2}):(\d{2})/);
  if (!match) return fallback;
  return `${match[1].padStart(2, "0")}:${match[2]}`;
};

const minutesFromTime = (value: string) => {
  const [hours, minutes] = normalizeTime(value, "09:00").split(":").map(Number);
  return hours * 60 + minutes;
};

const getLocalDateParts = (now: Date, timeZone: string): LocalDateParts => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "long",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);

  const getPart = (type: string) => parts.find((part) => part.type === type)?.value || "";
  const year = getPart("year");
  const month = getPart("month");
  const day = getPart("day");
  const hours = Number(getPart("hour") || 0);
  const minutes = Number(getPart("minute") || 0);

  return {
    weekday: getPart("weekday"),
    day: Number(day),
    dateKey: year + "-" + month + "-" + day,
    minutes: hours * 60 + minutes,
  };
};

const isTimeDue = (preferredTime: string | null | undefined, localNow: LocalDateParts) => {
  const targetMinutes = minutesFromTime(preferredTime || "09:00");
  const delta = localNow.minutes - targetMinutes;
  return delta >= 0 && delta < WINDOW_MINUTES;
};

const getDueReminders = (preference: ReminderPreference, localNow: LocalDateParts): DueReminder[] => {
  const reminders: DueReminder[] = [];

  if (preference.daily_enabled && isTimeDue(preference.daily_time, localNow)) {
    reminders.push({
      kind: "daily",
      title: "Daily journal reminder",
      subject: "A quiet moment to notice your alignment",
      body: "Take a few minutes today to notice what is aligned, what feels resistant, and where one faithful step may be clear.",
    });
  }

  const weeklyDay = preference.weekly_day || "Sunday";
  if (
    preference.weekly_enabled &&
    localNow.weekday === weeklyDay &&
    isTimeDue(preference.weekly_time, localNow)
  ) {
    reminders.push({
      kind: "weekly",
      title: "Weekly journal reminder",
      subject: "Your weekly Etytomic reflection",
      body: "Use this check-in to reflect on what you have noticed since your last entry and where God may be inviting your attention.",
    });
  }

  const monthlyDay = Number(preference.monthly_day || 1);
  if (
    preference.monthly_enabled &&
    localNow.day === monthlyDay &&
    isTimeDue(preference.monthly_time, localNow)
  ) {
    reminders.push({
      kind: "monthly",
      title: "Monthly reassessment reminder",
      subject: "It may be time for your monthly alignment check-in",
      body: "Return to the assessment when you are ready. This is not pressure; it is a simple way to notice growth, resistance, and patterns over time.",
    });
  }

  return reminders;
};

const getLogKey = (userId: string, kind: ReminderKind, dateKey: string) => {
  return userId + ":" + kind + ":" + dateKey;
};

const getForcedReminder = (kind: ReminderKind): DueReminder => {
  if (kind === "weekly") {
    return {
      kind: "weekly",
      title: "Weekly journal reminder",
      subject: "Your weekly Etytomic reflection",
      body: "Use this check-in to reflect on what you have noticed since your last entry and where God may be inviting your attention.",
    };
  }

  if (kind === "monthly") {
    return {
      kind: "monthly",
      title: "Monthly reassessment reminder",
      subject: "It may be time for your monthly alignment check-in",
      body: "Return to the assessment when you are ready. This is not pressure; it is a simple way to notice growth, resistance, and patterns over time.",
    };
  }

  return {
    kind: "daily",
    title: "Daily journal reminder",
    subject: "A quiet moment to notice your alignment",
    body: "Take a few minutes today to notice what is aligned, what feels resistant, and where one faithful step may be clear.",
  };
};

const sendEmail = async (to: string, reminder: DueReminder) => {
  if (!RESEND_API_KEY) {
    throw new Error("Missing RESEND_API_KEY secret");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to,
      subject: reminder.subject,
      html: `
        <div style="font-family: Inter, Arial, sans-serif; color: #1f2937; line-height: 1.6; max-width: 560px; margin: 0 auto; padding: 24px;">
          <h1 style="font-family: Georgia, serif; font-size: 24px; margin: 0 0 12px;">${reminder.title}</h1>
          <p style="font-size: 16px; margin: 0 0 20px;">${reminder.body}</p>
          <p style="font-size: 14px; color: #6b7280; margin: 0;">Etytomic Alignment</p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Resend send failed: ${response.status} ${message}`);
  }

  return response.json();
};

export default {
  fetch: withSupabase({ auth: ["secret"] }, async (req, ctx) => {
    const now = new Date();
    const url = new URL(req.url);
    const forceKindParam = url.searchParams.get("force");
    const forceKind = ["daily", "weekly", "monthly"].includes(forceKindParam || "")
      ? (forceKindParam as ReminderKind)
      : null;

    const { data: preferences, error: preferencesError } = await ctx.supabaseAdmin
      .from("reminder_preferences")
      .select("id,user_id,timezone,daily_enabled,daily_time,weekly_enabled,weekly_day,weekly_time,monthly_enabled,monthly_day,monthly_time")
      .or("daily_enabled.eq.true,weekly_enabled.eq.true,monthly_enabled.eq.true");

    if (preferencesError) {
      console.error("Unable to load reminder preferences", preferencesError);
      return Response.json({ error: preferencesError.message }, { status: 500 });
    }

    const results = {
      checked: preferences?.length || 0,
      sent: 0,
      skipped: 0,
      forced: forceKind,
      diagnostics: [] as ReminderDiagnostic[],
      errors: [] as string[],
    };

    for (const preference of (preferences || []) as ReminderPreference[]) {
      const timeZone = preference.timezone || "UTC";
      const localNow = getLocalDateParts(now, timeZone);
      const dueReminders = forceKind ? [getForcedReminder(forceKind)] : getDueReminders(preference, localNow);
      results.diagnostics.push({
        user_id: preference.user_id,
        timezone: timeZone,
        local_weekday: localNow.weekday,
        local_day: localNow.day,
        local_minutes: localNow.minutes,
        date_key: localNow.dateKey,
        daily_enabled: !!preference.daily_enabled,
        daily_time: preference.daily_time,
        weekly_enabled: !!preference.weekly_enabled,
        weekly_day: preference.weekly_day,
        weekly_time: preference.weekly_time,
        monthly_enabled: !!preference.monthly_enabled,
        monthly_day: preference.monthly_day,
        monthly_time: preference.monthly_time,
        due: dueReminders.map((reminder) => reminder.kind),
      });

      if (!dueReminders.length) {
        results.skipped += 1;
        continue;
      }

      const { data: userResult, error: userError } = await ctx.supabaseAdmin.auth.admin.getUserById(preference.user_id);
      const email = userResult?.user?.email;

      if (userError || !email) {
        results.errors.push(`No email found for user ${preference.user_id}`);
        continue;
      }

      for (const reminder of dueReminders) {
        const logKey = getLogKey(
          preference.user_id,
          reminder.kind,
          forceKind ? `${localNow.dateKey}:forced:${now.getTime()}` : localNow.dateKey,
        );
        const { data: existingLog, error: logLookupError } = await ctx.supabaseAdmin
          .from("reminder_delivery_log")
          .select("id")
          .eq("log_key", logKey)
          .maybeSingle();

        if (logLookupError) {
          results.errors.push(`Unable to check reminder log for ${logKey}: ${logLookupError.message}`);
          continue;
        }

        if (existingLog) {
          results.skipped += 1;
          continue;
        }

        try {
          await sendEmail(email, reminder);
          await ctx.supabaseAdmin.from("reminder_delivery_log").insert({
            user_id: preference.user_id,
            reminder_type: reminder.kind,
            log_key: logKey,
            sent_at: now.toISOString(),
          });
          results.sent += 1;
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          console.error("Unable to send reminder", message);
          results.errors.push(message);
        }
      }
    }

    return Response.json(results);
  }),
};

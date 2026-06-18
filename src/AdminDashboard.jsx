import React, { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { createRoot } from "react-dom/client";

const ADMIN_EMAILS = Object.freeze(["am.martin385@gmail.com"]);
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://trmvlobqxgjathjmkdin.supabase.co";
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "sb_publishable_0KHV-ub2w0Fwsd1sG6kMxw_H83UIAbM";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function isApprovedAdmin(email) {
  return ADMIN_EMAILS.includes(String(email || "").trim().toLowerCase());
}

function formatCount(value) {
  return new Intl.NumberFormat().format(Number(value) || 0);
}

function MetricCard({ label, value, detail }) {
  return (
    <article className="soft-panel rounded-md p-5 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6B7280]">
        {label}
      </p>
      <p className="mt-3 text-4xl font-semibold tabular-nums text-[#1F2937]">
        {formatCount(value)}
      </p>
      {detail ? (
        <p className="mt-2 text-sm leading-6 text-[#6B7280]">{detail}</p>
      ) : null}
    </article>
  );
}

function ActivityBars({ title, data, emptyMessage }) {
  const max = Math.max(1, ...data.map((item) => Number(item.count) || 0));

  return (
    <section className="glass-panel rounded-md p-5 sm:p-6">
      <p className="eyebrow mb-2">Last 30 Days</p>
      <h2 className="serif text-2xl font-semibold text-[#1F2937]">{title}</h2>
      {data.some((item) => Number(item.count) > 0) ? (
        <div
          className="mt-6 grid h-48 items-end gap-1"
          style={{
            gridTemplateColumns: `repeat(${Math.max(data.length, 1)}, minmax(0, 1fr))`,
          }}
          aria-label={title}
        >
          {data.map((item) => {
            const count = Number(item.count) || 0;
            const height = count ? Math.max(8, (count / max) * 100) : 2;
            return (
              <div
                key={item.date}
                className="group flex h-full items-end"
                title={`${item.date}: ${count}`}
              >
                <div
                  className="w-full rounded-sm bg-[#4A6FA5]/75 transition group-hover:bg-[#3F5F8C]"
                  style={{ height: `${height}%` }}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <p className="mt-5 text-sm leading-6 text-[#6B7280]">{emptyMessage}</p>
      )}
      <div className="mt-3 flex justify-between text-xs text-[#9CA3AF]">
        <span>{data[0]?.date || ""}</span>
        <span>{data[data.length - 1]?.date || ""}</span>
      </div>
    </section>
  );
}

function StatusPage({ eyebrow, title, message, action }) {
  return (
    <main className="page-shell">
      <section className="glass-panel mx-auto max-w-2xl rounded-md p-8 text-center sm:p-10">
        <img
          src="/brand/logo-horizontal-clean.png"
          alt="Etytomic Alignment"
          className="mx-auto mb-6 h-24 w-auto max-w-full object-contain"
        />
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="serif mt-3 text-3xl font-semibold text-[#1F2937]">
          {title}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#6B7280]">
          {message}
        </p>
        {action}
      </section>
    </main>
  );
}

function AdminDashboard() {
  const [status, setStatus] = useState("loading");
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (!active) return;

      if (userError || !userData?.user) {
        setStatus("signed-out");
        return;
      }

      const authenticatedUser = userData.user;

      if (!isApprovedAdmin(authenticatedUser.email)) {
        setStatus("denied");
        return;
      }

      const { data, error: metricsError } = await supabase.rpc(
        "admin_usage_metrics",
      );
      if (!active) return;

      if (metricsError) {
        setError(metricsError.message);
        setStatus("error");
        return;
      }

      setMetrics(data);
      setStatus("ready");
    }

    loadDashboard();
    return () => {
      active = false;
    };
  }, []);

  const assessmentDays = useMemo(
    () => (Array.isArray(metrics?.assessments_by_day) ? metrics.assessments_by_day : []),
    [metrics],
  );
  const newUserDays = useMemo(
    () => (Array.isArray(metrics?.new_users_by_day) ? metrics.new_users_by_day : []),
    [metrics],
  );

  if (status === "loading") {
    return (
      <StatusPage
        eyebrow="Private Admin"
        title="Loading usage metrics"
        message="Confirming your account and preparing aggregate product activity."
      />
    );
  }

  if (status === "signed-out") {
    return (
      <StatusPage
        eyebrow="Private Admin"
        title="Admin sign-in required"
        message="Sign in through Etytomic first, then return to /admin."
        action={
          <a
            href="/"
            className="gold-button mt-6 inline-flex rounded-md px-5 py-3 text-sm font-semibold text-white"
          >
            Go to Etytomic Login
          </a>
        }
      />
    );
  }

  if (status === "denied") {
    return (
      <StatusPage
        eyebrow="Private Admin"
        title="Access denied"
        message="The authenticated account is not approved for admin metrics."
        action={
          <a
            href="/"
            className="mt-6 inline-flex rounded-md border border-[#CBD5E1] bg-white/80 px-5 py-3 text-sm font-semibold text-[#374151]"
          >
            Return to Etytomic
          </a>
        }
      />
    );
  }

  if (status === "error") {
    return (
      <StatusPage
        eyebrow="Private Admin"
        title="Metrics unavailable"
        message={`The aggregate metrics service could not be loaded. ${error}`}
      />
    );
  }

  const cards = [
    ["Total registered users", metrics.total_registered_users],
    ["Assessment users", metrics.unique_assessment_users, "Completed at least one assessment"],
    ["Total assessments", metrics.total_assessments],
    ["Assessments, 7 days", metrics.assessments_last_7_days],
    ["Assessments, 30 days", metrics.assessments_last_30_days],
    ["Premium active users", metrics.premium_active_users],
    ["Free users", metrics.free_users],
    ["Total journal entries", metrics.total_journal_entries, "Counts only; reflection content is never loaded"],
    ["Journal entries, 7 days", metrics.journal_entries_last_7_days],
    ["Reminder opt-ins", metrics.reminder_opt_ins, "At least one reminder enabled"],
  ];

  return (
    <main className="page-shell">
      <section className="glass-panel rounded-md p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Private Admin</p>
            <h1 className="serif mt-3 text-4xl font-semibold text-[#1F2937] sm:text-5xl">
              Usage Overview
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#6B7280]">
              Aggregate product activity only. No journal text, assessment
              answers, reflections, or individual user records are displayed.
            </p>
          </div>
          <div className="soft-panel rounded-md px-4 py-3 text-sm text-[#6B7280]">
            <p className="font-semibold text-[#1F2937]">Admin access verified</p>
            <p className="mt-1">Aggregate-only view</p>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map(([label, value, detail]) => (
          <MetricCard key={label} label={label} value={value} detail={detail} />
        ))}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <ActivityBars
          title="Assessments by day"
          data={assessmentDays}
          emptyMessage="No assessments were recorded during this period."
        />
        <ActivityBars
          title="New users by day"
          data={newUserDays}
          emptyMessage="No new users were recorded during this period."
        />
      </section>

      <section className="glass-panel mt-6 rounded-md p-5 sm:p-6">
        <p className="eyebrow">Plan Mix</p>
        <h2 className="serif mt-2 text-2xl font-semibold text-[#1F2937]">
          Premium and free accounts
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="soft-panel rounded-md p-5">
            <p className="text-sm font-semibold text-[#4A6FA5]">Premium active</p>
            <p className="mt-2 text-3xl font-semibold text-[#1F2937]">
              {formatCount(metrics.premium_active_users)}
            </p>
          </div>
          <div className="soft-panel rounded-md p-5">
            <p className="text-sm font-semibold text-[#6B7280]">Free</p>
            <p className="mt-2 text-3xl font-semibold text-[#1F2937]">
              {formatCount(metrics.free_users)}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export function renderAdminDashboard(element) {
  createRoot(element).render(
    <React.StrictMode>
      <AdminDashboard />
    </React.StrictMode>,
  );
}

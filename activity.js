// Shared-activity preview for https://gogathernow.com/activity/<share-code>.
// GitHub Pages serves 404.html for unknown paths, so this script decides
// whether the URL is an activity link or a genuine "not found".
const supabaseUrl = "https://fqqybpomcgayjxsptxtl.supabase.co";
const supabasePublishableKey = "sb_publishable_9aAveeRNnQLBNiKQq3ZS_w_19DiWSEo";

const lang = (navigator.language || "en").toLowerCase().startsWith("ro") ? "ro" : "en";
const text = {
  en: {
    loadingEyebrow: "One moment",
    loadingTitle: "Loading the plan",
    openApp: "Open in GoGatherNow",
    getApp: "Get the app on Google Play",
    joinNote: "Joining and chatting with the group happen in the app.",
    unavailableEyebrow: "Plan unavailable",
    unavailableTitle: "This plan isn't available",
    unavailableBody:
      "It may have been cancelled or made private. You can find other plans near you in the app.",
    home: "Go to GoGatherNow",
    notFoundTitle: "Page not found",
    privatePlace: "Exact meeting point shared after the organizer approves you",
    people: (going, max) => `${going} of ${max} going`,
    host: (name) => `Organized by ${name}`,
    open: "Anyone can join",
    request: "The organizer approves who joins",
  },
  ro: {
    loadingEyebrow: "O clipă",
    loadingTitle: "Se încarcă planul",
    openApp: "Deschide în GoGatherNow",
    getApp: "Descarcă aplicația din Google Play",
    joinNote: "Te alături și vorbești cu grupul în aplicație.",
    unavailableEyebrow: "Plan indisponibil",
    unavailableTitle: "Acest plan nu este disponibil",
    unavailableBody:
      "Poate a fost anulat sau făcut privat. Găsești alte planuri lângă tine în aplicație.",
    home: "Mergi la GoGatherNow",
    notFoundTitle: "Pagina nu a fost găsită",
    privatePlace: "Locul exact este afișat după ce organizatorul te aprobă",
    people: (going, max) => `${going} din ${max} participă`,
    host: (name) => `Organizat de ${name}`,
    open: "Oricine se poate alătura",
    request: "Organizatorul aprobă cine participă",
  },
}[lang];

document.documentElement.lang = lang;
const $ = (id) => document.getElementById(id);

function show(id) {
  for (const state of ["loading-state", "activity-state", "unavailable-state", "notfound-state"]) {
    $(state).hidden = state !== id;
  }
}

function translateStatic() {
  for (const node of document.querySelectorAll("[data-i18n]")) {
    const value = text[node.dataset.i18n];
    if (typeof value === "string") node.textContent = value;
  }
}

function shareCodeFromPath() {
  const match = window.location.pathname.match(/^\/activity\/([0-9a-f]{32})\/?$/i);
  return match ? match[1].toLowerCase() : null;
}

function formatWhen(startsAt) {
  if (!startsAt) return "";
  return new Intl.DateTimeFormat(lang === "ro" ? "ro-RO" : "en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(startsAt));
}

function render(code, activity) {
  // textContent only: activity fields are user-written and never parsed as HTML.
  $("activity-title").textContent = activity.title;
  document.title = `${activity.title} · GoGatherNow`;
  $("activity-category").textContent =
    activity.join_policy === "open" ? text.open : text.request;
  $("activity-when").textContent = formatWhen(activity.starts_at);
  $("activity-where").textContent = activity.place_hint || text.privatePlace;
  $("activity-people").textContent = text.people(activity.member_count, activity.squad_max_members);
  $("activity-host").textContent = activity.host_display_name
    ? text.host(activity.host_display_name)
    : "";
  if (activity.description) {
    $("activity-description").textContent = activity.description;
    $("activity-description").hidden = false;
  }
  $("open-app").href = `gogathernow://activity/${code}`;
  show("activity-state");
}

async function main() {
  translateStatic();
  const code = shareCodeFromPath();
  if (!code) {
    show("notfound-state");
    return;
  }
  show("loading-state");
  try {
    const client = window.supabase.createClient(supabaseUrl, supabasePublishableKey, {
      auth: { persistSession: false, detectSessionInUrl: false },
    });
    const { data, error } = await client.rpc("activity_for_share_code", { p_share_code: code });
    const activity = Array.isArray(data) ? data[0] : data;
    if (error || !activity) {
      show("unavailable-state");
      return;
    }
    render(code, activity);
  } catch (_) {
    show("unavailable-state");
  }
}

main();

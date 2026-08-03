const supabaseUrl = "https://fqqybpomcgayjxsptxtl.supabase.co";
const supabasePublishableKey = "sb_publishable_9aAveeRNnQLBNiKQq3ZS_w_19DiWSEo";

const client = window.supabase.createClient(
  supabaseUrl,
  supabasePublishableKey,
  {
    auth: {
      persistSession: false,
      detectSessionInUrl: false,
    },
  },
);

const loadingState = document.querySelector("#loading-state");
const successState = document.querySelector("#success-state");
const invalidState = document.querySelector("#invalid-state");

async function confirmEmail() {
  const params = new URLSearchParams(window.location.search);
  const tokenHash = params.get("token_hash");
  if (!tokenHash || params.get("type") !== "email") {
    showInvalidState();
    return;
  }

  const { error } = await client.auth.verifyOtp({
    token_hash: tokenHash,
    type: "email",
  });
  if (error) {
    showInvalidState();
    return;
  }

  loadingState.hidden = true;
  successState.hidden = false;
}

function showInvalidState() {
  loadingState.hidden = true;
  invalidState.hidden = false;
}

confirmEmail();

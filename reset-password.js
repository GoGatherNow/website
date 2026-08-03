const supabaseUrl = "https://fqqybpomcgayjxsptxtl.supabase.co";
const supabasePublishableKey = "sb_publishable_9aAveeRNnQLBNiKQq3ZS_w_19DiWSEo";

const client = window.supabase.createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: true,
    detectSessionInUrl: false,
  },
});

const loadingState = document.querySelector("#loading-state");
const resetForm = document.querySelector("#reset-form");
const successState = document.querySelector("#success-state");
const invalidState = document.querySelector("#invalid-state");
const formError = document.querySelector("#form-error");
const passwordInput = document.querySelector("#password");
const confirmationInput = document.querySelector("#password-confirmation");

async function beginRecovery() {
  const { data: existingSession } = await client.auth.getSession();
  if (existingSession.session) {
    showResetForm();
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const tokenHash = params.get("token_hash");
  if (!tokenHash || params.get("type") !== "recovery") {
    showInvalidState();
    return;
  }

  const { error } = await client.auth.verifyOtp({
    token_hash: tokenHash,
    type: "recovery",
  });
  if (error) {
    showInvalidState();
    return;
  }

  showResetForm();
}

function showResetForm() {
  loadingState.hidden = true;
  resetForm.hidden = false;
  passwordInput.focus();
}

function showInvalidState() {
  loadingState.hidden = true;
  resetForm.hidden = true;
  invalidState.hidden = false;
}

resetForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  formError.hidden = true;

  if (passwordInput.value.length < 6) {
    formError.textContent = "Use at least 6 characters.";
    formError.hidden = false;
    passwordInput.focus();
    return;
  }
  if (passwordInput.value !== confirmationInput.value) {
    formError.textContent = "The passwords don’t match.";
    formError.hidden = false;
    confirmationInput.focus();
    return;
  }

  const submitButton = resetForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = "Saving…";

  const { error } = await client.auth.updateUser({
    password: passwordInput.value,
  });
  if (error) {
    submitButton.disabled = false;
    submitButton.textContent = "Save new password";
    formError.textContent = "We couldn’t update your password. Request a new link and try again.";
    formError.hidden = false;
    return;
  }

  await client.auth.signOut();
  resetForm.hidden = true;
  successState.hidden = false;
});

beginRecovery();

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function createCheckout(items) {
  const response = await fetch(`${API_URL}/api/create-checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });

  if (!response.ok) {
    let detail = "Checkout failed. Please try again.";
    try {
      const data = await response.json();
      if (data?.detail) detail = data.detail;
    } catch {
      // ignore parse errors and fall back to generic message
    }
    throw new Error(detail);
  }

  return response.json();
}

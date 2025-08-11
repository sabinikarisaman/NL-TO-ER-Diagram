export async function parseERWithGemini(input) {
  const response = await fetch("http://localhost:5000/api/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userText: input }),
  });
  if (!response.ok) {
    throw new Error("Failed to parse ER diagram via Gemini");
  }
  return await response.json();
}

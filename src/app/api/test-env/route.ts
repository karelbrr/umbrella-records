// app/api/test-env/route.ts
export async function GET() {
  const klic = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  return Response.json({
    klic_existuje: !!klic,
    delka_klice: klic ? klic.length : 0,
    zacatek_klice: klic ? klic.substring(0, 4) : "NIC",
    vsechny_klic_nazvy: Object.keys(process.env).filter(
      (k) => k.includes("GOOGLE") || k.includes("SUPABASE"),
    ),
  });
}

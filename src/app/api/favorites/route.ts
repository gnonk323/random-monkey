import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { image_url, image_id } = await req.json();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!image_url || !image_id) return NextResponse.json({ error: "Missing image_url or image_id" }, { status: 400 });

  const { data: existing, error: fetchError } = await supabase
    .from("favorites")
    .select("*")
    .eq("user_id", user.id)
    .eq("image_id", image_id)
    .maybeSingle();

  if (fetchError) {
    console.error("[API][ERROR] Error checking for favorite:", fetchError.message);
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  if (existing) {
    console.log("[API][INFO] Image is already favorited, removing...");
    const { error: deleteError } = await supabase.from("favorites").delete().eq("id", existing.id);

    if (deleteError) {
      console.error("[API][ERROR] Error removing favorite:", deleteError.message);
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }
    console.log("[API][INFO] Favorite successfully removed.");
    return NextResponse.json({ success: true, action: "removed" });
  } else {
    console.log("[API][INFO] Image is not favorited, adding...");
    const { error: insertError } = await supabase.from("favorites").insert({ user_id: user.id, image_url, image_id });

    if (insertError) {
      console.error("[API][ERROR] Error adding favorite:", insertError.message);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }
    console.log("[API][INFO] Favorite successfully added.");
    return NextResponse.json({ success: true, action: "added" });
  }
}

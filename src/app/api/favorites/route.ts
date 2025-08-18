import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { image_url, image_id } = await req.json();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!image_url || !image_id) return NextResponse.json({ error: "Missing image_url or image_id" }, { status: 400 });

  const { data: existing, error: fetchError } = await supabase
    .from("favorites")
    .select("*")
    .eq("user_id", user.id)
    .eq("image_id", image_id)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    // no rows found
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  if (existing) {
    const { error: deleteError } = await supabase
      .from("favorites")
      .delete()
      .eq("id", existing.id);

    if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 500 });
    return NextResponse.json({ success: true, action: "removed" });
  } else {
    const { error: insertError } = await supabase
      .from("favorites")
      .insert({ user_id: user.id, image_url, image_id });

    if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });
    return NextResponse.json({ success: true, action: "added" });
  }
}

export async function GET() {
  const supabase = await createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) return NextResponse.json({ error: userError.message }, { status: 500 });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: favorites, error: favoritesError } = await supabase
    .from("favorites")
    .select("image_url")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (favoritesError) return NextResponse.json({ error: favoritesError.message }, { status: 500 });

  return NextResponse.json({ favorites: favorites.map(f => f.image_url) });
}

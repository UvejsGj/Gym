"use client";

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { LogoutButton } from "@/components/layout/logout-button";

export default function SettingsPage() {
  const supabase = useMemo(() => createClient(), []);
  const { theme, setTheme } = useTheme();
  const [displayName, setDisplayName] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function saveProfile() {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;
    const { error } = await supabase.from("profiles").upsert({ user_id: userData.user.id, display_name: displayName });
    if (error) return toast.error(error.message);
    toast.success("Display name saved.");
  }

  async function deleteData() {
    if (!confirm("Delete all your tracked data? This cannot be undone.")) return;
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;
    const userId = userData.user.id;
    await supabase.from("body_weight_entries").delete().eq("user_id", userId);
    await supabase.from("workouts").delete().eq("user_id", userId);
    await supabase.from("exercises").delete().eq("user_id", userId);
    toast.success("Account data deleted.");
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex flex-col gap-2"><Label>Display name</Label><Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} /></div>
          <Button onClick={() => void saveProfile()}>Save</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Appearance</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-between">
          <Label>Dark mode</Label>
          <Switch
            checked={mounted ? theme === "dark" : false}
            onCheckedChange={(value) => setTheme(value ? "dark" : "light")}
            disabled={!mounted}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Session</CardTitle></CardHeader>
        <CardContent><LogoutButton /></CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Danger Zone</CardTitle></CardHeader>
        <CardContent><Button variant="destructive" onClick={() => void deleteData()}>Delete Account Data</Button></CardContent>
      </Card>
    </div>
  );
}

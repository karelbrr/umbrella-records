"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton"; 
import { supabase } from "@/hooks/createClient";
import { useQuery } from "@tanstack/react-query";
import FetchError from "../ui/fetch-error";

interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  email: string;
  is_main_admin: boolean;
}

export function TeamList() {
  async function fetchUsers() {
    const { data, error } = await supabase.from("profiles").select("*");
    if (error) {
      throw new Error(error.message);
    }
    return data as Profile[];
  }

  const { data, error, isLoading } = useQuery<Profile[]>({
    queryKey: ["userDetailsForTeamsPage"],
    queryFn: fetchUsers,
  });

  function getInitials(name: string): string {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  }

  function getRoleBadgeVariant(is_main_admin: boolean) {
    return is_main_admin ? "default" : "secondary";
  }

  if (isLoading || !data) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="py-0 !bg-black">
            <CardContent className="flex items-center gap-4 py-5">
              <Skeleton className="size-12 rounded-full" />

              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </CardContent>
          </Card>
        ))}

              {error && <FetchError />}

      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data?.map((profile) => (
        <Card key={profile.id} className="py-0 !bg-black">
          <CardContent className="flex items-center gap-4 py-5">
            <Avatar className="size-12">
              <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
              <AvatarFallback className="text-sm">
                {getInitials(profile.full_name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate font-medium text-foreground">
                  {profile.username}
                </p>
                <Badge variant={getRoleBadgeVariant(profile.is_main_admin)}>
                  {profile.is_main_admin ? "Admin" : "Member"}
                </Badge>
              </div>
              <p className="truncate text-sm text-muted-foreground">
                {profile.email}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}

    </div>
  );
}

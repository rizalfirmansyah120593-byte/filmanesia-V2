import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { IS_DEVELOPMENT } from "@/utils/constants";

export const GET = async (request: Request) => {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  let next = searchParams.get("next") ?? "/";
  if (!next.startsWith("/")) {
    next = "/";
  }

  if (code) {
    const supabase = await createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Insert username
      if (user) {
        console.info({ user });

        const { data: profile } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", user.id)
          .single();

        if (!profile) {
          // Get base username dari Google
          const baseUsername =
            user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0];

          // Function buat generate unique username
          const generateUniqueUsername = async (base: string) => {
            let username = base;
            let attempts = 0;
            const maxAttempts = 5; // Prevent infinite loop

            while (attempts < maxAttempts) {
              // Check if username exists
              const { data: existing } = await supabase
                .from("profiles")
                .select("username")
                .eq("username", username)
                .single();

              if (!existing) {
                // Username available!
                return username;
              }

              // Username taken, add random 4 digits
              const randomNum = Math.floor(1000 + Math.random() * 9000); // 1000-9999
              username = `${base}#${randomNum}`;
              attempts++;
            }

            // Fallback: use timestamp if still can't find unique
            return `${base}${Date.now()}`;
          };

          // Generate unique username
          const uniqueUsername = await generateUniqueUsername(baseUsername);

          // Insert profile with unique username
          const { error: profileError } = await supabase.from("profiles").insert({
            id: user.id,
            username: uniqueUsername,
          });

          if (profileError) {
            console.error("Profile creation error:", profileError);
          } else {
            console.log("Profile created with username:", uniqueUsername);
          }
        }
      }

      const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer

      if (IS_DEVELOPMENT) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth?error=true`);
};

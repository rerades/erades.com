export const prerender = false;
import type { APIRoute } from "astro";
import { searchPosts } from "../../utils/search-posts";

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const results = await searchPosts(url.searchParams.get("q") || "");

  return new Response(JSON.stringify(results), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-cache, must-revalidate",
    },
  });
};

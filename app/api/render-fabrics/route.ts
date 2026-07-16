import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://designature.onrender.com";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const body = await request.json().catch(() => ({}));
    const { projectId, segments = [], background = "Studio" } = body;

    console.log(`Forwarding render-fabrics query to Render backend for projectId: ${projectId}`);

    // Try routing to FastAPI endpoints
    try {
      let response = await fetch(`${BACKEND_URL}/api/render-fabrics`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authHeader ? { "Authorization": authHeader } : {})
        },
        body: JSON.stringify({ projectId, segments, background })
      });

      // Try fallback to root route if /api/ not found
      if (response.status === 404) {
        response = await fetch(`${BACKEND_URL}/render-fabrics`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(authHeader ? { "Authorization": authHeader } : {})
          },
          body: JSON.stringify({ projectId, segments, background })
        });
      }

      if (response.ok) {
        const data = await response.json();
        console.log("Successfully generated AI render using Render FastAPI backend:", data);
        return NextResponse.json(data);
      }
      
      console.warn(`Render backend failed with status ${response.status}. Invoking sandbox fallback...`);
    } catch (networkError) {
      console.warn("Render backend is currently offline or unreachable. Running sandbox fallback...", networkError);
    }

    // Fallback simulation
    await new Promise((resolve) => setTimeout(resolve, 2000));
    let renderedImageUrl = "/presets/workspace_background_contexts_1782147146726.png";

    return NextResponse.json({
      success: true,
      renderedImageUrl,
      metadata: {
        timestamp: new Date().toISOString(),
        projectId,
        background,
        elementsCount: segments.length,
        _fallback: true
      }
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

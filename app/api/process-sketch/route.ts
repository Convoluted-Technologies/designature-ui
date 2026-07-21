import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://designature.onrender.com";

// Default segments for Gown (Mock Fallback)
const DEFAULT_GOWN_SEGMENTS = [
  {
    id: "seg_collar",
    label: "Neck Collar",
    points: [
      { x: 160, y: 160 },
      { x: 180, y: 180, isControl: true },
      { x: 220, y: 180, isControl: true },
      { x: 240, y: 160 },
      { x: 235, y: 145 },
      { x: 215, y: 165, isControl: true },
      { x: 185, y: 165, isControl: true },
      { x: 165, y: 145 }
    ],
    svg_path: "M 160 160 C 180 180, 220 180, 240 160 L 235 145 C 215 165, 185 165, 165 145 Z",
    z_index: 3,
    defaultFill: "#fafaf9"
  },
  {
    id: "seg_sleeve_l",
    label: "Left Sleeve",
    points: [
      { x: 140, y: 180 },
      { x: 110, y: 190, isControl: true },
      { x: 90, y: 220, isControl: true },
      { x: 80, y: 250 },
      { x: 110, y: 260 },
      { x: 120, y: 230, isControl: true },
      { x: 130, y: 200, isControl: true },
      { x: 140, y: 180 }
    ],
    svg_path: "M 140 180 C 110 190, 90 220, 80 250 L 110 260 C 120 230, 130 200, 140 180 Z",
    z_index: 2,
    defaultFill: "#f4f4f5"
  },
  {
    id: "seg_sleeve_r",
    label: "Right Sleeve",
    points: [
      { x: 260, y: 180 },
      { x: 290, y: 190, isControl: true },
      { x: 310, y: 220, isControl: true },
      { x: 320, y: 250 },
      { x: 290, y: 260 },
      { x: 280, y: 230, isControl: true },
      { x: 270, y: 200, isControl: true },
      { x: 260, y: 180 }
    ],
    svg_path: "M 260 180 C 290 190, 310 220, 320 250 L 290 260 C 280 230, 270 200, 260 180 Z",
    z_index: 2,
    defaultFill: "#f4f4f5"
  },
  {
    id: "seg_bodice",
    label: "Bodice Core",
    points: [
      { x: 140, y: 180 },
      { x: 260, y: 180 },
      { x: 245, y: 270 },
      { x: 155, y: 270 }
    ],
    svg_path: "M 140 180 L 260 180 L 245 270 L 155 270 Z",
    z_index: 1,
    defaultFill: "#e4e4e7"
  },
  {
    id: "seg_skirt",
    label: "Flowing Skirt",
    points: [
      { x: 155, y: 270 },
      { x: 245, y: 270 },
      { x: 280, y: 370, isControl: true },
      { x: 300, y: 470 },
      { x: 200, y: 485, isControl: true },
      { x: 100, y: 470 },
      { x: 120, y: 370, isControl: true },
      { x: 155, y: 270 }
    ],
    svg_path: "M 155 270 L 245 270 C 280 370, 300 470, 300 470 C 200 485, 100 470, 100 470 C 120 370, 155 270, 155 270 Z",
    z_index: 1,
    defaultFill: "#d4d4d8"
  }
];

// Default segments for Skirt (Mock Fallback)
const DEFAULT_SKIRT_SEGMENTS = [
  {
    id: "seg_waistband",
    label: "Waistband",
    points: [
      { x: 160, y: 200 },
      { x: 240, y: 200 },
      { x: 235, y: 220 },
      { x: 165, y: 220 }
    ],
    svg_path: "M 160 200 L 240 200 L 235 220 L 165 220 Z",
    z_index: 2,
    defaultFill: "#e4e4e7"
  },
  {
    id: "seg_skirt_body",
    label: "Skirt Body",
    points: [
      { x: 165, y: 220 },
      { x: 235, y: 220 },
      { x: 260, y: 310, isControl: true },
      { x: 280, y: 410 },
      { x: 200, y: 420, isControl: true },
      { x: 120, y: 410 },
      { x: 140, y: 310, isControl: true },
      { x: 165, y: 220 }
    ],
    svg_path: "M 165 220 L 235 220 C 260 310, 280 410, 280 410 C 200 420, 120 410, 120 410 C 140 310, 165 220, 165 220 Z",
    z_index: 1,
    defaultFill: "#d4d4d8"
  }
];

const DEFAULT_MINT_GOWN = [
  {
    id: "seg_collar",
    label: "Frill Ruffled Neck",
    points: [
      { x: 150, y: 140 },
      { x: 250, y: 140 },
      { x: 240, y: 160 },
      { x: 160, y: 160 }
    ],
    svg_path: "M 150 140 L 250 140 L 240 160 L 160 160 Z",
    z_index: 3,
    defaultFill: "#e6f4ea"
  },
  {
    id: "seg_bodice",
    label: "Fitted Bodice",
    points: [
      { x: 160, y: 160 },
      { x: 240, y: 160 },
      { x: 230, y: 260 },
      { x: 170, y: 260 }
    ],
    svg_path: "M 160 160 L 240 160 L 230 260 L 170 260 Z",
    z_index: 2,
    defaultFill: "#d1e7dd"
  },
  {
    id: "seg_skirt",
    label: "Long Column Skirt",
    points: [
      { x: 170, y: 260 },
      { x: 230, y: 260 },
      { x: 235, y: 480 },
      { x: 165, y: 480 }
    ],
    svg_path: "M 170 260 L 230 260 L 235 480 L 165 480 Z",
    z_index: 1,
    defaultFill: "#a3cfbb"
  }
];

const DEFAULT_ASYMMETRIC_SUIT = [
  {
    id: "seg_wrap_top",
    label: "Asymmetric Wrap Top",
    points: [
      { x: 150, y: 185 },
      { x: 250, y: 185 },
      { x: 230, y: 265 },
      { x: 170, y: 265 }
    ],
    svg_path: "M 150 185 L 250 185 L 230 265 L 170 265 Z",
    z_index: 2,
    defaultFill: "#d1ecf1"
  },
  {
    id: "seg_trousers_l",
    label: "Left Wide Leg Trouser",
    points: [
      { x: 170, y: 265 },
      { x: 200, y: 265 },
      { x: 180, y: 485 },
      { x: 130, y: 485 }
    ],
    svg_path: "M 170 265 L 200 265 L 180 485 L 130 485 Z",
    z_index: 1,
    defaultFill: "#cff4fc"
  },
  {
    id: "seg_trousers_r",
    label: "Right Wide Leg Trouser",
    points: [
      { x: 200, y: 265 },
      { x: 230, y: 265 },
      { x: 270, y: 485 },
      { x: 220, y: 485 }
    ],
    svg_path: "M 200 265 L 230 265 L 270 485 L 220 485 Z",
    z_index: 1,
    defaultFill: "#cff4fc"
  }
];

const DEFAULT_YELLOW_PEPLUM = [
  {
    id: "seg_top",
    label: "Mock Collar Top",
    points: [
      { x: 160, y: 160 },
      { x: 240, y: 160 },
      { x: 230, y: 260 },
      { x: 170, y: 260 }
    ],
    svg_path: "M 160 160 L 240 160 L 230 260 L 170 260 Z",
    z_index: 2,
    defaultFill: "#fff3cd"
  },
  {
    id: "seg_peplum",
    label: "Waist Peplum Flounce",
    points: [
      { x: 170, y: 260 },
      { x: 230, y: 260 },
      { x: 250, y: 300 },
      { x: 150, y: 300 }
    ],
    svg_path: "M 170 260 L 230 260 L 250 300 L 150 300 Z",
    z_index: 3,
    defaultFill: "#ffe69c"
  },
  {
    id: "seg_skirt",
    label: "Pencil Skirt Blueprint",
    points: [
      { x: 180, y: 300 },
      { x: 220, y: 300 },
      { x: 240, y: 485 },
      { x: 160, y: 485 }
    ],
    svg_path: "M 180 300 L 220 300 L 240 485 L 160 485 Z",
    z_index: 1,
    defaultFill: "#fff3cd"
  }
];

const DEFAULT_ORANGE_COLUMN_GOWN = [
  {
    id: "seg_sleeve_l",
    label: "Puff Balloon Left Sleeve",
    points: [
      { x: 140, y: 180 },
      { x: 110, y: 200, isControl: true },
      { x: 110, y: 250, isControl: true },
      { x: 140, y: 270 },
      { x: 150, y: 250 },
      { x: 145, y: 220, isControl: true },
      { x: 145, y: 190, isControl: true },
      { x: 140, y: 180 }
    ],
    svg_path: "M 140 180 C 110 200, 110 250, 140 270 L 150 250 Z",
    z_index: 2,
    defaultFill: "#f8d7da"
  },
  {
    id: "seg_sleeve_r",
    label: "Puff Balloon Right Sleeve",
    points: [
      { x: 260, y: 180 },
      { x: 290, y: 200, isControl: true },
      { x: 290, y: 250, isControl: true },
      { x: 260, y: 270 },
      { x: 250, y: 250 },
      { x: 255, y: 220, isControl: true },
      { x: 255, y: 190, isControl: true },
      { x: 260, y: 180 }
    ],
    svg_path: "M 260 180 C 290 200, 290 250, 260 270 L 250 250 Z",
    z_index: 2,
    defaultFill: "#f8d7da"
  },
  {
    id: "seg_column_body",
    label: "Balloon Sleeve Column Body",
    points: [
      { x: 150, y: 180 },
      { x: 250, y: 180 },
      { x: 235, y: 485 },
      { x: 165, y: 485 }
    ],
    svg_path: "M 150 180 L 250 180 L 235 485 L 165 485 Z",
    z_index: 1,
    defaultFill: "#f5c2c7"
  }
];

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const body = await request.json().catch(() => ({}));
    const { sketchUrl, template = "Gown" } = body;

    console.log(`Forwarding process-sketch query to Render backend: template=${template}`);

    // Try routing to FastAPI endpoints
    try {
      let response = await fetch(`${BACKEND_URL}/api/process-sketch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authHeader ? { "Authorization": authHeader } : {})
        },
        body: JSON.stringify({ sketchUrl, template })
      });

      // Try fallback to root route if /api/ not found
      if (response.status === 404) {
        response = await fetch(`${BACKEND_URL}/process-sketch`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(authHeader ? { "Authorization": authHeader } : {})
          },
          body: JSON.stringify({ sketchUrl, template })
        });
      }

      if (response.ok) {
        const data = await response.json();
        console.log("Successfully processed sketch using Render FastAPI backend:", data);
        return NextResponse.json(data);
      }
      
      console.warn(`Render backend failed with status ${response.status}. Invoking sandbox fallback...`);
    } catch (networkError) {
      console.warn("Render backend is currently offline or unreachable. Running sandbox fallback...", networkError);
    }

    // fallback simulation
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    let activeSegments = DEFAULT_GOWN_SEGMENTS;
    const cleanTemplate = template?.toLowerCase() || "";
    if (cleanTemplate === "skirt") {
      activeSegments = DEFAULT_SKIRT_SEGMENTS;
    } else if (cleanTemplate === "mint gown") {
      activeSegments = DEFAULT_MINT_GOWN;
    } else if (cleanTemplate === "asymmetric suit") {
      activeSegments = DEFAULT_ASYMMETRIC_SUIT;
    } else if (cleanTemplate === "yellow peplum") {
      activeSegments = DEFAULT_YELLOW_PEPLUM;
    } else if (cleanTemplate === "orange column gown") {
      activeSegments = DEFAULT_ORANGE_COLUMN_GOWN;
    }
    
    return NextResponse.json({
      success: true,
      projectId: "proj_" + Math.random().toString(36).substr(2, 9),
      templateName: template,
      sketchUrl: sketchUrl || null,
      segments: activeSegments,
      _fallback: true
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

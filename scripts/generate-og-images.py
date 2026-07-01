#!/usr/bin/env python3
"""Generate static Open Graph cards for Samsar docs pages."""

from pathlib import Path
from shutil import copyfile

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "static" / "img" / "og"
LEGACY_CARD = ROOT / "static" / "img" / "samsar-social-card.png"

WIDTH = 1200
HEIGHT = 630

FONT_CANDIDATES = [
    Path("/Library/Fonts/Inter.ttf"),
    Path("/System/Library/Fonts/HelveticaNeue.ttc"),
    Path("/System/Library/Fonts/Supplemental/Arial Bold.ttf"),
    Path("/System/Library/Fonts/Supplemental/Arial.ttf"),
]

PAGES = [
    {
        "file": "samsar-docs-overview.png",
        "title": "SamsarOne API Docs",
        "description": "Unified generative APIs for video, image, chat, assistants, credits, and external-user workflows.",
        "route": "/intro",
        "eyebrow": "Docs landing",
    },
    {
        "file": "login-tokens.png",
        "title": "Login Tokens",
        "description": "Mint short-lived login tokens and exchange them for client auth tokens in Samsar applications.",
        "route": "/login-tokens",
        "eyebrow": "Authentication",
    },
    {
        "file": "video-api.png",
        "title": "Video API",
        "description": "Generate, translate, join, clone, and customize videos through SamsarOne's credit-aware video endpoints.",
        "route": "/video",
        "eyebrow": "Media generation",
    },
    {
        "file": "image-api.png",
        "title": "Image API",
        "description": "Enhance, edit, white-label, validate receipts, and manage generated image sets with image endpoints.",
        "route": "/image-api",
        "eyebrow": "Image operations",
    },
    {
        "file": "chat-api.png",
        "title": "Chat API",
        "description": "Improve copy and manage embeddings with synchronous chat endpoints for app and content workflows.",
        "route": "/chat-api",
        "eyebrow": "Text and embeddings",
    },
    {
        "file": "assistant-api.png",
        "title": "Assistant API",
        "description": "Call OpenAI-compatible assistant completions tied to Samsar sessions, prompts, and multimodal outputs.",
        "route": "/assistant-api",
        "eyebrow": "Assistant completions",
    },
    {
        "file": "credits-api.png",
        "title": "Credits API",
        "description": "Check balances, create recharge links, and manage auto-recharge controls through the credits API.",
        "route": "/credits",
        "eyebrow": "Billing",
    },
    {
        "file": "publications-api.png",
        "title": "Publications API",
        "description": "Publish, edit, and revoke completed Samsar video sessions on the public feed through free routes.",
        "route": "/publications",
        "eyebrow": "Publishing",
    },
    {
        "file": "external-users-api.png",
        "title": "External Users API",
        "description": "Attribute shared Samsar usage to external platform users with scoped credits, login tokens, and request history.",
        "route": "/external-users",
        "eyebrow": "External platforms",
    },
    {
        "file": "v2-api.png",
        "title": "V2 API",
        "description": "Use additive v2 routes that unify internal, app-key, and external-user clients across media and account workflows.",
        "route": "/v2",
        "eyebrow": "Omni routes",
    },
]


def font(size, bold=False):
    for path in FONT_CANDIDATES:
        if path.exists():
            try:
                return ImageFont.truetype(str(path), size=size, index=0)
            except OSError:
                continue
    return ImageFont.load_default(size=size)


def hex_to_rgb(value):
    value = value.lstrip("#")
    return tuple(int(value[i : i + 2], 16) for i in (0, 2, 4))


def lerp(a, b, t):
    return int(a + (b - a) * t)


def draw_vertical_gradient(image, top, bottom):
    pixels = image.load()
    top_rgb = hex_to_rgb(top)
    bottom_rgb = hex_to_rgb(bottom)
    for y in range(HEIGHT):
        t = y / (HEIGHT - 1)
        color = tuple(lerp(top_rgb[i], bottom_rgb[i], t) for i in range(3))
        for x in range(WIDTH):
            pixels[x, y] = color


def glow(base, bbox, color, blur):
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    draw.ellipse(bbox, fill=color)
    layer = layer.filter(ImageFilter.GaussianBlur(blur))
    base.alpha_composite(layer)


def rounded_shadow(base, xy, radius, shadow_color, blur=18, offset=(0, 12)):
    x0, y0, x1, y1 = xy
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    shifted = (x0 + offset[0], y0 + offset[1], x1 + offset[0], y1 + offset[1])
    draw.rounded_rectangle(shifted, radius=radius, fill=shadow_color)
    layer = layer.filter(ImageFilter.GaussianBlur(blur))
    base.alpha_composite(layer)


def text_size(draw, text, fnt):
    bbox = draw.textbbox((0, 0), text, font=fnt)
    return bbox[2] - bbox[0], bbox[3] - bbox[1]


def draw_spaced_text(draw, xy, text, fnt, fill, spacing=4):
    x, y = xy
    for char in text:
        draw.text((x, y), char, font=fnt, fill=fill)
        char_width = text_size(draw, char, fnt)[0]
        x += char_width + spacing


def spaced_width(draw, text, fnt, spacing=4):
    if not text:
        return 0
    return sum(text_size(draw, char, fnt)[0] for char in text) + spacing * (len(text) - 1)


def wrap_lines(text, fnt, max_width, draw, max_lines=3):
    words = text.split()
    lines = []
    current = ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if text_size(draw, candidate, fnt)[0] <= max_width:
            current = candidate
            continue
        if current:
            lines.append(current)
        current = word
        if len(lines) == max_lines:
            break
    if current and len(lines) < max_lines:
        lines.append(current)
    if len(lines) == max_lines and len(" ".join(lines)) < len(text):
        lines[-1] = lines[-1].rstrip(".,") + "..."
    return lines


def draw_logo(draw, xy):
    x, y = xy
    logo_font = font(24, bold=True)
    primary = "SAMSAR"
    secondary = "DOCS"
    primary_width = spaced_width(draw, primary, logo_font)
    secondary_width = spaced_width(draw, secondary, logo_font)
    pill_width = primary_width + secondary_width + 72
    pill_height = 58
    draw.rounded_rectangle(
        (x, y, x + pill_width, y + pill_height),
        radius=13,
        fill=(15, 23, 42),
        outline=(127, 29, 49),
        width=1,
    )
    draw_spaced_text(draw, (x + 24, y + 18), primary, logo_font, (248, 250, 252), spacing=3)
    draw_spaced_text(
        draw,
        (x + 24 + primary_width + 16, y + 18),
        secondary,
        logo_font,
        (254, 205, 211),
        spacing=3,
    )


def draw_badge(draw, text):
    badge_font = font(18, bold=True)
    text = text.upper()
    text_width = spaced_width(draw, text, badge_font, spacing=2)
    x1 = WIDTH - 72
    x0 = x1 - text_width - 36
    y0 = 74
    y1 = 118
    draw.rounded_rectangle(
        (x0, y0, x1, y1),
        radius=22,
        fill=(17, 24, 39),
        outline=(71, 85, 105),
        width=1,
    )
    draw_spaced_text(draw, (x0 + 18, y0 + 12), text, badge_font, (203, 213, 225), spacing=2)


def draw_route_panel(image, draw, route):
    x0, y0, x1, y1 = 770, 176, 1102, 434
    rounded_shadow(image, (x0, y0, x1, y1), 28, (0, 0, 0, 80), blur=22, offset=(0, 16))
    draw.rounded_rectangle(
        (x0, y0, x1, y1),
        radius=28,
        fill=(8, 13, 23),
        outline=(51, 65, 85),
        width=1,
    )
    mono = font(21)
    small = font(16, bold=True)
    draw.rounded_rectangle((x0 + 26, y0 + 24, x0 + 108, y0 + 56), radius=16, fill=(127, 29, 49))
    draw.text((x0 + 43, y0 + 30), "DOCS", font=small, fill=(254, 205, 211))
    draw.text((x0 + 132, y0 + 29), "docs.samsar.one", font=mono, fill=(148, 163, 184))
    draw.text((x0 + 28, y0 + 88), route, font=font(34, bold=True), fill=(248, 250, 252))
    y = y0 + 148
    for width, alpha in [(238, 70), (180, 48), (270, 58)]:
        color = (23 + alpha, 67 + alpha // 2, 86 + alpha // 2)
        draw.rounded_rectangle((x0 + 28, y, x0 + 28 + width, y + 12), radius=6, fill=color)
        y += 31


def render_card(page):
    base_rgb = Image.new("RGB", (WIDTH, HEIGHT), "#070b12")
    draw_vertical_gradient(base_rgb, "#070b12", "#111827")
    image = Image.new("RGBA", (WIDTH, HEIGHT), "#070b12")
    image.alpha_composite(base_rgb.convert("RGBA"))

    glow(image, (-150, -150, 430, 360), (244, 63, 94, 58), 80)
    glow(image, (700, -220, 1390, 430), (45, 212, 191, 46), 100)
    glow(image, (560, 380, 1260, 850), (249, 115, 22, 32), 120)

    draw = ImageDraw.Draw(image)
    for x in range(0, WIDTH, 44):
        draw.line((x, 0, x, HEIGHT), fill=(21, 29, 43), width=1)
    for y in range(0, HEIGHT, 44):
        draw.line((0, y, WIDTH, y), fill=(19, 27, 39), width=1)

    draw.rounded_rectangle((38, 38, WIDTH - 38, HEIGHT - 38), radius=34, outline=(42, 52, 69), width=1)
    draw_logo(draw, (72, 58))
    draw_badge(draw, page["eyebrow"])

    title_font = font(74 if len(page["title"]) < 20 else 64, bold=True)
    desc_font = font(31)
    eyebrow_font = font(19, bold=True)

    draw.text((78, 174), "API DOCUMENTATION", font=eyebrow_font, fill=(251, 113, 133))

    title_lines = wrap_lines(page["title"], title_font, 660, draw, max_lines=2)
    title_y = 214
    for line in title_lines:
        draw.text((76, title_y), line, font=title_font, fill=(248, 250, 252))
        title_y += 78

    desc_y = title_y + 14
    for line in wrap_lines(page["description"], desc_font, 680, draw, max_lines=3):
        draw.text((80, desc_y), line, font=desc_font, fill=(203, 213, 225))
        desc_y += 43

    draw_route_panel(image, draw, page["route"])

    footer_font = font(22, bold=True)
    mono = font(22)
    draw.rounded_rectangle((72, 520, 420, 572), radius=17, fill=(15, 23, 42), outline=(51, 65, 85), width=1)
    draw.text((96, 534), "docs.samsar.one", font=footer_font, fill=(248, 250, 252))
    draw.text((438, 535), page["route"], font=mono, fill=(125, 211, 252))

    return image.convert("RGB")


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for page in PAGES:
        render_card(page).save(OUT_DIR / page["file"], optimize=True)
    copyfile(OUT_DIR / "samsar-docs-overview.png", LEGACY_CARD)
    print(f"Generated {len(PAGES)} OG cards in {OUT_DIR}")


if __name__ == "__main__":
    main()

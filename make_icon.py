from PIL import Image, ImageDraw, ImageFont

def draw_gear(draw, cx, cy, radius, teeth, tooth_depth, color):
    import math
    points = []
    for i in range(teeth * 2):
        angle = i * math.pi / teeth
        r = radius if i % 2 == 0 else radius - tooth_depth
        
        # Add slight width to the tooth
        angle_offset = (math.pi / teeth) * 0.2
        
        points.append((
            cx + r * math.cos(angle - angle_offset),
            cy + r * math.sin(angle - angle_offset)
        ))
        points.append((
            cx + r * math.cos(angle + angle_offset),
            cy + r * math.sin(angle + angle_offset)
        ))
    draw.polygon(points, fill=color)

size = 512
img = Image.new('RGB', (size, size), '#0f172a') # dark blue bg
draw = ImageDraw.Draw(img)

# Draw a gear
draw_gear(draw, size/2, size/2, 200, 8, 40, '#0ea5e9') # sky blue

# Draw inner hole
draw.ellipse(
    [(size/2 - 80, size/2 - 80), (size/2 + 80, size/2 + 80)],
    fill='#0f172a'
)

# Draw a stylized thread or ruler symbol inside
draw.rectangle(
    [(size/2 - 40, size/2 - 40), (size/2 + 40, size/2 + 40)],
    outline='#f59e0b', width=16 # amber
)

img.save('assets/icons/app-icon-512x512.png')

# 192x192
img_192 = img.resize((192, 192), Image.Resampling.LANCZOS)
img_192.save('assets/icons/app-icon-192x192.png')

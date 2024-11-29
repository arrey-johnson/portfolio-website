from PIL import Image, ImageDraw
import io

def create_base_image(size, bg_color=(0, 184, 148, 255), corner_radius_ratio=0.2):
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Draw rounded rectangle background
    corner_radius = int(size * corner_radius_ratio)
    draw.rounded_rectangle([0, 0, size-1, size-1], corner_radius, fill=bg_color)
    
    return img, draw

def draw_code_brackets(img, draw, scale=1):
    size = img.width
    bracket_color = (255, 255, 255, 255)
    line_width = max(1, int(size * 0.06))
    
    # Calculate positions based on image size
    start_y = size * 0.25
    spacing = size * 0.2
    bracket_width = size * 0.4
    
    for i in range(3):
        y = start_y + (i * spacing)
        # Left bracket
        draw.line([(size*0.3, y), (size*0.5, y + spacing*0.8)], 
                 fill=bracket_color, width=line_width)
        # Right bracket
        draw.line([(size*0.7, y), (size*0.5, y + spacing*0.8)],
                 fill=bracket_color, width=line_width)

# Generate favicon sizes
sizes = [16, 32, 48, 64, 128, 256]
favicon_images = []

for size in sizes:
    img, draw = create_base_image(size)
    draw_code_brackets(img, draw)
    favicon_images.append(img)

# Save as ICO with multiple sizes
favicon_images[0].save('favicon.ico', format='ICO', sizes=[(s,s) for s in sizes], append_images=favicon_images[1:])

# Generate PNG versions for different devices
for size in sizes:
    img, draw = create_base_image(size)
    draw_code_brackets(img, draw)
    img.save(f'favicon-{size}x{size}.png', 'PNG')

# Create social preview image (1200x630)
preview_width = 1200
preview_height = 630
preview = Image.new('RGB', (preview_width, preview_height), (45, 55, 72))  # Dark background
draw = ImageDraw.Draw(preview)

# Create logo section
logo_size = 200
logo_img, logo_draw = create_base_image(logo_size)
draw_code_brackets(logo_img, logo_draw)

# Paste logo
logo_x = (preview_width - logo_size) // 2
logo_y = (preview_height - logo_size) // 2 - 50
preview.paste(logo_img, (logo_x, logo_y), logo_img)

# Save social preview
preview.save('social-preview.png', 'PNG', quality=95)

print("Generated all favicon sizes and social preview image successfully!")

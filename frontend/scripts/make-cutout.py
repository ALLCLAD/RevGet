from PIL import Image
import collections

def clean_cutout(input_path, output_path):
    im = Image.open(input_path).convert("RGBA")
    width, height = im.size
    pixels = im.load()
    
    # 1. BFS Flood fill starting from all 4 borders
    visited = set()
    queue = collections.deque()
    
    for x in range(width):
        queue.append((x, 0))
        queue.append((x, height - 1))
        visited.add((x, 0))
        visited.add((x, height - 1))
        
    for y in range(height):
        queue.append((0, y))
        queue.append((width - 1, y))
        visited.add((0, y))
        visited.add((width - 1, y))
        
    is_outer = [[False]*height for _ in range(width)]
    
    def is_bg_like(r, g, b):
        # A pixel is background candidate if brightness > 150 and low color saturation
        diff = max(r, g, b) - min(r, g, b)
        return min(r, g, b) > 150 and diff < 20

    while queue:
        x, y = queue.popleft()
        r, g, b, a = pixels[x, y]
        
        if is_bg_like(r, g, b):
            is_outer[x][y] = True
            for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                nx, ny = x + dx, y + dy
                if 0 <= nx < width and 0 <= ny < height:
                    if (nx, ny) not in visited:
                        visited.add((nx, ny))
                        nr, ng, nb, _ = pixels[nx, ny]
                        if is_bg_like(nr, ng, nb):
                            queue.append((nx, ny))

    # 2. Assign alpha cleanly
    for x in range(width):
        for y in range(height):
            r, g, b, a = pixels[x, y]
            if is_outer[x][y]:
                brightness = (r + g + b) / 3.0
                if brightness >= 242:
                    # Clean 100% transparent background
                    pixels[x, y] = (0, 0, 0, 0)
                elif brightness > 160:
                    # Soft natural ground shadow
                    # Normalize between 160 (dense shadow) and 242 (fade out to 0)
                    t = (242 - brightness) / (242 - 160) # 0.0 at 242, 1.0 at 160
                    alpha = int(140 * (t ** 1.5))
                    pixels[x, y] = (20, 20, 20, max(0, min(140, alpha)))
                else:
                    pixels[x, y] = (r, g, b, 255)
            else:
                # Inside object
                pixels[x, y] = (r, g, b, 255)

    im.save(output_path, "PNG")
    print(f"Refined cutout saved: {output_path}")

clean_cutout(
    r"C:\Users\charo\.gemini\antigravity-cli\brain\81be5f93-c2ea-4ab8-b4b0-b70ba9216f15\hero_1794905322067.jpg",
    r"C:\pratique\Revget\frontend\public\hero.png"
)

clean_cutout(
    r"C:\Users\charo\.gemini\antigravity-cli\brain\81be5f93-c2ea-4ab8-b4b0-b70ba9216f15\showcase_1794905341152.jpg",
    r"C:\pratique\Revget\frontend\public\showcase.png"
)

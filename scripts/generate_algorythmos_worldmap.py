import geopandas as gpd
import matplotlib.pyplot as plt

# Download Natural Earth data directly (110m resolution for smaller file)
url = "https://naciscdn.org/naturalearth/110m/cultural/ne_110m_admin_0_countries.zip"
world = gpd.read_file(url)

# Drop Antarctica so it looks cleaner
world = world[world["NAME"] != "Antarctica"]

# Create a wide figure (same feel as contact page card)
fig, ax = plt.subplots(figsize=(16, 9), dpi=300)

# Brand colours
land_color = "#a78bfa"      # Algorythmos purple
edge_color = "#1e1b4b"      # indigo-950 for edges
bg_color = "#020617"        # slate-950 background

fig.patch.set_facecolor(bg_color)
ax.set_facecolor(bg_color)

# Draw continents
world.plot(
    ax=ax,
    color=land_color,
    edgecolor=edge_color,
    linewidth=0.4,
)

# Remove axes / margins
ax.set_axis_off()
plt.margins(0)

# Save as SVG for React
output = "../public/media/maps/algorythmos_worldmap.svg"
plt.savefig(output, format="svg", bbox_inches="tight", pad_inches=0)
plt.close()

print(f"Saved SVG to: {output}")

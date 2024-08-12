import numpy as np
import matplotlib.pyplot as plt
from matplotlib.colors import LightSource

# Hard-coded coordinates for PNW cities (longitude, latitude)
cities = {
    "Seattle, WA": (-122.3321, 47.6062),
    "Portland, OR": (-122.6789, 45.5155),
    "Vancouver, BC": (-123.1207, 49.2827),
    "Spokane, WA": (-117.4260, 47.6588),
    "Eugene, OR": (-123.0868, 44.0521),
    "Bellingham, WA": (-122.4787, 48.7519),
    "Tacoma, WA": (-122.4443, 47.2529),
    "Boise, ID": (-116.2023, 43.6150),
    "Walla Walla, WA": (-118.3430, 46.0646),
    "Salem, OR": (-123.0351, 44.9429)
}

def find_central_point(locations):
    return np.mean(list(locations.values()), axis=0)

def calculate_distances(central_point, locations):
    distances = {}
    for city, coords in locations.items():
        dist = np.sqrt((coords[0] - central_point[0])**2 + (coords[1] - central_point[1])**2)
        distances[city] = dist * 69  # Rough conversion to miles (1 degree ≈ 69 miles)
    return distances

def create_map_with_basic_terrain(cities, central_point):
    fig, ax = plt.subplots(figsize=(15, 10))
    
    # Create a grid for the terrain
    x = np.linspace(-124, -116, 100)
    y = np.linspace(43, 50, 100)
    X, Y = np.meshgrid(x, y)
    
    # Create a simple terrain-like surface
    Z = np.sin(X/3) * np.cos(Y/3) + np.random.rand(100, 100) * 0.1
    
    # Use LightSource to create shading
    ls = LightSource(azdeg=315, altdeg=45)
    rgb = ls.shade(Z, plt.cm.terrain, vert_exag=0.3, blend_mode='soft')
    
    # Plot the terrain
    ax.imshow(rgb, extent=[-124, -116, 43, 50], aspect='equal')
    
    # Plot cities
    for city, (lon, lat) in cities.items():
        ax.plot(lon, lat, 'bo', markersize=8)
        ax.annotate(city, (lon, lat), xytext=(3, 3), textcoords="offset points", fontsize=8, color='black', fontweight='bold')
    
    # Plot central point
    ax.plot(central_point[0], central_point[1], 'ro', markersize=10)
    ax.annotate('Central Point', (central_point[0], central_point[1]), xytext=(3, 3), textcoords="offset points", fontsize=10, color='red', fontweight='bold')
    
    # Draw lines from cities to central point
    for _, (lon, lat) in cities.items():
        ax.plot([lon, central_point[0]], [lat, central_point[1]], 'r-', alpha=0.3)
    
    ax.set_xlim(-124, -116)
    ax.set_ylim(43, 50)
    ax.set_title('PNW Cities and Central Meeting Point (with Basic Terrain)', fontsize=16)
    plt.tight_layout()
    plt.savefig('central_meeting_map_basic_terrain.png', dpi=300, bbox_inches='tight')
    print("Map with basic terrain has been saved as 'central_meeting_map_basic_terrain.png'")

# Find the central point
central_point = find_central_point(cities)

# Calculate distances
distances = calculate_distances(central_point, cities)

# Print results
print(f"The central meeting point coordinates are: {central_point}")
print("\nDistances from each city to the central point:")
for city, dist in distances.items():
    print(f"{city}: {dist:.2f} miles")

# Create and save the map with basic terrain
create_map_with_basic_terrain(cities, central_point)
import os
from pathlib import Path
from PIL import Image

def convert_to_webp(directory):
    # Extensions to search for
    extensions = {'.jpg', '.jpeg', '.png'}
    
    count = 0
    saved_space = 0
    
    # Walk through directory
    for root, dirs, files in os.walk(directory):
        for file in files:
            file_path = Path(root) / file
            
            # Check if it's an image we want to convert
            if file_path.suffix.lower() in extensions:
                try:
                    # Create new path with .webp extension
                    webp_path = file_path.with_suffix('.webp')
                    
                    # Open and convert
                    with Image.open(file_path) as img:
                        # Convert to RGB if necessary (e.g. for PNGs with transparency)
                        if img.mode in ('RGBA', 'LA'):
                            # Keep transparency for PNGs
                            pass
                        else:
                            img = img.convert('RGB')
                        
                        # Save as WebP
                        img.save(webp_path, 'WEBP', quality=80)
                        
                        original_size = file_path.stat().st_size
                        new_size = webp_path.stat().st_size
                        saved = original_size - new_size
                        
                        print(f"Converted: {file}")
                        print(f"  Old: {original_size/1024:.1f}KB -> New: {new_size/1024:.1f}KB")
                        print(f"  Saved: {saved/1024:.1f}KB")
                        print("-" * 30)
                        
                        saved_space += saved
                        count += 1
                        
                except Exception as e:
                    print(f"Error converting {file}: {e}")

    print(f"\nTotal images converted: {count}")
    print(f"Total space saved: {saved_space/1024/1024:.2f} MB")

if __name__ == "__main__":
    import sys
    print("Starting conversion...")
    
    directory = "assets"
    if len(sys.argv) > 1:
        directory = sys.argv[1]
        
    # Install Pillow if needed: pip install Pillow
    try:
        import PIL
        convert_to_webp(directory)
    except ImportError:
        print("Error: Pillow library not found.")
        print("Please run: pip install Pillow")

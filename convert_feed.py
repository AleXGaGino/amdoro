import csv
import json
import os

def convert_feed_to_json(input_file='feed.csv', output_file='data/products.json'):
    """
    Convert 2Performant CSV feed to JSON format.
    
    Args:
        input_file: Path to the CSV feed file
        output_file: Path to the output JSON file
    """
    products = []
    skipped_count = 0
    
    try:
        # Open and read the CSV file
        with open(input_file, 'r', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            
            for index, row in enumerate(reader, start=1):
                # Handle missing image URL
                image_url = row.get('Image_URL', '').strip()
                if not image_url:
                    print(f"Warning: Product at row {index} is missing Image_URL. Using placeholder.")
                    image_url = 'https://via.placeholder.com/400x400?text=No+Image'
                    skipped_count += 1
                
                # Extract and clean data
                title = row.get('Title', 'Unknown Product').strip()
                price_str = row.get('Price', '0').strip()
                url = row.get('URL', '').strip()
                category = row.get('Category', 'Other').strip()
                
                # Parse price (handle various formats)
                try:
                    # Remove currency symbols and whitespace
                    price_clean = price_str.replace('RON', '').replace('Lei', '').replace(',', '.').strip()
                    price = float(price_clean)
                except (ValueError, AttributeError):
                    print(f"Warning: Invalid price '{price_str}' at row {index}. Setting to 0.0")
                    price = 0.0
                
                # Create product object
                product = {
                    "id": index,
                    "title": title,
                    "price": price,
                    "imageURL": image_url,
                    "category": category,
                    "affiliateLink": url
                }
                
                products.append(product)
        
        # Create output directory if it doesn't exist
        os.makedirs(os.path.dirname(output_file), exist_ok=True)
        
        # Write to JSON file
        with open(output_file, 'w', encoding='utf-8') as jsonfile:
            json.dump(products, jsonfile, indent=2, ensure_ascii=False)
        
        print(f"\nConversion completed successfully!")
        print(f"Total products processed: {len(products)}")
        print(f"Products with missing images: {skipped_count}")
        print(f"Output saved to: {output_file}")
        
    except FileNotFoundError:
        print(f"Error: File '{input_file}' not found.")
        print("Please make sure the feed.csv file exists in the same directory as this script.")
    except KeyError as e:
        print(f"Error: Missing required column in CSV: {e}")
        print("Required columns: Title, Price, URL, Image_URL, Category")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

if __name__ == "__main__":
    convert_feed_to_json()

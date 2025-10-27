import os
import httpx
from typing import List, Optional
from pydantic import BaseModel


class USDAFoodData(BaseModel):
    name: str
    calories: float
    protein: float
    carbs: float
    fat: float
    external_id: str
    source: str = "USDA"


async def search_usda_foods(query: str, page_size: int = 10) -> List[USDAFoodData]:
    """
    Search USDA FoodData Central API for foods.
    
    Args:
        query: Search term
        page_size: Number of results to return
        
    Returns:
        List of USDAFoodData objects with normalized nutritional data
    """
    api_key = os.getenv("USDA_API_KEY")
    if not api_key:
        return []
    
    url = "https://api.nal.usda.gov/fdc/v1/foods/search"
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                url,
                params={
                    "query": query,
                    "pageSize": page_size,
                    "api_key": api_key,
                    "dataType": ["Foundation", "Branded", "SR Legacy"]  # Focus on quality data
                },
                timeout=10.0
            )
            response.raise_for_status()
            data = response.json()
            
            foods = []
            for food_item in data.get("foods", []):
                try:
                    # Extract food name
                    name = food_item.get("description", "Unknown")
                    
                    # Extract nutrients
                    nutrients = food_item.get("foodNutrients", [])
                    nutrient_map = {item.get("nutrientName"): item.get("value", 0) for item in nutrients if item.get("value")}
                    
                    # Map USDA nutrients to our format (per 100g)
                    calories = nutrient_map.get("Energy", 0)
                    protein = nutrient_map.get("Protein", 0)
                    carbs = nutrient_map.get("Carbohydrate, by difference", 0)
                    fat = nutrient_map.get("Total lipid (fat)", 0)
                    
                    # Only include foods with valid data
                    if name and calories > 0:
                        foods.append(USDAFoodData(
                            name=name,
                            calories=calories,
                            protein=protein,
                            carbs=carbs,
                            fat=fat,
                            external_id=str(food_item.get("fdcId", "")),
                            source="USDA"
                        ))
                except Exception as e:
                    # Skip foods that can't be parsed
                    print(f"Error parsing food item: {e}")
                    continue
            
            return foods
            
    except httpx.HTTPError as e:
        print(f"USDA API error: {e}")
        return []
    except Exception as e:
        print(f"Unexpected error in USDA search: {e}")
        return []


from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn

app = FastAPI(title="Inventory API")

# Add CORS middleware to allow React frontend to access the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class Item(BaseModel):
    id: int
    name: str
    description: str
    quantity: int
    price: float
    category: str

class ItemCreate(BaseModel):
    name: str
    description: str
    quantity: int
    price: float
    category: str

class ItemUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    quantity: Optional[int] = None
    price: Optional[float] = None
    category: Optional[str] = None

class QuantityAdjustment(BaseModel):
    quantity_change: int

# Mock database - in-memory storage
mock_inventory = {
    1: {"id": 1, "name": "Laptop", "description": "Dell XPS 15", "quantity": 5, "price": 1299.99, "category": "Electronics"},
    2: {"id": 2, "name": "Mouse", "description": "Wireless Mouse", "quantity": 25, "price": 29.99, "category": "Accessories"},
    3: {"id": 3, "name": "Keyboard", "description": "Mechanical Keyboard", "quantity": 15, "price": 89.99, "category": "Accessories"},
    4: {"id": 4, "name": "Monitor", "description": "4K Ultra HD Monitor", "quantity": 8, "price": 399.99, "category": "Electronics"},
    5: {"id": 5, "name": "USB-C Cable", "description": "Fast Charging Cable", "quantity": 50, "price": 12.99, "category": "Cables"},
}

next_id = 6

# Routes

@app.get("/")
async def root():
    return {"message": "Inventory API", "version": "1.0"}

@app.get("/items", response_model=List[Item])
async def get_all_items():
    """Get all inventory items"""
    return list(mock_inventory.values())

@app.get("/items/{item_id}", response_model=Item)
async def get_item(item_id: int):
    """Get a specific item by ID"""
    if item_id not in mock_inventory:
        return {"error": "Item not found"}, 404
    return mock_inventory[item_id]

@app.get("/categories")
async def get_categories():
    """Get all unique categories"""
    categories = set(item["category"] for item in mock_inventory.values())
    return {"categories": sorted(list(categories))}

@app.get("/search")
async def search_items(q: str = "", category: Optional[str] = None):
    """Search items by name or filter by category"""
    results = mock_inventory.values()
    
    if q:
        results = [item for item in results if q.lower() in item["name"].lower() or q.lower() in item["description"].lower()]
    
    if category:
        results = [item for item in results if item["category"] == category]
    
    return list(results)

@app.post("/items", response_model=Item)
async def create_item(item: ItemCreate):
    """Create a new inventory item"""
    global next_id
    new_item = {
        "id": next_id,
        "name": item.name,
        "description": item.description,
        "quantity": item.quantity,
        "price": item.price,
        "category": item.category,
    }
    mock_inventory[next_id] = new_item
    next_id += 1
    return new_item

@app.put("/items/{item_id}", response_model=Item)
async def update_item(item_id: int, item_update: ItemUpdate):
    """Update an existing inventory item"""
    if item_id not in mock_inventory:
        return {"error": "Item not found"}, 404
    
    existing_item = mock_inventory[item_id]
    update_data = item_update.dict(exclude_unset=True)
    updated_item = {**existing_item, **update_data}
    mock_inventory[item_id] = updated_item
    return updated_item

@app.delete("/items/{item_id}")
async def delete_item(item_id: int):
    """Delete an inventory item"""
    if item_id not in mock_inventory:
        return {"error": "Item not found"}, 404
    
    del mock_inventory[item_id]
    return {"message": f"Item {item_id} deleted successfully"}

@app.post("/items/{item_id}/adjust-quantity")
async def adjust_quantity(item_id: int, payload: QuantityAdjustment):
    """Adjust quantity of an item"""
    if item_id not in mock_inventory:
        raise HTTPException(status_code=404, detail="Item not found")

    new_quantity = mock_inventory[item_id]["quantity"] + payload.quantity_change
    if new_quantity < 0:
        raise HTTPException(status_code=400, detail="Quantity cannot be negative")

    mock_inventory[item_id]["quantity"] = new_quantity
    return mock_inventory[item_id]

@app.get("/stats")
async def get_stats():
    """Get inventory statistics"""
    items = list(mock_inventory.values())
    total_items = sum(item["quantity"] for item in items)
    total_value = sum(item["quantity"] * item["price"] for item in items)
    
    return {
        "total_products": len(items),
        "total_items": total_items,
        "total_value": round(total_value, 2),
        "low_stock_count": len([item for item in items if item["quantity"] < 10])
    }

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)

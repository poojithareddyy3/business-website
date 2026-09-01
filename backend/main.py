from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import psycopg2

load_dotenv()

app = FastAPI()

# Allow frontend to access the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL = os.getenv("DATABASE_URL")


# Home route
@app.get("/")
def home():
    return {
        "message": "Business website API is running!"
    }


# Test database connection
@app.get("/db-test")
def test_database():
    try:
        connection = psycopg2.connect(DATABASE_URL)
        cursor = connection.cursor()

        cursor.execute("SELECT NOW();")
        result = cursor.fetchone()

        cursor.close()
        connection.close()

        return {
            "message": "Database connected successfully!",
            "time": str(result[0])
        }

    except Exception as error:
        return {
            "error": str(error)
        }


# Get all products
@app.get("/products")
def get_products():
    try:
        connection = psycopg2.connect(DATABASE_URL)
        cursor = connection.cursor()

        cursor.execute("""
            SELECT id, name, category, price, description, image_url
            FROM products
            ORDER BY id;
        """)

        products = cursor.fetchall()

        cursor.close()
        connection.close()

        # Convert database rows into product objects
        return [
            {
                "id": product[0],
                "name": product[1],
                "category": product[2],
                "price": product[3],
                "description": product[4],
                "image_url": product[5]
            }
            for product in products
        ]

    except Exception as error:
        return {
            "error": str(error)
        }


# Get one product by ID
@app.get("/products/{product_id}")
def get_product_by_id(product_id: int):
    try:
        connection = psycopg2.connect(DATABASE_URL)
        cursor = connection.cursor()

        cursor.execute("""
            SELECT id, name, category, price, description, image_url
            FROM products
            WHERE id = %s;
        """, (product_id,))

        product = cursor.fetchone()

        cursor.close()
        connection.close()

        if product is None:
            return {
                "message": "Product not found"
            }

        # Convert database row into a product object
        return {
            "id": product[0],
            "name": product[1],
            "category": product[2],
            "price": product[3],
            "description": product[4],
            "image_url": product[5]
        }

    except Exception as error:
        return {
            "error": str(error)
        }
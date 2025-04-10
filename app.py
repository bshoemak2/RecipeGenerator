# app.py
import logging
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_caching import Cache
from concurrent.futures import ThreadPoolExecutor
from recipe_generator import match_predefined_recipe, generate_dynamic_recipe, generate_random_recipe
from helpers import validate_input, calculate_nutrition, generate_share_text
from database import init_db, get_all_recipes
from dotenv import load_dotenv
from fuzzywuzzy import fuzz
import random

load_dotenv()

logging.basicConfig(
    filename='recipe_generator.log',
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s - %(pathname)s:%(lineno)d'
)

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY", "your-secret-key")
CORS(app, resources={
    r"/generate_recipe": {"origins": ["*"], "methods": ["GET", "POST", "OPTIONS"], "allow_headers": ["Content-Type", "Origin"]},
    r"/ingredients": {"origins": ["*"], "methods": ["GET", "OPTIONS"], "allow_headers": ["Content-Type", "Origin"]},
    r"/": {"origins": ["*"], "methods": ["GET"]}
}, supports_credentials=True)

limiter = Limiter(get_remote_address, app=app, default_limits=["100 per day", "10 per minute"], storage_uri="memory://")
cache = Cache(app, config={'CACHE_TYPE': 'simple'})
executor = ThreadPoolExecutor(max_workers=4)

try:
    init_db()
    logging.info("Database initialized successfully")
except Exception as e:
    logging.error(f"Failed to initialize database: {str(e)}")

ALL_RECIPES = get_all_recipes()
logging.debug(f"Loaded {len(ALL_RECIPES)} recipes from database: {ALL_RECIPES}")
if not ALL_RECIPES:
    logging.warning("No recipes found in database; falling back to dynamic generation")

COOKING_METHODS = ["Burn", "Chuck", "Sizzle", "Holler At", "Wrestle", "Smack", "Yeet"]
EQUIPMENT_OPTIONS = ["rusty skillet", "dent dented pot", "old boot", "grandma's flip-flop", "truck hood", "banjo"]
FUNNY_PREFIXES = ["Redneck", "Drunk", "Hillbilly", "Limping Eagle's", "Caveman", "Sassy Granny's", "Bootleg"]
FUNNY_SUFFIXES = ["Pudding", "Surprise", "Mess", "Stew", "Disaster", "Holler", "Slop"]

def score_recipe(recipe, ingredients, preferences):
    score = 0
    if not recipe or 'ingredients' not in recipe:
        return 0
    if ingredients:
        recipe_ingredients = set()
        if recipe['ingredients']:
            if isinstance(recipe['ingredients'][0], (tuple, list)):
                recipe_ingredients = {item for _, item in recipe['ingredients']}
            else:
                recipe_ingredients = set(recipe['ingredients'])
        input_ingredients = set(ingredients)
        for input_ing in input_ingredients:
            best_match = max([fuzz.ratio(input_ing.lower(), r_ing.lower()) for r_ing in recipe_ingredients], default=0)
            score += best_match / 100
    return score

def process_recipe(recipe):
    if not recipe or "error" in recipe or not isinstance(recipe, dict) or 'ingredients' not in recipe:
        logging.debug(f"Invalid recipe object: {recipe}")
        return None
    try:
        language = recipe.get('language', 'english')
        input_ingredients = recipe.get('input_ingredients', recipe.get('ingredients', []))
        method = random.choice(COOKING_METHODS)
        prefix = random.choice(FUNNY_PREFIXES)
        suffix = random.choice(FUNNY_SUFFIXES)
        if recipe['ingredients']:
            if isinstance(recipe['ingredients'][0], (tuple, list)):
                ingredients_list = sorted([f"{qty} {item}" if qty else item for qty, item in recipe['ingredients']], key=lambda x: x.split()[-1])
                nutrition_items = [item for qty, item in recipe['ingredients']]
            else:
                ingredients_list = sorted([str(item) for item in recipe['ingredients']])
                nutrition_items = [item.split()[-1] for item in recipe['ingredients']]
            recipe['ingredients'] = ingredients_list
        else:
            recipe['ingredients'] = []
            nutrition_items = []
        title_items = [ing.capitalize() for ing in input_ingredients] if input_ingredients else [item.split()[-1].capitalize() for item in ingredients_list]
        recipe['title'] = f"{prefix} {method} {' and '.join(title_items[:2])} {suffix}" if title_items else f"{prefix} {method} {suffix}"
        equipment = random.sample(EQUIPMENT_OPTIONS, k=min(3, len(EQUIPMENT_OPTIONS)))
        primary_equipment = equipment[0]
        article = "an" if primary_equipment[0] in 'aeiou' else "a"
        recipe['steps'] = [
            f"Prep: Throw {' and '.join(ingredients_list)} into the fray like a boss.",
            f"Use {article} {primary_equipment} to {method.lower()} the crap outta it—channel your inner chaos.",
            f"Serve it hot, preferably with a side of regret and a cold beer."
        ]
        recipe['equipment'] = equipment
        nutrition_future = executor.submit(calculate_nutrition, nutrition_items) if nutrition_items else None
        recipe['nutrition'] = recipe.get('nutrition', nutrition_future.result() if nutrition_future else {"calories": random.randint(100, 1000)})
        recipe['shareText'] = f"Behold my culinary chaos: {recipe['title']}\nIngredients: {' '.join(ingredients_list)}\nSteps:\n{' '.join(recipe['steps'])}\nCalories: {recipe['nutrition']['calories']} (or enough to regret tomorrow)"
        for key in ['title_en', 'title_es', 'steps_en', 'steps_es', 'cooking_time', 'difficulty', 'servings', 'tips', 'input_ingredients']:
            recipe.pop(key, None)
        return recipe

INGREDIENT_CATEGORIES = {
    "meat": sorted(["groundbeef", "chicken", "pork", "lamb", "pichana", "churrasco", "ribeye steaks"]),
    "vegetables": sorted(["carrot", "broccoli", "onion", "potato"]),
    "fruits": sorted(["apple", "banana", "lemon", "orange"]),
    "seafood": sorted(["salmon", "shrimp", "cod", "tuna", "yellowtail snapper", "grouper", "red snapper", "oysters", "lobster"]),
    "dairy": sorted(["cheese", "milk", "butter", "yogurt", "eggs"]),
    "bread_carbs": sorted(["bread", "pasta", "rice", "tortilla"])
}

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "message": "Welcome to the Chuckle & Chow Recipe API—Where Food Meets Funny!",
        "endpoints": {
            "/ingredients": "GET - Grab some grub options",
            "/generate_recipe": "POST - Cook up a laugh riot (send ingredients and preferences)"
        },
        "status": "cookin’ and jokin’"
    })

@app.route('/ingredients', methods=['GET', 'OPTIONS'])
@limiter.limit("50 per day")
def get_ingredients():
    if request.method == 'OPTIONS':
        return '', 200
    return jsonify(INGREDIENT_CATEGORIES)

@app.route('/generate_recipe', methods=['POST', 'OPTIONS'])
@limiter.limit("10 per minute")
@cache.cached(timeout=3600, key_prefix=lambda: f"recipe_{request.get_json(silent=True).get('preferences', {}).get('isRandom', False)}_{sorted(request.get_json(silent=True).get('ingredients', []))}")
def generate_recipe():
    if request.method == 'OPTIONS':
        return '', 200
    try:
        data = request.get_json(silent=True)
        if not isinstance(data, dict):
            raise ValueError("Invalid JSON payload—did you sneeze on the keyboard?")
        ingredients = data.get('ingredients', [])
        preferences = data.get('preferences', {})
        logging.debug(f"Extracted inputs: ingredients={ingredients}, preferences={preferences}")
        if not isinstance(ingredients, list) or not isinstance(preferences, dict):
            raise ValueError("Ingredients should be a list and preferences a dict, you culinary rebel!")
        language = preferences.get('language', 'english').lower()
        is_random = preferences.get('isRandom', False)
        style = preferences.get('style', '')
        category = preferences.get('category', '')

        def process_and_enrich_recipe(recipe):
            processed = process_recipe({**recipe, 'input_ingredients': ingredients, 'language': language})
            if processed and style:
                processed['title'] = f"{processed['title']} ({style})"
            if processed and category:
                processed['title'] = f"{processed['title']} - {category}"
            return processed

        if is_random:
            if ALL_RECIPES:
                valid_recipes = [r for r in ALL_RECIPES if isinstance(r, dict) and 'ingredients' in r and ('title_en' in r or 'title_es' in r)]
                logging.debug(f"Found {len(valid_recipes)} valid recipes out of {len(ALL_RECIPES)}")
                if valid_recipes:
                    scored_recipes = [(r, score_recipe(r, ingredients, preferences)) for r in valid_recipes]
                    top_recipes = sorted(scored_recipes, key=lambda x: x[1], reverse=True)[:5]
                    recipe = random.choice([r for r, _ in top_recipes])
                    logging.debug(f"Selected random recipe from ALL_RECIPES: {recipe}")
                else:
                    recipe = generate_random_recipe(language)
            else:
                recipe = generate_random_recipe(language)
            processed_recipe = process_and_enrich_recipe(recipe)
            if not processed_recipe:
                logging.warning("Random recipe failed; falling back to dynamic generation")
                recipe = generate_dynamic_recipe([], preferences)
                processed_recipe = process_and_enrich_recipe(recipe)
                if not processed_recipe:
                    logging.error(f"Failed to generate fallback dynamic recipe: {recipe}")
                    return jsonify({"error": "No recipes available—kitchen’s closed, folks!"}), 500
            logging.info(f"Generated random recipe: {processed_recipe['title']}")
            return jsonify(processed_recipe)

        if ingredients:
            recipe = match_predefined_recipe(ingredients, language)
            logging.debug(f"Match predefined recipe result: {recipe}")
            if recipe:
                processed_recipe = process_and_enrich_recipe(recipe)
                if processed_recipe:
                    logging.info(f"Matched predefined recipe: {processed_recipe['title']}")
                    return jsonify(processed_recipe)

        recipe = generate_dynamic_recipe(ingredients, preferences)
        logging.debug(f"Dynamic recipe result: {recipe}")
        processed_recipe = process_and_enrich_recipe(recipe)
        if not processed_recipe:
            logging.error(f"Failed to generate dynamic recipe: {recipe}")
            return jsonify({"error": "Recipe generation flopped—blame the chef!"}), 500
        logging.info(f"Generated dynamic recipe: {processed_recipe['title']}")
        return jsonify(processed_recipe)

    except ValueError as ve:
        logging.error(f"Validation error: {str(ve)}")
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        logging.error(f"Unexpected error in generate_recipe: {str(e)}", exc_info=True)
        return jsonify({"error": "Something went belly-up—probably too much whiskey in the code!"}), 500

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
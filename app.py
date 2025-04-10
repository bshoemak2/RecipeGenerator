# app.py
import logging
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_caching import Cache
from concurrent.futures import ThreadPoolExecutor, TimeoutError
from recipe_generator import match_predefined_recipe, generate_dynamic_recipe, generate_random_recipe
from helpers import validate_input, calculate_nutrition, generate_share_text
from database import init_db, get_all_recipes
from dotenv import load_dotenv
from fuzzywuzzy import fuzz
import random

logging.basicConfig(
    filename='recipe_generator.log',
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s - %(pathname)s:%(lineno)d'
)
werkzeug_logger = logging.getLogger('werkzeug')
werkzeug_logger.setLevel(logging.ERROR)
werkzeug_logger.propagate = False

load_dotenv()

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

COOKING_METHODS = ["Burn", "Chuck", "Sizzle", "Holler At", "Wrestle", "Smack", "Yeet", "Flamethrower", "Mud-Boil", "Hog-Roast"]
EQUIPMENT_OPTIONS = ["rusty skillet", "dent dented pot", "old boot", "grandma's flip-flop", "truck hood", "banjo", "shotgun barrel", "coon trap"]
EQUIPMENT_PREFIXES = ["wrecked", "cursed", "busted", "haunted"]
FUNNY_PREFIXES = ["Redneck", "Drunk", "Hillbilly", "Limping Eagle's", "Caveman", "Sassy Granny's", "Bootleg", "Yeehaw", "Bubba’s"]
FUNNY_SUFFIXES = ["Pudding", "Surprise", "Mess", "Stew", "Disaster", "Holler", "Slop", "Gut-Buster", "Hoedown"]
SPICES_AND_EXTRAS = ["pinch of chaos", "hog grease", "swamp salt", "coon pepper", "moonshine splash", "granny’s secret dust", "beer foam", "barley belch"]
CHAOS_EVENTS = ["Coon steals half yer grub—double the beer!", "Granny’s curse: add a shot of moonshine!", "Truck backfires—extra char on that meat!", "Spill half yer beer on yer boots—cook faster!"]
DISASTERS = ["Fire starts—yell louder!", "Skillet explodes—keep cookin’!", "Beer fizzes over—laugh it off!"]
AFTERMATHS = ["Cops show up—hide the beer!", "Gator smells it—run!", "Neighbors complain—eat faster!"]
SINGULARITIES = ["Everything fuses into a mystery blob—eat it raw!", "Recipe implodes—start over!", "Chaos wins—abandon hope!"]
RESURRECTIONS = ["{gear} rises from the ashes—use it again!", "{gear} reforms with a vengeance!", "{gear} ain’t done yet!"]
TIME_WARPS = ["Two hours vanish—where’d the beef go?", "Time skips—beer’s gone flat!", "Clock breaks—cook forever!"]
NONSENSE = ["Yell, scream, and dance while it cooks!", "Sing a banjo tune to it!", "Punch the air ‘til it’s done!"]
INSULTS = ["Fit for a hog’s ass!", "Tastier than roadkill!", "Even yer cousin’d eat it!", "Good enough for the outhouse!", "Even a hog’d spit this out!", "Yer dog’d bury it!"]

INGREDIENT_PAIRS = {
    "ground beef": ["beer", "onion", "cheese"],
    "chicken": ["lemon", "butter", "rice"],
    "pork": ["apple", "whiskey", "potato"],
    "salmon": ["lemon", "butter", "vodka"],
    "moonshine": ["ground beef", "pork", "chicken"],
    "beer": ["ground beef", "chicken", "bread"]
}

METHOD_PREFERENCES = {
    "tequila": ["Flamethrower"],
    "moonshine": ["Flamethrower", "Mud-Boil"],
    "beer": ["Mud-Boil", "Sizzle"],
    "ground beef": ["Hog-Roast", "Sizzle"]
}

RECIPE_TEMPLATES = [
    ["Prep: Toss {ingredients} in like it’s a bar fight.", "Cook: {method} it in {equipment} ‘til it hollers back.", "Finish: Slap on {extra} and serve with a grunt."],
    ["Start: Mix {ingredients} with {extra} like a moonshine mash.", "Simmer: {method} it low in {equipment} ‘til it’s thick as mud.", "Serve: Dish it up hot and ornery."],
    ["Gather: Chuck {ingredients} into {equipment} with a holler.", "Blast: {method} it hard ‘til it’s kickin’ like a mule.", "Plate: Drizzle {extra} and call it supper."]
]

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
            if input_ing in INGREDIENT_PAIRS:
                for paired in INGREDIENT_PAIRS[input_ing]:
                    if paired in recipe_ingredients:
                        score += 0.2
    return score

def process_recipe(recipe):
    if not recipe or "error" in recipe or not isinstance(recipe, dict) or 'ingredients' not in recipe:
        logging.debug(f"Invalid recipe object: {recipe}")
        return None
    try:
        language = recipe.get('language', 'english')
        input_ingredients = recipe.get('input_ingredients', recipe.get('ingredients', []))
        
        method_options = COOKING_METHODS.copy()
        for ing in input_ingredients:
            if ing in METHOD_PREFERENCES:
                method_options.extend(METHOD_PREFERENCES[ing])
        method = random.choice(method_options)
        
        prefix = random.choice(FUNNY_PREFIXES)
        suffix = random.choice(FUNNY_SUFFIXES)
        extras = random.sample(SPICES_AND_EXTRAS, k=random.randint(1, 3))
        
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
        if "beer" in input_ingredients:
            equipment[0] = f"beer-soaked {equipment[0]}"
        equipment[1] = f"{random.choice(EQUIPMENT_PREFIXES)} {equipment[1]}"
        primary_equipment = equipment[0]
        
        chaos_events = random.sample(CHAOS_EVENTS, 3)
        if "beer" in input_ingredients:
            chaos_events[0] = "Spill half yer beer on yer boots—cook faster!"
        disaster = random.choice(DISASTERS)
        extra_text = f"Slap on {' and '.join(extras)} for a kick!" if extras else ""
        chaos_factor = 10
        insult = f"{random.choice(INSULTS[:2])} {random.choice(INSULTS[2:4])} {random.choice(INSULTS[4:])} {random.choice(INSULTS)}"
        
        if 'steps' in recipe and recipe['steps'] and len(recipe['steps']) >= 3:
            nonsense = random.choice(NONSENSE) if random.random() < 0.5 else ""
            recipe['steps'] = [
                f"{recipe['steps'][0]} {extra_text} {method} it in {primary_equipment} ‘til it’s rowdy all at once! {chaos_events[0]} {disaster} {nonsense}",
                f"Serve hot with bread or salad and a holler—garnish if you ain’t too drunk! {chaos_events[1]} {chaos_events[2]} {insult}"
            ]
        else:
            template = random.choice(RECIPE_TEMPLATES)
            nonsense = random.choice(NONSENSE) if random.random() < 0.5 else ""
            recipe['steps'] = [
                f"{template[0].format(ingredients=' and '.join(ingredients_list))} {extra_text} {nonsense}",
                f"{template[1].format(method=method.lower(), equipment=primary_equipment)} {chaos_events[0]} {disaster}",
                f"{template[2].format(extra=extra_text)} {chaos_events[1]} {chaos_events[2]} {insult}"
            ]
        recipe['equipment'] = equipment
        
        recipe['steps'].insert(1, f"All yer gear melts—cook with yer boots!")
        if random.random() < 0.5:
            risen_gear = random.choice(equipment)
            recipe['steps'].insert(2, random.choice(RESURRECTIONS).format(gear=risen_gear))
        recipe['steps'].append(random.choice(AFTERMATHS))
        recipe['ingredients'] = [f"{ing} (doubled!)" for ing in ingredients_list]
        recipe['steps'].append("Chaos maxed out—double everything and pray!")
        if random.random() < 0.5:
            recipe['steps'].append(random.choice(SINGULARITIES))
        recipe['steps'].append(random.choice(TIME_WARPS))
        
        nutrition_items = nutrition_items or ["unknown"]
        nutrition_future = executor.submit(calculate_nutrition, nutrition_items) if nutrition_items else None
        try:
            nutrition = nutrition_future.result(timeout=5) if nutrition_future else {"calories": random.randint(100, 1000)}
        except TimeoutError:
            logging.warning("Nutrition calculation timed out; using fallback")
            nutrition = {"calories": random.randint(100, 1000)}
        except Exception as e:
            logging.error(f"Nutrition calculation failed: {str(e)}", exc_info=True)
            nutrition = {"calories": random.randint(100, 1000)}
        
        if any(ing in INGREDIENT_CATEGORIES["devil_water"] for ing in nutrition_items):
            nutrition["calories"] += random.randint(100, 666)
        nutrition["calories"] *= 2
        nutrition["chaos_factor"] = chaos_factor
        recipe['nutrition'] = nutrition
        
        recipe['shareText'] = f"Behold my culinary chaos: {recipe['title']}\nGear: {' '.join(equipment)}\nGrub: {' '.join(ingredients_list)}\nSteps:\n{' '.join(recipe['steps'])}\nCalories: {recipe['nutrition']['calories']} (Chaos: {recipe['nutrition']['chaos_factor']}/10)"
        for key in ['title_en', 'title_es', 'steps_en', 'steps_es', 'cooking_time', 'difficulty', 'servings', 'tips', 'input_ingredients']:
            recipe.pop(key, None)
        return recipe
    except Exception as e:
        logging.error(f"Error processing recipe: {str(e)}", exc_info=True)
        return None

INGREDIENT_CATEGORIES = {
    "meat": sorted(["ground beef", "chicken", "pork", "lamb", "pichana", "churrasco", "ribeye steaks"]),
    "vegetables": sorted(["carrot", "broccoli", "onion", "potato"]),
    "fruits": sorted(["apple", "banana", "lemon", "orange"]),
    "seafood": sorted(["salmon", "shrimp", "cod", "tuna", "yellowtail snapper", "grouper", "red snapper", "oysters", "lobster"]),
    "dairy": sorted(["cheese", "milk", "butter", "yogurt", "eggs"]),
    "bread_carbs": sorted(["bread", "pasta", "rice", "tortilla"]),
    "devil_water": sorted(["beer", "moonshine", "whiskey", "vodka", "tequila"])
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
                    logging.error(f"Failed to generate fallback dynamic recipe: {recipe}", exc_info=True)
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
            logging.error(f"Failed to generate dynamic recipe: {recipe}", exc_info=True)
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
    app.run(host='0.0.0.0', port=port, debug=False)
from flask import Flask, request, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

# List of random recipes for the "Random Recipe" button
RANDOM_RECIPES = [
    {
        "title_en": "Ginger-Soy Tofu Stir-Fry",
        "title_es": "Tofu Salteado con Jengibre y Salsa de Soja",
        "steps_en": [
            "Heat sesame oil in a pan over medium heat.",
            "Add diced tofu and fry until golden, about 5 minutes.",
            "Stir in grated ginger and soy sauce, cook for 2 minutes.",
            "Add any additional veggies and stir-fry for 3 minutes.",
            "Serve over rice with a sprinkle of sesame seeds."
        ],
        "steps_es": [
            "Calienta aceite de sésamo en una sartén a fuego medio.",
            "Añade tofu en cubos y fríe hasta que esté dorado, unos 5 minutos.",
            "Incorpora jengibre rallado y salsa de soja, cocina por 2 minutos.",
            "Añade otras verduras y saltea por 3 minutos.",
            "Sirve sobre arroz con un toque de semillas de sésamo."
        ],
        "nutrition": {"calories": 320, "protein": 18, "fat": 12},
        "ingredients": ["tofu", "ginger", "soy sauce"]
    },
    {
        "title_en": "Creamy Coconut Chicken Curry",
        "title_es": "Curry Cremoso de Pollo con Leche de Coco",
        "steps_en": [
            "Heat oil in a pan over medium heat.",
            "Sauté chicken pieces until browned, about 5 minutes.",
            "Add curry powder and stir for 1 minute to toast the spices.",
            "Pour in coconut milk, simmer for 15 minutes until chicken is tender.",
            "Serve with rice or naan, garnished with fresh cilantro."
        ],
        "steps_es": [
            "Calienta aceite en una sartén a fuego medio.",
            "Saltea trozos de pollo hasta que estén dorados, unos 5 minutos.",
            "Añade polvo de curry y revuelve por 1 minuto para tostar las especias.",
            "Vierte la leche de coco, cocina a fuego lento por 15 minutos hasta que el pollo esté tierno.",
            "Sirve con arroz o naan, decorado con cilantro fresco."
        ],
        "nutrition": {"calories": 450, "protein": 30, "fat": 20},
        "ingredients": ["chicken", "curry", "coconut milk"]
    },
    {
        "title_en": "Classic Hummus",
        "title_es": "Hummus Clásico",
        "steps_en": [
            "Drain and rinse chickpeas, then add to a food processor.",
            "Add tahini, lemon juice, garlic, and a pinch of salt.",
            "Blend until smooth, adding water as needed to reach desired consistency.",
            "Drizzle with olive oil and sprinkle with paprika before serving.",
            "Serve with pita bread or fresh veggies."
        ],
        "steps_es": [
            "Escurre y enjuaga los garbanzos, luego añádelos a un procesador de alimentos.",
            "Agrega tahini, jugo de limón, ajo y una pizca de sal.",
            "Mezcla hasta que esté suave, añadiendo agua según sea necesario para la consistencia deseada.",
            "Rocía con aceite de oliva y espolvorea con pimentón antes de servir.",
            "Sirve con pan pita o verduras frescas."
        ],
        "nutrition": {"calories": 200, "protein": 8, "fat": 10},
        "ingredients": ["chickpeas", "tahini", "lemon"]
    },
    {
        "title_en": "Southern Cheesy Cauliflower Bake",
        "title_es": "Gratinado de Coliflor con Queso al Estilo Sureño",
        "steps_en": [
            "Preheat oven to 375°F (190°C).",
            "Steam cauliflower florets until tender, about 5 minutes.",
            "In a skillet, cook bacon until crispy, then crumble and set aside.",
            "Mix steamed cauliflower with diced ham, shredded cheese, and crumbled bacon in a baking dish.",
            "Bake for 20 minutes until the cheese is melted and bubbly, then serve hot."
        ],
        "steps_es": [
            "Precalienta el horno a 190°C.",
            "Cocina al vapor los floretes de coliflor hasta que estén tiernos, unos 5 minutos.",
            "En una sartén, cocina el tocino hasta que esté crujiente, luego desmenúzalo y reserva.",
            "Mezcla la coliflor al vapor con jamón en cubos, queso rallado y tocino desmenuzado en un molde para hornear.",
            "Hornea durante 20 minutos hasta que el queso esté derretido y burbujeante, luego sirve caliente."
        ],
        "nutrition": {"calories": 380, "protein": 22, "fat": 28},
        "ingredients": ["cauliflower", "ham", "cheese", "bacon"]
    },
    {
        "title_en": "Southern Black-Eyed Peas and Greens",
        "title_es": "Guisantes de Ojo Negro y Verduras al Estilo Sureño",
        "steps_en": [
            "In a large pot, cook diced ham with a bit of oil until browned, about 5 minutes.",
            "Add chopped collard greens and cook until wilted, about 3 minutes.",
            "Stir in black-eyed peas, a pinch of smoked paprika, and a splash of broth.",
            "Simmer for 15 minutes until flavors meld together.",
            "Serve hot with cornbread on the side."
        ],
        "steps_es": [
            "En una olla grande, cocina el jamón en cubos con un poco de aceite hasta que esté dorado, unos 5 minutos.",
            "Añade las acelgas picadas y cocina hasta que se marchiten, unos 3 minutos.",
            "Incorpora los guisantes de ojo negro, una pizca de pimentón ahumado y un chorrito de caldo.",
            "Cocina a fuego lento durante 15 minutos hasta que los sabores se mezclen.",
            "Sirve caliente con pan de maíz al lado."
        ],
        "nutrition": {"calories": 300, "protein": 18, "fat": 10},
        "ingredients": ["black-eyed peas", "ham", "collard greens"]
    }
]

@app.route('/generate_recipe', methods=['POST'])
def generate_recipe():
    data = request.json
    ingredients = data.get('ingredients', [])
    preferences = data.get('preferences', {})
    diet = preferences.get('diet', '').lower()
    time = preferences.get('time', '').lower()
    language = preferences.get('language', 'english').lower()
    style = preferences.get('style', '').lower()
    category = preferences.get('category', '').lower()
    is_random = preferences.get('isRandom', False)

    # Handle random recipe request
    if is_random:
        random_recipe = random.choice(RANDOM_RECIPES)
        title = random_recipe['title_es'] if language == 'spanish' else random_recipe['title_en']
        steps = random_recipe['steps_es'] if language == 'spanish' else random_recipe['steps_en']
        share_text_en = f"Check out my recipe: {random_recipe['title_en']}\nIngredients: {', '.join(random_recipe['ingredients'])}\nSteps:\n" + \
                        "\n".join([f"{i+1}. {step}" for i, step in enumerate(random_recipe['steps_en'])]) + \
                        f"\nNutrition: {random_recipe['nutrition']['calories']} kcal, {random_recipe['nutrition']['protein']}g protein"
        share_text_es = f"Mira mi receta: {random_recipe['title_es']}\nIngredientes: {', '.join(random_recipe['ingredients'])}\nPasos:\n" + \
                        "\n".join([f"{i+1}. {step}" for i, step in enumerate(random_recipe['steps_es'])]) + \
                        f"\nNutrición: {random_recipe['nutrition']['calories']} kcal, {random_recipe['nutrition']['protein']}g proteína"
        return jsonify({
            "title": title,
            "ingredients": random_recipe['ingredients'],
            "steps": steps,
            "nutrition": random_recipe['nutrition'],
            "shareText": share_text_es if language == 'spanish' else share_text_en
        })

    # Mock recipes for specific inputs
    if ingredients:
        # Mock Recipe 1: Tofu, Ginger, Soy Sauce
        if ingredients[0].lower() == "tofu" and "ginger" in [i.lower() for i in ingredients] and "soy sauce" in [i.lower() for i in ingredients]:
            title_en = "Ginger-Soy Tofu Stir-Fry"
            title_es = "Tofu Salteado con Jengibre y Salsa de Soja"
            steps_en = [
                "Heat sesame oil in a pan over medium heat.",
                "Add diced tofu and fry until golden, about 5 minutes.",
                "Stir in grated ginger and soy sauce, cook for 2 minutes.",
                "Add any additional veggies and stir-fry for 3 minutes.",
                "Serve over rice with a sprinkle of sesame seeds."
            ]
            steps_es = [
                "Calienta aceite de sésamo en una sartén a fuego medio.",
                "Añade tofu en cubos y fríe hasta que esté dorado, unos 5 minutos.",
                "Incorpora jengibre rallado y salsa de soja, cocina por 2 minutos.",
                "Añade otras verduras y saltea por 3 minutos.",
                "Sirve sobre arroz con un toque de semillas de sésamo."
            ]
            nutrition = {"calories": 320, "protein": 18, "fat": 12}
            title = title_es if language == 'spanish' else title_en
            steps = steps_es if language == 'spanish' else steps_en
            share_text_en = f"Check out my recipe: {title_en}\nIngredients: {', '.join(ingredients)}\nSteps:\n" + \
                            "\n".join([f"{i+1}. {step}" for i, step in enumerate(steps_en)]) + \
                            f"\nNutrition: {nutrition['calories']} kcal, {nutrition['protein']}g protein"
            share_text_es = f"Mira mi receta: {title_es}\nIngredientes: {', '.join(ingredients)}\nPasos:\n" + \
                            "\n".join([f"{i+1}. {step}" for i, step in enumerate(steps_es)]) + \
                            f"\nNutrición: {nutrition['calories']} kcal, {nutrition['protein']}g proteína"
            return jsonify({
                "title": title,
                "ingredients": ingredients,
                "steps": steps,
                "nutrition": nutrition,
                "shareText": share_text_es if language == 'spanish' else share_text_en
            })

        # Mock Recipe 2: Chicken, Curry, Coconut Milk
        if ingredients[0].lower() == "chicken" and "curry" in [i.lower() for i in ingredients] and "coconut milk" in [i.lower() for i in ingredients]:
            title_en = "Creamy Coconut Chicken Curry"
            title_es = "Curry Cremoso de Pollo con Leche de Coco"
            steps_en = [
                "Heat oil in a pan over medium heat.",
                "Sauté chicken pieces until browned, about 5 minutes.",
                "Add curry powder and stir for 1 minute to toast the spices.",
                "Pour in coconut milk, simmer for 15 minutes until chicken is tender.",
                "Serve with rice or naan, garnished with fresh cilantro."
            ]
            steps_es = [
                "Calienta aceite en una sartén a fuego medio.",
                "Saltea trozos de pollo hasta que estén dorados, unos 5 minutos.",
                "Añade polvo de curry y revuelve por 1 minuto para tostar las especias.",
                "Vierte la leche de coco, cocina a fuego lento por 15 minutos hasta que el pollo esté tierno.",
                "Sirve con arroz o naan, decorado con cilantro fresco."
            ]
            nutrition = {"calories": 450, "protein": 30, "fat": 20}
            title = title_es if language == 'spanish' else title_en
            steps = steps_es if language == 'spanish' else steps_en
            share_text_en = f"Check out my recipe: {title_en}\nIngredients: {', '.join(ingredients)}\nSteps:\n" + \
                            "\n".join([f"{i+1}. {step}" for i, step in enumerate(steps_en)]) + \
                            f"\nNutrition: {nutrition['calories']} kcal, {nutrition['protein']}g protein"
            share_text_es = f"Mira mi receta: {title_es}\nIngredientes: {', '.join(ingredients)}\nPasos:\n" + \
                            "\n".join([f"{i+1}. {step}" for i, step in enumerate(steps_es)]) + \
                            f"\nNutrición: {nutrition['calories']} kcal, {nutrition['protein']}g proteína"
            return jsonify({
                "title": title,
                "ingredients": ingredients,
                "steps": steps,
                "nutrition": nutrition,
                "shareText": share_text_es if language == 'spanish' else share_text_en
            })

        # Mock Recipe 3: Egg, Spinach, Feta
        if ingredients[0].lower() == "egg" and "spinach" in [i.lower() for i in ingredients] and "feta" in [i.lower() for i in ingredients]:
            title_en = "Spinach and Feta Frittata"
            title_es = "Frittata de Espinacas y Feta"
            steps_en = [
                "Preheat your oven to 375°F (190°C).",
                "Whisk eggs in a bowl with a splash of milk, salt, and pepper.",
                "Sauté spinach in a skillet until wilted, about 2 minutes.",
                "Pour egg mixture into the skillet, sprinkle feta on top.",
                "Cook on stovetop for 3 minutes, then bake for 10 minutes until set."
            ]
            steps_es = [
                "Precalienta tu horno a 190°C.",
                "Bate los huevos en un tazón con un chorrito de leche, sal y pimienta.",
                "Saltea las espinacas en una sartén hasta que se marchiten, unos 2 minutos.",
                "Vierte la mezcla de huevos en la sartén, espolvorea feta por encima.",
                "Cocina en la estufa por 3 minutos, luego hornea por 10 minutos hasta que cuaje."
            ]
            nutrition = {"calories": 280, "protein": 22, "fat": 15}
            title = title_es if language == 'spanish' else title_en
            steps = steps_es if language == 'spanish' else steps_en
            share_text_en = f"Check out my recipe: {title_en}\nIngredients: {', '.join(ingredients)}\nSteps:\n" + \
                            "\n".join([f"{i+1}. {step}" for i, step in enumerate(steps_en)]) + \
                            f"\nNutrition: {nutrition['calories']} kcal, {nutrition['protein']}g protein"
            share_text_es = f"Mira mi receta: {title_es}\nIngredientes: {', '.join(ingredients)}\nPasos:\n" + \
                            "\n".join([f"{i+1}. {step}" for i, step in enumerate(steps_es)]) + \
                            f"\nNutrición: {nutrition['calories']} kcal, {nutrition['protein']}g proteína"
            return jsonify({
                "title": title,
                "ingredients": ingredients,
                "steps": steps,
                "nutrition": nutrition,
                "shareText": share_text_es if language == 'spanish' else share_text_en
            })

        # Mock Recipe 4: Salmon, Lemon, Dill
        if ingredients[0].lower() == "salmon" and "lemon" in [i.lower() for i in ingredients] and "dill" in [i.lower() for i in ingredients]:
            title_en = "Lemon-Dill Baked Salmon"
            title_es = "Salmón al Horno con Limón y Eneldo"
            steps_en = [
                "Preheat oven to 400°F (200°C).",
                "Place salmon fillets on a baking sheet lined with parchment.",
                "Squeeze fresh lemon juice over the salmon and sprinkle with dill.",
                "Season with salt and pepper, add lemon slices on top.",
                "Bake for 12-15 minutes until salmon flakes easily with a fork."
            ]
            steps_es = [
                "Precalienta el horno a 200°C.",
                "Coloca los filetes de salmón en una bandeja forrada con papel pergamino.",
                "Exprime jugo de limón fresco sobre el salmón y espolvorea con eneldo.",
                "Sazona con sal y pimienta, coloca rodajas de limón encima.",
                "Hornea por 12-15 minutos hasta que el salmón se desmenuce fácilmente con un tenedor."
            ]
            nutrition = {"calories": 350, "protein": 34, "fat": 18}
            title = title_es if language == 'spanish' else title_en
            steps = steps_es if language == 'spanish' else steps_en
            share_text_en = f"Check out my recipe: {title_en}\nIngredients: {', '.join(ingredients)}\nSteps:\n" + \
                            "\n".join([f"{i+1}. {step}" for i, step in enumerate(steps_en)]) + \
                            f"\nNutrition: {nutrition['calories']} kcal, {nutrition['protein']}g protein"
            share_text_es = f"Mira mi receta: {title_es}\nIngredientes: {', '.join(ingredients)}\nPasos:\n" + \
                            "\n".join([f"{i+1}. {step}" for i, step in enumerate(steps_es)]) + \
                            f"\nNutrición: {nutrition['calories']} kcal, {nutrition['protein']}g proteína"
            return jsonify({
                "title": title,
                "ingredients": ingredients,
                "steps": steps,
                "nutrition": nutrition,
                "shareText": share_text_es if language == 'spanish' else share_text_en
            })

        # Mock Recipe 5: Pasta, Tomatoes, Basil
        if ingredients[0].lower() == "pasta" and "tomatoes" in [i.lower() for i in ingredients] and "basil" in [i.lower() for i in ingredients]:
            title_en = "Fresh Tomato Basil Pasta"
            title_es = "Pasta con Tomate Fresco y Albahaca"
            steps_en = [
                "Cook pasta in salted boiling water until al dente, about 8-10 minutes.",
                "Sauté diced tomatoes in olive oil with garlic until softened, about 5 minutes.",
                "Toss in cooked pasta and fresh basil leaves, mix well.",
                "Season with salt, pepper, and a pinch of red chili flakes.",
                "Serve with a sprinkle of Parmesan cheese if desired."
            ]
            steps_es = [
                "Cocina la pasta en agua hirviendo con sal hasta que esté al dente, unos 8-10 minutos.",
                "Saltea los tomates en cubos en aceite de oliva con ajo hasta que se ablanden, unos 5 minutos.",
                "Agrega la pasta cocida y hojas de albahaca fresca, mezcla bien.",
                "Sazona con sal, pimienta y una pizca de hojuelas de chile rojo.",
                "Sirve con un poco de queso parmesano si lo deseas."
            ]
            nutrition = {"calories": 400, "protein": 12, "fat": 10}
            title = title_es if language == 'spanish' else title_en
            steps = steps_es if language == 'spanish' else steps_en
            share_text_en = f"Check out my recipe: {title_en}\nIngredients: {', '.join(ingredients)}\nSteps:\n" + \
                            "\n".join([f"{i+1}. {step}" for i, step in enumerate(steps_en)]) + \
                            f"\nNutrition: {nutrition['calories']} kcal, {nutrition['protein']}g protein"
            share_text_es = f"Mira mi receta: {title_es}\nIngredientes: {', '.join(ingredients)}\nPasos:\n" + \
                            "\n".join([f"{i+1}. {step}" for i, step in enumerate(steps_es)]) + \
                            f"\nNutrición: {nutrition['calories']} kcal, {nutrition['protein']}g proteína"
            return jsonify({
                "title": title,
                "ingredients": ingredients,
                "steps": steps,
                "nutrition": nutrition,
                "shareText": share_text_es if language == 'spanish' else share_text_en
            })

        # Mock Recipe 6: Lamb, Rosemary, Garlic
        if ingredients[0].lower() == "lamb" and "rosemary" in [i.lower() for i in ingredients] and "garlic" in [i.lower() for i in ingredients]:
            title_en = "Rosemary-Garlic Roasted Lamb"
            title_es = "Cordero Asado con Romero y Ajo"
            steps_en = [
                "Preheat oven to 375°F (190°C).",
                "Rub lamb with olive oil, minced garlic, chopped rosemary, salt, and pepper.",
                "Place lamb on a roasting pan and roast for 1 hour, or until internal temp reaches 145°F (63°C) for medium.",
                "Let rest for 10 minutes before slicing.",
                "Serve with roasted vegetables or mashed potatoes."
            ]
            steps_es = [
                "Precalienta el horno a 190°C.",
                "Frota el cordero con aceite de oliva, ajo picado, romero picado, sal y pimienta.",
                "Coloca el cordero en una bandeja para asar y asa durante 1 hora, o hasta que la temperatura interna alcance 63°C para término medio.",
                "Deja reposar 10 minutos antes de cortar.",
                "Sirve con verduras asadas o puré de papas."
            ]
            nutrition = {"calories": 500, "protein": 38, "fat": 25}
            title = title_es if language == 'spanish' else title_en
            steps = steps_es if language == 'spanish' else steps_en
            share_text_en = f"Check out my recipe: {title_en}\nIngredients: {', '.join(ingredients)}\nSteps:\n" + \
                            "\n".join([f"{i+1}. {step}" for i, step in enumerate(steps_en)]) + \
                            f"\nNutrition: {nutrition['calories']} kcal, {nutrition['protein']}g protein"
            share_text_es = f"Mira mi receta: {title_es}\nIngredientes: {', '.join(ingredients)}\nPasos:\n" + \
                            "\n".join([f"{i+1}. {step}" for i, step in enumerate(steps_es)]) + \
                            f"\nNutrición: {nutrition['calories']} kcal, {nutrition['protein']}g proteína"
            return jsonify({
                "title": title,
                "ingredients": ingredients,
                "steps": steps,
                "nutrition": nutrition,
                "shareText": share_text_es if language == 'spanish' else share_text_en
            })

        # Mock Recipe 7: Chickpeas, Tahini, Lemon
        if ingredients[0].lower() == "chickpeas" and "tahini" in [i.lower() for i in ingredients] and "lemon" in [i.lower() for i in ingredients]:
            title_en = "Classic Hummus"
            title_es = "Hummus Clásico"
            steps_en = [
                "Drain and rinse chickpeas, then add to a food processor.",
                "Add tahini, lemon juice, garlic, and a pinch of salt.",
                "Blend until smooth, adding water as needed to reach desired consistency.",
                "Drizzle with olive oil and sprinkle with paprika before serving.",
                "Serve with pita bread or fresh veggies."
            ]
            steps_es = [
                "Escurre y enjuaga los garbanzos, luego añádelos a un procesador de alimentos.",
                "Agrega tahini, jugo de limón, ajo y una pizca de sal.",
                "Mezcla hasta que esté suave, añadiendo agua según sea necesario para la consistencia deseada.",
                "Rocía con aceite de oliva y espolvorea con pimentón antes de servir.",
                "Sirve con pan pita o verduras frescas."
            ]
            nutrition = {"calories": 200, "protein": 8, "fat": 10}
            title = title_es if language == 'spanish' else title_en
            steps = steps_es if language == 'spanish' else steps_en
            share_text_en = f"Check out my recipe: {title_en}\nIngredients: {', '.join(ingredients)}\nSteps:\n" + \
                            "\n".join([f"{i+1}. {step}" for i, step in enumerate(steps_en)]) + \
                            f"\nNutrition: {nutrition['calories']} kcal, {nutrition['protein']}g protein"
            share_text_es = f"Mira mi receta: {title_es}\nIngredientes: {', '.join(ingredients)}\nPasos:\n" + \
                            "\n".join([f"{i+1}. {step}" for i, step in enumerate(steps_es)]) + \
                            f"\nNutrición: {nutrition['calories']} kcal, {nutrition['protein']}g proteína"
            return jsonify({
                "title": title,
                "ingredients": ingredients,
                "steps": steps,
                "nutrition": nutrition,
                "shareText": share_text_es if language == 'spanish' else share_text_en
            })

        # Mock Recipe 8: Beef, Mushrooms, Thyme
        if ingredients[0].lower() == "beef" and "mushrooms" in [i.lower() for i in ingredients] and "thyme" in [i.lower() for i in ingredients]:
            title_en = "Beef and Mushroom Stew with Thyme"
            title_es = "Estofado de Carne y Champiñones con Tomillo"
            steps_en = [
                "Heat oil in a large pot over medium heat.",
                "Brown beef chunks on all sides, about 8 minutes.",
                "Add sliced mushrooms, thyme, and garlic, sauté for 5 minutes.",
                "Pour in beef broth and simmer for 1.5 hours until beef is tender.",
                "Serve hot with crusty bread or mashed potatoes."
            ]
            steps_es = [
                "Calienta aceite en una olla grande a fuego medio.",
                "Dora los trozos de carne por todos lados, unos 8 minutos.",
                "Añade champiñones en rodajas, tomillo y ajo, saltea por 5 minutos.",
                "Vierte caldo de carne y cocina a fuego lento durante 1.5 horas hasta que la carne esté tierna.",
                "Sirve caliente con pan crujiente o puré de papas."
            ]
            nutrition = {"calories": 480, "protein": 40, "fat": 22}
            title = title_es if language == 'spanish' else title_en
            steps = steps_es if language == 'spanish' else steps_en
            share_text_en = f"Check out my recipe: {title_en}\nIngredients: {', '.join(ingredients)}\nSteps:\n" + \
                            "\n".join([f"{i+1}. {step}" for i, step in enumerate(steps_en)]) + \
                            f"\nNutrition: {nutrition['calories']} kcal, {nutrition['protein']}g protein"
            share_text_es = f"Mira mi receta: {title_es}\nIngredientes: {', '.join(ingredients)}\nPasos:\n" + \
                            "\n".join([f"{i+1}. {step}" for i, step in enumerate(steps_es)]) + \
                            f"\nNutrición: {nutrition['calories']} kcal, {nutrition['protein']}g proteína"
            return jsonify({
                "title": title,
                "ingredients": ingredients,
                "steps": steps,
                "nutrition": nutrition,
                "shareText": share_text_es if language == 'spanish' else share_text_en
            })

        # Mock Recipe 9: Arugula, Parmesan, Lemon
        if ingredients[0].lower() == "arugula" and "parmesan" in [i.lower() for i in ingredients] and "lemon" in [i.lower() for i in ingredients]:
            title_en = "Arugula Parmesan Lemon Salad"
            title_es = "Ensalada de Rúcula, Parmesano y Limón"
            steps_en = [
                "In a large bowl, toss arugula with a drizzle of olive oil.",
                "Squeeze fresh lemon juice over the arugula and toss again.",
                "Shave parmesan cheese over the top using a vegetable peeler.",
                "Season with salt, pepper, and a pinch of lemon zest.",
                "Serve immediately as a fresh, light side dish."
            ]
            steps_es = [
                "En un tazón grande, mezcla la rúcula con un chorrito de aceite de oliva.",
                "Exprime jugo de limón fresco sobre la rúcula y mezcla de nuevo.",
                "Ralla queso parmesano por encima usando un pelador de verduras.",
                "Sazona con sal, pimienta y una pizca de ralladura de limón.",
                "Sirve inmediatamente como un acompañamiento fresco y ligero."
            ]
            nutrition = {"calories": 150, "protein": 6, "fat": 12}
            title = title_es if language == 'spanish' else title_en
            steps = steps_es if language == 'spanish' else steps_en
            share_text_en = f"Check out my recipe: {title_en}\nIngredients: {', '.join(ingredients)}\nSteps:\n" + \
                            "\n".join([f"{i+1}. {step}" for i, step in enumerate(steps_en)]) + \
                            f"\nNutrition: {nutrition['calories']} kcal, {nutrition['protein']}g protein"
            share_text_es = f"Mira mi receta: {title_es}\nIngredientes: {', '.join(ingredients)}\nPasos:\n" + \
                            "\n".join([f"{i+1}. {step}" for i, step in enumerate(steps_es)]) + \
                            f"\nNutrición: {nutrition['calories']} kcal, {nutrition['protein']}g proteína"
            return jsonify({
                "title": title,
                "ingredients": ingredients,
                "steps": steps,
                "nutrition": nutrition,
                "shareText": share_text_es if language == 'spanish' else share_text_en
            })

        # Mock Recipe 10: Butternut Squash, Sage, Honey
        if ingredients[0].lower() == "butternut squash" and "sage" in [i.lower() for i in ingredients] and "honey" in [i.lower() for i in ingredients]:
            title_en = "Honey-Roasted Butternut Squash with Sage"
            title_es = "Calabaza Butternut Asada con Miel y Salvia"
            steps_en = [
                "Preheat oven to 400°F (200°C).",
                "Peel and cube butternut squash, then place on a baking sheet.",
                "Drizzle with olive oil and honey, and sprinkle with chopped sage.",
                "Season with salt and pepper, then toss to coat evenly.",
                "Roast for 25-30 minutes until tender and caramelized, stirring halfway."
            ]
            steps_es = [
                "Precalienta el horno a 200°C.",
                "Pela y corta la calabaza butternut en cubos, luego colócala en una bandeja para hornear.",
                "Rocía con aceite de oliva y miel, y espolvorea con salvia picada.",
                "Sazona con sal y pimienta, luego mezcla para cubrir uniformemente.",
                "Asa durante 25-30 minutos hasta que esté tierna y caramelizada, revolviendo a la mitad."
            ]
            nutrition = {"calories": 220, "protein": 3, "fat": 8}
            title = title_es if language == 'spanish' else title_en
            steps = steps_es if language == 'spanish' else steps_en
            share_text_en = f"Check out my recipe: {title_en}\nIngredients: {', '.join(ingredients)}\nSteps:\n" + \
                            "\n".join([f"{i+1}. {step}" for i, step in enumerate(steps_en)]) + \
                            f"\nNutrition: {nutrition['calories']} kcal, {nutrition['protein']}g protein"
            share_text_es = f"Mira mi receta: {title_es}\nIngredientes: {', '.join(ingredients)}\nPasos:\n" + \
                            "\n".join([f"{i+1}. {step}" for i, step in enumerate(steps_es)]) + \
                            f"\nNutrición: {nutrition['calories']} kcal, {nutrition['protein']}g proteína"
            return jsonify({
                "title": title,
                "ingredients": ingredients,
                "steps": steps,
                "nutrition": nutrition,
                "shareText": share_text_es if language == 'spanish' else share_text_en
            })

        # Mock Recipe 11: Shrimp, Garlic, Capers
        if ingredients[0].lower() == "shrimp" and "garlic" in [i.lower() for i in ingredients] and "capers" in [i.lower() for i in ingredients]:
            title_en = "Garlic Shrimp with Capers"
            title_es = "Camarones al Ajo con Alcaparras"
            steps_en = [
                "Heat olive oil in a skillet over medium heat.",
                "Add minced garlic and sauté until fragrant, about 1 minute.",
                "Add shrimp and cook until pink, about 3 minutes per side.",
                "Stir in capers and a squeeze of lemon juice, cook for 1 more minute.",
                "Serve hot with crusty bread or over pasta."
            ]
            steps_es = [
                "Calienta aceite de oliva en una sartén a fuego medio.",
                "Añade ajo picado y saltea hasta que esté fragante, aproximadamente 1 minuto.",
                "Agrega los camarones y cocina hasta que estén rosados, unos 3 minutos por lado.",
                "Incorpora las alcaparras y un chorrito de jugo de limón, cocina por 1 minuto más.",
                "Sirve caliente con pan crujiente o sobre pasta."
            ]
            nutrition = {"calories": 300, "protein": 28, "fat": 15}
            title = title_es if language == 'spanish' else title_en
            steps = steps_es if language == 'spanish' else steps_en
            share_text_en = f"Check out my recipe: {title_en}\nIngredients: {', '.join(ingredients)}\nSteps:\n" + \
                            "\n".join([f"{i+1}. {step}" for i, step in enumerate(steps_en)]) + \
                            f"\nNutrition: {nutrition['calories']} kcal, {nutrition['protein']}g protein"
            share_text_es = f"Mira mi receta: {title_es}\nIngredientes: {', '.join(ingredients)}\nPasos:\n" + \
                            "\n".join([f"{i+1}. {step}" for i, step in enumerate(steps_es)]) + \
                            f"\nNutrición: {nutrition['calories']} kcal, {nutrition['protein']}g proteína"
            return jsonify({
                "title": title,
                "ingredients": ingredients,
                "steps": steps,
                "nutrition": nutrition,
                "shareText": share_text_es if language == 'spanish' else share_text_en
            })

        # Mock Recipe 12: Cauliflower, Ham, Cheese, Bacon
        if ingredients[0].lower() == "cauliflower" and "ham" in [i.lower() for i in ingredients] and "cheese" in [i.lower() for i in ingredients] and "bacon" in [i.lower() for i in ingredients]:
            title_en = "Southern Cheesy Cauliflower Bake"
            title_es = "Gratinado de Coliflor con Queso al Estilo Sureño"
            steps_en = [
                "Preheat oven to 375°F (190°C).",
                "Steam cauliflower florets until tender, about 5 minutes.",
                "In a skillet, cook bacon until crispy, then crumble and set aside.",
                "Mix steamed cauliflower with diced ham, shredded cheese, and crumbled bacon in a baking dish.",
                "Bake for 20 minutes until the cheese is melted and bubbly, then serve hot."
            ]
            steps_es = [
                "Precalienta el horno a 190°C.",
                "Cocina al vapor los floretes de coliflor hasta que estén tiernos, unos 5 minutos.",
                "En una sartén, cocina el tocino hasta que esté crujiente, luego desmenúzalo y reserva.",
                "Mezcla la coliflor al vapor con jamón en cubos, queso rallado y tocino desmenuzado en un molde para hornear.",
                "Hornea durante 20 minutos hasta que el queso esté derretido y burbujeante, luego sirve caliente."
            ]
            nutrition = {"calories": 380, "protein": 22, "fat": 28}
            title = title_es if language == 'spanish' else title_en
            steps = steps_es if language == 'spanish' else steps_en
            share_text_en = f"Check out my recipe: {title_en}\nIngredients: {', '.join(ingredients)}\nSteps:\n" + \
                            "\n".join([f"{i+1}. {step}" for i, step in enumerate(steps_en)]) + \
                            f"\nNutrition: {nutrition['calories']} kcal, {nutrition['protein']}g protein"
            share_text_es = f"Mira mi receta: {title_es}\nIngredientes: {', '.join(ingredients)}\nPasos:\n" + \
                            "\n".join([f"{i+1}. {step}" for i, step in enumerate(steps_es)]) + \
                            f"\nNutrición: {nutrition['calories']} kcal, {nutrition['protein']}g proteína"
            return jsonify({
                "title": title,
                "ingredients": ingredients,
                "steps": steps,
                "nutrition": nutrition,
                "shareText": share_text_es if language == 'spanish' else share_text_en
            })

        # Mock Recipe 13: Black-Eyed Peas, Ham, Collard Greens
        if ingredients[0].lower() == "black-eyed peas" and "ham" in [i.lower() for i in ingredients] and "collard greens" in [i.lower() for i in ingredients]:
            title_en = "Southern Black-Eyed Peas and Greens"
            title_es = "Guisantes de Ojo Negro y Verduras al Estilo Sureño"
            steps_en = [
                "In a large pot, cook diced ham with a bit of oil until browned, about 5 minutes.",
                "Add chopped collard greens and cook until wilted, about 3 minutes.",
                "Stir in black-eyed peas, a pinch of smoked paprika, and a splash of broth.",
                "Simmer for 15 minutes until flavors meld together.",
                "Serve hot with cornbread on the side."
            ]
            steps_es = [
                "En una olla grande, cocina el jamón en cubos con un poco de aceite hasta que esté dorado, unos 5 minutos.",
                "Añade las acelgas picadas y cocina hasta que se marchiten, unos 3 minutos.",
                "Incorpora los guisantes de ojo negro, una pizca de pimentón ahumado y un chorrito de caldo.",
                "Cocina a fuego lento durante 15 minutos hasta que los sabores se mezclen.",
                "Sirve caliente con pan de maíz al lado."
            ]
            nutrition = {"calories": 300, "protein": 18, "fat": 10}
            title = title_es if language == 'spanish' else title_en
            steps = steps_es if language == 'spanish' else steps_en
            share_text_en = f"Check out my recipe: {title_en}\nIngredients: {', '.join(ingredients)}\nSteps:\n" + \
                            "\n".join([f"{i+1}. {step}" for i, step in enumerate(steps_en)]) + \
                            f"\nNutrition: {nutrition['calories']} kcal, {nutrition['protein']}g protein"
            share_text_es = f"Mira mi receta: {title_es}\nIngredientes: {', '.join(ingredients)}\nPasos:\n" + \
                            "\n".join([f"{i+1}. {step}" for i, step in enumerate(steps_es)]) + \
                            f"\nNutrición: {nutrition['calories']} kcal, {nutrition['protein']}g proteína"
            return jsonify({
                "title": title,
                "ingredients": ingredients,
                "steps": steps,
                "nutrition": nutrition,
                "shareText": share_text_es if language == 'spanish' else share_text_en
            })

    # Default recipe generation for other inputs
    if not ingredients:
        if language == 'spanish':
            return jsonify({
                "title": "Delicia Sorpresa",
                "steps": ["Calienta aceite en una sartén.", "Añade una proteína o verdura de tu elección.", "Cocina por 5-7 minutos.", "Sazona y sirve!"],
                "nutrition": {"calories": 250, "protein": 5, "fat": 5},
                "ingredients": ["¡Tu elección!"],
                "shareText": "Mira mi receta: Delicia Sorpresa\nIngredientes: ¡Tu elección!\nPasos:\n1. Calienta aceite en una sartén.\n2. Añade una proteína o verdura de tu elección.\n3. Cocina por 5-7 minutos.\n4. Sazona y sirve!\nNutrición: 250 kcal, 5g proteína"
            })
        return jsonify({
            "title": "Surprise Delight",
            "steps": ["Heat oil in a skillet.", "Add a protein or veggie of your choice.", "Cook for 5-7 minutes.", "Season and serve!"],
            "nutrition": {"calories": 250, "protein": 5, "fat": 5},
            "ingredients": ["Your choice!"],
            "shareText": "Check out my recipe: Surprise Delight\nIngredients: Your choice!\nSteps:\n1. Heat oil in a skillet.\n2. Add a protein or veggie of your choice.\n3. Cook for 5-7 minutes.\n4. Season and serve!\nNutrition: 250 kcal, 5g protein"
        })

    main = ingredients[0].capitalize()
    extras = ingredients[1:] if len(ingredients) > 1 else ["Surprise"]
    title_en = f"{main} {' '.join(extras).capitalize()} Delight"
    title_es = f"{main} {' '.join(extras).capitalize()} Delicia"
    steps_en = [
        f"Heat oil in a skillet over medium heat.",
        f"Add {main.lower()} and cook until browned, about 5-7 minutes.",
        f"Stir in {', '.join(extras).lower()} and cook for another 5 minutes.",
        "Season with salt, pepper, and your favorite spices.",
        "Serve hot and enjoy!"
    ]
    steps_es = [
        f"Calienta aceite en una sartén a fuego medio.",
        f"Añade {main.lower()} y cocina hasta que esté dorado, unos 5-7 minutos.",
        f"Incorpora {', '.join(extras).lower()} y cocina por otros 5 minutos.",
        "Sazona con sal, pimienta y tus especias favoritas.",
        "¡Sirve caliente y disfruta!"
    ]

    # Style adjustments
    if style == "cajun":
        title_en = f"Cajun {main} {' '.join(extras).capitalize()}"
        title_es = f"Cajún {main} {' '.join(extras).capitalize()}"
        steps_en[0] = "Heat oil in a skillet and add Cajun seasoning."
        steps_en[3] = "Season with Cajun spices, paprika, and a pinch of cayenne."
        steps_es[0] = "Calienta aceite en una sartén y añade condimento cajún."
        steps_es[3] = "Sazona con especias cajún, pimentón y una pizca de cayena."
    elif style == "latin":
        title_en = f"Latin {main} {' '.join(extras).capitalize()}"
        title_es = f"Latino {main} {' '.join(extras).capitalize()}"
        steps_en[0] = "Heat oil in a skillet with a splash of lime."
        steps_en[3] = "Season with cumin, cilantro, and chili powder."
        steps_es[0] = "Calienta aceite en una sartén con un toque de lima."
        steps_es[3] = "Sazona con comino, cilantro y chile en polvo."
    elif style == "asian":
        title_en = f"Asian {main} {' '.join(extras).capitalize()}"
        title_es = f"Asiático {main} {' '.join(extras).capitalize()}"
        steps_en[0] = "Heat sesame oil in a wok over high heat."
        steps_en[3] = "Season with soy sauce, ginger, and sesame seeds."
        steps_es[0] = "Calienta aceite de sésamo en un wok a fuego alto."
        steps_es[3] = "Sazona con salsa de soja, jengibre y semillas de sésamo."
    elif style == "mediterranean":
        title_en = f"Mediterranean {main} {' '.join(extras).capitalize()}"
        title_es = f"Mediterráneo {main} {' '.join(extras).capitalize()}"
        steps_en[0] = "Heat olive oil in a skillet over medium heat."
        steps_en[3] = "Season with oregano, thyme, and a drizzle of olive oil."
        steps_es[0] = "Calienta aceite de oliva en una sartén a fuego medio."
        steps_es[3] = "Sazona con orégano, tomillo y un chorrito de aceite de oliva."
    elif style == "indian":
        title_en = f"Indian {main} {' '.join(extras).capitalize()}"
        title_es = f"Indio {main} {' '.join(extras).capitalize()}"
        steps_en[0] = "Heat oil in a pan and add cumin seeds until they sizzle."
        steps_en[3] = "Season with turmeric, garam masala, and coriander."
        steps_es[0] = "Calienta aceite en una sartén y añade semillas de comino hasta que chisporroteen."
        steps_es[3] = "Sazona con cúrcuma, garam masala y cilantro."
    elif style == "french":
        title_en = f"French {main} {' '.join(extras).capitalize()}"
        title_es = f"Francés {main} {' '.join(extras).capitalize()}"
        steps_en[0] = "Heat butter in a skillet over medium heat."
        steps_en[3] = "Season with tarragon, thyme, and a splash of white wine."
        steps_es[0] = "Calienta mantequilla en una sartén a fuego medio."
        steps_es[3] = "Sazona con estragón, tomillo y un chorrito de vino blanco."
    elif style == "southern":
        title_en = f"Southern {main} {' '.join(extras).capitalize()}"
        title_es = f"Sureño {main} {' '.join(extras).capitalize()}"
        steps_en[0] = "Heat oil in a skillet with a touch of butter for that Southern flair."
        steps_en[3] = "Season with smoked paprika, garlic powder, and a pinch of cayenne for a Southern kick."
        steps_es[0] = "Calienta aceite en una sartén con un toque de mantequilla para ese toque sureño."
        steps_es[3] = "Sazona con pimentón ahumado, ajo en polvo y una pizca de cayena para un toque sureño."

    # Category adjustments
    if category == "dinner":
        steps_en[-1] = "Serve hot with a side of your choice and enjoy!"
        steps_es[-1] = "¡Sirve caliente con un acompañamiento de tu elección y disfruta!"
    elif category == "dessert":
        title_en = f"{main} {' '.join(extras).capitalize()} Dessert"
        title_es = f"Postre de {main} {' '.join(extras).capitalize()}"
        steps_en = [
            f"Preheat oven to 350°F (175°C).",
            f"Mix {main.lower()} with sugar and butter.",
            f"Add {', '.join(extras).lower()} and blend well.",
            "Bake for 20-25 minutes until golden.",
            "Cool slightly and serve with a sweet topping!"
        ]
        steps_es = [
            f"Precalienta el horno a 175°C.",
            f"Mezcla {main.lower()} con azúcar y mantequilla.",
            f"Añade {', '.join(extras).lower()} y mezcla bien.",
            "Hornea por 20-25 minutos hasta que esté dorado.",
            "¡Enfría un poco y sirve con un topping dulce!"
        ]
        nutrition["calories"] += 100  # Sweeter = more calories
    elif category == "breakfast":
        title_en = f"{main} {' '.join(extras).capitalize()} Breakfast"
        title_es = f"Desayuno de {main} {' '.join(extras).capitalize()}"
        steps_en = [
            f"Heat a non-stick skillet over medium heat.",
            f"Add {main.lower()} and cook until ready, about 5 minutes.",
            f"Mix in {', '.join(extras).lower()} and cook for another 2 minutes.",
            "Serve with toast or a side of fruit.",
            "Enjoy your hearty breakfast!"
        ]
        steps_es = [
            f"Calienta una sartén antiadherente a fuego medio.",
            f"Añade {main.lower()} y cocina hasta que esté listo, unos 5 minutos.",
            f"Incorpora {', '.join(extras).lower()} y cocina por otros 2 minutos.",
            "Sirve con tostadas o una guarnición de fruta.",
            "¡Disfruta de tu desayuno sustancioso!"
        ]
    elif category == "lunch":
        title_en = f"{main} {' '.join(extras).capitalize()} Lunch"
        title_es = f"Almuerzo de {main} {' '.join(extras).capitalize()}"
        steps_en[-1] = "Serve with a fresh salad or bread for a light lunch!"
        steps_es[-1] = "¡Sirve con una ensalada fresca o pan para un almuerzo ligero!"

    # Diet adjustments
    if diet == "vegan":
        steps_en[1] = f"Add plant-based {main.lower()} and cook until ready, about 5-7 minutes."
        steps_es[1] = f"Añade {main.lower()} basado en plantas y cocina hasta que esté listo, unos 5-7 minutos."
    elif diet == "gluten-free":
        steps_en[3] = "Season with gluten-free spices."
        steps_es[3] = "Sazona con especias sin gluten."
    if time == "quick":
        steps_en[2] = f"Stir in {', '.join(extras).lower()} and cook for 3 minutes."
        steps_es[2] = f"Incorpora {', '.join(extras).lower()} y cocina por 3 minutos."

    nutrition = {
        "calories": len(ingredients) * 150 + 100,
        "protein": len(ingredients) * 8 + 5,
        "fat": len(ingredients) * 5
    }

    title = title_es if language == 'spanish' else title_en
    steps = steps_es if language == 'spanish' else steps_en
    share_text_en = f"Check out my recipe: {title_en}\nIngredients: {', '.join(ingredients)}\nSteps:\n" + \
                    "\n".join([f"{i+1}. {step}" for i, step in enumerate(steps_en)]) + \
                    f"\nNutrition: {nutrition['calories']} kcal, {nutrition['protein']}g protein"
    share_text_es = f"Mira mi receta: {title_es}\nIngredientes: {', '.join(ingredients)}\nPasos:\n" + \
                    "\n".join([f"{i+1}. {step}" for i, step in enumerate(steps_es)]) + \
                    f"\nNutrición: {nutrition['calories']} kcal, {nutrition['protein']}g proteína"

    recipe = {
        "title": title,
        "ingredients": ingredients,
        "steps": steps,
        "nutrition": nutrition,
        "shareText": share_text_es if language == 'spanish' else share_text_en
    }
    return jsonify(recipe)

if __name__ == "__main__":
    app.run(debug=True)
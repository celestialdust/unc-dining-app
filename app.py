from flask import Flask, render_template, request

app = Flask(__name__)

def calculate_macros(age, weight, goal, activity_level, gender):
    # Basic metabolic rate (BMR) calculation without height
    if gender == "male":
        # Mifflin-St Jeor for males
        bmr = 10 * weight + 6.25 * 69 - 5 * age + 5  # Assuming average height for males
    else:
        # Mifflin-St Jeor for females
        bmr = 10 * weight + 6.25 * 64 - 5 * age - 161  # Assuming average height for females

    # Activity multipliers
    activity_multipliers = {
        "sedentary": 1.2,
        "lightly active": 1.375,
        "moderately active": 1.55,
        "very active": 1.725,
    }
    
    # Total daily energy expenditure (TDEE)
    tdee = bmr * activity_multipliers[activity_level]

    # Adjusting TDEE based on the user's goal
    if goal == "bulk":
        daily_calories = tdee + 250  # Surplus for bulking
    elif goal == "cut":
        daily_calories = tdee - 250  # Deficit for cutting
    else:  # maintain
        daily_calories = tdee

    # Macronutrient distribution (based on general guidelines)
    protein = weight * 0.8  # Protein: 0.8g per lb of body weight
    fats = daily_calories * 0.30 / 9  # Fats: 30% of total calories
    carbs = (daily_calories - (protein * 4 + fats * 9)) / 4  # Carbs: remaining calories

    # Convert values to metric for output
    return {
        "calories": round(daily_calories / 4.184, 2),  # Converting calories to kilojoules
        "protein": round(protein, 2),  # Protein in grams
        "fats": round(fats, 2),  # Fats in grams
        "carbs": round(carbs, 2)   # Carbs in grams
    }

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        try:
            age = int(request.form['age'])
            weight = int(request.form['weight'])
            goal = request.form['goal']
            activity_level = request.form['activity_level']
            gender = request.form['gender']
            
            # Debugging output to check received values
            print(f"Age: {age}, Weight: {weight}, Goal: {goal}, Activity Level: {activity_level}, Gender: {gender}")
            
            macros = calculate_macros(age, weight, goal, activity_level, gender)
            return render_template('results.html', macros=macros)
        except ValueError as e:
            print(f"ValueError: {e}")
            return "Invalid input data. Please make sure all fields are filled out correctly.", 400
        except KeyError as e:
            print(f"KeyError: {e}")
            return "Missing form data. Please ensure all fields are completed.", 400

    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True)

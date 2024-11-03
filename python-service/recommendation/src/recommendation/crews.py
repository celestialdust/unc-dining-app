import os
import json
import yaml
from crewai import Agent, Task, Crew, Process
from crewai_tools import BaseTool
import psycopg2
from typing import Dict, List
import os
import json

files = {
    'agents': 'config/agents.yaml',
    'tasks': 'config/tasks.yaml'
}

configs = {}
for config_type, file_path in files.items():
    with open(file_path, 'r') as file:
        configs[config_type] = yaml.safe_load(file)

# Assign loaded configurations to specific variables
agents_config = configs['agents']
tasks_config = configs['tasks']

# Database connection function
def get_db_connection():
    return psycopg2.connect(
        dbname='nutritrack',
        user='postgres',
        password='joey0720',
        host='localhost',
        port='5432'
    )

class UserDataTool(BaseTool):
    name: str = "User Data Fetcher"
    description: str = "Fetches user profile data including dietary preferences and restrictions from the database."

    def _run(self,user_id = 1) -> dict:
        """
        Fetch user data from the database.
        """
        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                cur.execute("""
                    SELECT 
                        id, name, height, weight, age, 
                        dietary_restrictions, nutrition_goals, activity_level
                    FROM users 
                    WHERE id = %s
                """, (user_id,))
                
                result = cur.fetchone()
                if not result:
                    return {
                        "error": f"No user found with ID {user_id}",
                        "success": False
                    }
                
                # Calculate BMR using Harris-Benedict equation
                bmr = 10 * result[3] + 6.25 * result[2] - 5 * result[4]
                activity_multipliers = {
                    1: 1.2,
                    2: 1.375,
                    3: 1.55,
                    4: 1.725,
                    5: 1.9
                }
                
                daily_calories = bmr * activity_multipliers.get(result[7], 1.55)
                
                return {
                    "success": True,
                    "user_data": {
                        "id": result[0],
                        "name": result[1],
                        "height": result[2],
                        "weight": result[3],
                        "age": result[4],
                        "dietary_restrictions": result[5] if result[5] else [],
                        "nutrition_goals": result[6],
                        "activity_level": result[7],
                        "calculated_needs": {
                            "daily_calories": round(daily_calories),
                            "daily_protein": round(daily_calories * 0.3 / 4),
                            "daily_carbs": round(daily_calories * 0.4 / 4),
                            "daily_fat": round(daily_calories * 0.3 / 9)
                        }
                    }
                }
        finally:
            conn.close()

class MenuItemsTool(BaseTool):
    name: str = "Menu Items Fetcher"
    description: str = "Fetches menu items and their nutritional information from the database."

    def _run(self, params: Dict = None) -> dict:
        """
        Fetch menu items with optional filtering.
        """
        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                query = """
                    SELECT 
                        id, name, dining_hall, calories, protein, 
                        fat, carbs, is_vegetarian, is_vegan
                    FROM menu_items
                    WHERE 1=1
                """
                query_params = []
                
                if isinstance(params, dict):
                    if params.get('dining_hall'):
                        query += " AND dining_hall = %s"
                        query_params.append(params['dining_hall'])
                    if params.get('is_vegetarian'):
                        query += " AND is_vegetarian = TRUE"
                    if params.get('is_vegan'):
                        query += " AND is_vegan = TRUE"
                    if params.get('max_calories'):
                        query += " AND calories <= %s"
                        query_params.append(params['max_calories'])
                    if params.get('min_protein'):
                        query += " AND protein >= %s"
                        query_params.append(params['min_protein'])

                cur.execute(query, query_params)
                results = cur.fetchall()
                
                menu_items = [{
                    "id": row[0],
                    "name": row[1],
                    "dining_hall": row[2],
                    "nutritional_info": {
                        "calories": row[3],
                        "protein": row[4],
                        "fat": row[5],
                        "carbs": row[6]
                    },
                    "dietary_info": {
                        "is_vegetarian": row[7],
                        "is_vegan": row[8]
                    }
                } for row in results]

                return {
                    "success": True,
                    "menu_items": menu_items,
                    "total_items": len(menu_items)
                }
        finally:
            conn.close()


data_collector = Agent(
	role="Data Collection Expert",
	goal="Gather and organize user preferences and menu data",
	backstory="Expert in collecting and organizing dietary and menu information",
	tools=[ UserDataTool(), MenuItemsTool()]
)

analyzer = Agent(
	role="Nutrition Analyzer",
	goal="Analyze dietary needs and menu options",
	backstory="Expert nutritionist specializing in dietary analysis",
	tools=[MenuItemsTool()]
)

recommender = Agent(
	role="Menu Recommender",
	goal="Generate personalized menu recommendations",
	backstory="Expert in creating personalized meal plans",
	tools=[MenuItemsTool()]
)
    
data_collection = Task(
	config = tasks_config['data_collection'],
	agent=data_collector
)
    
analysis = Task(
	config = tasks_config['nutritional_analysis'],
	agent=analyzer
)
    
recommendation = Task(
	config = tasks_config['recommendation_generation'],
	agent=recommender,
	context=[data_collection, analysis]
)

crews = Crew(
	agents=[data_collector, analyzer, recommender],
	tasks=[data_collection, analysis, recommendation],
	process=Process.sequential,
	verbose=True
)

inputs = {
        'user_id': 1,
        'prompt': 'What is the weather in Tokyo?'
    }

results = crews.kickoff(inputs=inputs)
print(results)
    
        

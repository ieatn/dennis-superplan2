from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from openai import OpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_community.utilities import SQLDatabase
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_openai import ChatOpenAI
import os
import json
import mysql.connector
from mysql.connector import pooling

# Load environment variables and initialize Flask app
load_dotenv()
app = Flask(__name__)
CORS(app)

# Database configuration
db_config = {
    'host': os.getenv('DB_HOST'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD'),
    'database': os.getenv('DB_DATABASE')
}

# Create connection pool
connection_pool = pooling.MySQLConnectionPool(pool_name="mypool", pool_size=10, **db_config)

# OpenAI configuration
api_key = os.getenv('OPENAI_API_KEY')
client = OpenAI(api_key=api_key)

# Database URI for SQLDatabase
db_uri = f"mysql+mysqlconnector://{db_config['user']}:{db_config['password']}@{db_config['host']}:3306/{db_config['database']}"
db = SQLDatabase.from_uri(db_uri)

# Langchain setup
template = """
Based on the table schema below, write a SQL query that would answer the user's question.
{schema}
Question: {question}
SQL Query
"""

prompt = ChatPromptTemplate.from_template(template)

def get_schema(_):
    return db.get_table_info()

llm = ChatOpenAI()
sql_chain = (
    RunnablePassthrough.assign(schema=get_schema)
    | prompt
    | llm.bind(stop='\nSQL Result:')
    | StrOutputParser()
)

# Chat mode
mode = "chat"

@app.route('/chat', methods=['POST'])
def chat():
    global mode
    data = request.json
    user_message = data.get('message')
    received_mode = data.get('mode')

    if received_mode:
        mode = received_mode

    if user_message:
        if mode == "chat":
            response = client.chat.completions.create(
                messages=[{"role": "user", "content": user_message}],
                model="gpt-3.5-turbo",
            ).choices[0].message.content.strip()
        elif mode == "database":
            response = full_chain.invoke({'question': user_message})
        return jsonify({'response': response})

    return jsonify({'error': 'No message provided'}), 400

def fetch_assets(id):
    if id is None:
        return jsonify({'error': 'folder_id is required'}), 400
    with connection_pool.get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute("USE superplan_dev")
            cursor.execute("SELECT asset_id, folder_id, name, unit_owned, share_price, liability, cusip, asset_type_id, symbol FROM assets WHERE folder_id = %s", (id,))
            results = cursor.fetchall()
            assets = []
            for row in results:
                asset_id, folder_id, name, share_price, unit_owned, liability, cusip, asset_type_id, symbol = row
                assets.append({
                    'asset_id': asset_id,
                    'folder_id': folder_id,
                    'name': name,
                    'share_price': share_price,
                    'unit_owned': unit_owned,
                    'liability': liability,
                    'cusip': cusip,
                    'asset_type_id': asset_type_id,
                    'symbol': symbol
                })
            return assets

@app.route('/fetch_assets/<int:id>', methods=['GET'])
def fetch_all_assets(id):
    assets = fetch_assets(id)
    return jsonify(assets)

@app.route('/fetch_folders/<int:id>', methods=['GET'])
def fetch_folders(id):
    if id is None:
        return jsonify({'error': 'client_id is required'}), 400
    with connection_pool.get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute("USE superplan_dev")
            cursor.execute("SELECT folder_id, folder_name FROM folders WHERE client_id = %s", (id,))
            results = cursor.fetchall()
            folders = []
            for row in results:
                folder_id, folder_name = row
                folders.append({
                    'folder_id': folder_id,
                    'folder_name': folder_name
                })
            return jsonify(folders)

@app.route('/fetch_clients', methods=['GET'])
def fetch_clients():
    with connection_pool.get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute("USE superplan_dev")
            cursor.execute("SELECT client_id, first_name1, last_name1 FROM clients")
            results = cursor.fetchall()
            clients = [{'client_id': client_id, 'first_name1': first_name1, 'last_name1': last_name1} for (client_id, first_name1, last_name1) in results]
            return jsonify(clients)

# questionnaire api
@app.route('/get_results', methods=['GET'])
def get_results():
    client_id = request.args.get('client_id')

    with connection_pool.get_connection() as conn:
        with conn.cursor(dictionary=True) as cursor:
            # Fetch results based on client_id
            cursor.execute("""
                SELECT * FROM client_questionnaire
                WHERE client_id = %s
            """, (client_id,))

            results = cursor.fetchall()

    return jsonify(results), 200

@app.route('/submit_questionnaire', methods=['POST'])
def submit_questionnaire():
    data = request.json

    client_id = data.get('client_id')
    question1 = json.dumps(data.get('question1', []))
    question2 = json.dumps(data.get('question2', []))
    question3 = json.dumps(data.get('question3', []))
    question4 = json.dumps(data.get('question4', []))
    question5 = json.dumps(data.get('question5', []))
    question6 = json.dumps(data.get('question6', []))

    with connection_pool.get_connection() as conn:
        with conn.cursor() as cursor:
            # Insert data
            cursor.execute("""
                INSERT INTO client_questionnaire (client_id, question1, question2, question3, question4, question5, question6)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (client_id, question1, question2, question3, question4, question5, question6))

            conn.commit()

    app.logger.info("Data inserted successfully")
    return jsonify({'status': 'success'}), 200

@app.route('/delete_data', methods=['DELETE'])
def delete_data():
    client_id = request.args.get('client_id')

    with connection_pool.get_connection() as conn:
        with conn.cursor() as cursor:
            # Delete data based on client_id
            cursor.execute("""
                DELETE FROM client_questionnaire
                WHERE client_id = %s
            """, (client_id,))

            conn.commit()

    return jsonify({'status': 'success', 'message': f'Deleted data for client_id {client_id}'}), 200

@app.route('/update_data', methods=['PUT'])
def update_data():
    data = request.get_json()  # Assuming data is sent as JSON from frontend
    client_id = data.get('client_id')
    
    if not client_id:
        return jsonify({"error": "client_id is required"}), 400
    
    with connection_pool.get_connection() as conn:
        with conn.cursor(dictionary=True) as cursor:
            # Retrieve existing data
            cursor.execute("SELECT * FROM client_questionnaire WHERE client_id = %s", (client_id,))
            existing_data = cursor.fetchone()
            
            if not existing_data:
                return jsonify({"error": "client_id not found"}), 404
            
            # Use existing data for fields not provided in the incoming request
            question1 = json.dumps(data.get('question1', json.loads(existing_data['question1'])))
            question2 = json.dumps(data.get('question2', json.loads(existing_data['question2'])))
            question3 = json.dumps(data.get('question3', json.loads(existing_data['question3'])))
            question4 = json.dumps(data.get('question4', json.loads(existing_data['question4'])))
            question5 = json.dumps(data.get('question5', json.loads(existing_data['question5'])))
            question6 = json.dumps(data.get('question6', json.loads(existing_data['question6'])))
            
            # Construct SQL query
            update_query = """
                UPDATE client_questionnaire
                SET 
                    question1 = %s,
                    question2 = %s,
                    question3 = %s,
                    question4 = %s,
                    question5 = %s,
                    question6 = %s
                WHERE client_id = %s
            """
            
            # Execute SQL query
            try:
                cursor.execute(update_query, (
                    question1, question2,
                    question3, question4, question5, question6,
                    client_id
                ))
                conn.commit()
                return jsonify({"message": "Data updated successfully"})
            except Exception as e:
                conn.rollback()
                return jsonify({"error": str(e)})

# card game board api
@app.route('/get_cards', methods=['GET'])
def get_cards():
    try:
        client_id = request.args.get('client_id')
        if not client_id:
            return jsonify({'status': 'error', 'message': 'client_id is required'}), 400
        
        with connection_pool.get_connection() as conn:
            cursor = conn.cursor(dictionary=True)  # Use dictionary=True to get results as dictionaries
            cursor.execute('SELECT id, client_id, board_id, card_id, card_description FROM financial_philosophy WHERE client_id = %s', (client_id,))
            data = cursor.fetchall()
            
            return jsonify(data), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/save_cards', methods=['POST'])
def save_cards():
    try:
        data = request.json
        client_id = data.get('client_id')
        boards = data.get('boards')

        with connection_pool.get_connection() as conn:
            cursor = conn.cursor()
            for board_id, cards in boards.items():
                for card in cards:
                    card_id = card.get('id')
                    card_description = f"{card.get('frontText')} - {card.get('backText')}"
                    cursor.execute('''
                        INSERT INTO financial_philosophy (client_id, board_id, card_id, card_description)
                        VALUES (%s, %s, %s, %s)
                    ''', (client_id, board_id, card_id, card_description))
            conn.commit()

        return jsonify({'status': 'success'}), 200
    except Exception as e:
        response = jsonify({'status': 'error', 'message': str(e)})
        return response, 500

@app.route('/delete_cards', methods=['DELETE'])
def delete_cards():
    try:
        client_id = request.args.get('client_id')
        if not client_id:
            return jsonify({'status': 'error', 'message': 'client_id is required'}), 400
        
        with connection_pool.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('DELETE FROM financial_philosophy WHERE client_id = %s', (client_id,))
            conn.commit()

        response = jsonify({'status': 'success'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200
    except Exception as e:
        response = jsonify({'status': 'error', 'message': str(e)})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 500

@app.route('/update_cards', methods=['PUT'])
def update_cards():
    try:
        data = request.json
        client_id = data.get('client_id')
        boards = data.get('boards')

        with connection_pool.get_connection() as conn:
            cursor = conn.cursor()
            # Delete all existing cards for the given client_id
            cursor.execute('DELETE FROM financial_philosophy WHERE client_id = %s', (client_id,))
            
            # Insert all new cards
            for board_id, cards in boards.items():
                for card in cards:
                    card_id = card.get('id')
                    card_description = f"{card.get('frontText')} - {card.get('backText')}"
                    cursor.execute('''
                        INSERT INTO financial_philosophy (client_id, board_id, card_id, card_description)
                        VALUES (%s, %s, %s, %s)
                    ''', (client_id, board_id, card_id, card_description))
            conn.commit()

        return jsonify({'status': 'success'}), 200
    except Exception as e:
        response = jsonify({'status': 'error', 'message': str(e)})
        return response, 500

# scenarios api
@app.route('/get_scenarios', methods=['GET'])
def get_scenarios():
    with connection_pool.get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute("USE superplan_dev")
            query = "SELECT * FROM scenarios"
            cursor.execute(query)
            results = cursor.fetchall()

            scenario_data = []
            for row in results:
                client_id, scenario_id, tree_data, scenario_name = row
                scenario_data.append({
                    'client_id': client_id,
                    'scenario_id': scenario_id,
                    'tree_data': tree_data,
                    'scenario_name': scenario_name
                })
            return jsonify(scenario_data)

@app.route('/get_one_scenario', methods=['GET'])
def get_scenario():
    scenario_id = request.args.get('scenario_id')
    if not scenario_id:
        return jsonify({'error': 'scenario_id is required'}), 400

    with connection_pool.get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute("USE superplan_dev")
            query = "SELECT client_id, scenario_id, tree_data, scenario_name FROM scenarios WHERE scenario_id = %s"
            cursor.execute(query, (scenario_id,))
            results = cursor.fetchall()

            scenario_data = []
            for row in results:
                client_id, scenario_id, tree_data, scenario_name = row
                scenario_data.append({
                    'client_id': client_id,
                    'scenario_id': scenario_id,
                    'tree_data': tree_data,
                    'scenario_name': scenario_name
                })
            return jsonify(scenario_data)

@app.route('/create_scenario', methods=['POST'])
def create_scenario():
    data = request.get_json()
    client_id = data.get('client_id')
    scenario_id = data.get('scenario_id')
    tree_data = data.get('tree_data')
    scenario_name = data.get('scenario_name')

    if not all([client_id, scenario_id, tree_data]):
        return jsonify({'error': 'Missing data'}), 400
    
    tree_data_json = json.dumps(tree_data)

    with connection_pool.get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute("USE superplan_dev")

            # check if scenario already exists
            query = "SELECT COUNT(*) FROM scenarios WHERE scenario_id = %s"
            cursor.execute(query, (scenario_id,))
            result = cursor.fetchone()
            if result[0] > 0:
                return jsonify({'error': 'Scenario already exists'}), 409
            else:
                query = "INSERT INTO scenarios (client_id, scenario_id, tree_data, scenario_name) VALUES (%s, %s, %s, %s)"
                cursor.execute(query, (client_id, scenario_id, tree_data_json, scenario_name))
                conn.commit()
                return jsonify({'message': 'Scenario created successfully'}), 201

@app.route('/delete_scenario', methods=['DELETE'])
def delete_scenario():
    scenario_id = request.args.get('scenario_id')
    if not scenario_id:
        return jsonify({'error': 'scenario_id is required'}), 400

    with connection_pool.get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute("USE superplan_dev")
            query = "DELETE FROM scenarios WHERE scenario_id = %s"
            cursor.execute(query, (scenario_id,))
            conn.commit()

            return jsonify({'message': 'Scenario deleted successfully'}), 200

@app.route('/update_scenario', methods=['PUT'])
def update_scenario():
    data = request.get_json()
    scenario_id = data.get('scenario_id')
    tree_data = data.get('tree_data')
    scenario_name = data.get('scenario_name')

    if not all([scenario_id, tree_data]):
        return jsonify({'error': 'Missing data'}), 400
    
    tree_data_json = json.dumps(tree_data)

    with connection_pool.get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute("USE superplan_dev")
            query = "UPDATE scenarios SET tree_data = %s, scenario_name = %s WHERE scenario_id = %s"
            cursor.execute(query, (tree_data_json, scenario_name, scenario_id))
            conn.commit()

            return jsonify({'message': 'Scenario updated successfully'}), 200

if __name__ == '__main__':
    app.run(port=5000)
from flask import Flask, render_template, request, redirect, url_for, jsonify
import sqlite3

app = Flask(__name__)
DATABASE = 'database.db'

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS clients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/clients', methods=['GET'])
def get_clients():
    conn = get_db_connection()
    clients = conn.execute('SELECT * FROM clients').fetchall()
    conn.close()
    return jsonify([dict(client) for client in clients])

@app.route('/clients', methods=['POST'])
def add_client():
    data = request.get_json()
    name = data['name']
    email = data['email']
    conn = get_db_connection()
    conn.execute('INSERT INTO clients (name, email) VALUES (?, ?)', (name, email))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Client added successfully!'})

@app.route('/clients/<int:id>', methods=['PUT'])
def update_client(id):
    data = request.get_json()
    name = data['name']
    email = data['email']
    conn = get_db_connection()
    conn.execute('UPDATE clients SET name = ?, email = ? WHERE id = ?', (name, email, id))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Client updated successfully!'})

@app.route('/clients/<int:id>', methods=['DELETE'])
def delete_client(id):
    conn = get_db_connection()
    conn.execute('DELETE FROM clients WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Client deleted successfully!'})

if __name__ == '__main__':
    init_db()
    app.run(debug=True)

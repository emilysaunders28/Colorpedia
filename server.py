from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from sqlalchemy.orm.attributes import flag_modified
from werkzeug.security import generate_password_hash, check_password_hash
import json

app = Flask(
    __name__,
    static_folder='client/build',
    static_url_path='/'
)

app.secret_key = '4d9a9fa7d22a7bb23469d1ec927ed0b244fc0f6d03f4ac3eab2795e2156c5d8c'

login_manager = LoginManager()
login_manager.init_app(app)

# Configure SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

@app.before_first_request
def initialize_sqlite():
    # creates users.db (if missing) and all tables
    db.create_all()
    
# Define User model
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    quiz_data = db.Column(db.JSON, nullable=False)  # Stores both quiz answers and progress

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __init__(self, username, quiz_data):
        self.username = username
        self.quiz_data = quiz_data


# User loader function
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Create the database and tables (if they don't already exist)
with app.app_context():
    db.create_all()

# Load the content data
path = 'backend/content.json'

with open(path, 'r') as json_file:
    data = json.load(json_file)

answers = data['answers']

def generate_user_array():
    quiz_array = {
        'hue': ['' for _ in range(3)],
        'shade': ['' for _ in range(3)],
        'tint': ['' for _ in range(3)],
        'tone': ['' for _ in range(3)],
        'chroma_saturation': ['' for _ in range(3)],
        'value': ['' for _ in range(3)],
        'contrast': ['' for _ in range(3)],
        'final': ['' for _ in range(10)]
    }
    progress = {
        'hue': False,
        'shade': False,
        'tint': False,
        'tone': False,
        'chroma_saturation': False,
        'value': False,
        'contrast': False,
        'final': False
    }
    return {'quiz': quiz_array, 'progress': progress}


@login_manager.unauthorized_handler
def unauthorized_callback():
    return jsonify({'error': 'User not logged in'}), 401


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path):
    return app.send_static_file('index.html')


# Fetch user data refactored
@app.route('/data/user')
def user_data():
    if not current_user.is_authenticated:
        return jsonify(data={'user': None})
    else:
        username= current_user.username
        if username:
            user = User.query.filter_by(username=username).first()
            if user:
                return jsonify(data={'user': user.username, 'quiz_data': user.quiz_data})
        return jsonify(data={'user': username})


# Fetch content from the server
@app.route("/data/<type>/<term>")
def fetch(type,term):
    pages = data[term][type]
    return jsonify(data=pages)

# Login refactored
@app.route('/login', methods=['POST'])
def login():
    json_data = request.get_json()
    username = json_data['user']
    password = json_data['password']
    print(f"Attempting to log in user: {username}")
    user = User.query.filter_by(username=username).first()
    if user and user.check_password(password):
        login_user(user)
        print(f"User {user.username} logged in successfully.")
        return jsonify(data={'user': current_user.username, 'quiz_data': user.quiz_data})
    elif not user:
        return jsonify(data={'error': 'Not an existing user'}), 400
    elif not user.check_password(password):
        return jsonify(data={'error': 'Incorrect password'}), 400


# Create a new user refactored
@app.route('/create', methods=['POST'])
def add_user():
    json_data = request.get_json()
    new_username = json_data['newUser']
    new_password = json_data['newPassword']

    if User.query.filter_by(username=new_username).first():
        return jsonify(data={'error': 'This user name is already taken'}), 400
    else:
        new_user = User(username=new_username, quiz_data=generate_user_array())
        new_user.set_password(new_password)
        db.session.add(new_user)
        db.session.commit()
        login_user(new_user)
        return jsonify(data={'user': new_user.username, 'quiz_data': new_user.quiz_data})

# Logout refactored
@app.route('/logout')
def logout():
    logout_user()
    return jsonify(data={'user': None})

# Quiz refactored
@app.route('/quiz', methods=['POST'])
@login_required
def quiz():
    global answers
    json_data = request.get_json()
    term = json_data['question']['term']
    question_id = json_data['question']['id']
    selected = json_data['selected']

    username = current_user.username
    if not username:
        return jsonify({'error': 'User not logged in'}), 401
    
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({'error': f'User {username} not found'}), 400

    # Update quiz data
    quiz_data = user.quiz_data
    quiz_data['quiz'][term][int(question_id) - 1] = selected
    quiz_data['progress'][term] = (quiz_data['quiz'][term] == answers[term])

    user.quiz_data = quiz_data
    flag_modified(user, 'quiz_data')
    db.session.commit()

    return jsonify(data={'user': user.username, 'quiz_data': user.quiz_data})



# For testing purposes
@app.route('/users', methods=['GET'])
def list_users():
    all_users = User.query.all()
    # Create a list of usernames (or more detailed info as needed)
    user_list = [user.username for user in all_users]
    return jsonify(users=user_list)


@app.route('/quiz_data', methods=['GET'])
@login_required
def quiz_data():
    
    username = current_user.username
    if not username:
        return jsonify({'error': 'User not logged in'}), 401
    user = User.query.filter_by(username=username).first()
    # Create a list of usernames (or more detailed info as needed)
    quiz_data = user.quiz_data
    return jsonify(quiz_data=quiz_data)


if __name__ == "__main__":
    app.run(debug=True)
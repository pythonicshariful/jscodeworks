import os
from flask import Flask, request, jsonify
from models import db, User
from flask_login import LoginManager
from seed_data import seed_database

# Load .env file at startup
def _load_env():
    env_path = os.path.join(os.path.dirname(__file__), '.env')
    if os.path.exists(env_path):
        with open(env_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    k, v = line.split('=', 1)
                    os.environ[k.strip()] = v.strip()

_load_env()
from routes.public import public_bp
from routes.admin import admin_bp
from routes.auth import auth_bp
import time

# Simple Rate Limiter in Memory
IP_REQUEST_LOG = {}

def create_app():
    app = Flask(__name__, template_folder='templates', static_folder='static')
    app.config['SECRET_KEY'] = 'jscodeworks_ultra_secure_secret_key_2026'
    
    # Security Configuration
    app.config['SESSION_COOKIE_HTTPONLY'] = True
    app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
    app.config['REMEMBER_COOKIE_HTTPONLY'] = True

    # SQLite Database URI inside workspace
    db_path = os.path.join(os.path.dirname(__file__), 'database.db')
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)

    login_manager = LoginManager()
    login_manager.login_view = 'auth.darkwolf_login'
    login_manager.login_message_category = 'warning'
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    # Security & Performance Middleware
    @app.before_request
    def rate_limiting_middleware():
        # Rate limit contact submission & login endpoints to prevent spam & brute-force
        if request.endpoint in ['public.submit_contact', 'auth.darkwolf_login', 'auth.verify_otp'] and request.method == 'POST':
            ip = request.remote_addr
            now = time.time()
            timestamps = IP_REQUEST_LOG.get(ip, [])
            # Filter timestamps in last 60 seconds
            timestamps = [t for t in timestamps if now - t < 60]
            if len(timestamps) >= 6: # max 6 submissions/auth attempts per minute per IP
                return jsonify({"status": "error", "message": "Rate limit exceeded. Please wait a minute before trying again."}), 429
            timestamps.append(now)
            IP_REQUEST_LOG[ip] = timestamps

    @app.after_request
    def apply_security_and_caching_headers(response):
        # Enterprise Security Headers
        response.headers['X-Frame-Options'] = 'SAMEORIGIN'
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['X-XSS-Protection'] = '1; mode=block'
        response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        
        # Static Asset Cache Optimization
        if request.path.startswith('/static/'):
            response.headers['Cache-Control'] = 'public, max-age=31536000, immutable'

        return response

    app.register_blueprint(public_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(auth_bp)

    with app.app_context():
        db.create_all()
        seed_database()

    return app

app = create_app()

if __name__ == '__main__':
    print("=========================================================")
    print("JS CodeWorks Web Application & Dynamic CMS Starting...")
    print("Public Landing Showcase: http://127.0.0.1:5000")
    print("Admin CMS Panel:         http://127.0.0.1:5000/admin")
    print("Default Admin Login:     Username: admin | Password: admin123")
    print("=========================================================")
    app.run(debug=True, host='127.0.0.1', port=5000)

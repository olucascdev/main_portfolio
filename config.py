
import os
from dotenv import load_dotenv

load_dotenv() 

BASE_DIR = os.path.dirname(os.path.abspath(__file__)) # Caminhos do projeto

DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_PORT = int(os.getenv('DB_PORT', 3306))
DB_DATABASE = os.getenv('DB_DATABASE', 'portfolio_db')
DB_USERNAME = os.getenv('DB_USERNAME', 'portfolio_user')
DB_PASSWORD = os.getenv('DB_PASSWORD', 'portfolio_pass')

SQLALCHEMY_DATABASE_URI = f"mysql+pymysql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_DATABASE}?charset=utf8mb4"
DB_CHARSET = 'utf8mb4'

SQLALCHEMY_TRACK_MODIFICATIONS = False

SQLALCHEMY_ENGINE_OPTIONS = {
    'pool_pre_ping': True,  # Testa conexão antes de usar
    'pool_recycle': 3600,   # Recicla conexões após 1 hora
}

# Configurações do Flask
DEBUG = os.getenv('FLASK_DEBUG', '1') == '1'
SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key')

# Upload de arquivos
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'app', 'static', 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  
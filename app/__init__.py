from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    
    app.config.from_object('config')
    
    db.init_app(app)
    migrate.init_app(app, db)
    
    with app.app_context():
         from app.models import (
            Profile, Skill, Experience, Project, 
            Article, Tag, SocialLink, AdminUser
        )
    
    from app.routes.main import main_bp
    from app.routes.blog import blog_bp
    
    app.register_blueprint(main_bp)
    app.register_blueprint(blog_bp)
    
    return app
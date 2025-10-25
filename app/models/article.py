from app import db
from datetime import datetime

# Tabela de associação (Many-to-Many)
article_tags = db.Table('article_tags',
    db.Column('article_id', db.Integer, db.ForeignKey('articles.id'), primary_key=True),
    db.Column('tag_id', db.Integer, db.ForeignKey('tags.id'), primary_key=True)
)

class Article(db.Model):
    __tablename__ = 'articles'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    subtitle = db.Column(db.String(255))
    slug = db.Column(db.String(255), unique=True, nullable=False, index=True)
    content = db.Column(db.Text, nullable=False)
    thumbnail = db.Column(db.String(255))
    read_time = db.Column(db.Integer, default=0)
    views = db.Column(db.Integer, default=0)
    published = db.Column(db.Boolean, default=False, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamento Many-to-Many com tags
    tags = db.relationship('Tag', secondary=article_tags, lazy='subquery',
                          backref=db.backref('articles', lazy=True))
    
    def __repr__(self):
        return f'<Article {self.title}>'
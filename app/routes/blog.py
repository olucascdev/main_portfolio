from flask import Blueprint, render_template

blog_bp = Blueprint('blog', __name__)

@blog_bp.route("/blog")
def blog_index():
    return render_template("blog/main.html")

@blog_bp.route('/blog/article/<int:article_id>')
def show_article(article_id):
    return render_template("blog/article.html", article_id=article_id)
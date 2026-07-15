from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import json

db = SQLAlchemy()

class User(UserMixin, db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(20), default='admin')
    two_factor_enabled = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class HeroSection(db.Model):
    __tablename__ = 'hero_section'
    id = db.Column(db.Integer, primary_key=True)
    badge_text = db.Column(db.String(100), default="Next-Gen Software Studio")
    headline = db.Column(db.String(255), default="Engineering Software Beyond Expectations")
    subheadline = db.Column(db.Text, default="We build intelligent software solutions that transform ideas into powerful digital products.")
    cta_primary_text = db.Column(db.String(50), default="Start Your Project")
    cta_primary_link = db.Column(db.String(200), default="#contact")
    cta_secondary_text = db.Column(db.String(50), default="Explore Portfolio")
    cta_secondary_link = db.Column(db.String(200), default="#portfolio")
    python_code_lines = db.Column(db.Text, default=json.dumps([
        "class JSCodeWorksEngine:",
        "    def __init__(self):",
        "        self.status = 'INITIALIZED'",
        "        self.capabilities = ['AI', 'Cloud', 'Web', 'Mobile']",
        "",
        "    def deploy_world_class(self, client_idea):",
        "        product = self.compile_solution(client_idea)",
        "        return product.scale(to='infinity')",
        "",
        "engine = JSCodeWorksEngine()",
        "engine.deploy_world_class('Your Dream Software')"
    ]))

class AboutSection(db.Model):
    __tablename__ = 'about_section'
    id = db.Column(db.Integer, primary_key=True)
    tagline = db.Column(db.String(100), default="Pioneering Digital Architectures")
    title = db.Column(db.String(255), default="Where World-Class Code Meets Futuristic Design")
    team_section_tag = db.Column(db.String(100), default="// FOUNDERS & LEADERSHIP")
    team_section_title = db.Column(db.String(255), default="The Engineering Architects")
    story = db.Column(db.Text)
    mission = db.Column(db.Text)
    vision = db.Column(db.Text)
    core_values_json = db.Column(db.Text)
    timeline_json = db.Column(db.Text)

class Service(db.Model):
    __tablename__ = 'services'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    icon_3d = db.Column(db.String(50), default="code")
    short_desc = db.Column(db.Text, nullable=False)
    full_desc = db.Column(db.Text)
    capabilities_json = db.Column(db.Text)
    border_glow_color = db.Column(db.String(30), default="#2563EB")
    order = db.Column(db.Integer, default=0)

class Project(db.Model):
    __tablename__ = 'projects'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    slug = db.Column(db.String(150), unique=True, nullable=False)
    tagline = db.Column(db.String(255))
    category = db.Column(db.String(50), default="Web Development")
    description = db.Column(db.Text)
    client_name = db.Column(db.String(100))
    image_url = db.Column(db.String(255))
    preview_video_url = db.Column(db.String(255))
    tech_stack_json = db.Column(db.Text)
    live_url = db.Column(db.String(255))
    github_url = db.Column(db.String(255))
    device_type = db.Column(db.String(20), default="laptop")
    is_featured = db.Column(db.Boolean, default=True)
    order = db.Column(db.Integer, default=0)

class BlogPost(db.Model):
    __tablename__ = 'blog_posts'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    slug = db.Column(db.String(255), unique=True, nullable=False)
    category = db.Column(db.String(50), default="Engineering")
    excerpt = db.Column(db.Text)
    content = db.Column(db.Text)
    cover_image = db.Column(db.String(255))
    author_name = db.Column(db.String(100), default="JS CodeWorks Team")
    tags_json = db.Column(db.Text)
    read_time = db.Column(db.String(20), default="5 min read")
    view_count = db.Column(db.Integer, default=0)
    is_published = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class TechItem(db.Model):
    __tablename__ = 'tech_items'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    category = db.Column(db.String(50), default="Backend")
    icon_svg = db.Column(db.Text)
    color = db.Column(db.String(30), default="#06B6D4")
    orbit_radius = db.Column(db.Float, default=3.5)
    speed = db.Column(db.Float, default=1.0)
    order = db.Column(db.Integer, default=0)

class TeamMember(db.Model):
    __tablename__ = 'team_members'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(100), nullable=False)
    bio = db.Column(db.Text)
    image_url = db.Column(db.String(255))
    social_links_json = db.Column(db.Text)
    is_founder = db.Column(db.Boolean, default=False)
    order = db.Column(db.Integer, default=0)

class Testimonial(db.Model):
    __tablename__ = 'testimonials'
    id = db.Column(db.Integer, primary_key=True)
    client_name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(100))
    company = db.Column(db.String(100))
    photo_url = db.Column(db.String(255))
    content = db.Column(db.Text, nullable=False)
    rating = db.Column(db.Integer, default=5)
    order = db.Column(db.Integer, default=0)

class ContactMessage(db.Model):
    __tablename__ = 'contact_messages'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    subject = db.Column(db.String(200))
    message = db.Column(db.Text, nullable=False)
    service_interest = db.Column(db.String(100))
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class ContactSettings(db.Model):
    __tablename__ = 'contact_settings'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), default="contact@jscodeworks.com")
    phone = db.Column(db.String(50), default="+880 1700-000000")
    whatsapp_number = db.Column(db.String(50), default="+8801700000000")
    office_address = db.Column(db.Text, default="High-Tech Software Development Hub, Dhaka & Global Remote Engineering Teams")
    github_url = db.Column(db.String(255), default="https://github.com")
    linkedin_url = db.Column(db.String(255), default="https://linkedin.com")
    twitter_url = db.Column(db.String(255), default="https://twitter.com")
    facebook_url = db.Column(db.String(255), default="https://facebook.com")
    instagram_url = db.Column(db.String(255), default="https://instagram.com")

class StatMetric(db.Model):
    __tablename__ = 'stat_metrics'
    id = db.Column(db.Integer, primary_key=True)
    label = db.Column(db.String(100), nullable=False)
    value = db.Column(db.Integer, nullable=False)
    suffix = db.Column(db.String(20), default="+")
    order = db.Column(db.Integer, default=0)

class ThemeSettings(db.Model):
    __tablename__ = 'theme_settings'
    id = db.Column(db.Integer, primary_key=True)
    bg_color = db.Column(db.String(30), default="#050816")
    primary_color = db.Column(db.String(30), default="#2563EB")
    secondary_color = db.Column(db.String(30), default="#06B6D4")
    accent_color = db.Column(db.String(30), default="#7C3AED")
    glass_blur = db.Column(db.String(20), default="16px")
    font_heading = db.Column(db.String(50), default="Space Grotesk")
    font_body = db.Column(db.String(50), default="Inter")
    font_code = db.Column(db.String(50), default="JetBrains Mono")
    logo_url = db.Column(db.String(255), default="")
    favicon_url = db.Column(db.String(255), default="")

class AnimationSettings(db.Model):
    __tablename__ = 'animation_settings'
    id = db.Column(db.Integer, primary_key=True)
    particle_density = db.Column(db.Integer, default=120)
    camera_speed = db.Column(db.Float, default=1.0)
    mouse_sensitivity = db.Column(db.Float, default=1.0)
    scroll_speed = db.Column(db.Float, default=1.0)
    glow_intensity = db.Column(db.Float, default=1.0)
    intro_enabled = db.Column(db.Boolean, default=True)
    sound_enabled = db.Column(db.Boolean, default=True)

class ActivityLog(db.Model):
    __tablename__ = 'activity_logs'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80))
    action = db.Column(db.String(255), nullable=False)
    details = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

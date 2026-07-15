from flask import Blueprint, render_template, request, jsonify, make_response
from models import (
    db, HeroSection, AboutSection, Service, Project,
    BlogPost, TechItem, TeamMember, Testimonial, StatMetric,
    ThemeSettings, AnimationSettings, ContactMessage, ContactSettings
)
import json
from datetime import datetime

public_bp = Blueprint('public', __name__)

@public_bp.route('/')
def index():
    hero = HeroSection.query.first()
    about = AboutSection.query.first()
    services = Service.query.order_by(Service.order.asc()).all()
    projects = Project.query.order_by(Project.order.asc()).all()
    blogs = BlogPost.query.filter_by(is_published=True).order_by(BlogPost.created_at.desc()).all()
    tech_items = TechItem.query.order_by(TechItem.order.asc()).all()
    team_members = TeamMember.query.order_by(TeamMember.order.asc()).all()
    testimonials = Testimonial.query.order_by(Testimonial.order.asc()).all()
    stats = StatMetric.query.order_by(StatMetric.order.asc()).all()
    theme = ThemeSettings.query.first()
    animation = AnimationSettings.query.first()
    contact_settings = ContactSettings.query.first()

    # Safely parse JSON strings for template usage
    core_values = json.loads(about.core_values_json) if about and about.core_values_json else []
    timeline = json.loads(about.timeline_json) if about and about.timeline_json else []
    hero_code = json.loads(hero.python_code_lines) if hero and hero.python_code_lines else []

    return render_template(
        'index.html',
        hero=hero,
        about=about,
        services=services,
        projects=projects,
        blogs=blogs,
        tech_items=tech_items,
        team_members=team_members,
        testimonials=testimonials,
        stats=stats,
        theme=theme,
        animation=animation,
        contact_settings=contact_settings,
        core_values=core_values,
        timeline=timeline,
        hero_code=hero_code,
        json=json
    )

@public_bp.route('/sitemap.xml', methods=['GET'])
def sitemap():
    """Generate dynamic XML sitemap for Search Engine Optimization."""
    pages = [
        {"loc": "https://jscodeworks.com/", "changefreq": "daily", "priority": "1.0"},
        {"loc": "https://jscodeworks.com/#about", "changefreq": "weekly", "priority": "0.8"},
        {"loc": "https://jscodeworks.com/#services", "changefreq": "weekly", "priority": "0.9"},
        {"loc": "https://jscodeworks.com/#portfolio", "changefreq": "weekly", "priority": "0.9"},
        {"loc": "https://jscodeworks.com/#tech-stack", "changefreq": "monthly", "priority": "0.7"},
        {"loc": "https://jscodeworks.com/#contact", "changefreq": "monthly", "priority": "0.8"}
    ]
    
    xml_content = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml_content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    for page in pages:
        xml_content += f'  <url>\n    <loc>{page["loc"]}</loc>\n    <changefreq>{page["changefreq"]}</changefreq>\n    <priority>{page["priority"]}</priority>\n  </url>\n'
    xml_content += '</urlset>'

    response = make_response(xml_content)
    response.headers['Content-Type'] = 'application/xml'
    return response

@public_bp.route('/robots.txt', methods=['GET'])
def robots():
    """Return robots.txt instructions for web crawlers."""
    content = "User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\nSitemap: https://jscodeworks.com/sitemap.xml\n"
    response = make_response(content)
    response.headers['Content-Type'] = 'text/plain'
    return response

@public_bp.route('/api/content', methods=['GET'])
def get_public_content():
    """Returns dynamic JSON content for real-time frontend updates and initial load."""
    hero = HeroSection.query.first()
    services = Service.query.order_by(Service.order.asc()).all()
    projects = Project.query.order_by(Project.order.asc()).all()
    tech_items = TechItem.query.order_by(TechItem.order.asc()).all()
    theme = ThemeSettings.query.first()
    animation = AnimationSettings.query.first()

    return jsonify({
        "status": "success",
        "hero": {
            "headline": hero.headline if hero else "",
            "subheadline": hero.subheadline if hero else "",
            "python_code": json.loads(hero.python_code_lines) if hero and hero.python_code_lines else []
        },
        "services": [{
            "id": s.id, "title": s.title, "icon": s.icon_3d, "desc": s.short_desc, "glow": s.border_glow_color
        } for s in services],
        "projects": [{
            "id": p.id, "title": p.title, "tagline": p.tagline, "category": p.category,
            "image": p.image_url, "tech": json.loads(p.tech_stack_json) if p.tech_stack_json else []
        } for p in projects],
        "tech_stack": [{
            "name": t.name, "category": t.category, "color": t.color, "radius": t.orbit_radius, "speed": t.speed
        } for t in tech_items],
        "theme": {
            "bg": theme.bg_color if theme else "#050816",
            "primary": theme.primary_color if theme else "#2563EB",
            "secondary": theme.secondary_color if theme else "#06B6D4",
            "accent": theme.accent_color if theme else "#7C3AED"
        },
        "animation": {
            "particles": animation.particle_density if animation else 120,
            "sound": animation.sound_enabled if animation else True
        }
    })

@public_bp.route('/api/contact', methods=['POST'])
def submit_contact():
    data = request.get_json() or request.form
    name = data.get('name')
    email = data.get('email')
    subject = data.get('subject', 'General Inquiry')
    message = data.get('message')
    service_interest = data.get('service_interest', '')

    if not name or not email or not message:
        return jsonify({"status": "error", "message": "Name, email, and message are required."}), 400

    msg = ContactMessage(
        name=name,
        email=email,
        subject=subject,
        message=message,
        service_interest=service_interest
    )
    db.session.add(msg)
    db.session.commit()

    return jsonify({"status": "success", "message": "Thank you! Your message has been sent to JS CodeWorks team."})

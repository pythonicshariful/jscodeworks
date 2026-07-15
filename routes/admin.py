from flask import Blueprint, render_template, request, jsonify, redirect, url_for, flash, current_app
from flask_login import login_required, current_user
from models import (
    db, User, HeroSection, AboutSection, Service, Project,
    BlogPost, TechItem, TeamMember, Testimonial, StatMetric,
    ThemeSettings, AnimationSettings, ContactMessage, ContactSettings, ActivityLog
)
import json
import os
from werkzeug.utils import secure_filename
from datetime import datetime

admin_bp = Blueprint('admin', __name__)

def log_activity(action, details=""):
    log = ActivityLog(username=current_user.username if current_user.is_authenticated else "system", action=action, details=details)
    db.session.add(log)
    db.session.commit()

@admin_bp.route('/admin')
@admin_bp.route('/admin/dashboard')
@login_required
def dashboard():
    stats = {
        "projects_count": Project.query.count(),
        "services_count": Service.query.count(),
        "messages_count": ContactMessage.query.count(),
        "unread_messages": ContactMessage.query.filter_by(is_read=False).count(),
        "blogs_count": BlogPost.query.count(),
        "team_count": TeamMember.query.count()
    }
    recent_messages = ContactMessage.query.order_by(ContactMessage.created_at.desc()).limit(5).all()
    recent_logs = ActivityLog.query.order_by(ActivityLog.timestamp.desc()).limit(10).all()
    theme = ThemeSettings.query.first()
    animation = AnimationSettings.query.first()

    return render_template(
        'admin/dashboard.html',
        stats=stats,
        recent_messages=recent_messages,
        recent_logs=recent_logs,
        theme=theme,
        animation=animation
    )

@admin_bp.route('/admin/hero', methods=['GET', 'POST'])
@login_required
def manage_hero():
    hero = HeroSection.query.first()
    if not hero:
        hero = HeroSection()
        db.session.add(hero)
        db.session.commit()

    if request.method == 'POST':
        hero.badge_text = request.form.get('badge_text', hero.badge_text)
        hero.headline = request.form.get('headline', hero.headline)
        hero.subheadline = request.form.get('subheadline', hero.subheadline)
        hero.cta_primary_text = request.form.get('cta_primary_text', hero.cta_primary_text)
        hero.cta_primary_link = request.form.get('cta_primary_link', hero.cta_primary_link)
        hero.cta_secondary_text = request.form.get('cta_secondary_text', hero.cta_secondary_text)
        hero.cta_secondary_link = request.form.get('cta_secondary_link', hero.cta_secondary_link)

        code_raw = request.form.get('python_code_lines', '')
        if code_raw:
            code_lines = [line for line in code_raw.splitlines()]
            hero.python_code_lines = json.dumps(code_lines)

        db.session.commit()
        log_activity("UPDATE_HERO", "Updated Landing Hero Section")
        flash("Hero Section updated successfully!", "success")
        return redirect(url_for('admin.manage_hero'))

    hero_code = "\n".join(json.loads(hero.python_code_lines)) if hero.python_code_lines else ""
    return render_template('admin/hero.html', hero=hero, hero_code=hero_code)

@admin_bp.route('/admin/about', methods=['GET', 'POST'])
@login_required
def manage_about():
    about = AboutSection.query.first()
    if not about:
        about = AboutSection()
        db.session.add(about)
        db.session.commit()

    if request.method == 'POST':
        about.tagline = request.form.get('tagline', about.tagline)
        about.title = request.form.get('title', about.title)
        about.story = request.form.get('story', about.story)
        about.mission = request.form.get('mission', about.mission)
        about.vision = request.form.get('vision', about.vision)

        db.session.commit()
        log_activity("UPDATE_ABOUT", "Updated About Section")
        flash("About Section updated!", "success")
        return redirect(url_for('admin.manage_about'))

    return render_template('admin/about.html', about=about)

@admin_bp.route('/admin/team', methods=['GET', 'POST'])
@login_required
def manage_team():
    about = AboutSection.query.first()
    if not about:
        about = AboutSection()
        db.session.add(about)
        db.session.commit()

    if request.method == 'POST':
        action_type = request.form.get('action_type', 'member')
        if action_type == 'section_header':
            about.team_section_tag = request.form.get('team_section_tag', about.team_section_tag or "// FOUNDERS & LEADERSHIP")
            about.team_section_title = request.form.get('team_section_title', about.team_section_title or "The Engineering Architects")
            db.session.commit()
            log_activity("UPDATE_TEAM_HEADER", "Updated Team Section Header & Tagline")
            flash("Team Section Header updated successfully!", "success")
            return redirect(url_for('admin.manage_team'))

        member_id = request.form.get('member_id')
        if member_id:
            member = TeamMember.query.get(member_id)
        else:
            member = TeamMember()
            db.session.add(member)

        member.name = request.form.get('name')
        member.role = request.form.get('role')
        member.bio = request.form.get('bio')
        member.is_founder = bool(request.form.get('is_founder'))
        member.order = int(request.form.get('order', 0))

        # Handle Image File Upload or URL
        if 'image_file' in request.files and request.files['image_file'].filename != '':
            file = request.files['image_file']
            filename = secure_filename(file.filename)
            upload_folder = os.path.join(current_app.static_folder, 'uploads')
            os.makedirs(upload_folder, exist_ok=True)
            file.save(os.path.join(upload_folder, filename))
            member.image_url = f"/static/uploads/{filename}"
        elif request.form.get('image_url'):
            member.image_url = request.form.get('image_url')

        github = request.form.get('social_github', '')
        linkedin = request.form.get('social_linkedin', '')
        twitter = request.form.get('social_twitter', '')
        member.social_links_json = json.dumps({"github": github, "linkedin": linkedin, "twitter": twitter})

        db.session.commit()
        log_activity("SAVE_TEAM_MEMBER", f"Saved team member / founder {member.name}")
        flash(f"Team member '{member.name}' saved successfully!", "success")
        return redirect(url_for('admin.manage_team'))

    team_members = TeamMember.query.order_by(TeamMember.order.asc()).all()
    return render_template('admin/team.html', team_members=team_members, about=about, json=json)

@admin_bp.route('/admin/team/delete/<int:member_id>', methods=['POST'])
@login_required
def delete_team_member(member_id):
    member = TeamMember.query.get_or_404(member_id)
    name = member.name
    db.session.delete(member)
    db.session.commit()
    log_activity("DELETE_TEAM_MEMBER", f"Deleted team member {name}")
    flash(f"Team member '{name}' removed.", "info")
    return redirect(url_for('admin.manage_team'))

@admin_bp.route('/admin/stats', methods=['GET', 'POST'])
@login_required
def manage_stats():
    if request.method == 'POST':
        metric_id = request.form.get('metric_id')
        if metric_id:
            stat = StatMetric.query.get(metric_id)
        else:
            stat = StatMetric()
            db.session.add(stat)

        stat.label = request.form.get('label')
        stat.value = int(request.form.get('value', 0))
        stat.suffix = request.form.get('suffix', '+')
        stat.order = int(request.form.get('order', 0))

        db.session.commit()
        log_activity("SAVE_STAT_METRIC", f"Saved stat metric {stat.label}")
        flash(f"Stat Metric '{stat.label}' saved!", "success")
        return redirect(url_for('admin.manage_stats'))

    stats_list = StatMetric.query.order_by(StatMetric.order.asc()).all()
    return render_template('admin/stats.html', stats_list=stats_list)

@admin_bp.route('/admin/stats/delete/<int:metric_id>', methods=['POST'])
@login_required
def delete_stat(metric_id):
    stat = StatMetric.query.get_or_404(metric_id)
    label = stat.label
    db.session.delete(stat)
    db.session.commit()
    log_activity("DELETE_STAT_METRIC", f"Deleted stat metric {label}")
    flash(f"Stat metric '{label}' removed.", "info")
    return redirect(url_for('admin.manage_stats'))

@admin_bp.route('/admin/contact-settings', methods=['GET', 'POST'])
@login_required
def manage_contact_settings():
    contact = ContactSettings.query.first()
    if not contact:
        contact = ContactSettings()
        db.session.add(contact)
        db.session.commit()

    if request.method == 'POST':
        contact.email = request.form.get('email', contact.email)
        contact.phone = request.form.get('phone', contact.phone)
        contact.whatsapp_number = request.form.get('whatsapp_number', contact.whatsapp_number)
        contact.office_address = request.form.get('office_address', contact.office_address)
        contact.github_url = request.form.get('github_url', contact.github_url)
        contact.linkedin_url = request.form.get('linkedin_url', contact.linkedin_url)
        contact.twitter_url = request.form.get('twitter_url', contact.twitter_url)
        contact.facebook_url = request.form.get('facebook_url', contact.facebook_url)
        contact.instagram_url = request.form.get('instagram_url', contact.instagram_url)

        db.session.commit()
        log_activity("UPDATE_CONTACT_SETTINGS", "Updated Contact Info & Social Media Links")
        flash("Contact Info & Social Links updated successfully!", "success")
        return redirect(url_for('admin.manage_contact_settings'))

    return render_template('admin/contact_settings.html', contact=contact)

@admin_bp.route('/admin/services', methods=['GET', 'POST'])
@login_required
def manage_services():
    if request.method == 'POST':
        service_id = request.form.get('service_id')
        if service_id:
            svc = Service.query.get(service_id)
        else:
            svc = Service()
            db.session.add(svc)

        svc.title = request.form.get('title')
        svc.icon_3d = request.form.get('icon_3d', 'code')
        svc.short_desc = request.form.get('short_desc')
        svc.full_desc = request.form.get('full_desc')
        svc.border_glow_color = request.form.get('border_glow_color', '#2563EB')
        svc.order = int(request.form.get('order', 0))

        caps_raw = request.form.get('capabilities', '')
        caps = [c.strip() for c in caps_raw.split(',') if c.strip()]
        svc.capabilities_json = json.dumps(caps)

        db.session.commit()
        log_activity("SAVE_SERVICE", f"Saved service {svc.title}")
        flash(f"Service '{svc.title}' saved!", "success")
        return redirect(url_for('admin.manage_services'))

    services = Service.query.order_by(Service.order.asc()).all()
    return render_template('admin/services.html', services=services, json=json)

@admin_bp.route('/admin/services/delete/<int:service_id>', methods=['POST'])
@login_required
def delete_service(service_id):
    svc = Service.query.get_or_404(service_id)
    title = svc.title
    db.session.delete(svc)
    db.session.commit()
    log_activity("DELETE_SERVICE", f"Deleted service {title}")
    flash(f"Service '{title}' deleted.", "info")
    return redirect(url_for('admin.manage_services'))

@admin_bp.route('/admin/projects', methods=['GET', 'POST'])
@login_required
def manage_projects():
    if request.method == 'POST':
        project_id = request.form.get('project_id')
        if project_id:
            proj = Project.query.get(project_id)
        else:
            proj = Project()
            db.session.add(proj)

        proj.title = request.form.get('title')
        proj.slug = request.form.get('slug') or proj.title.lower().replace(' ', '-')
        proj.tagline = request.form.get('tagline')
        proj.category = request.form.get('category', 'Web Development')
        proj.description = request.form.get('description')
        proj.client_name = request.form.get('client_name')
        proj.image_url = request.form.get('image_url')
        proj.live_url = request.form.get('live_url')
        proj.github_url = request.form.get('github_url')
        proj.device_type = request.form.get('device_type', 'laptop')
        proj.is_featured = bool(request.form.get('is_featured'))
        proj.order = int(request.form.get('order', 0))

        tech_raw = request.form.get('tech_stack', '')
        tech = [t.strip() for t in tech_raw.split(',') if t.strip()]
        proj.tech_stack_json = json.dumps(tech)

        db.session.commit()
        log_activity("SAVE_PROJECT", f"Saved project {proj.title}")
        flash(f"Project '{proj.title}' saved!", "success")
        return redirect(url_for('admin.manage_projects'))

    projects = Project.query.order_by(Project.order.asc()).all()
    return render_template('admin/projects.html', projects=projects, json=json)

@admin_bp.route('/admin/projects/delete/<int:project_id>', methods=['POST'])
@login_required
def delete_project(project_id):
    proj = Project.query.get_or_404(project_id)
    title = proj.title
    db.session.delete(proj)
    db.session.commit()
    log_activity("DELETE_PROJECT", f"Deleted project {title}")
    flash(f"Project '{title}' deleted.", "info")
    return redirect(url_for('admin.manage_projects'))

@admin_bp.route('/admin/tech-stack', methods=['GET', 'POST'])
@login_required
def manage_tech_stack():
    if request.method == 'POST':
        tech_id = request.form.get('tech_id')
        if tech_id:
            item = TechItem.query.get(tech_id)
        else:
            item = TechItem()
            db.session.add(item)

        item.name = request.form.get('name')
        item.category = request.form.get('category', 'Backend')
        item.color = request.form.get('color', '#06B6D4')
        item.orbit_radius = float(request.form.get('orbit_radius', 3.5))
        item.speed = float(request.form.get('speed', 1.0))
        item.order = int(request.form.get('order', 0))

        db.session.commit()
        log_activity("SAVE_TECH", f"Saved tech item {item.name}")
        flash(f"Tech Item '{item.name}' saved!", "success")
        return redirect(url_for('admin.manage_tech_stack'))

    tech_items = TechItem.query.order_by(TechItem.order.asc()).all()
    return render_template('admin/tech_stack.html', tech_items=tech_items)

@admin_bp.route('/admin/theme', methods=['GET', 'POST'])
@login_required
def manage_theme():
    theme = ThemeSettings.query.first()
    animation = AnimationSettings.query.first()
    if not theme:
        theme = ThemeSettings()
        db.session.add(theme)
    if not animation:
        animation = AnimationSettings()
        db.session.add(animation)
    db.session.commit()

    if request.method == 'POST':
        theme.bg_color = request.form.get('bg_color', theme.bg_color)
        theme.primary_color = request.form.get('primary_color', theme.primary_color)
        theme.secondary_color = request.form.get('secondary_color', theme.secondary_color)
        theme.accent_color = request.form.get('accent_color', theme.accent_color)

        animation.particle_density = int(request.form.get('particle_density', 120))
        animation.camera_speed = float(request.form.get('camera_speed', 1.0))
        animation.sound_enabled = bool(request.form.get('sound_enabled'))

        db.session.commit()
        log_activity("UPDATE_THEME", "Updated Theme and Animation preferences")
        flash("Theme and Animation settings updated!", "success")
        return redirect(url_for('admin.manage_theme'))

    return render_template('admin/theme.html', theme=theme, animation=animation)

@admin_bp.route('/admin/messages')
@login_required
def manage_messages():
    messages = ContactMessage.query.order_by(ContactMessage.created_at.desc()).all()
    return render_template('admin/messages.html', messages=messages)

@admin_bp.route('/admin/messages/mark-read/<int:msg_id>', methods=['POST'])
@login_required
def mark_message_read(msg_id):
    msg = ContactMessage.query.get_or_404(msg_id)
    msg.is_read = True
    db.session.commit()
    return jsonify({"status": "success"})

@admin_bp.route('/admin/media', methods=['GET', 'POST'])
@login_required
def manage_media():
    upload_folder = os.path.join(current_app.static_folder, 'uploads')
    os.makedirs(upload_folder, exist_ok=True)

    if request.method == 'POST' and 'file' in request.files:
        file = request.files['file']
        if file.filename != '':
            filename = secure_filename(file.filename)
            file.save(os.path.join(upload_folder, filename))
            log_activity("UPLOAD_MEDIA", f"Uploaded media file {filename}")
            flash(f"Uploaded {filename} successfully!", "success")
            return redirect(url_for('admin.manage_media'))

    files = [f for f in os.listdir(upload_folder) if os.path.isfile(os.path.join(upload_folder, f))]
    return render_template('admin/media.html', files=files)

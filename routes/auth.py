from flask import Blueprint, render_template, request, redirect, url_for, flash, session, abort
from flask_login import login_user, logout_user, login_required, current_user
from models import db, User, ActivityLog
from utils.mailer import send_otp_email
import random
import time

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/admin/login')
def legacy_login_block():
    """Obscure standard login route to prevent unauthorized discovery."""
    abort(404)

@auth_bp.route('/admin/darkwolf', methods=['GET', 'POST'])
def darkwolf_login():
    if current_user.is_authenticated:
        return redirect(url_for('admin.dashboard'))

    if request.method == 'POST':
        login_input = request.form.get('username')
        password = request.form.get('password')

        # Find user by username or email
        user = User.query.filter((User.username == login_input) | (User.email == login_input)).first()

        if user and user.check_password(password):
            # Stage 1 Validation Successful -> Generate 2FA OTP
            otp_code = str(random.randint(100000, 999999))
            session['pending_user_id'] = user.id
            session['otp_code'] = otp_code
            session['otp_expiry'] = time.time() + 300 # Valid for 5 minutes (300 secs)
            session['recipient_email'] = user.email

            # Dispatch OTP Email via SMTP
            email_sent = send_otp_email(user.email, otp_code)

            if email_sent:
                flash(f"Security OTP code dispatched to {user.email}.", "info")
            else:
                flash("OTP dispatch encountered an issue. (Dev fallback mode: check console or proceed with generated code).", "warning")

            return redirect(url_for('auth.verify_otp'))
        else:
            flash("Invalid secret credentials. Access Denied.", "danger")

    return render_template('admin/login.html')

@auth_bp.route('/admin/verify-otp', methods=['GET', 'POST'])
def verify_otp():
    if current_user.is_authenticated:
        return redirect(url_for('admin.dashboard'))

    pending_user_id = session.get('pending_user_id')
    stored_otp = session.get('otp_code')
    otp_expiry = session.get('otp_expiry', 0)
    recipient_email = session.get('recipient_email', 'admin email')

    if not pending_user_id or not stored_otp:
        flash("No active authentication session. Please log in.", "danger")
        return redirect(url_for('auth.darkwolf_login'))

    if request.method == 'POST':
        entered_otp = request.form.get('otp_code', '').strip()

        if time.time() > otp_expiry:
            flash("OTP security code has expired. Please re-authenticate.", "danger")
            session.pop('pending_user_id', None)
            session.pop('otp_code', None)
            return redirect(url_for('auth.darkwolf_login'))

        if entered_otp == stored_otp:
            user = User.query.get(pending_user_id)
            if user:
                login_user(user, remember=True)
                
                # Clear session pending tokens
                session.pop('pending_user_id', None)
                session.pop('otp_code', None)
                session.pop('otp_expiry', None)
                session.pop('recipient_email', None)

                log = ActivityLog(username=user.username, action="USER_2FA_LOGIN_SUCCESS", details=f"2FA Authenticated login for {user.username} ({user.email})")
                db.session.add(log)
                db.session.commit()

                flash("2FA Authorization Successful! Welcome to JS CodeWorks Command Center.", "success")
                return redirect(url_for('admin.dashboard'))
        
        flash("Invalid OTP Security Code. Please try again.", "danger")

    return render_template('admin/otp.html', recipient_email=recipient_email)

@auth_bp.route('/admin/logout')
@login_required
def logout():
    log = ActivityLog(username=current_user.username, action="USER_LOGOUT", details=f"User logged out.")
    db.session.add(log)
    db.session.commit()
    logout_user()
    return redirect(url_for('auth.darkwolf_login'))

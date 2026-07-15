import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Environment Loader Fallback
def _load_env_file():
    env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
    if os.path.exists(env_path):
        with open(env_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    k, v = line.split('=', 1)
                    os.environ[k.strip()] = v.strip()

_load_env_file()

SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SENDER_EMAIL = os.getenv("SMTP_SENDER_EMAIL", "masudranadarkwolf@gmail.com")
SENDER_PASS = os.getenv("SMTP_APP_PASSWORD", "fbmemiokdpemgjak")

def send_otp_email(recipient_email, otp_code):
    """Send 6-digit OTP code to admin email via SMTP credentials loaded from .env."""
    subject = "JS CodeWorks Admin Security - 2FA Verification Code"
    
    html_content = f"""
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #050816; color: #F8FAFC; padding: 40px; border-radius: 12px; max-width: 500px; margin: 0 auto; border: 1px solid rgba(6, 182, 212, 0.3);">
      <h2 style="color: #06B6D4; font-size: 24px; margin-bottom: 8px;">JS CODEWORKS PORTAL</h2>
      <p style="color: #94A3B8; font-size: 14px; margin-bottom: 24px;">Admin Two-Factor Authentication Security Request</p>
      
      <div style="background: rgba(15, 23, 42, 0.8); padding: 24px; border-radius: 8px; text-align: center; border: 1px solid rgba(255, 255, 255, 0.1); margin-bottom: 24px;">
        <div style="font-size: 12px; color: #94A3B8; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 8px;">One-Time Verification Code</div>
        <div style="font-size: 36px; font-weight: 800; font-family: monospace; color: #10B981; letter-spacing: 6px;">{otp_code}</div>
      </div>
      
      <p style="color: #CBD5E1; font-size: 13px; line-height: 1.5;">This 2FA code is valid for 5 minutes. If you did not initiate this authentication request, please secure your credentials immediately.</p>
      <div style="margin-top: 30px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 16px; color: #64748B; font-size: 11px;">© 2026 JS CodeWorks Cyber Security Engine.</div>
    </div>
    """

    # Reload credentials from os.environ dynamically
    sender_email = os.getenv("SMTP_SENDER_EMAIL", SENDER_EMAIL)
    sender_pass = os.getenv("SMTP_APP_PASSWORD", SENDER_PASS)
    smtp_server = os.getenv("SMTP_SERVER", SMTP_SERVER)
    smtp_port = int(os.getenv("SMTP_PORT", SMTP_PORT))

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"JS CodeWorks Security <{sender_email}>"
    msg["To"] = recipient_email

    msg.attach(MIMEText(f"Your JS CodeWorks Admin OTP Code is: {otp_code}", "plain"))
    msg.attach(MIMEText(html_content, "html"))

    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(sender_email, sender_pass)
        server.sendmail(sender_email, recipient_email, msg.as_string())
        server.quit()
        print(f"OTP email successfully dispatched to {recipient_email} using credentials from .env")
        return True
    except Exception as e:
        print(f"Error dispatching OTP email: {e}")
        return False

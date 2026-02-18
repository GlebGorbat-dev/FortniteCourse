import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


async def send_email(to_email: str, subject: str, html_body: str, text_body: str = None):
    """
    Send email via SMTP with improved error handling and automatic fallback.
    """
    if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        logger.warning("SMTP not configured. Email will not be sent.")
        logger.warning(f"Attempt to send email to {to_email} with subject: {subject}")
        return False
    
    try:
        message = MIMEMultipart("alternative")
        message["Subject"] = subject
        message["From"] = f"{settings.SMTP_FROM_NAME} <{settings.SMTP_FROM_EMAIL}>"
        message["To"] = to_email
        
        if text_body:
            text_part = MIMEText(text_body, "plain", "utf-8")
            message.attach(text_part)
        
        html_part = MIMEText(html_body, "html", "utf-8")
        message.attach(html_part)
        
        # Try port 465 first (more reliable for Gmail), then fallback to 587
        # If configured port is 587, try both 465 and 587
        ports_to_try = []
        if settings.SMTP_PORT == 465:
            ports_to_try = [(465, True)]  # SSL/TLS
        elif settings.SMTP_PORT == 587:
            ports_to_try = [(465, True), (587, False)]  # Try SSL first, then STARTTLS
        else:
            use_tls = settings.SMTP_PORT == 465
            ports_to_try = [(settings.SMTP_PORT, use_tls)]
        
        logger.info(f"Will try {len(ports_to_try)} port(s): {ports_to_try}")
        
        last_error = None
        for port, use_tls in ports_to_try:
            smtp = None
            try:
                logger.info(f"Attempting SMTP connection to {settings.SMTP_HOST}:{port} (TLS: {use_tls})")
                
                smtp = aiosmtplib.SMTP(
                    hostname=settings.SMTP_HOST,
                    port=port,
                    use_tls=use_tls,
                    timeout=20,  # Reduced timeout for faster fallback
                )
                
                # Connect to SMTP server
                logger.debug("Establishing SMTP connection...")
                await smtp.connect(timeout=20)
                logger.debug("SMTP connection established")
                
                # For port 587, start TLS after connection
                if port == 587 and not use_tls:
                    try:
                        logger.debug("Starting TLS handshake...")
                        await smtp.starttls(timeout=20)
                        logger.debug("TLS handshake completed")
                    except Exception as tls_error:
                        error_msg = str(tls_error).lower()
                        if "already using tls" not in error_msg and "already using ssl" not in error_msg:
                            logger.warning(f"TLS handshake failed on port 587: {tls_error}")
                            raise
                
                # Authenticate
                logger.debug("Authenticating with SMTP server...")
                await smtp.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                logger.debug("SMTP authentication successful")
                
                # Send email
                logger.debug(f"Sending email to {to_email}...")
                await smtp.send_message(message)
                logger.info(f"Email sent successfully to {to_email} via port {port}")
                
                # Success - close connection and return
                try:
                    if smtp.is_connected:
                        await smtp.quit()
                except Exception:
                    pass
                return True
                
            except Exception as e:
                last_error = e
                logger.warning(f"Failed to connect via port {port} (TLS: {use_tls}): {str(e)}")
                if smtp:
                    try:
                        if smtp.is_connected:
                            await smtp.quit()
                    except Exception:
                        pass
                # Continue to next port if available
                continue
        
        # All ports failed
        raise last_error if last_error else Exception("All SMTP connection attempts failed")
        
    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {str(e)}")
        logger.exception("Email sending error details:")
        
        # Provide helpful error messages
        error_str = str(e).lower()
        if "eof" in error_str or "unexpected" in error_str:
            logger.error("Connection EOF error. Solutions:")
            logger.error("1. Switch to port 465 with SSL in .env: SMTP_PORT=465")
            logger.error("2. Check firewall/network settings")
            logger.error("3. Verify Gmail App Password is correct")
            logger.error("4. Try from different network (some ISPs block SMTP)")
        elif "timeout" in error_str or "timed out" in error_str:
            logger.error("Connection timeout on all ports. This usually means:")
            logger.error("1. Firewall/network blocking SMTP ports (465, 587)")
            logger.error("2. ISP blocking SMTP connections")
            logger.error("3. VPN/proxy interfering with connection")
            logger.error("4. Gmail temporarily blocking your IP")
            logger.error("")
            logger.error("Workarounds:")
            logger.error("- Use VPN or different network")
            logger.error("- Use alternative SMTP service (SendGrid, Mailgun, etc.)")
            logger.error("- For development: disable email sending or use mock")
            logger.error("- Check if ports 465/587 are accessible: telnet smtp.gmail.com 465")
        elif "authentication" in error_str or "login" in error_str:
            logger.error("Authentication failed. Make sure:")
            logger.error("1. You're using Gmail App Password (not regular password)")
            logger.error("2. Two-factor authentication is enabled")
            logger.error("3. App Password is correctly set in .env")
        
        return False


def get_password_reset_email_html(reset_url: str) -> str:
    """
    HTML template for password reset email.
    """
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body {{
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
            }}
            .container {{
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }}
            .button {{
                display: inline-block;
                padding: 12px 24px;
                background-color: #FF3B30;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                margin: 20px 0;
            }}
            .footer {{
                margin-top: 30px;
                font-size: 12px;
                color: #666;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Password Reset</h2>
            <p>You requested a password reset for your Fortnite Course account.</p>
            <p>Click the button below to set a new password:</p>
            <a href="{reset_url}" class="button">Reset Password</a>
            <p>If the button does not work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666;">{reset_url}</p>
            <p>This link is valid for 1 hour.</p>
            <p>If you did not request a password reset, you can ignore this email.</p>
            <div class="footer">
                <p>Best regards,<br>Fortnite Course Team</p>
            </div>
        </div>
    </body>
    </html>
    """


def get_password_reset_email_text(reset_url: str) -> str:
    """
    Plain text version of password reset email.
    """
    return f"""
Password Reset

You requested a password reset for your Fortnite Course account.

Follow this link to set a new password:
{reset_url}

This link is valid for 1 hour.

If you did not request a password reset, you can ignore this email.

Best regards,
Fortnite Course Team
"""


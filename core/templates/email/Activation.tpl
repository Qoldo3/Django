{% extends "mail_templated/base.tpl" %}

{% block subject %}
Activate Your MyBlog Account
{% endblock %}

{% block body %}
Hello,

Thank you for signing up to MyBlog!

To complete your registration and activate your account, please click the link below:

http://127.0.0.1:5173/activate/{{ token }}

This link will expire in 24 hours for security reasons.

If you did not sign up for MyBlog, please ignore this email.

Best regards,
The MyBlog Team
{% endblock %}

{% block html %}
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Activate Your MyBlog Account</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f6f6f6; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(to right, #6366f1, #8b5cf6); padding: 40px; text-align: center; }
    .header h1 { color: #ffffff; font-size: 28px; font-weight: 400; margin: 0; }
    .content { padding: 50px 40px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.6; color: #4a4a4a; margin: 0 0 24px; }
    .button { display: inline-block; background: linear-gradient(to right, #6366f1, #8b5cf6); color: #ffffff; font-size: 18px; font-weight: 500; text-decoration: none; padding: 18px 40px; border-radius: 50px; box-shadow: 0 6px 20px rgba(99,102,241,0.3); margin: 20px 0; }
    .footer { background-color: #f9f9f9; padding: 30px; text-align: center; font-size: 14px; color: #999999; }
    @media only screen and (max-width: 600px) {
      .container { margin: 20px; }
      .content { padding: 40px 20px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>MyBlog</h1>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>Thank you for signing up to MyBlog! We're excited to have you join our community of writers and thinkers.</p>
      <p>To complete your registration and activate your account, please click the button below:</p>
      <a href="http://127.0.0.1:5173/activate/{{ token }}" class="button">Activate Account</a>
      <p>This link will expire in 24 hours for your security.</p>
      <p>If you didn't create an account with MyBlog, you can safely ignore this email.</p>
    </div>
    <div class="footer">
      <p>© 2025 MyBlog. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
{% endblock %}
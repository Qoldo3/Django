{% extends "mail_templated/base.tpl" %}

{% block subject %}
Account Activation Code 
{% endblock %}

{% block html %}
<img src= "http://127.0.0.1:8000/media/Amirreza.png" alt= "test" width="500" height="300">
Your Code is: {{ token }}
{% endblock %}
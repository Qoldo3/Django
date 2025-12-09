from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from accounts.models import *


class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ('email', 'is_staff', 'is_active',)
    list_filter = ('email', 'is_staff', 'is_active',)
    search_fields = ('email',)
    ordering = ('email',)
    fieldsets = (
        ('Authentication', {
            "fields": (
                'email', 'password',
            ),
            
        }),
        ('Permission', {
            "fields": (
                'is_staff', 'is_superuser', 'is_active',
            ),
            
        }),
        ('Groups', {
            "fields": (
                'groups', 'user_permissions',
            ),
            
        }),
        ('Other', {
            "fields": (
                'last_login',
            ),
            
        }),
    )
    add_fieldsets = (
        ('Add User', {
            "classes": ("wide",),
            "fields": (
                "email", "password1", "password2", "is_staff",
                "is_active", "is_superuser", 
            )}
        ),
    )
admin.site.register(User, CustomUserAdmin)
admin.site.register(Profile)
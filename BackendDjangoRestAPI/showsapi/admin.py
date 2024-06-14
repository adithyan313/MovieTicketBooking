'''from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from movieapi.models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ("email", "is_staff", "is_active", "date_joined")
    list_filter = ("is_staff", "is_superuser", "is_active")
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Permissions", {
            "fields": ("is_staff", "is_superuser", "is_active"),
        }),
    )
    search_fields = ("email",)
    ordering = ("email",)'''
from django.contrib import admin
from .models import Movie, Booking

admin.site.register(Movie)
admin.site.register(Booking)
# -----------------------------------------------
# Admin Configuration
# -----------------------------------------------
# Register models with Django admin for easy
# management through the admin dashboard.
# -----------------------------------------------

from django.contrib import admin
from .models import Game, Review, UserProfile


@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    list_display = ['title', 'genre', 'year', 'rating', 'platform', 'is_featured']
    list_filter = ['genre', 'year', 'platform', 'is_featured']
    search_fields = ['title', 'developer']


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['user', 'game', 'rating', 'created_at']
    list_filter = ['rating']
    search_fields = ['comment']


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'bio']
    search_fields = ['user__username']

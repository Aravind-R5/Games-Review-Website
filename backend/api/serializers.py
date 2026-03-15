# -----------------------------------------------
# Serializers — Convert Django models to JSON
# -----------------------------------------------
# Serializers transform Python objects into JSON format
# so React can receive and display the data.
# -----------------------------------------------

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Game, Review, UserProfile


class UserSerializer(serializers.ModelSerializer):
    """Serializes User data (username, email)."""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_staff']


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializes UserProfile with nested user info."""
    user = UserSerializer(read_only=True)
    review_count = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'avatar_url', 'bio', 'review_count']

    def get_review_count(self, obj):
        """Count total reviews by this user."""
        return Review.objects.filter(user=obj.user).count()


class GameSerializer(serializers.ModelSerializer):
    """Serializes Game data for list and detail views."""
    review_count = serializers.SerializerMethodField()
    platform_display = serializers.CharField(source='get_platform_display', read_only=True)
    poster_url = serializers.SerializerMethodField()
    backdrop_url = serializers.SerializerMethodField()

    class Meta:
        model = Game
        fields = [
            'id', 'title', 'poster_url', 'backdrop_url',
            'genre', 'year', 'rating', 'description',
            'developer', 'platform', 'platform_display',
            'is_featured', 'review_count', 'created_at'
        ]

    def _get_absolute_url(self, url):
        if not url:
            return ''
        if url.startswith('http'):
            return url
        
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(url)
        
        # Fallback if no request context
        render_url = "https://games-review-website-api.onrender.com"
        return f"{render_url}{url}"

    def get_poster_url(self, obj):
        return self._get_absolute_url(obj.poster_url)

    def get_backdrop_url(self, obj):
        return self._get_absolute_url(obj.backdrop_url)

    def get_review_count(self, obj):
        """Count total reviews for this game."""
        return obj.reviews.count()


class ReviewSerializer(serializers.ModelSerializer):
    """
    Serializes Review data.
    Includes user info and the related game title.
    """
    user = UserSerializer(read_only=True)
    game_title = serializers.CharField(source='game.title', read_only=True, default=None)
    item_poster = serializers.SerializerMethodField()
    item_title = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = [
            'id', 'user', 'game',
            'rating', 'comment', 'game_title',
            'item_poster', 'item_title',
            'created_at', 'updated_at'
        ]

    def get_item_poster(self, obj):
        """Get absolute poster URL from the related game."""
        if not obj.game or not obj.game.poster_url:
            return ''
        
        url = obj.game.poster_url
        if url.startswith('http'):
            return url
            
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(url)
            
        render_url = "https://games-review-website-api.onrender.com"
        return f"{render_url}{url}"

    def get_item_title(self, obj):
        """Get title from the related game."""
        return obj.game.title if obj.game else ''


class RegisterSerializer(serializers.ModelSerializer):
    """
    Handles user registration.
    Requires username, email, and password.
    """
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        """Create a new user and their profile."""
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        # Automatically create a profile for the new user
        UserProfile.objects.create(user=user)
        return user

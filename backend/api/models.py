# -----------------------------------------------
# Database Models
# Movie & Video Game Review Platform
# -----------------------------------------------
# This file defines all the database tables:
# - Movie: Stores movie information
# - Game: Stores video game information
# - Review: User reviews for movies/games
# - UserProfile: Extended user profile data
# -----------------------------------------------

from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator


class Game(models.Model):
    """
    Game model — stores information about each video game.
    """
    GENRE_CHOICES = [
        ('action', 'Action'),
        ('adventure', 'Adventure'),
        ('rpg', 'RPG'),
        ('shooter', 'Shooter'),
        ('strategy', 'Strategy'),
        ('sports', 'Sports'),
        ('racing', 'Racing'),
        ('puzzle', 'Puzzle'),
        ('horror', 'Horror'),
        ('simulation', 'Simulation'),
        ('fighting', 'Fighting'),
        ('open-world', 'Open World'),
    ]

    PLATFORM_CHOICES = [
        ('pc', 'PC'),
        ('playstation', 'PlayStation'),
        ('xbox', 'Xbox'),
        ('nintendo', 'Nintendo Switch'),
        ('multi', 'Multi-Platform'),
    ]

    title = models.CharField(max_length=255)                          # Game title
    poster_url = models.URLField(max_length=500, blank=True)          # Cover art URL
    backdrop_url = models.URLField(max_length=500, blank=True)        # Wide backdrop URL
    genre = models.CharField(max_length=50, choices=GENRE_CHOICES)    # Genre category
    year = models.IntegerField()                                      # Release year
    rating = models.FloatField(default=0.0)                           # Average rating (0-5)
    description = models.TextField(blank=True)                        # Game description
    developer = models.CharField(max_length=255, blank=True)          # Developer studio
    platform = models.CharField(                                      # Platform availability
        max_length=50,
        choices=PLATFORM_CHOICES,
        default='multi'
    )
    is_featured = models.BooleanField(default=False)                  # Show in featured banner?
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} ({self.year})"


class Review(models.Model):
    """
    Review model — stores user reviews for games.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    game = models.ForeignKey(
        Game, on_delete=models.CASCADE,
        related_name='reviews'
    )
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]  # Rating: 1-5 stars
    )
    comment = models.TextField()                                     # Review text
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Review by {self.user.username} on {self.game.title}"


class UserProfile(models.Model):
    """
    Extended user profile — adds avatar and bio to Django's User model.
    Created automatically via a signal or manually.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    avatar_url = models.URLField(max_length=500, blank=True, default='')  # Profile picture URL
    bio = models.TextField(blank=True, default='')                        # Short bio

    def __str__(self):
        return f"Profile: {self.user.username}"

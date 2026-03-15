# -----------------------------------------------
# API URL Routing
# -----------------------------------------------
# Maps URL paths to view functions.
# All URLs are prefixed with /api/ (from config/urls.py)
# -----------------------------------------------

from django.urls import path
from . import views

urlpatterns = [
    # --- Authentication ---
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/login/', views.LoginView.as_view(), name='login'),
    path('auth/logout/', views.LogoutView.as_view(), name='logout'),

    # --- Games ---
    path('games/', views.GameListView.as_view(), name='game-list'),
    path('games/<int:pk>/', views.GameDetailView.as_view(), name='game-detail'),

    # --- Reviews ---
    path('reviews/', views.ReviewListCreateView.as_view(), name='review-list'),
    path('reviews/<int:pk>/', views.ReviewDetailView.as_view(), name='review-detail'),

    # --- Profile ---
    path('profile/<int:pk>/', views.ProfileView.as_view(), name='profile'),

    # --- Homepage data ---
    path('featured/', views.FeaturedView.as_view(), name='featured'),
    path('activity/', views.ActivityFeedView.as_view(), name='activity'),
    path('top-rated/', views.TopRatedView.as_view(), name='top-rated'),
]

# -----------------------------------------------
# API Views — Handle HTTP requests
# -----------------------------------------------
# Views process incoming requests and return responses.
# We use DRF's generic views for clean, readable code.
# -----------------------------------------------

from rest_framework import generics, status, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Avg

from .models import Game, Review, UserProfile
from .serializers import (
    GameSerializer, ReviewSerializer, UserSerializer,
    UserProfileSerializer, RegisterSerializer
)


# -----------------------------------------------
# Authentication Views
# -----------------------------------------------

class RegisterView(APIView):
    """
    POST /api/auth/register/
    Register a new user account.
    Returns an auth token on successful registration.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Create an auth token for the new user
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user': UserSerializer(user).data,
                'message': 'Registration successful!'
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """
    POST /api/auth/login/
    Log in with username & password.
    Returns an auth token on success.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        # Authenticate the user
        user = authenticate(username=username, password=password)
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user': UserSerializer(user).data,
                'message': 'Login successful!'
            })
        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )


class LogoutView(APIView):
    """
    POST /api/auth/logout/
    Log out the current user by deleting their token.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.user.auth_token.delete()
        return Response({'message': 'Logged out successfully'})


# -----------------------------------------------
# Game Views
# -----------------------------------------------

class GameListView(generics.ListAPIView):
    """
    GET /api/games/
    List all games with optional search, genre, and platform filter.
    Query params: ?search=keyword&genre=rpg&platform=pc
    """
    serializer_class = GameSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'developer', 'description']
    ordering_fields = ['rating', 'year', 'created_at']
    ordering = ['-created_at'] # Default ordering

    def get_queryset(self):
        queryset = Game.objects.all()
        # Filter by genre
        genre = self.request.query_params.get('genre')
        if genre:
            queryset = queryset.filter(genre=genre)
        # Filter by platform
        platform = self.request.query_params.get('platform')
        if platform:
            queryset = queryset.filter(platform=platform)
        return queryset


class GameDetailView(generics.RetrieveAPIView):
    """
    GET /api/games/{id}/
    Get detailed info about a single game.
    """
    queryset = Game.objects.all()
    serializer_class = GameSerializer
    permission_classes = [AllowAny]


# -----------------------------------------------
# Review Views
# -----------------------------------------------

class ReviewListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/reviews/         — List all reviews
    POST /api/reviews/         — Create a new review (login required)
    Query params: ?game=2 to filter by specific game
    """
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = Review.objects.all()
        # Filter reviews by game ID
        game_id = self.request.query_params.get('game')
        if game_id:
            queryset = queryset.filter(game_id=game_id)
        return queryset

    def perform_create(self, serializer):
        """
        When creating a review, automatically:
        1. Set the user to the logged-in user
        2. Update the game average rating
        """
        review = serializer.save(user=self.request.user)
        self._update_rating(review)

    def _update_rating(self, review):
        """Recalculate and update the average rating for a game."""
        avg = Review.objects.filter(
            game=review.game
        ).aggregate(avg_rating=Avg('rating'))['avg_rating'] or 0
        review.game.rating = round(avg, 1)
        review.game.save()


class ReviewDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/reviews/{id}/  — View a single review
    PUT    /api/reviews/{id}/  — Update a review (owner only)
    DELETE /api/reviews/{id}/  — Delete a review (owner only)
    """
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_update(self, serializer):
        """Only allow the review owner to update."""
        if serializer.instance.user != self.request.user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("You can only edit your own reviews.")
        serializer.save()

    def perform_destroy(self, instance):
        """Allow the review owner or staff member to delete."""
        if instance.user != self.request.user and not self.request.user.is_staff:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("You can only delete your own reviews.")
        instance.delete()


# -----------------------------------------------
# Profile View
# -----------------------------------------------

class ProfileView(APIView):
    """
    GET /api/profile/{id}/
    Get a user's profile along with their reviews.
    """
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
            # Get or create profile
            profile, _ = UserProfile.objects.get_or_create(user=user)
            profile_data = UserProfileSerializer(profile).data
            # Get user's reviews
            reviews = Review.objects.filter(user=user)
            reviews_data = ReviewSerializer(reviews, many=True).data
            return Response({
                'profile': profile_data,
                'reviews': reviews_data
            })
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )


# -----------------------------------------------
# Featured & Activity Views
# -----------------------------------------------

class FeaturedView(APIView):
    """
    GET /api/featured/
    Get a featured game for the homepage banner.
    Returns the first item marked as featured, or the highest rated.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        games = Game.objects.filter(is_featured=True)[:5]
        if not games.exists():
            games = Game.objects.order_by('-rating')[:5]
            
        if not games.exists():
            return Response({'type': None, 'data': []})
            
        return Response({
            'type': 'games', 
            'data': GameSerializer(games, many=True).data
        })


class ActivityFeedView(generics.ListAPIView):
    """
    GET /api/activity/
    Get recent community activity (latest reviews).
    Returns the 20 most recent reviews with user and item info.
    """
    serializer_class = ReviewSerializer
    permission_classes = [AllowAny]
    pagination_class = None  # No pagination for activity feed

    def get_queryset(self):
        return Review.objects.all()[:20]


class TopRatedView(APIView):
    """
    GET /api/top-rated/
    Get top rated games for the homepage.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        top_games = Game.objects.order_by('-rating')[:10]
        
        return Response({
            'games': GameSerializer(top_games, many=True).data,
        })

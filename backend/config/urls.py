# -----------------------------------------------
# Root URL Configuration
# Maps all API endpoints under /api/
# -----------------------------------------------

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from django.views.static import serve
from django.urls import re_path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),  # All API routes
]

# Force serve media files (Always serve since they are in the GitHub repo)
urlpatterns += [
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
]

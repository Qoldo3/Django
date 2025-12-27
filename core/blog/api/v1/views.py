from .serializers import PostSerializer, CategorySerializer
from blog.models import Post, Category
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAdminUser
from rest_framework import viewsets
from .permissions import IsAuthorOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .paginations import LargeResultsSetPagination


class PostViewSet(viewsets.ModelViewSet):
    # Post ViewSet with filtering, searching, ordering, and pagination
    pagination_class = LargeResultsSetPagination
    permission_classes = [IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]
    serializer_class = PostSerializer
    queryset = Post.objects.filter(status=True).order_by("id")
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = [
        "category",
        "author",
        "status",
    ]
    search_fields = ["title", "content"]
    ordering_fields = ["created_date", "updated_date"]
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Search
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | 
                Q(content__icontains=search)
            )
        
        # Category filter
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category__name=category)
        
        return queryset




class CategoryViewSet(viewsets.ModelViewSet):
    # Category ViewSet with read-only permission for unauthenticated users
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = CategorySerializer
    queryset = Category.objects.all()

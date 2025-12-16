from .serializers import PostSerializer, CategorySerializer
from blog.models import Post, Category
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework import viewsets
from .permissions import IsAuthorOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .paginations import LargeResultsSetPagination

class PostViewSet(viewsets.ModelViewSet):
    pagination_class = LargeResultsSetPagination
    permission_classes = [IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]
    serializer_class = PostSerializer
    queryset = Post.objects.filter(status = True).order_by('id')
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'author', 'status', ]
    search_fields = ['title', 'content']
    ordering_fields = ['created_date', 'updated_date']


class CategoryViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = CategorySerializer
    queryset = Category.objects.all()
from .serializers import PostSerializer, CategorySerializer
from blog.models import Post, Category
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

class PostViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = PostSerializer
    queryset = Post.objects.filter(status = True).order_by('id')

    @action(detail=False, methods=['get'])
    def recent(self, request):
        recent_posts = Post.objects.filter(status=True).order_by('-published_date')[:5]
        serializer = self.get_serializer(recent_posts, many=True)
        return Response(serializer.data)

class CategoryViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = CategorySerializer
    queryset = Category.objects.all()
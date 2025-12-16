from rest_framework import serializers
from blog.models import Post , Category
from django.utils import timezone as TimeZone
from accounts.models import Profile

class PostSerializer(serializers.ModelSerializer):
    snippet = serializers.CharField(source='get_snippet', read_only=True)
    absolute_url = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'image', 'author', 'title', 'snippet', 'absolute_url', 'content', 'status', 'category', 'published_date', ]
        read_only_fields = ['author', 'published_date', ]

    def get_absolute_url (self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(obj.pk)
    
    def to_representation(self, instance):
        request = self.context.get('request')
        rep = super().to_representation(instance)
        if request.parser_context.get('kwargs').get('pk'):
            rep.pop ('snippet',  None)
            rep.pop ('absolute_url', None)
        else:
            rep.pop ('content', None)
        rep['category'] = CategorySerializer(instance.category, context = {'request' : request}).data
        return rep
    
    def create(self, validated_data):
        validated_data['author'] = Profile.objects.get(user__id = self.context['request'].user.id)
        validated_data['published_date'] = TimeZone.now()
        return super().create(validated_data)

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name',]

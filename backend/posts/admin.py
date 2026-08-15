from django.contrib import admin
from .models import Post, PostMedia


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):

    list_display = (
        "author",
        "visibility",
        "created_at",
    )

    list_filter = (
        "visibility",
    )

    search_fields = (
        "author__username",
        "content",
    )



@admin.register(PostMedia)
class PostMediaAdmin(admin.ModelAdmin):

    list_display = (
        "post",
        "media_type",
        "created_at",
    )

    list_filter = (
        "media_type",
    )
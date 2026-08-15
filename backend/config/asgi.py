import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter
from channels.routing import URLRouter

from django.core.asgi import get_asgi_application

from chats.routing import websocket_urlpatterns
from chats.middleware import JWTAuthMiddleware

os.environ.setdefault(
    "DJANGO_SETTINGS_MODULE",
    "config.settings",
)

django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter(

    {

        "http": django_asgi_app,

        "websocket": JWTAuthMiddleware(

            URLRouter(
                websocket_urlpatterns
            )

        ),

    }

)
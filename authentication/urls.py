from django.urls import path
from .views import RegisterView, LoginTokenObtainPairView, SignOutView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginTokenObtainPairView.as_view(), name='login'),
    path('signout/', SignOutView.as_view(), name='signout'),

]
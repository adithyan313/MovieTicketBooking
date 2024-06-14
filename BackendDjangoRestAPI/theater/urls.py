from django.urls import path
from showsapi import views 
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin

urlpatterns = [
    path('admin/', admin.site.urls),
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),

    path('adminlistmovie/', views.admin_list_movies, name='admin_list_movie'),
    path('movies/', views.get_active_movies, name='get_active_movies'),
    path('movieslist/<int:movie_id>/', views.get_movie_by_id, name='movielistid'),
    path('movies/add/', views.add_movie, name='add_movie'), 
    path('movies/edit/<int:pk>/', views.edit_movie, name='edit_movie'),
    path('editmovie/list/<int:movieid>/', views.editmovie_detail, name='editmovielist'), 
    path('movies/delete/<int:pk>/', views.delete_movie, name='delete_movie'), 
    path('movies/disable/<int:pk>/', views.disable_movie, name='disable_movie'), 

    path('bookings/<int:movie_id>/', views.book_ticket, name='book_ticket'),  
    path('bookings/confirm/', views.confirm_booking, name='confirm_booking'),  

    path('my_bookings/', views.my_bookings, name='my_bookings'),  
    path('download_ticket/<int:pk>/', views.download_ticket, name='download_ticket'),  
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
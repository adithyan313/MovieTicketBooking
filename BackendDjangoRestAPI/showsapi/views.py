from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate
from showsapi.serializers import RegisterSerializer
from rest_framework.authtoken.models import Token
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponse
from .models import Movie, Booking
from .serializers import MovieSerializer, BookingSerializer
from .permissions import IsAdminOrReadOnly
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.authentication import TokenAuthentication
from django.conf import settings
import razorpay
from django.http import Http404
from django.core.mail import send_mail
import json
from django.core.files.base import ContentFile
from io import BytesIO
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
import qrcode
import qrcode.image.svg
from datetime import datetime
import io
from .utils import generate_qr_code
from xhtml2pdf import pisa
from django.template.loader import get_template
from django.shortcuts import get_object_or_404
from django.urls import reverse



@csrf_exempt
@api_view(['POST'])
@permission_classes((AllowAny,))
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes((AllowAny,))
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)
    if user is not None:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'username': user.username,
            'isAdmin': user.is_staff 
        }, status=status.HTTP_200_OK)
    else:
        return Response({
            "error": "Invalid credentials or not an admin."
        }, status=status.HTTP_400_BAD_REQUEST)
    
@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated]) 
def logout(request):
    token = request.auth  
    
    if token:
        token.delete()  
        return Response({'message': 'Successfully logged out'}, status=status.HTTP_200_OK)
    
    return Response({'error': 'Invalid token or token not provided'}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET'])
@permission_classes([AllowAny])
def get_active_movies(request):
    movies = Movie.objects.filter(is_active=True)
    serializer = MovieSerializer(movies, many=True)
    return JsonResponse(serializer.data, safe=False)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAdminOrReadOnly])
def admin_list_movies(request):
    movies = Movie.objects.filter()
    serializer = MovieSerializer(movies, many=True)
    return JsonResponse(serializer.data, safe=False)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_movie_by_id(request, movie_id): 
    try:
        movie = Movie.objects.get(id=movie_id, is_active=True) 
    except Movie.DoesNotExist:
        return JsonResponse({'error': 'Movie not found'}, status=404) 

    serializer = MovieSerializer(movie)
    return JsonResponse(serializer.data, safe=False)


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAdminOrReadOnly])
def add_movie(request):
    serializer = MovieSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
    return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAdminOrReadOnly])
def editmovie_detail(request, movieid):
    try:
        movie = Movie.objects.get(id=movieid)
        serializer = MovieSerializer(movie)
        return Response(serializer.data)
    except Movie.DoesNotExist:
        raise Http404("Movie not found")


@api_view(['PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAdminOrReadOnly])
def edit_movie(request, pk):
    try:
        movie = Movie.objects.get(pk=pk)
    except Movie.DoesNotExist:
        return JsonResponse({'error': 'Movie not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = MovieSerializer(movie, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return JsonResponse(serializer.data)
    return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAdminOrReadOnly])
def delete_movie(request, pk):
    try:
        movie = Movie.objects.get(pk=pk)
    except Movie.DoesNotExist:
        return JsonResponse({'error': 'Movie not found'}, status=status.HTTP_404_NOT_FOUND)
    
    movie.delete()
    return JsonResponse({'message': 'Movie deleted'}, status=status.HTTP_200_OK)


@api_view(['PATCH'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAdminOrReadOnly])
def disable_movie(request, pk):
    try:
        movie = Movie.objects.get(pk=pk)
    except Movie.DoesNotExist:
        return JsonResponse({'error': 'Movie not found'}, status=status.HTTP_404_NOT_FOUND)
    
    movie.is_active = False
    movie.save()
    return JsonResponse({'message': 'Movie disabled'}, status=status.HTTP_200_OK)



def create_razorpay_order(amount_in_cents):
    client = razorpay.Client(auth=(settings.RAZORPAY_API_KEY, settings.RAZORPAY_SECRET_KEY))
    order = client.order.create(
        {"amount": amount_in_cents, "currency": "INR", "payment_capture": "1"}
    )
    return order


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def book_ticket(request, movie_id): 
    tickets = request.data.get("tickets", 1)
    your_date = request.data.get("your_date", '2024-01-01')  

    
    try:
        movie = Movie.objects.get(id=movie_id, is_active=True)  
    except Movie.DoesNotExist:
        return JsonResponse({"error": "Movie not found"}, status=404)

    if tickets <= 0:
        return JsonResponse({"error": "Invalid ticket quantity"}, status=400)

    
    total_cost = movie.ticket_price * tickets

    
    razorpay_order = create_razorpay_order(int(total_cost * 100)) 

    
    booking = Booking(
        user=request.user,
        movie=movie,
        tickets=tickets,
        your_date=your_date,
        booking_date=datetime.now(),  
        razorpay_order_id=razorpay_order["id"],  
    )

    booking.save()  


    return JsonResponse({
        "message": "Razorpay order created",
        "razorpay_order_id": razorpay_order["id"],
        "amount": total_cost,
    }, status=201)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def confirm_booking(request):
    data = request.data
    razorpay_order_id = data.get("razorpay_order_id")
    razorpay_payment_id = data.get("razorpay_payment_id")

    client = razorpay.Client(auth=(settings.RAZORPAY_API_KEY, settings.RAZORPAY_SECRET_KEY))
    try:
        payment_details = client.payment.fetch(razorpay_payment_id)
    except razorpay.errors.BadRequestError:
        return Response({"error": "Invalid payment ID"}, status=400)

    if payment_details["status"] != "captured":
        return Response({"error": "Payment not captured"}, status=400)

    try:
        booking = Booking.objects.get(razorpay_order_id=razorpay_order_id)
    except Booking.DoesNotExist:
        return Response({"error": "Booking not found"}, status=404)
    

    qr_data = f"Booking ID: {booking.id}, Movie: {booking.movie.name}, User: {booking.user.username}, Email: {booking.user.email}"

    
    qr_code = generate_qr_code(qr_data)
    
    
    qr_io = io.BytesIO()
    qr_code.save(qr_io, format="PNG")
    qr_io.seek(0)

    
    qr_filename = f"booking_{booking.id}_qr.png"
    booking.qr_image.save(qr_filename, ContentFile(qr_io.read()), save=True)

    send_mail(
        subject="Your Booking Confirmation",
        message=f"Your booking with ID {booking.id} is confirmed for {booking.movie.name}. Enjoy your show, {booking.user.username}.",
        from_email="no-reply@theatre.com",
        recipient_list=[booking.user.email],
        fail_silently=False,
        html_message=f"<p>Your booking with ID {booking.id} is confirmed for {booking.movie.name}.</p><p>Enjoy your show, {booking.user.username}.</p><p>Booking Confirmation QR Code:</p><img src='{settings.SITE_URL}{booking.qr_image.url}' alt='Booking QR Code' />",
    )
    
    return Response({
        "message": "Booking confirmed",
        "booking_id": booking.id,
    }, status=200)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_bookings(request):
    bookings = Booking.objects.filter(user=request.user).order_by("-booking_date")
    serializer = BookingSerializer(bookings, many=True)
    return JsonResponse(serializer.data, safe=False)


@api_view(['GET'])
@permission_classes([IsAuthenticated]) 
def download_ticket(request, pk):
    booking = get_object_or_404(Booking, pk=pk)
    base_url = request.build_absolute_uri('/')

    context = {
        'booking': {
            'movie': booking.movie,
            'user': booking.user,
            'id': booking.id,
            'booking_date': booking.booking_date,
            'tickets': booking.tickets,
            'razorpay_order_id': booking.razorpay_order_id,
            'qr_image': {
                'url': base_url + booking.qr_image.url[1:]  
            }
        }
    }

    template = get_template('BookinG_pdf.html')
    html = template.render(context)

    buffer = BytesIO()

    pisa_status = pisa.CreatePDF(html, dest=buffer)

    if pisa_status.err:
        return Response({"error": "PDF creation error!"}, status=500)
    else:
        response = HttpResponse(buffer.getvalue(), content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="{booking.id}.pdf"'
        return response

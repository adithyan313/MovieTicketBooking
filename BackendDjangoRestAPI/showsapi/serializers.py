from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from .models import Movie, Booking, bayment

class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    password_confirmation = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password_confirmation')

    def validate(self, data):
        if data['password'] != data['password_confirmation']:
            raise serializers.ValidationError("Passwords must match.")
        return data

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user
    
class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = ['id', 'name', 'times', 'ticket_price', 'poster_image', 'description', 'is_active']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.poster_image:
            representation['poster_image'] = instance.poster_image.url
        return representation


class BookingSerializer(serializers.ModelSerializer):
    movie = MovieSerializer(read_only=True)
    class Meta:
        model = Booking
        fields = ['id', 'user', 'movie', 'booking_date', 'tickets', 'razorpay_order_id', 'qr_image', 'your_date' ]

class baymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = bayment
        fields = '__all__'
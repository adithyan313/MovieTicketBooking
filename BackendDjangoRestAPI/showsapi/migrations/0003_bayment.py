# Generated by Django 5.0.4 on 2024-05-04 13:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('showsapi', '0002_booking_booking_pdf_booking_razorpay_order_id'),
    ]

    operations = [
        migrations.CreateModel(
            name='bayment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('razorpay_payment_id', models.CharField(max_length=100)),
            ],
        ),
    ]

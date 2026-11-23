from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0005_user_plans_growth_document'),
    ]

    operations = [
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('kind', models.CharField(choices=[('message', 'پیام مربی'), ('recommend', 'پیشنهاد پست'), ('system', 'سیستم')], default='system', max_length=20)),
                ('title', models.CharField(max_length=200)),
                ('body', models.TextField(blank=True)),
                ('link', models.CharField(blank=True, max_length=300)),
                ('is_read', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='notifications', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'اعلان',
                'verbose_name_plural': 'اعلان‌ها',
                'ordering': ['-created_at'],
            },
        ),
    ]

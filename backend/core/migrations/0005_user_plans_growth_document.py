from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0004_follow'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='sport_plan',
            field=models.TextField(blank=True, default='', verbose_name='برنامه ورزشی'),
        ),
        migrations.AddField(
            model_name='user',
            name='book_plan',
            field=models.TextField(blank=True, default='', verbose_name='برنامه کتاب'),
        ),
        migrations.AddField(
            model_name='growthlog',
            name='skill_document',
            field=models.FileField(blank=True, null=True, upload_to='growth/', verbose_name='مستند مهارت'),
        ),
    ]

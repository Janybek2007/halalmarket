# Generated manually

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='delivery_date',
            field=models.DateTimeField(blank=True, null=True, verbose_name='Дата доставки'),
        ),
        migrations.AlterField(
            model_name='order',
            name='status',
            field=models.CharField(
                choices=[
                    ('pending', 'Ожидание подтверждения'),
                    ('shipped', 'Отправлен'),
                    ('delivered', 'Доставлен'),
                    ('cancelled', 'Отменен'),
                    ('cancellation_requested', 'Запрошена отмена'),
                ],
                default='pending',
                max_length=25,
                verbose_name='Общий статус заказа',
            ),
        ),
    ]

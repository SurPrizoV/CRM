import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate',
  standalone: true,
})
export class FormatDatePipe implements PipeTransform {
  transform(
    value: Date | string,
    format: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }
  ): string {
    const dateValue = typeof value === 'string' ? new Date(value) : value;

    if (isNaN(dateValue.getTime())) {
      return 'Неверная дата';
    }

    const today = new Date();
    const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const tomorrowDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    const dateOnly = new Date(dateValue.getFullYear(), dateValue.getMonth(), dateValue.getDate());

    const timeDiff = todayDateOnly.getTime() - dateOnly.getTime();
    const daysAgo = Math.floor(timeDiff / (1000 * 3600 * 24));
    const daysUntilTomorrow = Math.floor((tomorrowDateOnly.getTime() - dateOnly.getTime()) / (1000 * 3600 * 24));

    let label;
    if (daysAgo === 0) {
      label = 'Сегодня';
    } else if (daysAgo === 1) {
      label = 'Вчера';
    } else if (daysUntilTomorrow === 0) {
      label = 'Завтра';
    } else if (daysUntilTomorrow === -1) {
      label = 'Послезавтра';
    } else if (daysAgo < 0) {
      const futureDays = Math.abs(daysAgo);
      label = `Через ${futureDays} дней`;
    } else if (daysAgo < 30) {
      label = `${daysAgo} дней назад`;
    } else if (daysAgo < 365) {
      const monthsAgo = Math.floor(daysAgo / 30);
      label = `${monthsAgo} мес. назад`;
    } else {
      const yearsAgo = Math.floor(daysAgo / 365);
      label = `${yearsAgo} лет назад`;
    }

    const formattedDate = dateValue.toLocaleDateString('ru-RU', format);

    return `${formattedDate} (${label})`;
  }
}
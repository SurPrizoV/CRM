import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true,
  pure: false,
})
export class FilterPipe implements PipeTransform {
  transform<T>(items: T[], searchText: string, fields: (keyof T)[]): T[] {
    if (!items || !searchText || !fields || fields.length === 0) {
      return items;
    }

    return items.filter((item) =>
      fields.some((field) =>
        String(item[field])
          .toLowerCase()
          .includes(searchText.toLowerCase())
      )
    );
  }
}

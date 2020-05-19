import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'round'
})
export class RoundPipe implements PipeTransform {

  transform(value: number, precision): number {
    return value != null ? Math.round(value * precision) / precision : value;
  }

}

import { Injectable } from '@nestjs/common';

@Injectable()
export class HelperService {
  convertBigIntToInt(obj: any) {
    for (const key in obj) {
      if (typeof obj[key] == 'bigint') {
        obj[key] = Number(obj[key]);
      }
    }

    return obj;
  }

  convertMStoDHMS(ms: number) {
    const days = Math.floor(ms / (24 * 60 * 60 * 1000));
    const daysms = ms % (24 * 60 * 60 * 1000);
    const hours = Math.floor(daysms / (60 * 60 * 1000));
    const hoursms = ms % (60 * 60 * 1000);
    const minutes = Math.floor(hoursms / (60 * 1000));
    const minutesms = ms % (60 * 1000);
    const sec = Math.floor(minutesms / 1000);
    return days + ':' + hours + ':' + minutes + ':' + sec;
  }
}

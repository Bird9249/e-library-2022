import { Transform } from 'class-transformer';
import { hash } from 'bcrypt';

export function HashPassword() {
  return Transform((value) => hash(value.value, 10));
}

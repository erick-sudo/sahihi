import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';

export class CreateCustomerDto {
  @IsNotEmpty({ message: 'name is required' })
  name: string;

  @IsPhoneNumber('KE', { message: 'a valid phone number is required' })
  phone: string;

  @IsEmail({}, { message: 'invalid email address' })
  email: string;

  @IsOptional()
  company: string;
}

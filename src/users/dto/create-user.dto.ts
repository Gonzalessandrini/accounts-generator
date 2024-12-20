import { IsString, IsEmail, MinLength, MaxLength, Matches } from 'class-validator';

export class CreateUserDto {
@IsString()
@MinLength(2, { message: 'The name must be at least 2 characters long.' })
@MaxLength(50, { message: 'The name cannot exceed 50 characters.' })
name: string;

@IsEmail({}, { message: 'The email must have a valid format.' })
email: string;

@IsString()
@MinLength(8, { message: 'The password must be at least 8 characters long.' })
@Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/, {
  message: 'The password must include at least one uppercase letter, one lowercase letter, one number, and one special character.',
})
password: string;
}
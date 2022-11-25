import { IsNotEmpty } from 'class-validator';
export class LoginDto {
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  codeKey: string;
  @IsNotEmpty()
  code: string;
}

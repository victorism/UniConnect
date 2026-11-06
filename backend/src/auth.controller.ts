import { Controller, Post, Body, Get } from '@nestjs/common';

interface SignupDto {
  fullName: string;
  matricNo?: string;
  email: string;
  password: string;
  role: string;
  faculty?: string;
  department?: string;
  level?: string;
}

@Controller('auth')
export class AuthController {
  @Post('signup')
  signup(@Body() body: SignupDto) {
    // TODO: validate, hash password with Argon2/bcrypt, save to PostgreSQL, send verification email
    return {
      success: true,
      message: 'Account created. Please complete verification.',
      user: {
        fullName: body.fullName,
        email: body.email,
        role: body.role,
        faculty: body.faculty,
        department: body.department,
        level: body.level,
      },
    };
  }

  @Post('google')
  googleLogin() {
    return { message: 'Google OAuth endpoint — integrate with Passport Google strategy' };
  }

  @Get('faculties')
  getFaculties() {
    return { message: 'Use data/nsuk-faculties.json' };
  }
}

import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'UniConnect API is running';
  }

  @Get('faculties')
  getFaculties() {
    // Load from data/nsuk-faculties.json in real implementation
    return { message: 'Faculties endpoint - see data/nsuk-faculties.json' };
  }
}

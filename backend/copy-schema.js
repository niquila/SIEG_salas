import { copyFileSync, mkdirSync } from 'fs';

mkdirSync('./prisma', { recursive: true });
copyFileSync('../prisma/schema.prisma', './prisma/schema.prisma');
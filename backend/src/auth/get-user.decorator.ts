import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './user.entity';

// Creamos un decorador que agarra el request, saca el 'user' y te lo devuelve
export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): User => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const req = ctx.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return req.user;
  },
);

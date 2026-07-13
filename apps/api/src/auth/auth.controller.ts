import { Body, Controller, Get, Post, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import {
  type AuthUser,
  type LoginInput,
  LoginSchema,
  type RegisterInput,
  RegisterSchema,
} from "@react-shop/shared";
import { ZodValidationPipe } from "../common/zod-validation.pipe";
import { AuthService } from "./auth.service";

type RequestWithUser = {
  user?: AuthUser;
};

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  login(@Body(new ZodValidationPipe(LoginSchema)) body: LoginInput) {
    return this.authService.login(body);
  }

  @Post("register")
  register(@Body(new ZodValidationPipe(RegisterSchema)) body: RegisterInput) {
    return this.authService.register(body);
  }

  @Get("me")
  @UseGuards(AuthGuard("jwt"))
  me(@Req() request: RequestWithUser) {
    if (!request.user) {
      throw new UnauthorizedException();
    }
    return request.user;
  }
}

import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import {
  AuthTokenResponseSchema,
  type AuthTokenResponse,
  type AuthUser,
  type LoginInput,
  type RegisterInput,
} from "@react-shop/shared";
import { compare } from "bcryptjs";
import { UsersService } from "../users/users.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(input: LoginInput): Promise<AuthTokenResponse> {
    const user = this.usersService.findByEmail(input.email);
    if (!user || !(await compare(input.password, user.passwordHash))) {
      throw new UnauthorizedException("Invalid email or password");
    }

    return this.createTokenResponse(this.usersService.toAuthUser(user));
  }

  async register(input: RegisterInput): Promise<AuthTokenResponse> {
    const user = this.usersService.create(input);
    return this.createTokenResponse(user);
  }

  private createTokenResponse(user: AuthUser): AuthTokenResponse {
    return AuthTokenResponseSchema.parse({
      accessToken: this.jwtService.sign({ sub: user.id }),
      user,
    });
  }
}

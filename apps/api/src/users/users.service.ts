import { ConflictException, Injectable } from "@nestjs/common";
import {
  type AuthUser,
  permissionsForRole,
  type RegisterInput,
  type Role,
} from "@react-shop/shared";
import { hashSync } from "bcryptjs";
import { randomUUID } from "node:crypto";

export type StoredUser = AuthUser & {
  passwordHash: string;
};

type SeedUser = {
  id: string;
  email: string;
  name: string;
  password: string;
  role: Role;
};

const SEEDED_USERS: SeedUser[] = [
  {
    id: "seed-admin",
    email: "admin@react-shop.dev",
    name: "Admin User",
    password: "password123",
    role: "admin",
  },
  {
    id: "seed-manager",
    email: "manager@react-shop.dev",
    name: "Manager User",
    password: "password123",
    role: "manager",
  },
  {
    id: "seed-support",
    email: "support@react-shop.dev",
    name: "Support User",
    password: "password123",
    role: "support",
  },
  {
    id: "seed-user",
    email: "user@react-shop.dev",
    name: "User",
    password: "password123",
    role: "user",
  },
];

@Injectable()
export class UsersService {
  private readonly users: StoredUser[] = SEEDED_USERS.map((user) =>
    this.toStoredUser(user),
  );

  findAll(): AuthUser[] {
    return this.users.map((user) => this.toAuthUser(user));
  }

  findById(id: string): AuthUser | undefined {
    const user = this.users.find((candidate) => candidate.id === id);
    return user ? this.toAuthUser(user) : undefined;
  }

  findByEmail(email: string): StoredUser | undefined {
    return this.users.find(
      (candidate) => candidate.email.toLowerCase() === email.toLowerCase(),
    );
  }

  create(input: RegisterInput): AuthUser {
    if (this.findByEmail(input.email)) {
      throw new ConflictException("User already exists");
    }

    const user = this.toStoredUser({
      id: randomUUID(),
      email: input.email,
      name: input.name,
      password: input.password,
      role: "user",
    });
    this.users.push(user);
    return this.toAuthUser(user);
  }

  toAuthUser(user: StoredUser): AuthUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      permissions: permissionsForRole(user.role),
    };
  }

  private toStoredUser(user: SeedUser): StoredUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      permissions: permissionsForRole(user.role),
      passwordHash: hashSync(user.password, 10),
    };
  }
}

import {
  Alert,
  Box,
  Chip,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import { useAuthStore, useCan } from "@react-shop/auth";
import {
  AuthUserSchema,
  DEFAULT_API_URL,
  RoleSchema,
  type AuthUser,
  type Role,
} from "@react-shop/shared";
import { EmptyState, PageHeader } from "@react-shop/ui";
import { useCallback, useEffect, useState } from "react";
import { z } from "zod";

const UsersResponseSchema = z.array(AuthUserSchema);
const apiUrl = import.meta.env.VITE_API_URL ?? DEFAULT_API_URL;
const roleOptions = RoleSchema.options;

async function fetchUsers(accessToken: string): Promise<AuthUser[]> {
  const response = await fetch(`${apiUrl}/users`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to load users (${response.status})`);
  }
  return UsersResponseSchema.parse(await response.json());
}

async function patchUserRole(
  accessToken: string,
  userId: string,
  role: Role,
): Promise<AuthUser> {
  const response = await fetch(`${apiUrl}/users/${userId}/role`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ role }),
  });
  if (!response.ok) {
    throw new Error(`Failed to update role (${response.status})`);
  }
  return AuthUserSchema.parse(await response.json());
}

export function UsersPage() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const currentUser = useAuthStore((state) => state.user);
  const canReadUsers = useCan("users:read");
  const canWriteUsers = useCan("users:write");
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    if (!accessToken) {
      setUsers([]);
      setError("Sign in again to manage users.");
      return;
    }

    setLoading(true);
    try {
      const data = await fetchUsers(accessToken);
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load users");
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (canReadUsers) {
      void loadUsers();
    }
  }, [canReadUsers, loadUsers]);

  async function handleRoleChange(userId: string, event: SelectChangeEvent<Role>) {
    if (!accessToken) {
      setError("Sign in again to manage users.");
      return;
    }

    const role = RoleSchema.parse(event.target.value);
    setUpdatingUserId(userId);
    setError(null);

    try {
      const updatedUser = await patchUserRole(accessToken, userId, role);
      if (updatedUser.id === currentUser?.id) {
        useAuthStore.getState().setSession({ accessToken, user: updatedUser });
      }
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update role");
    } finally {
      setUpdatingUserId(null);
    }
  }

  if (!canReadUsers) {
    return (
      <EmptyState
        title="Users are unavailable"
        description="Your current role does not include users:read."
      />
    );
  }

  return (
    <Stack spacing={3}>
      <PageHeader
        eyebrow="Users"
        title="User management"
        description="Manage seeded staff accounts with role-derived permissions from the API."
      />

      <Alert severity={canWriteUsers ? "success" : "info"}>
        {canWriteUsers
          ? "users:write is enabled; role changes will be saved immediately."
          : "Read-only mode: role changes require users:write."}
      </Alert>

      {error ? <Alert severity="error">{error}</Alert> : null}

      {loading ? (
        <Paper variant="outlined" sx={{ borderRadius: 4, p: { xs: 3, md: 4 } }}>
          <Typography color="text.secondary">Loading users...</Typography>
        </Paper>
      ) : users.length === 0 ? (
        <EmptyState
          title="No users found"
          description="The API returned an empty users list."
        />
      ) : (
        <Paper variant="outlined" sx={{ borderRadius: 4 }}>
          <List disablePadding>
            {users.map((user) => (
              <ListItem
                key={user.id}
                divider
                secondaryAction={
                  canWriteUsers ? (
                    <FormControl size="small" sx={{ minWidth: 140 }}>
                      <InputLabel id={`role-label-${user.id}`}>Role</InputLabel>
                      <Select
                        labelId={`role-label-${user.id}`}
                        label="Role"
                        value={user.role}
                        disabled={updatingUserId === user.id}
                        onChange={(event) => handleRoleChange(user.id, event)}
                      >
                        {roleOptions.map((role) => (
                          <MenuItem key={role} value={role}>
                            {role}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : (
                    <Chip label={user.role} size="small" />
                  )
                }
              >
                <ListItemText
                  primary={user.name}
                  secondary={
                    <Box component="span" sx={{ display: "block" }}>
                      {user.email} - {user.permissions.join(", ")}
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Stack>
  );
}

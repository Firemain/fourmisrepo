import { z } from "zod";

// Enums
export const RoleSchema = z.enum(["student", "association", "school", "admin"]);
export type Role = z.infer<typeof RoleSchema>;

export const StatusSchema = z.enum(["pending", "approved", "rejected"]);
export type Status = z.infer<typeof StatusSchema>;

// Profile types
export const ProfileSchema = z.object({
  id: z.string().uuid(),
  role: RoleSchema,
  fullName: z.string().nullable(),
  avatarUrl: z.string().url().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Profile = z.infer<typeof ProfileSchema>;

// Mission types
export const MissionSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(1000),
  hours: z.number().int().positive().max(200),
  associationId: z.string().uuid(),
  schoolId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Mission = z.infer<typeof MissionSchema>;

// Registration types
export const RegistrationSchema = z.object({
  id: z.string().uuid(),
  status: StatusSchema,
  missionId: z.string().uuid(),
  studentId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Registration = z.infer<typeof RegistrationSchema>;

// Create types (without IDs and timestamps)
export const CreateMissionSchema = MissionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type CreateMission = z.infer<typeof CreateMissionSchema>;

export const CreateRegistrationSchema = RegistrationSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
});
export type CreateRegistration = z.infer<typeof CreateRegistrationSchema>;

// Update types (partial)
export const UpdateMissionSchema = CreateMissionSchema.partial();
export type UpdateMission = z.infer<typeof UpdateMissionSchema>;

export const UpdateProfileSchema = ProfileSchema.pick({
  fullName: true,
  avatarUrl: true,
}).partial();
export type UpdateProfile = z.infer<typeof UpdateProfileSchema>;

// API Response types
export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
};

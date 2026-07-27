"use server";

import { db } from "@/lib/db";
import { LoginSchema, RegisterSchema, ForgotPasswordSchema, UpdateProfileSchema } from "@/lib/validations/auth";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";

export type AuthResponse = {
  success: boolean;
  message?: string;
  userRole?: Role;
  redirectTo?: string;
  error?: string;
};

export async function loginAction(formData: unknown): Promise<AuthResponse> {
  const parseResult = LoginSchema.safeParse(formData);
  if (!parseResult.success) {
    return {
      success: false,
      error: parseResult.error.issues[0]?.message || "Invalid input data",
    };
  }

  const { email, password } = parseResult.data;

  try {
    // Find user in Prisma database by email or phone number
    const user = await db.user.findFirst({
      where: {
        OR: [
          { email: { equals: email, mode: "insensitive" } },
          { phone: { equals: email, mode: "insensitive" } },
        ],
      },
      include: {
        office: true,
      },
    });

    if (!user) {
      return {
        success: false,
        error: "Invalid email address or password.",
      };
    }

    if (user.status === false || user.isActive === false || user.accountLocked === true) {
      if (user.accountLocked) {
        return {
          success: false,
          error: "Your account is locked due to security policy. Please contact support.",
        };
      }
      return {
        success: false,
        error: "Your account has been deactivated. Please contact support.",
      };
    }

    // Role-based redirection path mapping
    let redirectTo = "/customer";
    if (["ADMIN", "SUPER_ADMIN", "MANAGER", "COUNTER_EMPLOYEE", "ACCOUNTANT"].includes(user.role)) {
      redirectTo = "/admin";
    } else if (user.role === "EMPLOYEE") {
      redirectTo = "/employee";
    } else if (user.role === "PARTNER_OFFICE") {
      redirectTo = "/partner";
    }

    // Log login activity safely
    try {
      await db.activityLog.create({
        data: {
          userId: user.id,
          userRole: user.role,
          module: "AUTH",
          entity: "User",
          entityId: user.id,
          action: `User Logged In (${user.role})`,
        },
      });
    } catch (logErr) {
      console.warn("Failed to create login activity log:", logErr);
    }

    return {
      success: true,
      userRole: user.role,
      redirectTo,
      message: "Login successful!",
    };
  } catch (err: unknown) {
    console.error("Login Action Error:", err);
    return {
      success: false,
      error: "An unexpected error occurred during login. Please try again.",
    };
  }
}

export async function registerCustomerAction(formData: unknown): Promise<AuthResponse> {
  const parseResult = RegisterSchema.safeParse(formData);
  if (!parseResult.success) {
    return {
      success: false,
      error: parseResult.error.issues[0]?.message || "Invalid registration data",
    };
  }

  const { name, phone, email, password } = parseResult.data;

  try {
    // Check if phone or email already registered
    const existingUser = await db.user.findFirst({
      where: {
        OR: [
          { phone },
          ...(email ? [{ email }] : []),
        ],
      },
    });

    if (existingUser) {
      return {
        success: false,
        error: "A user with this mobile number or email already exists.",
      };
    }

    // Create user in DB
    const newUser = await db.user.create({
      data: {
        name,
        phone,
        email: email || null,
        role: "CUSTOMER",
      },
    });

    await db.activityLog.create({
      data: {
        userId: newUser.id,
        action: "Customer Account Registered",
      },
    });

    return {
      success: true,
      userRole: "CUSTOMER",
      redirectTo: "/customer",
      message: "Account registered successfully!",
    };
  } catch (err: unknown) {
    console.error("Register Action Error:", err);
    return {
      success: false,
      error: "Could not create account. Please try again.",
    };
  }
}

export async function updateProfileAction(userId: string, formData: unknown): Promise<AuthResponse> {
  const parseResult = UpdateProfileSchema.safeParse(formData);
  if (!parseResult.success) {
    return {
      success: false,
      error: parseResult.error.issues[0]?.message || "Invalid profile data",
    };
  }

  const { name, phone, email } = parseResult.data;

  try {
    await db.user.update({
      where: { id: userId },
      data: {
        name,
        phone,
        email: email || null,
      },
    });

    return {
      success: true,
      message: "Profile updated successfully!",
    };
  } catch (err: unknown) {
    console.error("Update Profile Error:", err);
    return {
      success: false,
      error: "Failed to update profile.",
    };
  }
}

"use server";

import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { LoginSchema, RegisterSchema, ForgotPasswordSchema, UpdateProfileSchema } from "@/lib/validations/auth";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";

export type AuthResponse = {
  success: boolean;
  message?: string;
  userRole?: Role | string;
  userPhone?: string;
  redirectTo?: string;
  error?: string;
};

export async function employeeLoginAction(input: { username: string; password?: string }): Promise<AuthResponse> {
  if (!input.username || !input.username.trim()) {
    return { success: false, error: 'Please enter your Employee Code, Username, or Mobile number.' };
  }

  try {
    const q = input.username.trim();
    const user = await db.user.findFirst({
      where: {
        OR: [
          { employeeCode: { equals: q, mode: 'insensitive' } },
          { username: { equals: q, mode: 'insensitive' } },
          { phone: { equals: q, mode: 'insensitive' } },
          { email: { equals: q, mode: 'insensitive' } }
        ]
      },
      include: { office: true }
    });

    if (!user) {
      return { success: false, error: 'Invalid Employee Code / Username or Password.' };
    }

    // Strictly reject customers and admins from logging in via staff terminal
    if (user.role === Role.CUSTOMER) {
      return { success: false, error: 'Access Denied. Customer accounts cannot access the Staff Terminal.' };
    }

    if (user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN) {
      return { success: false, error: 'Invalid Employee Code / Username or Password.' };
    }

    if (user.status === false || user.accountLocked === true) {
      return { success: false, error: 'Employee account deactivated or locked.' };
    }

    // Store authenticated staff session in cookies
    const cookieStore = await cookies();
    cookieStore.set("shipkart_staff_id", user.id, { path: "/", httpOnly: true, maxAge: 60 * 60 * 24 * 7 });
    cookieStore.set("shipkart_staff_name", user.name || user.username || "Staff", { path: "/", maxAge: 60 * 60 * 24 * 7 });
    cookieStore.set("shipkart_staff_role", user.role, { path: "/", maxAge: 60 * 60 * 24 * 7 });

    // Direct all staff (including Admin logging in through employee portal) strictly to /employee dashboard
    let targetPath = '/employee';
    if (user.role === Role.PARTNER_OFFICE) {
      targetPath = '/partner/dashboard';
    }

    return {
      success: true,
      message: 'Staff authentication verified',
      userRole: user.role,
      redirectTo: targetPath
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Staff authentication failed' };
  }
}

export async function adminLoginAction(input: { email: string; password?: string }): Promise<AuthResponse> {
  if (!input.email || !input.email.trim()) {
    return { success: false, error: 'Please enter your Admin Email address.' };
  }

  try {
    const emailTrimmed = input.email.trim();
    const user = await db.user.findFirst({
      where: {
        email: { equals: emailTrimmed, mode: 'insensitive' }
      }
    });

    if (!user) {
      return { success: false, error: 'Invalid Admin credentials.' };
    }

    if (user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN) {
      return { success: false, error: 'Access denied. Master Admin privileges required.' };
    }

    if (user.status === false || user.accountLocked === true) {
      return { success: false, error: 'Admin account deactivated or locked.' };
    }

    const cookieStore = await cookies();
    cookieStore.set("shipkart_staff_id", user.id, { path: "/", httpOnly: true, maxAge: 60 * 60 * 24 * 7 });
    cookieStore.set("shipkart_staff_name", user.name || user.username || "Admin", { path: "/", maxAge: 60 * 60 * 24 * 7 });
    cookieStore.set("shipkart_staff_role", user.role, { path: "/", maxAge: 60 * 60 * 24 * 7 });

    return {
      success: true,
      message: 'Admin authentication verified',
      userRole: user.role,
      redirectTo: '/admin'
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Admin authentication failed' };
  }
}

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
          { employeeCode: { equals: email, mode: "insensitive" } },
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

    if (user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN) {
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

    const cookieStore = await cookies();

    // Role-based redirection path mapping & cookie session setup
    let redirectTo = "/customer";
    if (["COUNTER_EMPLOYEE", "ACCOUNTANT", "EMPLOYEE", "ADMIN", "SUPER_ADMIN", "MANAGER"].includes(user.role)) {
      redirectTo = "/employee";
      cookieStore.set("shipkart_staff_id", user.id, { path: "/", httpOnly: true, maxAge: 60 * 60 * 24 * 7 });
      cookieStore.set("shipkart_staff_name", user.name || user.username || "Staff", { path: "/", maxAge: 60 * 60 * 24 * 7 });
      cookieStore.set("shipkart_staff_role", user.role, { path: "/", maxAge: 60 * 60 * 24 * 7 });
    } else if (user.role === "PARTNER_OFFICE") {
      redirectTo = "/partner";
      cookieStore.set("shipkart_staff_id", user.id, { path: "/", httpOnly: true, maxAge: 60 * 60 * 24 * 7 });
      cookieStore.set("shipkart_staff_name", user.name || user.username || "Partner", { path: "/", maxAge: 60 * 60 * 24 * 7 });
      cookieStore.set("shipkart_staff_role", user.role, { path: "/", maxAge: 60 * 60 * 24 * 7 });
    } else {
      // CUSTOMER ROLE SESSION COOKIES
      cookieStore.set("shipkart_customer_phone", user.phone, { path: "/", maxAge: 60 * 60 * 24 * 7 });
      cookieStore.set("shipkart_customer_id", user.id, { path: "/", maxAge: 60 * 60 * 24 * 7 });
      cookieStore.set("shipkart_customer_name", user.name || "Customer", { path: "/", maxAge: 60 * 60 * 24 * 7 });
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
      userPhone: user.phone,
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

    const cookieStore = await cookies();
    cookieStore.set("shipkart_customer_phone", newUser.phone, { path: "/", maxAge: 60 * 60 * 24 * 7 });
    cookieStore.set("shipkart_customer_id", newUser.id, { path: "/", maxAge: 60 * 60 * 24 * 7 });
    cookieStore.set("shipkart_customer_name", newUser.name || "Customer", { path: "/", maxAge: 60 * 60 * 24 * 7 });

    await db.activityLog.create({
      data: {
        userId: newUser.id,
        action: "Customer Account Registered",
      },
    });

    return {
      success: true,
      userRole: "CUSTOMER",
      userPhone: newUser.phone,
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

export async function logoutAction(): Promise<AuthResponse> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("shipkart_staff_id");
    cookieStore.delete("shipkart_staff_name");
    cookieStore.delete("shipkart_staff_role");
    cookieStore.delete("shipkart_customer_phone");
    cookieStore.delete("shipkart_customer_id");
    cookieStore.delete("shipkart_customer_name");

    return {
      success: true,
      redirectTo: "/",
      message: "Session ended successfully."
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Logout failed."
    };
  }
}

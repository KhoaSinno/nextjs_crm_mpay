import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma";

const prisma = new PrismaClient();
export async function GET() {
  try {
    // Get users from database
    const users = await prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        walletAddress: true,
        salary: true,
        status: true,
        role: true,
        dateOfBirth: true,
        gender: true,
        address: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: users,
      message: "Users fetched successfully",
    });
  } catch (error: unknown) {
    console.error("Error fetching users:", error);

    return NextResponse.json(
      {
        success: false,
        data: [],
        message: "Failed to fetch users",
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Log body để debug
    console.log("Request body:", JSON.stringify(body, null, 2));

    // Validate required fields
    if (!body.firstName || !body.lastName || !body.email) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "Missing required fields: firstName, lastName, email",
        },
        { status: 400 }
      );
    }

    // Set default values cho các field bắt buộc nếu không có
    const password = body.password || "defaultpassword123"; // Hoặc generate random password
    const role = body.role || body.designation || "employee"; // Thử cả role và designation

    const userData = {
      fullName: `${body.firstName.trim()} ${body.lastName.trim()}`,
      email: body.email.toLowerCase().trim(),
      password: password, // Đảm bảo có password
      phoneNumber: body.mobile || body.phoneNumber || body.phone || null,
      walletAddress: body.walletAddress || null,
      salary: body.salary ? parseFloat(body.salary) : null,
      status: body.status || "active",
      role: role, // Đảm bảo có role với default value
      dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : null,
      gender: body.gender || null,
      address: body.address || null,
    };

    // Log userData để debug
    console.log("User data to create:", JSON.stringify(userData, null, 2));

    // Validate role value
    const validRoles = ["employee", "accounting", "hr"];
    if (!validRoles.includes(userData.role)) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: `Invalid role. Must be one of: ${validRoles.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Create user in database
    const newUser = await prisma.user.create({
      data: userData,
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        walletAddress: true,
        salary: true,
        status: true,
        role: true,
        dateOfBirth: true,
        gender: true,
        address: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: newUser,
      message: "User created successfully",
    });
  } catch (error: unknown) {
    console.error("Error creating user:", error);

    // Handle Prisma-specific errors
    if (error instanceof Error) {
      if (error.message.includes("Unique constraint")) {
        return NextResponse.json(
          {
            success: false,
            data: null,
            message: "Email already exists",
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        data: null,
        message: "Failed to create user",
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

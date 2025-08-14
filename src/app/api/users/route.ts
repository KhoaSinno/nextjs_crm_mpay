import { NextRequest, NextResponse } from "next/server";
import { Employee } from "@/types/employee";

// Mock data - replace with real database call
const mockEmployees: Employee[] = [
  {
    id: 1,
    name: "Bessie Cooper",
    email: "bessie@company.com",
    phone: "091233412",
    department: "HR",
    designation: "HR Manager",
    type: "Office",
    status: "Permanent",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3",
  },
  {
    id: 2,
    name: "Devon Lane",
    email: "devon@company.com",
    phone: "091233413",
    department: "BA",
    designation: "Business Analyst",
    type: "Remote",
    status: "Permanent",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3",
  },
  {
    id: 3,
    name: "Jenny Wilson",
    email: "jenny@company.com",
    phone: "091233414",
    department: "IT",
    designation: "Software Engineer",
    type: "Office",
    status: "Contract",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b193?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3",
  },
];

export async function GET(request: NextRequest) {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      data: mockEmployees,
      message: "Users fetched successfully",
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        data: [],
        message: "Failed to fetch users",
        error: error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}

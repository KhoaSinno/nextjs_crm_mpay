# Hướng dẫn cài đặt và sử dụng Prisma với MySQL

Hướng dẫn chi tiết từng bước để thiết lập Prisma ORM với MySQL trong dự án Next.js.

## 1. Cài đặt Prisma và driver MySQL

Mở terminal và chạy các lệnh sau để cài đặt Prisma và dependencies cần thiết:

```bash
npm install prisma --save-dev
npm install @prisma/client
npm install mysql2
```

## 2. Khởi tạo Prisma

Khởi tạo Prisma trong dự án:

```bash
npx prisma init
```

Lệnh này sẽ tạo:

- Thư mục `prisma/` chứa file schema
- File `.env` để cấu hình database connection

## 3. Cấu hình chuỗi kết nối MySQL

Mở file `.env` và cấu hình connection string:

```env
DATABASE_URL="mysql://username:password@host:port/dbname"
```

**Ví dụ:**

```env
DATABASE_URL="mysql://root:password123@localhost:3306/my_database"
```

## 4. Khai báo schema trong `prisma/schema.prisma`

Định nghĩa models trong file `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id    Int    @id @default(autoincrement())
  name  String
  email String @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## 5. Chạy migrate để tạo bảng

Tạo và áp dụng migration đầu tiên:

```bash
npx prisma migrate dev --name init
```

Lệnh này sẽ:

- Tạo file migration trong `prisma/migrations/`
- Áp dụng migration vào database
- Tạo Prisma Client

## 6. Tạo file kết nối Prisma Client

Tạo file `lib/db.ts` (hoặc `lib/prisma.ts`) để quản lý Prisma Client:

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
```

## 7. Sử dụng trong API Routes

Ví dụ sử dụng Prisma trong API route `app/api/users/route.ts`:

```typescript
import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

// GET - Lấy danh sách users
export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST - Tạo user mới
export async function POST(request: Request) {
  try {
    const { name, email } = await request.json();
    
    const user = await prisma.user.create({
      data: {
        name,
        email,
      },
    });
    
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
```

## 8. Các lệnh Prisma hữu ích

```bash
# Xem schema hiện tại
npx prisma db pull

# Tạo migration mới
npx prisma migrate dev --name "add_new_field"

# Áp dụng migration cho production
npx prisma migrate deploy

# Mở Prisma Studio để xem data
npx prisma studio

# Reset database (chỉ dùng trong development)
npx prisma migrate reset

# Tạo lại Prisma Client
npx prisma generate
```

## 9. Best Practices

- **Singleton Pattern**: Sử dụng singleton pattern cho Prisma Client để tránh tạo nhiều connections
- **Error Handling**: Luôn wrap database operations trong try-catch
- **Environment Variables**: Không commit file `.env` lên git
- **Migration**: Luôn tạo migration khi thay đổi schema
- **Types**: Sử dụng TypeScript types được generate từ Prisma

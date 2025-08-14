# Hướng dẫn chuyển đổi từ React sang Next.js Convention

## ✅ Đã hoàn thành

### 1. Tạo cấu trúc thư mục Next.js App Router

- ✅ Tạo `src/app/employees/` (route chính cho employees)
- ✅ Tạo `src/app/employees/add/` (route thêm employee)  
- ✅ Tạo `src/app/employees/[id]/` (route chi tiết employee)
- ✅ Tạo `src/app/dashboard/` (route dashboard)
- ✅ Tạo `src/components/` (shared components)
- ✅ Tạo `src/components/ui/` (UI components)

### 2. Convert và di chuyển components

- ✅ Convert `InputField.jsx` → `src/components/ui/input-field.tsx`
- ✅ Convert `SelectField.jsx` → `src/components/ui/select-field.tsx`
- ✅ Tạo `src/components/ui/index.ts` để export components
- ✅ Convert `AllEmployees.tsx` → `src/app/employees/page.tsx`
- ✅ Convert `AddEmployee.tsx` → `src/app/employees/add/page.tsx`

### 3. Thay đổi code đã thực hiện

- ✅ Thay `useNavigate` → `useRouter` from 'next/navigation'
- ✅ Thay `navigate()` → `router.push()`  
- ✅ Thêm `'use client'` directive
- ✅ Cập nhật TypeScript interfaces
- ✅ Sử dụng React.forwardRef với proper typing

## 🔄 Đang làm việc

### Cần di chuyển tiếp

1. **Các page components còn lại:**
   - `DetailEmployee.tsx` → `src/app/employees/[id]/page.tsx`
   - `EmployeeDashboard.tsx` → `src/app/dashboard/page.tsx`
   - `EmployeeWalletPage.tsx` → tạo route `/wallet`
   - `SalaryHistoryPage.tsx` → tạo route `/salary-history`

2. **Form components còn lại:**
   - `InputFieldAuth.jsx` → `src/components/ui/input-field-auth.tsx`
   - `InputFieldPW.jsx` → `src/components/ui/input-field-password.tsx`

3. **Missing components cần tạo:**
   - `Sidebar` component
   - `Header` component

## 📋 Cần làm tiếp

### ❌ Sai (React structure hiện tại)

```
src/
  app/
    employee/
      AllEmployees.tsx     ❌ Component pages nên ở trong route folders
      AddEmployee.tsx      ❌
      DetailEmployee.tsx   ❌
      ...
    components/
      Form/
        InputField.jsx     ❌ File .jsx trong TypeScript project
        ...
```

### ✅ Đúng (Next.js App Router structure)

```
src/
  app/
    employees/                    ✅ Route folder (plural)
      page.tsx                    ✅ Main page (AllEmployees)
      add/
        page.tsx                  ✅ Add employee page
      [id]/
        page.tsx                  ✅ Detail employee page
        edit/
          page.tsx                ✅ Edit employee page
    dashboard/
      page.tsx                    ✅ Employee dashboard
    components/                   ✅ Shared components
      ui/                         ✅ UI components folder
        input-field.tsx           ✅ Kebab-case naming
        select-field.tsx
      employee/
        employee-table.tsx        ✅
        profile-emp.tsx
        tabs-add-new-emp.tsx
```

## 2. Các thay đổi cần thiết

### A. Di chuyển và đổi tên files

1. **Tạo route folders:**

   ```bash
   mkdir src/app/employees
   mkdir src/app/employees/add
   mkdir src/app/employees/[id]
   mkdir src/app/employees/[id]/edit
   ```

2. **Di chuyển components:**

   ```bash
   # Di chuyển AllEmployees.tsx → employees/page.tsx
   # Di chuyển AddEmployee.tsx → employees/add/page.tsx
   # Di chuyển DetailEmployee.tsx → employees/[id]/page.tsx
   ```

3. **Restructure components:**

   ```bash
   mkdir src/components           # Move từ src/app/components
   mkdir src/components/ui        # UI components
   mkdir src/components/employee  # Employee specific components
   ```

### B. Code Changes Required

#### 1. Remove React Router

```tsx
// ❌ Remove these imports
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

// ✅ Replace with Next.js
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
```

#### 2. Update Navigation

```tsx
// ❌ React Router
const navigate = useNavigate();
navigate('/employees/add');

// ✅ Next.js
import { useRouter } from 'next/navigation';
const router = useRouter();
router.push('/employees/add');
```

#### 3. File Extensions

```bash
# ❌ Change all .jsx files to .tsx
InputField.jsx → input-field.tsx
SelectField.jsx → select-field.tsx
```

#### 4. Component Export Conventions

```tsx
// ❌ React style
const AllEmployees = () => {
  // component code
};
export default AllEmployees;

// ✅ Next.js page style (for pages only)
export default function EmployeesPage() {
  // component code
}

// Or for regular components
export function InputField() {
  // component code
}
```

#### 5. Import Path Updates

```tsx
// ❌ Current imports
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

// ✅ Updated imports (assuming you move components)
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
```

### C. Component Structure Changes

#### 1. Page Components

```tsx
// src/app/employees/page.tsx
'use client'; // Add if using hooks/state

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EmployeeTable } from '@/components/employee/employee-table';

export default function EmployeesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const handleAddEmployee = () => {
    router.push('/employees/add');
  };

  return (
    // JSX content
  );
}
```

#### 2. UI Components

```tsx
// src/components/ui/input-field.tsx
'use client';

import { forwardRef } from 'react';

interface InputFieldProps {
  label?: string;
  placeholder?: string;
  type?: string;
  error?: string;
  [key: string]: any;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(({
  label,
  placeholder,
  type = "text",
  error,
  ...props
}, ref) => {
  return (
    // JSX content
  );
});

InputField.displayName = 'InputField';
```

## 3. Migration Steps

### Step 1: Setup TypeScript Config

Ensure `tsconfig.json` có path aliases:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Step 2: Create Route Structure

```bash
# Create new route folders
mkdir -p src/app/employees/{add,[id],dashboard,wallet,salary-history}
```

### Step 3: Move and Convert Components

1. Move `components` folder từ `src/app/` ra `src/`
2. Convert `.jsx` files thành `.tsx`
3. Update component exports và imports

### Step 4: Convert Pages

1. Convert each page component
2. Add `'use client'` directive nếu cần
3. Update navigation logic
4. Fix import paths

### Step 5: Update Dependencies

```bash
# Remove react-router-dom nếu không cần
npm uninstall react-router-dom

# Install Next.js specific packages nếu chưa có
npm install @types/node @types/react @types/react-dom
```

## 4. Common Issues & Solutions

### Issue 1: "useNavigate is not defined"

```tsx
// ❌
import { useNavigate } from 'react-router-dom';

// ✅
import { useRouter } from 'next/navigation';
```

### Issue 2: "Component not found"

Check import paths và file locations.

### Issue 3: "Hydration mismatch"

Add `'use client'` directive ở top của components sử dụng useState, useEffect, etc.

### Issue 4: "Module not found"

Update import paths sử dụng `@/` alias.

## 5. Best Practices

1. **File Naming:** Use kebab-case cho file names
2. **Component Naming:** Use PascalCase cho component names
3. **Folder Structure:** Group related components
4. **Type Safety:** Convert all `.jsx` to `.tsx`
5. **Client Components:** Only add `'use client'` when necessary
6. **Import Paths:** Use absolute imports với `@/` alias

## 6. Next Steps After Migration

1. Test all routes
2. Verify all navigation works
3. Check responsive design
4. Test form submissions
5. Verify API routes work
6. Update any remaining React Router references

---

*Lưu ý: File này sẽ được cập nhật khi migration hoàn thành.*

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

Tôi sẽ giúp bạn lập **plan 5 ngày để hoàn thành MVP** cho dự án này, kết hợp cả Next.js (TS), Foundry (Solidity), MySQL (qua ORM) và ý tưởng CRM trả lương on-chain bằng stablecoin.

---

## **Plan 5 ngày – Hoàn thành MVP**

### **Ngày 1 – Chuẩn bị môi trường & Cấu trúc dự án**

**Mục tiêu:**

- Cài đặt toàn bộ công cụ dev
- Chuẩn bị repo Github cho BE/FE & Smart Contract
- Chạy thử Foundry + Remix

**Việc cần làm:**

1. **Môi trường Smart Contract**

   - Cài [Foundry](https://book.getfoundry.sh/getting-started/installation)
   - Khởi tạo project: `forge init payroll-treasury`
   - Thêm contract `PayrollTreasury.sol` vào thư mục `src/`
   - Test compile: `forge build`
   - Chạy thử trên Remix bằng việc copy contract vào Remix IDE
   - Kết nối Github với Remix để sync code nhanh

2. **Môi trường Web**

   - `npx create-next-app@latest crm-payroll --typescript`
   - Cấu trúc folder:

     ```
     /pages
     /components
     /lib (connect Web3, database)
     /contracts (abi json)
     ```

   - Cài ORM: Prisma hoặc Sequelize (`npm install @prisma/client prisma` hoặc `sequelize mysql2`)
   - Tạo file `.env` chứa DB URL

3. **Database**

   - MySQL cài local hoặc dùng Docker
   - Tạo bảng `users`, `payroll_history`
   - ORM migration

---

### **Ngày 2 – Hoàn thiện Smart Contract**

**Mục tiêu:**

- Hoàn thiện contract PayrollTreasury cho stablecoin
- Test chức năng deposit/withdraw/runPayroll

**Việc cần làm:**

1. **Thêm ERC20 Stablecoin Support**

   - Import OpenZeppelin ERC20 interface
   - Sửa `deposit()` và `withdraw()` để làm việc với token
   - Thêm biến `token` để chọn loại stablecoin (USDC, USDT)

2. **Viết test với Foundry**

   - Test deploy
   - Test registerEmployee
   - Test runPayroll
   - Test daily limit

3. **Triển khai thử**

   - Deploy local Anvil: `anvil`
   - Deploy: `forge script script/Deploy.s.sol --rpc-url http://127.0.0.1:8545 --private-key ...`

---

### **Ngày 3 – Kết nối FE với Contract**

**Mục tiêu:**

- FE Next.js gọi hàm từ contract
- Sử dụng wagmi + viem + MetaMask

**Việc cần làm:**

1. Cài:

   ```bash
   npm install wagmi viem ethers
   ```

2. Tạo hook `usePayrollContract.ts`:

   - Load ABI JSON
   - Kết nối contract bằng `viem` hoặc `ethers`
3. Tạo các page:

   - `/dashboard` – quản lý nhân viên, chạy payroll
   - `/employee` – xem lịch sử trả lương
4. Viết API route Next.js để lưu thông tin nhân viên vào MySQL song song với blockchain

---

### **Ngày 4 – Chức năng CRM + UI**

**Mục tiêu:**

- Hoàn thiện giao diện cơ bản
- CRUD nhân viên + Lịch sử trả lương

**Việc cần làm:**

1. **UI**

   - TailwindCSS hoặc shadcn/ui
   - Component: Table nhân viên, Form đăng ký, Modal trả lương
2. **Backend API**

   - `/api/employees` – thêm/sửa/xóa
   - `/api/payroll` – lấy lịch sử từ MySQL
3. **Kết hợp on-chain & off-chain**

   - Khi đăng ký nhân viên → gọi contract + lưu DB
   - Khi runPayroll → gọi contract + lưu record DB

---

### **Ngày 5 – Test, Deploy & Demo**

**Mục tiêu:**

- Test toàn bộ flow
- Deploy thử FE & contract

**Việc cần làm:**

1. **Test Local**

   - Deploy contract trên testnet (Sepolia, Mumbai…)
   - Test kết nối FE → Wallet → Contract
   - Test giới hạn rút hàng ngày
2. **Deploy**

   - Contract: `forge script ... --rpc-url <testnet> --broadcast`
   - FE: Vercel
   - DB: Planetscale hoặc Railway
3. **Chuẩn bị Demo**

   - Flow: Đăng nhập MetaMask → Đăng ký nhân viên → Nạp stablecoin → Chạy payroll → Kiểm tra ví nhận

---

Nếu bạn muốn, tôi có thể viết **phiên bản contract hỗ trợ stablecoin** ngay hôm nay để bạn dùng cho ngày 2, và kèm luôn **hook kết nối Next.js** để ngày 3 bạn chỉ cần ráp UI.
Bạn muốn tôi viết ngay phần này không?

## 🎯 Next Steps

1. **Test API thoroughly**: Tất cả CRUD operations
2. **Add real database**: Thay mock data bằng real DB
3. **Add form validation**: Cho create/edit forms  
4. **Error boundaries**: Cho better error handling
5. **Loading states**: Cho better UX

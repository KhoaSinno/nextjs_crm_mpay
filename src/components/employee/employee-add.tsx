import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { InputField } from "@/components/ui/input-field";
import { SelectField } from "@/components/ui/select-field";
import {
  User,
  Briefcase,
  FileText,
  Key,
  Calendar,
  ChevronDown,
  Camera,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { employeeApi } from "@/lib/api";
import { Employee } from "@/types/employee";
import { useRegisterEmployee } from "@/hooks/usePayrollContract";

// Validation schemas cho từng tab
const personalInfoSchema = Yup.object().shape({
  firstName: Yup.string()
    .required("Tên không được để trống")
    .min(2, "Tên phải có ít nhất 2 ký tự"),
  lastName: Yup.string()
    .required("Họ không được để trống")
    .min(2, "Họ phải có ít nhất 2 ký tự"),
  mobile: Yup.string()
    .required("Số điện thoại không được để trống")
    .matches(/^[0-9]{10,11}$/, "Số điện thoại phải có 10-11 chữ số"),
  email: Yup.string()
    .required("Email không được để trống")
    .email("Email không hợp lệ"),
  dateOfBirth: Yup.string().required("Ngày sinh không được để trống"),
  maritalStatus: Yup.string().required(
    "Tình trạng hôn nhân không được để trống"
  ),
  gender: Yup.string().required("Giới tính không được để trống"),
  address: Yup.string().required("Địa chỉ không được để trống"),
});

const professionalInfoSchema = Yup.object().shape({
  walletAddress: Yup.string().required("Địa chỉ ví không được để trống"),
  salary: Yup.number()
    .required("Lương không được để trống")
    .positive("Lương phải là số dương")
    .min(0, "Lương không được âm"),
  payday: Yup.string().required("Ngày trả lương không được để trống"),
});

const TabsAddNewEmp = ({ onBack }: { onBack: () => void }) => {
  const [activeTab, setActiveTab] = useState(0);
  const router = useRouter();

  // UseHook contract

  const { registerEmployee } = useRegisterEmployee();

  // Form validation cho Personal Info
  const personalForm = useForm({
    resolver: yupResolver(personalInfoSchema),
    mode: "all", // Validate khi onChange, onBlur, và onSubmit
    reValidateMode: "onChange", // Re-validate ngay khi người dùng gõ
    defaultValues: {
      firstName: "",
      lastName: "",
      mobile: "",
      email: "",
      dateOfBirth: "",
      maritalStatus: "",
      gender: "",
      address: "",
    },
  });

  // Form validation cho Professional Info
  const professionalForm = useForm({
    resolver: yupResolver(professionalInfoSchema),
    mode: "all", // Validate khi onChange, onBlur, và onSubmit
    reValidateMode: "onChange", // Re-validate ngay khi người dùng gõ
    defaultValues: {
      walletAddress: "",
      salary: 0,
      payday: "",
    },
  });

  // Chọn form phù hợp với tab hiện tại
  const currentForm = activeTab === 0 ? personalForm : professionalForm;

  const tabs = [
    {
      id: 0,
      name: "Personal Information",
      icon: User,
      completed: false,
      active: true,
    },
    {
      id: 1,
      name: "Professional Information",
      icon: Briefcase,
      completed: false,
      active: false,
    },
  ];

  const handleNext = async () => {
    if (activeTab === 0) {
      // Validate Personal Info trước khi chuyển tab
      const isValid = await personalForm.trigger();
      if (isValid && activeTab < tabs.length - 1) {
        setActiveTab(activeTab + 1);
      }
    } else if (activeTab === 1) {
      // Validate Professional Info trước khi submit
      const isValid = await professionalForm.trigger();
      if (isValid) {
        // Submit toàn bộ form khi ở tab cuối
        const personalData = personalForm.getValues();
        const professionalData = professionalForm.getValues();

        const allData = { ...personalData, ...professionalData };
        console.log("Form data to submit:", allData);
        const res = await employeeApi.createUser(
          allData as unknown as Omit<Employee, "id">
        );

        console.log("API response:", res);

        // Gọi hook để đăng ký nhân viên
        const hash = await registerEmployee(
          professionalData.walletAddress,
          professionalData.salary
        );

        console.log("Transaction hash:", hash);

        // TODO: Gọi API để lưu dữ liệu
        // Có thể navigate về danh sách nhân viên
        handleCancel();
      }
    }
  };

  const handleCancel = () => {
    if (onBack) {
      onBack();
    } else {
      router.push("/employees");
    }
  };

  const maritalStatusOptions = [
    { value: "single", label: "Single" },
    { value: "married", label: "Married" },
    { value: "divorced", label: "Divorced" },
    { value: "widowed", label: "Widowed" },
  ];

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  const nationalityOptions = [
    { value: "vietnamese", label: "Vietnamese" },
    { value: "american", label: "American" },
    { value: "british", label: "British" },
    { value: "canadian", label: "Canadian" },
    { value: "australian", label: "Australian" },
    { value: "other", label: "Other" },
  ];

  return (
    <div className="bg-white rounded-[10px] border border-zinc-400/20 p-5 sm:p-8 ">
      {/* Tabs Header */}
      <div className="flex flex-col mb-8 gap-7">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-5">
          {tabs.map((tab, index) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === index;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(index)}
                className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
              >
                <div className="relative flex items-center justify-center w-6 h-6">
                  <IconComponent
                    className={`w-5 h-5 ${
                      isActive ? "text-indigo-500" : "text-zinc-900"
                    }`}
                  />
                </div>
                <span
                  className={`text-base font-lexend leading-normal ${
                    isActive
                      ? "text-indigo-500 font-semibold"
                      : "text-zinc-900 font-light"
                  }`}
                >
                  {tab.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-zinc-400/20" />

        {/* Progress Bar */}
        <div className="w-full bg-zinc-400/10 h-[3px] rounded-full">
          <div
            className="h-full transition-all duration-300 bg-indigo-500 rounded-full"
            style={{ width: `${((activeTab + 1) / tabs.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 0 && (
        <div className="space-y-5">
          {/* Profile Photo */}
          <div className="flex flex-col gap-5">
            <div className="w-24 h-24 bg-zinc-400/5 rounded-[10px] border border-zinc-400/20 flex items-center justify-center group hover:bg-zinc-400/10 transition-colors cursor-pointer">
              <Camera className="w-8 h-8 text-zinc-400 group-hover:text-zinc-500" />
            </div>
            <p className="text-sm font-light text-zinc-400 font-lexend">
              Click to upload profile photo
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-5">
            {/* Name Fields */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <InputField
                label="First Name"
                placeholder="First Name"
                {...personalForm.register("firstName")}
                error={personalForm.formState.errors.firstName?.message}
              />
              <InputField
                label="Last Name"
                placeholder="Last Name"
                {...personalForm.register("lastName")}
                error={personalForm.formState.errors.lastName?.message}
              />
            </div>

            {/* Contact Fields */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <InputField
                label="Mobile Number"
                placeholder="Mobile Number"
                type="tel"
                {...personalForm.register("mobile")}
                error={personalForm.formState.errors.mobile?.message}
              />
              <InputField
                label="Email Address"
                placeholder="Email Address"
                type="email"
                {...personalForm.register("email")}
                error={personalForm.formState.errors.email?.message}
              />
            </div>

            {/* Date of Birth & Marital Status */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <div className="relative flex-1 h-14">
                <input
                  type="date"
                  {...personalForm.register("dateOfBirth")}
                  className={`w-full h-full px-4 pr-10 rounded-[10px] border text-base font-light font-lexend text-zinc-900 focus:outline-none focus:ring-1
                                        ${
                                          personalForm.formState.errors
                                            .dateOfBirth
                                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                            : "border-zinc-400/20 focus:border-indigo-500 focus:ring-indigo-500"
                                        }`}
                />
                <div className="absolute transform -translate-y-1/2 pointer-events-none right-4 top-1/2">
                  <Calendar className="w-5 h-5 text-zinc-900" />
                </div>
                {personalForm.formState.errors.dateOfBirth && (
                  <span className="absolute left-0 text-xs text-red-500 -bottom-5 font-lexend">
                    {personalForm.formState.errors.dateOfBirth.message}
                  </span>
                )}
              </div>
              <SelectField
                label="Marital Status"
                placeholder="Marital Status"
                options={maritalStatusOptions}
                {...personalForm.register("maritalStatus")}
                error={personalForm.formState.errors.maritalStatus?.message}
              />
            </div>

            {/* Gender & Nationality */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <SelectField
                label="Gender"
                placeholder="Gender"
                options={genderOptions}
                {...personalForm.register("gender")}
                error={personalForm.formState.errors.gender?.message}
              />
            </div>

            {/* Address */}
            <div className="w-full">
              <InputField
                label="Address"
                placeholder="Address"
                {...personalForm.register("address")}
                error={personalForm.formState.errors.address?.message}
              />
            </div>
          </div>
        </div>
      )}

      {/* Other tabs placeholder */}
      {activeTab === 1 && (
        <div className="space-y-5">
          <InputField
            label="Wallet Address"
            placeholder="Wallet Address"
            {...professionalForm.register("walletAddress")}
            error={professionalForm.formState.errors.walletAddress?.message}
          />
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <InputField
              label="Salary"
              placeholder="Salary"
              type="number"
              {...professionalForm.register("salary")}
              error={professionalForm.formState.errors.salary?.message}
            />

            <InputField
              label="Payday"
              placeholder="Payday"
              type="date"
              {...professionalForm.register("payday")}
              error={professionalForm.formState.errors.payday?.message}
            />
          </div>
        </div>
      )}

      {/* {activeTab === 2 && (
                <div className="py-20 text-center">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-zinc-400" />
                    <h3 className="mb-2 text-xl font-semibold text-zinc-900 font-lexend">
                        Documents
                    </h3>
                    <p className="text-zinc-400 font-lexend">
                        This tab will be implemented next
                    </p>
                </div>
            )}

            {activeTab === 3 && (
                <div className="py-20 text-center">
                    <Key className="w-16 h-16 mx-auto mb-4 text-zinc-400" />
                    <h3 className="mb-2 text-xl font-semibold text-zinc-900 font-lexend">
                        Account Access
                    </h3>
                    <p className="text-zinc-400 font-lexend">
                        This tab will be implemented next
                    </p>
                </div>
            )} */}

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-5 pt-6 mt-8 border-t border-zinc-400/20">
        <button
          onClick={handleCancel}
          className="h-12 px-5 rounded-[10px] border border-zinc-400/20 flex justify-center items-center gap-2.5 hover:bg-gray-50 transition-colors"
        >
          <span className="text-base font-light text-zinc-900 font-lexend">
            Cancel
          </span>
        </button>
        <button
          onClick={handleNext}
          disabled={currentForm.formState.isSubmitting}
          className="h-12 px-6 bg-indigo-500 rounded-[10px] flex justify-center items-center gap-2.5 hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="text-base font-light text-white font-lexend">
            {currentForm.formState.isSubmitting
              ? "Đang xử lý..."
              : activeTab === tabs.length - 1
              ? "Submit"
              : "Next"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default TabsAddNewEmp;

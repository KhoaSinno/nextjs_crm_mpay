import { useState } from "react";
import { User, Calendar, Edit, X, Save } from "lucide-react";
import InputField from "../_Form_temp/InputField";
import SelectField from "../_Form_temp/SelectField";
import { updateProfile } from "../../api/user";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

const employeeSchema = Yup.object().shape({
  fullName: Yup.string().required("Full name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
  dateOfBirth: Yup.date().required("Date of birth is required"),
  gender: Yup.string().required("Gender is required"),
  walletAddress: Yup.string().required("Wallet address is required"),
  address: Yup.string().required("Address is required"),
});

export const ProfileEmp = ({ employeeData }) => {
  const [activeTab, _setActiveTab] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { updateUser } = useAuth(); // Lấy hàm updateUser từ AuthContext

  const employee = employeeData;

  // react-hook-form with yup validation
  // Helper để viết hoa chữ cái đầu
  const capitalizeFirstLetter = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const empEditForm = useForm({
    resolver: yupResolver(employeeSchema),
    mode: "all",
    reValidateMode: "onChange",
    defaultValues: {
      fullName: employee?.fullName || "",
      email: employee?.email || "",
      phoneNumber: employee?.phoneNumber || "",
      dateOfBirth: employee?.dateOfBirth
        ? new Date(employee.dateOfBirth).toISOString().split("T")[0]
        : "",
      gender: capitalizeFirstLetter(employee?.gender),
      walletAddress: employee?.walletAddress || "",
      address: employee?.address || "",
    },
  });

  // Handle opening edit modal
  const handleEditClick = () => {
    // Reset form with current employee data, chuyển gender sang chữ hoa đầu
    empEditForm.reset({
      fullName: employee?.fullName || "",
      email: employee?.email || "",
      phoneNumber: employee?.phoneNumber || "",
      dateOfBirth: employee?.dateOfBirth
        ? new Date(employee.dateOfBirth).toISOString().split("T")[0]
        : "",
      gender: capitalizeFirstLetter(employee?.gender),
      walletAddress: employee?.walletAddress || "",
      address: employee?.address || "",
    });
    setIsEditModalOpen(true);
  };

  // Handle closing edit modal
  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    empEditForm.reset();
  };

  // Handle save changes using react-hook-form
  const onSubmit = async (data) => {
    // Chuyển gender về chữ thường khi submit
    const submitData = {
      ...data,
      gender: data.gender.toLowerCase(),
    };
    console.log("Saving changes:", submitData);
    try {
      await updateProfile(submitData);

      // Cập nhật dữ liệu user trong AuthContext và localStorage
      const updatedUserData = {
        ...employee,
        ...submitData,
        gender: data.gender.toLowerCase(),
      };
      updateUser(updatedUserData);

      toast.success("Employee updated successfully");
      handleCloseModal();

      // Force re-render bằng cách reload trang (tùy chọn)
      // window.location.reload();
    } catch (error) {
      toast.error("Error updating employee");
      console.error("Error updating employee:", error);
    }
  };

  // Move InfoField and personalInfoFields inside the component
  const personalInfoFields = [
    // { label: 'First Name', value: employee.firstName },
    // { label: 'Last Name', value: employee.lastName },
    { label: "Full name", value: employee.fullName },
    { label: "Mobile Number", value: employee.phoneNumber },
    { label: "Email Address", value: employee.email },
    {
      label: "Date of Birth",
      value: employee.dateOfBirth
        ? typeof employee.dateOfBirth === "string"
          ? new Date(employee.dateOfBirth).toISOString().split("T")[0]
          : employee.dateOfBirth.toISOString().split("T")[0]
        : "",
    },
    // { label: 'Marital Status', value: employee.maritalStatus },
    { label: "Gender", value: capitalizeFirstLetter(employee.gender) },
    // { label: 'Nationality', value: employee.nationality },
    { label: "Wallet Address", value: employee.walletAddress },
    { label: "Address", value: employee.address },
    // { label: 'City', value: employee.city },
    // { label: 'State', value: employee.state },
    // { label: 'Zip Code', value: employee.zipCode }
  ];

  const InfoField = ({ label, value }) => (
    <div className="w-full max-w-sm flex flex-col gap-2.5">
      <div className="flex flex-col gap-1">
        <div className="text-sm font-light text-zinc-400 font-lexend">
          {label}
        </div>
        <div className="text-base font-light text-zinc-900 font-lexend">
          {value}
        </div>
      </div>
      <div className="w-full h-px bg-zinc-400/10" />
    </div>
  );

  return (
    <div className="flex gap-6 p-6">
      {/* Nội dung chính */}
      <div className="flex flex-col flex-1 gap-7">
        {/* Header */}
        <div className="flex flex-col gap-7">
          <div className="flex items-end justify-between w-full">
            <div className="flex items-start gap-4">
              {/* <img
                                    className="w-24 h-24 rounded-[10px] object-cover"
                                    src={employee.avatar}
                                    alt={`${employee.firstName} ${employee.lastName}`}
                                /> */}
              <div className="flex flex-col gap-2">
                <div className="text-2xl font-semibold text-zinc-900 font-lexend">
                  {employee.fullName}
                </div>
                <div className="flex flex-col gap-2">
                  {/* <div className="flex items-center gap-2.5">
                                            <Briefcase className="w-6 h-6 text-zinc-900" />
                                            <div className="text-base font-light text-zinc-900 font-lexend">
                                                {employee.position}
                                            </div>
                                        </div> */}
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-6 h-6 text-zinc-900" />
                    <div className="text-base font-light text-zinc-900 font-lexend">
                      {employee.email}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button
              className="h-12 px-5 bg-indigo-500 rounded-[10px] flex items-center gap-2.5 hover:bg-indigo-600 transition-colors"
              onClick={handleEditClick}
            >
              <Edit className="w-6 h-6 text-white" />
              <div className="text-base font-light text-white font-lexend">
                Edit Profile
              </div>
            </button>
          </div>
          <div className="w-full h-px bg-zinc-400/20" />
        </div>

        {/* Personal Information */}
        {activeTab === 0 && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2.5">
              <User className="w-6 h-6 text-indigo-500" />
              <div className="text-base font-semibold text-indigo-500 font-lexend">
                Personal Information
              </div>
            </div>
            <div className="w-full h-px bg-zinc-400/20" />
            <div className="w-52 h-[3px] bg-indigo-500 rounded-full" />

            {/* Information Grid */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {personalInfoFields.map((field, index) => (
                <InfoField
                  key={index}
                  label={field.label}
                  value={field.value}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-[20px] w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-400/20">
              <div className="flex items-center gap-2.5">
                <Edit className="w-6 h-6 text-indigo-500" />
                <h2 className="text-xl font-semibold text-zinc-900 font-lexend">
                  Edit Profile
                </h2>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 transition-colors rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-zinc-900" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={empEditForm.handleSubmit(onSubmit)}>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Full Name */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-light text-zinc-400 font-lexend">
                      Full Name
                    </label>
                    <InputField
                      type="text"
                      placeholder="Enter full name"
                      {...empEditForm.register("fullName")}
                      error={empEditForm.formState.errors.fullName?.message}
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-light text-zinc-400 font-lexend">
                      Email Address
                    </label>
                    <InputField
                      type="email"
                      placeholder="Enter email address"
                      {...empEditForm.register("email")}
                      error={empEditForm.formState.errors.email?.message}
                    />
                  </div>

                  {/* Mobile */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-light text-zinc-400 font-lexend">
                      Mobile Number
                    </label>
                    <InputField
                      type="tel"
                      placeholder="Enter phone number"
                      {...empEditForm.register("phoneNumber")}
                      error={empEditForm.formState.errors.phoneNumber?.message}
                    />
                  </div>

                  {/* Date of Birth */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-light text-zinc-400 font-lexend">
                      Date of Birth
                    </label>
                    <InputField
                      type="date"
                      placeholder="Select date of birth"
                      {...empEditForm.register("dateOfBirth")}
                      error={empEditForm.formState.errors.dateOfBirth?.message}
                    />
                  </div>

                  {/* Gender */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-light text-zinc-400 font-lexend">
                      Gender
                    </label>
                    <SelectField
                      placeholder="Select gender"
                      {...empEditForm.register("gender")}
                      error={empEditForm.formState.errors.gender?.message}
                      options={[
                        { value: "Male", label: "Male" },
                        { value: "Female", label: "Female" },
                        { value: "Other", label: "Other" },
                      ]}
                    />
                  </div>

                  {/* Empty space for grid layout */}
                  <div></div>

                  {/* Address */}
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-sm font-light text-zinc-400 font-lexend">
                      Address
                    </label>
                    <InputField
                      placeholder="Enter address"
                      {...empEditForm.register("address")}
                      error={empEditForm.formState.errors.address?.message}
                    />
                  </div>

                  {/* Wallet Address */}
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-sm font-light text-zinc-400 font-lexend">
                      Wallet Address
                    </label>
                    <InputField
                      placeholder="Enter wallet address"
                      {...empEditForm.register("walletAddress")}
                      error={
                        empEditForm.formState.errors.walletAddress?.message
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-zinc-400/20">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2.5 border border-zinc-400/20 rounded-[10px] text-sm font-light text-zinc-900 font-lexend hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!empEditForm.formState.isValid}
                  className="px-6 py-2.5 bg-indigo-500 rounded-[10px] text-sm font-light text-white font-lexend hover:bg-indigo-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

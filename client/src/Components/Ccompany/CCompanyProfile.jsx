import React, { useEffect, useState } from "react";
import Sidebar from "../Common/SSidebar";

const CompanyProfile = ({ companyId }) => {
  const emptyProfile = {
    name: "",
    email: "",
    phone: "",
    location: "",
    purpose: "",
    details: [],
  };

  const emptyDetail = {
    title: "",
    value: "",
  };

  const [profile, setProfile] = useState(emptyProfile);
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showDetailForm, setShowDetailForm] = useState(false);
  const [detailForm, setDetailForm] = useState(emptyDetail);
  const [detailError, setDetailError] = useState("");
  const [editingDetailIndex, setEditingDetailIndex] = useState(null);

  const detailRows = (profile.details || []).map((detail, index) => ({
    ...detail,
    index,
  }));

  useEffect(() => {
    fetch(`http://localhost:5000/company-profile?companyId=${companyId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setProfile({
            ...emptyProfile,
            ...data,
            details: data.details || [],
          });
          setIsEditing(false);
          setIsSaved(true);
          setShowForm(false);
        }
      })
      .catch((err) => console.log(err));
  }, [companyId]);

  const validateField = (name, value) => {
    let error = "";

    if (name === "name" && !value) error = "Company name required";

    if (name === "email") {
      if (!value) error = "Email required";
      else if (!/\S+@\S+\.\S+/.test(value)) error = "Invalid email";
    }

    if (name === "phone") {
      if (!value) error = "Phone required";
      else if (!/^\d{10}$/.test(value)) error = "Phone must be 10 digits";
    }

    if (name === "location" && !value) error = "Location required";
    if (name === "purpose" && !value) error = "Purpose required";

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validate = () => {
    const newErrors = {};

    if (!profile.name) newErrors.name = "Company name required";

    if (!profile.email) newErrors.email = "Email required";
    else if (!/\S+@\S+\.\S+/.test(profile.email)) {
      newErrors.email = "Invalid email";
    }

    if (!profile.phone) newErrors.phone = "Phone required";
    else if (!/^\d{10}$/.test(profile.phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }

    if (!profile.location) newErrors.location = "Location required";
    if (!profile.purpose) newErrors.purpose = "Purpose required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const persistProfile = async (nextProfile) => {
    const hasId = Boolean(nextProfile._id);
    const res = await fetch(
      hasId
        ? `http://localhost:5000/company-profile/${nextProfile._id}`
        : "http://localhost:5000/company-profile",
      {
        method: hasId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...nextProfile, companyId }),
      }
    );

    const data = await res.json();

    setProfile({
      ...emptyProfile,
      ...data,
      details: data.details || [],
    });

    window.dispatchEvent(new Event("profileUpdated"));
    return data;
  };

  const resetDetailForm = () => {
    setDetailForm(emptyDetail);
    setDetailError("");
    setEditingDetailIndex(null);
  };

  const openCreateForm = () => {
    setShowForm(true);
    setShowDetailForm(true);
    setIsEditing(true);
    setDetailError("");
  };

  const openEditForm = () => {
    setShowForm(true);
    setShowDetailForm(false);
    setIsEditing(true);
    resetDetailForm();
  };

  const saveDetail = async () => {
    const title = detailForm.title.trim();
    const value = detailForm.value.trim();

    if (!title || !value) {
      setDetailError("Detail title and value are required");
      return;
    }

    const nextDetails = [...(profile.details || [])];
    const nextItem = { title, value };

    if (editingDetailIndex !== null) {
      nextDetails[editingDetailIndex] = nextItem;
    } else {
      nextDetails.push(nextItem);
    }

    await persistProfile({
      ...profile,
      details: nextDetails,
    });

    setIsSaved(true);
    setShowDetailForm(false);
    setShowForm(false);
    resetDetailForm();
  };

  const editDetail = (index) => {
    const item = profile.details?.[index];
    if (!item) return;

    setDetailForm({
      title: item.title || "",
      value: item.value || "",
    });
    setEditingDetailIndex(index);
    setDetailError("");
    setShowForm(true);
    setShowDetailForm(true);
    setIsEditing(true);
  };

  const deleteDetail = async (index) => {
    await persistProfile({
      ...profile,
      details: (profile.details || []).filter((_, itemIndex) => itemIndex !== index),
    });

    if (editingDetailIndex === index) {
      resetDetailForm();
      setShowDetailForm(false);
    }
  };

  const saveProfile = async () => {
    if (!validate()) return;

    await persistProfile(profile);
    alert("Profile Saved!");
    setIsEditing(false);
    setIsSaved(true);
    setShowForm(false);
  };

  const updateProfile = async () => {
    if (!validate()) return;

    await persistProfile(profile);
    alert("Profile Updated!");
    setIsEditing(false);
    setShowForm(false);
  };

  const deleteProfile = async () => {
    await fetch(`http://localhost:5000/company-profile/${profile._id}`, {
      method: "DELETE",
    });

    setProfile(emptyProfile);
    setErrors({});
    setIsEditing(true);
    setIsSaved(false);
    setShowForm(false);
    setShowDetailForm(false);
    resetDetailForm();
    window.dispatchEvent(new Event("profileUpdated"));

    alert("Deleted!");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        session={{ name: profile.name || "Company" }}
        unreadCount={1}
        role="company"
      />

      <div className="flex-1 p-6">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6 items-start">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow border border-blue-200">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-wide text-blue-500">
                    Company Profile
                  </p>
                  <h2 className="mt-2 text-3xl font-bold text-gray-900">
                    {profile.name || "Company Name"}
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Keep your official company information up to date and manage extra custom details.
                  </p>
                </div>

                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 text-white flex items-center justify-center text-2xl font-bold shadow">
                  {(profile.name || "C")[0].toUpperCase()}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mt-6">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Email</p>
                  <p className="mt-2 text-sm font-medium text-slate-700 break-all">
                    {profile.email || "Not added yet"}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Phone</p>
                  <p className="mt-2 text-sm font-medium text-slate-700">
                    {profile.phone || "Not added yet"}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Location</p>
                  <p className="mt-2 text-sm font-medium text-slate-700">
                    {profile.location || "Not added yet"}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-blue-100">
                <button
                  type="button"
                  onClick={openCreateForm}
                  className="bg-indigo-500 text-white px-4 py-2 rounded-lg"
                >
                  Add Company Details
                </button>

                {isSaved && (
                  <button
                    type="button"
                    onClick={openEditForm}
                    className="bg-yellow-400 text-white px-4 py-2 rounded-lg"
                  >
                    Edit Company Details
                  </button>
                )}

                {isSaved && (
                  <button
                    type="button"
                    onClick={deleteProfile}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg"
                  >
                    Delete Company Details
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow border border-blue-200">
            <h2 className="text-lg font-bold text-gray-800 mb-3">
              About Company
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              This area gives a short overview of what your organization does and what kind of people you are looking for.
            </p>

            <div className="mt-4 rounded-2xl bg-blue-100 p-4 border border-blue-200">
              <p className="text-sm text-blue-600">Purpose</p>
              <p className="mt-2 font-medium text-gray-800 leading-relaxed">
                {profile.purpose || "No purpose added yet"}
              </p>
            </div>
          </div>
        </div>

        {showForm && (
          <div className="mt-6 bg-white rounded-2xl shadow border border-blue-200 p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {showDetailForm ? "Add Custom Company Detail" : "Edit Main Company Information"}
            </h3>

            {["name", "email", "phone", "location"].map((field, i) => (
              <div key={i} className="mb-4">
                <label className="text-blue-600 font-medium capitalize">
                  {field}
                </label>

                <input
                  className={`w-full mt-1 px-3 py-2 rounded-lg border ${
                    errors[field] ? "border-red-400" : "border-blue-300"
                  } bg-white focus:ring-2 focus:ring-blue-200 outline-none`}
                  disabled={!isEditing}
                  value={profile[field]}
                  onChange={(e) => {
                    const value = e.target.value;
                    setProfile({ ...profile, [field]: value });
                    validateField(field, value);
                  }}
                />

                {errors[field] && (
                  <p className="text-red-500 text-xs">{errors[field]}</p>
                )}
              </div>
            ))}

            <div className="mb-4">
              <label className="text-blue-600 font-medium">Purpose</label>

              <textarea
                className={`w-full mt-1 px-3 py-2 rounded-lg border ${
                  errors.purpose ? "border-red-400" : "border-blue-300"
                } bg-white focus:ring-2 focus:ring-blue-200 outline-none`}
                disabled={!isEditing}
                value={profile.purpose}
                onChange={(e) => {
                  const value = e.target.value;
                  setProfile({ ...profile, purpose: value });
                  validateField("purpose", value);
                }}
              />

              {errors.purpose && (
                <p className="text-red-500 text-xs">{errors.purpose}</p>
              )}
            </div>

            {showDetailForm && (
              <div className="space-y-4 pt-4 border-t border-blue-100">
                <div>
                  <label className="text-blue-600 font-medium">Detail Title</label>
                  <input
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-blue-300 bg-white focus:ring-2 focus:ring-blue-200 outline-none"
                    value={detailForm.title}
                    onChange={(e) =>
                      setDetailForm({ ...detailForm, title: e.target.value })
                    }
                    placeholder="Industry"
                  />
                </div>

                <div>
                  <label className="text-blue-600 font-medium">Detail Value</label>
                  <input
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-blue-300 bg-white focus:ring-2 focus:ring-blue-200 outline-none"
                    value={detailForm.value}
                    onChange={(e) =>
                      setDetailForm({ ...detailForm, value: e.target.value })
                    }
                    placeholder="Information Technology"
                  />
                </div>

                {detailError && (
                  <p className="text-red-500 text-xs">{detailError}</p>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-3 pt-5">
              {showDetailForm ? (
                <button
                  type="button"
                  onClick={saveDetail}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg"
                >
                  {editingDetailIndex !== null ? "Update Detail" : "Add Detail"}
                </button>
              ) : !isSaved ? (
                <button
                  type="button"
                  onClick={saveProfile}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Save Company Details
                </button>
              ) : (
                <button
                  type="button"
                  onClick={updateProfile}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg"
                >
                  Update Company Details
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setShowDetailForm(false);
                  resetDetailForm();
                }}
                className="bg-slate-400 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 bg-white rounded-2xl shadow border border-blue-200 overflow-hidden">
          <div className="bg-blue-50 px-6 py-4 border-b border-blue-200">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Custom Company Details
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Extra details such as industry, website, services, or any custom business information.
                </p>
              </div>

              <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-blue-700 border border-blue-200">
                {detailRows.length} items
              </span>
            </div>
          </div>

          <table className="w-full text-sm">
            <thead className="bg-white text-blue-700">
              <tr>
                <th className="px-6 py-4 text-left">Title</th>
                <th className="px-6 py-4 text-left">Value</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {detailRows.length > 0 ? (
                detailRows.map((detail, rowIndex) => (
                  <tr
                    key={`${detail.title}-${rowIndex}`}
                    className={`border-t border-blue-100 ${rowIndex % 2 === 0 ? "bg-white" : "bg-slate-50/60"}`}
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {detail.title}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {detail.value}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => editDetail(detail.index)}
                          className="bg-yellow-400 text-white px-3 py-1.5 rounded-lg"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteDetail(detail.index)}
                          className="bg-red-500 text-white px-3 py-1.5 rounded-lg"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="border-t border-blue-100">
                  <td colSpan="3" className="px-6 py-8 text-center text-gray-400">
                    No custom company details added yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;

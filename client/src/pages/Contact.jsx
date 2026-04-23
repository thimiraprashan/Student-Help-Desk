import { useState } from "react";
import axios from "axios";
import { AlertCircle, CheckCircle2, Send } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const initialForm = {
  studentId: "",
  studentName: "",
  studentYear: "",
  faculty: "",
  reasonType: "",
  subject: "",
  message: "",
};

const studentYears = ["Year 1", "Year 2", "Year 3", "Year 4"];
const faculties = ["Computing", "Business", "Engineering", "Humanities & Sciences", "Graduate Studies"];
const reasonTypes = ["Academic Support", "Technical Issue", "Past Papers", "Study Guide", "General Inquiry", "Other"];

export default function Contact() {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const nextErrors = {};

    if (!/^IT\s?\d{8}$/i.test(formData.studentId.trim())) {
      nextErrors.studentId = "Use format like IT 23553828.";
    }
    if (formData.studentName.trim().length < 2) {
      nextErrors.studentName = "Student name is required.";
    }
    if (!formData.studentYear) {
      nextErrors.studentYear = "Select your student year.";
    }
    if (!formData.faculty) {
      nextErrors.faculty = "Select your faculty.";
    }
    if (!formData.reasonType) {
      nextErrors.reasonType = "Select a reason type.";
    }
    if (!formData.subject.trim()) {
      nextErrors.subject = "Subject is required.";
    }
    if (!formData.message.trim()) {
      nextErrors.message = "Message is required.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const updateField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await axios.post(`${API_BASE_URL}/api/contact-messages`, formData);
      setFormData(initialForm);
      setStatus({
        type: "success",
        message: "Your message has been sent to the SLIIT Help Desk.",
      });
    } catch (err) {
      setStatus({
        type: "error",
        message: err.response?.data?.error || "Could not send your message. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-[70vh] p-4 sm:p-6">
      <div className="mx-auto max-w-4xl">
        <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-600">Contact SLIIT</p>
            <h1 className="mt-2 text-3xl font-extrabold text-slate-900">Send a message to the Help Desk</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Submit your details and message. The admin team will review it from the dashboard.
            </p>
          </div>

          {status.message && (
            <div className={`mb-5 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold ${
              status.type === "success"
                ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border border-rose-200 bg-rose-50 text-rose-700"
            }`}>
              {status.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              {status.message}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Student ID Number" error={errors.studentId}>
              <input
                value={formData.studentId}
                onChange={(e) => updateField("studentId", e.target.value)}
                placeholder="IT 23553828"
                className="contact-input"
              />
            </Field>

            <Field label="Student Name" error={errors.studentName}>
              <input
                value={formData.studentName}
                onChange={(e) => updateField("studentName", e.target.value)}
                placeholder="Enter your full name"
                className="contact-input"
              />
            </Field>

            <Field label="Student Year" error={errors.studentYear}>
              <select value={formData.studentYear} onChange={(e) => updateField("studentYear", e.target.value)} className="contact-input">
                <option value="">Select year</option>
                {studentYears.map((year) => <option key={year} value={year}>{year}</option>)}
              </select>
            </Field>

            <Field label="Faculty" error={errors.faculty}>
              <select value={formData.faculty} onChange={(e) => updateField("faculty", e.target.value)} className="contact-input">
                <option value="">Select faculty</option>
                {faculties.map((faculty) => <option key={faculty} value={faculty}>{faculty}</option>)}
              </select>
            </Field>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field label="Reason Type" error={errors.reasonType}>
              <select value={formData.reasonType} onChange={(e) => updateField("reasonType", e.target.value)} className="contact-input">
                <option value="">Select reason</option>
                {reasonTypes.map((reason) => <option key={reason} value={reason}>{reason}</option>)}
              </select>
            </Field>

            <Field label="Subject" error={errors.subject}>
              <input
                value={formData.subject}
                onChange={(e) => updateField("subject", e.target.value)}
                placeholder="Short subject"
                className="contact-input"
              />
            </Field>
          </div>

          <div className="mt-4">
            <Field label="Reason / Message" error={errors.message}>
              <textarea
                rows={7}
                value={formData.message}
                onChange={(e) => updateField("message", e.target.value)}
                placeholder="Type your reason or question here..."
                className="contact-input resize-none"
              />
            </Field>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-4 text-sm font-extrabold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            <Send size={18} />
            {isSubmitting ? "Sending..." : "Submit Message"}
          </button>
        </form>
      </div>
    </section>
  );
}

const Field = ({ label, error, children }) => (
  <label className="block">
    <span className="mb-2 block text-xs font-extrabold uppercase tracking-widest text-slate-500">{label}</span>
    {children}
    {error && <span className="mt-1 block text-xs font-bold text-rose-600">{error}</span>}
  </label>
);

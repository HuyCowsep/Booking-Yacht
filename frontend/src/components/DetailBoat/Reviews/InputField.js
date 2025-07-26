// components/InputField.jsx
const InputField = ({ label, placeholder, type = "text" }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm text-gray-700 mb-1">{label} *</label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-md p-2 text-sm"
      />
    </div>
  );
};

export default InputField;

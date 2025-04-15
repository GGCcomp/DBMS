import { useState } from "react";

export default function EditEmployeeForm({ employee, onClose }) {
  const [form, setForm] = useState({ ...employee });
  const [removeFiles, setRemoveFiles] = useState([]);

  const toggleFileRemove = (fileId) => {
    setRemoveFiles((prev) =>
      prev.includes(fileId) ? prev.filter(id => id !== fileId) : [...prev, fileId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append("id", employee._id);

    formData.append("filesToRemove", JSON.stringify(removeFiles));

    const res = await fetch(`/api/hr/employee`, {
      method: "PUT",
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      onClose();
    } else {
      alert(data.error || "Update failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input defaultValue={form.name} name="name" required className="w-full p-2 border" placeholder="Name" />
      <input defaultValue={form.profile.contact} name="contact" className="w-full p-2 border" placeholder="Contact" />
      <input defaultValue={form.profile.emergency} name="emergency" className="w-full p-2 border" placeholder="Emergency" />
      <input defaultValue={form.profile.bank} name="bank" className="w-full p-2 border" placeholder="Bank" />

      <input defaultValue={form.employment.title} name="title" className="w-full p-2 border" placeholder="Title" />
      <input defaultValue={form.employment.department} name="department" className="w-full p-2 border" placeholder="Department" />
      <input defaultValue={form.employment.workModel} name="workModel" className="w-full p-2 border" placeholder="Work Model" />

      <input type="file" name="resume" multiple className="w-full" />

      {employee.documents?.length > 0 && (
        <div className="mt-4">
          <h3 className="font-bold mb-2">Existing Documents</h3>
          {employee.documents.map((doc, i) => (
            <div key={doc.fileId} className="flex items-center justify-between mb-2">
              <a href={doc.downloadUrl} target="_blank" className="text-blue-500 hover:underline">
                {doc.name || `Document ${i + 1}`}
              </a>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  onChange={() => toggleFileRemove(doc.fileId)}
                  checked={removeFiles.includes(doc.fileId)}
                />
                Remove
              </label>
            </div>
          ))}
        </div>
      )}

      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        Save Changes
      </button>
    </form>
  );
}

import { useState } from "react";

export default function EditEmployeeForm({ employee, onClose, reload }) {
  const [loading, setLoading] = useState(false);
  const [removeFiles, setRemoveFiles] = useState([]);
  const [promotionFields, setPromotionFields] = useState([""]);
  const [benefitFields, setBenefitFields] = useState([""]);

  const toggleFileRemove = (fileId) => {
    setRemoveFiles((prev) =>
      prev.includes(fileId) ? prev.filter(id => id !== fileId) : [...prev, fileId]
    );
  };

  const handleSubmit = async (e) => {
    try {
      setLoading(true);
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      formData.append("id", employee._id);

      formData.append("filesToRemove", JSON.stringify(removeFiles));

      promotionFields.forEach((p, i) => formData.append(`promotions[${i}]`, p));
      benefitFields.forEach((b, i) => formData.append(`benefits[${i}]`, b));

      const res = await fetch(`/api/hr/employee`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        reload();
        onClose();
      } else {
        alert(data.error || "Update failed.");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="name" placeholder="Full Name" className="p-2 border rounded-xl" defaultValue={employee.name} />
      <input name="contact" placeholder="Contact Number" className="p-2 border rounded-xl" defaultValue={employee.profile.contact} />
      <input name="emergency" placeholder="Emergency Contact" className="p-2 border rounded-xl" defaultValue={employee.profile.emergency} />

      {/* Bank Details */}
      <input name="bank[name]" placeholder="Bank Name" className="p-2 border rounded-xl" defaultValue={employee.profile.bank?.name} />
      <input name="bank[accountNo]" placeholder="Account Number" className="p-2 border rounded-xl" defaultValue={employee.profile.bank?.accountNo} />
      <input name="bank[IFSC]" placeholder="IFSC Code" className="p-2 border rounded-xl" defaultValue={employee.profile.bank?.IFSC} />
      <input name="bank[branch]" placeholder="Branch Name" className="p-2 border rounded-xl" defaultValue={employee.profile.bank?.branch} />

      {/* Employment Details */}
      <input name="title" placeholder="Job Title" className="p-2 border rounded-xl" defaultValue={employee.employment.title} />
      <input name="department" placeholder="Department" className="p-2 border rounded-xl" defaultValue={employee.employment.department} />
      <input name="workModel" placeholder="Work Model (e.g. Remote)" className="p-2 border rounded-xl" defaultValue={employee.employment.workModel} />

      {/* Promotions */}
      {promotionFields.map((value, index) => (
        <input
          key={index}
          name={`promotion-${index}`}
          defaultValue={value}
          placeholder={`Promotion ${index + 1}`}
          className="p-2 border rounded-xl col-span-1 md:col-span-2"
          onChange={(e) => {
            const updated = [...promotionFields];
            updated[index] = e.target.value;
            setPromotionFields(updated);
          }}
        />
      ))}
      <button
        type="button"
        onClick={() => setPromotionFields([...promotionFields, ""])}
        className="text-sm text-blue-600 hover:underline col-span-1 md:col-span-2"
      >
        + Add Promotion
      </button>

      {/* Benefits */}
      {benefitFields.map((value, index) => (
        <input
          key={index}
          name={`benefit-${index}`}
          defaultValue={value}
          placeholder={`Benefit ${index + 1}`}
          className="p-2 border rounded-xl col-span-1 md:col-span-2"
          onChange={(e) => {
            const updated = [...benefitFields];
            updated[index] = e.target.value;
            setBenefitFields(updated);
          }}
        />
      ))}
      <button
        type="button"
        onClick={() => setBenefitFields([...benefitFields, ""])}
        className="text-sm text-blue-600 hover:underline col-span-1 md:col-span-2"
      >
        + Add Benefit
      </button>

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

      <button disabled={loading} type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        {!loading ? "Save Changes" : "Saving.."}
      </button>
    </form>
  );
}

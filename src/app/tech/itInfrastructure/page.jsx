"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Page() {
  const [assets, setAssets] = useState([]);

  const [cloudResources, setCloudResources] = useState([]);

  const [newAsset, setNewAsset] = useState({ type: "", name: "", assignedTo: "", status: "" });
  const [newCloudResource, setNewCloudResource] = useState({ type: "", usage: "", cost: "" });

  const [editingAsset, setEditingAsset] = useState(null);
  const [editingCloudResource, setEditingCloudResource] = useState(null);

  const [newAssetModal, setNewAssetModal] = useState(false);
  const [newCloudResourceModal, setNewCloudResourceModal] = useState(false);

  const getAssets = async() => {
    const res = await fetch("/api/tech/it-infra/asset");
    const result = await res.json(); 
    setAssets(result);
  }

  const getCloudRes = async() => {
    const res = await fetch("/api/tech/it-infra/cloud-res");
    const result = await res.json(); 
    setCloudResources(result);
  }

  useEffect(() => {
    getAssets();
    getCloudRes();
  },[])

  const handleAddAsset = async () => {
    const response = await fetch("/api/tech/it-infra/asset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAsset),
    });
  
    if (response.ok) {
      setNewAsset({ type: "", name: "", assignedTo: "", status: "" });
      getAssets();
    }
  };
  

  const handleAddCloudResource = async() => {
    const response = await fetch("/api/tech/it-infra/cloud-res", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCloudResource),
    });
  
    if (response.ok) {
      setNewCloudResource({ type: "", usage: "", cost: "" });
      getCloudRes();
    }
  };

  const handleEditAsset = async (id, updatedAsset) => {
    const response = await fetch("/api/tech/it-infra/asset", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...updatedAsset }),
    });
  
    if (response.ok) {
      getAssets();
    }
  };
  

  const handleEditCloudResource = async(id, updatedResource) => {
    const response = await fetch("/api/tech/it-infra/cloud-res", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...updatedResource }),
    });
  
    if (response.ok) {
      getCloudRes();
    }
  };

  const handleRemoveAsset = async (id) => {
   const res = await fetch("/api/tech/it-infra/asset", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  
    if(res.ok){
      getAssets();
    }
  };
  

  const handleRemoveCloudResource = async(id) => {
    const res = await fetch("/api/tech/it-infra/cloud-res", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  
    if(res.ok){
      getCloudRes();
    }
  };

  const handleCloseModal = () => {
    setEditingAsset(null);
    setEditingCloudResource(null);
    setNewAssetModal(false);
    setNewCloudResourceModal(false);
  };

  const handleModalSubmit = () => {
    if (editingAsset) {
      handleEditAsset(editingAsset._id, editingAsset);
    } else {
      handleAddAsset();
    }
    handleCloseModal();
  };

  const handleCloudModalSubmit = () => {
    if (editingCloudResource) {
      handleEditCloudResource(editingCloudResource._id, editingCloudResource);
    } else {
      handleAddCloudResource();
    }
    handleCloseModal();
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-10 rounded-2xl shadow-2xl max-w-3xl w-full text-center"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-4">IT Infrastructure & Asset Management</h1>
        <p className="text-gray-600 text-lg mb-6">
          A unified platform for tracking assets, managing cloud resources, and monitoring software inventory efficiently.
        </p>

        {/* Asset Inventory Management */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">Asset Inventory Management</h2>
          {assets && assets.length > 0  ? <ul className="text-gray-600 text-left mb-6 space-y-4">
            {assets && assets.map((asset, i) => (
              <li key={i} className="flex justify-between items-center">
                <div>
                  ✅ <strong>{asset.type}:</strong> {asset.name} {asset.assignedTo && `(Assigned: ${asset.assignedTo})`}{" "}
                  {asset.status && `(Status: ${asset.status})`}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingAsset(asset);
                      setNewAssetModal(true);
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleRemoveAsset(asset._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul> : <p className="text-center">No Assets to show</p>}
          <motion.button
            onClick={() => {
              setNewAssetModal(true);
              setEditingAsset(null);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-pink-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-pink-600 transition"
          >
            Add Asset
          </motion.button>
        </div>

        {/* Cloud Resource Utilization */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">Cloud Resource Utilization</h2>
          {cloudResources && cloudResources.length > 0 ? <ul className="text-gray-600 text-left mb-6 space-y-4">
            {cloudResources.map((resource) => (
              <li key={resource.id} className="flex justify-between items-center">
                <div>
                  🌐 <strong>{resource.type} Usage:</strong> {resource.usage} (Cost: {resource.cost})
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingCloudResource(resource);
                      setNewCloudResourceModal(true);
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleRemoveCloudResource(resource._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul> : <p className="text-center pb-3">No Cloud Resource to show.</p>}
          <motion.button
            onClick={() => {
              setNewCloudResourceModal(true);
              setEditingCloudResource(null);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-pink-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-pink-600 transition"
          >
            Add Cloud Resource
          </motion.button>
        </div>
      </motion.div>

      {/* Modal for Adding/Editing Asset */}
      {(newAssetModal || editingAsset) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <h2 className="text-2xl font-semibold mb-4">{editingAsset ? `Edit ${editingAsset.type}` : "Add New Asset"}</h2>
            <input
              className="p-2 rounded-md mb-2 w-full"
              type="text"
              value={editingAsset ? editingAsset.type : newAsset.type}
              onChange={(e) =>
                editingAsset
                  ? setEditingAsset({ ...editingAsset, type: e.target.value })
                  : setNewAsset({ ...newAsset, type: e.target.value })
              }
              placeholder="Asset Type"
            />
            <input
              className="p-2 rounded-md mb-2 w-full"
              type="text"
              value={editingAsset ? editingAsset.name : newAsset.name}
              onChange={(e) =>
                editingAsset
                  ? setEditingAsset({ ...editingAsset, name: e.target.value })
                  : setNewAsset({ ...newAsset, name: e.target.value })
              }
              placeholder="Asset Name"
            />
            <input
              className="p-2 rounded-md mb-2 w-full"
              type="text"
              value={editingAsset ? editingAsset.assignedTo : newAsset.assignedTo}
              onChange={(e) =>
                editingAsset
                  ? setEditingAsset({ ...editingAsset, assignedTo: e.target.value })
                  : setNewAsset({ ...newAsset, assignedTo: e.target.value })
              }
              placeholder="Assigned To"
            />
            <input
              className="p-2 rounded-md mb-2 w-full"
              type="text"
              value={editingAsset ? editingAsset.status : newAsset.status}
              onChange={(e) =>
                editingAsset
                  ? setEditingAsset({ ...editingAsset, status: e.target.value })
                  : setNewAsset({ ...newAsset, status: e.target.value })
              }
              placeholder="Status"
            />
            <div className="flex justify-end space-x-2">
              <button onClick={handleCloseModal} className="bg-gray-500 text-white px-4 py-2 rounded-md">Cancel</button>
              <button
                onClick={handleModalSubmit}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg"
              >
                {editingAsset ? "Save Changes" : "Add Asset"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Adding/Editing Cloud Resource */}
      {(newCloudResourceModal || editingCloudResource) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <h2 className="text-2xl font-semibold mb-4">{editingCloudResource ? `Edit ${editingCloudResource.type}` : "Add New Cloud Resource"}</h2>
            <input
              className="p-2 rounded-md mb-2 w-full"
              type="text"
              value={editingCloudResource ? editingCloudResource.type : newCloudResource.type}
              onChange={(e) =>
                editingCloudResource
                  ? setEditingCloudResource({ ...editingCloudResource, type: e.target.value })
                  : setNewCloudResource({ ...newCloudResource, type: e.target.value })
              }
              placeholder="Cloud Resource Type"
            />
            <input
              className="p-2 rounded-md mb-2 w-full"
              type="text"
              value={editingCloudResource ? editingCloudResource.usage : newCloudResource.usage}
              onChange={(e) =>
                editingCloudResource
                  ? setEditingCloudResource({ ...editingCloudResource, usage: e.target.value })
                  : setNewCloudResource({ ...newCloudResource, usage: e.target.value })
              }
              placeholder="Usage"
            />
            <input
              className="p-2 rounded-md mb-2 w-full"
              type="text"
              value={editingCloudResource ? editingCloudResource.cost : newCloudResource.cost}
              onChange={(e) =>
                editingCloudResource
                  ? setEditingCloudResource({ ...editingCloudResource, cost: e.target.value })
                  : setNewCloudResource({ ...newCloudResource, cost: e.target.value })
              }
              placeholder="Cost"
            />
            <div className="flex justify-end space-x-2">
              <button onClick={handleCloseModal} className="bg-gray-500 text-white px-4 py-2 rounded-md">Cancel</button>
              <button
                onClick={handleCloudModalSubmit}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg"
              >
                {editingCloudResource ? "Save Changes" : "Add Cloud Resource"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

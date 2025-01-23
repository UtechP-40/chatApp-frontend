// CreateGroupModal.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createGroup } from "../redux/features/groupSlice";
import { getFriends } from "../redux/features/friendsSlice";
import toast from "react-hot-toast";

 const CreateGroupModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.friends);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    members: []
  });
useEffect(()=>{
  dispatch(getFriends())
},[dispatch])
  const handleCreateGroup = async () => {
    if (!formData.name.trim()) {
      toast.error("Group name is required");
      return;
    }
    if (formData.members.length === 0) {
      toast.error("Please select at least one member");
      return;
    }

    try {
      await dispatch(createGroup(formData));
      toast.success("Group created successfully");
      onClose();
      setFormData({ name: "", description: "", members: [] });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const toggleMember = (userId) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.includes(userId)
        ? prev.members.filter(id => id !== userId)
        : [...prev.members, userId]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Create New Group</h2>
        
        <input
          type="text"
          placeholder="Group Name"
          className="input input-bordered w-full mb-4"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        
        <textarea
          placeholder="Group Description (Optional)"
          className="textarea textarea-bordered w-full mb-4"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Select Members</label>
          <div className="max-h-48 overflow-y-auto border rounded-lg p-2">
            {users.map((user) => (
              <div
                key={user.friend._id}
                className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
                onClick={() => toggleMember(user.friend._id)}
              >
                <input
                  type="checkbox"
                  checked={formData.members.includes(user.friend._id)}
                  className="checkbox checkbox-sm mr-2"
                  readOnly
                />
                <span>{user.friend.fullName}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="btn btn-ghost">
            Cancel
          </button>
          <button onClick={handleCreateGroup} className="btn btn-primary">
            Create Group
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal
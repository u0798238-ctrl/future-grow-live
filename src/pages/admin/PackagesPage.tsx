import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Package as PackageIcon, CheckCircle2 } from 'lucide-react';
import { getMlmPackages, saveMlmPackage, deleteMlmPackage, MlmPackage } from '@/lib/mlmStore';

export function PackagesPage() {
  const [packages, setPackages] = useState<MlmPackage[]>(getMlmPackages());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<MlmPackage | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{isOpen: boolean; title: string; text: string; onConfirm: () => void} | null>(null);

  const loadPackages = () => {
    setPackages(getMlmPackages());
  };

  useEffect(() => {
    loadPackages();
    window.addEventListener('mlm_packages_update', loadPackages);
    window.addEventListener('mlm_update', loadPackages);
    return () => {
      window.removeEventListener('mlm_packages_update', loadPackages);
      window.removeEventListener('mlm_update', loadPackages);
    };
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    directIncome: '',
    binaryIncome: '',
    capping: '',
    status: 'Active' as 'Active' | 'Inactive'
  });

  const handleOpenModal = (pkg: MlmPackage | null = null) => {
    if (pkg) {
      setEditingPackage(pkg);
      setFormData({
        name: pkg.name,
        price: pkg.price.toString(),
        directIncome: pkg.directIncome.toString(),
        binaryIncome: pkg.binaryIncome.toString(),
        capping: pkg.capping.toString(),
        status: pkg.status
      });
    } else {
      setEditingPackage(null);
      setFormData({
        name: '',
        price: '',
        directIncome: '1500',
        binaryIncome: '1000',
        capping: '10000',
        status: 'Active'
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.price) {
      setErrorMessage("Please enter package name and price!");
      setTimeout(() => setErrorMessage(null), 4000);
      return;
    }

    const priceNum = Number(formData.price) || 0;
    const directNum = formData.directIncome !== '' ? (Number(formData.directIncome) >= 0 ? Number(formData.directIncome) : 0) : 0;
    const binaryNum = formData.binaryIncome !== '' ? (Number(formData.binaryIncome) >= 0 ? Number(formData.binaryIncome) : 1000) : 1000;
    const cappingNum = formData.capping !== '' ? (Number(formData.capping) >= 0 ? Number(formData.capping) : 10000) : 10000;

    const pkgToSave: MlmPackage = {
      id: editingPackage ? editingPackage.id : (Math.max(...packages.map(p => p.id), 0) + 1),
      name: formData.name,
      price: priceNum,
      directIncome: directNum,
      binaryIncome: binaryNum,
      capping: cappingNum,
      status: formData.status,
      productChoices: editingPackage?.productChoices || [
        'Suit Length & Pant (Navy Blue Colour)',
        'Suit Length & Pant (Green Colour)',
        'Double Banarasi Saree (Special Edition)',
        'Suit Length & Banarasi Saree Combo'
      ]
    };

    saveMlmPackage(pkgToSave);
    setIsModalOpen(false);
    
    setSuccessMessage(`Package "${pkgToSave.name}" updated successfully! Changes are applied live across user panels.`);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleDelete = (id: number) => {
    const pkg = packages.find(p => p.id === id);
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Package',
      text: `Are you sure you want to delete package "${pkg?.name || id}"?`,
      onConfirm: () => {
        deleteMlmPackage(id);
        setSuccessMessage("Package deleted successfully!");
        setTimeout(() => setSuccessMessage(null), 4000);
        setConfirmDialog(null);
      }
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {successMessage && (
        <div className="bg-emerald-950/80 border border-[#35B779] text-[#35B779] px-4 py-3 rounded-xl flex items-center gap-3 shadow-lg">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{successMessage}</p>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-white">Package Management</h2>
          <p className="text-gray-300 text-sm mt-1">Live synchronized package settings across user panel, registration, and business plans</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-[#6F9DB5] hover:bg-[#6F9DB5] text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create New Package
        </button>
      </div>

      <div className="bg-[#132C3C] rounded-2xl border-2 border-[#6F9DB5]/40 shadow-[0_0_15px_rgba(111,157,181,0.15)] hover:border-[#6F9DB5] hover:shadow-[0_0_20px_rgba(111,157,181,0.3)] transition-all duration-300 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white">
            <thead className="bg-[#071E2C] text-xs uppercase font-medium text-[#8FA3AF]">
              <tr>
                <th className="px-6 py-4">Package Name</th>
                <th className="px-6 py-4">Price (₹)</th>
                <th className="px-6 py-4">Direct Income</th>
                <th className="px-6 py-4">Binary Matching</th>
                <th className="px-6 py-4">Capping / Day</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="">
              {packages.map((pkg) => (
                <tr key={pkg.id} className="border-b border-[#28485A]/50 hover:bg-[#1B3343]/40 transition-all duration-200 border-l-4 border-l-transparent hover:border-l-[#6F9DB5]">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#1B3343]/30 rounded-lg text-blue-400">
                        <PackageIcon className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-white">{pkg.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-[#35B779]">₹{pkg.price}</td>
                  <td className="px-6 py-4">₹{pkg.directIncome}</td>
                  <td className="px-6 py-4">₹{pkg.binaryIncome}</td>
                  <td className="px-6 py-4">₹{pkg.capping}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      pkg.status === 'Active' ? 'bg-emerald-900/30 text-[#35B779] border border-emerald-800/50' : 
                      'bg-red-900/30 text-red-400 border border-red-800/50'
                    }`}>
                      {pkg.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleOpenModal(pkg)}
                        className="p-1.5 bg-[#071E2C] rounded-md text-blue-400 hover:text-blue-300 transition-colors" 
                        title="Edit Package"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(pkg.id)}
                        className="p-1.5 bg-[#071E2C] rounded-md text-red-500 hover:text-red-400 transition-colors" 
                        title="Delete Package"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {packages.length === 0 && (
            <div className="p-8 text-center text-gray-300">
              No packages found. Click "Create New Package" to add one.
            </div>
          )}
        </div>
      </div>

      {/* Modal for Add/Edit Package */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#132C3C] rounded-2xl border-2 border-[#6F9DB5]/40 shadow-[0_0_15px_rgba(111,157,181,0.15)] hover:border-[#6F9DB5] hover:shadow-[0_0_20px_rgba(111,157,181,0.3)] transition-all duration-300 w-full max-w-lg p-6 relative">
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-4 right-4 text-gray-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-xl font-semibold text-white mb-6">
              {editingPackage ? 'Edit Package' : 'Create New Package'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-300">Package Name</label>
                <input 
                  type="text" 
                  placeholder="e.g., Diamond Package"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full mt-1.5 bg-[#071E2C] border border-[#28485A]/50 p-2.5 rounded-lg text-white text-sm focus:outline-none focus:border-[#28485A]" 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-300">Price (₹)</label>
                  <input 
                    type="number" 
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full mt-1.5 bg-[#071E2C] border border-[#28485A]/50 p-2.5 rounded-lg text-white text-sm focus:outline-none focus:border-[#28485A]" 
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-300">Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full mt-1.5 bg-[#071E2C] border border-[#28485A]/50 p-2.5 rounded-lg text-white text-sm focus:outline-none focus:border-[#28485A]"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-300">Direct Referral Income (₹)</label>
                  <input 
                    type="number" 
                    placeholder="0.00"
                    value={formData.directIncome}
                    onChange={(e) => setFormData({...formData, directIncome: e.target.value})}
                    className="w-full mt-1.5 bg-[#071E2C] border border-[#28485A]/50 p-2.5 rounded-lg text-white text-sm focus:outline-none focus:border-[#28485A]" 
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-300">Binary Matching Income (₹)</label>
                  <input 
                    type="number" 
                    placeholder="0.00"
                    value={formData.binaryIncome}
                    onChange={(e) => setFormData({...formData, binaryIncome: e.target.value})}
                    className="w-full mt-1.5 bg-[#071E2C] border border-[#28485A]/50 p-2.5 rounded-lg text-white text-sm focus:outline-none focus:border-[#28485A]" 
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-300">Daily Capping (Pairs)</label>
                <input 
                  type="number" 
                  placeholder="e.g., 10"
                  value={formData.capping}
                  onChange={(e) => setFormData({...formData, capping: e.target.value})}
                  className="w-full mt-1.5 bg-[#071E2C] border border-[#28485A]/50 p-2.5 rounded-lg text-white text-sm focus:outline-none focus:border-[#28485A]" 
                />
              </div>
              
              <div className="pt-4 flex justify-end gap-3 border-t border-[#28485A]/30 mt-6">
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-4 py-2 rounded-lg bg-[#071E2C] text-white text-sm font-medium hover:text-white transition-colors border border-[#28485A]/30"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave} 
                  className="px-4 py-2 rounded-lg bg-[#6F9DB5] hover:bg-[#6F9DB5] text-white text-sm font-medium transition-colors"
                >
                  {editingPackage ? 'Update Package' : 'Create Package'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/DepositsPage.tsx', 'utf-8');

code = code.replace(
  "const [selectedDeposit, setSelectedDeposit] = useState<any | null>(null);",
  "const [selectedDeposit, setSelectedDeposit] = useState<any | null>(null);\n  const [isSubmitting, setIsSubmitting] = useState(false);"
);

code = code.replace(
  "const handleStatusChange = (userId: string, txId: string, newStatus: string) => {\n    if (newStatus === 'Approved') {\n      activateUserAccount(userId);\n    } else if (newStatus === 'Rejected') {\n      rejectUserAccount(userId);\n    }\n    const allUsers = getMlmUsers();\n    setUsers(allUsers);\n    setSelectedDeposit(null);\n  };",
  "const handleStatusChange = async (userId: string, txId: string, newStatus: string) => {\n    if (isSubmitting) return;\n    setIsSubmitting(true);\n    try {\n      if (newStatus === 'Approved') {\n        activateUserAccount(userId);\n      } else if (newStatus === 'Rejected') {\n        rejectUserAccount(userId);\n      }\n      const { forceSyncUsers } = await import('@/lib/mlmStore');\n      await forceSyncUsers();\n      const allUsers = getMlmUsers();\n      setUsers(allUsers);\n      setSelectedDeposit(null);\n    } finally {\n      setIsSubmitting(false);\n    }\n  };"
);

code = code.replace(
  "<button \n                    onClick={() => handleStatusChange(selectedDeposit.userId, selectedDeposit.id, 'Rejected')}",
  "<button \n                    disabled={isSubmitting}\n                    onClick={() => handleStatusChange(selectedDeposit.userId, selectedDeposit.id, 'Rejected')}"
);

code = code.replace(
  "<button \n                    onClick={() => handleStatusChange(selectedDeposit.userId, selectedDeposit.id, 'Approved')}",
  "<button \n                    disabled={isSubmitting}\n                    onClick={() => handleStatusChange(selectedDeposit.userId, selectedDeposit.id, 'Approved')}"
);

code = code.replace(
  "Reject Deposit",
  "{isSubmitting ? '...' : 'Reject Deposit'}"
);

code = code.replace(
  "Approve & Add Funds",
  "{isSubmitting ? 'Processing...' : 'Approve & Add Funds'}"
);

fs.writeFileSync('src/pages/admin/DepositsPage.tsx', code);

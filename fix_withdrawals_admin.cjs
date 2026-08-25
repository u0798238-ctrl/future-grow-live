const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/WithdrawalsPage.tsx', 'utf-8');

code = code.replace(
  "const [copiedKey, setCopiedKey] = useState<string | null>(null);",
  "const [copiedKey, setCopiedKey] = useState<string | null>(null);\n  const [isSubmitting, setIsSubmitting] = useState(false);"
);

code = code.replace(
  "const handleStatusChange = async (userId: string, txId: string, newStatus: string) => {",
  "const handleStatusChange = async (userId: string, txId: string, newStatus: string) => {\n    if (isSubmitting) return;\n    setIsSubmitting(true);\n    try {"
);

code = code.replace(
  "         setUsers(allUsers);\n         setSelectedWithdrawal(null);\n       }\n    }\n  };",
  "         setUsers(allUsers);\n         setSelectedWithdrawal(null);\n       }\n    } finally {\n       setIsSubmitting(false);\n    }\n  };"
);

code = code.replace(
  "<button\n                    onClick={() => handleStatusChange(selectedWithdrawal.userId, selectedWithdrawal.id, 'Rejected')}",
  "<button\n                    disabled={isSubmitting}\n                    onClick={() => handleStatusChange(selectedWithdrawal.userId, selectedWithdrawal.id, 'Rejected')}"
);

code = code.replace(
  "<button\n                    onClick={() => handleStatusChange(selectedWithdrawal.userId, selectedWithdrawal.id, 'Approved')}",
  "<button\n                    disabled={isSubmitting}\n                    onClick={() => handleStatusChange(selectedWithdrawal.userId, selectedWithdrawal.id, 'Approved')}"
);

code = code.replace(
  "Reject Withdrawal",
  "{isSubmitting ? '...' : 'Reject Withdrawal'}"
);

code = code.replace(
  "Approve & Mark Paid",
  "{isSubmitting ? 'Processing...' : 'Approve & Mark Paid'}"
);

fs.writeFileSync('src/pages/admin/WithdrawalsPage.tsx', code);

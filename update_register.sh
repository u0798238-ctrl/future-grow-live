#!/bin/bash

# Insert states
sed -i '/const \[password, setPassword\] = useState/a \ \ const [showTermsModal, setShowTermsModal] = useState(false);\n  const [agreedToTerms, setAgreedToTerms] = useState(false);' src/pages/public/RegisterPage.tsx

# Replace existing terms checkbox section with the new controlled one
sed -i '/<input type="checkbox" id="terms"/,+4d' src/pages/public/RegisterPage.tsx

# In handleRegister, add validation for agreedToTerms
sed -i '/if (!showPayment) {/i \ \ \ \ if (!agreedToTerms) {\n      setErrorMsg("You must agree to the Terms & Conditions to register.");\n      return;\n    }\n' src/pages/public/RegisterPage.tsx


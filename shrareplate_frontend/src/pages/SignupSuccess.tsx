import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const SignupSuccess = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <CheckCircle className="w-20 h-20 text-green-600 mb-4" />

      <h1 className="text-3xl font-bold mb-2">Signup Successful!</h1>

      <p className="text-muted-foreground mb-6 max-w-md">
        Your account has been created successfully.  
        You can now log in and start using SharePlate.
      </p>

      <Link
        to="/auth"
        className="px-6 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
      >
        Continue to Login
      </Link>
    </div>
  );
};

export default SignupSuccess;
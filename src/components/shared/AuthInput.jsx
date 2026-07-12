import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

const AuthInput = ({ icon: Icon, type = "text", label, ...props }) => {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (show ? "text" : "password") : type;

  return (
    <div>
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-2">
          {label}
        </label>
      )}
      <div className="flex items-center gap-3 bg-base-200 rounded-xl px-4 py-3.5 border border-transparent focus-within:border-orange-400 transition">
        {Icon && <Icon className="text-base-content/40 shrink-0 text-base" />}
        <input
          type={inputType}
          className="w-full bg-transparent outline-none text-base text-base-content placeholder-base-content/40"
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="text-base-content/40 hover:text-base-content/70 transition shrink-0"
          >
            {show ? <FiEyeOff size={16} /> : <FiEye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default AuthInput;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import mockAuthService from "@/services/mockAuthService";
import FormInput from "@/components/ui/FormInput";
import Toast from "../ui/Toast";

export default function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [toastInfo, setToastInfo] = useState({show:false, message: "", type:"info"});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setToastInfo({show: true, message:"iniciando ssesión...", type:"info"}); // muestra toast al iniciar login

    try {
      const user = await mockAuthService.login(email, password);
      console.log("Usuario autenticado", user);

      setToastInfo({show: true, message: "Ingreso exitoso!", type:"success"});

      setTimeout(() =>  navigate("/students/dashboard"), 1000);

      // Redirigir después de login

    } catch (err) {
      const msg = err.response?.data?.message || "Usuario o contraseña incorrecta";
      setError(msg);
      setToastInfo({ show: true, message: msg, type: "error" });
      setTimeout(() => setError(""), 3000);
    } finally {
     setLoading(false)
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">


        <FormInput
          label="Correo electrónico"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@correo.com"
        />
        <FormInput
          label="Contraseña"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
        />

        <button
          type="submit"
          className="bg-black text-white py-2 rounded"
          disabled={loading}
        >
          Iniciar Sesión
        </button>
      </form>

      {/* Toast */}
      <Toast
         show={toastInfo.show}
        message={toastInfo.message}
        type={toastInfo.type}
        onClose={() => setToastInfo({ ...toastInfo, show: false })}
      />
    </>
  );
}
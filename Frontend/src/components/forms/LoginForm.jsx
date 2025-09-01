// src/components/forms/LoginForm.jsx
import { useState } from "react";
import FormInput from "@/components/common/FormInput";
import mockAuthService from "@/services/mockAuthService";
import { useNavigate } from "react-router-dom";
import { ROLES } from "@/constants/roles";

// Este componente maneja el estado y la lógica del formulario de login
export default function LoginForm() {

  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate()




  const handleLogin = async (e)=>{
    e.preventDefault()
    setError(null)
  }



  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log("Datos del login:", form);
    try {
      // Usa directamente el objeto 'form'
      const userData = await mockAuthService.login(form.email, form.password);
      console.log("Usuario autenticado", userData);

      switch (userData.ROLES) {
        case ROLES.STUDENT:
          navigate("/Alumno/Dahboard.jsx")
        break;

        default:
          break;
      }

    } catch (error) {
      console.error("Error al iniciar sesión:", error.response.data.message);
      // Manejar la visualización del error
      
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormInput
        label="Correo Electrónico"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="tu@email.com"
      />
      <FormInput
        label="Contraseña"
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="********"
      />
      <button type="submit"

      className="w-full bg-red-600 text-white py-2 rounded-lg">
        Iniciar Sesión
      </button>

      <div >

      </div>

    </form>
  );
}
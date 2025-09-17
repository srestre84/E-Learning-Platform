import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import { Mail } from "lucide-react";
import profileService from "@/services/profileService";

const StudentProfileEditor = () => {
  const [userData, setUserData] = useState({
    userName: "",
    lastName: "",
    email: "",
    profileImageUrl: "",
    bio: "",
    specialty: "",
    website: "",
    twitter: "",
    linkedin: "",
    github: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar datos del perfil
  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const data = await profileService.getCurrentUser(true);
        setUserData({
          userName: data.userName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          profileImageUrl: data.profileImageUrl || null,
          bio: data.bio || "",
          specialty: data.specialty || "",
          website: data.website || "",
          twitter: data.twitter || "",
          linkedin: data.linkedin || "",
          github: data.github || "",
        });
      } catch (err) {
        console.error("Error loading profile:", err);
        setError(err.message || "Error al obtener el perfil del usuario");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div
          className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent text-red-500 motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status">
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"></span>
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-600 text-center mt-4">{error}</p>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Mi Perfil</h2>
        <p className="text-gray-600 text-sm">
          Información de tu perfil de Estudiante
        </p>
      </div>

      <Card className="overflow-hidden shadow-sm border border-gray-200">
        <CardHeader className="bg-gray-50 border-b p-4">
          <CardTitle className="text-base font-semibold text-gray-800">
            Información Personal
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Información personal y de contacto.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative group">
              <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-2 border-gray-100">
                <AvatarImage
                  src={
                    userData.profileImageUrl ||
                    `https://ui-avatars.com/api/?name=${userData.userName}+${userData.lastName}&background=E5E7EB&color=6B7280`
                  }
                  alt={`${userData.userName} ${userData.lastName}`}
                />
                <AvatarFallback className="bg-gray-100 text-gray-600">
                  {userData.userName?.[0]}
                  {userData.lastName?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-xl font-semibold text-gray-900">
                {userData.userName} {userData.lastName}
              </h3>
              <p className="text-gray-600 text-sm">
                {userData.specialty || "Sin especialidad"}
              </p>
              <div className="flex justify-center sm:justify-start gap-3 mt-3">
                <a
                  href={`mailto:${userData.email}`}
                  className="text-gray-500 hover:text-red-500"
                  title="Enviar correo">
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Nombre */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-md border border-gray-200">
                {userData.userName || "No especificado"}
              </p>
            </div>

            {/* Apellidos */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellidos
              </label>
              <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-md border border-gray-200">
                {userData.lastName || "No especificado"}
              </p>
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico
              </label>
              <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-md border border-gray-200">
                {userData.email || "No especificado"}
              </p>
            </div>

            {/* Especialidad */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Especialidad
              </label>
              <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-md border border-gray-200">
                {userData.specialty || "No especificado"}
              </p>
            </div>

            {/* Biografía */}
            <div className="sm:col-span-2 mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Biografía
              </label>
              <p className="text-gray-900 whitespace-pre-line py-2 px-3 bg-gray-50 rounded-md border border-gray-200 min-h-[100px]">
                {userData.bio || "No hay biografía disponible"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentProfileEditor;

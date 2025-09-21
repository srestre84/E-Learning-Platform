// src/hooks/useTeacherCourses.js

import { useState, useEffect } from 'react';
import { getCoursesByInstructorId, getCoursesByInstructorEmail, getStudentCountsForCourses } from '@/services/courseService';
import { toast } from 'react-toastify';

/**
 * Hook personalizado para obtener los cursos de un instructor.
 * @param {number} instructorId - El ID del instructor.
 * @returns {{ courses: Array, loading: boolean, error: string | null }}
 */
export const useTeacherCourses = (instructorId) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourses = async () => {
    console.log("=== DEBUG USE TEACHER COURSES ===");
    console.log("Instructor ID recibido:", instructorId);
    console.log("Tipo de instructor ID:", typeof instructorId);
    
    if (!instructorId) {
      console.log("❌ No hay instructor ID, no se cargarán cursos");
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      console.log("🔍 Obteniendo cursos para instructor:", instructorId);
      let fetchedCourses = await getCoursesByInstructorId(instructorId);
      
      // Si no se encontraron cursos por ID, intentar por email
      if (fetchedCourses.length === 0) {
        console.log("🔄 No se encontraron cursos por ID, intentando por email...");
        const userEmail = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).email : null;
        if (userEmail) {
          console.log("📧 Intentando obtener cursos por email:", userEmail);
          fetchedCourses = await getCoursesByInstructorEmail(userEmail);
        }
      }
      
      console.log("✅ Cursos obtenidos:", fetchedCourses);
      console.log("📊 Cantidad de cursos:", fetchedCourses.length);
      
      // Obtener el número de estudiantes inscritos para cada curso
      if (fetchedCourses.length > 0) {
        console.log("🔄 Obteniendo número de estudiantes inscritos...");
        const courseIds = fetchedCourses.map(course => course.id);
        const studentCounts = await getStudentCountsForCourses(courseIds);
        console.log("📊 Conteos de estudiantes:", studentCounts);
        
        // Agregar el número de estudiantes a cada curso
        const coursesWithStudentCounts = fetchedCourses.map(course => ({
          ...course,
          students: studentCounts[course.id] || 0
        }));
        
        console.log("✅ Cursos con conteos de estudiantes:", coursesWithStudentCounts);
        setCourses(coursesWithStudentCounts);
      } else {
        setCourses(fetchedCourses);
      }
    } catch (err) {
      console.error("❌ Error al cargar los cursos:", err);
      setError("Ocurrió un error al cargar tus cursos.");
      toast.error("Error al cargar tus cursos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instructorId]);

  const refreshCourses = () => {
    fetchCourses();
  };

  return { courses, loading, error, refreshCourses };
};
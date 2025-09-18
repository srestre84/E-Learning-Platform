// src/features/teacher/components/TeacherCourses.jsx

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { generateCoursePlaceholder } from "@/utils/imageUtils";
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Switch,
  Divider,
  Avatar,
  Badge,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  People as PeopleIcon,
  BarChart as StatsIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Star as StarIcon,
  AccessTime as AccessTimeIcon,
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";

import { useTeacherCourses } from "@/shared/hooks/useTeacherCourses";
import { useAuth } from "@/shared/hooks/useAuth";
import { deleteCourse } from '@/services/courseService';

// Componentes de estado de carga
const LoadingState = () => (
  <Box sx={{ p: 4, textAlign: "center" }}>
    <Typography variant="h6" color="text.secondary">
      Cargando tus cursos...
    </Typography>
  </Box>
);

// Componentes de estado de error
const ErrorState = ({ message }) => (
  <Box sx={{ p: 4, textAlign: "center" }}>
    <Typography variant="h6" color="error.main">
      Error: {message}
    </Typography>
  </Box>
);


const TeacherCourses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  // Obtener usuario autenticado
  const { user } = useAuth();

  // Usar solo una llamada al hook, incluyendo refreshCourses
  const { courses, loading, error, refreshCourses } = useTeacherCourses(user?.id);

  // Eliminar curso (versión develop)
  const handleDeleteCourse = async (courseId, courseTitle) => {
    const confirmDelete = window.confirm(
      `¿Estás seguro de que deseas eliminar el curso "${courseTitle}"?\n\n` +
      'Esta acción no se puede deshacer y el curso será eliminado permanentemente.\n' +
      'Solo se pueden eliminar cursos sin estudiantes inscritos.'
    );
    if (!confirmDelete) return;
    try {
      await deleteCourse(courseId);
      await refreshCourses();
      alert('Curso eliminado exitosamente');
    } catch (error) {
      alert(`Error al eliminar el curso: ${error.message}`);
    }
  };

  // Muestra el estado de carga o error si es necesario
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "todos" || course.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Activo":
        return "success";
      case "Borrador":
        return "warning";
      case "Archivado":
        return "default";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Mis Cursos
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          to="/teacher/courses/new"
          sx={{
            background: "red",
            borderRadius: 2,
            px: 3,
            py: 1.5,
            fontWeight: 600,
            textTransform: "none",
            fontSize: "1rem",
            boxShadow: "0 4px 15px rgba(239, 68, 68, 0.4)",
            "&:hover": {
              background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
              transform: "translateY(-2px)",
              boxShadow: "0 6px 20px rgba(239, 68, 68, 0.6)",
            },
            transition: "all 0.3s ease",
          }}>
          Nuevo Curso
        </Button>
      </Stack>

      {/* Search and filter section */}
      <Paper
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={6} md={8}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Buscar por título o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "white",
                  borderRadius: 2,
                  "&:hover": {
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "primary.main",
                    },
                  },
                  "&.Mui-focused": {
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "primary.main",
                      borderWidth: 2,
                    },
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "primary.main" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: "text.primary", fontWeight: 600 }}>
                Estado
              </InputLabel>
              <Select
                value={statusFilter}
                label="Estado"
                onChange={(e) => setStatusFilter(e.target.value)}
                sx={{
                  backgroundColor: "white",
                  borderRadius: 2,
                  "&:hover": {
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "primary.main",
                    },
                  },
                  "&.Mui-focused": {
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "primary.main",
                      borderWidth: 2,
                    },
                  },
                }}>
                <MenuItem value="todos">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: "grey.400",
                      }}
                    />
                    Todos
                  </Box>
                </MenuItem>
                <MenuItem value="Activo">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: "success.main",
                      }}
                    />
                    Activo
                  </Box>
                </MenuItem>
                <MenuItem value="Borrador">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: "warning.main",
                      }}
                    />
                    Borrador
                  </Box>
                </MenuItem>
                <MenuItem value="Archivado">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: "grey.500",
                      }}
                    />
                    Archivado
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {filteredCourses.length === 0 ? (
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
                      <Tooltip title="Eliminar curso">
                        <span>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteCourse(course.id, course.title)}
                            disabled={course.students > 0}
                            sx={{
                              color: 'error.main',
                              '&:hover': { bgcolor: 'error.50' },
                              '&:disabled': {
                                color: 'action.disabled',
                                '&:hover': { bgcolor: 'transparent' }
                              },
                              p: 0.5,
                            }}
                          >
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M6 7h12M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m-7 0v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </IconButton>
                        </span>
                      </Tooltip>
            No tienes cursos creados o no hay resultados para tu búsqueda.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredCourses.map((course) => (
            <Grid item key={course.id} xs={12} sm={6} lg={4}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  transition: "all 0.3s ease-in-out",
                  position: "relative",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
                  },
                }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={
                    course.image ||
                    generateCoursePlaceholder(course.title || "Curso")
                  }
                  alt={`Imagen de ${course.title}`}
                />
                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    mb={1}>
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{ fontWeight: "bold" }}>
                      {course.title}
                    </Typography>
                    <Chip
                      label={course.status}
                      color={getStatusColor(course.status)}
                      size="small"
                      checked={course.status === "Activo"}
                      sx={{
                        "& .MuiSwitch-thumb": {
                          backgroundColor:
                            course.status === "Activo" ? "#4caf50" : "#f44336",
                        },
                      }}
                    />
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      {course.status === "Activo" ? "Publicado" : "Borrador"}
                    </Typography>
                  </Box>
                </Box>

                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  {/* Título del curso */}
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{
                      fontWeight: 700,
                      fontSize: "1.1rem",
                      mb: 1.5,
                      lineHeight: 1.3,
                      color: "#1a1a1a",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}>
                    {course.title}
                  </Typography>

                  {/* Descripción */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      lineHeight: 1.5,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}>
                    {course.description}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  {/* Estadísticas del curso */}
                  <Stack direction="row" spacing={3} sx={{ mb: 2 }}>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <PeopleIcon
                        sx={{ fontSize: 18, color: "primary.main" }}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {course.students || 0}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        estudiantes
                      </Typography>
                    </Box>

                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <StarIcon sx={{ fontSize: 18, color: "#ff9800" }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {course.rating || "4.5"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        rating
                      </Typography>
                    </Box>

                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <AccessTimeIcon
                        sx={{ fontSize: 18, color: "text.secondary" }}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {course.duration || "8h"}
                      </Typography>
                    </Box>
                  </Stack>

                  {/* Botones de acción */}
                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <Tooltip title="Ver curso">
                      <IconButton
                        size="small"
                        sx={{
                          backgroundColor: "primary.main",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "primary.dark",
                            transform: "scale(1.1)",
                          },
                          transition: "all 0.2s",
                        }}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Ver estudiantes">
                      <IconButton
                        size="small"
                        sx={{
                          backgroundColor: "info.main",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "info.dark",
                            transform: "scale(1.1)",
                          },
                          transition: "all 0.2s",
                        }}>
                        <PeopleIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Estadísticas">
                      <IconButton
                        size="small"
                        sx={{
                          backgroundColor: "success.main",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "success.dark",
                            transform: "scale(1.1)",
                          },
                          transition: "all 0.2s",
                        }}>
                        <StatsIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                      <Tooltip title="Editar curso">
                        <IconButton
                          size="small"
                          href={`/teacher/courses/${course.id}/edit`}
                          sx={{
                            color: "gray.500",
                            "&:hover": {
                              color: "red.500",
                              bgcolor: "rgba(239, 68, 68, 0.1)",
                            },
                          }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Stack>

                  {/* Información adicional */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      pt: 1,
                      borderTop: "1px solid #f0f0f0",
                    }}>
                    <Typography variant="caption" color="text.secondary">
                      Actualizado {course.lastUpdated || "hace 2 días"}
                    </Typography>

                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <TrendingUpIcon
                        sx={{ fontSize: 14, color: "success.main" }}
                      />
                      <Typography
                        variant="caption"
                        color="success.main"
                        sx={{ fontWeight: 600 }}>
                        +12% esta semana
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default TeacherCourses;

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

import { useTeacherCourses } from "@/shared/hooks/useTeacherCourses"; // ✅ Importa el nuevo custom hook

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

  // ✅ Usa el custom hook para obtener los datos de la API
  const { courses, loading, error } = useTeacherCourses();

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
          to="/teacher/courses/create"
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: 2,
            px: 3,
            py: 1.5,
            fontWeight: 600,
            textTransform: "none",
            fontSize: "1rem",
            boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
            "&:hover": {
              background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
              transform: "translateY(-2px)",
              boxShadow: "0 6px 20px rgba(102, 126, 234, 0.6)",
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
                {/* Header con imagen y estado */}
                <Box sx={{ position: "relative" }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={
                      course.image ||
                      generateCoursePlaceholder(course.title || "Curso")
                    }
                    alt={`Imagen de ${course.title}`}
                    sx={{
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    }}
                  />
                  {/* Overlay con gradiente */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background:
                        "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.3))",
                    }}
                  />

                  {/* Estado del curso */}
                  <Chip
                    label={course.status}
                    color={getStatusColor(course.status)}
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      fontWeight: 600,
                      backdropFilter: "blur(10px)",
                      backgroundColor:
                        course.status === "Activo"
                          ? "rgba(76, 175, 80, 0.9)"
                          : course.status === "Borrador"
                          ? "rgba(255, 152, 0, 0.9)"
                          : "rgba(158, 158, 158, 0.9)",
                      color: "white",
                    }}
                  />

                  {/* Toggle de publicación */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      backgroundColor: "rgba(255,255,255,0.9)",
                      borderRadius: 2,
                      px: 1.5,
                      py: 0.5,
                    }}>
                    <Switch
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
                        sx={{
                          backgroundColor: "warning.main",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "warning.dark",
                            transform: "scale(1.1)",
                          },
                          transition: "all 0.2s",
                        }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Más opciones">
                      <IconButton
                        size="small"
                        sx={{
                          backgroundColor: "grey.300",
                          color: "grey.700",
                          "&:hover": {
                            backgroundColor: "grey.400",
                            transform: "scale(1.1)",
                          },
                          transition: "all 0.2s",
                        }}>
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
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

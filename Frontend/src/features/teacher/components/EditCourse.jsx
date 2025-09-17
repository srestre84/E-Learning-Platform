
// === VERSIÓN SINCRONIZADA CON DEVELOP ===
import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem, FormHelperText, CircularProgress, Alert, Checkbox, FormControlLabel, Card, CardContent, CardHeader, IconButton, Chip, Stack, InputAdornment
} from '@mui/material';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon, Delete as DeleteIcon, CloudUpload as CloudUploadIcon, Add as AddIcon, Remove as RemoveIcon, Image as ImageIcon, AttachMoney as AttachMoneyIcon, AccessTime as AccessTimeIcon, Category as CategoryIcon, VideoLibrary as VideoLibraryIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-toastify';
import { getCourseById, updateCourse, getCategories, getSubcategoriesByCategory } from '@/services/courseService';

const EditCourse = () => {
  const navigate = useNavigate();
  const { id: courseId } = useParams();
  const { user } = useAuth();

  // Estados
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);

  // Estado del formulario
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    categoryId: '',
    subcategoryId: '',
    price: 0,
    estimatedHours: 1,
    thumbnailUrl: '',
    youtubeUrls: [''],
    isPremium: false,
    isPublished: false,
    isActive: true
  });

  // Errores de validación
  const [formErrors, setFormErrors] = useState({});

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const courseData = await getCourseById(courseId);
        const categoriesData = await getCategories();
        setFormData({
          title: courseData.title || '',
          description: courseData.description || '',
          shortDescription: courseData.shortDescription || '',
          categoryId: courseData.category?.id ? String(courseData.category.id) : '',
          subcategoryId: courseData.subcategory?.id ? String(courseData.subcategory.id) : '',
          price: courseData.price || 0,
          estimatedHours: courseData.estimatedHours || 1,
          thumbnailUrl: courseData.thumbnailUrl || '',
          youtubeUrls: courseData.youtubeUrls?.length ? courseData.youtubeUrls : [''],
          isPremium: Boolean(courseData.isPremium),
          isPublished: Boolean(courseData.isPublished),
          isActive: courseData.isActive !== false
        });
        setCategories(categoriesData || []);
        if (courseData.category?.id) {
          const subcategoriesData = await getSubcategoriesByCategory(courseData.category.id);
          setSubcategories(subcategoriesData || []);
        }
      } catch (err) {
        setError(err.message || 'Error al cargar el curso');
      } finally {
        setLoading(false);
      }
    };
    if (courseId) {
      loadInitialData();
    } else {
      setError('ID de curso no válido');
      setLoading(false);
    }
  }, [courseId]);

  // Manejar cambios en formulario
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (name === 'categoryId' && value) {
      loadSubcategories(value);
      setFormData(prev => ({ ...prev, subcategoryId: '' }));
    }
  };

  // Cargar subcategorías
  const loadSubcategories = async (categoryId) => {
    try {
      setLoadingSubcategories(true);
      const subcategoriesData = await getSubcategoriesByCategory(categoryId);
      setSubcategories(subcategoriesData || []);
    } catch (err) {
      toast.error('Error al cargar subcategorías');
    } finally {
      setLoadingSubcategories(false);
    }
  };

  // Manejar URLs de YouTube
  const handleYoutubeUrlChange = (index, value) => {
    const newUrls = [...formData.youtubeUrls];
    newUrls[index] = value;
    setFormData(prev => ({ ...prev, youtubeUrls: newUrls }));
  };
  const addYoutubeUrl = () => {
    setFormData(prev => ({ ...prev, youtubeUrls: [...prev.youtubeUrls, ''] }));
  };
  const removeYoutubeUrl = (index) => {
    if (formData.youtubeUrls.length > 1) {
      const newUrls = formData.youtubeUrls.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, youtubeUrls: newUrls }));
    }
  };

  // Validar formulario
  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'El título es obligatorio';
    if (!formData.description.trim()) errors.description = 'La descripción es obligatoria';
    if (!formData.categoryId) errors.categoryId = 'La categoría es obligatoria';
    if (!formData.subcategoryId) errors.subcategoryId = 'La subcategoría es obligatoria';
    if (formData.price < 0) errors.price = 'El precio no puede ser negativo';
    if (formData.estimatedHours < 1 || formData.estimatedHours > 1000) errors.estimatedHours = 'Las horas estimadas deben estar entre 1 y 1000';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Enviar formulario
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      toast.error('Por favor corrige los errores en el formulario');
      return;
    }
    try {
      setSaving(true);
      if (!formData.categoryId || !formData.subcategoryId) {
        toast.error('Categoría y subcategoría son requeridas');
        return;
      }
      if (!user?.id) {
        toast.error('Error: Usuario no autenticado');
        return;
      }
      const courseData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        instructorId: parseInt(user.id),
        categoryId: parseInt(formData.categoryId),
        subcategoryId: parseInt(formData.subcategoryId),
        price: parseFloat(formData.price) || 0,
        estimatedHours: parseInt(formData.estimatedHours) || 1,
        isPremium: Boolean(formData.isPremium),
        isPublished: Boolean(formData.isPublished),
        isActive: Boolean(formData.isActive)
      };
      if (formData.shortDescription && formData.shortDescription.trim()) {
        courseData.shortDescription = formData.shortDescription.trim();
      }
      if (formData.thumbnailUrl && formData.thumbnailUrl.trim()) {
        courseData.thumbnailUrl = formData.thumbnailUrl.trim();
      }
      const validYoutubeUrls = formData.youtubeUrls.filter(url => url && url.trim() !== '').map(url => url.trim());
      if (validYoutubeUrls.length > 0) {
        courseData.youtubeUrls = validYoutubeUrls;
      }
      await updateCourse(courseId, courseData);
      window.dispatchEvent(new CustomEvent('courseUpdated', { detail: { courseId } }));
      toast.success('Curso actualizado exitosamente');
      navigate('/teacher/courses');
    } catch (err) {
      if (err.message && err.message.includes('Errores de validación:')) {
        toast.error(err.message);
      } else {
        toast.error(err.message || 'Error al actualizar el curso');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Cargando curso...</Typography>
      </Box>
    );
  }
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/teacher/courses')} variant="contained">
          Volver a la lista de cursos
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1200, mx: 'auto', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate('/teacher/courses')} sx={{ backgroundColor: 'white', boxShadow: 1, '&:hover': { backgroundColor: '#f1f5f9' } }}>
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h4" fontWeight="600" color="text.primary">Editar Curso</Typography>
            <Typography variant="body2" color="text.secondary">Actualiza la información de tu curso</Typography>
          </Box>
        </Box>
      </Box>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Información básica */}
          <Grid item xs={12}>
            <Card elevation={2} sx={{ overflow: 'visible' }}>
              <CardHeader title={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><CategoryIcon color="primary" /><Typography variant="h6" fontWeight="600">Información Básica</Typography></Box>} subheader="Título, descripción y categorización del curso" sx={{ pb: 1 }} />
              <CardContent sx={{ pt: 0 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField required fullWidth label="Título del curso" name="title" value={formData.title} onChange={handleChange} error={!!formErrors.title} helperText={formErrors.title} variant="outlined" sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth required error={!!formErrors.categoryId} variant="outlined">
                      <InputLabel>Categoría</InputLabel>
                      <Select name="categoryId" value={formData.categoryId} onChange={handleChange} label="Categoría" sx={{ backgroundColor: 'white' }}>
                        {categories.map((category) => (
                          <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                        ))}
                      </Select>
                      {formErrors.categoryId && (<FormHelperText>{formErrors.categoryId}</FormHelperText>)}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth required error={!!formErrors.subcategoryId} variant="outlined">
                      <InputLabel>Subcategoría</InputLabel>
                      <Select name="subcategoryId" value={formData.subcategoryId} onChange={handleChange} label="Subcategoría" disabled={!formData.categoryId || loadingSubcategories} sx={{ backgroundColor: 'white' }}>
                        {subcategories.map((subcategory) => (
                          <MenuItem key={subcategory.id} value={subcategory.id}>{subcategory.name}</MenuItem>
                        ))}
                      </Select>
                      {formErrors.subcategoryId && (<FormHelperText>{formErrors.subcategoryId}</FormHelperText>)}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField required fullWidth multiline rows={4} label="Descripción completa" name="description" value={formData.description} onChange={handleChange} error={!!formErrors.description} helperText={formErrors.description || "Descripción detallada que se mostrará en la página del curso"} variant="outlined" sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth multiline rows={2} label="Descripción corta" name="shortDescription" value={formData.shortDescription} onChange={handleChange} error={!!formErrors.shortDescription} helperText={formErrors.shortDescription || "Descripción breve que se mostrará en las tarjetas de curso"} variant="outlined" sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          {/* Configuración y precio */}
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardHeader title={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><AttachMoneyIcon color="primary" /><Typography variant="h6" fontWeight="600">Precio y Configuración</Typography></Box>} subheader="Precio y configuraciones del curso" sx={{ pb: 1 }} />
              <CardContent sx={{ pt: 0 }}>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <TextField fullWidth label="Precio" name="price" type="number" value={formData.price} onChange={handleChange} error={!!formErrors.price} helperText={formErrors.price || "Dejar en 0 para hacer el curso gratuito"} InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment>, inputProps: { min: 0, step: "0.01" } }} variant="outlined" sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField fullWidth label="Horas estimadas" name="estimatedHours" type="number" value={formData.estimatedHours} onChange={handleChange} error={!!formErrors.estimatedHours} helperText={formErrors.estimatedHours} InputProps={{ startAdornment: <InputAdornment position="start"><AccessTimeIcon /></InputAdornment>, inputProps: { min: 1, max: 1000 } }} variant="outlined" sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={2}>
                      <FormControlLabel control={<Checkbox checked={formData.isPremium} onChange={handleChange} name="isPremium" color="primary" />} label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Typography>Curso Premium</Typography><Chip label="PREMIUM" size="small" color="warning" variant={formData.isPremium ? "filled" : "outlined"} /></Box>} />
                      <FormControlLabel control={<Checkbox checked={formData.isPublished} onChange={handleChange} name="isPublished" color="primary" />} label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Typography>Publicar curso</Typography><Chip label={formData.isPublished ? "PÚBLICO" : "BORRADOR"} size="small" color={formData.isPublished ? "success" : "default"} variant={formData.isPublished ? "filled" : "outlined"} /></Box>} />
                      <FormControlLabel control={<Checkbox checked={formData.isActive} onChange={handleChange} name="isActive" color="primary" />} label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Typography>Curso activo</Typography><Chip label={formData.isActive ? "ACTIVO" : "INACTIVO"} size="small" color={formData.isActive ? "success" : "error"} variant="filled" /></Box>} />
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          {/* Imagen de portada */}
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardHeader title={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><ImageIcon color="primary" /><Typography variant="h6" fontWeight="600">Imagen de Portada</Typography></Box>} subheader="Imagen que se mostrará como portada del curso" sx={{ pb: 1 }} />
              <CardContent sx={{ pt: 0 }}>
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary" gutterBottom>Funcionalidad de upload próximamente</Typography>
                  <Typography variant="body2" color="text.secondary">Por ahora, usa una URL de imagen temporal</Typography>
                  <TextField fullWidth label="URL de imagen temporal" name="thumbnailUrl" value={formData.thumbnailUrl} onChange={handleChange} error={!!formErrors.thumbnailUrl} helperText={formErrors.thumbnailUrl} variant="outlined" sx={{ mt: 2, '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          {/* Videos de YouTube */}
          <Grid item xs={12}>
            <Card elevation={2}>
              <CardHeader title={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><VideoLibraryIcon color="primary" /><Typography variant="h6" fontWeight="600">Videos de YouTube</Typography></Box>} subheader="URLs de videos de YouTube para el curso" sx={{ pb: 1 }} />
              <CardContent sx={{ pt: 0 }}>
                <Stack spacing={2}>
                  {formData.youtubeUrls.map((url, index) => (
                    <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <TextField fullWidth label={`URL de YouTube ${index + 1}`} value={url} onChange={(e) => handleYoutubeUrlChange(index, e.target.value)} placeholder="https://www.youtube.com/watch?v=..." variant="outlined" sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
                      {formData.youtubeUrls.length > 1 && (
                        <IconButton onClick={() => removeYoutubeUrl(index)} color="error" size="small"><RemoveIcon /></IconButton>
                      )}
                    </Box>
                  ))}
                  <Button startIcon={<AddIcon />} onClick={addYoutubeUrl} variant="outlined" sx={{ mt: 1, alignSelf: 'flex-start' }}>Agregar URL de YouTube</Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          {/* Botones de acción */}
          <Grid item xs={12}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                  <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => navigate('/teacher/courses')} disabled={saving}>Cancelar</Button>
                  <Button type="submit" variant="contained" startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />} disabled={saving} size="large" sx={{ minWidth: 140, backgroundColor: 'primary.main', '&:hover': { backgroundColor: 'primary.dark' } }}>{saving ? 'Guardando...' : 'Guardar Cambios'}</Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default EditCourse;
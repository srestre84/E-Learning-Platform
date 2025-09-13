import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  TextField, 
  InputAdornment, 
  Button, 
  Avatar, 
  Chip, 
  Grid, 
  Card, 
  CardContent, 
  LinearProgress, 
  CircularProgress, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  useMediaQuery, 
  useTheme, 
} from '@mui/material';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { 
  Search as SearchIcon,
  Download as DownloadIcon,
  PersonAdd as PersonAddIcon,
  Message as MessageIcon,
  Visibility as VisibilityIcon,
  Assignment as AssignmentIcon,
  BarChart as BarChartIcon,
  CalendarToday as CalendarTodayIcon,
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
  PersonOff as PersonOffIcon,
  School as SchoolIcon,
} from '@mui/icons-material';


const TeacherStudents = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Estados
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Datos de resumen
  const [summary, setSummary] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    averageProgress: 0
  });

  // Cargar estudiantes
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data
        const mockStudents = Array.from({ length: 12 }, (_, i) => ({
          id: `s${i + 1}`,
          name: `Estudiante ${i + 1}`,
          email: `estudiante${i + 1}@ejemplo.com`,
          avatar: `https://i.pravatar.cc/150?u=${i + 1}`,
          enrollmentDate: new Date(2023, i % 12, (i % 28) + 1).toLocaleDateString(),
          lastAccess: new Date(2023, 10, (i % 28) + 1, (i % 24), (i % 60)).toLocaleString(),
          progress: Math.min(100, Math.round(Math.random() * 110)),
          status: ['activo', 'inactivo', 'suspendido'][i % 3],
          course: `Curso ${(i % 5) + 1}`,
          assignmentsCompleted: Math.floor(Math.random() * 10),
          totalAssignments: 10,
          averageGrade: (Math.random() * 4 + 6).toFixed(1)
        }));
        
        setStudents(mockStudents);
        setSummary({
          total: mockStudents.length,
          active: mockStudents.filter(s => s.status === 'activo').length,
          inactive: mockStudents.filter(s => s.status !== 'activo').length,
          averageProgress: Math.round(mockStudents.reduce((acc, curr) => acc + curr.progress, 0) / mockStudents.length) || 0
        });
        setError(null);
      } catch (err) {
        console.error('Error al cargar estudiantes:', err);
        setError('No se pudieron cargar los estudiantes. Intente nuevamente.');
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [courseId, navigate]);

  // Función para obtener el color según el estado del estudiante
  const getStatusColor = (status) => {
    switch (status) {
      case 'activo':
        return 'success';
      case 'inactivo':
        return 'warning';
      case 'suspendido':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, minHeight: '60vh' }}>
        <LoadingSpinner 
          fullScreen={false}
          text="Cargando estudiantes..."
          color="red"
          size="lg"
        />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      {/* Header con título y acciones */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' }, 
        justifyContent: 'space-between', 
        alignItems: { xs: 'stretch', sm: 'center' }, 
        gap: 2, 
        mb: 3 
      }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 600, color: 'text.primary' }}>
          {courseId ? `Estudiantes del Curso` : 'Todos los Estudiantes'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Buscar estudiantes..."
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 250 }}
          />
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Filtrar por estado</InputLabel>
            <Select
              value={statusFilter}
              label="Filtrar por estado"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="todos">Todos los estados</MenuItem>
              <MenuItem value="activo">Activos</MenuItem>
              <MenuItem value="inactivo">Inactivos</MenuItem>
              <MenuItem value="suspendido">Suspendidos</MenuItem>
            </Select>
          </FormControl>
          <Button 
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => alert('Exportar a Excel')}
            size="small"
          >
            {!isMobile && 'Exportar'}
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<PersonAddIcon />}
            size="small"
            onClick={() => alert('Agregar estudiante')}
          >
            {!isMobile && 'Agregar'}
          </Button>
        </Box>
      </Box>

      {/* Estadísticas de estudiantes */}
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
        gap: 2,
        mb: 3
      }}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PeopleIcon color="primary" sx={{ mr: 1 }} />
              <Typography color="text.secondary" variant="body2">
                Total de Estudiantes
              </Typography>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {summary.total}
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CheckCircleIcon color="success" sx={{ mr: 1 }} />
              <Typography color="text.secondary" variant="body2">
                Estudiantes Activos
              </Typography>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {summary.active}
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PersonOffIcon color="warning" sx={{ mr: 1 }} />
              <Typography color="text.secondary" variant="body2">
                Inactivos/Suspendidos
              </Typography>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {summary.inactive}
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <SchoolIcon color="primary" sx={{ mr: 1 }} />
              <Typography color="text.secondary" variant="body2">
                Progreso Promedio
              </Typography>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {summary.averageProgress}%
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Tarjetas de estudiantes */}
      <Grid container spacing={3}>
        {students
          .filter(student => 
            (statusFilter === 'todos' || student.status === statusFilter) &&
            (searchTerm === '' || 
             student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             student.email.toLowerCase().includes(searchTerm.toLowerCase()))
          )
          .map((student) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={student.id}>
              <Card 
                sx={{ 
                  mb: 3, 
                  borderRadius: 2, 
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                  } 
                }}
              >
                <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                    {/* Avatar y nombre */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, minWidth: 0 }}>
                      <Avatar 
                        src={student.avatar} 
                        alt={student.name}
                        sx={{ 
                          width: 64, 
                          height: 64,
                          border: '2px solid',
                          borderColor: 'divider'
                        }}
                      />
                      <Box sx={{ minWidth: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography variant="h6" fontWeight={600} noWrap sx={{ fontSize: '1.1rem' }}>
                            {student.name}
                          </Typography>
                          <Chip 
                            label={student.status}
                            size="small"
                            color={getStatusColor(student.status)}
                            sx={{ 
                              textTransform: 'capitalize',
                              height: 20,
                              '& .MuiChip-label': { px: 1 }
                            }}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" noWrap sx={{ mb: 1 }}>
                          {student.email}
                        </Typography>
                        
                        {/* Mobile actions */}
                        <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1, mt: 1 }}>
                          <Button 
                            size="small" 
                            variant="outlined" 
                            startIcon={<VisibilityIcon fontSize="small" />}
                            onClick={() => setSelectedStudent(student)}
                            fullWidth
                            sx={{ py: 0.5, fontSize: '0.7rem' }}
                          >
                            Ver detalles
                          </Button>
                        </Box>
                      </Box>
                    </Box>

                    {/* Progreso y estadísticas */}
                    <Box sx={{ 
                      flex: 1, 
                      minWidth: 0,
                      borderLeft: { md: '1px solid' },
                      borderColor: { md: 'divider' },
                      pl: { md: 3 },
                      ml: { md: 1 }
                    }}>
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2" color="text.secondary">
                            Progreso del curso
                          </Typography>
                          <Typography variant="body2" fontWeight={600} color="text.primary">
                            {student.progress}%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={student.progress} 
                          color={student.progress >= 100 ? 'success' : 'primary'}
                          sx={{ 
                            height: 8, 
                            borderRadius: 4,
                            backgroundColor: 'action.hover',
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 4
                            }
                          }}
                        />
                      </Box>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={6} sm={4}>
                          <Box sx={{ 
                            bgcolor: 'background.paper',
                            p: 1.5,
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            height: '100%'
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                              <AssignmentIcon fontSize="small" color="action" sx={{ mr: 1, color: 'primary.main' }} />
                              <Typography variant="subtitle2" color="text.primary">
                                Tareas
                              </Typography>
                            </Box>
                            <Typography variant="h6" fontWeight={600}>
                              {student.assignmentsCompleted}<Typography component="span" variant="body2" color="text.secondary">/{student.totalAssignments}</Typography>
                            </Typography>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={6} sm={4}>
                          <Box sx={{ 
                            bgcolor: 'background.paper',
                            p: 1.5,
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            height: '100%'
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                              <BarChartIcon fontSize="small" color="action" sx={{ mr: 1, color: 'success.main' }} />
                              <Typography variant="subtitle2" color="text.primary">
                                Promedio
                              </Typography>
                            </Box>
                            <Typography variant="h6" fontWeight={600}>
                              {student.averageGrade}
                            </Typography>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={12} sm={4}>
                          <Box sx={{ 
                            bgcolor: 'background.paper',
                            p: 1.5,
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            height: '100%'
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                              <CalendarTodayIcon fontSize="small" color="action" sx={{ mr: 1, color: 'warning.main' }} />
                              <Typography variant="subtitle2" color="text.primary">
                                Último acceso
                              </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(student.lastAccess).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>

                    {/* Desktop actions */}
                    <Box sx={{ 
                      display: { xs: 'none', md: 'flex' },
                      flexDirection: 'column',
                      justifyContent: 'center',
                      pl: 2,
                      borderLeft: '1px solid',
                      borderColor: 'divider',
                      minWidth: 140
                    }}>
                      <Button 
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={() => setSelectedStudent(student)}
                        fullWidth
                        sx={{ mb: 1 }}
                      >
                        Ver detalles
                      </Button>
                      <Button 
                        variant="outlined"
                        size="small"
                        startIcon={<MessageIcon />}
                        onClick={() => alert(`Enviar mensaje a ${student.name}`)}
                        fullWidth
                      >
                        Mensaje
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
        </Grid>
      </Grid>

      {/* Diálogo de detalles del estudiante */}
      <Dialog 
        open={!!selectedStudent} 
        onClose={() => setSelectedStudent(null)}
        maxWidth="sm"
        fullWidth
      >
        {selectedStudent && (
          <>
            <DialogTitle>Detalles del Estudiante</DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
                <Avatar 
                  src={selectedStudent.avatar} 
                  alt={selectedStudent.name}
                  sx={{ width: 80, height: 80, mb: 2 }}
                />
                <Typography variant="h6" gutterBottom align="center">
                  {selectedStudent.name}
                </Typography>
                <Chip 
                  label={selectedStudent.status} 
                  color={getStatusColor(selectedStudent.status)}
                  sx={{ mb: 2 }}
                />
                
                <Grid container spacing={2} sx={{ width: '100%', mt: 1 }}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Email:</strong> {selectedStudent.email}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Fecha de inscripción:</strong> {selectedStudent.enrollmentDate}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Último acceso:</strong> {new Date(selectedStudent.lastAccess).toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Progreso del curso:</strong>
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ width: '100%', mr: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={selectedStudent.progress} 
                          color={selectedStudent.progress > 80 ? 'success' : 'primary'}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {selectedStudent.progress}%
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Tareas completadas:</strong> {selectedStudent.assignmentsCompleted}/{selectedStudent.totalAssignments}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Promedio general:</strong> {selectedStudent.averageGrade}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setSelectedStudent(null)}>Cerrar</Button>
              <Button 
                variant="contained" 
                color="primary"
                startIcon={<MessageIcon />}
                onClick={() => {
                  alert(`Redirigiendo a mensajes con ${selectedStudent.name}`);
                  setSelectedStudent(null);
                }}
              >
                Enviar mensaje
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default TeacherStudents;

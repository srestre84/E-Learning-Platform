import React from 'react';
import { 
  FILTER_OPTIONS, 
  FILTER_LABELS,
  getCoursePriceRange,
  isCourseFree
} from '@/shared/constants/courseConstants';
import { Filter, Search, ArrowUpDown } from 'lucide-react';

const CourseFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  typeFilter,
  onTypeFilterChange,
  levelFilter,
  onLevelFilterChange,
  priceFilter,
  onPriceFilterChange,
  sortBy,
  onSortChange,
  showAdvanced = true,
  className = ""
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Barra de búsqueda */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Buscar cursos, instructores o temas..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Filtro de Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {Object.entries(FILTER_LABELS.STATUS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro de Tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo
            </label>
            <select
              value={typeFilter}
              onChange={(e) => onTypeFilterChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {Object.entries(FILTER_LABELS.TYPE).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro de Nivel */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nivel
            </label>
            <select
              value={levelFilter}
              onChange={(e) => onLevelFilterChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {Object.entries(FILTER_LABELS.LEVEL).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro de Precio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Precio
            </label>
            <select
              value={priceFilter}
              onChange={(e) => onPriceFilterChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {Object.entries(FILTER_LABELS.PRICE).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Ordenamiento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ordenar por
            </label>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="newest">Más recientes</option>
              <option value="oldest">Más antiguos</option>
              <option value="title">Título A-Z</option>
              <option value="title-desc">Título Z-A</option>
              <option value="price-low">Precio: menor a mayor</option>
              <option value="price-high">Precio: mayor a menor</option>
              <option value="rating">Mejor calificados</option>
              <option value="students">Más estudiantes</option>
            </select>
          </div>
        </div>
      )}

      {/* Resumen de filtros activos */}
      {(statusFilter !== FILTER_OPTIONS.STATUS.ALL || 
        typeFilter !== FILTER_OPTIONS.TYPE.ALL || 
        levelFilter !== FILTER_OPTIONS.LEVEL.ALL || 
        priceFilter !== FILTER_OPTIONS.PRICE.ALL) && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Filter className="w-4 h-4" />
          <span>Filtros activos:</span>
          {statusFilter !== FILTER_OPTIONS.STATUS.ALL && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
              {FILTER_LABELS.STATUS[statusFilter]}
            </span>
          )}
          {typeFilter !== FILTER_OPTIONS.TYPE.ALL && (
            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
              {FILTER_LABELS.TYPE[typeFilter]}
            </span>
          )}
          {levelFilter !== FILTER_OPTIONS.LEVEL.ALL && (
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
              {FILTER_LABELS.LEVEL[levelFilter]}
            </span>
          )}
          {priceFilter !== FILTER_OPTIONS.PRICE.ALL && (
            <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
              {FILTER_LABELS.PRICE[priceFilter]}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseFilters;

// Mock Payment Service
import { mockUsers } from './mockAuthService.js';

// Generar datos de pagos más realistas
const generateMockPayments = (userId) => {
  const basePayments = [
    {
      id: 'INV-001',
      userId: userId,
      courseId: 'course-1',
      date: new Date(2024, 11, 15),
      description: 'Curso de Desarrollo Web Moderno',
      courseName: 'Desarrollo Web Moderno',
      amount: 99.99,
      status: 'completed',
      paymentMethod: 'Tarjeta de crédito',
      transactionId: 'txn_1234567890',
      invoiceUrl: '/invoices/INV-001.pdf',
      receiptUrl: '/receipts/REC-001.pdf',
    },
    {
      id: 'INV-002',
      userId: userId,
      courseId: 'course-2',
      date: new Date(2024, 10, 22),
      description: 'Curso de React Avanzado',
      courseName: 'React Avanzado',
      amount: 149.99,
      status: 'completed',
      paymentMethod: 'PayPal',
      transactionId: 'txn_0987654321',
      invoiceUrl: '/invoices/INV-002.pdf',
      receiptUrl: '/receipts/REC-002.pdf',
    },
    {
      id: 'INV-003',
      userId: userId,
      courseId: 'course-3',
      date: new Date(2024, 9, 10),
      description: 'Membresía Premium - Plan Mensual',
      courseName: 'Membresía Premium',
      amount: 29.99,
      status: 'refunded',
      paymentMethod: 'Tarjeta de débito',
      transactionId: 'txn_1122334455',
      invoiceUrl: '/invoices/INV-003.pdf',
      receiptUrl: '/receipts/REC-003.pdf',
      refundDate: new Date(2024, 9, 15),
      refundReason: 'Solicitud del usuario',
    },
    {
      id: 'INV-004',
      userId: userId,
      courseId: 'course-4',
      date: new Date(2024, 8, 5),
      description: 'Curso de Node.js y Express',
      courseName: 'Node.js y Express',
      amount: 79.99,
      status: 'completed',
      paymentMethod: 'Tarjeta de crédito',
      transactionId: 'txn_5566778899',
      invoiceUrl: '/invoices/INV-004.pdf',
      receiptUrl: '/receipts/REC-004.pdf',
    },
    {
      id: 'INV-005',
      userId: userId,
      courseId: 'course-5',
      date: new Date(2024, 7, 18),
      description: 'Curso de Diseño UX/UI',
      courseName: 'Diseño UX/UI',
      amount: 119.99,
      status: 'pending',
      paymentMethod: 'Transferencia bancaria',
      transactionId: 'txn_9988776655',
      invoiceUrl: '/invoices/INV-005.pdf',
      receiptUrl: null,
    },
    {
      id: 'INV-006',
      userId: userId,
      courseId: 'course-6',
      date: new Date(2024, 6, 12),
      description: 'Curso de Python para Data Science',
      courseName: 'Python para Data Science',
      amount: 189.99,
      status: 'completed',
      paymentMethod: 'Tarjeta de crédito',
      transactionId: 'txn_1357924680',
      invoiceUrl: '/invoices/INV-006.pdf',
      receiptUrl: '/receipts/REC-006.pdf',
    },
    {
      id: 'INV-007',
      userId: userId,
      courseId: 'course-7',
      date: new Date(2024, 5, 8),
      description: 'Curso de Machine Learning Básico',
      courseName: 'Machine Learning Básico',
      amount: 159.99,
      status: 'failed',
      paymentMethod: 'Tarjeta de crédito',
      transactionId: 'txn_2468013579',
      invoiceUrl: null,
      receiptUrl: null,
      failureReason: 'Fondos insuficientes',
    },
    {
      id: 'INV-008',
      userId: userId,
      courseId: 'course-8',
      date: new Date(2024, 4, 25),
      description: 'Curso de JavaScript Avanzado',
      courseName: 'JavaScript Avanzado',
      amount: 129.99,
      status: 'completed',
      paymentMethod: 'PayPal',
      transactionId: 'txn_3691470258',
      invoiceUrl: '/invoices/INV-008.pdf',
      receiptUrl: '/receipts/REC-008.pdf',
    }
  ];

  return basePayments;
};

// Simular base de datos de pagos
let paymentsDatabase = {};

// Inicializar datos para usuarios mock
mockUsers.forEach(user => {
  if (user.role === 'student') {
    paymentsDatabase[user.email] = generateMockPayments(user.email);
  }
});

// Simular delay de red
const simulateNetworkDelay = (min = 300, max = 800) => {
  const delay = Math.random() * (max - min) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
};

export const mockPaymentService = {
  // Obtener historial de pagos del usuario
  async getPaymentHistory(userEmail, filters = {}) {
    await simulateNetworkDelay();
    
    const userPayments = paymentsDatabase[userEmail] || [];
    let filteredPayments = [...userPayments];

    // Aplicar filtros
    if (filters.status && filters.status !== 'all') {
      filteredPayments = filteredPayments.filter(payment => payment.status === filters.status);
    }

    if (filters.dateFrom) {
      filteredPayments = filteredPayments.filter(payment => 
        payment.date >= new Date(filters.dateFrom)
      );
    }

    if (filters.dateTo) {
      filteredPayments = filteredPayments.filter(payment => 
        payment.date <= new Date(filters.dateTo)
      );
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredPayments = filteredPayments.filter(payment => 
        payment.description.toLowerCase().includes(searchTerm) ||
        payment.id.toLowerCase().includes(searchTerm) ||
        payment.courseName.toLowerCase().includes(searchTerm)
      );
    }

    // Aplicar ordenamiento
    if (filters.sortBy) {
      filteredPayments.sort((a, b) => {
        const aValue = a[filters.sortBy];
        const bValue = b[filters.sortBy];
        
        if (filters.sortDirection === 'desc') {
          return bValue > aValue ? 1 : -1;
        }
        return aValue > bValue ? 1 : -1;
      });
    }

    // Aplicar paginación
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedPayments = filteredPayments.slice(startIndex, endIndex);

    return {
      success: true,
      data: {
        payments: paginatedPayments,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(filteredPayments.length / limit),
          totalItems: filteredPayments.length,
          itemsPerPage: limit,
          hasNextPage: endIndex < filteredPayments.length,
          hasPrevPage: page > 1
        },
        summary: {
          totalSpent: userPayments
            .filter(p => p.status === 'completed')
            .reduce((sum, p) => sum + p.amount, 0),
          totalTransactions: userPayments.length,
          completedTransactions: userPayments.filter(p => p.status === 'completed').length,
          pendingTransactions: userPayments.filter(p => p.status === 'pending').length,
          refundedTransactions: userPayments.filter(p => p.status === 'refunded').length,
          failedTransactions: userPayments.filter(p => p.status === 'failed').length,
        }
      }
    };
  },

  // Obtener detalles de un pago específico
  async getPaymentDetails(userEmail, paymentId) {
    await simulateNetworkDelay();
    
    const userPayments = paymentsDatabase[userEmail] || [];
    const payment = userPayments.find(p => p.id === paymentId);
    
    if (!payment) {
      return {
        success: false,
        error: 'Pago no encontrado'
      };
    }

    return {
      success: true,
      data: payment
    };
  },

  // Descargar factura
  async downloadInvoice(userEmail, paymentId) {
    await simulateNetworkDelay();
    
    const userPayments = paymentsDatabase[userEmail] || [];
    const payment = userPayments.find(p => p.id === paymentId);
    
    if (!payment || !payment.invoiceUrl) {
      return {
        success: false,
        error: 'Factura no disponible'
      };
    }

    // Simular descarga de archivo
    return {
      success: true,
      data: {
        url: payment.invoiceUrl,
        filename: `factura-${payment.id}.pdf`
      }
    };
  },

  // Descargar recibo
  async downloadReceipt(userEmail, paymentId) {
    await simulateNetworkDelay();
    
    const userPayments = paymentsDatabase[userEmail] || [];
    const payment = userPayments.find(p => p.id === paymentId);
    
    if (!payment || !payment.receiptUrl) {
      return {
        success: false,
        error: 'Recibo no disponible'
      };
    }

    return {
      success: true,
      data: {
        url: payment.receiptUrl,
        filename: `recibo-${payment.id}.pdf`
      }
    };
  },

  // Exportar historial de pagos
  async exportPaymentHistory(userEmail, format = 'csv', filters = {}) {
    await simulateNetworkDelay(500, 1200);
    
    const result = await this.getPaymentHistory(userEmail, { ...filters, limit: 1000 });
    
    if (!result.success) {
      return result;
    }

    // Simular generación de archivo de exportación
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `historial-pagos-${timestamp}.${format}`;
    
    return {
      success: true,
      data: {
        url: `/exports/${filename}`,
        filename: filename,
        format: format
      }
    };
  },

  // Solicitar reembolso
  async requestRefund(userEmail, paymentId, reason) {
    await simulateNetworkDelay(800, 1500);
    
    const userPayments = paymentsDatabase[userEmail] || [];
    const paymentIndex = userPayments.findIndex(p => p.id === paymentId);
    
    if (paymentIndex === -1) {
      return {
        success: false,
        error: 'Pago no encontrado'
      };
    }

    const payment = userPayments[paymentIndex];
    
    if (payment.status !== 'completed') {
      return {
        success: false,
        error: 'Solo se pueden reembolsar pagos completados'
      };
    }

    // Actualizar estado del pago
    paymentsDatabase[userEmail][paymentIndex] = {
      ...payment,
      status: 'refunded',
      refundDate: new Date(),
      refundReason: reason
    };

    return {
      success: true,
      data: {
        message: 'Solicitud de reembolso procesada exitosamente',
        refundId: `REF-${Date.now()}`,
        estimatedProcessingTime: '3-5 días hábiles'
      }
    };
  }
};

export default mockPaymentService;

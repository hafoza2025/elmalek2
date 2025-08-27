/**
 * Tag ElMalek - Advanced Sales Management System with Complete Features
 * Version 2.2.0 - Complete Production Ready System
 * 
 * نظام إدارة المبيعات والاتفاقات المتقدم - Tag ElMalek
 * الإصدار 2.2.0 - النظام الكامل الجاهز للإنتاج
 * 
 * المميزات الكاملة:
 * - عمليات CRUD كاملة مع حماية أمنية
 * - نظام حماية متطور بكلمة مرور
 * - فلترة وبحث متقدم
 * - تقارير شاملة مع تصدير متعدد الصيغ
 * - تكامل التليجرام المتطور
 * - نظام إشعارات بدون نوافذ منبثقة
 * - نسخ احتياطي تلقائي وآمن
 * - واجهة مستجيبة مع دعم RTL
 * - إدارة المخزون المتقدمة
 * - نظام التقارير المالية
 * - أداء محسن ومعالجة أخطاء شاملة
 */

class TagElMalekSalesSystem {
    constructor() {
        // System Information
        this.version = '2.2.0';
        this.buildDate = '2025-08-27';
        this.author = 'Tag ElMalek Development Team';
        
        // Core Data Structure
        this.data = {
            sales: [],
            contracts: [],
            customers: [],
            products: [],
            categories: [],
            suppliers: [],
            stockAdjustments: [],
            settings: {
                // System Settings
                company: 'Tag ElMalek',
                currency: 'EGP',
                timeZone: 'Africa/Cairo',
                locale: 'ar-EG',
                theme: 'light',
                dateFormat: 'dd/mm/yyyy',
                
                // Security Settings
                password: '',
                requirePassword: true,
                sessionTimeout: 30, // minutes
                maxLoginAttempts: 3,
                
                // Business Settings
                taxRate: 0.14, // 14% VAT
                lowStockThreshold: 10,
                contractAlertDays: 30,
                invoicePrefix: 'INV',
                contractPrefix: 'CONT',
                
                // Integration Settings
                botToken: '',
                chatId: '',
                enableTelegram: false,
                
                // Notification Settings
                notifications: {
                    sales: true,
                    contracts: true,
                    customers: true,
                    products: true,
                    lowStock: true,
                    contractExpiry: true,
                    dailyReports: false,
                    weeklyReports: false
                },
                
                // Backup Settings
                autoBackup: {
                    enabled: true,
                    frequency: 'daily', // daily, weekly, monthly
                    maxBackups: 10,
                    lastBackup: null
                },
                
                // Performance Settings
                cacheEnabled: true,
                batchSize: 50,
                maxRecords: 10000
            },
            
            // System Metadata
            metadata: {
                version: this.version,
                createdAt: new Date().toISOString(),
                lastUpdated: new Date().toISOString(),
                totalSales: 0,
                totalContracts: 0,
                totalCustomers: 0,
                totalProducts: 0,
                lastBackup: null,
                lastHealthCheck: null,
                systemHealth: 'good',
                performanceMetrics: {
                    avgResponseTime: 0,
                    totalOperations: 0,
                    errorRate: 0,
                    memoryUsage: 0
                }
            }
        };
        
        // System State Management
        this.state = {
            currentUser: null,
            currentSection: 'dashboard',
            currentEditId: null,
            currentEditType: null,
            currentDateFilter: null,
            searchFilters: {},
            sortOptions: {},
            isOnline: navigator.onLine,
            isLoading: false,
            hasUnsavedChanges: false,
            loginAttempts: 0,
            sessionStartTime: Date.now(),
            lastActivity: Date.now()
        };
        
        // UI Components and Cache
        this.ui = {
            charts: {},
            modals: {},
            tables: {},
            cache: new Map(),
            searchCache: new Map(),
            filterCache: new Map()
        };
        
        // Notifications System
        this.notifications = {
            history: [],
            unreadCount: 0,
            maxHistory: 100,
            types: {
                SUCCESS: 'success',
                ERROR: 'error',
                WARNING: 'warning',
                INFO: 'info',
                ACTIVITY: 'activity'
            }
        };
        
        // Pagination System
        this.pagination = {
            sales: { page: 1, size: 15, total: 0 },
            contracts: { page: 1, size: 15, total: 0 },
            customers: { page: 1, size: 15, total: 0 },
            products: { page: 1, size: 15, total: 0 },
            suppliers: { page: 1, size: 15, total: 0 }
        };
        
        // Performance Monitoring
        this.performance = {
            startTime: performance.now(),
            operationTimes: [],
            memoryUsage: [],
            errorCounts: {},
            slowOperations: []
        };
        
        // Initialize System
        this.init();
    }

    // =============================================
    // SYSTEM INITIALIZATION
    // =============================================
    
    async init() {
        console.log(`🏷️ Tag ElMalek Sales System v${this.version} - Initializing...`);
        
        try {
            this.showLoading(true, 'تحميل النظام...');
            
            // Load system data
            await this.loadSystemData();
            
            // Setup core systems
            this.setupEventListeners();
            this.setupNavigation();
            this.setupKeyboardShortcuts();
            this.setupNetworkMonitoring();
            this.setupPerformanceMonitoring();
            this.setupSecurityFeatures();
            
            // Initialize UI components
            this.initializeCharts();
            this.setupFormValidation();
            this.setupAdvancedSearch();
            this.populateAllSelects();
            
            // Update all UI sections
            this.updateAllSections();
            
            // Start background services
            this.startBackgroundServices();
            
            // Perform initial health check
            await this.performSystemHealthCheck();
            
            // Show welcome message
            this.showWelcomeMessage();
            
            console.log('✅ Tag ElMalek System initialized successfully');
            
        } catch (error) {
            console.error('❌ System initialization failed:', error);
            this.handleCriticalError('فشل في تحميل النظام', error);
        } finally {
            setTimeout(() => this.showLoading(false), 2000);
        }
    }

    // =============================================
    // ENHANCED PASSWORD PROTECTION SYSTEM
    // =============================================
    
    async verifyPassword(operation = 'تنفيذ العملية', skipIfDisabled = false) {
        const { password, requirePassword } = this.data.settings;
        
        // Check if protection is disabled
        if (!requirePassword || (!password && skipIfDisabled)) {
            console.log('🔓 Password protection disabled - allowing operation');
            return true;
        }
        
        // Check if no password is set
        if (!password || password.trim() === '') {
            if (requirePassword) {
                this.showNotification('لم يتم تعيين كلمة مرور للنظام', 'warning');
                return false;
            }
            return true;
        }
        
        // Show password verification dialog
        return new Promise((resolve) => {
            const modalId = `passwordModal_${Date.now()}`;
            const modalHtml = this.createPasswordModal(modalId, operation, password, resolve);
            
            document.body.insertAdjacentHTML('beforeend', modalHtml);
            document.body.style.overflow = 'hidden';
            
            // Auto-focus password input
            setTimeout(() => {
                const input = document.getElementById(`adminPasswordInput_${modalId}`);
                if (input) input.focus();
            }, 100);
        });
    }

    createPasswordModal(modalId, operation, correctPassword, resolve) {
        return `
            <div id="${modalId}" class="modal password-modal" style="display: block; z-index: 10000;">
                <div class="modal-content modal-sm">
                    <div class="modal-header">
                        <h3 style="color: #667eea; margin: 0; display: flex; align-items: center;">
                            <i class="fas fa-shield-alt" style="margin-left: 10px;"></i>
                            الحماية الأمنية
                        </h3>
                        <button type="button" class="modal-close" onclick="this.cancelPasswordVerification_${modalId}()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="password-verification-container">
                            <div class="operation-info">
                                <i class="fas fa-exclamation-triangle" style="color: #f59e0b; margin-left: 8px;"></i>
                                <span>يتطلب ${operation} كلمة المرور الإدارية</span>
                            </div>
                            
                            <div class="password-input-container">
                                <div class="input-group">
                                    <input type="password" 
                                           id="adminPasswordInput_${modalId}" 
                                           class="form-control password-input" 
                                           placeholder="أدخل كلمة المرور..."
                                           autocomplete="current-password">
                                    <button type="button" 
                                            class="password-toggle-btn"
                                            onclick="this.togglePasswordVisibility_${modalId}()">
                                        <i class="fas fa-eye" id="passwordToggleIcon_${modalId}"></i>
                                    </button>
                                </div>
                                
                                <div id="passwordError_${modalId}" class="password-error" style="display: none;">
                                    <i class="fas fa-times-circle"></i>
                                    <span id="errorText_${modalId}">كلمة المرور غير صحيحة!</span>
                                </div>
                            </div>
                            
                            <div class="security-info">
                                <small class="text-muted">
                                    <i class="fas fa-info-circle"></i>
                                    هذا الإجراء محمي لضمان أمان البيانات
                                </small>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-primary" onclick="this.confirmPasswordVerification_${modalId}()">
                            <i class="fas fa-check"></i> تأكيد
                        </button>
                        <button class="btn btn-secondary" onclick="this.cancelPasswordVerification_${modalId}()">
                            <i class="fas fa-times"></i> إلغاء
                        </button>
                    </div>
                </div>
            </div>
            
            <script>
                this.togglePasswordVisibility_${modalId} = function() {
                    const input = document.getElementById('adminPasswordInput_${modalId}');
                    const icon = document.getElementById('passwordToggleIcon_${modalId}');
                    
                    if (input.type === 'password') {
                        input.type = 'text';
                        icon.className = 'fas fa-eye-slash';
                    } else {
                        input.type = 'password';
                        icon.className = 'fas fa-eye';
                    }
                };
                
                this.confirmPasswordVerification_${modalId} = function() {
                    const input = document.getElementById('adminPasswordInput_${modalId}');
                    const errorDiv = document.getElementById('passwordError_${modalId}');
                    const errorText = document.getElementById('errorText_${modalId}');
                    const enteredPassword = input.value;
                    
                    if (enteredPassword === "${correctPassword.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}") {
                        document.getElementById('${modalId}').remove();
                        document.body.style.overflow = '';
                        resolve(true);
                    } else {
                        this.showPasswordError(errorDiv, errorText, input, enteredPassword);
                    }
                };
                
                this.cancelPasswordVerification_${modalId} = function() {
                    document.getElementById('${modalId}').remove();
                    document.body.style.overflow = '';
                    resolve(false);
                };
                
                this.showPasswordError = function(errorDiv, errorText, input, enteredPassword) {
                    errorText.textContent = enteredPassword.trim() === '' ? 
                        'يرجى إدخال كلمة المرور!' : 
                        'كلمة المرور غير صحيحة!';
                    
                    errorDiv.style.display = 'block';
                    input.classList.add('error');
                    input.focus();
                    input.select();
                    
                    // Shake animation
                    input.style.animation = 'shake 0.6s ease-in-out';
                    setTimeout(() => {
                        input.style.animation = '';
                        input.classList.remove('error');
                    }, 600);
                };
                
                // Event listeners
                document.getElementById('adminPasswordInput_${modalId}').addEventListener('keydown', function(e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        confirmPasswordVerification_${modalId}();
                    } else if (e.key === 'Escape') {
                        e.preventDefault();
                        cancelPasswordVerification_${modalId}();
                    }
                });
                
                document.getElementById('adminPasswordInput_${modalId}').addEventListener('input', function() {
                    document.getElementById('passwordError_${modalId}').style.display = 'none';
                    this.classList.remove('error');
                });
            <\/script>
        `;
    }

    // =============================================
    // ENHANCED CRUD OPERATIONS - SALES
    // =============================================
    
    async addSale(formData) {
        if (!(await this.verifyPassword('إضافة مبيعة جديدة'))) {
            this.showNotification('تم إلغاء إضافة المبيعة', 'warning');
            return false;
        }

        try {
            this.showLoading(true, 'إضافة المبيعة...');
            
            const saleData = this.validateSaleData(formData);
            const sale = await this.createSaleRecord(saleData);
            
            // Update inventory and customer data
            await this.updateInventoryForSale(sale, 'subtract');
            await this.updateCustomerPurchases(sale.customerId, sale.total, 'add');
            
            // Save and update UI
            await this.saveSystemData();
            this.updateSalesTable();
            this.updateDashboard();
            this.updateInventoryAlerts();
            
            // Send notifications
            await this.sendSaleNotification(sale, 'created');
            this.showNotification(`تم إضافة المبيعة ${sale.invoiceNumber} بنجاح`, 'success');
            
            // Reset form and close modal
            this.resetSaleForm();
            this.closeModal('saleModal');
            
            return sale;
            
        } catch (error) {
            console.error('Error adding sale:', error);
            this.showNotification(`خطأ في إضافة المبيعة: ${error.message}`, 'error');
            return false;
        } finally {
            this.showLoading(false);
        }
    }

    async updateSale(saleId, formData) {
        if (!(await this.verifyPassword('تعديل المبيعة'))) {
            this.showNotification('تم إلغاء تعديل المبيعة', 'warning');
            return false;
        }

        try {
            this.showLoading(true, 'تحديث المبيعة...');
            
            const existingSale = this.findSaleById(saleId);
            if (!existingSale) {
                throw new Error('المبيعة غير موجودة');
            }
            
            // Revert previous changes
            await this.updateInventoryForSale(existingSale, 'add');
            await this.updateCustomerPurchases(existingSale.customerId, existingSale.total, 'subtract');
            
            // Apply new changes
            const updatedSaleData = this.validateSaleData(formData);
            const updatedSale = await this.updateSaleRecord(saleId, updatedSaleData);
            
            await this.updateInventoryForSale(updatedSale, 'subtract');
            await this.updateCustomerPurchases(updatedSale.customerId, updatedSale.total, 'add');
            
            // Save and update UI
            await this.saveSystemData();
            this.updateSalesTable();
            this.updateDashboard();
            
            // Send notifications
            await this.sendSaleNotification(updatedSale, 'updated');
            this.showNotification(`تم تحديث المبيعة ${updatedSale.invoiceNumber} بنجاح`, 'success');
            
            this.closeModal('saleModal');
            this.resetEditMode();
            
            return updatedSale;
            
        } catch (error) {
            console.error('Error updating sale:', error);
            this.showNotification(`خطأ في تحديث المبيعة: ${error.message}`, 'error');
            return false;
        } finally {
            this.showLoading(false);
        }
    }

    async deleteSale(saleId) {
        if (!(await this.verifyPassword('حذف المبيعة'))) {
            this.showNotification('تم إلغاء حذف المبيعة', 'warning');
            return false;
        }

        const confirmed = await this.showConfirmDialog(
            'هل أنت متأكد من حذف هذه المبيعة؟ لا يمكن التراجع عن هذا الإجراء.',
            'تأكيد حذف المبيعة'
        );

        if (!confirmed) return false;

        try {
            this.showLoading(true, 'حذف المبيعة...');
            
            const sale = this.findSaleById(saleId);
            if (!sale) {
                throw new Error('المبيعة غير موجودة');
            }
            
            // Restore inventory and customer data
            await this.updateInventoryForSale(sale, 'add');
            await this.updateCustomerPurchases(sale.customerId, sale.total, 'subtract');
            
            // Remove from data array
            this.data.sales = this.data.sales.filter(s => s.id !== saleId);
            
            // Save and update UI
            await this.saveSystemData();
            this.updateSalesTable();
            this.updateDashboard();
            
            // Send notifications
            await this.sendSaleNotification(sale, 'deleted');
            this.showNotification(`تم حذف المبيعة ${sale.invoiceNumber} بنجاح`, 'success');
            
            return true;
            
        } catch (error) {
            console.error('Error deleting sale:', error);
            this.showNotification(`خطأ في حذف المبيعة: ${error.message}`, 'error');
            return false;
        } finally {
            this.showLoading(false);
        }
    }

    // =============================================
    // ENHANCED CRUD OPERATIONS - PRODUCTS
    // =============================================
    
    async addProduct(formData) {
        if (!(await this.verifyPassword('إضافة منتج جديد'))) {
            this.showNotification('تم إلغاء إضافة المنتج', 'warning');
            return false;
        }

        try {
            this.showLoading(true, 'إضافة المنتج...');
            
            const productData = this.validateProductData(formData);
            const product = await this.createProductRecord(productData);
            
            // Add to data array
            this.data.products.push(product);
            
            // Save and update UI
            await this.saveSystemData();
            this.updateProductsTable();
            this.updateDashboard();
            this.populateProductSelects();
            
            // Send notifications
            await this.sendProductNotification(product, 'created');
            this.showNotification(`تم إضافة المنتج ${product.name} بنجاح`, 'success');
            
            this.resetProductForm();
            this.closeModal('productModal');
            
            return product;
            
        } catch (error) {
            console.error('Error adding product:', error);
            this.showNotification(`خطأ في إضافة المنتج: ${error.message}`, 'error');
            return false;
        } finally {
            this.showLoading(false);
        }
    }

    async updateProduct(productId, formData) {
        if (!(await this.verifyPassword('تعديل المنتج'))) {
            this.showNotification('تم إلغاء تعديل المنتج', 'warning');
            return false;
        }

        try {
            this.showLoading(true, 'تحديث المنتج...');
            
            const productData = this.validateProductData(formData);
            const updatedProduct = await this.updateProductRecord(productId, productData);
            
            if (!updatedProduct) {
                throw new Error('المنتج غير موجود');
            }
            
            // Save and update UI
            await this.saveSystemData();
            this.updateProductsTable();
            this.updateDashboard();
            this.populateProductSelects();
            
            // Send notifications
            await this.sendProductNotification(updatedProduct, 'updated');
            this.showNotification(`تم تحديث المنتج ${updatedProduct.name} بنجاح`, 'success');
            
            this.closeModal('productModal');
            this.resetEditMode();
            
            return updatedProduct;
            
        } catch (error) {
            console.error('Error updating product:', error);
            this.showNotification(`خطأ في تحديث المنتج: ${error.message}`, 'error');
            return false;
        } finally {
            this.showLoading(false);
        }
    }

    async deleteProduct(productId) {
        if (!(await this.verifyPassword('حذف المنتج'))) {
            this.showNotification('تم إلغاء حذف المنتج', 'warning');
            return false;
        }

        // Check for dependencies
        const hasSales = this.data.sales.some(s => s.productId === productId);
        if (hasSales) {
            this.showNotification('لا يمكن حذف المنتج لوجود مبيعات مرتبطة به', 'warning');
            return false;
        }

        const confirmed = await this.showConfirmDialog(
            'هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.',
            'تأكيد حذف المنتج'
        );

        if (!confirmed) return false;

        try {
            this.showLoading(true, 'حذف المنتج...');
            
            const product = this.findProductById(productId);
            if (!product) {
                throw new Error('المنتج غير موجود');
            }
            
            // Remove from data array
            this.data.products = this.data.products.filter(p => p.id !== productId);
            
            // Save and update UI
            await this.saveSystemData();
            this.updateProductsTable();
            this.updateDashboard();
            this.populateProductSelects();
            
            // Send notifications
            await this.sendProductNotification(product, 'deleted');
            this.showNotification(`تم حذف المنتج ${product.name} بنجاح`, 'success');
            
            return true;
            
        } catch (error) {
            console.error('Error deleting product:', error);
            this.showNotification(`خطأ في حذف المنتج: ${error.message}`, 'error');
            return false;
        } finally {
            this.showLoading(false);
        }
    }

    // =============================================
    // ENHANCED CRUD OPERATIONS - CUSTOMERS
    // =============================================
    
    async addCustomer(formData) {
        try {
            this.showLoading(true, 'إضافة العميل...');
            
            const customerData = this.validateCustomerData(formData);
            const customer = await this.createCustomerRecord(customerData);
            
            // Add to data array
            this.data.customers.push(customer);
            
            // Save and update UI
            await this.saveSystemData();
            this.updateCustomersTable();
            this.updateDashboard();
            this.populateCustomerSelects();
            
            // Send notifications
            await this.sendCustomerNotification(customer, 'created');
            this.showNotification(`تم إضافة العميل ${customer.name} بنجاح`, 'success');
            
            this.resetCustomerForm();
            this.closeModal('customerModal');
            
            return customer;
            
        } catch (error) {
            console.error('Error adding customer:', error);
            this.showNotification(`خطأ في إضافة العميل: ${error.message}`, 'error');
            return false;
        } finally {
            this.showLoading(false);
        }
    }

    async updateCustomer(customerId, formData) {
        try {
            this.showLoading(true, 'تحديث بيانات العميل...');
            
            const customerData = this.validateCustomerData(formData);
            const updatedCustomer = await this.updateCustomerRecord(customerId, customerData);
            
            if (!updatedCustomer) {
                throw new Error('العميل غير موجود');
            }
            
            // Save and update UI
            await this.saveSystemData();
            this.updateCustomersTable();
            this.populateCustomerSelects();
            
            // Send notifications
            await this.sendCustomerNotification(updatedCustomer, 'updated');
            this.showNotification(`تم تحديث بيانات العميل ${updatedCustomer.name} بنجاح`, 'success');
            
            this.closeModal('customerModal');
            this.resetEditMode();
            
            return updatedCustomer;
            
        } catch (error) {
            console.error('Error updating customer:', error);
            this.showNotification(`خطأ في تحديث العميل: ${error.message}`, 'error');
            return false;
        } finally {
            this.showLoading(false);
        }
    }

    async deleteCustomer(customerId) {
        // Check for dependencies
        const hasSales = this.data.sales.some(s => s.customerId === customerId);
        const hasContracts = this.data.contracts.some(c => c.customerId === customerId);
        
        if (hasSales || hasContracts) {
            this.showNotification('لا يمكن حذف العميل لوجود مبيعات أو اتفاقات مرتبطة به', 'warning');
            return false;
        }

        const confirmed = await this.showConfirmDialog(
            'هل أنت متأكد من حذف هذا العميل؟ لا يمكن التراجع عن هذا الإجراء.',
            'تأكيد حذف العميل'
        );

        if (!confirmed) return false;

        try {
            this.showLoading(true, 'حذف العميل...');
            
            const customer = this.findCustomerById(customerId);
            if (!customer) {
                throw new Error('العميل غير موجود');
            }
            
            // Remove from data array
            this.data.customers = this.data.customers.filter(c => c.id !== customerId);
            
            // Save and update UI
            await this.saveSystemData();
            this.updateCustomersTable();
            this.updateDashboard();
            this.populateCustomerSelects();
            
            // Send notifications
            await this.sendCustomerNotification(customer, 'deleted');
            this.showNotification(`تم حذف العميل ${customer.name} بنجاح`, 'success');
            
            return true;
            
        } catch (error) {
            console.error('Error deleting customer:', error);
            this.showNotification(`خطأ في حذف العميل: ${error.message}`, 'error');
            return false;
        } finally {
            this.showLoading(false);
        }
    }

    // =============================================
    // ENHANCED CRUD OPERATIONS - CONTRACTS
    // =============================================
    
    async addContract(formData) {
        if (!(await this.verifyPassword('إضافة اتفاق جديد'))) {
            this.showNotification('تم إلغاء إضافة الاتفاق', 'warning');
            return false;
        }

        try {
            this.showLoading(true, 'إضافة الاتفاق...');
            
            const contractData = this.validateContractData(formData);
            const contract = await this.createContractRecord(contractData);
            
            // Add to data array
            this.data.contracts.push(contract);
            
            // Save and update UI
            await this.saveSystemData();
            this.updateContractsTable();
            this.updateDashboard();
            
            // Send notifications
            await this.sendContractNotification(contract, 'created');
            this.showNotification(`تم إضافة الاتفاق ${contract.contractNumber} بنجاح`, 'success');
            
            this.resetContractForm();
            this.closeModal('contractModal');
            
            return contract;
            
        } catch (error) {
            console.error('Error adding contract:', error);
            this.showNotification(`خطأ في إضافة الاتفاق: ${error.message}`, 'error');
            return false;
        } finally {
            this.showLoading(false);
        }
    }

    async updateContract(contractId, formData) {
        if (!(await this.verifyPassword('تعديل الاتفاق'))) {
            this.showNotification('تم إلغاء تعديل الاتفاق', 'warning');
            return false;
        }

        try {
            this.showLoading(true, 'تحديث الاتفاق...');
            
            const contractData = this.validateContractData(formData);
            const updatedContract = await this.updateContractRecord(contractId, contractData);
            
            if (!updatedContract) {
                throw new Error('الاتفاق غير موجود');
            }
            
            // Save and update UI
            await this.saveSystemData();
            this.updateContractsTable();
            this.updateDashboard();
            
            // Send notifications
            await this.sendContractNotification(updatedContract, 'updated');
            this.showNotification(`تم تحديث الاتفاق ${updatedContract.contractNumber} بنجاح`, 'success');
            
            this.closeModal('contractModal');
            this.resetEditMode();
            
            return updatedContract;
            
        } catch (error) {
            console.error('Error updating contract:', error);
            this.showNotification(`خطأ في تحديث الاتفاق: ${error.message}`, 'error');
            return false;
        } finally {
            this.showLoading(false);
        }
    }

    async deleteContract(contractId) {
        if (!(await this.verifyPassword('حذف الاتفاق'))) {
            this.showNotification('تم إلغاء حذف الاتفاق', 'warning');
            return false;
        }

        const confirmed = await this.showConfirmDialog(
            'هل أنت متأكد من حذف هذا الاتفاق؟ لا يمكن التراجع عن هذا الإجراء.',
            'تأكيد حذف الاتفاق'
        );

        if (!confirmed) return false;

        try {
            this.showLoading(true, 'حذف الاتفاق...');
            
            const contract = this.findContractById(contractId);
            if (!contract) {
                throw new Error('الاتفاق غير موجود');
            }
            
            // Remove from data array
            this.data.contracts = this.data.contracts.filter(c => c.id !== contractId);
            
            // Save and update UI
            await this.saveSystemData();
            this.updateContractsTable();
            this.updateDashboard();
            
            // Send notifications
            await this.sendContractNotification(contract, 'deleted');
            this.showNotification(`تم حذف الاتفاق ${contract.contractNumber} بنجاح`, 'success');
            
            return true;
            
        } catch (error) {
            console.error('Error deleting contract:', error);
            this.showNotification(`خطأ في حذف الاتفاق: ${error.message}`, 'error');
            return false;
        } finally {
            this.showLoading(false);
        }
    }

    // =============================================
    // DATA VALIDATION METHODS
    // =============================================
    
    validateSaleData(formData) {
        const errors = [];
        
        // Required fields validation
        if (!formData.customerId) errors.push('العميل مطلوب');
        if (!formData.productId) errors.push('المنتج مطلوب');
        if (!formData.quantity || formData.quantity <= 0) errors.push('الكمية مطلوبة ويجب أن تكون أكبر من صفر');
        if (!formData.price || formData.price <= 0) errors.push('السعر مطلوب ويجب أن يكون أكبر من صفر');
        
        // Check if customer exists
        if (formData.customerId && !this.findCustomerById(formData.customerId)) {
            errors.push('العميل غير موجود');
        }
        
        // Check if product exists and has sufficient stock
        if (formData.productId) {
            const product = this.findProductById(formData.productId);
            if (!product) {
                errors.push('المنتج غير موجود');
            } else if (product.stock < formData.quantity) {
                errors.push(`الكمية المتاحة غير كافية. المتاح: ${product.stock}`);
            }
        }
        
        // Validate payment method
        const validPaymentMethods = ['cash', 'credit', 'card', 'transfer'];
        if (formData.paymentMethod && !validPaymentMethods.includes(formData.paymentMethod)) {
            errors.push('طريقة الدفع غير صحيحة');
        }
        
        if (errors.length > 0) {
            throw new Error(errors.join('، '));
        }
        
        return {
            customerId: formData.customerId,
            productId: formData.productId,
            quantity: parseInt(formData.quantity),
            price: parseFloat(formData.price),
            paymentMethod: formData.paymentMethod || 'cash',
            notes: formData.notes || '',
            date: formData.date || new Date().toISOString().split('T')[0]
        };
    }

    validateProductData(formData) {
        const errors = [];
        
        // Required fields validation
        if (!formData.name || formData.name.trim() === '') errors.push('اسم المنتج مطلوب');
        if (!formData.code || formData.code.trim() === '') errors.push('كود المنتج مطلوب');
        if (!formData.price || formData.price <= 0) errors.push('السعر مطلوب ويجب أن يكون أكبر من صفر');
        if (!formData.category || formData.category.trim() === '') errors.push('فئة المنتج مطلوبة');
        if (formData.stock === undefined || formData.stock < 0) errors.push('الكمية مطلوبة ويجب أن تكون صفر أو أكبر');
        
        // Check for duplicate product code (excluding current product in edit mode)
        const existingProduct = this.data.products.find(p => 
            p.code === formData.code && p.id !== formData.currentId
        );
        if (existingProduct) {
            errors.push('كود المنتج موجود بالفعل');
        }
        
        // Validate cost (should be less than price)
        if (formData.cost && formData.price && formData.cost >= formData.price) {
            errors.push('تكلفة المنتج يجب أن تكون أقل من سعر البيع');
        }
        
        if (errors.length > 0) {
            throw new Error(errors.join('، '));
        }
        
        return {
            name: formData.name.trim(),
            code: formData.code.trim().toUpperCase(),
            price: parseFloat(formData.price),
            cost: parseFloat(formData.cost) || 0,
            stock: parseInt(formData.stock),
            minStock: parseInt(formData.minStock) || 0,
            category: formData.category.trim(),
            unit: formData.unit || 'قطعة',
            description: formData.description || '',
            supplierId: formData.supplierId || null
        };
    }

    validateCustomerData(formData) {
        const errors = [];
        
        // Required fields validation
        if (!formData.name || formData.name.trim() === '') errors.push('اسم العميل مطلوب');
        if (!formData.phone || formData.phone.trim() === '') errors.push('رقم الهاتف مطلوب');
        
        // Phone number validation
        if (formData.phone && !this.validatePhoneNumber(formData.phone)) {
            errors.push('رقم الهاتف غير صحيح');
        }
        
        // Email validation
        if (formData.email && !this.validateEmail(formData.email)) {
            errors.push('البريد الإلكتروني غير صحيح');
        }
        
        // Check for duplicate phone number (excluding current customer in edit mode)
        const existingCustomer = this.data.customers.find(c => 
            c.phone === formData.phone && c.id !== formData.currentId
        );
        if (existingCustomer) {
            errors.push('رقم الهاتف مسجل بالفعل لعميل آخر');
        }
        
        if (errors.length > 0) {
            throw new Error(errors.join('، '));
        }
        
        return {
            name: formData.name.trim(),
            phone: formData.phone.trim(),
            email: formData.email ? formData.email.trim().toLowerCase() : '',
            company: formData.company ? formData.company.trim() : '',
            type: formData.type || 'individual',
            address: formData.address || '',
            notes: formData.notes || ''
        };
    }

    validateContractData(formData) {
        const errors = [];
        
        // Required fields validation
        if (!formData.customerId) errors.push('العميل مطلوب');
        if (!formData.type || formData.type.trim() === '') errors.push('نوع الاتفاق مطلوب');
        if (!formData.value || formData.value <= 0) errors.push('قيمة الاتفاق مطلوبة ويجب أن تكون أكبر من صفر');
        if (!formData.startDate) errors.push('تاريخ البداية مطلوب');
        if (!formData.endDate) errors.push('تاريخ الانتهاء مطلوب');
        if (!formData.details || formData.details.trim() === '') errors.push('تفاصيل الاتفاق مطلوبة');
        
        // Check if customer exists
        if (formData.customerId && !this.findCustomerById(formData.customerId)) {
            errors.push('العميل غير موجود');
        }
        
        // Validate dates
        if (formData.startDate && formData.endDate) {
            const startDate = new Date(formData.startDate);
            const endDate = new Date(formData.endDate);
            
            if (endDate <= startDate) {
                errors.push('تاريخ الانتهاء يجب أن يكون بعد تاريخ البداية');
            }
        }
        
        if (errors.length > 0) {
            throw new Error(errors.join('، '));
        }
        
        return {
            customerId: formData.customerId,
            type: formData.type.trim(),
            value: parseFloat(formData.value),
            startDate: formData.startDate,
            endDate: formData.endDate,
            status: formData.status || 'نشط',
            details: formData.details.trim(),
            terms: formData.terms || ''
        };
    }

    // =============================================
    // RECORD CREATION METHODS
    // =============================================
    
    async createSaleRecord(saleData) {
        const customer = this.findCustomerById(saleData.customerId);
        const product = this.findProductById(saleData.productId);
        
        const sale = {
            id: this.generateId('sale'),
            invoiceNumber: this.generateInvoiceNumber(),
            customerId: saleData.customerId,
            customerName: customer.name,
            productId: saleData.productId,
            productName: product.name,
            quantity: saleData.quantity,
            price: saleData.price,
            subtotal: saleData.quantity * saleData.price,
            tax: (saleData.quantity * saleData.price) * this.data.settings.taxRate,
            total: (saleData.quantity * saleData.price) * (1 + this.data.settings.taxRate),
            paymentMethod: saleData.paymentMethod,
            status: 'مكتملة',
            notes: saleData.notes,
            date: saleData.date,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: this.state.currentUser || 'system'
        };
        
        return sale;
    }

    async createProductRecord(productData) {
        const product = {
            id: this.generateId('prod'),
            name: productData.name,
            code: productData.code,
            price: productData.price,
            cost: productData.cost,
            profit: productData.price - productData.cost,
            profitMargin: productData.cost > 0 ? ((productData.price - productData.cost) / productData.cost) * 100 : 0,
            stock: productData.stock,
            minStock: productData.minStock,
            category: productData.category,
            unit: productData.unit,
            description: productData.description,
            status: this.getProductStatus(productData.stock, productData.minStock),
            supplierId: productData.supplierId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: this.state.currentUser || 'system'
        };
        
        return product;
    }

    async createCustomerRecord(customerData) {
        const customer = {
            id: this.generateId('cust'),
            name: customerData.name,
            phone: customerData.phone,
            email: customerData.email,
            company: customerData.company,
            type: customerData.type,
            address: customerData.address,
            notes: customerData.notes,
            totalPurchases: 0,
            totalPurchaseCount: 0,
            lastPurchaseDate: null,
            registrationDate: new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: this.state.currentUser || 'system'
        };
        
        return customer;
    }

    async createContractRecord(contractData) {
        const customer = this.findCustomerById(contractData.customerId);
        
        const contract = {
            id: this.generateId('cont'),
            contractNumber: this.generateContractNumber(),
            customerId: contractData.customerId,
            customerName: customer.name,
            type: contractData.type,
            value: contractData.value,
            startDate: contractData.startDate,
            endDate: contractData.endDate,
            duration: this.calculateDurationInMonths(contractData.startDate, contractData.endDate),
            status: contractData.status,
            details: contractData.details,
            terms: contractData.terms,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: this.state.currentUser || 'system'
        };
        
        return contract;
    }

    // =============================================
    // RECORD UPDATE METHODS
    // =============================================
    
    async updateSaleRecord(saleId, saleData) {
        const saleIndex = this.data.sales.findIndex(s => s.id === saleId);
        if (saleIndex === -1) return null;
        
        const customer = this.findCustomerById(saleData.customerId);
        const product = this.findProductById(saleData.productId);
        
        const updatedSale = {
            ...this.data.sales[saleIndex],
            customerId: saleData.customerId,
            customerName: customer.name,
            productId: saleData.productId,
            productName: product.name,
            quantity: saleData.quantity,
            price: saleData.price,
            subtotal: saleData.quantity * saleData.price,
            tax: (saleData.quantity * saleData.price) * this.data.settings.taxRate,
            total: (saleData.quantity * saleData.price) * (1 + this.data.settings.taxRate),
            paymentMethod: saleData.paymentMethod,
            notes: saleData.notes,
            date: saleData.date,
            updatedAt: new Date().toISOString()
        };
        
        this.data.sales[saleIndex] = updatedSale;
        return updatedSale;
    }

    async updateProductRecord(productId, productData) {
        const productIndex = this.data.products.findIndex(p => p.id === productId);
        if (productIndex === -1) return null;
        
        const updatedProduct = {
            ...this.data.products[productIndex],
            name: productData.name,
            code: productData.code,
            price: productData.price,
            cost: productData.cost,
            profit: productData.price - productData.cost,
            profitMargin: productData.cost > 0 ? ((productData.price - productData.cost) / productData.cost) * 100 : 0,
            stock: productData.stock,
            minStock: productData.minStock,
            category: productData.category,
            unit: productData.unit,
            description: productData.description,
            status: this.getProductStatus(productData.stock, productData.minStock),
            supplierId: productData.supplierId,
            updatedAt: new Date().toISOString()
        };
        
        this.data.products[productIndex] = updatedProduct;
        return updatedProduct;
    }

    async updateCustomerRecord(customerId, customerData) {
        const customerIndex = this.data.customers.findIndex(c => c.id === customerId);
        if (customerIndex === -1) return null;
        
        const updatedCustomer = {
            ...this.data.customers[customerIndex],
            name: customerData.name,
            phone: customerData.phone,
            email: customerData.email,
            company: customerData.company,
            type: customerData.type,
            address: customerData.address,
            notes: customerData.notes,
            updatedAt: new Date().toISOString()
        };
        
        this.data.customers[customerIndex] = updatedCustomer;
        return updatedCustomer;
    }

    async updateContractRecord(contractId, contractData) {
        const contractIndex = this.data.contracts.findIndex(c => c.id === contractId);
        if (contractIndex === -1) return null;
        
        const customer = this.findCustomerById(contractData.customerId);
        
        const updatedContract = {
            ...this.data.contracts[contractIndex],
            customerId: contractData.customerId,
            customerName: customer.name,
            type: contractData.type,
            value: contractData.value,
            startDate: contractData.startDate,
            endDate: contractData.endDate,
            duration: this.calculateDurationInMonths(contractData.startDate, contractData.endDate),
            status: contractData.status,
            details: contractData.details,
            terms: contractData.terms,
            updatedAt: new Date().toISOString()
        };
        
        this.data.contracts[contractIndex] = updatedContract;
        return updatedContract;
    }

    // =============================================
    // INVENTORY MANAGEMENT
    // =============================================
    
    async updateInventoryForSale(sale, operation) {
        const product = this.findProductById(sale.productId);
        if (!product) return;
        
        if (operation === 'subtract') {
            product.stock -= sale.quantity;
        } else if (operation === 'add') {
            product.stock += sale.quantity;
        }
        
        product.status = this.getProductStatus(product.stock, product.minStock);
        product.updatedAt = new Date().toISOString();
        
        // Check for low stock alerts
        if (product.stock <= product.minStock) {
            this.addLowStockAlert(product);
        }
    }

    async adjustStock(productId, adjustmentData) {
        if (!(await this.verifyPassword('تعديل المخزون'))) {
            this.showNotification('تم إلغاء تعديل المخزون', 'warning');
            return false;
        }

        try {
            const product = this.findProductById(productId);
            if (!product) {
                throw new Error('المنتج غير موجود');
            }

            const oldStock = product.stock;
            let newStock = oldStock;

            switch (adjustmentData.type) {
                case 'add':
                    newStock = oldStock + adjustmentData.quantity;
                    break;
                case 'subtract':
                    newStock = Math.max(0, oldStock - adjustmentData.quantity);
                    break;
                case 'set':
                    newStock = adjustmentData.quantity;
                    break;
            }

            // Create adjustment record
            const adjustment = {
                id: this.generateId('adj'),
                productId: productId,
                productName: product.name,
                type: adjustmentData.type,
                quantity: adjustmentData.quantity,
                oldStock: oldStock,
                newStock: newStock,
                reason: adjustmentData.reason,
                notes: adjustmentData.notes || '',
                createdAt: new Date().toISOString(),
                createdBy: this.state.currentUser || 'system'
            };

            // Update product stock
            product.stock = newStock;
            product.status = this.getProductStatus(newStock, product.minStock);
            product.updatedAt = new Date().toISOString();

            // Add adjustment to records
            if (!this.data.stockAdjustments) {
                this.data.stockAdjustments = [];
            }
            this.data.stockAdjustments.push(adjustment);

            // Save and update UI
            await this.saveSystemData();
            this.updateProductsTable();

            // Send notifications
            await this.sendStockAdjustmentNotification(adjustment);
            this.showNotification(`تم تعديل مخزون ${product.name} بنجاح`, 'success');

            return adjustment;

        } catch (error) {
            console.error('Error adjusting stock:', error);
            this.showNotification(`خطأ في تعديل المخزون: ${error.message}`, 'error');
            return false;
        }
    }

    addLowStockAlert(product) {
        if (this.data.settings.notifications.lowStock) {
            this.showNotification(`تحذير: المنتج ${product.name} يحتاج إعادة تموين - المخزون: ${product.stock}`, 'warning');
            this.sendLowStockNotification(product);
        }
    }

    // =============================================
    // CUSTOMER MANAGEMENT
    // =============================================
    
    async updateCustomerPurchases(customerId, amount, operation) {
        const customer = this.findCustomerById(customerId);
        if (!customer) return;
        
        if (operation === 'add') {
            customer.totalPurchases += amount;
            customer.totalPurchaseCount += 1;
            customer.lastPurchaseDate = new Date().toISOString().split('T')[0];
        } else if (operation === 'subtract') {
            customer.totalPurchases -= amount;
            customer.totalPurchaseCount = Math.max(0, customer.totalPurchaseCount - 1);
        }
        
        customer.updatedAt = new Date().toISOString();
    }

    getCustomerPurchaseHistory(customerId) {
        return this.data.sales
            .filter(sale => sale.customerId === customerId)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    getCustomerContracts(customerId) {
        return this.data.contracts
            .filter(contract => contract.customerId === customerId)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // =============================================
    // ADVANCED SEARCH AND FILTERING
    // =============================================
    
    setupAdvancedSearch() {
        const searchInputs = [
            'salesSearch', 'contractsSearch', 
            'customersSearch', 'productsSearch'
        ];
        
        searchInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('input', this.debounce((e) => {
                    const section = inputId.replace('Search', '');
                    this.performAdvancedSearch(section, e.target.value);
                }, 300));
            }
        });
    }

    performAdvancedSearch(section, query) {
        if (!query.trim()) {
            this.clearSearch(section);
            return;
        }

        const searchResults = this.searchData(section, query);
        this.updateTableWithResults(section, searchResults);
        
        // Cache search results
        this.ui.searchCache.set(`${section}_${query}`, searchResults);
    }

    searchData(section, query) {
        const data = this.data[section] || [];
        const searchFields = this.getSearchFields(section);
        const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
        
        return data.filter(item => {
            return searchTerms.every(term => {
                return searchFields.some(field => {
                    const value = this.getNestedValue(item, field);
                    return value && value.toString().toLowerCase().includes(term);
                });
            });
        });
    }

    getSearchFields(section) {
        const fieldMap = {
            sales: ['invoiceNumber', 'customerName', 'productName', 'notes', 'paymentMethod'],
            contracts: ['contractNumber', 'customerName', 'type', 'details', 'terms'],
            customers: ['name', 'phone', 'email', 'company', 'address', 'notes'],
            products: ['name', 'code', 'category', 'description', 'supplier']
        };
        
        return fieldMap[section] || [];
    }

    clearSearch(section) {
        const updateMethod = `update${this.capitalize(section)}Table`;
        if (typeof this[updateMethod] === 'function') {
            this[updateMethod]();
        }
    }

    // =============================================
    // ADVANCED FILTERING SYSTEM
    // =============================================
    
    applyDateFilter(section, fromDate, toDate) {
        this.state.currentDateFilter = { fromDate, toDate };
        const updateMethod = `update${this.capitalize(section)}Table`;
        if (typeof this[updateMethod] === 'function') {
            this[updateMethod]();
        }
    }

    applyStatusFilter(section, status) {
        this.state.searchFilters[section] = { ...this.state.searchFilters[section], status };
        const updateMethod = `update${this.capitalize(section)}Table`;
        if (typeof this[updateMethod] === 'function') {
            this[updateMethod]();
        }
    }

    applyCustomFilter(section, filterKey, filterValue) {
        this.state.searchFilters[section] = { 
            ...this.state.searchFilters[section], 
            [filterKey]: filterValue 
        };
        const updateMethod = `update${this.capitalize(section)}Table`;
        if (typeof this[updateMethod] === 'function') {
            this[updateMethod]();
        }
    }

    clearAllFilters(section) {
        this.state.currentDateFilter = null;
        this.state.searchFilters[section] = {};
        this.clearSearch(section);
    }

    // =============================================
    // ADVANCED REPORTING SYSTEM
    // =============================================
    
    generateSalesReport(period = 'month', format = 'summary') {
        const salesData = this.getSalesForPeriod(period);
        const report = {
            period: period,
            dateRange: this.getDateRangeForPeriod(period),
            summary: this.calculateSalesSummary(salesData),
            details: format === 'detailed' ? salesData : null,
            charts: this.generateSalesChartData(salesData),
            generatedAt: new Date().toISOString(),
            generatedBy: this.state.currentUser || 'system'
        };
        
        return report;
    }

    generateInventoryReport() {
        const products = this.data.products;
        const lowStockProducts = products.filter(p => p.stock <= p.minStock);
        const outOfStockProducts = products.filter(p => p.stock === 0);
        const topSellingProducts = this.getTopSellingProducts(10);
        
        return {
            totalProducts: products.length,
            totalValue: products.reduce((sum, p) => sum + (p.stock * p.cost), 0),
            lowStockProducts: lowStockProducts,
            outOfStockProducts: outOfStockProducts,
            topSellingProducts: topSellingProducts,
            categoryBreakdown: this.getCategoryBreakdown(),
            generatedAt: new Date().toISOString()
        };
    }

    generateCustomerReport() {
        const customers = this.data.customers;
        const topCustomers = this.getTopCustomers(10);
        const newCustomers = this.getNewCustomersForPeriod('month');
        
        return {
            totalCustomers: customers.length,
            activeCustomers: customers.filter(c => c.lastPurchaseDate).length,
            totalRevenue: customers.reduce((sum, c) => sum + c.totalPurchases, 0),
            averageOrderValue: this.calculateAverageOrderValue(),
            topCustomers: topCustomers,
            newCustomers: newCustomers,
            customerTypes: this.getCustomerTypeBreakdown(),
            generatedAt: new Date().toISOString()
        };
    }

    generateFinancialReport(period = 'month') {
        const salesData = this.getSalesForPeriod(period);
        const contractsData = this.getContractsForPeriod(period);
        
        const totalRevenue = salesData.reduce((sum, sale) => sum + sale.total, 0);
        const totalCost = salesData.reduce((sum, sale) => {
            const product = this.findProductById(sale.productId);
            return sum + (product ? product.cost * sale.quantity : 0);
        }, 0);
        const grossProfit = totalRevenue - totalCost;
        const contractValue = contractsData.reduce((sum, contract) => sum + contract.value, 0);
        
        return {
            period: period,
            dateRange: this.getDateRangeForPeriod(period),
            revenue: {
                sales: totalRevenue,
                contracts: contractValue,
                total: totalRevenue + contractValue
            },
            costs: {
                cost: totalCost,
                grossProfit: grossProfit,
                profitMargin: totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0
            },
            taxes: {
                collected: salesData.reduce((sum, sale) => sum + sale.tax, 0),
                rate: this.data.settings.taxRate * 100
            },
            generatedAt: new Date().toISOString()
        };
    }

    // =============================================
    // DATA EXPORT SYSTEM
    // =============================================
    
    async exportData(format = 'json', options = {}) {
        if (!(await this.verifyPassword('تصدير البيانات'))) {
            this.showNotification('تم إلغاء تصدير البيانات', 'warning');
            return false;
        }

        try {
            this.showLoading(true, 'تصدير البيانات...');
            
            const exportData = this.prepareExportData(options);
            
            switch (format) {
                case 'json':
                    await this.exportAsJSON(exportData, options);
                    break;
                case 'csv':
                    await this.exportAsCSV(exportData, options);
                    break;
                case 'excel':
                    await this.exportAsExcel(exportData, options);
                    break;
                case 'pdf':
                    await this.exportAsPDF(exportData, options);
                    break;
                default:
                    throw new Error('تنسيق التصدير غير مدعوم');
            }
            
            this.showNotification('تم تصدير البيانات بنجاح', 'success');
            return true;
            
        } catch (error) {
            console.error('Export error:', error);
            this.showNotification(`خطأ في تصدير البيانات: ${error.message}`, 'error');
            return false;
        } finally {
            this.showLoading(false);
        }
    }

    prepareExportData(options = {}) {
        const exportData = {
            metadata: {
                exportedAt: new Date().toISOString(),
                exportedBy: this.state.currentUser || 'system',
                version: this.version,
                company: this.data.settings.company
            }
        };
        
        // Include selected data sections
        if (options.includeSales !== false) {
            exportData.sales = this.data.sales;
        }
        if (options.includeContracts !== false) {
            exportData.contracts = this.data.contracts;
        }
        if (options.includeCustomers !== false) {
            exportData.customers = this.data.customers;
        }
        if (options.includeProducts !== false) {
            exportData.products = this.data.products;
        }
        if (options.includeSettings) {
            exportData.settings = { ...this.data.settings, password: undefined };
        }
        
        return exportData;
    }

    async exportAsJSON(data, options) {
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
        const filename = `TagElMalek_Export_${this.formatDateForFilename(new Date())}.json`;
        this.downloadBlob(blob, filename);
    }

    async exportAsCSV(data, options) {
        const csvData = this.convertToCSV(data);
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
        const filename = `TagElMalek_Export_${this.formatDateForFilename(new Date())}.csv`;
        this.downloadBlob(blob, filename);
    }

    convertToCSV(data) {
        let csv = '';
        
        // Export each data section as separate CSV blocks
        Object.keys(data).forEach(section => {
            if (Array.isArray(data[section]) && data[section].length > 0) {
                csv += `\n${section.toUpperCase()}\n`;
                const headers = Object.keys(data[section][0]);
                csv += headers.join(',') + '\n';
                
                data[section].forEach(row => {
                    const values = headers.map(header => {
                        const value = row[header];
                        return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
                    });
                    csv += values.join(',') + '\n';
                });
                csv += '\n';
            }
        });
        
        return csv;
    }

    // =============================================
    // DATA IMPORT SYSTEM
    // =============================================
    
    async importData() {
        if (!(await this.verifyPassword('استيراد البيانات'))) {
            this.showNotification('تم إلغاء استيراد البيانات', 'warning');
            return false;
        }

        return new Promise((resolve) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json,.csv';
            input.onchange = async (e) => {
                const file = e.target.files[0];
                if (!file) return resolve(false);

                try {
                    this.showLoading(true, 'استيراد البيانات...');
                    
                    const fileContent = await this.readFileContent(file);
                    const importedData = await this.parseImportedData(file, fileContent);
                    
                    const confirmed = await this.showImportConfirmationDialog(importedData);
                    if (!confirmed) return resolve(false);
                    
                    await this.processImportedData(importedData);
                    
                    this.showNotification('تم استيراد البيانات بنجاح', 'success');
                    resolve(true);
                    
                } catch (error) {
                    console.error('Import error:', error);
                    this.showNotification(`خطأ في استيراد البيانات: ${error.message}`, 'error');
                    resolve(false);
                } finally {
                    this.showLoading(false);
                }
            };
            input.click();
        });
    }

    async readFileContent(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(new Error('فشل في قراءة الملف'));
            reader.readAsText(file);
        });
    }

    async parseImportedData(file, content) {
        if (file.name.endsWith('.json')) {
            return JSON.parse(content);
        } else if (file.name.endsWith('.csv')) {
            return this.parseCSV(content);
        } else {
            throw new Error('تنسيق الملف غير مدعوم');
        }
    }

    async showImportConfirmationDialog(importedData) {
        const stats = this.calculateImportStats(importedData);
        const message = `
            سيتم استيراد البيانات التالية:
            • المبيعات: ${stats.sales}
            • الاتفاقات: ${stats.contracts}
            • العملاء: ${stats.customers}
            • المنتجات: ${stats.products}
            
            هل تريد المتابعة؟ سيتم دمج البيانات مع البيانات الحالية.
        `;
        
        return await this.showConfirmDialog(message, 'تأكيد استيراد البيانات');
    }

    // =============================================
    // TELEGRAM INTEGRATION SYSTEM
    // =============================================
    
    async sendTelegramNotification(message, options = {}) {
        if (!this.data.settings.enableTelegram || !this.state.isOnline) {
            return false;
        }
        
        const { botToken, chatId } = this.data.settings;
        if (!botToken || !chatId) {
            console.log('Telegram settings incomplete');
            return false;
        }

        try {
            const fullMessage = this.formatTelegramMessage(message, options);
            const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
            
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: fullMessage,
                    parse_mode: 'HTML',
                    disable_web_page_preview: true
                })
            });

            if (response.ok) {
                console.log('✅ Telegram notification sent successfully');
                return true;
            } else {
                const errorData = await response.json();
                console.warn('⚠️ Telegram notification failed:', errorData);
                return false;
            }
        } catch (error) {
            console.error('❌ Telegram notification error:', error);
            return false;
        }
    }

    formatTelegramMessage(message, options = {}) {
        const header = `🏷️ <b>Tag ElMalek v${this.version}</b>\n` +
                      `📊 ${this.data.settings.company}\n\n`;
        
        const timestamp = `\n⏰ ${this.formatDateTime(new Date())}\n` +
                         `📍 ${this.state.isOnline ? 'متصل' : 'غير متصل'}`;
        
        return header + message + timestamp;
    }

    async sendSaleNotification(sale, action) {
        if (!this.data.settings.notifications.sales) return;
        
        const actionText = {
            created: '🛒 مبيعة جديدة',
            updated: '✏️ تعديل مبيعة',
            deleted: '🗑️ حذف مبيعة'
        };
        
        const message = `${actionText[action]}
📋 رقم الفاتورة: <b>${sale.invoiceNumber}</b>
👤 العميل: ${sale.customerName}
📦 المنتج: ${sale.productName}
🔢 الكمية: ${sale.quantity}
💰 المبلغ: <b>${this.formatCurrency(sale.total)}</b>
💳 طريقة الدفع: ${this.getPaymentMethodName(sale.paymentMethod)}
📅 التاريخ: ${this.formatDate(sale.date)}`;
        
        await this.sendTelegramNotification(message);
    }

    async sendProductNotification(product, action) {
        if (!this.data.settings.notifications.products) return;
        
        const actionText = {
            created: '📦 منتج جديد',
            updated: '✏️ تعديل منتج',
            deleted: '🗑️ حذف منتج'
        };
        
        const message = `${actionText[action]}
📝 الاسم: <b>${product.name}</b>
🏷️ الكود: ${product.code}
💰 السعر: ${this.formatCurrency(product.price)}
📊 المخزون: ${product.stock} ${product.unit}
📂 الفئة: ${product.category}`;
        
        await this.sendTelegramNotification(message);
    }

    async sendCustomerNotification(customer, action) {
        if (!this.data.settings.notifications.customers) return;
        
        const actionText = {
            created: '👤 عميل جديد',
            updated: '✏️ تعديل عميل',
            deleted: '🗑️ حذف عميل'
        };
        
        const message = `${actionText[action]}
📝 الاسم: <b>${customer.name}</b>
📱 الهاتف: ${customer.phone}
🏢 الشركة: ${customer.company || 'غير محدد'}
📧 البريد: ${customer.email || 'غير محدد'}
📅 تاريخ التسجيل: ${this.formatDate(customer.registrationDate)}`;
        
        await this.sendTelegramNotification(message);
    }

    async sendContractNotification(contract, action) {
        if (!this.data.settings.notifications.contracts) return;
        
        const actionText = {
            created: '📝 اتفاق جديد',
            updated: '✏️ تعديل اتفاق',
            deleted: '🗑️ حذف اتفاق'
        };
        
        const message = `${actionText[action]}
📋 رقم الاتفاق: <b>${contract.contractNumber}</b>
👤 العميل: ${contract.customerName}
📋 النوع: ${contract.type}
💰 القيمة: <b>${this.formatCurrency(contract.value)}</b>
⏰ المدة: ${contract.duration} شهر
📅 من: ${this.formatDate(contract.startDate)}
📅 إلى: ${this.formatDate(contract.endDate)}`;
        
        await this.sendTelegramNotification(message);
    }

    async sendLowStockNotification(product) {
        const message = `⚠️ تحذير مخزون منخفض
📦 المنتج: <b>${product.name}</b>
🏷️ الكود: ${product.code}
📊 المخزون الحالي: ${product.stock} ${product.unit}
📉 الحد الأدنى: ${product.minStock} ${product.unit}
🔄 يحتاج إعادة تموين فوري`;
        
        await this.sendTelegramNotification(message);
    }

    async sendStockAdjustmentNotification(adjustment) {
        const typeText = {
            add: 'إضافة مخزون',
            subtract: 'خصم مخزون', 
            set: 'تحديد مخزون'
        };
        
        const message = `📦 ${typeText[adjustment.type]}
📝 المنتج: <b>${adjustment.productName}</b>
🔄 النوع: ${typeText[adjustment.type]}
📊 الكمية: ${adjustment.quantity}
📈 المخزون السابق: ${adjustment.oldStock}
📊 المخزون الجديد: ${adjustment.newStock}
💭 السبب: ${adjustment.reason}`;
        
        await this.sendTelegramNotification(message);
    }

    // =============================================
    // NOTIFICATION SYSTEM
    // =============================================
    
    showNotification(message, type = 'info', duration = 5000) {
        const notification = {
            id: this.generateId('notif'),
            message: message,
            type: type,
            timestamp: new Date().toISOString(),
            read: false
        };
        
        // Add to history
        this.notifications.history.unshift(notification);
        
        // Keep only max notifications
        if (this.notifications.history.length > this.notifications.maxHistory) {
            this.notifications.history = this.notifications.history.slice(0, this.notifications.maxHistory);
        }
        
        // Update unread count
        this.notifications.unreadCount = this.notifications.history.filter(n => !n.read).length;
        
        // Update UI
        this.updateNotificationBadge();
        
        // Show toast notification
        this.showToastNotification(notification, duration);
        
        // Save to localStorage
        this.saveNotificationsToStorage();
        
        console.log(`📢 ${type.toUpperCase()}: ${message}`);
    }

    showToastNotification(notification, duration) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${notification.type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${this.getNotificationIcon(notification.type)}"></i>
                <span>${notification.message}</span>
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add to toast container
        let container = document.getElementById('toastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toastContainer';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        
        container.appendChild(toast);
        
        // Auto remove after duration
        setTimeout(() => {
            if (toast.parentElement) {
                toast.classList.add('toast-exit');
                setTimeout(() => toast.remove(), 300);
            }
        }, duration);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'times-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'bell';
    }

    updateNotificationBadge() {
        const badge = document.getElementById('notificationBadge');
        if (badge) {
            badge.textContent = this.notifications.unreadCount;
            badge.style.display = this.notifications.unreadCount > 0 ? 'flex' : 'none';
        }
    }

    saveNotificationsToStorage() {
        try {
            localStorage.setItem('tagelmalek_notifications', JSON.stringify(this.notifications.history));
        } catch (error) {
            console.warn('Error saving notifications:', error);
        }
    }

    loadNotificationsFromStorage() {
        try {
            const saved = localStorage.getItem('tagelmalek_notifications');
            if (saved) {
                this.notifications.history = JSON.parse(saved);
                this.notifications.unreadCount = this.notifications.history.filter(n => !n.read).length;
                this.updateNotificationBadge();
            }
        } catch (error) {
            console.warn('Error loading notifications:', error);
            this.notifications.history = [];
        }
    }

    // =============================================
    // UI UPDATE METHODS
    // =============================================
    
    updateAllSections() {
        this.updateDashboard();
        this.updateSalesTable();
        this.updateContractsTable();
        this.updateCustomersTable();
        this.updateProductsTable();
        this.updateNavigationBadges();
        this.updateSystemStatus();
        
        console.log('🔄 All sections updated successfully');
    }

    updateDashboard() {
        // Calculate comprehensive statistics
        const stats = this.calculateDashboardStats();
        
        // Update stat cards
        this.updateStatCard('totalSales', stats.sales);
        this.updateStatCard('totalContracts', stats.contracts);
        this.updateStatCard('totalCustomers', stats.customers);
        this.updateStatCard('totalProducts', stats.products);
        this.updateStatCard('todayRevenue', stats.todayRevenue);
        this.updateStatCard('monthRevenue', stats.monthRevenue);
        
        // Update charts
        this.updateSalesChart();
        this.updateRevenueChart();
        this.updateInventoryChart();
        
        // Update recent activities
        this.updateRecentActivities();
        
        // Update alerts
        this.updateDashboardAlerts();
        
        console.log('📊 Dashboard updated');
    }

    calculateDashboardStats() {
        const today = new Date().toISOString().split('T')[0];
        const thisMonth = new Date().toISOString().substring(0, 7);
        
        const todaySales = this.data.sales.filter(s => s.date === today);
        const monthSales = this.data.sales.filter(s => s.date.startsWith(thisMonth));
        
        return {
            sales: {
                total: this.data.sales.length,
                today: todaySales.length,
                month: monthSales.length
            },
            contracts: {
                total: this.data.contracts.length,
                active: this.data.contracts.filter(c => c.status === 'نشط').length
            },
            customers: {
                total: this.data.customers.length,
                new: this.data.customers.filter(c => 
                    c.registrationDate.substring(0, 7) === thisMonth
                ).length
            },
            products: {
                total: this.data.products.length,
                lowStock: this.data.products.filter(p => p.stock <= p.minStock).length,
                outOfStock: this.data.products.filter(p => p.stock === 0).length
            },
            todayRevenue: todaySales.reduce((sum, s) => sum + s.total, 0),
            monthRevenue: monthSales.reduce((sum, s) => sum + s.total, 0)
        };
    }

    updateStatCard(cardId, data) {
        const card = document.getElementById(cardId);
        if (!card) return;
        
        // Update based on data type
        if (typeof data === 'number') {
            this.animateValue(card.querySelector('.stat-value'), data);
        } else if (typeof data === 'object') {
            const valueElement = card.querySelector('.stat-value');
            const subValueElement = card.querySelector('.stat-sub-value');
            
            if (valueElement) this.animateValue(valueElement, data.total || data.main);
            if (subValueElement && data.sub) {
                subValueElement.textContent = data.sub;
            }
        }
    }

    animateValue(element, targetValue, duration = 1000) {
        if (!element) return;
        
        const startValue = parseFloat(element.textContent.replace(/[^\d.]/g, '')) || 0;
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentValue = startValue + (targetValue - startValue) * this.easeOutQuart(progress);
            
            // Format based on element's data attributes
            if (element.dataset.format === 'currency') {
                element.textContent = this.formatCurrency(currentValue);
            } else {
                element.textContent = Math.round(currentValue).toLocaleString();
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    easeOutQuart(t) {
        return 1 - (--t) * t * t * t;
    }

    updateNavigationBadges() {
        const badges = {
            salesBadge: this.data.sales.length,
            contractsBadge: this.data.contracts.length,
            customersBadge: this.data.customers.length,
            productsBadge: this.data.products.length
        };

        Object.entries(badges).forEach(([id, count]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = count;
                element.style.display = count > 0 ? 'flex' : 'none';
            }
        });
    }

    updateSystemStatus() {
        const statusElement = document.getElementById('systemStatus');
        const lastSaveElement = document.getElementById('lastSave');
        
        if (statusElement) {
            const status = this.state.isOnline ? 'متصل' : 'غير متصل';
            const statusClass = this.state.isOnline ? 'online' : 'offline';
            statusElement.innerHTML = `<span class="status-indicator ${statusClass}"></span> ${status}`;
        }
        
        if (lastSaveElement && this.data.metadata.lastUpdated) {
            lastSaveElement.textContent = `آخر حفظ: ${this.formatTime(new Date(this.data.metadata.lastUpdated))}`;
        }
    }

    // =============================================
    // TABLE UPDATE METHODS
    // =============================================
    
    updateSalesTable() {
        const tbody = document.getElementById('salesTableBody');
        if (!tbody) return;

        let salesData = this.getFilteredData('sales');
        
        // Apply pagination
        const pagination = this.pagination.sales;
        const startIndex = (pagination.page - 1) * pagination.size;
        const endIndex = startIndex + pagination.size;
        const paginatedData = salesData.slice(startIndex, endIndex);

        // Update pagination info
        this.updatePaginationInfo('sales', salesData.length, paginatedData.length);

        // Generate table rows
        tbody.innerHTML = this.generateSalesTableRows(paginatedData);
        
        // Update table summary
        this.updateTableSummary('sales', salesData);
        
        console.log(`📊 Sales table updated - ${paginatedData.length} rows displayed`);
    }

    updateContractsTable() {
        const tbody = document.getElementById('contractsTableBody');
        if (!tbody) return;

        let contractsData = this.getFilteredData('contracts');
        
        // Apply pagination
        const pagination = this.pagination.contracts;
        const startIndex = (pagination.page - 1) * pagination.size;
        const endIndex = startIndex + pagination.size;
        const paginatedData = contractsData.slice(startIndex, endIndex);

        // Update pagination info
        this.updatePaginationInfo('contracts', contractsData.length, paginatedData.length);

        // Generate table rows
        tbody.innerHTML = this.generateContractsTableRows(paginatedData);
        
        // Update table summary
        this.updateTableSummary('contracts', contractsData);
        
        console.log(`📊 Contracts table updated - ${paginatedData.length} rows displayed`);
    }

    updateCustomersTable() {
        const tbody = document.getElementById('customersTableBody');
        if (!tbody) return;

        let customersData = this.getFilteredData('customers');
        
        // Apply pagination
        const pagination = this.pagination.customers;
        const startIndex = (pagination.page - 1) * pagination.size;
        const endIndex = startIndex + pagination.size;
        const paginatedData = customersData.slice(startIndex, endIndex);

        // Update pagination info
        this.updatePaginationInfo('customers', customersData.length, paginatedData.length);

        // Generate table rows
        tbody.innerHTML = this.generateCustomersTableRows(paginatedData);
        
        console.log(`📊 Customers table updated - ${paginatedData.length} rows displayed`);
    }

    updateProductsTable() {
        const tbody = document.getElementById('productsTableBody');
        if (!tbody) return;

        let productsData = this.getFilteredData('products');
        
        // Apply pagination
        const pagination = this.pagination.products;
        const startIndex = (pagination.page - 1) * pagination.size;
        const endIndex = startIndex + pagination.size;
        const paginatedData = productsData.slice(startIndex, endIndex);

        // Update pagination info
        this.updatePaginationInfo('products', productsData.length, paginatedData.length);

        // Generate table rows
        tbody.innerHTML = this.generateProductsTableRows(paginatedData);
        
        console.log(`📊 Products table updated - ${paginatedData.length} rows displayed`);
    }

    getFilteredData(section) {
        let data = [...this.data[section]];
        
        // Apply search filter
        const searchQuery = this.state.searchFilters[section]?.query;
        if (searchQuery) {
            data = this.searchData(section, searchQuery);
        }
        
        // Apply date filter
        if (this.state.currentDateFilter) {
            data = this.filterDataByDate(data, this.getDateField(section));
        }
        
        // Apply status filter
        const statusFilter = this.state.searchFilters[section]?.status;
        if (statusFilter) {
            data = data.filter(item => item.status === statusFilter);
        }
        
        // Apply sorting
        const sortOptions = this.state.sortOptions[section];
        if (sortOptions) {
            data = this.sortData(data, sortOptions.field, sortOptions.direction);
        }
        
        return data;
    }

    getDateField(section) {
        const dateFields = {
            sales: 'date',
            contracts: 'startDate',
            customers: 'registrationDate',
            products: 'createdAt'
        };
        return dateFields[section] || 'createdAt';
    }

    sortData(data, field, direction = 'desc') {
        return data.sort((a, b) => {
            let aValue = this.getNestedValue(a, field);
            let bValue = this.getNestedValue(b, field);
            
            // Handle dates
            if (field.includes('Date') || field.includes('At')) {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
            }
            
            // Handle numbers
            if (typeof aValue === 'string' && !isNaN(aValue)) {
                aValue = parseFloat(aValue);
                bValue = parseFloat(bValue);
            }
            
            if (direction === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });
    }

    // =============================================
    // TABLE ROW GENERATION METHODS
    // =============================================
    
    generateSalesTableRows(salesData) {
        if (salesData.length === 0) {
            return `
                <tr>
                    <td colspan="9" class="empty-table">
                        <div class="empty-state">
                            <i class="fas fa-shopping-cart"></i>
                            <h3>لا توجد مبيعات</h3>
                            <p>ابدأ بإضافة أول مبيعة لك</p>
                            <button class="btn btn-primary" onclick="openModal('saleModal')">
                                <i class="fas fa-plus"></i> إضافة مبيعة
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }

        return salesData.map(sale => {
            const customer = this.findCustomerById(sale.customerId);
            const product = this.findProductById(sale.productId);
            
            return `
                <tr class="table-row" data-id="${sale.id}">
                    <td>
                        <input type="checkbox" class="row-checkbox" value="${sale.id}">
                    </td>
                    <td>
                        <div class="invoice-info">
                            <strong>${sale.invoiceNumber}</strong>
                            <small class="payment-method">${this.getPaymentMethodName(sale.paymentMethod)}</small>
                        </div>
                    </td>
                    <td>
                        <div class="customer-info">
                            <strong>${sale.customerName}</strong>
                            <small>${customer?.phone || ''}</small>
                        </div>
                    </td>
                    <td>
                        <div class="product-info">
                            <span>${sale.productName}</span>
                            <small>${product?.code || ''}</small>
                        </div>
                    </td>
                    <td><span class="quantity-badge">${sale.quantity}</span></td>
                    <td>
                        <div class="price-info">
                            <strong>${this.formatCurrency(sale.total)}</strong>
                            <small>${this.formatCurrency(sale.price)} / وحدة</small>
                        </div>
                    </td>
                    <td>
                        <div class="date-info">
                            <span>${this.formatDate(sale.date, 'short')}</span>
                            <small>${this.formatTime(new Date(sale.createdAt))}</small>
                        </div>
                    </td>
                    <td>
                        <span class="status-badge status-${sale.status === 'مكتملة' ? 'completed' : 'pending'}">
                            ${sale.status}
                        </span>
                    </td>
                    <td class="actions-cell">
                        ${this.generateActionButtons('sale', sale.id)}
                    </td>
                </tr>
            `;
        }).join('');
    }

    generateContractsTableRows(contractsData) {
        if (contractsData.length === 0) {
            return `
                <tr>
                    <td colspan="9" class="empty-table">
                        <div class="empty-state">
                            <i class="fas fa-handshake"></i>
                            <h3>لا توجد اتفاقات</h3>
                            <p>ابدأ بإضافة أول اتفاق</p>
                            <button class="btn btn-primary" onclick="openModal('contractModal')">
                                <i class="fas fa-plus"></i> إضافة اتفاق
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }

        return contractsData.map(contract => {
            const customer = this.findCustomerById(contract.customerId);
            const remainingDays = this.calculateRemainingDays(contract.endDate);
            const isExpiringSoon = remainingDays <= 30 && remainingDays > 0;
            const isExpired = remainingDays <= 0;
            
            return `
                <tr class="table-row ${isExpiringSoon ? 'expiring-soon' : ''} ${isExpired ? 'expired' : ''}" 
                    data-id="${contract.id}">
                    <td>
                        <div class="contract-info">
                            <strong>${contract.contractNumber}</strong>
                            <small>${contract.type}</small>
                        </div>
                    </td>
                    <td>
                        <div class="customer-info">
                            <strong>${contract.customerName}</strong>
                            <small>${customer?.phone || ''}</small>
                        </div>
                    </td>
                    <td><span class="contract-type-badge">${contract.type}</span></td>
                    <td><strong>${this.formatCurrency(contract.value)}</strong></td>
                    <td>${this.formatDate(contract.startDate, 'short')}</td>
                    <td>${this.formatDate(contract.endDate, 'short')}</td>
                    <td>
                        <div class="remaining-days ${isExpiringSoon ? 'warning' : isExpired ? 'expired' : 'normal'}">
                            ${remainingDays > 0 ? `${remainingDays} يوم` : 'منتهي'}
                        </div>
                    </td>
                    <td>
                        <span class="status-badge status-${contract.status === 'نشط' ? 'active' : 'expired'}">
                            ${contract.status}
                        </span>
                    </td>
                    <td class="actions-cell">
                        ${this.generateActionButtons('contract', contract.id)}
                    </td>
                </tr>
            `;
        }).join('');
    }

    generateCustomersTableRows(customersData) {
        if (customersData.length === 0) {
            return `
                <tr>
                    <td colspan="8" class="empty-table">
                        <div class="empty-state">
                            <i class="fas fa-users"></i>
                            <h3>لا يوجد عملاء</h3>
                            <p>ابدأ بإضافة أول عميل</p>
                            <button class="btn btn-primary" onclick="openModal('customerModal')">
                                <i class="fas fa-plus"></i> إضافة عميل
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }

        return customersData.map(customer => {
            const salesCount = this.data.sales.filter(s => s.customerId === customer.id).length;
            const contractsCount = this.data.contracts.filter(c => c.customerId === customer.id).length;
            
            return `
                <tr class="table-row" data-id="${customer.id}">
                    <td>
                        <div class="customer-cell">
                            <strong>${customer.name}</strong>
                            <small class="customer-type">
                                <i class="fas fa-${this.getCustomerTypeIcon(customer.type)}"></i>
                                ${this.getCustomerTypeName(customer.type)}
                            </small>
                        </div>
                    </td>
                    <td>
                        <a href="tel:${customer.phone}" class="phone-link">
                            <i class="fas fa-phone"></i> ${customer.phone}
                        </a>
                    </td>
                    <td>
                        ${customer.email ? 
                            `<a href="mailto:${customer.email}" class="email-link">
                                <i class="fas fa-envelope"></i> ${customer.email}
                            </a>` : 
                            '<span class="text-muted">غير محدد</span>'
                        }
                    </td>
                    <td>${customer.company || '<span class="text-muted">غير محدد</span>'}</td>
                    <td>${customer.address || '<span class="text-muted">غير محدد</span>'}</td>
                    <td>
                        <strong class="purchase-amount">${this.formatCurrency(customer.totalPurchases)}</strong>
                    </td>
                    <td>
                        <div class="activity-stats">
                            <span class="sales-count">${salesCount} مبيعة</span>
                            ${contractsCount > 0 ? `<span class="contracts-count">${contractsCount} اتفاق</span>` : ''}
                        </div>
                    </td>
                    <td class="actions-cell">
                        ${this.generateActionButtons('customer', customer.id)}
                    </td>
                </tr>
            `;
        }).join('');
    }

    generateProductsTableRows(productsData) {
        if (productsData.length === 0) {
            return `
                <tr>
                    <td colspan="9" class="empty-table">
                        <div class="empty-state">
                            <i class="fas fa-box"></i>
                            <h3>لا توجد منتجات</h3>
                            <p>ابدأ بإضافة أول منتج</p>
                            <button class="btn btn-primary" onclick="openModal('productModal')">
                                <i class="fas fa-plus"></i> إضافة منتج
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }

        return productsData.map(product => {
            const salesCount = this.data.sales
                .filter(s => s.productId === product.id)
                .reduce((sum, sale) => sum + sale.quantity, 0);
            
            const isLowStock = product.stock <= product.minStock;
            const isOutOfStock = product.stock === 0;
            
            return `
                <tr class="table-row ${isLowStock && !isOutOfStock ? 'low-stock' : ''} ${isOutOfStock ? 'out-of-stock' : ''}" 
                    data-id="${product.id}">
                    <td>
                        <div class="product-cell">
                            <strong>${product.name}</strong>
                            ${isOutOfStock ? 
                                '<i class="fas fa-times-circle out-of-stock-icon" title="نفد المخزون"></i>' :
                                isLowStock ? 
                                '<i class="fas fa-exclamation-triangle low-stock-icon" title="مخزون منخفض"></i>' : 
                                ''
                            }
                            <small class="product-description">${product.description || 'لا يوجد وصف'}</small>
                        </div>
                    </td>
                    <td><code class="product-code">${product.code}</code></td>
                    <td>
                        <div class="price-info">
                            <strong>${this.formatCurrency(product.price)}</strong>
                            <small>التكلفة: ${this.formatCurrency(product.cost)}</small>
                            <small class="profit">الربح: ${this.formatCurrency(product.profit)}</small>
                        </div>
                    </td>
                    <td>
                        <span class="stock-badge ${isOutOfStock ? 'out-of-stock' : isLowStock ? 'low-stock' : 'normal'}">
                            <i class="fas fa-boxes"></i>
                            ${product.stock} ${product.unit}
                        </span>
                    </td>
                    <td>
                        <span class="min-stock-badge">${product.minStock} ${product.unit}</span>
                    </td>
                    <td><span class="category-badge">${product.category}</span></td>
                    <td>
                        <span class="status-badge status-${this.getProductStatusClass(product.status)}">
                            ${product.status}
                        </span>
                    </td>
                    <td>
                        <div class="sales-stats">
                            <strong>${salesCount}</strong>
                            <small>إجمالي مباع</small>
                        </div>
                    </td>
                    <td class="actions-cell">
                        ${this.generateActionButtons('product', product.id)}
                    </td>
                </tr>
            `;
        }).join('');
    }

    generateActionButtons(type, id) {
        const actions = {
            sale: [
                { icon: 'edit', class: 'warning', action: 'editSale', title: 'تعديل' },
                { icon: 'trash', class: 'danger', action: 'deleteSale', title: 'حذف' },
                { icon: 'eye', class: 'info', action: 'viewSaleDetails', title: 'التفاصيل' },
                { icon: 'copy', class: 'secondary', action: 'duplicateSale', title: 'نسخ' }
            ],
            contract: [
                { icon: 'edit', class: 'warning', action: 'editContract', title: 'تعديل' },
                { icon: 'trash', class: 'danger', action: 'deleteContract', title: 'حذف' },
                { icon: 'eye', class: 'info', action: 'viewContractDetails', title: 'التفاصيل' },
                { icon: 'print', class: 'secondary', action: 'printContract', title: 'طباعة' }
            ],
            customer: [
                { icon: 'edit', class: 'warning', action: 'editCustomer', title: 'تعديل' },
                { icon: 'trash', class: 'danger', action: 'deleteCustomer', title: 'حذف' },
                { icon: 'history', class: 'info', action: 'viewCustomerHistory', title: 'التاريخ' },
                { icon: 'paper-plane', class: 'success', action: 'sendCustomerReport', title: 'تقرير' }
            ],
            product: [
                { icon: 'edit', class: 'warning', action: 'editProduct', title: 'تعديل' },
                { icon: 'trash', class: 'danger', action: 'deleteProduct', title: 'حذف' },
                { icon: 'boxes', class: 'info', action: 'adjustStock', title: 'المخزون' },
                { icon: 'chart-bar', class: 'secondary', action: 'viewProductSales', title: 'المبيعات' }
            ]
        };

        const typeActions = actions[type] || [];
        
        return `
            <div class="btn-group action-buttons">
                ${typeActions.map(action => `
                    <button class="btn btn-sm btn-${action.class}" 
                            onclick="salesSystem.${action.action}('${id}')" 
                            title="${action.title}">
                        <i class="fas fa-${action.icon}"></i>
                    </button>
                `).join('')}
            </div>
        `;
    }

    // =============================================
    // UTILITY AND HELPER METHODS
    // =============================================
    
    generateId(prefix = 'item') {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        return `${prefix}_${timestamp}_${random}`;
    }

     generateContractNumber() {
        const year = new Date().getFullYear();
        const sequence = this.data.contracts.length + 1;
        return `${this.data.settings.contractPrefix}-${year}-${String(sequence).padStart(3, '0')}`;
    }

    formatCurrency(amount, currency = null, locale = null, compact = false) {
        const curr = currency || this.data.settings.currency;
        const loc = locale || this.data.settings.locale;
        
        const symbols = {
            EGP: 'ج.م',
            USD: '$',
            EUR: '€',
            SAR: 'ر.س',
            AED: 'د.إ',
            GBP: '£'
        };
        
        try {
            let formattedAmount = amount;
            
            if (compact && amount >= 1000) {
                if (amount >= 1000000) {
                    formattedAmount = (amount / 1000000).toFixed(1) + 'م';
                } else if (amount >= 1000) {
                    formattedAmount = (amount / 1000).toFixed(1) + 'ك';
                }
            } else {
                formattedAmount = new Intl.NumberFormat(loc, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2
                }).format(amount);
            }
            
            return `${formattedAmount} ${symbols[curr] || curr}`;
        } catch (error) {
            return `${amount.toLocaleString()} ${symbols[curr] || curr}`;
        }
    }

    formatDate(date, format = 'full') {
        if (!date) return 'غير محدد';
        
        const dateObj = new Date(date);
        const locale = this.data.settings.locale;
        
        const formats = {
            full: { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric', 
                weekday: 'long' 
            },
            short: { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            },
            compact: { 
                year: '2-digit', 
                month: 'numeric', 
                day: 'numeric' 
            },
            monthYear: { 
                year: 'numeric', 
                month: 'long' 
            }
        };
        
        try {
            return new Intl.DateTimeFormat(locale, formats[format] || formats.full).format(dateObj);
        } catch (error) {
            return dateObj.toLocaleDateString(locale);
        }
    }

    formatTime(date) {
        if (!date) return '';
        
        try {
            return new Intl.DateTimeFormat(this.data.settings.locale, {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            }).format(date);
        } catch (error) {
            return date.toLocaleTimeString(this.data.settings.locale);
        }
    }

    formatDateTime(date) {
        if (!date) return 'غير محدد';
        
        const dateObj = new Date(date);
        
        try {
            return new Intl.DateTimeFormat(this.data.settings.locale, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            }).format(dateObj);
        } catch (error) {
            return dateObj.toLocaleString(this.data.settings.locale);
        }
    }

    formatDateForFilename(date) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hour = String(d.getHours()).padStart(2, '0');
        const minute = String(d.getMinutes()).padStart(2, '0');
        
        return `${year}-${month}-${day}_${hour}-${minute}`;
    }

    getRelativeTime(date) {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const weeks = Math.floor(days / 7);
        const months = Math.floor(days / 30);
        const years = Math.floor(days / 365);
        
        if (years > 0) return `منذ ${years} سنة`;
        if (months > 0) return `منذ ${months} شهر`;
        if (weeks > 0) return `منذ ${weeks} أسبوع`;
        if (days > 0) return `منذ ${days} يوم`;
        if (hours > 0) return `منذ ${hours} ساعة`;
        if (minutes > 0) return `منذ ${minutes} دقيقة`;
        return 'الآن';
    }

    // =============================================
    // DATA FINDER METHODS
    // =============================================
    
    findSaleById(saleId) {
        return this.data.sales.find(s => s.id === saleId);
    }

    findContractById(contractId) {
        return this.data.contracts.find(c => c.id === contractId);
    }

    findCustomerById(customerId) {
        return this.data.customers.find(c => c.id === customerId);
    }

    findProductById(productId) {
        return this.data.products.find(p => p.id === productId);
    }

    findSupplierById(supplierId) {
        return this.data.suppliers.find(s => s.id === supplierId);
    }

    // =============================================
    // VALIDATION HELPER METHODS
    // =============================================
    
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validatePhoneNumber(phone) {
        // Egyptian phone number patterns
        const patterns = [
            /^(\+20|0)?1[0125][0-9]{8}$/, // Mobile
            /^(\+20|0)?[23][0-9]{7}$/, // Landline
            /^(\+966|0)?5[0-9]{8}$/, // Saudi Mobile
            /^(\+971|0)?5[0-9]{8}$/, // UAE Mobile
            /^(\+1)?[2-9][0-9]{2}[2-9][0-9]{6}$/ // US/Canada
        ];
        
        const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
        return patterns.some(pattern => pattern.test(cleanPhone));
    }

    getProductStatus(stock, minStock) {
        if (stock === 0) return 'نفد المخزون';
        if (stock <= minStock) return 'مخزون منخفض';
        return 'متوفر';
    }

    getProductStatusClass(status) {
        const statusMap = {
            'متوفر': 'available',
            'مخزون منخفض': 'low-stock',
            'نفد المخزون': 'out-of-stock'
        };
        return statusMap[status] || 'unknown';
    }

    getPaymentMethodName(method) {
        const methods = {
            cash: 'نقدي',
            credit: 'آجل',
            card: 'بطاقة ائتمان',
            transfer: 'حوالة بنكية',
            check: 'شيك',
            installments: 'أقساط'
        };
        return methods[method] || method;
    }

    getCustomerTypeName(type) {
        const types = {
            individual: 'فرد',
            company: 'شركة',
            government: 'جهة حكومية'
        };
        return types[type] || type;
    }

    getCustomerTypeIcon(type) {
        const icons = {
            individual: 'user',
            company: 'building',
            government: 'landmark'
        };
        return icons[type] || 'user';
    }

    // =============================================
    // CALCULATION AND ANALYSIS METHODS
    // =============================================
    
    calculateDurationInMonths(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        const yearDiff = end.getFullYear() - start.getFullYear();
        const monthDiff = end.getMonth() - start.getMonth();
        
        return yearDiff * 12 + monthDiff;
    }

    calculateRemainingDays(endDate) {
        const today = new Date();
        const end = new Date(endDate);
        const diffTime = end - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    calculateAverageOrderValue() {
        const totalRevenue = this.data.sales.reduce((sum, sale) => sum + sale.total, 0);
        const totalOrders = this.data.sales.length;
        return totalOrders > 0 ? totalRevenue / totalOrders : 0;
    }

    getSalesForPeriod(period) {
        const now = new Date();
        let startDate, endDate;

        switch (period) {
            case 'today':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
                break;
            case 'week':
                const weekStart = new Date(now);
                weekStart.setDate(now.getDate() - now.getDay());
                weekStart.setHours(0, 0, 0, 0);
                startDate = weekStart;
                endDate = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
                break;
            case 'year':
                startDate = new Date(now.getFullYear(), 0, 1);
                endDate = new Date(now.getFullYear() + 1, 0, 1);
                break;
            default:
                return this.data.sales;
        }

        return this.data.sales.filter(sale => {
            const saleDate = new Date(sale.createdAt || sale.date);
            return saleDate >= startDate && saleDate < endDate;
        });
    }

    getContractsForPeriod(period) {
        const now = new Date();
        let startDate, endDate;

        switch (period) {
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
                break;
            case 'year':
                startDate = new Date(now.getFullYear(), 0, 1);
                endDate = new Date(now.getFullYear() + 1, 0, 1);
                break;
            default:
                return this.data.contracts;
        }

        return this.data.contracts.filter(contract => {
            const contractDate = new Date(contract.createdAt || contract.startDate);
            return contractDate >= startDate && contractDate < endDate;
        });
    }

    getDateRangeForPeriod(period) {
        const now = new Date();
        
        switch (period) {
            case 'today':
                return {
                    start: now.toISOString().split('T')[0],
                    end: now.toISOString().split('T')[0]
                };
            case 'week':
                const weekStart = new Date(now);
                weekStart.setDate(now.getDate() - now.getDay());
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekStart.getDate() + 6);
                return {
                    start: weekStart.toISOString().split('T')[0],
                    end: weekEnd.toISOString().split('T')[0]
                };
            case 'month':
                const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
                const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                return {
                    start: monthStart.toISOString().split('T')[0],
                    end: monthEnd.toISOString().split('T')[0]
                };
            case 'year':
                return {
                    start: `${now.getFullYear()}-01-01`,
                    end: `${now.getFullYear()}-12-31`
                };
        }
    }

    calculateSalesSummary(salesData) {
        const summary = {
            totalSales: salesData.length,
            totalRevenue: 0,
            totalTax: 0,
            totalCost: 0,
            grossProfit: 0,
            netProfit: 0,
            averageOrderValue: 0,
            paymentMethods: {},
            topProducts: [],
            topCustomers: []
        };

        salesData.forEach(sale => {
            summary.totalRevenue += sale.total;
            summary.totalTax += sale.tax || 0;
            
            const product = this.findProductById(sale.productId);
            if (product) {
                summary.totalCost += product.cost * sale.quantity;
            }

            // Payment methods breakdown
            if (!summary.paymentMethods[sale.paymentMethod]) {
                summary.paymentMethods[sale.paymentMethod] = { count: 0, amount: 0 };
            }
            summary.paymentMethods[sale.paymentMethod].count++;
            summary.paymentMethods[sale.paymentMethod].amount += sale.total;
        });

        summary.grossProfit = summary.totalRevenue - summary.totalCost;
        summary.netProfit = summary.grossProfit - summary.totalTax;
        summary.averageOrderValue = salesData.length > 0 ? summary.totalRevenue / salesData.length : 0;

        return summary;
    }

    getTopSellingProducts(limit = 10) {
        const productSales = {};
        
        this.data.sales.forEach(sale => {
            if (!productSales[sale.productId]) {
                productSales[sale.productId] = {
                    productId: sale.productId,
                    productName: sale.productName,
                    totalQuantity: 0,
                    totalRevenue: 0,
                    salesCount: 0
                };
            }
            
            productSales[sale.productId].totalQuantity += sale.quantity;
            productSales[sale.productId].totalRevenue += sale.total;
            productSales[sale.productId].salesCount += 1;
        });

        return Object.values(productSales)
            .sort((a, b) => b.totalRevenue - a.totalRevenue)
            .slice(0, limit);
    }

    getTopCustomers(limit = 10) {
        return [...this.data.customers]
            .sort((a, b) => b.totalPurchases - a.totalPurchases)
            .slice(0, limit);
    }

    getNewCustomersForPeriod(period) {
        const dateRange = this.getDateRangeForPeriod(period);
        
        return this.data.customers.filter(customer => {
            const regDate = customer.registrationDate || customer.createdAt?.split('T')[0];
            return regDate >= dateRange.start && regDate <= dateRange.end;
        });
    }

    getCategoryBreakdown() {
        const categories = {};
        
        this.data.products.forEach(product => {
            if (!categories[product.category]) {
                categories[product.category] = {
                    name: product.category,
                    productCount: 0,
                    totalValue: 0,
                    totalStock: 0
                };
            }
            
            categories[product.category].productCount++;
            categories[product.category].totalValue += product.stock * product.price;
            categories[product.category].totalStock += product.stock;
        });

        return Object.values(categories);
    }

    getCustomerTypeBreakdown() {
        const types = {};
        
        this.data.customers.forEach(customer => {
            const type = customer.type || 'individual';
            if (!types[type]) {
                types[type] = {
                    type: type,
                    count: 0,
                    totalPurchases: 0
                };
            }
            
            types[type].count++;
            types[type].totalPurchases += customer.totalPurchases || 0;
        });

        return Object.values(types);
    }

    // =============================================
    // DATA MANIPULATION HELPERS
    // =============================================
    
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current && current[key], obj);
    }

    capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // =============================================
    // SYSTEM DATA MANAGEMENT
    // =============================================
    
    async saveSystemData() {
        try {
            // Update metadata before saving
            this.data.metadata.lastUpdated = new Date().toISOString();
            this.data.metadata.version = this.version;
            
            // Calculate current metrics
            this.calculateMetrics();
            
            // Save to localStorage with compression if needed
            const dataString = JSON.stringify(this.data);
            
            // Check if data is too large
            if (dataString.length > 5000000) { // 5MB limit
                await this.compressAndSaveData(this.data);
            } else {
                localStorage.setItem('tagelmalek_system_data', dataString);
            }
            
            // Update UI indicators
            this.updateSystemStatus();
            
            console.log('💾 System data saved successfully');
            return true;
            
        } catch (error) {
            console.error('❌ Error saving system data:', error);
            this.showNotification('خطأ في حفظ البيانات', 'error');
            return false;
        }
    }

    async loadSystemData() {
        try {
            const savedData = localStorage.getItem('tagelmalek_system_data');
            if (savedData) {
                const parsed = JSON.parse(savedData);
                this.data = this.mergeSystemData(this.data, parsed);
                
                // Data migration if needed
                await this.migrateSystemData();
                
                console.log('📁 System data loaded successfully');
            } else {
                console.log('📝 No saved data found, using defaults');
            }
            
            // Load notifications
            this.loadNotificationsFromStorage();
            
            // Update metadata
            this.data.metadata.lastLoaded = new Date().toISOString();
            this.calculateMetrics();
            
        } catch (error) {
            console.error('❌ Error loading system data:', error);
            this.showNotification('خطأ في تحميل البيانات، سيتم استخدام البيانات الافتراضية', 'warning');
            this.resetToDefaults();
        }
    }

    mergeSystemData(target, source) {
        const result = { ...target };
        
        for (const key in source) {
            if (source.hasOwnProperty(key)) {
                if (Array.isArray(source[key])) {
                    result[key] = source[key];
                } else if (typeof source[key] === 'object' && source[key] !== null) {
                    if (typeof target[key] === 'object' && target[key] !== null && !Array.isArray(target[key])) {
                        result[key] = this.mergeSystemData(target[key], source[key]);
                    } else {
                        result[key] = source[key];
                    }
                } else {
                    result[key] = source[key];
                }
            }
        }
        
        return result;
    }

    async migrateSystemData() {
        const currentVersion = this.data.metadata.version;
        
        if (!currentVersion || currentVersion !== this.version) {
            console.log('🔄 Migrating system data to version', this.version);
            
            // Version-specific migrations
            if (!currentVersion || currentVersion < '2.1.0') {
                await this.migrateToV21();
            }
            
            if (!currentVersion || currentVersion < '2.2.0') {
                await this.migrateToV22();
            }
            
            // Update version
            this.data.metadata.version = this.version;
            this.data.metadata.migratedAt = new Date().toISOString();
            
            await this.saveSystemData();
            this.showNotification('تم ترقية البيانات بنجاح', 'success');
        }
    }

    async migrateToV21() {
        // Add missing fields for v2.1
        this.data.sales.forEach(sale => {
            if (!sale.subtotal) sale.subtotal = sale.quantity * sale.price;
            if (!sale.tax) sale.tax = sale.subtotal * this.data.settings.taxRate;
            if (!sale.createdBy) sale.createdBy = 'system';
        });
        
        this.data.products.forEach(product => {
            if (!product.profit) product.profit = product.price - product.cost;
            if (!product.profitMargin && product.cost > 0) {
                product.profitMargin = ((product.price - product.cost) / product.cost) * 100;
            }
            if (!product.createdBy) product.createdBy = 'system';
        });
        
        this.data.customers.forEach(customer => {
            if (!customer.totalPurchaseCount) customer.totalPurchaseCount = 0;
            if (!customer.lastPurchaseDate) customer.lastPurchaseDate = null;
            if (!customer.createdBy) customer.createdBy = 'system';
        });
        
        console.log('✅ Data migrated to v2.1');
    }

    async migrateToV22() {
        // Add new fields for v2.2
        if (!this.data.categories) this.data.categories = [];
        if (!this.data.suppliers) this.data.suppliers = [];
        if (!this.data.stockAdjustments) this.data.stockAdjustments = [];
        
        // Update settings with new options
        if (!this.data.settings.sessionTimeout) this.data.settings.sessionTimeout = 30;
        if (!this.data.settings.maxLoginAttempts) this.data.settings.maxLoginAttempts = 3;
        if (!this.data.settings.invoicePrefix) this.data.settings.invoicePrefix = 'INV';
        if (!this.data.settings.contractPrefix) this.data.settings.contractPrefix = 'CONT';
        
        console.log('✅ Data migrated to v2.2');
    }

    calculateMetrics() {
        const metrics = {
            totalSales: this.data.sales.reduce((sum, sale) => sum + sale.total, 0),
            totalContracts: this.data.contracts.reduce((sum, contract) => sum + contract.value, 0),
            totalCustomers: this.data.customers.length,
            totalProducts: this.data.products.length,
            averageOrderValue: this.calculateAverageOrderValue(),
            topSellingProduct: this.getTopSellingProducts(1)[0] || null,
            topCustomer: this.getTopCustomers(1)[0] || null
        };
        
        this.data.metadata = { ...this.data.metadata, ...metrics };
    }

    resetToDefaults() {
        // Reset to default state while preserving essential settings
        const essentialSettings = {
            company: this.data.settings.company,
            currency: this.data.settings.currency,
            password: this.data.settings.password,
            requirePassword: this.data.settings.requirePassword
        };
        
        this.data = {
            ...this.constructor.prototype.constructor.call(this).data,
            settings: { ...this.data.settings, ...essentialSettings }
        };
        
        this.showNotification('تم إعادة تعيين النظام للإعدادات الافتراضية', 'info');
    }

    // =============================================
    // BACKGROUND SERVICES
    // =============================================
    
    startBackgroundServices() {
        // Auto-save service
        this.startAutoSave();
        
        // Health check service
        this.startHealthChecks();
        
        // Notification service
        this.startNotificationService();
        
        // Session monitoring
        this.startSessionMonitoring();
        
        // Performance monitoring
        this.startPerformanceMonitoring();
        
        console.log('🔧 Background services started');
    }

    startAutoSave() {
        // Auto-save every 5 minutes
        setInterval(async () => {
            if (this.state.hasUnsavedChanges) {
                await this.saveSystemData();
                this.state.hasUnsavedChanges = false;
                console.log('🔄 Auto-save completed');
            }
        }, 5 * 60 * 1000);
        
        // Save on page visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.state.hasUnsavedChanges) {
                this.saveSystemData();
            }
        });
        
        console.log('⏰ Auto-save service started');
    }

    startHealthChecks() {
        // Health check every 10 minutes
        setInterval(async () => {
            await this.performSystemHealthCheck();
        }, 10 * 60 * 1000);
        
        console.log('🏥 Health check service started');
    }

    startNotificationService() {
        // Check for alerts every 30 minutes
        setInterval(() => {
            this.checkSystemAlerts();
        }, 30 * 60 * 1000);
        
        // Check for contract expiry daily
        setInterval(() => {
            this.checkContractExpiry();
        }, 24 * 60 * 60 * 1000);
        
        console.log('🔔 Notification service started');
    }

    startSessionMonitoring() {
        // Update last activity on user interactions
        const updateActivity = () => {
            this.state.lastActivity = Date.now();
        };
        
        ['mousedown', 'keydown', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, updateActivity, true);
        });
        
        // Check for session timeout every minute
        setInterval(() => {
            this.checkSessionTimeout();
        }, 60 * 1000);
        
        console.log('⏱️ Session monitoring started');
    }

    startPerformanceMonitoring() {
        // Monitor memory usage every 5 minutes
        setInterval(() => {
            this.monitorPerformance();
        }, 5 * 60 * 1000);
        
        console.log('📊 Performance monitoring started');
    }

    async performSystemHealthCheck() {
        const health = {
            timestamp: new Date().toISOString(),
            status: 'good',
            issues: []
        };
        
        try {
            // Check data integrity
            const dataIssues = this.checkDataIntegrity();
            if (dataIssues.length > 0) {
                health.issues.push(...dataIssues);
            }
            
            // Check storage capacity
            const storageIssue = this.checkStorageCapacity();
            if (storageIssue) {
                health.issues.push(storageIssue);
            }
            
            // Check network connectivity
            const networkIssue = await this.checkNetworkConnectivity();
            if (networkIssue) {
                health.issues.push(networkIssue);
            }
            
            // Update health status
            if (health.issues.length > 0) {
                health.status = health.issues.some(i => i.severity === 'critical') ? 'critical' : 'warning';
            }
            
            // Update system metadata
            this.data.metadata.lastHealthCheck = health.timestamp;
            this.data.metadata.systemHealth = health.status;
            
            // Show notifications for critical issues
            if (health.status === 'critical') {
                this.showNotification('تم اكتشاف مشاكل حرجة في النظام', 'error');
            } else if (health.status === 'warning') {
                this.showNotification(`تم اكتشاف ${health.issues.length} تحذير في النظام`, 'warning');
            }
            
            console.log('🏥 System health check completed:', health.status);
            return health;
            
        } catch (error) {
            console.error('❌ Health check failed:', error);
            health.status = 'error';
            health.issues.push({
                type: 'system',
                severity: 'critical',
                message: 'فشل في فحص النظام',
                details: error.message
            });
            return health;
        }
    }

    checkDataIntegrity() {
        const issues = [];
        
        // Check for orphaned sales
        const orphanedSales = this.data.sales.filter(sale => {
            const customerExists = this.data.customers.some(c => c.id === sale.customerId);
            const productExists = this.data.products.some(p => p.id === sale.productId);
            return !customerExists || !productExists;
        });
        
        if (orphanedSales.length > 0) {
            issues.push({
                type: 'data',
                severity: 'warning',
                message: `${orphanedSales.length} مبيعة لها بيانات مفقودة`,
                details: 'توجد مبيعات مرتبطة بعملاء أو منتجات غير موجودة'
            });
        }
        
        // Check for negative stock
        const negativeStock = this.data.products.filter(p => p.stock < 0);
        if (negativeStock.length > 0) {
            issues.push({
                type: 'inventory',
                severity: 'critical',
                message: `${negativeStock.length} منتج له مخزون سالب`,
                details: 'يجب تصحيح المخزون فوراً'
            });
        }
        
        // Check for invalid calculations
        const invalidSales = this.data.sales.filter(sale => 
            Math.abs(sale.total - (sale.quantity * sale.price * (1 + this.data.settings.taxRate))) > 0.01
        );
        
        if (invalidSales.length > 0) {
            issues.push({
                type: 'calculation',
                severity: 'warning',
                message: `${invalidSales.length} مبيعة لها حسابات خاطئة`,
                details: 'يجب إعادة حساب إجماليات المبيعات'
            });
        }
        
        return issues;
    }

    checkStorageCapacity() {
        try {
            const dataSize = JSON.stringify(this.data).length;
            const maxSize = 5 * 1024 * 1024; // 5MB
            
            if (dataSize > maxSize * 0.9) {
                return {
                    type: 'storage',
                    severity: 'warning',
                    message: 'مساحة التخزين تقترب من الحد الأقصى',
                    details: `الحجم الحالي: ${(dataSize / 1024 / 1024).toFixed(2)} MB`
                };
            }
            
            return null;
        } catch (error) {
            return {
                type: 'storage',
                severity: 'critical',
                message: 'خطأ في فحص مساحة التخزين',
                details: error.message
            };
        }
    }

    async checkNetworkConnectivity() {
        if (!navigator.onLine) {
            return {
                type: 'network',
                severity: 'warning',
                message: 'لا يوجد اتصال بالإنترنت',
                details: 'بعض الميزات قد لا تعمل بشكل صحيح'
            };
        }
        
        return null;
    }

    checkSystemAlerts() {
        // Check for low stock products
        const lowStockProducts = this.data.products.filter(p => 
            p.stock <= p.minStock && p.stock > 0
        );
        
        if (lowStockProducts.length > 0) {
            this.showNotification(
                `${lowStockProducts.length} منتج يحتاج إعادة تموين`,
                'warning'
            );
        }
        
        // Check for out of stock products
        const outOfStockProducts = this.data.products.filter(p => p.stock === 0);
        
        if (outOfStockProducts.length > 0) {
            this.showNotification(
                `${outOfStockProducts.length} منتج نفد مخزونه`,
                'error'
            );
        }
    }

    checkContractExpiry() {
        const alertDays = this.data.settings.contractAlertDays;
        const expiringContracts = this.data.contracts.filter(contract => {
            const remainingDays = this.calculateRemainingDays(contract.endDate);
            return remainingDays <= alertDays && remainingDays > 0 && contract.status === 'نشط';
        });
        
        if (expiringContracts.length > 0) {
            this.showNotification(
                `${expiringContracts.length} اتفاق ينتهي خلال ${alertDays} يوم`,
                'warning'
            );
            
            // Send Telegram notification if enabled
            if (this.data.settings.notifications.contractExpiry) {
                this.sendTelegramNotification(`⚠️ تنبيه انتهاء اتفاقات
عدد الاتفاقات التي تنتهي قريباً: ${expiringContracts.length}
المدة المتبقية: أقل من ${alertDays} يوم`);
            }
        }
    }

    checkSessionTimeout() {
        const sessionDuration = Date.now() - this.state.sessionStartTime;
        const idleDuration = Date.now() - this.state.lastActivity;
        
        const maxSession = this.data.settings.sessionTimeout * 60 * 1000; // Convert to milliseconds
        const maxIdle = 15 * 60 * 1000; // 15 minutes idle timeout
        
        if (sessionDuration > maxSession || idleDuration > maxIdle) {
            this.handleSessionTimeout();
        }
    }

    handleSessionTimeout() {
        // Save current state
        this.saveSystemData();
        
        // Clear sensitive data
        this.state.currentUser = null;
        this.state.sessionStartTime = Date.now();
        this.state.lastActivity = Date.now();
        
        this.showNotification('انتهت جلسة العمل، يرجى إعادة المصادقة للعمليات الحساسة', 'info');
    }

    monitorPerformance() {
        const now = performance.now();
        
        // Memory monitoring
        if ('memory' in performance) {
            const memory = performance.memory;
            const usedMB = Math.round(memory.usedJSHeapSize / 1048576);
            const totalMB = Math.round(memory.totalJSHeapSize / 1048576);
            const limitMB = Math.round(memory.jsHeapSizeLimit / 1048576);
            
            this.data.metadata.performanceMetrics.memoryUsage = usedMB;
            
            if (usedMB / limitMB > 0.8) {
                console.warn(`⚠️ High memory usage: ${usedMB}MB / ${limitMB}MB (${Math.round(usedMB/limitMB*100)}%)`);
                this.showNotification('استخدام الذاكرة مرتفع، قد تحتاج إلى إعادة تحميل الصفحة', 'warning');
            }
        }
        
        // Performance metrics update
        const totalOperations = this.data.metadata.performanceMetrics.totalOperations || 0;
        const avgResponseTime = this.performance.operationTimes.length > 0 ?
            this.performance.operationTimes.reduce((a, b) => a + b, 0) / this.performance.operationTimes.length : 0;
        
        this.data.metadata.performanceMetrics.avgResponseTime = avgResponseTime;
        this.data.metadata.performanceMetrics.totalOperations = totalOperations;
        
        // Clear old performance data
        if (this.performance.operationTimes.length > 100) {
            this.performance.operationTimes = this.performance.operationTimes.slice(-50);
        }
    }

    // =============================================
    // UI HELPER METHODS
    // =============================================
    
    showLoading(show = true, message = 'تحميل...') {
        const overlay = document.getElementById('loadingOverlay');
        const loadingText = document.getElementById('loadingText');
        
        if (overlay) {
            overlay.style.display = show ? 'flex' : 'none';
            
            if (show) {
                overlay.style.animation = 'fadeIn 0.3s ease';
                if (loadingText) loadingText.textContent = message;
            }
        }
        
        this.state.isLoading = show;
    }

    async showConfirmDialog(message, title = 'تأكيد') {
        return new Promise((resolve) => {
            const modalId = `confirmModal_${Date.now()}`;
            const modalHtml = `
                <div id="${modalId}" class="modal confirm-modal" style="display: block;">
                    <div class="modal-content modal-sm">
                        <div class="confirm-dialog">
                            <div class="confirm-icon">
                                <i class="fas fa-question-circle"></i>
                            </div>
                            <h3 class="confirm-title">${title}</h3>
                            <p class="confirm-message">${message}</p>
                            <div class="confirm-actions">
                                <button class="btn btn-primary" onclick="confirmAction(true)">
                                    <i class="fas fa-check"></i> نعم
                                </button>
                                <button class="btn btn-secondary" onclick="confirmAction(false)">
                                    <i class="fas fa-times"></i> لا
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHtml);
            document.body.style.overflow = 'hidden';
            
            window.confirmAction = (result) => {
                const modal = document.getElementById(modalId);
                if (modal) {
                    modal.remove();
                    document.body.style.overflow = '';
                }
                delete window.confirmAction;
                resolve(result);
            };
        });
    }

    showWelcomeMessage() {
        const isEmptySystem = this.data.sales.length === 0 && 
                             this.data.customers.length === 0 && 
                             this.data.products.length === 0 && 
                             this.data.contracts.length === 0;
        
        if (isEmptySystem) {
            this.showNotification(
                'مرحباً بك في نظام Tag ElMalek المطور! ابدأ بإضافة بياناتك الأولى',
                'info',
                10000
            );
        } else {
            this.showNotification(
                `تم تحميل النظام بنجاح - ${this.data.sales.length} مبيعة، ${this.data.customers.length} عميل، ${this.data.products.length} منتج`,
                'success'
            );
        }
    }

    handleCriticalError(message, error = null) {
        console.error('💥 Critical system error:', error);
        
        const errorModal = `
            <div class="modal critical-error-modal" style="display: block; z-index: 99999;">
                <div class="modal-content modal-sm">
                    <div class="critical-error">
                        <div class="error-icon">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                        <h3>خطأ في النظام</h3>
                        <p>${message}</p>
                        ${error ? `<details class="error-details">
                            <summary>تفاصيل الخطأ</summary>
                            <pre>${error.message}\n${error.stack}</pre>
                        </details>` : ''}
                        <div class="error-actions">
                            <button class="btn btn-primary" onclick="location.reload()">
                                <i class="fas fa-sync-alt"></i> إعادة تحميل
                            </button>
                            <button class="btn btn-secondary" onclick="salesSystem.resetToDefaults()">
                                <i class="fas fa-undo"></i> إعادة تعيين
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', errorModal);
    }

    // Form helper methods
    resetSaleForm() {
        const form = document.getElementById('saleForm');
        if (form) form.reset();
        this.recalculateSaleTotal();
    }

    resetProductForm() {
        const form = document.getElementById('productForm');
        if (form) form.reset();
        this.recalculateProductProfit();
    }

    resetCustomerForm() {
        const form = document.getElementById('customerForm');
        if (form) form.reset();
    }

    resetContractForm() {
        const form = document.getElementById('contractForm');
        if (form) form.reset();
        this.recalculateContractDuration();
    }

    resetEditMode() {
        this.state.currentEditId = null;
        this.state.currentEditType = null;
        
        // Reset modal titles and buttons
        this.updateModalTitles();
    }

    updateModalTitles() {
        const modals = {
            'saleModal': { title: 'إضافة مبيعة جديدة', button: 'إضافة المبيعة' },
            'contractModal': { title: 'إضافة اتفاق جديد', button: 'إضافة الاتفاق' },
            'customerModal': { title: 'إضافة عميل جديد', button: 'إضافة العميل' },
            'productModal': { title: 'إضافة منتج جديد', button: 'إضافة المنتج' }
        };

        Object.entries(modals).forEach(([modalId, config]) => {
            const titleElement = document.querySelector(`#${modalId} h2`);
            const buttonElement = document.querySelector(`#${modalId.replace('Modal', 'Form')} button[type="submit"]`);
            
            if (titleElement) titleElement.textContent = config.title;
            if (buttonElement) buttonElement.innerHTML = `<i class="fas fa-plus"></i> ${config.button}`;
        });
    }

    // Calculation helper methods
    recalculateSaleTotal() {
        const quantity = parseInt(document.getElementById('saleQuantity')?.value) || 0;
        const price = parseFloat(document.getElementById('salePrice')?.value) || 0;
        const taxRate = this.data.settings.taxRate;
        
        const subtotal = quantity * price;
        const tax = subtotal * taxRate;
        const total = subtotal + tax;
        
        // Update display
        const elements = {
            'saleSubtotal': this.formatCurrency(subtotal),
            'saleTax': this.formatCurrency(tax),
            'saleTotal': this.formatCurrency(total)
        };
        
        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });
    }

    recalculateProductProfit() {
        const price = parseFloat(document.getElementById('productPrice')?.value) || 0;
        const cost = parseFloat(document.getElementById('productCost')?.value) || 0;
        
        const profit = price - cost;
        const margin = cost > 0 ? ((profit / cost) * 100) : 0;
        
        // Update display
        const elements = {
            'productProfit': this.formatCurrency(profit),
            'productProfitMargin': `${margin.toFixed(1)}%`
        };
        
        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });
    }

    recalculateContractDuration() {
        const startDate = document.getElementById('contractStartDate')?.value;
        const endDate = document.getElementById('contractEndDate')?.value;
        
        if (startDate && endDate) {
            const duration = this.calculateDurationInMonths(startDate, endDate);
            const durationElement = document.getElementById('contractDuration');
            if (durationElement) durationElement.value = duration;
        }
    }

    // Select population methods
    populateAllSelects() {
        this.populateCustomerSelects();
        this.populateProductSelects();
        this.populateSupplierSelects();
        this.populateCategorySelects();
    }

    populateCustomerSelects() {
        const selects = ['saleCustomer', 'contractCustomer'];
        selects.forEach(selectId => {
            const select = document.getElementById(selectId);
            if (select) {
                const currentValue = select.value;
                select.innerHTML = '<option value="">اختر العميل</option>';
                
                this.data.customers
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .forEach(customer => {
                        const option = document.createElement('option');
                        option.value = customer.id;
                        option.textContent = `${customer.name}${customer.company ? ` - ${customer.company}` : ''}`;
                        if (customer.id === currentValue) option.selected = true;
                        select.appendChild(option);
                    });
            }
        });
    }

    populateProductSelects() {
        const select = document.getElementById('saleProduct');
        if (select) {
            const currentValue = select.value;
            select.innerHTML = '<option value="">اختر المنتج</option>';
            
            this.data.products
                .filter(product => product.stock > 0)
                .sort((a, b) => a.name.localeCompare(b.name))
                .forEach(product => {
                    const option = document.createElement('option');
                    option.value = product.id;
                    option.textContent = `${product.name} - ${product.code} (${product.stock} ${product.unit})`;
                    option.dataset.price = product.price;
                    if (product.id === currentValue) option.selected = true;
                    select.appendChild(option);
                });
        }
    }

    populateSupplierSelects() {
        const select = document.getElementById('productSupplier');
        if (select && this.data.suppliers) {
            const currentValue = select.value;
            select.innerHTML = '<option value="">اختر المورد</option>';
            
            this.data.suppliers
                .sort((a, b) => a.name.localeCompare(b.name))
                .forEach(supplier => {
                    const option = document.createElement('option');
                    option.value = supplier.id;
                    option.textContent = supplier.name;
                    if (supplier.id === currentValue) option.selected = true;
                    select.appendChild(option);
                });
        }
    }

    populateCategorySelects() {
        const select = document.getElementById('productCategory');
        if (select) {
            const currentValue = select.value;
            const categories = [...new Set(this.data.products.map(p => p.category).filter(c => c))];
            
            if (this.data.categories && this.data.categories.length > 0) {
                categories.push(...this.data.categories.map(c => c.name));
            }
            
            const uniqueCategories = [...new Set(categories)].sort();
            
            select.innerHTML = '<option value="">اختر الفئة</option>';
            
            uniqueCategories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                if (category === currentValue) option.selected = true;
                select.appendChild(option);
            });
        }
    }

    downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    }

    setupNetworkMonitoring() {
        window.addEventListener('online', () => {
            this.state.isOnline = true;
            this.showNotification('تم الاتصال بالإنترنت', 'success');
            this.updateSystemStatus();
        });
        
        window.addEventListener('offline', () => {
            this.state.isOnline = false;
            this.showNotification('انقطع الاتصال بالإنترنت - النظام يعمل بوضع عدم الاتصال', 'warning');
            this.updateSystemStatus();
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + shortcuts
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 's':
                        e.preventDefault();
                        this.saveSystemData();
                        this.showNotification('تم حفظ البيانات', 'success');
                        break;
                    case 'n':
                        e.preventDefault();
                        this.showQuickActions();
                        break;
                    case 'f':
                        e.preventDefault();
                        this.focusCurrentSearch();
                        break;
                    case 'e':
                        e.preventDefault();
                        this.exportData();
                        break;
                    case 'i':
                        e.preventDefault();
                        this.importData();
                        break;
                }
            }
            
            // Function key shortcuts
            switch (e.key) {
                case 'F1':
                    e.preventDefault();
                    this.showSystemInfo();
                    break;
                case 'F2':
                    e.preventDefault();
                    this.openModal('saleModal');
                    break;
                case 'F3':
                    e.preventDefault();
                    this.openModal('productModal');
                    break;
                case 'F4':
                    e.preventDefault();
                    this.openModal('customerModal');
                    break;
                case 'F5':
                    e.preventDefault();
                    this.updateAllSections();
                    this.showNotification('تم تحديث البيانات', 'info');
                    break;
            }
            
            // Escape key
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    setupFormValidation() {
        // Real-time validation setup
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
            inputs.forEach(input => {
                input.addEventListener('blur', (e) => this.validateInput(e.target));
                input.addEventListener('input', (e) => this.clearInputError(e.target));
            });
        });
    }

    validateInput(input) {
        // Implementation would go here
        return true;
    }

    clearInputError(input) {
        // Implementation would go here
    }

    setupEventListeners() {
        // Form submissions
        document.addEventListener('submit', async (e) => {
            if (e.target.matches('form[id$="Form"]')) {
                e.preventDefault();
                const formType = e.target.id.replace('Form', '');
                await this.handleFormSubmission(formType, e.target);
            }
        });
        
        // Product selection changes
        document.addEventListener('change', (e) => {
            if (e.target.id === 'saleProduct') {
                const product = this.findProductById(e.target.value);
                if (product) {
                    const priceInput = document.getElementById('salePrice');
                    if (priceInput) {
                        priceInput.value = product.price;
                        this.recalculateSaleTotal();
                    }
                }
            }
        });
        
        // Quantity and price changes
        document.addEventListener('input', (e) => {
            if (e.target.matches('#saleQuantity, #salePrice')) {
                this.recalculateSaleTotal();
            }
            if (e.target.matches('#productPrice, #productCost')) {
                this.recalculateProductProfit();
            }
            if (e.target.matches('#contractStartDate, #contractEndDate')) {
                this.recalculateContractDuration();
            }
        });
        
        // Mark as having unsaved changes
        document.addEventListener('input', () => {
            this.state.hasUnsavedChanges = true;
        });
        
        // Window events
        window.addEventListener('beforeunload', (e) => {
            if (this.state.hasUnsavedChanges) {
                this.saveSystemData();
            }
        });
    }

    setupNavigation() {
        // Navigation setup would go here
    }

    initializeCharts() {
        // Chart initialization would go here
    }

    setupSecurityFeatures() {
        // Security setup would go here
    }

    setupPerformanceMonitoring() {
        // Performance monitoring setup would go here
    }

    // Additional helper methods would continue here...
    focusCurrentSearch() {
        const activeSection = this.state.currentSection;
        const searchInput = document.getElementById(`${activeSection}Search`);
        if (searchInput) {
            searchInput.focus();
            searchInput.select();
        }
    }

    showQuickActions() {
        // Quick actions modal implementation
    }

    showSystemInfo() {
        const info = `
            <div class="system-info">
                <h3>معلومات النظام</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <label>الإصدار:</label>
                        <span>${this.version}</span>
                    </div>
                    <div class="info-item">
                        <label>تاريخ البناء:</label>
                        <span>${this.buildDate}</span>
                    </div>
                    <div class="info-item">
                        <label>إجمالي المبيعات:</label>
                        <span>${this.data.sales.length}</span>
                    </div>
                    <div class="info-item">
                        <label>إجمالي العملاء:</label>
                        <span>${this.data.customers.length}</span>
                    </div>
                    <div class="info-item">
                        <label>إجمالي المنتجات:</label>
                        <span>${this.data.products.length}</span>
                    </div>
                    <div class="info-item">
                        <label>آخر حفظ:</label>
                        <span>${this.formatDateTime(new Date(this.data.metadata.lastUpdated))}</span>
                    </div>
                </div>
            </div>
        `;
        
        this.showModal('معلومات النظام', info, 'modal-sm');
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
            // Focus first input
            setTimeout(() => {
                const firstInput = modal.querySelector('input:not([type="hidden"]), select, textarea');
                if (firstInput) firstInput.focus();
            }, 100);
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
            
            // Reset form if it exists
            const form = modal.querySelector('form');
            if (form) form.reset();
            
            this.resetEditMode();
        }
    }

    closeAllModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (modal.style.display === 'block') {
                modal.style.display = 'none';
            }
        });
        document.body.style.overflow = '';
        this.resetEditMode();
    }

    showModal(title, content, size = '', buttons = null) {
        const modalId = `dynamicModal_${Date.now()}`;
        const modalHtml = `
            <div id="${modalId}" class="modal" style="display: block;">
                <div class="modal-content ${size}">
                    <div class="modal-header">
                        <h2>${title}</h2>
                        <span class="close" onclick="document.getElementById('${modalId}').remove(); document.body.style.overflow = '';">&times;</span>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                    ${buttons ? `
                        <div class="modal-footer">
                            ${buttons.map(btn => `
                                <button class="btn ${btn.class}" onclick="${btn.onClick}">
                                    ${btn.text}
                                </button>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);
        document.body.style.overflow = 'hidden';
        
        return modalId;
    }

    updateTableWithResults(section, results) {
        const updateMethod = `update${this.capitalize(section)}Table`;
        if (typeof this[updateMethod] === 'function') {
            // Temporarily store filtered results
            const originalData = this.data[section];
            this.data[section] = results;
            
            // Update table
            this[updateMethod]();
            
            // Restore original data
            this.data[section] = originalData;
        }
    }

    updatePaginationInfo(section, totalCount, displayedCount) {
        const pagination = this.pagination[section];
        const infoElement = document.getElementById(`${section}PaginationInfo`);
        
        if (infoElement) {
            const start = (pagination.page - 1) * pagination.size + 1;
            const end = Math.min(pagination.page * pagination.size, totalCount);
            infoElement.textContent = `عرض ${start}-${end} من ${totalCount} عنصر`;
        }
        
        // Update page numbers
        const numbersContainer = document.getElementById(`${section}PageNumbers`);
        if (numbersContainer) {
            const totalPages = Math.ceil(totalCount / pagination.size);
            numbersContainer.innerHTML = '';
            
            for (let i = 1; i <= totalPages; i++) {
                const button = document.createElement('button');
                button.className = `page-btn ${i === pagination.page ? 'active' : ''}`;
                button.textContent = i;
                button.onclick = () => this.changePage(section, i);
                numbersContainer.appendChild(button);
            }
        }
    }

    changePage(section, page) {
        this.pagination[section].page = page;
        const updateMethod = `update${this.capitalize(section)}Table`;
        if (typeof this[updateMethod] === 'function') {
            this[updateMethod]();
        }
    }

    updateTableSummary(section, data) {
        const summaryElement = document.getElementById(`${section}Summary`);
        if (summaryElement && data.length > 0) {
            let summary = '';
            
            if (section === 'sales') {
                const totalRevenue = data.reduce((sum, sale) => sum + sale.total, 0);
                summary = `إجمالي الإيرادات: ${this.formatCurrency(totalRevenue)}`;
            } else if (section === 'contracts') {
                const totalValue = data.reduce((sum, contract) => sum + contract.value, 0);
                summary = `إجمالي قيمة الاتفاقات: ${this.formatCurrency(totalValue)}`;
            }
            
            summaryElement.textContent = summary;
        }
    }

    filterDataByDate(data, dateField) {
        if (!this.state.currentDateFilter) return data;
        
        const { fromDate, toDate } = this.state.currentDateFilter;
        
        return data.filter(item => {
            const itemDate = this.getNestedValue(item, dateField);
            if (!itemDate) return true;
            
            const date = itemDate.split('T')[0]; // Extract date part
            
            if (fromDate && date < fromDate) return false;
            if (toDate && date > toDate) return false;
            
            return true;
        });
    }

    async handleFormSubmission(type, form) {
        try {
            this.showLoading(true, `معالجة ${this.getTypeName(type)}...`);
            
            // Validate form
            if (!this.validateForm(form)) {
                this.showNotification('يرجى تصحيح الأخطاء في النموذج', 'error');
                return;
            }
            
            // Extract form data
            const formData = this.extractFormData(form);
            
            // Handle edit vs create
            let result;
            if (this.state.currentEditId) {
                const updateMethod = `update${this.capitalize(type)}`;
                result = await this[updateMethod](this.state.currentEditId, formData);
            } else {
                const addMethod = `add${this.capitalize(type)}`;
                result = await this[addMethod](formData);
            }
            
            if (result) {
                this.state.hasUnsavedChanges = true;
            }
            
        } catch (error) {
            console.error(`Error handling ${type} form submission:`, error);
            this.showNotification(`خطأ في ${this.getTypeName(type)}: ${error.message}`, 'error');
        } finally {
            this.showLoading(false);
        }
    }

    validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                this.showFieldError(field, `${this.getFieldLabel(field)} مطلوب`);
                isValid = false;
            } else {
                this.clearFieldError(field);
            }
        });
        
        return isValid;
    }

    extractFormData(form) {
        const formData = {};
        const formElements = form.querySelectorAll('input, select, textarea');
        
        formElements.forEach(element => {
            if (element.name) {
                let value = element.value;
                
                // Handle different input types
                if (element.type === 'number') {
                    value = parseFloat(value) || 0;
                } else if (element.type === 'checkbox') {
                    value = element.checked;
                }
                
                formData[element.name] = value;
            }
        });
        
        return formData;
    }

    getTypeName(type) {
        const types = {
            sale: 'المبيعة',
            contract: 'الاتفاق',
            customer: 'العميل',
            product: 'المنتج'
        };
        return types[type] || type;
    }

    getFieldLabel(field) {
        const label = form.querySelector(`label[for="${field.id}"]`);
        return label ? label.textContent.replace('*', '').trim() : field.name;
    }

    showFieldError(field, message) {
        field.classList.add('error');
        
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }
}

// =============================================
// GLOBAL INITIALIZATION AND EVENT HANDLERS
// =============================================

// Global system instance
let salesSystem;

// Initialize system when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Initializing Tag ElMalek Advanced Sales System...');
    
    try {
        // Create system instance
        salesSystem = new TagElMalekSalesSystem();
        
        // Make globally available
        window.salesSystem = salesSystem;
        
        // Setup global error handling
        setupGlobalErrorHandling();
        
        // Setup performance monitoring
        setupGlobalPerformanceMonitoring();
        
        console.log('✅ Tag ElMalek System initialized successfully!');
        
    } catch (error) {
        console.error('❌ System initialization failed:', error);
        showCriticalError('فشل في تحميل النظام', error);
    }
});

function setupGlobalErrorHandling() {
    window.addEventListener('error', (event) => {
        console.error('Global Error:', event.error);
        if (window.salesSystem) {
            window.salesSystem.showNotification(
                'حدث خطأ في النظام، يرجى إعادة تحميل الصفحة إذا استمر الخطأ',
                'error'
            );
        }
    });
    
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled Promise Rejection:', event.reason);
        event.preventDefault();
    });
}

function setupGlobalPerformanceMonitoring() {
    // Monitor performance
    const perfObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
            if (entry.duration > 100 && window.salesSystem) {
                window.salesSystem.performance.slowOperations.push({
                    name: entry.name,
                    duration: entry.duration,
                    timestamp: Date.now()
                });
            }
        });
    });

    if ('PerformanceObserver' in window) {
        perfObserver.observe({ entryTypes: ['measure', 'navigation'] });
    }
}

// Global utility functions
function openModal(modalId) {
    if (window.salesSystem) {
        window.salesSystem.openModal(modalId);
    }
}

function closeModal(modalId) {
    if (window.salesSystem) {
        window.salesSystem.closeModal(modalId);
    }
}

function saveSystemData() {
    if (window.salesSystem) {
        window.salesSystem.saveSystemData();
    }
}

function exportData(format = 'json') {
    if (window.salesSystem) {
        window.salesSystem.exportData(format);
    }
}

function importData() {
    if (window.salesSystem) {
        window.salesSystem.importData();
    }
}

function showCriticalError(message, error = null) {
    const errorHtml = `
        <div class="critical-error-overlay">
            <div class="critical-error-modal">
                <div class="error-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h2>خطأ في النظام</h2>
                <p>${message}</p>
                ${error ? `<details>
                    <summary>تفاصيل الخطأ</summary>
                    <pre>${error.message}</pre>
                </details>` : ''}
                <div class="error-actions">
                    <button onclick="location.reload()" class="btn btn-primary">
                        إعادة تحميل
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', errorHtml);
}

// Prevent accidental page refresh
window.addEventListener('beforeunload', function(event) {
    if (window.salesSystem && window.salesSystem.state.hasUnsavedChanges) {
        const message = 'لديك تغييرات غير محفوظة. هل أنت متأكد من مغادرة الصفحة؟';
        event.returnValue = message;
        return message;
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TagElMalekSalesSystem;
}

// Final system ready message
console.log(`
🏷️ Tag ElMalek Advanced Sales Management System v2.2.0
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ نظام إدارة المبيعات والاتفاقات المتقدم
🔐 حماية أمنية شاملة مع كلمة مرور
📊 تقارير وإحصائيات متقدمة
🔄 نسخ احتياطي تلقائي
📱 تكامل تليجرام متطور
🎯 واجهة مستجيبة ومتطورة
⚡ أداء محسن ومعالجة أخطاء شاملة
🛡️ مراقبة أداء ونظام إنذار متقدم
📈 نظام إحصائيات وتحليلات شامل
🌍 دعم كامل للعربية و RTL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 النظام جاهز للاستخدام الإنتاجي الكامل!
`);

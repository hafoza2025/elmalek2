/**
 * Tag ElMalek - Advanced Sales Management System with Multi-User Authentication & Authorization
 * Version 2.2 - Complete Enhanced Edition with User Management & Role-Based Access Control
 * 
 * نظام إدارة المبيعات والاتفاقات المتقدم مع نظام أمان متكامل - Tag ElMalek
 * الإصدار 2.2 - نظام حماية وصلاحيات متكامل
 */

class AdvancedSalesManagementSystem {
    constructor() {
        this.version = '2.2';

        // User session management
        this.currentUser = null;
        this.isLoggedIn = false;

        // User roles and permissions
        this.userRoles = {
            admin: {
                name: 'مدير عام',
                permissions: ['*'],
                color: '#dc2626'
            },
            manager: {
                name: 'مدير فرعي',
                permissions: [
                    'view_all', 'add_sale', 'edit_sale', 'delete_sale',
                    'add_customer', 'edit_customer', 'delete_customer',
                    'add_product', 'edit_product', 'add_contract',
                    'edit_contract', 'adjust_stock', 'view_reports',
                    'export_data', 'delete_product'
                ],
                color: '#2563eb'
            },
            employee: {
                name: 'موظف',
                permissions: [
                    'view_sales', 'add_sale', 'edit_own_sale',
                    'view_customers', 'add_customer', 'edit_customer',
                    'view_products', 'view_contracts', 'basic_reports'
                ],
                color: '#059669'
            }
        };

        this.data = {
            sales: [],
            contracts: [],
            customers: [],
            products: [],
            settings: {
                botToken: '',
                chatId: '',
                company: 'Tag ElMalek',
                currency: 'EGP',
                timeZone: 'Africa/Cairo',
                theme: 'light',
                dateFormat: 'dd/mm/yyyy',
                lowStockThreshold: 10,
                contractAlertDays: 30,
                password: '22468513', // كلمة المرور الإدارية الأصلية
                notifications: {
                    sales: true,
                    contracts: true,
                    customers: true,
                    lowStock: true,
                    contractExpiry: true
                },
                autoBackup: {
                    enabled: false,
                    frequency: 'daily'
                }
            },
            metadata: {
                lastBackup: null,
                createdAt: new Date().toISOString(),
                version: this.version,
                totalSales: 0,
                totalContracts: 0
            }
        };

        // System state
        this.currentEditId = null;
        this.currentEditType = null;
        this.currentDateFilter = null;
        this.charts = {};
        this.notificationCount = 0;
        this.notifications = [];
        this.maxNotifications = 50;
        this.isOnline = navigator.onLine;
        this.notificationHistory = [];

        // Pagination settings
        this.pagination = {
            sales: { page: 1, size: 10, total: 0 },
            contracts: { page: 1, size: 10, total: 0 },
            customers: { page: 1, size: 10, total: 0 },
            products: { page: 1, size: 10, total: 0 }
        };

        // Search and filter state
        this.searchCache = new Map();
        this.filterCache = new Map();

        this.init();
    }

    // =============================================
    // AUTHENTICATION & AUTHORIZATION SYSTEM
    // =============================================

    async init() {
        console.log(`🏷️ Tag ElMalek Sales Management System v${this.version} - جاري التحميل...`);

        try {
            // Check authentication first
            if (!this.checkAuthentication()) {
                this.redirectToLogin();
                return;
            }

            // Show loading
            this.showLoading(true);

            // Initialize core systems
            await this.loadData();
            this.loadNotificationsFromStorage();
            this.setupEventListeners();
            this.setupNavigation();
            this.initCharts();
            this.setupFormValidation();
            this.setupKeyboardShortcuts();
            this.setupNetworkListeners();

            // Populate UI
            this.populateAllSelects();
            this.updateAllSections();

            // Start background services
            this.startAutoSave();
            this.startHealthChecks();
            this.startNotificationSystem();

            // Check system health
            await this.performHealthCheck();

            // Update UI based on permissions
            await this.loadMainInterface();

            // Show welcome message with user info
            this.showWelcomeMessage();

            console.log('✅ نظام Tag ElMalek جاهز للاستخدام مع نظام الحماية');

        } catch (error) {
            console.error('❌ فشل في تحميل النظام:', error);
            this.addErrorNotification('حدث خطأ في تحميل النظام، يرجى إعادة تحميل الصفحة');
        } finally {
            setTimeout(() => {
                this.showLoading(false);
            }, 1500);
        }
    }

    checkAuthentication() {
        const session = localStorage.getItem('tagelmalek_session');

        if (!session) {
            return false;
        }

        try {
            const sessionData = JSON.parse(session);

            // Check if session is expired
            if (sessionData.expiresAt <= Date.now()) {
                localStorage.removeItem('tagelmalek_session');
                return false;
            }

            // Set current user
            this.currentUser = {
                id: sessionData.userId,
                username: sessionData.username,
                fullName: sessionData.fullName,
                role: sessionData.role,
                permissions: sessionData.permissions,
                loginTime: sessionData.loginTime
            };

            this.isLoggedIn = true;
            return true;

        } catch (error) {
            console.error('خطأ في فحص الجلسة:', error);
            localStorage.removeItem('tagelmalek_session');
            return false;
        }
    }

    redirectToLogin() {
        // Redirect to login page
        window.location.href = 'login.html';
    }

    logout() {
        // Clear session
        localStorage.removeItem('tagelmalek_session');
        this.currentUser = null;
        this.isLoggedIn = false;

        // Redirect to login
        this.redirectToLogin();
    }

    hasPermission(permission) {
        if (!this.isLoggedIn || !this.currentUser) {
            return false;
        }

        const userPermissions = this.currentUser.permissions;

        // Admin has all permissions
        if (userPermissions.includes('*')) {
            return true;
        }

        return userPermissions.includes(permission);
    }

    checkPermission(permission, action = null) {
        if (!this.hasPermission(permission)) {
            this.showAccessDenied(action || permission);
            return false;
        }
        return true;
    }

    showAccessDenied(action) {
        const modal = document.createElement('div');
        modal.className = 'access-denied-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="access-denied-content">
                    <div class="access-denied-icon">
                        <i class="fas fa-ban"></i>
                    </div>
                    <h3>غير مصرح بالوصول</h3>
                    <p>ليس لديك صلاحية للقيام بهذا الإجراء: <strong>${action}</strong></p>
                    <p>الدور الحالي: <strong>${this.userRoles[this.currentUser.role].name}</strong></p>
                    <div class="access-denied-actions">
                        <button onclick="this.closest('.access-denied-modal').remove()" class="btn btn-primary">
                            حسناً
                        </button>
                        <button onclick="salesSystem.logout()" class="btn btn-secondary">
                            تسجيل الخروج
                        </button>
                    </div>
                </div>
            </div>
            
            <style>
                .access-denied-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    animation: fadeIn 0.3s ease;
                }
                
                .access-denied-content {
                    background: white;
                    padding: 30px;
                    border-radius: 12px;
                    text-align: center;
                    max-width: 400px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                    animation: slideIn 0.3s ease;
                }
                
                .access-denied-icon {
                    font-size: 48px;
                    color: #ef4444;
                    margin-bottom: 20px;
                }
                
                .access-denied-content h3 {
                    color: #1f2937;
                    margin-bottom: 15px;
                    font-size: 1.5rem;
                }
                
                .access-denied-content p {
                    color: #6b7280;
                    margin-bottom: 15px;
                    line-height: 1.6;
                }
                
                .access-denied-actions {
                    display: flex;
                    gap: 10px;
                    justify-content: center;
                    margin-top: 20px;
                }
                
                .btn {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 500;
                }
                
                .btn-primary {
                    background: #667eea;
                    color: white;
                }
                
                .btn-secondary {
                    background: #6b7280;
                    color: white;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(-30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            </style>
        `;

        document.body.appendChild(modal);

        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (modal.parentNode) {
                modal.remove();
            }
        }, 10000);
    }

    showWelcomeMessage() {
        if (this.currentUser) {
            const roleInfo = this.userRoles[this.currentUser.role];
            this.addSuccessNotification(`مرحباً ${this.currentUser.fullName} (${roleInfo.name})`);
        }
    }

    // =============================================
    // PASSWORD PROTECTION SYSTEM
    // =============================================

    async verifyPassword(promptText = 'أدخل كلمة المرور للمتابعة') {
        const password = this.data.settings.password;
        if (!password || password.trim() === '') {
            return true;
        }

        return new Promise((resolve) => {
            const modalId = 'passwordModal_' + Date.now();
            const modalHtml = `
                <div id="${modalId}" class="modal" style="display: block; z-index: 10000;">
                    <div class="modal-content modal-sm">
                        <div class="modal-header">
                            <h3 style="color: #667eea; margin: 0;">
                                <i class="fas fa-lock"></i> الحماية الأمنية
                            </h3>
                        </div>
                        <div class="modal-body">
                            <div class="password-prompt-container">
                                <p style="margin-bottom: 15px; color: #374151; font-weight: 500;">
                                    <i class="fas fa-shield-alt" style="color: #f59e0b; margin-left: 8px;"></i>
                                    ${promptText}
                                </p>
                                <div class="password-input-group">
                                    <input type="password" 
                                           id="adminPasswordInput_${modalId}" 
                                           class="form-control" 
                                           placeholder="كلمة المرور..."
                                           style="padding: 12px; font-size: 16px; border-radius: 8px; border: 2px solid #e2e8f0;"
                                           autofocus>
                                    <button type="button" 
                                            id="togglePassword_${modalId}"
                                            class="password-toggle-btn"
                                            style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; color: #6b7280; cursor: pointer;"
                                            onclick="togglePasswordVisibility('${modalId}')">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                </div>
                                <div id="passwordError_${modalId}" 
                                     style="color: #ef4444; font-size: 13px; margin-top: 8px; display: none; padding: 8px; background: #fef2f2; border-radius: 4px; border-left: 4px solid #ef4444;">
                                    <i class="fas fa-exclamation-triangle"></i>
                                    <span id="errorText_${modalId}">كلمة المرور غير صحيحة!</span>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-primary" 
                                    onclick="confirmPassword_${modalId}()"
                                    style="padding: 10px 20px; font-weight: 600;">
                                <i class="fas fa-check"></i> تأكيد
                            </button>
                            <button class="btn btn-secondary" 
                                    onclick="cancelPassword_${modalId}()"
                                    style="padding: 10px 20px;">
                                <i class="fas fa-times"></i> إلغاء
                            </button>
                        </div>
                    </div>
                </div>
                
                <style>
                    .password-input-group {
                        position: relative;
                        margin-bottom: 15px;
                    }
                    .password-toggle-btn:hover {
                        color: #374151 !important;
                    }
                    #${modalId} .modal-content {
                        animation: fadeInModal 0.3s ease;
                        border-radius: 12px;
                        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                    }
                </style>
                
                <script>
                    function togglePasswordVisibility(modalId) {
                        const input = document.getElementById('adminPasswordInput_' + modalId);
                        const icon = document.querySelector('#togglePassword_' + modalId + ' i');
                        
                        if (input.type === 'password') {
                            input.type = 'text';
                            icon.className = 'fas fa-eye-slash';
                        } else {
                            input.type = 'password';
                            icon.className = 'fas fa-eye';
                        }
                    }
                    
                    function confirmPassword_${modalId}() {
                        const input = document.getElementById('adminPasswordInput_${modalId}');
                        const errorDiv = document.getElementById('passwordError_${modalId}');
                        const errorText = document.getElementById('errorText_${modalId}');
                        
                        if (input.value === "${password.replace(/"/g, '\\"').replace(/\\/g, '\\\\')}") {
                            document.getElementById('${modalId}').remove();
                            resolve(true);
                        } else {
                            errorText.textContent = input.value.trim() === '' ? 'يرجى إدخال كلمة المرور!' : 'كلمة المرور غير صحيحة!';
                            errorDiv.style.display = 'block';
                            input.focus();
                            input.select();
                            
                            input.style.animation = 'shake 0.5s ease-in-out';
                            setTimeout(() => {
                                input.style.animation = '';
                            }, 500);
                        }
                    }
                    
                    function cancelPassword_${modalId}() {
                        document.getElementById('${modalId}').remove();
                        resolve(false);
                    }
                    
                    document.getElementById('adminPasswordInput_${modalId}').addEventListener('keydown', function(e) {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            confirmPassword_${modalId}();
                        } else if (e.key === "Escape") {
                            e.preventDefault();
                            cancelPassword_${modalId}();
                        }
                    });
                    
                    document.getElementById('adminPasswordInput_${modalId}').addEventListener('input', function() {
                        document.getElementById('passwordError_${modalId}').style.display = 'none';
                    });
                    
                    setTimeout(() => {
                        document.getElementById('adminPasswordInput_${modalId}').focus();
                    }, 100);
                </script>
            `;

            document.body.insertAdjacentHTML('beforeend', modalHtml);
            document.body.style.overflow = 'hidden';
        });
    }

    // =============================================
    // NOTIFICATION MANAGEMENT SYSTEM
    // =============================================

    addNotificationToHistory(notification) {
        // إضافة إشعار جديد في بداية القائمة
        this.notificationHistory.unshift(notification);

        // الاحتفاظ بالحد الأقصى من الإشعارات
        if (this.notificationHistory.length > this.maxNotifications) {
            this.notificationHistory = this.notificationHistory.slice(0, this.maxNotifications);
        }

        // تحديث عداد الإشعارات غير المقروءة
        this.updateNotificationCount();

        // حفظ الإشعارات في التخزين المحلي
        this.saveNotificationsToStorage();

        // تحديث واجهة الإشعارات إذا كانت مفتوحة
        this.refreshNotificationPanel();

        console.log(`📢 ${notification.type}: ${notification.message}`);
    }

    updateNotificationCount() {
        const unreadCount = this.notificationHistory.filter(n => !n.read).length;
        this.notificationCount = unreadCount;
        this.updateNotificationBadge();
    }

    saveNotificationsToStorage() {
        try {
            localStorage.setItem('tagelmalek_notifications', JSON.stringify(this.notificationHistory));
        } catch (error) {
            console.warn('خطأ في حفظ الإشعارات:', error);
        }
    }

    loadNotificationsFromStorage() {
        try {
            const saved = localStorage.getItem('tagelmalek_notifications');
            if (saved) {
                this.notificationHistory = JSON.parse(saved);
                this.updateNotificationCount();
            }
        } catch (error) {
            console.warn('خطأ في تحميل الإشعارات:', error);
            this.notificationHistory = [];
        }
    }

    addSuccessNotification(message) {
        this.addNotificationToHistory({
            id: this.generateId('notif'),
            title: 'تم بنجاح',
            message,
            type: 'success',
            timestamp: new Date().toISOString(),
            read: false,
            source: 'success',
            icon: 'fa-check-circle'
        });
    }

    addErrorNotification(message) {
        this.addNotificationToHistory({
            id: this.generateId('notif'),
            title: 'خطأ',
            message,
            type: 'error',
            timestamp: new Date().toISOString(),
            read: false,
            source: 'error',
            icon: 'fa-times-circle'
        });
    }

    addWarningNotification(message) {
        this.addNotificationToHistory({
            id: this.generateId('notif'),
            title: 'تحذير',
            message,
            type: 'warning',
            timestamp: new Date().toISOString(),
            read: false,
            source: 'warning',
            icon: 'fa-exclamation-triangle'
        });
    }

    addInfoNotification(message) {
        this.addNotificationToHistory({
            id: this.generateId('notif'),
            title: 'معلومة',
            message,
            type: 'info',
            timestamp: new Date().toISOString(),
            read: false,
            source: 'info',
            icon: 'fa-info-circle'
        });
    }

    addActivityNotification(activity) {
        const activityMessages = {
            sale: `مبيعة جديدة - ${activity.data.invoiceNumber}`,
            contract: `اتفاق جديد - ${activity.data.contractNumber}`,
            customer: `عميل جديد - ${activity.data.name}`,
            product: `منتج جديد - ${activity.data.name}`
        };

        this.addNotificationToHistory({
            id: this.generateId('notif'),
            title: 'نشاط جديد',
            message: activityMessages[activity.type] || activity.message,
            type: 'activity',
            timestamp: new Date().toISOString(),
            read: false,
            source: 'activity',
            icon: 'fa-bell',
            data: activity.data
        });
    }

    updateNotificationBadge() {
        const notificationElement = document.getElementById('notificationCount');
        if (notificationElement) {
            notificationElement.textContent = this.notificationCount;
            notificationElement.style.display = this.notificationCount > 0 ? 'flex' : 'none';
        }
    }

    showNotifications() {
        const totalNotifications = this.notificationHistory.length;
        const unreadNotifications = this.notificationHistory.filter(n => !n.read);

        const notificationsHtml = `
            <div class="notifications-panel">
                <div class="notifications-header">
                    <h4>الإشعارات (${unreadNotifications.length} غير مقروء من ${totalNotifications})</h4>
                    <div class="notification-controls">
                        <button class="btn btn-sm btn-secondary" onclick="salesSystem.markAllNotificationsRead()" ${unreadNotifications.length === 0 ? 'disabled' : ''}>
                            <i class="fas fa-check-double"></i> تمييز الكل كمقروء
                        </button>
                        <button class="btn btn-sm btn-outline" onclick="salesSystem.clearAllNotifications()">
                            <i class="fas fa-trash"></i> مسح الكل
                        </button>
                    </div>
                </div>
                
                <div class="notifications-filter">
                    <button class="filter-btn active" onclick="salesSystem.filterNotifications('all')">الكل</button>
                    <button class="filter-btn" onclick="salesSystem.filterNotifications('unread')">غير مقروء</button>
                    <button class="filter-btn" onclick="salesSystem.filterNotifications('success')">نجاح</button>
                    <button class="filter-btn" onclick="salesSystem.filterNotifications('error')">أخطاء</button>
                    <button class="filter-btn" onclick="salesSystem.filterNotifications('warning')">تحذيرات</button>
                    <button class="filter-btn" onclick="salesSystem.filterNotifications('activity')">أنشطة</button>
                </div>
                
                <div class="notifications-list" id="notificationsList">
                    ${this.generateNotificationsHTML(this.notificationHistory)}
                </div>
                
                <div class="notifications-footer">
                    <button class="btn btn-sm btn-primary" onclick="salesSystem.performHealthCheck()">
                        <i class="fas fa-sync"></i> فحص النظام
                    </button>
                    <small class="text-muted">
                        آخر تحديث: ${this.formatTime(new Date())}
                    </small>
                </div>
            </div>
        `;

        this.showModal('مركز الإشعارات', notificationsHtml, 'modal-lg');

        // تمييز الإشعارات كمقروءة عند الفتح
        setTimeout(() => {
            this.markVisibleNotificationsAsRead();
        }, 1000);
    }

    generateNotificationsHTML(notifications) {
        if (notifications.length === 0) {
            return `
                <div class="empty-notifications">
                    <i class="fas fa-bell-slash"></i>
                    <p>لا توجد إشعارات</p>
                    <small>ستظهر هنا جميع إشعارات النظام والأنشطة</small>
                </div>
            `;
        }

        return notifications.map(notification => `
            <div class="notification-item notification-${notification.type} ${!notification.read ? 'unread' : ''}" 
                 data-id="${notification.id}" 
                 data-type="${notification.type}">
                <div class="notification-icon">
                    <i class="fas ${notification.icon || this.getNotificationIcon(notification.type)}"></i>
                </div>
                <div class="notification-content">
                    <div class="notification-header">
                        <h5>${notification.title || this.getNotificationTitle(notification.type)}</h5>
                        <span class="notification-time">${this.getRelativeTime(new Date(notification.timestamp))}</span>
                        ${!notification.read ? '<span class="unread-badge"></span>' : ''}
                    </div>
                    <p class="notification-message">${notification.message}</p>
                    <div class="notification-actions">
                        ${this.generateNotificationActions(notification)}
                    </div>
                </div>
                <div class="notification-controls">
                    <button class="btn btn-xs btn-ghost" onclick="salesSystem.toggleNotificationRead('${notification.id}')" 
                            title="${notification.read ? 'تمييز كغير مقروء' : 'تمييز كمقروء'}">
                        <i class="fas fa-${notification.read ? 'eye-slash' : 'eye'}"></i>
                    </button>
                    <button class="btn btn-xs btn-ghost" onclick="salesSystem.deleteNotification('${notification.id}')" title="حذف">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-times-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle',
            activity: 'fa-bell',
            system: 'fa-cog'
        };
        return icons[type] || 'fa-bell';
    }

    getNotificationTitle(type) {
        const titles = {
            success: 'تم بنجاح',
            error: 'خطأ',
            warning: 'تحذير',
            info: 'معلومة',
            activity: 'نشاط',
            system: 'النظام'
        };
        return titles[type] || 'إشعار';
    }

    generateNotificationActions(notification) {
        let actions = '';

        if (notification.type === 'activity' && notification.data) {
            if (notification.source === 'sale' || notification.message.includes('مبيعة')) {
                actions += `<button class="btn btn-xs btn-outline" onclick="salesSystem.viewSaleDetails('${notification.data?.id || ''}')">
                    <i class="fas fa-eye"></i> عرض التفاصيل
                </button>`;
            } else if (notification.source === 'customer' || notification.message.includes('عميل')) {
                actions += `<button class="btn btn-xs btn-outline" onclick="salesSystem.viewCustomerHistory('${notification.data?.id || ''}')">
                    <i class="fas fa-user"></i> عرض العميل
                </button>`;
            }
        }

        if (notification.type === 'warning' && notification.message.includes('مخزون')) {
            actions += `<button class="btn btn-xs btn-outline" onclick="salesSystem.showLowStockProducts()">
                <i class="fas fa-boxes"></i> عرض المنتجات
            </button>`;
        }

        return actions;
    }

    filterNotifications(filter) {
        let filteredNotifications = this.notificationHistory;

        // إزالة التفعيل من جميع الأزرار
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));

        // تفعيل الزر المحدد
        event.target.classList.add('active');

        switch (filter) {
            case 'unread':
                filteredNotifications = this.notificationHistory.filter(n => !n.read);
                break;
            case 'success':
            case 'error':
            case 'warning':
            case 'info':
            case 'activity':
                filteredNotifications = this.notificationHistory.filter(n => n.type === filter);
                break;
            default:
                filteredNotifications = this.notificationHistory;
        }

        const listElement = document.getElementById('notificationsList');
        if (listElement) {
            listElement.innerHTML = this.generateNotificationsHTML(filteredNotifications);
        }
    }

    toggleNotificationRead(notificationId) {
        const notification = this.notificationHistory.find(n => n.id === notificationId);
        if (notification) {
            notification.read = !notification.read;
            this.updateNotificationCount();
            this.saveNotificationsToStorage();
            this.refreshNotificationPanel();
        }
    }

    deleteNotification(notificationId) {
        this.notificationHistory = this.notificationHistory.filter(n => n.id !== notificationId);
        this.updateNotificationCount();
        this.saveNotificationsToStorage();
        this.refreshNotificationPanel();
    }

    markAllNotificationsRead() {
        this.notificationHistory.forEach(notification => {
            notification.read = true;
        });
        this.updateNotificationCount();
        this.saveNotificationsToStorage();
        this.refreshNotificationPanel();
    }

    markVisibleNotificationsAsRead() {
        const visibleNotifications = document.querySelectorAll('.notification-item.unread');
        visibleNotifications.forEach(item => {
            const notificationId = item.dataset.id;
            const notification = this.notificationHistory.find(n => n.id === notificationId);
            if (notification) {
                notification.read = true;
            }
        });
        this.updateNotificationCount();
        this.saveNotificationsToStorage();
    }

    clearAllNotifications() {
        if (this.notificationHistory.length === 0) return;

        const confirmed = confirm('هل أنت متأكد من حذف جميع الإشعارات؟');
        if (confirmed) {
            this.notificationHistory = [];
            this.updateNotificationCount();
            this.saveNotificationsToStorage();
            this.refreshNotificationPanel();
        }
    }

    refreshNotificationPanel() {
        // تحديث لوحة الإشعارات إذا كانت مفتوحة
        const notificationPanel = document.querySelector('.notifications-panel');
        if (notificationPanel) {
            setTimeout(() => {
                this.showNotifications();
            }, 100);
        }
    }

    // =============================================
    // DATA MANAGEMENT
    // =============================================

    async loadData() {
        try {
            const savedData = localStorage.getItem('tagelmalek_advanced_data');
            if (savedData) {
                const parsed = JSON.parse(savedData);
                this.data = this.mergeObjects(this.data, parsed);

                // Data migration for older versions
                await this.migrateData();

                console.log('📁 تم تحميل البيانات من التخزين المحلي');
            } else {
                console.log('📝 النظام جاهز للاستخدام مع بيانات فارغة');
            }

            // Update metadata
            this.data.metadata.lastLoaded = new Date().toISOString();
            this.calculateMetrics();

        } catch (error) {
            console.error('خطأ في تحميل البيانات:', error);
            this.addWarningNotification('خطأ في تحميل البيانات، النظام سيعمل بالوضع الافتراضي');
        }
    }

    mergeObjects(target, source) {
        const result = { ...target };

        for (const key in source) {
            if (source.hasOwnProperty(key)) {
                if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
                    if (typeof target[key] === 'object' && target[key] !== null && !Array.isArray(target[key])) {
                        result[key] = this.mergeObjects(target[key], source[key]);
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

    async migrateData() {
        if (!this.data.metadata || !this.data.metadata.version || this.data.metadata.version !== this.version) {
            console.log('🔄 ترقية البيانات إلى الإصدار 2.2...');

            // Add missing password field
            if (!this.data.settings.hasOwnProperty('password')) {
                this.data.settings.password = '22468513';
            }

            // Add missing fields to existing records
            this.data.sales.forEach(sale => {
                if (!sale.paymentMethod) sale.paymentMethod = 'cash';
                if (!sale.createdAt) sale.createdAt = (sale.date || new Date().toISOString().split('T')[0]) + 'T12:00:00.000Z';
                if (!sale.updatedAt) sale.updatedAt = sale.createdAt;
                if (!sale.status) sale.status = 'مكتملة';
                if (!sale.createdBy) sale.createdBy = 'system';
                if (!sale.createdByName) sale.createdByName = 'النظام';
            });

            this.data.customers.forEach(customer => {
                if (!customer.type) customer.type = 'individual';
                if (!customer.createdAt) customer.createdAt = (customer.registrationDate || new Date().toISOString().split('T')[0]) + 'T12:00:00.000Z';
                if (!customer.updatedAt) customer.updatedAt = customer.createdAt;
                if (!customer.totalPurchases) customer.totalPurchases = 0;
            });

            this.data.products.forEach(product => {
                if (!product.cost) product.cost = product.price * 0.7;
                if (!product.unit) product.unit = 'قطعة';
                if (!product.createdAt) product.createdAt = new Date().toISOString();
                if (!product.updatedAt) product.updatedAt = product.createdAt;
                if (!product.status) product.status = this.getProductStatus(product.stock, product.minStock);
            });

            this.data.contracts.forEach(contract => {
                if (!contract.createdAt) contract.createdAt = (contract.startDate || new Date().toISOString().split('T')[0]) + 'T12:00:00.000Z';
                if (!contract.updatedAt) contract.updatedAt = contract.createdAt;
                if (!contract.status) contract.status = 'نشط';
            });

            this.data.metadata = {
                ...this.data.metadata,
                version: this.version,
                migratedAt: new Date().toISOString()
            };

            await this.saveData();
            this.addSuccessNotification('تم ترقية البيانات بنجاح');
        }
    }

    calculateMetrics() {
        this.data.metadata.totalSales = this.data.sales.reduce((sum, sale) => sum + sale.total, 0);
        this.data.metadata.totalContracts = this.data.contracts.reduce((sum, contract) => sum + contract.value, 0);
        this.data.metadata.totalCustomers = this.data.customers.length;
        this.data.metadata.totalProducts = this.data.products.length;
    }

    async saveData() {
        try {
            // Update metadata before saving
            this.data.metadata.lastSaved = new Date().toISOString();
            this.data.metadata.version = this.version;
            this.calculateMetrics();

            // Save to localStorage
            localStorage.setItem('tagelmalek_advanced_data', JSON.stringify(this.data));

            // Update UI indicators
            const lastSaveElement = document.getElementById('lastSave');
            if (lastSaveElement) {
                lastSaveElement.textContent = `آخر حفظ: ${this.formatTime(new Date())}`;
            }

            console.log('💾 تم حفظ البيانات بنجاح');
            return true;

        } catch (error) {
            console.error('خطأ في حفظ البيانات:', error);
            this.addErrorNotification('خطأ في حفظ البيانات');
            return false;
        }
    }

    // =============================================
    // PROTECTED OPERATIONS - SALES
    // =============================================

    async addSale(form) {
        if (!this.checkPermission('add_sale', 'إضافة مبيعة')) return;

        if (!(await this.verifyPassword('أدخل كلمة المرور لإضافة مبيعة جديدة'))) {
            this.addWarningNotification('تم إلغاء إضافة المبيعة');
            return;
        }

        try {
            const customerId = document.getElementById('saleCustomer').value;
            const productId = document.getElementById('saleProduct').value;
            const quantity = parseInt(document.getElementById('saleQuantity').value);
            const price = parseFloat(document.getElementById('salePrice').value);
            const paymentMethod = document.getElementById('salePaymentMethod').value;
            const notes = document.getElementById('saleNotes').value;
            const saleDate = document.getElementById('saleDate')?.value || new Date().toISOString();

            // Validation
            if (!customerId || !productId || !quantity || !price) {
                throw new Error('يرجى ملء جميع الحقول المطلوبة');
            }

            const customer = this.data.customers.find(c => c.id === customerId);
            const product = this.data.products.find(p => p.id === productId);

            if (!customer || !product) {
                throw new Error('العميل أو المنتج غير موجود');
            }

            if (product.stock < quantity) {
                throw new Error(`الكمية المتاحة غير كافية. المتاح: ${product.stock}`);
            }

            const sale = {
                id: this.generateId('sale'),
                invoiceNumber: this.generateInvoiceNumber(),
                customerId,
                customerName: customer.name,
                productId,
                productName: product.name,
                quantity,
                price,
                total: quantity * price,
                paymentMethod: paymentMethod || 'cash',
                date: saleDate.split('T')[0],
                status: 'مكتملة',
                notes: notes || '',
                createdBy: this.currentUser.id,
                createdByName: this.currentUser.fullName,
                createdAt: saleDate,
                updatedAt: saleDate
            };

            // Update inventory
            product.stock -= quantity;
            if (product.stock <= product.minStock) {
                product.status = 'مخزون منخفض';
                this.checkLowStock(product);
            }

            // Update customer total
            customer.totalPurchases += sale.total;
            customer.updatedAt = new Date().toISOString();

            this.data.sales.push(sale);
            await this.saveData();
            this.updateSalesTable();
            this.updateDashboard();
            this.populateAllSelects();
            this.closeModal('saleModal');

            await this.sendTelegramNotification(`🛒 مبيعة جديدة
📋 رقم الفاتورة: ${sale.invoiceNumber}
👤 العميل: ${customer.name}
📦 المنتج: ${product.name}
🔢 الكمية: ${quantity}
💰 المبلغ: ${this.formatCurrency(sale.total)}
💳 طريقة الدفع: ${this.getPaymentMethodName(paymentMethod)}
📅 التاريخ: ${this.formatDate(sale.date)}
👨‍💼 بواسطة: ${this.currentUser.fullName}`);

            this.addSuccessNotification('تم إضافة المبيعة بنجاح');
            this.addActivityNotification({
                type: 'sale',
                message: `مبيعة جديدة - ${sale.invoiceNumber}`,
                data: sale
            });

            form.reset();

        } catch (error) {
            console.error('خطأ في إضافة المبيعة:', error);
            this.addErrorNotification(error.message || 'خطأ في إضافة المبيعة');
        }
    }

    async updateSale(saleId, form) {
        if (!this.hasPermission('edit_sale')) {
            if (this.hasPermission('edit_own_sale')) {
                const sale = this.data.sales.find(s => s.id === saleId);
                if (!sale || sale.createdBy !== this.currentUser.id) {
                    this.showAccessDenied('تعديل مبيعات المستخدمين الآخرين');
                    return;
                }
            } else {
                this.checkPermission('edit_sale', 'تعديل المبيعة');
                return;
            }
        }

        if (!(await this.verifyPassword('أدخل كلمة المرور لتعديل المبيعة'))) {
            this.addWarningNotification('تم إلغاء تعديل المبيعة');
            return;
        }

        try {
            const sale = this.data.sales.find(s => s.id === saleId);
            if (!sale) throw new Error('المبيعة غير موجودة');

            const customerId = document.getElementById('saleCustomer').value;
            const productId = document.getElementById('saleProduct').value;
            const quantity = parseInt(document.getElementById('saleQuantity').value);
            const price = parseFloat(document.getElementById('salePrice').value);
            const paymentMethod = document.getElementById('salePaymentMethod').value;
            const notes = document.getElementById('saleNotes').value;

            // Restore previous state
            const oldProduct = this.data.products.find(p => p.id === sale.productId);
            const oldCustomer = this.data.customers.find(c => c.id === sale.customerId);

            if (oldProduct) {
                oldProduct.stock += sale.quantity;
                oldProduct.status = this.getProductStatus(oldProduct.stock, oldProduct.minStock);
            }
            if (oldCustomer) oldCustomer.totalPurchases -= sale.total;

            // Get new data
            const customer = this.data.customers.find(c => c.id === customerId);
            const product = this.data.products.find(p => p.id === productId);

            if (!customer || !product) {
                // Restore if validation fails
                if (oldProduct) {
                    oldProduct.stock -= sale.quantity;
                    oldProduct.status = this.getProductStatus(oldProduct.stock, oldProduct.minStock);
                }
                if (oldCustomer) oldCustomer.totalPurchases += sale.total;
                throw new Error('العميل أو المنتج غير موجود');
            }

            if (product.stock < quantity) {
                // Restore if validation fails
                if (oldProduct) {
                    oldProduct.stock -= sale.quantity;
                    oldProduct.status = this.getProductStatus(oldProduct.stock, oldProduct.minStock);
                }
                if (oldCustomer) oldCustomer.totalPurchases += sale.total;
                throw new Error(`الكمية المتاحة غير كافية. المتاح: ${product.stock}`);
            }

            const oldTotal = sale.total;
            Object.assign(sale, {
                customerId,
                customerName: customer.name,
                productId,
                productName: product.name,
                quantity,
                price,
                total: quantity * price,
                paymentMethod: paymentMethod || sale.paymentMethod,
                notes: notes || '',
                updatedBy: this.currentUser.id,
                updatedByName: this.currentUser.fullName,
                updatedAt: new Date().toISOString()
            });

            // Update inventory and customer
            product.stock -= quantity;
            product.status = this.getProductStatus(product.stock, product.minStock);
            customer.totalPurchases += sale.total;
            customer.updatedAt = new Date().toISOString();

            await this.saveData();
            this.updateSalesTable();
            this.updateDashboard();
            this.populateAllSelects();
            this.closeModal('saleModal');

            await this.sendTelegramNotification(`✏️ تعديل مبيعة
📋 رقم الفاتورة: ${sale.invoiceNumber}
👤 العميل: ${customer.name}
💰 المبلغ الجديد: ${this.formatCurrency(sale.total)}
💰 المبلغ السابق: ${this.formatCurrency(oldTotal)}
👨‍💼 بواسطة: ${this.currentUser.fullName}`);

            this.addSuccessNotification('تم تحديث المبيعة بنجاح');
            this.resetEditMode();

        } catch (error) {
            console.error('خطأ في تعديل المبيعة:', error);
            this.addErrorNotification(error.message || 'خطأ في تعديل المبيعة');
        }
    }

    editSale(saleId) {
        const sale = this.data.sales.find(s => s.id === saleId);
        if (!sale) {
            this.addErrorNotification('المبيعة غير موجودة');
            return;
        }

        this.currentEditId = saleId;
        this.currentEditType = 'sale';

        // Populate form
        document.getElementById('saleCustomer').value = sale.customerId;
        document.getElementById('saleProduct').value = sale.productId;
        document.getElementById('saleQuantity').value = sale.quantity;
        document.getElementById('salePrice').value = sale.price;

        const paymentMethodSelect = document.getElementById('salePaymentMethod');
        if (paymentMethodSelect) paymentMethodSelect.value = sale.paymentMethod || 'cash';

        const notesField = document.getElementById('saleNotes');
        if (notesField) notesField.value = sale.notes || '';

        const dateField = document.getElementById('saleDate');
        if (dateField) {
            dateField.value = sale.createdAt ?
                sale.createdAt.substring(0, 16) :
                new Date().toISOString().substring(0, 16);
        }

        // Update modal
        const modalTitle = document.querySelector('#saleModal h2');
        if (modalTitle) modalTitle.textContent = 'تعديل المبيعة';

        const submitBtn = document.querySelector('#saleForm button[type="submit"]');
        if (submitBtn) submitBtn.innerHTML = '<i class="fas fa-save"></i> حفظ التعديلات';

        this.calculateSaleTotal();
        this.openModal('saleModal');
    }

    async deleteSale(saleId) {
        if (!this.checkPermission('delete_sale', 'حذف المبيعة')) return;

        if (!(await this.verifyPassword('أدخل كلمة المرور لحذف المبيعة'))) {
            this.addWarningNotification('تم إلغاء حذف المبيعة');
            return;
        }

        const confirmed = await this.showConfirmDialog(
            'هل أنت متأكد من حذف هذه المبيعة؟ لا يمكن التراجع عن هذا الإجراء.',
            'تأكيد الحذف'
        );

        if (!confirmed) return;

        try {
            const saleIndex = this.data.sales.findIndex(s => s.id === saleId);
            if (saleIndex === -1) {
                this.addErrorNotification('المبيعة غير موجودة');
                return;
            }

            const sale = this.data.sales[saleIndex];

            // Restore inventory
            const product = this.data.products.find(p => p.id === sale.productId);
            if (product) {
                product.stock += sale.quantity;
                product.status = this.getProductStatus(product.stock, product.minStock);
                product.updatedAt = new Date().toISOString();
            }

            // Update customer total
            const customer = this.data.customers.find(c => c.id === sale.customerId);
            if (customer) {
                customer.totalPurchases -= sale.total;
                customer.updatedAt = new Date().toISOString();
            }

            this.data.sales.splice(saleIndex, 1);

            await this.saveData();
            this.updateSalesTable();
            this.updateDashboard();
            this.populateAllSelects();

            await this.sendTelegramNotification(`🗑️ حذف مبيعة
📋 رقم الفاتورة: ${sale.invoiceNumber}
👤 العميل: ${sale.customerName}
💰 المبلغ المحذوف: ${this.formatCurrency(sale.total)}
👨‍💼 بواسطة: ${this.currentUser.fullName}`);

            this.addSuccessNotification('تم حذف المبيعة بنجاح');

        } catch (error) {
            console.error('خطأ في حذف المبيعة:', error);
            this.addErrorNotification('حدث خطأ أثناء حذف المبيعة');
        }
    }

    duplicateSale(saleId) {
        const sale = this.data.sales.find(s => s.id === saleId);
        if (!sale) {
            this.addErrorNotification('المبيعة غير موجودة');
            return;
        }

        // Pre-fill form with existing data
        document.getElementById('saleCustomer').value = sale.customerId;
        document.getElementById('saleProduct').value = sale.productId;
        document.getElementById('saleQuantity').value = sale.quantity;
        document.getElementById('salePrice').value = sale.price;

        const paymentMethodSelect = document.getElementById('salePaymentMethod');
        if (paymentMethodSelect) paymentMethodSelect.value = sale.paymentMethod || 'cash';

        const notesField = document.getElementById('saleNotes');
        if (notesField) notesField.value = sale.notes || '';

        this.calculateSaleTotal();
        this.openModal('saleModal');
        this.addInfoNotification('تم نسخ بيانات المبيعة. يمكنك التعديل والحفظ');
    }

    viewSaleDetails(saleId) {
        const sale = this.data.sales.find(s => s.id === saleId);
        if (!sale) {
            this.addErrorNotification('المبيعة غير موجودة');
            return;
        }

        const customer = this.data.customers.find(c => c.id === sale.customerId);
        const product = this.data.products.find(p => p.id === sale.productId);

        const detailsHtml = `
            <div class="sale-details">
                <div class="detail-header">
                    <h3>تفاصيل المبيعة ${sale.invoiceNumber}</h3>
                    <span class="status-badge status-${sale.status === 'مكتملة' ? 'completed' : 'pending'}">
                        ${sale.status}
                    </span>
                </div>
                
                <div class="detail-grid">
                    <div class="detail-section">
                        <h4>معلومات العميل</h4>
                        <p><strong>الاسم:</strong> ${customer?.name || 'غير معروف'}</p>
                        <p><strong>الهاتف:</strong> ${customer?.phone || 'غير متاح'}</p>
                        <p><strong>الشركة:</strong> ${customer?.company || 'غير محدد'}</p>
                    </div>
                    
                    <div class="detail-section">
                        <h4>معلومات المنتج</h4>
                        <p><strong>المنتج:</strong> ${product?.name || 'غير معروف'}</p>
                        <p><strong>الكود:</strong> ${product?.code || 'غير متاح'}</p>
                        <p><strong>الفئة:</strong> ${product?.category || 'غير محدد'}</p>
                    </div>
                    
                    <div class="detail-section">
                        <h4>تفاصيل المبيعة</h4>
                        <p><strong>الكمية:</strong> ${sale.quantity}</p>
                        <p><strong>السعر:</strong> ${this.formatCurrency(sale.price)}</p>
                        <p><strong>المجموع:</strong> ${this.formatCurrency(sale.total)}</p>
                        <p><strong>طريقة الدفع:</strong> ${this.getPaymentMethodName(sale.paymentMethod)}</p>
                    </div>
                    
                    <div class="detail-section">
                        <h4>معلومات التوقيت</h4>
                        <p><strong>تاريخ المبيعة:</strong> ${this.formatDate(sale.date)}</p>
                        <p><strong>وقت الإنشاء:</strong> ${this.formatDateTime(sale.createdAt)}</p>
                        <p><strong>آخر تحديث:</strong> ${this.formatDateTime(sale.updatedAt)}</p>
                        <p><strong>أنشأ بواسطة:</strong> ${sale.createdByName || 'غير محدد'}</p>
                        ${sale.updatedBy ? `<p><strong>عدل بواسطة:</strong> ${sale.updatedByName}</p>` : ''}
                    </div>
                </div>
                
                ${sale.notes ? `
                    <div class="detail-section">
                        <h4>ملاحظات</h4>
                        <p>${sale.notes}</p>
                    </div>
                ` : ''}
                
                <div class="detail-actions">
                    <button class="btn btn-primary" onclick="salesSystem.printInvoice('${sale.id}')">
                        <i class="fas fa-print"></i> طباعة الفاتورة
                    </button>
                    ${this.hasPermission('edit_sale') || (this.hasPermission('edit_own_sale') && sale.createdBy === this.currentUser.id) ? `
                        <button class="btn btn-secondary" onclick="salesSystem.editSale('${sale.id}')">
                            <i class="fas fa-edit"></i> تعديل
                        </button>
                    ` : ''}
                </div>
            </div>
        `;

        this.showModal('تفاصيل المبيعة', detailsHtml, 'modal-lg');
    }

    printInvoice(saleId) {
        const sale = this.data.sales.find(s => s.id === saleId);
        if (!sale) {
            this.addErrorNotification('المبيعة غير موجودة');
            return;
        }

        const customer = this.data.customers.find(c => c.id === sale.customerId);
        const product = this.data.products.find(p => p.id === sale.productId);

        const printWindow = window.open('', '_blank');
        const subtotal = sale.total;
        const tax = subtotal * 0.14; // 14% VAT
        const total = subtotal + tax;

        const content = `
            <!DOCTYPE html>
            <html dir="rtl" lang="ar">
            <head>
                <meta charset="UTF-8">
                <title>فاتورة - ${sale.invoiceNumber}</title>
                <style>
                    body { 
                        font-family: 'Arial', sans-serif; 
                        margin: 20px; 
                        direction: rtl; 
                        line-height: 1.6;
                        font-size: 14px;
                    }
                    .header { 
                        text-align: center; 
                        border-bottom: 3px solid #667eea; 
                        padding-bottom: 20px; 
                        margin-bottom: 30px;
                    }
                    .company-logo {
                        font-size: 2.5rem;
                        color: #667eea;
                        margin-bottom: 10px;
                    }
                    .company-name {
                        font-size: 2rem;
                        font-weight: bold;
                        color: #333;
                        margin-bottom: 5px;
                    }
                    .company-subtitle {
                        color: #666;
                        font-size: 1rem;
                    }
                    .invoice-info { 
                        display: flex; 
                        justify-content: space-between; 
                        margin: 30px 0; 
                        background: #f8f9fa;
                        padding: 20px;
                        border-radius: 5px;
                    }
                    .customer-info {
                        background: #fff;
                        padding: 20px;
                        border: 1px solid #dee2e6;
                        border-radius: 5px;
                        margin-bottom: 20px;
                    }
                    .items-table { 
                        width: 100%; 
                        border-collapse: collapse; 
                        margin: 20px 0; 
                        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                    }
                    .items-table th, .items-table td { 
                        border: 1px solid #dee2e6; 
                        padding: 12px; 
                        text-align: right; 
                    }
                    .items-table th { 
                        background-color: #667eea; 
                        color: white;
                        font-weight: bold;
                    }
                    .items-table tbody tr:nth-child(even) {
                        background-color: #f8f9fa;
                    }
                    .total-section { 
                        text-align: right; 
                        margin-top: 30px; 
                        border: 2px solid #667eea;
                        padding: 20px;
                        border-radius: 5px;
                        background: #f8f9fa;
                    }
                    .total-row {
                        display: flex;
                        justify-content: space-between;
                        padding: 5px 0;
                        border-bottom: 1px solid #dee2e6;
                    }
                    .total-row:last-child {
                        border-bottom: none;
                        font-weight: bold;
                        font-size: 1.2rem;
                        color: #667eea;
                        border-top: 2px solid #667eea;
                        padding-top: 10px;
                    }
                    .footer { 
                        border-top: 2px solid #667eea; 
                        padding-top: 30px; 
                        text-align: center; 
                        margin-top: 40px;
                        color: #666;
                    }
                    .payment-method {
                        background: #e3f2fd;
                        padding: 10px;
                        border-radius: 5px;
                        margin: 10px 0;
                        border-left: 4px solid #2196f3;
                    }
                    @media print { 
                        body { margin: 0; font-size: 12px; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="company-logo">🏷️</div>
                    <h1 class="company-name">Tag ElMalek</h1>
                    <p class="company-subtitle">نظام إدارة المبيعات والاتفاقات المتقدم</p>
                </div>
                
                <div class="invoice-info">
                    <div>
                        <h2 style="color: #667eea; margin-bottom: 15px;">فاتورة مبيعات</h2>
                        <p><strong>رقم الفاتورة:</strong> ${sale.invoiceNumber}</p>
                        <p><strong>التاريخ:</strong> ${this.formatDate(sale.date)}</p>
                        <p><strong>الوقت:</strong> ${this.formatTime(new Date(sale.createdAt))}</p>
                    </div>
                    <div>
                        <h3>معلومات الدفع</h3>
                        <div class="payment-method">
                            <strong>طريقة الدفع:</strong> ${this.getPaymentMethodName(sale.paymentMethod)}
                        </div>
                    </div>
                </div>
                
                <div class="customer-info">
                    <h3 style="color: #667eea; margin-bottom: 15px;">بيانات العميل</h3>
                    <p><strong>الاسم:</strong> ${customer?.name || 'غير محدد'}</p>
                    ${customer?.company ? `<p><strong>الشركة:</strong> ${customer.company}</p>` : ''}
                    <p><strong>الهاتف:</strong> ${customer?.phone || 'غير متاح'}</p>
                    ${customer?.email ? `<p><strong>البريد الإلكتروني:</strong> ${customer.email}</p>` : ''}
                    ${customer?.address ? `<p><strong>العنوان:</strong> ${customer.address}</p>` : ''}
                </div>
                
                <table class="items-table">
                    <thead>
                        <tr>
                            <th>المنتج</th>
                            <th>الكود</th>
                            <th>الكمية</th>
                            <th>السعر</th>
                            <th>المجموع</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${product?.name || 'غير محدد'}</td>
                            <td>${product?.code || 'غير متاح'}</td>
                            <td>${sale.quantity}</td>
                            <td>${this.formatCurrency(sale.price)}</td>
                            <td>${this.formatCurrency(sale.total)}</td>
                        </tr>
                    </tbody>
                </table>
                
                <div class="total-section">
                    <div class="total-row">
                        <span>المجموع الفرعي:</span>
                        <span>${this.formatCurrency(subtotal)}</span>
                    </div>
                    <div class="total-row">
                        <span>الضريبة المضافة (14%):</span>
                        <span>${this.formatCurrency(tax)}</span>
                    </div>
                    <div class="total-row">
                        <span>المجموع الكلي:</span>
                        <span>${this.formatCurrency(total)}</span>
                    </div>
                </div>
                
                ${sale.notes ? `
                    <div style="margin: 20px 0; padding: 15px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 5px;">
                        <strong>ملاحظات:</strong> ${sale.notes}
                    </div>
                ` : ''}
                
                <div class="footer">
                    <p><strong>شكراً لتعاملكم معنا</strong></p>
                    <p>تم إنشاء هذه الفاتورة بواسطة نظام Tag ElMalek المتقدم</p>
                    <p>تاريخ الطباعة: ${this.formatDateTime(new Date())}</p>
                    ${this.currentUser ? `<p>طبعت بواسطة: ${this.currentUser.fullName}</p>` : ''}
                    <p style="margin-top: 20px; font-size: 12px; color: #999;">
                        هذه فاتورة إلكترونية معتمدة من نظام Tag ElMalek
                    </p>
                </div>
            </body>
            </html>
        `;

        printWindow.document.write(content);
        printWindow.document.close();

        setTimeout(() => {
            printWindow.print();
        }, 1000);

        this.addSuccessNotification('تم إرسال الفاتورة للطباعة');
    }

    // =============================================
    // PROTECTED OPERATIONS - PRODUCTS
    // =============================================

    async addProduct(form) {
        if (!this.checkPermission('add_product', 'إضافة منتج')) return;

        if (!(await this.verifyPassword('أدخل كلمة المرور لإضافة منتج جديد'))) {
            this.addWarningNotification('تم إلغاء إضافة المنتج');
            return;
        }

        try {
            const name = document.getElementById('productName').value;
            const code = document.getElementById('productCode').value;
            const price = parseFloat(document.getElementById('productPrice').value);
            const cost = parseFloat(document.getElementById('productCost').value) || 0;
            const stock = parseInt(document.getElementById('productStock').value);
            const minStock = parseInt(document.getElementById('productMinStock').value) || 0;
            const category = document.getElementById('productCategory').value;
            const unit = document.getElementById('productUnit')?.value || 'قطعة';
            const description = document.getElementById('productDescription').value;

            if (!name || !code || !price || stock === undefined || !category) {
                throw new Error('يرجى ملء جميع الحقول المطلوبة');
            }

            // Check if product code already exists
            const existingProduct = this.data.products.find(p => p.code === code);
            if (existingProduct) {
                throw new Error('كود المنتج موجود بالفعل');
            }

            const product = {
                id: this.generateId('prod'),
                name,
                code,
                price,
                cost,
                stock,
                minStock,
                category,
                unit,
                description: description || '',
                status: this.getProductStatus(stock, minStock),
                createdBy: this.currentUser.id,
                createdByName: this.currentUser.fullName,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            this.data.products.push(product);
            await this.saveData();
            this.updateProductsTable();
            this.populateAllSelects();
            this.closeModal('productModal');

            await this.sendTelegramNotification(`📦 منتج جديد
📝 الاسم: ${name}
🏷️ الكود: ${code}
💰 السعر: ${this.formatCurrency(price)}
📊 الكمية: ${stock}
📂 الفئة: ${category}
👨‍💼 بواسطة: ${this.currentUser.fullName}`);

            this.addSuccessNotification('تم إضافة المنتج بنجاح');
            this.addActivityNotification({
                type: 'product',
                message: `منتج جديد - ${product.name}`,
                data: product
            });

            form.reset();

        } catch (error) {
            console.error('خطأ في إضافة المنتج:', error);
            this.addErrorNotification(error.message || 'خطأ في إضافة المنتج');
        }
    }

    async updateProduct(productId, form) {
        if (!this.checkPermission('edit_product', 'تعديل المنتج')) return;

        if (!(await this.verifyPassword('أدخل كلمة المرور لتعديل المنتج'))) {
            this.addWarningNotification('تم إلغاء تعديل المنتج');
            return;
        }

        try {
            const product = this.data.products.find(p => p.id === productId);
            if (!product) throw new Error('المنتج غير موجود');

            const name = document.getElementById('productName').value;
            const code = document.getElementById('productCode').value;
            const price = parseFloat(document.getElementById('productPrice').value);
            const cost = parseFloat(document.getElementById('productCost').value) || product.cost;
            const stock = parseInt(document.getElementById('productStock').value);
            const minStock = parseInt(document.getElementById('productMinStock').value) || 0;
            const category = document.getElementById('productCategory').value;
            const unit = document.getElementById('productUnit')?.value || product.unit;
            const description = document.getElementById('productDescription').value;

            if (!name || !code || !price || stock === undefined || !category) {
                throw new Error('يرجى ملء جميع الحقول المطلوبة');
            }

            // Check if product code already exists (excluding current product)
            const existingProduct = this.data.products.find(p => p.code === code && p.id !== productId);
            if (existingProduct) {
                throw new Error('كود المنتج موجود بالفعل');
            }

            Object.assign(product, {
                name,
                code,
                price,
                cost,
                stock,
                minStock,
                category,
                unit,
                description: description || '',
                status: this.getProductStatus(stock, minStock),
                updatedBy: this.currentUser.id,
                updatedByName: this.currentUser.fullName,
                updatedAt: new Date().toISOString()
            });

            await this.saveData();
            this.updateProductsTable();
            this.populateAllSelects();
            this.closeModal('productModal');

            await this.sendTelegramNotification(`✏️ تعديل منتج
📝 الاسم: ${name}
🏷️ الكود: ${code}
💰 السعر: ${this.formatCurrency(price)}
📊 الكمية: ${stock}
👨‍💼 بواسطة: ${this.currentUser.fullName}`);

            this.addSuccessNotification('تم تحديث بيانات المنتج بنجاح');
            this.resetEditMode();

        } catch (error) {
            console.error('خطأ في تعديل المنتج:', error);
            this.addErrorNotification(error.message || 'خطأ في تعديل المنتج');
        }
    }

    editProduct(productId) {
        const product = this.data.products.find(p => p.id === productId);
        if (!product) {
            this.addErrorNotification('المنتج غير موجود');
            return;
        }

        this.currentEditId = productId;
        this.currentEditType = 'product';

        // Populate form
        document.getElementById('productName').value = product.name;
        document.getElementById('productCode').value = product.code;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productCost').value = product.cost || 0;
        document.getElementById('productStock').value = product.stock;
        document.getElementById('productMinStock').value = product.minStock || 0;
        document.getElementById('productCategory').value = product.category;

        const unitSelect = document.getElementById('productUnit');
        if (unitSelect) unitSelect.value = product.unit || 'قطعة';

        document.getElementById('productDescription').value = product.description || '';

        // Update modal
        const modalTitle = document.querySelector('#productModal h2');
        if (modalTitle) modalTitle.textContent = 'تعديل المنتج';

        const submitBtn = document.querySelector('#productForm button[type="submit"]');
        if (submitBtn) submitBtn.innerHTML = '<i class="fas fa-save"></i> حفظ التعديلات';

        this.calculateProductProfit();
        this.openModal('productModal');
    }

    async deleteProduct(productId) {
        if (!this.checkPermission('delete_product', 'حذف المنتج')) return;

        if (!(await this.verifyPassword('أدخل كلمة المرور لحذف المنتج'))) {
            this.addWarningNotification('تم إلغاء حذف المنتج');
            return;
        }

        // Check relationships
        const hasSales = this.data.sales.some(s => s.productId === productId);

        if (hasSales) {
            this.addErrorNotification('لا يمكن حذف المنتج لوجود مبيعات مرتبطة به');
            return;
        }

        const confirmed = await this.showConfirmDialog(
            'هل أنت متأكد من حذف هذا المنتج؟',
            'تأكيد الحذف'
        );

        if (!confirmed) return;

        try {
            const productIndex = this.data.products.findIndex(p => p.id === productId);
            if (productIndex === -1) {
                this.addErrorNotification('المنتج غير موجود');
                return;
            }

            const product = this.data.products[productIndex];
            this.data.products.splice(productIndex, 1);

            await this.saveData();
            this.updateProductsTable();
            this.populateAllSelects();

            await this.sendTelegramNotification(`🗑️ حذف منتج
📝 الاسم: ${product.name}
🏷️ الكود: ${product.code}
💰 السعر: ${this.formatCurrency(product.price)}
👨‍💼 بواسطة: ${this.currentUser.fullName}`);

            this.addSuccessNotification('تم حذف المنتج بنجاح');

        } catch (error) {
            console.error('خطأ في حذف المنتج:', error);
            this.addErrorNotification('حدث خطأ أثناء حذف المنتج');
        }
    }

    async adjustStock(productId) {
        if (!this.checkPermission('adjust_stock', 'تعديل المخزون')) return;

        const product = this.data.products.find(p => p.id === productId);
        if (!product) {
            this.addErrorNotification('المنتج غير موجود');
            return;
        }

        const adjustmentHtml = `
            <div class="stock-adjustment">
                <div class="product-info">
                    <h4>${product.name}</h4>
                    <p>الكود: ${product.code}</p>
                    <p>المخزون الحالي: <span class="current-stock">${product.stock}</span> ${product.unit}</p>
                </div>
                
                <form id="stockAdjustmentForm">
                    <div class="form-group">
                        <label>نوع التعديل:</label>
                        <select id="adjustmentType" class="form-control" onchange="toggleAdjustmentReason()">
                            <option value="add">إضافة مخزون</option>
                            <option value="remove">خصم مخزون</option>
                            <option value="set">تحديد المخزون</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>الكمية:</label>
                        <input type="number" id="adjustmentQuantity" min="1" required class="form-control" placeholder="أدخل الكمية">
                    </div>
                    
                    <div class="form-group">
                        <label>سبب التعديل:</label>
                        <select id="adjustmentReason" class="form-control">
                            <option value="استلام بضاعة">استلام بضاعة جديدة</option>
                            <option value="جرد">تعديل بعد الجرد</option>
                            <option value="تالف">بضاعة تالفة</option>
                            <option value="مفقود">بضاعة مفقودة</option>
                            <option value="إرجاع">إرجاع من عميل</option>
                            <option value="هدايا">هدايا ترويجية</option>
                            <option value="أخرى">أخرى</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>ملاحظات:</label>
                        <textarea id="adjustmentNotes" rows="3" class="form-control" placeholder="ملاحظات إضافية (اختياري)"></textarea>
                    </div>
                    
                    <div class="adjustment-preview">
                        <p>المخزون بعد التعديل: <span id="newStockPreview">${product.stock}</span> ${product.unit}</p>
                    </div>
                </form>
            </div>
            
            <script>
                function toggleAdjustmentReason() {
                    const type = document.getElementById('adjustmentType').value;
                    const reasonSelect = document.getElementById('adjustmentReason');
                    
                    if (type === 'add') {
                        reasonSelect.innerHTML = \`
                            <option value="استلام بضاعة">استلام بضاعة جديدة</option>
                            <option value="جرد">تعديل بعد الجرد</option>
                            <option value="إرجاع">إرجاع من عميل</option>
                            <option value="أخرى">أخرى</option>
                        \`;
                    } else if (type === 'remove') {
                        reasonSelect.innerHTML = \`
                            <option value="تالف">بضاعة تالفة</option>
                            <option value="مفقود">بضاعة مفقودة</option>
                            <option value="جرد">تعديل بعد الجرد</option>
                            <option value="هدايا">هدايا ترويجية</option>
                            <option value="أخرى">أخرى</option>
                        \`;
                    } else {
                        reasonSelect.innerHTML = \`
                            <option value="جرد">جرد شامل</option>
                            <option value="تصحيح">تصحيح الأرقام</option>
                            <option value="أخرى">أخرى</option>
                        \`;
                    }
                    
                    updateStockPreview();
                }
                
                function updateStockPreview() {
                    const currentStock = ${product.stock};
                    const type = document.getElementById('adjustmentType').value;
                    const quantity = parseInt(document.getElementById('adjustmentQuantity').value) || 0;
                    let newStock = currentStock;
                    
                    if (type === 'add') {
                        newStock = currentStock + quantity;
                    } else if (type === 'remove') {
                        newStock = Math.max(0, currentStock - quantity);
                    } else if (type === 'set') {
                        newStock = quantity;
                    }
                    
                    document.getElementById('newStockPreview').textContent = newStock;
                    
                    // Update color based on stock level
                    const preview = document.getElementById('newStockPreview');
                    if (newStock <= ${product.minStock}) {
                        preview.style.color = '#dc3545';
                    } else {
                        preview.style.color = '#28a745';
                    }
                }
                
                document.getElementById('adjustmentQuantity').addEventListener('input', updateStockPreview);
                document.getElementById('adjustmentType').addEventListener('change', updateStockPreview);
            </script>
        `;

        this.showModal('تعديل المخزون', adjustmentHtml, 'modal-sm', [
            {
                text: 'إلغاء',
                class: 'btn-secondary',
                onClick: () => this.closeAllModals()
            },
            {
                text: 'تطبيق التعديل',
                class: 'btn-primary',
                onClick: () => this.applyStockAdjustment(productId)
            }
        ]);
    }

    async applyStockAdjustment(productId) {
        if (!(await this.verifyPassword('أدخل كلمة المرور لتعديل المخزون'))) {
            this.addWarningNotification('تم إلغاء تعديل المخزون');
            return;
        }

        try {
            const product = this.data.products.find(p => p.id === productId);
            if (!product) return;

            const type = document.getElementById('adjustmentType').value;
            const quantity = parseInt(document.getElementById('adjustmentQuantity').value);
            const reason = document.getElementById('adjustmentReason').value;
            const notes = document.getElementById('adjustmentNotes').value;

            if (!quantity || quantity <= 0) {
                this.addErrorNotification('يرجى إدخال كمية صحيحة');
                return;
            }

            const oldStock = product.stock;
            let newStock = oldStock;

            switch (type) {
                case 'add':
                    newStock = oldStock + quantity;
                    break;
                case 'remove':
                    newStock = Math.max(0, oldStock - quantity);
                    break;
                case 'set':
                    newStock = quantity;
                    break;
            }

            product.stock = newStock;
            product.status = this.getProductStatus(newStock, product.minStock);
            product.updatedBy = this.currentUser.id;
            product.updatedByName = this.currentUser.fullName;
            product.updatedAt = new Date().toISOString();

            // Log the adjustment
            const adjustment = {
                id: this.generateId('adj'),
                productId: product.id,
                productName: product.name,
                type: type,
                quantity: quantity,
                oldStock: oldStock,
                newStock: newStock,
                reason: reason,
                notes: notes,
                adjustedBy: this.currentUser.id,
                adjustedByName: this.currentUser.fullName,
                createdAt: new Date().toISOString()
            };

            if (!this.data.stockAdjustments) {
                this.data.stockAdjustments = [];
            }
            this.data.stockAdjustments.push(adjustment);

            await this.saveData();
            this.updateProductsTable();
            this.closeAllModals();

            const typeText = type === 'add' ? 'إضافة' : type === 'remove' ? 'خصم' : 'تحديد';

            await this.sendTelegramNotification(`📦 تعديل مخزون
📝 المنتج: ${product.name}
🔄 النوع: ${typeText}
📊 الكمية: ${quantity}
📈 المخزون السابق: ${oldStock}
📊 المخزون الجديد: ${newStock}
💭 السبب: ${reason}
👨‍💼 بواسطة: ${this.currentUser.fullName}`);

            this.addSuccessNotification(`تم ${typeText} المخزون بنجاح`);

        } catch (error) {
            console.error('خطأ في تعديل المخزون:', error);
            this.addErrorNotification('حدث خطأ أثناء تعديل المخزون');
        }
    }

    viewProductSales(productId) {
        const product = this.data.products.find(p => p.id === productId);
        if (!product) {
            this.addErrorNotification('المنتج غير موجود');
            return;
        }

        const productSales = this.data.sales.filter(s => s.productId === productId);
        const totalQuantitySold = productSales.reduce((sum, sale) => sum + sale.quantity, 0);
        const totalRevenue = productSales.reduce((sum, sale) => sum + sale.total, 0);

        const salesHtml = `
            <div class="product-sales">
                <div class="product-header">
                    <h3>مبيعات المنتج: ${product.name}</h3>
                    <div class="product-stats">
                        <span class="stat">إجمالي الكمية المباعة: ${totalQuantitySold}</span>
                        <span class="stat">إجمالي الإيرادات: ${this.formatCurrency(totalRevenue)}</span>
                        <span class="stat">عدد المبيعات: ${productSales.length}</span>
                    </div>
                </div>
                
                ${productSales.length > 0 ? `
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>رقم الفاتورة</th>
                                <th>العميل</th>
                                <th>الكمية</th>
                                <th>السعر</th>
                                <th>المجموع</th>
                                <th>التاريخ</th>
                                <th>المنشئ</th>
                                <th>الحالة</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${productSales.map(sale => {
            const customer = this.data.customers.find(c => c.id === sale.customerId);
            return `
                                    <tr>
                                        <td>${sale.invoiceNumber}</td>
                                        <td>${customer?.name || 'غير معروف'}</td>
                                        <td>${sale.quantity}</td>
                                        <td>${this.formatCurrency(sale.price)}</td>
                                        <td>${this.formatCurrency(sale.total)}</td>
                                        <td>${this.formatDate(sale.date)}</td>
                                        <td>${sale.createdByName || 'غير محدد'}</td>
                                        <td>
                                            <span class="status-badge status-${sale.status === 'مكتملة' ? 'completed' : 'pending'}">
                                                ${sale.status}
                                            </span>
                                        </td>
                                    </tr>
                                `;
        }).join('')}
                        </tbody>
                    </table>
                ` : '<p class="empty-state">لا توجد مبيعات لهذا المنتج</p>'}
            </div>
        `;

        this.showModal('مبيعات المنتج', salesHtml, 'modal-lg');
    }

    // =============================================
    // PROTECTED OPERATIONS - CUSTOMERS
    // =============================================

    async addCustomer(form) {
        if (!this.checkPermission('add_customer', 'إضافة عميل')) return;

        try {
            const name = document.getElementById('customerName').value;
            const phone = document.getElementById('customerPhone').value;
            const email = document.getElementById('customerEmail').value;
            const company = document.getElementById('customerCompany').value;
            const type = document.getElementById('customerType')?.value || 'individual';
            const address = document.getElementById('customerAddress').value;
            const notes = document.getElementById('customerNotes')?.value || '';

            if (!name || !phone) {
                throw new Error('يرجى ملء الحقول المطلوبة (الاسم ورقم الهاتف)');
            }

            // Validate phone number
            if (!this.validatePhone(phone)) {
                throw new Error('رقم الهاتف غير صحيح');
            }

            // Validate email if provided
            if (email && !this.validateEmail(email)) {
                throw new Error('البريد الإلكتروني غير صحيح');
            }

            // Check for duplicate phone numbers
            const existingCustomer = this.data.customers.find(c => c.phone === phone);
            if (existingCustomer) {
                throw new Error('رقم الهاتف مسجل بالفعل لعميل آخر');
            }

            const customer = {
                id: this.generateId('cust'),
                name,
                phone,
                email: email || '',
                company: company || '',
                type,
                address: address || '',
                notes,
                totalPurchases: 0,
                registrationDate: new Date().toISOString().split('T')[0],
                createdBy: this.currentUser.id,
                createdByName: this.currentUser.fullName,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            this.data.customers.push(customer);
            await this.saveData();
            this.updateCustomersTable();
            this.populateAllSelects();
            this.updateDashboard();
            this.closeModal('customerModal');

            await this.sendTelegramNotification(`👤 عميل جديد
📝 الاسم: ${name}
📱 الهاتف: ${phone}
🏢 الشركة: ${company || 'غير محدد'}
📧 البريد: ${email || 'غير محدد'}
📅 تاريخ التسجيل: ${this.formatDate(customer.registrationDate)}
👨‍💼 بواسطة: ${this.currentUser.fullName}`);

            this.addSuccessNotification('تم إضافة العميل بنجاح');
            this.addActivityNotification({
                type: 'customer',
                message: `عميل جديد - ${customer.name}`,
                data: customer
            });

            form.reset();

        } catch (error) {
            console.error('خطأ في إضافة العميل:', error);
            this.addErrorNotification(error.message || 'خطأ في إضافة العميل');
        }
    }

    async updateCustomer(customerId, form) {
        if (!this.checkPermission('edit_customer', 'تعديل العميل')) return;

        try {
            const customer = this.data.customers.find(c => c.id === customerId);
            if (!customer) throw new Error('العميل غير موجود');

            const name = document.getElementById('customerName').value;
            const phone = document.getElementById('customerPhone').value;
            const email = document.getElementById('customerEmail').value;
            const company = document.getElementById('customerCompany').value;
            const type = document.getElementById('customerType')?.value || customer.type;
            const address = document.getElementById('customerAddress').value;
            const notes = document.getElementById('customerNotes')?.value || '';

            if (!name || !phone) {
                throw new Error('يرجى ملء الحقول المطلوبة');
            }

            // Validate phone number
            if (!this.validatePhone(phone)) {
                throw new Error('رقم الهاتف غير صحيح');
            }

            // Validate email if provided
            if (email && !this.validateEmail(email)) {
                throw new Error('البريد الإلكتروني غير صحيح');
            }

            // Check for duplicate phone numbers (excluding current customer)
            const existingCustomer = this.data.customers.find(c => c.phone === phone && c.id !== customerId);
            if (existingCustomer) {
                throw new Error('رقم الهاتف مسجل بالفعل لعميل آخر');
            }

            Object.assign(customer, {
                name,
                phone,
                email: email || '',
                company: company || '',
                type,
                address: address || '',
                notes,
                updatedBy: this.currentUser.id,
                updatedByName: this.currentUser.fullName,
                updatedAt: new Date().toISOString()
            });

            await this.saveData();
            this.updateCustomersTable();
            this.populateAllSelects();
            this.closeModal('customerModal');

            await this.sendTelegramNotification(`✏️ تعديل عميل
📝 الاسم: ${name}
📱 الهاتف: ${phone}
🏢 الشركة: ${company || 'غير محدد'}
👨‍💼 بواسطة: ${this.currentUser.fullName}`);

            this.addSuccessNotification('تم تحديث بيانات العميل بنجاح');
            this.resetEditMode();

        } catch (error) {
            console.error('خطأ في تعديل العميل:', error);
            this.addErrorNotification(error.message || 'خطأ في تعديل العميل');
        }
    }

    editCustomer(customerId) {
        const customer = this.data.customers.find(c => c.id === customerId);
        if (!customer) {
            this.addErrorNotification('العميل غير موجود');
            return;
        }

        this.currentEditId = customerId;
        this.currentEditType = 'customer';

        // Populate form
        document.getElementById('customerName').value = customer.name;
        document.getElementById('customerPhone').value = customer.phone;
        document.getElementById('customerEmail').value = customer.email || '';
        document.getElementById('customerCompany').value = customer.company || '';

        const typeSelect = document.getElementById('customerType');
        if (typeSelect) typeSelect.value = customer.type || 'individual';

        document.getElementById('customerAddress').value = customer.address || '';

        const notesField = document.getElementById('customerNotes');
        if (notesField) notesField.value = customer.notes || '';

        // Update modal
        const modalTitle = document.querySelector('#customerModal h2');
        if (modalTitle) modalTitle.textContent = 'تعديل العميل';

        const submitBtn = document.querySelector('#customerForm button[type="submit"]');
        if (submitBtn) submitBtn.innerHTML = '<i class="fas fa-save"></i> حفظ التعديلات';

        this.openModal('customerModal');
    }

    async deleteCustomer(customerId) {
        if (!this.checkPermission('delete_customer', 'حذف العميل')) return;

        // Check relationships
        const hasSales = this.data.sales.some(s => s.customerId === customerId);
        const hasContracts = this.data.contracts.some(c => c.customerId === customerId);

        if (hasSales || hasContracts) {
            this.addErrorNotification('لا يمكن حذف العميل لوجود مبيعات أو اتفاقات مرتبطة به');
            return;
        }

        const confirmed = await this.showConfirmDialog(
            'هل أنت متأكد من حذف هذا العميل؟',
            'تأكيد الحذف'
        );

        if (!confirmed) return;

        try {
            const customerIndex = this.data.customers.findIndex(c => c.id === customerId);
            if (customerIndex === -1) {
                this.addErrorNotification('العميل غير موجود');
                return;
            }

            const customer = this.data.customers[customerIndex];
            this.data.customers.splice(customerIndex, 1);

            await this.saveData();
            this.updateCustomersTable();
            this.populateAllSelects();
            this.updateDashboard();

            await this.sendTelegramNotification(`🗑️ حذف عميل
📝 الاسم: ${customer.name}
📱 الهاتف: ${customer.phone}
👨‍💼 بواسطة: ${this.currentUser.fullName}`);

            this.addSuccessNotification('تم حذف العميل بنجاح');

        } catch (error) {
            console.error('خطأ في حذف العميل:', error);
            this.addErrorNotification('حدث خطأ أثناء حذف العميل');
        }
    }

    viewCustomerHistory(customerId) {
        const customer = this.data.customers.find(c => c.id === customerId);
        if (!customer) {
            this.addErrorNotification('العميل غير موجود');
            return;
        }

        const customerSales = this.data.sales.filter(s => s.customerId === customerId);
        const customerContracts = this.data.contracts.filter(c => c.customerId === customerId);

        const historyHtml = `
            <div class="customer-history">
                <div class="customer-header">
                    <h3>تاريخ العميل: ${customer.name}</h3>
                    <div class="customer-stats">
                        <span class="stat">إجمالي المشتريات: ${this.formatCurrency(customer.totalPurchases)}</span>
                        <span class="stat">عدد المبيعات: ${customerSales.length}</span>
                        <span class="stat">عدد الاتفاقات: ${customerContracts.length}</span>
                    </div>
                </div>
                
                <div class="history-tabs">
                    <button class="tab-btn active" onclick="showHistoryTab('sales')">
                        المبيعات (${customerSales.length})
                    </button>
                    <button class="tab-btn" onclick="showHistoryTab('contracts')">
                        الاتفاقات (${customerContracts.length})
                    </button>
                    <button class="tab-btn" onclick="showHistoryTab('summary')">
                        ملخص العميل
                    </button>
                </div>
                
                <div id="sales-history" class="history-content active">
                    ${customerSales.length > 0 ? `
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>رقم الفاتورة</th>
                                    <th>المنتج</th>
                                    <th>الكمية</th>
                                    <th>المبلغ</th>
                                    <th>التاريخ</th>
                                    <th>المنشئ</th>
                                    <th>الحالة</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${customerSales.map(sale => `
                                    <tr>
                                        <td>${sale.invoiceNumber}</td>
                                        <td>${sale.productName}</td>
                                        <td>${sale.quantity}</td>
                                        <td>${this.formatCurrency(sale.total)}</td>
                                        <td>${this.formatDate(sale.date)}</td>
                                        <td>${sale.createdByName || 'غير محدد'}</td>
                                        <td>
                                            <span class="status-badge status-${sale.status === 'مكتملة' ? 'completed' : 'pending'}">
                                                ${sale.status}                                            </span>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    ` : '<p class="empty-state">لا توجد مبيعات لهذا العميل</p>'}
                </div>
                
                <div id="contracts-history" class="history-content">
                    ${customerContracts.length > 0 ? `
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>رقم الاتفاق</th>
                                    <th>النوع</th>
                                    <th>القيمة</th>
                                    <th>تاريخ البداية</th>
                                    <th>تاريخ الانتهاء</th>
                                    <th>الحالة</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${customerContracts.map(contract => `
                                    <tr>
                                        <td>${contract.contractNumber}</td>
                                        <td>${contract.type}</td>
                                        <td>${this.formatCurrency(contract.value)}</td>
                                        <td>${this.formatDate(contract.startDate)}</td>
                                        <td>${this.formatDate(contract.endDate)}</td>
                                        <td>
                                            <span class="status-badge status-${contract.status === 'نشط' ? 'active' : 'completed'}">
                                                ${contract.status}
                                            </span>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    ` : '<p class="empty-state">لا توجد اتفاقات لهذا العميل</p>'}
                </div>
                
                <div id="summary-history" class="history-content">
                    <div class="customer-summary">
                        <div class="summary-section">
                            <h4>معلومات العميل</h4>
                            <div class="info-grid">
                                <div class="info-item">
                                    <label>الاسم:</label>
                                    <span>${customer.name}</span>
                                </div>
                                <div class="info-item">
                                    <label>الهاتف:</label>
                                    <span>${customer.phone}</span>
                                </div>
                                <div class="info-item">
                                    <label>البريد الإلكتروني:</label>
                                    <span>${customer.email || 'غير محدد'}</span>
                                </div>
                                <div class="info-item">
                                    <label>الشركة:</label>
                                    <span>${customer.company || 'غير محدد'}</span>
                                </div>
                                <div class="info-item">
                                    <label>النوع:</label>
                                    <span>${customer.type === 'individual' ? 'فرد' : customer.type === 'company' ? 'شركة' : 'جهة حكومية'}</span>
                                </div>
                                <div class="info-item">
                                    <label>تاريخ التسجيل:</label>
                                    <span>${this.formatDate(customer.registrationDate)}</span>
                                </div>
                            </div>
                            ${customer.address ? `
                                <div class="info-item full-width">
                                    <label>العنوان:</label>
                                    <span>${customer.address}</span>
                                </div>
                            ` : ''}
                            ${customer.notes ? `
                                <div class="info-item full-width">
                                    <label>ملاحظات:</label>
                                    <span>${customer.notes}</span>
                                </div>
                            ` : ''}
                        </div>
                        
                        <div class="summary-section">
                            <h4>إحصائيات التعامل</h4>
                            <div class="stats-grid">
                                <div class="stat-item">
                                    <span class="stat-label">إجمالي المشتريات:</span>
                                    <span class="stat-value">${this.formatCurrency(customer.totalPurchases)}</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-label">عدد المبيعات:</span>
                                    <span class="stat-value">${customerSales.length}</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-label">عدد الاتفاقات:</span>
                                    <span class="stat-value">${customerContracts.length}</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-label">متوسط قيمة الطلب:</span>
                                    <span class="stat-value">${customerSales.length > 0 ? this.formatCurrency(customer.totalPurchases / customerSales.length) : '0 ج.م'}</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-label">آخر عملية شراء:</span>
                                    <span class="stat-value">${customerSales.length > 0 ? this.formatDate(customerSales[customerSales.length - 1].date) : 'لا يوجد'}</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-label">فترة العضوية:</span>
                                    <span class="stat-value">${this.calculateMembershipPeriod(customer.registrationDate)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="detail-actions">
                    <button class="btn btn-primary" onclick="salesSystem.sendCustomerReport('${customer.id}')">
                        <i class="fab fa-telegram"></i> إرسال تقرير
                    </button>
                    ${this.hasPermission('edit_customer') ? `
                        <button class="btn btn-secondary" onclick="salesSystem.editCustomer('${customer.id}')">
                            <i class="fas fa-edit"></i> تعديل بيانات العميل
                        </button>
                    ` : ''}
                </div>
            </div>
            
            <script>
                function showHistoryTab(tab) {
                    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
                    document.querySelectorAll('.history-content').forEach(content => content.classList.remove('active'));
                    
                    event.target.classList.add('active');
                    document.getElementById(tab + '-history').classList.add('active');
                }
            </script>
        `;

        this.showModal('تاريخ العميل', historyHtml, 'modal-lg');
    }

    calculateMembershipPeriod(registrationDate) {
        const regDate = new Date(registrationDate);
        const today = new Date();
        const diffTime = Math.abs(today - regDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 30) {
            return `${diffDays} يوم`;
        } else if (diffDays < 365) {
            const months = Math.floor(diffDays / 30);
            return `${months} شهر`;
        } else {
            const years = Math.floor(diffDays / 365);
            const remainingMonths = Math.floor((diffDays % 365) / 30);
            return years > 0 ? `${years} سنة${remainingMonths > 0 ? ` و ${remainingMonths} شهر` : ''}` : `${remainingMonths} شهر`;
        }
    }

    async sendCustomerReport(customerId) {
        const customer = this.data.customers.find(c => c.id === customerId);
        if (!customer) {
            this.addErrorNotification('العميل غير موجود');
            return;
        }

        if (!this.isOnline) {
            this.addWarningNotification('يتطلب الاتصال بالإنترنت لإرسال التقرير');
            return;
        }

        const customerSales = this.data.sales.filter(s => s.customerId === customerId);
        const customerContracts = this.data.contracts.filter(c => c.customerId === customerId);

        const report = `📊 تقرير العميل - ${customer.name}

👤 معلومات العميل:
• الاسم: ${customer.name}
• الهاتف: ${customer.phone}
• الشركة: ${customer.company || 'غير محدد'}
• تاريخ التسجيل: ${this.formatDate(customer.registrationDate)}

📈 إحصائيات التعامل:
• إجمالي المشتريات: ${this.formatCurrency(customer.totalPurchases)}
• عدد المبيعات: ${customerSales.length}
• عدد الاتفاقات: ${customerContracts.length}
• متوسط قيمة الطلب: ${customerSales.length > 0 ? this.formatCurrency(customer.totalPurchases / customerSales.length) : '0 ج.م'}

🕐 آخر نشاط: ${customerSales.length > 0 ? this.formatDate(customerSales[customerSales.length - 1].date) : 'لا يوجد'}

👨‍💼 تم إنشاؤه بواسطة: ${this.currentUser.fullName}
📅 التاريخ: ${this.formatDateTime(new Date())}
🏷️ تم إنشاؤه بواسطة نظام Tag ElMalek`;

        await this.sendTelegramNotification(report);
        this.addSuccessNotification('تم إرسال تقرير العميل بنجاح');
    }

    // =============================================
    // PROTECTED OPERATIONS - CONTRACTS
    // =============================================

    async addContract(form) {
        if (!this.checkPermission('add_contract', 'إضافة اتفاق')) return;

        if (!(await this.verifyPassword('أدخل كلمة المرور لإضافة اتفاق جديد'))) {
            this.addWarningNotification('تم إلغاء إضافة الاتفاق');
            return;
        }

        try {
            const customerId = document.getElementById('contractCustomer').value;
            const type = document.getElementById('contractType').value;
            const value = parseFloat(document.getElementById('contractValue').value);
            const duration = parseInt(document.getElementById('contractDuration').value);
            const startDate = document.getElementById('contractStartDate').value;
            const endDate = document.getElementById('contractEndDate').value;
            const status = document.getElementById('contractStatus')?.value || 'نشط';
            const details = document.getElementById('contractDetails').value;
            const terms = document.getElementById('contractTerms')?.value || '';

            if (!customerId || !type || !value || !duration || !startDate || !endDate || !details) {
                throw new Error('يرجى ملء جميع الحقول المطلوبة');
            }

            const customer = this.data.customers.find(c => c.id === customerId);
            if (!customer) {
                throw new Error('العميل غير موجود');
            }

            const contract = {
                id: this.generateId('cont'),
                contractNumber: this.generateContractNumber(),
                customerId,
                customerName: customer.name,
                type,
                value,
                duration,
                startDate,
                endDate,
                status,
                details,
                terms,
                createdBy: this.currentUser.id,
                createdByName: this.currentUser.fullName,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            this.data.contracts.push(contract);
            await this.saveData();
            this.updateContractsTable();
            this.updateDashboard();
            this.closeModal('contractModal');

            await this.sendTelegramNotification(`📝 اتفاق جديد
📋 رقم الاتفاق: ${contract.contractNumber}
👤 العميل: ${customer.name}
📋 النوع: ${type}
💰 القيمة: ${this.formatCurrency(value)}
⏰ المدة: ${duration} شهر
📅 من: ${this.formatDate(startDate)} إلى: ${this.formatDate(endDate)}
👨‍💼 بواسطة: ${this.currentUser.fullName}`);

            this.addSuccessNotification('تم إضافة الاتفاق بنجاح');
            this.addActivityNotification({
                type: 'contract',
                message: `اتفاق جديد - ${contract.contractNumber}`,
                data: contract
            });

            form.reset();

        } catch (error) {
            console.error('خطأ في إضافة الاتفاق:', error);
            this.addErrorNotification(error.message || 'خطأ في إضافة الاتفاق');
        }
    }

    async updateContract(contractId, form) {
        if (!this.checkPermission('edit_contract', 'تعديل الاتفاق')) return;

        if (!(await this.verifyPassword('أدخل كلمة المرور لتعديل الاتفاق'))) {
            this.addWarningNotification('تم إلغاء تعديل الاتفاق');
            return;
        }

        try {
            const contract = this.data.contracts.find(c => c.id === contractId);
            if (!contract) throw new Error('الاتفاق غير موجود');

            const customerId = document.getElementById('contractCustomer').value;
            const type = document.getElementById('contractType').value;
            const value = parseFloat(document.getElementById('contractValue').value);
            const duration = parseInt(document.getElementById('contractDuration').value);
            const startDate = document.getElementById('contractStartDate').value;
            const endDate = document.getElementById('contractEndDate').value;
            const status = document.getElementById('contractStatus')?.value || contract.status;
            const details = document.getElementById('contractDetails').value;
            const terms = document.getElementById('contractTerms')?.value || '';

            if (!customerId || !type || !value || !duration || !startDate || !endDate || !details) {
                throw new Error('يرجى ملء جميع الحقول المطلوبة');
            }

            const customer = this.data.customers.find(c => c.id === customerId);
            if (!customer) {
                throw new Error('العميل غير موجود');
            }

            const oldValue = contract.value;
            Object.assign(contract, {
                customerId,
                customerName: customer.name,
                type,
                value,
                duration,
                startDate,
                endDate,
                status,
                details,
                terms,
                updatedBy: this.currentUser.id,
                updatedByName: this.currentUser.fullName,
                updatedAt: new Date().toISOString()
            });

            await this.saveData();
            this.updateContractsTable();
            this.updateDashboard();
            this.closeModal('contractModal');

            await this.sendTelegramNotification(`✏️ تعديل اتفاق
📋 رقم الاتفاق: ${contract.contractNumber}
👤 العميل: ${customer.name}
💰 القيمة الجديدة: ${this.formatCurrency(value)}
💰 القيمة السابقة: ${this.formatCurrency(oldValue)}
👨‍💼 بواسطة: ${this.currentUser.fullName}`);

            this.addSuccessNotification('تم تحديث الاتفاق بنجاح');
            this.resetEditMode();

        } catch (error) {
            console.error('خطأ في تعديل الاتفاق:', error);
            this.addErrorNotification(error.message || 'خطأ في تعديل الاتفاق');
        }
    }

    editContract(contractId) {
        const contract = this.data.contracts.find(c => c.id === contractId);
        if (!contract) {
            this.addErrorNotification('الاتفاق غير موجود');
            return;
        }

        this.currentEditId = contractId;
        this.currentEditType = 'contract';

        // Populate form
        document.getElementById('contractCustomer').value = contract.customerId;
        document.getElementById('contractType').value = contract.type;
        document.getElementById('contractValue').value = contract.value;
        document.getElementById('contractDuration').value = contract.duration;
        document.getElementById('contractStartDate').value = contract.startDate;
        document.getElementById('contractEndDate').value = contract.endDate;

        const statusSelect = document.getElementById('contractStatus');
        if (statusSelect) statusSelect.value = contract.status;

        document.getElementById('contractDetails').value = contract.details;

        const termsField = document.getElementById('contractTerms');
        if (termsField) termsField.value = contract.terms || '';

        // Update modal
        const modalTitle = document.querySelector('#contractModal h2');
        if (modalTitle) modalTitle.textContent = 'تعديل الاتفاق';

        const submitBtn = document.querySelector('#contractForm button[type="submit"]');
        if (submitBtn) submitBtn.innerHTML = '<i class="fas fa-save"></i> حفظ التعديلات';

        this.openModal('contractModal');
    }

    async deleteContract(contractId) {
        if (!this.checkPermission('delete_contract', 'حذف الاتفاق')) return;

        if (!(await this.verifyPassword('أدخل كلمة المرور لحذف الاتفاق'))) {
            this.addWarningNotification('تم إلغاء حذف الاتفاق');
            return;
        }

        const confirmed = await this.showConfirmDialog(
            'هل أنت متأكد من حذف هذا الاتفاق؟',
            'تأكيد الحذف'
        );

        if (!confirmed) return;

        try {
            const contractIndex = this.data.contracts.findIndex(c => c.id === contractId);
            if (contractIndex === -1) {
                this.addErrorNotification('الاتفاق غير موجود');
                return;
            }

            const contract = this.data.contracts[contractIndex];
            this.data.contracts.splice(contractIndex, 1);

            await this.saveData();
            this.updateContractsTable();
            this.updateDashboard();

            await this.sendTelegramNotification(`🗑️ حذف اتفاق
📋 رقم الاتفاق: ${contract.contractNumber}
👤 العميل: ${contract.customerName}
💰 القيمة: ${this.formatCurrency(contract.value)}
👨‍💼 بواسطة: ${this.currentUser.fullName}`);

            this.addSuccessNotification('تم حذف الاتفاق بنجاح');

        } catch (error) {
            console.error('خطأ في حذف الاتفاق:', error);
            this.addErrorNotification('حدث خطأ أثناء حذف الاتفاق');
        }
    }

    viewContractDetails(contractId) {
        const contract = this.data.contracts.find(c => c.id === contractId);
        if (!contract) {
            this.addErrorNotification('الاتفاق غير موجود');
            return;
        }

        const customer = this.data.customers.find(c => c.id === contract.customerId);
        const remainingDays = this.calculateRemainingDays(contract.endDate);

        const detailsHtml = `
            <div class="contract-details">
                <div class="detail-header">
                    <h3>تفاصيل الاتفاق ${contract.contractNumber}</h3>
                    <span class="status-badge status-${contract.status === 'نشط' ? 'active' : 'completed'}">
                        ${contract.status}
                    </span>
                </div>
                
                <div class="detail-grid">
                    <div class="detail-section">
                        <h4>معلومات العميل</h4>
                        <p><strong>الاسم:</strong> ${customer?.name || 'غير معروف'}</p>
                        <p><strong>الهاتف:</strong> ${customer?.phone || 'غير متاح'}</p>
                        <p><strong>الشركة:</strong> ${customer?.company || 'غير محدد'}</p>
                    </div>
                    
                    <div class="detail-section">
                        <h4>تفاصيل الاتفاق</h4>
                        <p><strong>النوع:</strong> ${contract.type}</p>
                        <p><strong>القيمة:</strong> ${this.formatCurrency(contract.value)}</p>
                        <p><strong>المدة:</strong> ${contract.duration} شهر</p>
                        <p><strong>المدة المتبقية:</strong> ${remainingDays > 0 ? `${remainingDays} يوم` : 'منتهي'}</p>
                    </div>
                    
                    <div class="detail-section">
                        <h4>التواريخ</h4>
                        <p><strong>تاريخ البداية:</strong> ${this.formatDate(contract.startDate)}</p>
                        <p><strong>تاريخ الانتهاء:</strong> ${this.formatDate(contract.endDate)}</p>
                        <p><strong>تاريخ الإنشاء:</strong> ${this.formatDateTime(contract.createdAt)}</p>
                        <p><strong>آخر تحديث:</strong> ${this.formatDateTime(contract.updatedAt)}</p>
                        <p><strong>أنشأ بواسطة:</strong> ${contract.createdByName || 'غير محدد'}</p>
                        ${contract.updatedBy ? `<p><strong>عدل بواسطة:</strong> ${contract.updatedByName}</p>` : ''}
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4>تفاصيل الاتفاق</h4>
                    <div class="contract-details-text">${contract.details}</div>
                </div>
                
                ${contract.terms ? `
                    <div class="detail-section">
                        <h4>الشروط والأحكام</h4>
                        <div class="contract-terms-text">${contract.terms}</div>
                    </div>
                ` : ''}
                
                <div class="detail-actions">
                    <button class="btn btn-primary" onclick="salesSystem.printContract('${contract.id}')">
                        <i class="fas fa-print"></i> طباعة الاتفاق
                    </button>
                    ${this.hasPermission('edit_contract') ? `
                        <button class="btn btn-secondary" onclick="salesSystem.editContract('${contract.id}')">
                            <i class="fas fa-edit"></i> تعديل
                        </button>
                    ` : ''}
                </div>
            </div>
        `;

        this.showModal('تفاصيل الاتفاق', detailsHtml, 'modal-lg');
    }

    printContract(contractId) {
        const contract = this.data.contracts.find(c => c.id === contractId);
        if (!contract) {
            this.addErrorNotification('الاتفاق غير موجود');
            return;
        }

        const customer = this.data.customers.find(c => c.id === contract.customerId);

        const printWindow = window.open('', '_blank');
        const content = `
            <!DOCTYPE html>
            <html dir="rtl" lang="ar">
            <head>
                <meta charset="UTF-8">
                <title>اتفاق - ${contract.contractNumber}</title>
                <style>
                    body { 
                        font-family: 'Arial', sans-serif; 
                        margin: 20px; 
                        direction: rtl; 
                        line-height: 1.8;
                    }
                    .header { 
                        text-align: center; 
                        border-bottom: 3px solid #667eea; 
                        padding-bottom: 20px; 
                        margin-bottom: 30px;
                    }
                    .contract-title {
                        font-size: 2rem;
                        color: #667eea;
                        margin: 20px 0;
                    }
                    .contract-info {
                        background: #f8f9fa;
                        padding: 20px;
                        border-radius: 5px;
                        margin: 20px 0;
                    }
                    .parties {
                        display: flex;
                        justify-content: space-between;
                        margin: 30px 0;
                    }
                    .party {
                        flex: 1;
                        padding: 20px;
                        border: 1px solid #dee2e6;
                        border-radius: 5px;
                        margin: 0 10px;
                    }
                    .details-section {
                        margin: 30px 0;
                        padding: 20px;
                        border: 1px solid #dee2e6;
                        border-radius: 5px;
                    }
                    .signature-section {
                        display: flex;
                        justify-content: space-between;
                        margin-top: 50px;
                        padding-top: 30px;
                        border-top: 2px solid #667eea;
                    }
                    .signature-box {
                        text-align: center;
                        width: 200px;
                    }
                    @media print { 
                        body { margin: 0; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>🏷️ Tag ElMalek</h1>
                    <p>نظام إدارة المبيعات والاتفاقات</p>
                </div>
                
                <h2 class="contract-title">اتفاق ${contract.type}</h2>
                
                <div class="contract-info">
                    <p><strong>رقم الاتفاق:</strong> ${contract.contractNumber}</p>
                    <p><strong>تاريخ الاتفاق:</strong> ${this.formatDate(contract.startDate)}</p>
                    <p><strong>حالة الاتفاق:</strong> ${contract.status}</p>
                </div>
                
                <div class="parties">
                    <div class="party">
                        <h3>الطرف الأول</h3>
                        <p><strong>شركة Tag ElMalek</strong></p>
                        <p>للخدمات التقنية والتجارية</p>
                    </div>
                    <div class="party">
                        <h3>الطرف الثاني</h3>
                        <p><strong>${customer?.name || 'غير محدد'}</strong></p>
                        ${customer?.company ? `<p>${customer.company}</p>` : ''}
                        <p>هاتف: ${customer?.phone || 'غير متاح'}</p>
                    </div>
                </div>
                
                <div class="details-section">
                    <h3>تفاصيل الاتفاق</h3>
                    <p><strong>نوع الاتفاق:</strong> ${contract.type}</p>
                    <p><strong>قيمة الاتفاق:</strong> ${this.formatCurrency(contract.value)}</p>
                    <p><strong>مدة الاتفاق:</strong> ${contract.duration} شهر</p>
                    <p><strong>تاريخ البداية:</strong> ${this.formatDate(contract.startDate)}</p>
                    <p><strong>تاريخ الانتهاء:</strong> ${this.formatDate(contract.endDate)}</p>
                </div>
                
                <div class="details-section">
                    <h3>وصف الخدمات</h3>
                    <p>${contract.details}</p>
                </div>
                
                ${contract.terms ? `
                    <div class="details-section">
                        <h3>الشروط والأحكام</h3>
                        <p>${contract.terms}</p>
                    </div>
                ` : ''}
                
                <div class="signature-section">
                    <div class="signature-box">
                        <p>توقيع الطرف الأول</p>
                        <br><br>
                        <p>________________</p>
                        <p>Tag ElMalek</p>
                    </div>
                    <div class="signature-box">
                        <p>توقيع الطرف الثاني</p>
                        <br><br>
                        <p>________________</p>
                        <p>${customer?.name || 'العميل'}</p>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 40px; color: #666;">
                    <p>تم إنشاء هذا الاتفاق بواسطة نظام Tag ElMalek</p>
                    <p>تاريخ الطباعة: ${this.formatDateTime(new Date())}</p>
                    ${this.currentUser ? `<p>طبع بواسطة: ${this.currentUser.fullName}</p>` : ''}
                </div>
            </body>
            </html>
        `;

        printWindow.document.write(content);
        printWindow.document.close();

        setTimeout(() => {
            printWindow.print();
        }, 1000);

        this.addSuccessNotification('تم إرسال الاتفاق للطباعة');
    }

    // =============================================
    // EXPORT & IMPORT OPERATIONS
    // =============================================

    async exportData() {
        if (!this.checkPermission('export_data', 'تصدير البيانات')) return;

        if (!(await this.verifyPassword('أدخل كلمة المرور لتصدير البيانات'))) {
            this.addWarningNotification('تم إلغاء تصدير البيانات');
            return;
        }

        try {
            const exportData = {
                ...this.data,
                exportInfo: {
                    exportDate: new Date().toISOString(),
                    version: this.version,
                    exportedBy: this.currentUser.fullName,
                    totalRecords: {
                        sales: this.data.sales.length,
                        contracts: this.data.contracts.length,
                        customers: this.data.customers.length,
                        products: this.data.products.length
                    }
                }
            };

            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json;charset=utf-8' });

            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `TagElMalek_Export_${new Date().toISOString().split('T')[0]}.json`;
            link.click();

            this.addSuccessNotification('تم تصدير البيانات بنجاح');

            await this.sendTelegramNotification(`💾 تم إنشاء نسخة احتياطية
📊 المبيعات: ${this.data.sales.length}
📝 الاتفاقات: ${this.data.contracts.length}
👥 العملاء: ${this.data.customers.length}
📦 المنتجات: ${this.data.products.length}
💿 حجم البيانات: ${(dataBlob.size / 1024).toFixed(1)} كيلوبايت
👨‍💼 بواسطة: ${this.currentUser.fullName}`);

        } catch (error) {
            console.error('خطأ في تصدير البيانات:', error);
            this.addErrorNotification('خطأ في تصدير البيانات');
        }
    }

    async importData() {
        if (!this.checkPermission('export_data', 'استيراد البيانات')) return;

        if (!(await this.verifyPassword('أدخل كلمة المرور لاستيراد البيانات'))) {
            this.addWarningNotification('تم إلغاء استيراد البيانات');
            return;
        }

        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            try {
                this.showLoading(true);
                const text = await file.text();
                const importedData = JSON.parse(text);

                const requiredKeys = ['sales', 'contracts', 'customers', 'products'];
                const hasValidStructure = requiredKeys.every(key => Array.isArray(importedData[key]));

                if (!hasValidStructure) {
                    throw new Error('هيكل البيانات غير صحيح');
                }

                const confirmed = await this.showConfirmDialog(
                    `هل أنت متأكد من استيراد البيانات؟ سيتم استبدال البيانات الحالية.
                    
                    البيانات المستوردة:
                    • المبيعات: ${importedData.sales.length}
                    • الاتفاقات: ${importedData.contracts.length}
                    • العملاء: ${importedData.customers.length}
                    • المنتجات: ${importedData.products.length}`,
                    'تأكيد الاستيراد'
                );

                if (confirmed) {
                    const backupData = { ...this.data };

                    try {
                        this.data = { ...this.data, ...importedData };
                        this.data.metadata.importDate = new Date().toISOString();
                        this.data.metadata.version = this.version;

                        await this.saveData();
                        this.updateAllSections();
                        this.populateAllSelects();

                        this.addSuccessNotification('تم استيراد البيانات بنجاح');

                        await this.sendTelegramNotification(`📥 تم استيراد البيانات
📊 المبيعات: ${this.data.sales.length}
📝 الاتفاقات: ${this.data.contracts.length}
👥 العملاء: ${this.data.customers.length}
📦 المنتجات: ${this.data.products.length}
👨‍💼 بواسطة: ${this.currentUser.fullName}`);

                    } catch (error) {
                        this.data = backupData;
                        throw error;
                    }
                }

            } catch (error) {
                console.error('خطأ في استيراد البيانات:', error);
                this.addErrorNotification('خطأ في استيراد البيانات: ' + error.message);
            } finally {
                this.showLoading(false);
            }
        };
        input.click();
    }

    // =============================================
    // FORM HANDLING AND CALCULATIONS
    // =============================================

    async handleFormSubmission(type, form) {
        try {
            this.showLoading(true);

            if (!this.validateForm(form)) {
                this.addErrorNotification('يرجى تصحيح الأخطاء في النموذج');
                return;
            }

            if (this.currentEditId) {
                await this[`update${this.capitalize(type)}`](this.currentEditId, form);
            } else {
                await this[`add${this.capitalize(type)}`](form);
            }

        } catch (error) {
            console.error(`خطأ في معالجة نموذج ${type}:`, error);
            this.addErrorNotification(error.message || `خطأ في ${this.getTypeName(type)}`);
        } finally {
            this.showLoading(false);
        }
    }

    validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.getAttribute('data-field-name') || field.name || field.id;

        this.clearFieldError(field);

        if (field.hasAttribute('required') && !value) {
            this.showFieldError(field, `${fieldName} مطلوب`);
            return false;
        }

        if (field.type === 'email' && value && !this.validateEmail(value)) {
            this.showFieldError(field, 'البريد الإلكتروني غير صحيح');
            return false;
        }

        if (field.type === 'tel' && value && !this.validatePhone(value)) {
            this.showFieldError(field, 'رقم الهاتف غير صحيح');
            return false;
        }

        if (field.type === 'number' && value) {
            const num = parseFloat(value);
            const min = parseFloat(field.min);
            const max = parseFloat(field.max);

            if (isNaN(num)) {
                this.showFieldError(field, 'يجب إدخال رقم صحيح');
                return false;
            }

            if (!isNaN(min) && num < min) {
                this.showFieldError(field, `القيمة يجب أن تكون ${min} أو أكثر`);
                return false;
            }

            if (!isNaN(max) && num > max) {
                this.showFieldError(field, `القيمة يجب أن تكون ${max} أو أقل`);
                return false;
            }
        }

        return true;
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

    calculateSaleTotal() {
        const quantity = parseInt(document.getElementById('saleQuantity')?.value) || 0;
        const price = parseFloat(document.getElementById('salePrice')?.value) || 0;

        const subtotal = quantity * price;
        const taxRate = 0.14; // 14% VAT
        const tax = subtotal * taxRate;
        const total = subtotal + tax;

        const updates = {
            'saleSubtotal': this.formatCurrency(subtotal),
            'saleTax': this.formatCurrency(tax),
            'saleTotal': this.formatCurrency(total)
        };

        Object.entries(updates).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });

        return { subtotal, tax, total };
    }

    calculateProductProfit() {
        const price = parseFloat(document.getElementById('productPrice')?.value) || 0;
        const cost = parseFloat(document.getElementById('productCost')?.value) || 0;

        const profit = price - cost;
        const margin = cost > 0 ? ((profit / cost) * 100) : 0;

        const updates = {
            'productProfitMargin': `${margin.toFixed(1)}%`,
            'productExpectedProfit': this.formatCurrency(profit)
        };

        Object.entries(updates).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });

        return { profit, margin };
    }

    calculateContractEndDate() {
        const startDate = document.getElementById('contractStartDate')?.value;
        const duration = parseInt(document.getElementById('contractDuration')?.value);

        if (startDate && duration) {
            const start = new Date(startDate);
            const end = this.addMonths(start, duration);
            const endInput = document.getElementById('contractEndDate');
            if (endInput) {
                endInput.value = end.toISOString().split('T')[0];
            }
        }
    }

    // =============================================
    // EVENT LISTENERS SETUP
    // =============================================

    setupEventListeners() {
        this.setupFormHandlers();
        this.setupCalculations();
        this.setupSearchHandlers();
        this.setupTableHandlers();

        window.addEventListener('beforeunload', (e) => {
            this.saveData();
        });

        window.addEventListener('online', () => {
            this.isOnline = true;
            this.addSuccessNotification('تم الاتصال بالإنترنت');
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.addWarningNotification('انقطع الاتصال بالإنترنت - النظام يعمل بوضع عدم الاتصال');
        });

        console.log('📡 تم تفعيل مستمعي الأحداث');
    }

    setupFormHandlers() {
        const forms = ['saleForm', 'contractForm', 'customerForm', 'productForm'];

        forms.forEach(formId => {
            const form = document.getElementById(formId);
            if (form) {
                form.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const type = formId.replace('Form', '');
                    await this.handleFormSubmission(type, form);
                });
            }
        });
    }

    setupCalculations() {
        const saleQuantity = document.getElementById('saleQuantity');
        const salePrice = document.getElementById('salePrice');
        const saleProduct = document.getElementById('saleProduct');

        if (saleQuantity && salePrice) {
            [saleQuantity, salePrice].forEach(input => {
                input.addEventListener('input', () => this.calculateSaleTotal());
            });
        }

        if (saleProduct) {
            saleProduct.addEventListener('change', (e) => {
                const product = this.data.products.find(p => p.id === e.target.value);
                if (product && salePrice) {
                    salePrice.value = product.price;
                    this.calculateSaleTotal();
                }
            });
        }

        const productPrice = document.getElementById('productPrice');
        const productCost = document.getElementById('productCost');

        if (productPrice && productCost) {
            [productPrice, productCost].forEach(input => {
                input.addEventListener('input', () => this.calculateProductProfit());
            });
        }

        const contractStart = document.getElementById('contractStartDate');
        const contractDuration = document.getElementById('contractDuration');

        if (contractStart && contractDuration) {
            [contractStart, contractDuration].forEach(input => {
                input.addEventListener('change', () => this.calculateContractEndDate());
            });
        }
    }

    setupSearchHandlers() {
        const searchInputs = [
            'salesSearch', 'contractsSearch', 'customersSearch', 'productsSearch'
        ];

        searchInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('input', this.debounce((e) => {
                    const type = inputId.replace('Search', '');
                    this.performAdvancedSearch(type, e.target.value);
                }, 300));
            }
        });
    }

    setupTableHandlers() {
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('row-checkbox')) {
                this.handleRowSelection();
            }
        });

        const selectAllCheckboxes = document.querySelectorAll('[id^="selectAll"]');
        selectAllCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const tableType = e.target.id.replace('selectAll', '').replace('Checkbox', '').toLowerCase();
                this.toggleSelectAll(tableType);
            });
        });
    }

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        const sections = document.querySelectorAll('.section');
        const pageTitle = document.getElementById('pageTitle');
        const breadcrumb = document.getElementById('breadcrumb');

        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();

                navItems.forEach(nav => nav.classList.remove('active'));
                sections.forEach(section => section.classList.remove('active'));

                item.classList.add('active');

                const sectionId = item.getAttribute('data-section');
                const section = document.getElementById(sectionId);

                if (section) {
                    section.classList.add('active');

                    const titles = {
                        'dashboard': 'لوحة التحكم',
                        'sales': 'إدارة المبيعات',
                        'contracts': 'إدارة الاتفاقات',
                        'customers': 'إدارة العملاء',
                        'products': 'إدارة المنتجات',
                        'reports': 'التقارير والإحصائيات',
                        'settings': 'إعدادات النظام'
                    };

                    if (pageTitle) pageTitle.textContent = titles[sectionId];
                    if (breadcrumb) {
                        breadcrumb.innerHTML = `<span>الرئيسية</span> <i class="fas fa-chevron-left"></i> <span>${titles[sectionId]}</span>`;
                    }

                    this.updateSectionData(sectionId);
                    window.location.hash = sectionId;
                }
            });
        });

        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.substring(1);
            if (hash) {
                const navItem = document.querySelector(`[data-section="${hash}"]`);
                if (navItem) {
                    navItem.click();
                }
            }
        });

        setTimeout(() => {
            const initialHash = window.location.hash.substring(1);
            if (initialHash) {
                const navItem = document.querySelector(`[data-section="${initialHash}"]`);
                if (navItem) {
                    navItem.click();
                }
            }
        }, 500);
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 's':
                        e.preventDefault();
                        this.saveData();
                        this.addSuccessNotification('تم حفظ البيانات');
                        break;
                    case 'n':
                        e.preventDefault();
                        this.showQuickActions();
                        break;
                    case 'f':
                        e.preventDefault();
                        this.focusSearch();
                        break;
                    case 'e':
                        e.preventDefault();
                        if (this.hasPermission('export_data')) {
                            this.exportData();
                        }
                        break;
                }
            }

            if (e.key === 'Escape') {
                this.closeAllModals();
                this.clearAllSelections();
            }

            if (e.altKey) {
                switch (e.key) {
                    case '1':
                        e.preventDefault();
                        document.querySelector('[data-section="dashboard"]')?.click();
                        break;
                    case '2':
                        e.preventDefault();
                        document.querySelector('[data-section="sales"]')?.click();
                        break;
                    case '3':
                        e.preventDefault();
                        document.querySelector('[data-section="contracts"]')?.click();
                        break;
                    case '4':
                        e.preventDefault();
                        document.querySelector('[data-section="customers"]')?.click();
                        break;
                    case '5':
                        e.preventDefault();
                        document.querySelector('[data-section="products"]')?.click();
                        break;
                    case '6':
                        e.preventDefault();
                        document.querySelector('[data-section="reports"]')?.click();
                        break;
                    case '7':
                        e.preventDefault();
                        document.querySelector('[data-section="settings"]')?.click();
                        break;
                }
            }
        });

        switch (e.key) {
            case 'F2':
                e.preventDefault();
                if (this.hasPermission('add_sale')) {
                    this.openModal('saleModal');
                }
                break;
            case 'F3':
                e.preventDefault();
                if (this.hasPermission('add_customer')) {
                    this.openModal('customerModal');
                }
                break;
            case 'F4':
                e.preventDefault();
                if (this.hasPermission('add_product')) {
                    this.openModal('productModal');
                }
                break;
        }
    }

    setupNetworkListeners() {
        this.isOnline = navigator.onLine;

        window.addEventListener('online', () => {
            this.isOnline = true;
            console.log('📡 اتصال الإنترنت متاح');
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            console.log('📡 انقطع اتصال الإنترنت');
        });
    }

    setupFormValidation() {
        const requiredInputs = document.querySelectorAll('input[required], select[required], textarea[required]');

        requiredInputs.forEach(input => {
            input.addEventListener('blur', (e) => {
                this.validateField(e.target);
            });

            input.addEventListener('input', (e) => {
                this.clearFieldError(e.target);
            });
        });
    }

    // =============================================
    // TABLE UPDATE METHODS
    // =============================================

    updateAllSections() {
        this.updateDashboard();
        this.updateSalesTable();
        this.updateContractsTable();
        this.updateCustomersTable();
        this.updateProductsTable();
        this.updateNavBadges();
        console.log('🔄 تم تحديث جميع الأقسام');
    }

    updateNavBadges() {
        const badges = {
            'salesBadge': this.data.sales.length,
            'contractsBadge': this.data.contracts.length,
            'customersBadge': this.data.customers.length,
            'productsBadge': this.data.products.length
        };

        Object.entries(badges).forEach(([id, count]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = count;
                element.style.display = count > 0 ? 'flex' : 'none';
            }
        });
    }

    updateDashboard() {
        const today = new Date().toISOString().split('T')[0];
        const thisWeek = this.getWeekRange(new Date());
        const thisMonth = new Date().toISOString().substring(0, 7);

        const todaySales = this.data.sales
            .filter(sale => sale.date === today && sale.status === 'مكتملة')
            .reduce((sum, sale) => sum + sale.total, 0);

        const weekSales = this.data.sales
            .filter(sale => sale.date >= thisWeek.start && sale.date <= thisWeek.end && sale.status === 'مكتملة')
            .reduce((sum, sale) => sum + sale.total, 0);

        const totalSales = this.data.sales
            .filter(sale => sale.status === 'مكتملة')
            .reduce((sum, sale) => sum + sale.total, 0);

        const activeContracts = this.data.contracts.filter(c => c.status === 'نشط').length;

        const newCustomers = this.data.customers.filter(c =>
            c.registrationDate.substring(0, 7) === thisMonth
        ).length;

        const updates = {
            'totalSalesValue': this.formatCurrency(totalSales),
            'activeContractsValue': activeContracts.toString(),
            'newCustomersValue': newCustomers.toString(),
            'todaySalesValue': this.formatCurrency(todaySales),
            'weekSalesValue': this.formatCurrency(weekSales)
        };

        Object.entries(updates).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                this.animateValue(element, element.textContent, value);
            }
        });

        this.updateRecentActivities();
        this.updateSalesChart();

        console.log('📊 تم تحديث لوحة التحكم');
    }

    animateValue(element, start, end) {
        if (typeof end === 'string' && end.includes('ج.م')) {
            const numStart = parseFloat(start.replace(/[^\d.]/g, '')) || 0;
            const numEnd = parseFloat(end.replace(/[^\d.]/g, '')) || 0;

            if (numStart !== numEnd) {
                const duration = 1000;
                const startTime = Date.now();

                const animate = () => {
                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const current = numStart + (numEnd - numStart) * this.easeOutQuart(progress);

                    element.textContent = this.formatCurrency(current);

                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    }
                };

                requestAnimationFrame(animate);
            } else {
                element.textContent = end;
            }
        } else {
            element.textContent = end;
        }
    }

    easeOutQuart(t) {
        return 1 - (--t) * t * t * t;
    }

    updateSalesTable() {
        const tbody = document.getElementById('salesTableBody');
        if (!tbody) return;

        let salesData = [...this.data.sales];

        if (this.currentDateFilter) {
            salesData = this.filterDataByDate(salesData, 'date');
        }

        salesData.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));

        const pagination = this.pagination.sales;
        const startIndex = (pagination.page - 1) * pagination.size;
        const endIndex = startIndex + pagination.size;
        const paginatedData = salesData.slice(startIndex, endIndex);

        tbody.innerHTML = '';

        if (paginatedData.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="10" style="text-align: center; color: #6c757d; padding: 2rem;">
                        <i class="fas fa-inbox" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                        <br>لا توجد مبيعات
                        ${this.data.sales.length === 0 ? '<br><small>ابدأ بإضافة أول مبيعة لك</small>' : ''}
                    </td>
                </tr>
            `;
        } else {
            paginatedData.forEach(sale => {
                const row = document.createElement('tr');
                row.className = 'table-row';
                row.innerHTML = `
                    ${this.hasPermission('delete_sale') ? `
                        <td>
                            <input type="checkbox" class="row-checkbox" value="${sale.id}">
                        </td>
                    ` : ''}
                    <td>
                        <strong>${sale.invoiceNumber}</strong>
                        <br><small class="text-muted">${this.getPaymentMethodName(sale.paymentMethod)}</small>
                    </td>
                    <td>
                        <div class="customer-info">
                            <strong>${sale.customerName}</strong>
                            <br><small class="text-muted">
                                ${this.data.customers.find(c => c.id === sale.customerId)?.phone || ''}
                            </small>
                        </div>
                    </td>
                    <td>
                        <div class="product-info">
                            ${sale.productName}
                            <br><small class="text-muted">
                                ${this.data.products.find(p => p.id === sale.productId)?.code || ''}
                            </small>
                        </div>
                    </td>
                    <td><span class="quantity-badge">${sale.quantity}</span></td>
                    <td>
                        <strong>${this.formatCurrency(sale.total)}</strong>
                        <br><small class="text-muted">${this.formatCurrency(sale.price)} / وحدة</small>
                    </td>
                    <td>
                        ${this.formatDate(sale.date, 'short')}
                        ${sale.createdAt ? `<br><small class="text-muted">${this.formatTime(new Date(sale.createdAt))}</small>` : ''}
                    </td>
                    <td>
                        <small class="created-by">${sale.createdByName || 'غير محدد'}</small>
                        ${sale.updatedBy ? `<br><small class="text-muted">عدل: ${sale.updatedByName}</small>` : ''}
                    </td>
                    <td>
                        <span class="status-badge status-${sale.status === 'مكتملة' ? 'completed' : 'pending'}">
                            <i class="fas fa-${sale.status === 'مكتملة' ? 'check' : 'clock'}"></i>
                            ${sale.status}
                        </span>
                    </td>
                    <td class="action-buttons">
                        <div class="btn-group">
                            ${(this.hasPermission('edit_sale') || (this.hasPermission('edit_own_sale') && sale.createdBy === this.currentUser.id)) ? `
                                <button class="btn btn-sm btn-warning" onclick="salesSystem.editSale('${sale.id}')" title="تعديل">
                                    <i class="fas fa-edit"></i>
                                </button>
                            ` : ''}
                            ${this.hasPermission('delete_sale') ? `
                                <button class="btn btn-sm btn-danger" onclick="salesSystem.deleteSale('${sale.id}')" title="حذف">
                                    <i class="fas fa-trash"></i>
                                </button>
                            ` : ''}
                            <button class="btn btn-sm btn-info" onclick="salesSystem.viewSaleDetails('${sale.id}')" title="التفاصيل">
                                <i class="fas fa-eye"></i>
                            </button>
                            ${this.hasPermission('add_sale') ? `
                                <button class="btn btn-sm btn-success" onclick="salesSystem.duplicateSale('${sale.id}')" title="نسخ">
                                    <i class="fas fa-copy"></i>
                                </button>
                            ` : ''}
                        </div>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }

        this.updateTableInfo('sales', salesData.length, paginatedData.length, salesData.reduce((sum, sale) => sum + sale.total, 0));
        this.updatePagination('sales', salesData.length);
    }

    updateContractsTable() {
        const tbody = document.getElementById('contractsTableBody');
        if (!tbody) return;

        let contractsData = [...this.data.contracts];

        if (this.currentDateFilter) {
            contractsData = this.filterDataByDate(contractsData, 'startDate');
        }

        contractsData.sort((a, b) => new Date(b.createdAt || b.startDate) - new Date(a.createdAt || a.startDate));

        tbody.innerHTML = '';

        if (contractsData.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="9" style="text-align: center; color: #6c757d; padding: 2rem;">
                        <i class="fas fa-file-contract" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                        <br>لا توجد اتفاقات
                        ${this.data.contracts.length === 0 ? '<br><small>ابدأ بإضافة أول اتفاق</small>' : ''}
                    </td>
                </tr>
            `;
        } else {
            contractsData.forEach(contract => {
                const remainingDays = this.calculateRemainingDays(contract.endDate);
                const isExpiringSoon = remainingDays <= 30 && remainingDays > 0;
                const isExpired = remainingDays <= 0;

                const row = document.createElement('tr');
                row.className = `table-row ${isExpiringSoon ? 'contract-expiring' : ''} ${isExpired ? 'contract-expired' : ''}`;

                row.innerHTML = `
                    <td>
                        <strong>${contract.contractNumber}</strong>
                        <br><small class="text-muted">${contract.type}</small>
                    </td>
                    <td>
                        <div class="customer-info">
                            <strong>${contract.customerName}</strong>
                            <br><small class="text-muted">
                                ${this.data.customers.find(c => c.id === contract.customerId)?.phone || ''}
                            </small>
                        </div>
                    </td>
                    <td><span class="contract-type-badge">${contract.type}</span></td>
                    <td><strong>${this.formatCurrency(contract.value)}</strong></td>
                    <td>${this.formatDate(contract.startDate, 'short')}</td>
                    <td>${this.formatDate(contract.endDate, 'short')}</td>
                    <td>
                        ${remainingDays > 0 ?
                        `<span class="remaining-days ${isExpiringSoon ? 'warning' : 'normal'}">
                                <i class="fas fa-calendar-alt"></i>
                                ${remainingDays} يوم
                            </span>` :
                        '<span class="expired"><i class="fas fa-times-circle"></i> منتهي</span>'
                    }
                    </td>
                    <td>
                        <span class="status-badge status-${contract.status === 'نشط' ? 'active' : contract.status === 'منتهي' ? 'expired' : 'pending'}">
                            <i class="fas fa-${contract.status === 'نشط' ? 'play' : contract.status === 'منتهي' ? 'stop' : 'pause'}"></i>
                            ${contract.status}
                        </span>
                    </td>
                    <td class="action-buttons">
                        <div class="btn-group">
                            ${this.hasPermission('edit_contract') ? `
                                <button class="btn btn-sm btn-warning" onclick="salesSystem.editContract('${contract.id}')" title="تعديل">
                                    <i class="fas fa-edit"></i>
                                </button>
                            ` : ''}
                            ${this.hasPermission('delete_contract') ? `
                                <button class="btn btn-sm btn-danger" onclick="salesSystem.deleteContract('${contract.id}')" title="حذف">
                                    <i class="fas fa-trash"></i>
                                </button>
                            ` : ''}
                            <button class="btn btn-sm btn-info" onclick="salesSystem.viewContractDetails('${contract.id}')" title="التفاصيل">
                                <i class="fas fa-file-alt"></i>
                            </button>
                        </div>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }

        this.updateTableInfo('contracts', contractsData.length, contractsData.length, contractsData.reduce((sum, contract) => sum + contract.value, 0));
    }

    updateCustomersTable() {
        const tbody = document.getElementById('customersTableBody');
        if (!tbody) return;

        let customersData = [...this.data.customers];
        customersData.sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate));

        tbody.innerHTML = '';

        if (customersData.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; color: #6c757d; padding: 2rem;">
                        <i class="fas fa-users" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                        <br>لا يوجد عملاء
                        ${this.data.customers.length === 0 ? '<br><small>ابدأ بإضافة أول عميل</small>' : ''}
                    </td>
                </tr>
            `;
        } else {
            customersData.forEach(customer => {
                const salesCount = this.data.sales.filter(s => s.customerId === customer.id).length;
                const contractsCount = this.data.contracts.filter(c => c.customerId === customer.id).length;

                const row = document.createElement('tr');
                row.className = 'table-row';

                row.innerHTML = `
                    <td>
                        <div class="customer-cell">
                            <strong>${customer.name}</strong>
                            <br><small class="text-muted">
                                <i class="fas fa-${customer.type === 'company' ? 'building' : customer.type === 'government' ? 'landmark' : 'user'}"></i>
                                ${customer.type === 'individual' ? 'فرد' : customer.type === 'company' ? 'شركة' : 'جهة حكومية'}
                            </small>
                        </div>
                    </td>
                    <td>
                        <a href="tel:${customer.phone}" class="phone-link">
                            <i class="fas fa-phone"></i>
                            ${customer.phone}
                        </a>
                    </td>
                    <td>
                        ${customer.email ?
                        `<a href="mailto:${customer.email}" class="email-link">
                                <i class="fas fa-envelope"></i>
                                ${customer.email}
                            </a>` :
                        '<span class="text-muted">غير محدد</span>'
                    }
                    </td>
                    <td>${customer.company || '<span class="text-muted">غير محدد</span>'}</td>
                    <td>
                        <strong class="purchase-amount">${this.formatCurrency(customer.totalPurchases)}</strong>
                    </td>
                    <td>
                        <span class="sales-count-badge">${salesCount}</span>
                        ${contractsCount > 0 ? `<br><small class="text-muted">${contractsCount} اتفاق</small>` : ''}
                    </td>
                    <td>
                        ${this.formatDate(customer.registrationDate, 'short')}
                        <br><small class="text-muted">${this.calculateMembershipPeriod(customer.registrationDate)}</small>
                    </td>
                    <td class="action-buttons">
                        <div class="btn-group">
                            ${this.hasPermission('edit_customer') ? `
                                <button class="btn btn-sm btn-warning" onclick="salesSystem.editCustomer('${customer.id}')" title="تعديل">
                                    <i class="fas fa-edit"></i>
                                </button>
                            ` : ''}
                            ${this.hasPermission('delete_customer') ? `
                                <button class="btn btn-sm btn-danger" onclick="salesSystem.deleteCustomer('${customer.id}')" title="حذف">
                                    <i class="fas fa-trash"></i>
                                </button>
                            ` : ''}
                            <button class="btn btn-sm btn-info" onclick="salesSystem.viewCustomerHistory('${customer.id}')" title="تاريخ العميل">
                                <i class="fas fa-history"></i>
                            </button>
                            <button class="btn btn-sm btn-success" onclick="salesSystem.sendCustomerReport('${customer.id}')" title="إرسال تقرير">
                                <i class="fab fa-telegram"></i>
                            </button>
                        </div>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }

        this.updateTableInfo('customers', customersData.length);
    }

    updateProductsTable() {
        const tbody = document.getElementById('productsTableBody');
        if (!tbody) return;

        let productsData = [...this.data.products];
        productsData.sort((a, b) => a.name.localeCompare(b.name));

        tbody.innerHTML = '';

        if (productsData.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="9" style="text-align: center; color: #6c757d; padding: 2rem;">
                        <i class="fas fa-box-open" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                        <br>لا توجد منتجات
                        ${this.data.products.length === 0 ? '<br><small>ابدأ بإضافة أول منتج</small>' : ''}
                    </td>
                </tr>
            `;
        } else {
            productsData.forEach(product => {
                const salesCount = this.data.sales
                    .filter(s => s.productId === product.id)
                    .reduce((sum, sale) => sum + sale.quantity, 0);

                const isLowStock = product.stock <= product.minStock;
                const isOutOfStock = product.stock === 0;

                const row = document.createElement('tr');
                row.className = `table-row ${isLowStock ? 'low-stock-row' : ''} ${isOutOfStock ? 'out-of-stock-row' : ''}`;

                row.innerHTML = `
                    <td>
                        <div class="product-cell">
                            <strong>${product.name}</strong>
                            ${isLowStock && !isOutOfStock ?
                        '<i class="fas fa-exclamation-triangle low-stock-icon" title="مخزون منخفض"></i>' :
                        isOutOfStock ?
                            '<i class="fas fa-times-circle out-of-stock-icon" title="نفد المخزون"></i>' : ''
                    }
                            <br><small class="text-muted">${product.description || 'لا يوجد وصف'}</small>
                        </div>
                    </td>
                    <td>
                        <code class="product-code">${product.code}</code>
                    </td>
                    <td>
                        <strong>${this.formatCurrency(product.price)}</strong>
                        <br><small class="text-muted">
                            التكلفة: ${this.formatCurrency(product.cost)}
                            <br>الربح: ${this.formatCurrency(product.price - product.cost)}
                        </small>
                    </td>
                    <td>
                        <span class="stock-badge ${isOutOfStock ? 'out-of-stock' : isLowStock ? 'low-stock' : 'normal-stock'}">
                            <i class="fas fa-boxes"></i>
                            ${product.stock} ${product.unit}
                        </span>
                    </td>
                    <td>
                        <span class="min-stock-badge">${product.minStock} ${product.unit}</span>
                    </td>
                    <td>
                        <span class="category-badge">${product.category}</span>
                    </td>
                    <td>
                        <span class="status-badge status-${product.status === 'متاح' ? 'available' : product.status === 'مخزون منخفض' ? 'low' : 'unavailable'}">
                            <i class="fas fa-${product.status === 'متاح' ? 'check-circle' : product.status === 'مخزون منخفض' ? 'exclamation-triangle' : 'times-circle'}"></i>
                            ${product.status}
                        </span>
                    </td>
                    <td>
                        <strong class="sales-count">${salesCount}</strong>
                        <br><small class="text-muted">إجمالي مباع</small>
                    </td>
                    <td class="action-buttons">
                        <div class="btn-group">
                            ${this.hasPermission('edit_product') ? `
                                <button class="btn btn-sm btn-warning" onclick="salesSystem.editProduct('${product.id}')" title="تعديل">
                                    <i class="fas fa-edit"></i>
                                </button>
                            ` : ''}
                            ${this.hasPermission('delete_product') ? `
                                <button class="btn btn-sm btn-danger" onclick="salesSystem.deleteProduct('${product.id}')" title="حذف">
                                    <i class="fas fa-trash"></i>
                                </button>
                            ` : ''}
                            ${this.hasPermission('adjust_stock') ? `
                                <button class="btn btn-sm btn-info" onclick="salesSystem.adjustStock('${product.id}')" title="تعديل المخزون">
                                    <i class="fas fa-boxes"></i>
                                </button>
                            ` : ''}
                            <button class="btn btn-sm btn-secondary" onclick="salesSystem.viewProductSales('${product.id}')" title="مبيعات المنتج">
                                <i class="fas fa-chart-bar"></i>
                            </button>
                        </div>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }

        this.updateTableInfo('products', productsData.length);
    }

    updateTableInfo(type, totalCount, displayedCount = null, totalAmount = null) {
        const countElement = document.getElementById(`${type}Count`);
        const totalElement = document.getElementById(`${type}Total`);

        if (countElement) {
            const typeNames = {
                sales: 'المبيعات',
                contracts: 'الاتفاقات',
                customers: 'العملاء',
                products: 'المنتجات'
            };

            countElement.textContent = `عدد ${typeNames[type]}: ${displayedCount !== null ? `${displayedCount} من ${totalCount}` : totalCount}`;
        }

        if (totalElement && totalAmount !== null) {
            totalElement.textContent = `المجموع: ${this.formatCurrency(totalAmount)}`;
        }
    }

    updatePagination(type, totalItems) {
        const pagination = this.pagination[type];
        const totalPages = Math.ceil(totalItems / pagination.size);

        const infoElement = document.getElementById(`${type}PaginationInfo`);
        if (infoElement) {
            const start = (pagination.page - 1) * pagination.size + 1;
            const end = Math.min(pagination.page * pagination.size, totalItems);
            infoElement.textContent = `عرض ${start}-${end} من ${totalItems} عنصر`;
        }

        const numbersElement = document.getElementById(`${type}PageNumbers`);
        if (numbersElement && totalPages > 1) {
            numbersElement.innerHTML = '';

            for (let i = 1; i <= totalPages; i++) {
                const button = document.createElement('button');
                button.className = `pagination-btn ${i === pagination.page ? 'active' : ''}`;
                button.textContent = i;
                button.onclick = () => this.changePage(type, i);
                numbersElement.appendChild(button);
            }
        }
    }

    changePage(type, page) {
        this.pagination[type].page = page;
        const updateMethod = `update${type.charAt(0).toUpperCase() + type.slice(1)}Table`;
        if (typeof this[updateMethod] === 'function') {
            this[updateMethod]();
        }
    }

    changePageSize(type, size) {
        this.pagination[type].size = parseInt(size);
        this.pagination[type].page = 1;
        this.changePage(type, 1);
    }

    // =============================================
    // CHARTS AND VISUALIZATION
    // =============================================

    initCharts() {
        if (typeof Chart !== 'undefined') {
            this.initSalesChart();
        }
        console.log('📊 المخططات البيانية جاهزة');
    }

    initSalesChart() {
        const ctx = document.getElementById('salesChart');
        if (!ctx || typeof Chart === 'undefined') return;

        this.charts.salesChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'المبيعات (ج.م)',
                    data: [],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#667eea',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'مبيعات آخر 7 أيام',
                        font: {
                            size: 16,
                            weight: 'bold'
                        },
                        color: '#374151'
                    },
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#667eea',
                        borderWidth: 1,
                        callbacks: {
                            label: (context) => {
                                return `المبيعات: ${this.formatCurrency(context.raw)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => this.formatCurrency(value, 'EGP', 'ar-EG', true),
                            color: '#6b7280'
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#6b7280'
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                elements: {
                    line: {
                        borderWidth: 3
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    updateSalesChart() {
        if (!this.charts.salesChart) return;

        const last7Days = [];
        const salesData = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            last7Days.push(date.toLocaleDateString('ar-EG', {
                month: 'short',
                day: 'numeric',
                weekday: 'short'
            }));

            const dayTotal = this.data.sales
                .filter(sale => sale.date === dateStr && sale.status === 'مكتملة')
                .reduce((sum, sale) => sum + sale.total, 0);

            salesData.push(dayTotal);
        }

        this.charts.salesChart.data.labels = last7Days;
        this.charts.salesChart.data.datasets[0].data = salesData;

        this.charts.salesChart.update('active');
    }

    updateRecentActivities() {
        const container = document.getElementById('recentActivitiesList');
        if (!container) return;

        const activities = [];

        const recentSales = [...this.data.sales]
            .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
            .slice(0, 3);

        recentSales.forEach(sale => {
            activities.push({
                type: 'sale',
                icon: 'fas fa-shopping-cart',
                color: '#10b981',
                title: `مبيعة جديدة - ${sale.invoiceNumber}`,
                description: `العميل: ${sale.customerName} - ${this.formatCurrency(sale.total)} - ${sale.createdByName || 'غير محدد'}`,
                time: this.getRelativeTime(new Date(sale.createdAt || sale.date)),
                timestamp: new Date(sale.createdAt || sale.date)
            });
        });

        const recentContracts = [...this.data.contracts]
            .sort((a, b) => new Date(b.createdAt || b.startDate) - new Date(a.createdAt || a.startDate))
            .slice(0, 2);

        recentContracts.forEach(contract => {
            activities.push({
                type: 'contract',
                icon: 'fas fa-handshake',
                color: '#3b82f6',
                title: `اتفاق جديد - ${contract.contractNumber}`,
                description: `العميل: ${contract.customerName} - ${this.formatCurrency(contract.value)} - ${contract.createdByName || 'غير محدد'}`,
                time: this.getRelativeTime(new Date(contract.createdAt || contract.startDate)),
                timestamp: new Date(contract.createdAt || contract.startDate)
            });
        });

        const recentCustomers = [...this.data.customers]
            .sort((a, b) => new Date(b.createdAt || b.registrationDate) - new Date(a.createdAt || a.registrationDate))
            .slice(0, 2);

        recentCustomers.forEach(customer => {
            activities.push({
                type: 'customer',
                icon: 'fas fa-user-plus',
                color: '#8b5cf6',
                title: `عميل جديد`,
                description: `${customer.name} - ${customer.phone} - ${customer.createdByName || 'غير محدد'}`,
                time: this.getRelativeTime(new Date(customer.createdAt || customer.registrationDate)),
                timestamp: new Date(customer.createdAt || customer.registrationDate)
            });
        });

        activities.sort((a, b) => b.timestamp - a.timestamp);

        container.innerHTML = activities.length ? activities.slice(0, 8).map(activity => `
            <div class="activity-item">
                <div class="activity-icon" style="background-color: ${activity.color};">
                    <i class="${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <h4>${activity.title}</h4>
                    <p>${activity.description}</p>
                    <small class="activity-time">
                        <i class="fas fa-clock"></i>
                        ${activity.time}
                    </small>
                </div>
            </div>
        `).join('') : '<div class="no-activities"><i class="fas fa-info-circle"></i> لا توجد أنشطة حديثة<br><small>ابدأ بإضافة البيانات لرؤية الأنشطة</small></div>';
    }

    // =============================================
    // UTILITY METHODS
    // =============================================

    generateId(prefix = 'item') {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        return `${prefix}_${timestamp}_${random}`;
    }

    generateInvoiceNumber() {
        const year = new Date().getFullYear();
        const nextNumber = this.data.sales.length + 1;
        return `INV-${year}-${String(nextNumber).padStart(4, '0')}`;
    }

    generateContractNumber() {
        const year = new Date().getFullYear();
        const nextNumber = this.data.contracts.length + 1;
        return `CONT-${year}-${String(nextNumber).padStart(3, '0')}`;
    }

    formatCurrency(amount, currency = 'EGP', locale = 'ar-EG', compact = false) {
        const symbols = {
            EGP: 'ج.م',
            USD: '$',
            EUR: '€',
            SAR: 'ر.س',
            AED: 'د.إ'
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
                formattedAmount = new Intl.NumberFormat(locale, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2
                }).format(amount);
            }

            return `${formattedAmount} ${symbols[currency] || currency}`;
        } catch (error) {
            return `${amount.toLocaleString()} ${symbols[currency] || currency}`;
        }
    }

    formatDate(date, format = 'full') {
        if (!date) return 'غير محدد';

        const dateObj = new Date(date);

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
            return new Intl.DateTimeFormat('ar-EG', formats[format] || formats.full).format(dateObj);
        } catch (error) {
            return dateObj.toLocaleDateString('ar-EG');
        }
    }

    formatTime(date) {
        if (!date) return '';

        try {
            return new Intl.DateTimeFormat('ar-EG', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            }).format(date);
        } catch (error) {
            return date.toLocaleTimeString('ar-EG');
        }
    }

    formatDateTime(date) {
        if (!date) return 'غير محدد';

        const dateObj = new Date(date);

        try {
            return new Intl.DateTimeFormat('ar-EG', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            }).format(dateObj);
        } catch (error) {
            return dateObj.toLocaleString('ar-EG');
        }
    }

    getRelativeTime(date) {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const weeks = Math.floor(days / 7);
        const months = Math.floor(days / 30);

        if (months > 0) return `منذ ${months} شهر`;
        if (weeks > 0) return `منذ ${weeks} أسبوع`;
        if (days > 0) return `منذ ${days} يوم`;
        if (hours > 0) return `منذ ${hours} ساعة`;
        if (minutes > 0) return `منذ ${minutes} دقيقة`;
        return 'الآن';
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validatePhone(phone) {
        const patterns = [
            /^(\+20|0)?1[0125][0-9]{8}$/, // Mobile
            /^(\+20|0)?[23][0-9]{7}$/, // Landline
        ];

        const cleanPhone = phone.replace(/[\s-]/g, '');
        return patterns.some(pattern => pattern.test(cleanPhone));
    }

    getProductStatus(stock, minStock) {
        if (stock === 0) return 'غير متاح';
        if (stock <= minStock) return 'مخزون منخفض';
        return 'متاح';
    }

    getPaymentMethodName(method) {
        const methods = {
            cash: 'نقدي',
            credit: 'آجل',
            card: 'بطاقة ائتمان',
            transfer: 'حوالة بنكية'
        };
        return methods[method] || method;
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

    addMonths(date, months) {
        const result = new Date(date);
        result.setMonth(result.getMonth() + months);
        return result;
    }

    getWeekRange(date) {
        const start = new Date(date);
        const day = start.getDay();
        const diff = start.getDate() - day + (day === 0 ? -6 : 1);
        start.setDate(diff);

        const end = new Date(start);
        end.setDate(start.getDate() + 6);

        return {
            start: start.toISOString().split('T')[0],
            end: end.toISOString().split('T')[0]
        };
    }

    calculateRemainingDays(endDate) {
        const today = new Date();
        const end = new Date(endDate);
        const diffTime = end - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
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

    filterDataByDate(data, dateField) {
        if (!this.currentDateFilter) return data;

        const { fromDate, toDate } = this.currentDateFilter;

        return data.filter(item => {
            const itemDate = item[dateField];
            if (!itemDate) return true;

            if (fromDate && itemDate < fromDate) return false;
            if (toDate && itemDate > toDate) return false;

            return true;
        });
    }

    // =============================================
    // TELEGRAM INTEGRATION
    // =============================================

    async sendTelegramNotification(message) {
        if (!this.data.settings.notifications || !this.isOnline) return;

        const botToken = this.data.settings.botToken;
        const chatId = this.data.settings.chatId;

        if (!botToken || !chatId) {
            console.log('إعدادات التليجرام غير مكتملة');
            return;
        }

        try {
            const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: `🏷️ Tag ElMalek - نظام إدارة المبيعات v${this.version}

${message}

⏰ ${this.formatDateTime(new Date())}
📍 ${this.isOnline ? 'متصل' : 'غير متصل'}`,
                    parse_mode: 'HTML',
                    disable_web_page_preview: true
                })
            });

            if (response.ok) {
                console.log('✅ تم إرسال إشعار التليجرام بنجاح');
            } else {
                const errorData = await response.json();
                console.warn('⚠️ فشل إرسال إشعار التليجرام:', errorData);
            }
        } catch (error) {
            console.error('❌ خطأ في إرسال إشعار التليجرام:', error);
        }
    }

    // =============================================
    // AUTO-SAVE AND HEALTH CHECKS
    // =============================================

    startAutoSave() {
        setInterval(async () => {
            await this.saveData();
            console.log('🔄 حفظ تلقائي مكتمل');
        }, 3 * 60 * 1000);

        console.log('⏰ تم تفعيل الحفظ التلقائي (كل 3 دقائق)');
    }

    startHealthChecks() {
        setInterval(() => {
            this.performHealthCheck();
        }, 10 * 60 * 1000);

        console.log('🏥 تم تفعيل فحص الصحة التلقائي (كل 10 دقائق)');
    }

    startNotificationSystem() {
        setInterval(() => {
            this.checkNotifications();
        }, 30 * 60 * 1000);

        console.log('🔔 تم تفعيل نظام الإشعارات (كل 30 دقيقة)');
    }

    async performHealthCheck() {
        try {
            const issues = [];

            const orphanedSales = this.data.sales.filter(sale => {
                const customerExists = this.data.customers.some(c => c.id === sale.customerId);
                const productExists = this.data.products.some(p => p.id === sale.productId);
                return !customerExists || !productExists;
            });

            if (orphanedSales.length > 0) {
                issues.push(`${orphanedSales.length} مبيعة لها بيانات مفقودة`);
            }

            const negativeStock = this.data.products.filter(p => p.stock < 0);
            if (negativeStock.length > 0) {
                issues.push(`${negativeStock.length} منتج له مخزون سالب`);
            }

            const invalidSales = this.data.sales.filter(sale =>
                Math.abs(sale.total - (sale.quantity * sale.price)) > 0.01
            );

            if (invalidSales.length > 0) {
                issues.push(`${invalidSales.length} مبيعة لها مجموع خاطئ`);
            }

            if (issues.length > 0) {
                console.warn('⚠️ مشاكل في سلامة البيانات:', issues);
                this.addWarningNotification(`تم اكتشاف ${issues.length} مشكلة في البيانات`);
            } else {
                console.log('✅ فحص الصحة: جميع البيانات سليمة');
            }

            this.data.metadata.lastHealthCheck = new Date().toISOString();

        } catch (error) {
            console.error('❌ خطأ في فحص الصحة:', error);
        }
    }

    checkNotifications() {
        let notificationCount = 0;
        const notifications = [];

        const lowStockProducts = this.data.products.filter(p => p.stock <= p.minStock && p.stock > 0);
        const outOfStockProducts = this.data.products.filter(p => p.stock === 0);

        if (lowStockProducts.length > 0) {
            notifications.push({
                type: 'warning',
                title: 'مخزون منخفض',
                message: `${lowStockProducts.length} منتج يحتاج إعادة تموين`,
                action: () => this.showLowStockProducts()
            });
            notificationCount += lowStockProducts.length;

            this.addWarningNotification(`${lowStockProducts.length} منتج يحتاج إعادة تموين`);
        }

        if (outOfStockProducts.length > 0) {
            notifications.push({
                type: 'error',
                title: 'نفد المخزون',
                message: `${outOfStockProducts.length} منتج نفد مخزونه`,
                action: () => this.showOutOfStockProducts()
            });
            notificationCount += outOfStockProducts.length;

            this.addErrorNotification(`${outOfStockProducts.length} منتج نفد مخزونه`);
        }

        const expiringContracts = this.data.contracts.filter(c => {
            const remainingDays = this.calculateRemainingDays(c.endDate);
            return remainingDays <= this.data.settings.contractAlertDays && remainingDays > 0 && c.status === 'نشط';
        });

        if (expiringContracts.length > 0) {
            notifications.push({
                type: 'warning',
                title: 'اتفاقات تنتهي قريباً',
                message: `${expiringContracts.length} اتفاق ينتهي خلال ${this.data.settings.contractAlertDays} يوم`,
                action: () => this.showExpiringContracts()
            });
            notificationCount += expiringContracts.length;

            this.addWarningNotification(`${expiringContracts.length} اتفاق ينتهي قريباً`);
        }

        this.notificationCount = notificationCount;
        this.updateNotificationBadge();
        this.notifications = notifications;

        if (notifications.length > 0) {
            console.log(`🔔 ${notifications.length} إشعار جديد`);
        }
    }

    checkLowStock(product) {
        if (this.data.settings.notifications.lowStock) {
            this.sendTelegramNotification(`⚠️ تحذير مخزون منخفض
📦 المنتج: ${product.name}
🏷️ الكود: ${product.code}
📊 المخزون الحالي: ${product.stock}
📉 الحد الأدنى: ${product.minStock}
🔄 يحتاج إعادة تموين فوري
👨‍💼 تم إنشاؤه بواسطة: ${this.currentUser.fullName}`);

            this.addWarningNotification(`المنتج ${product.name} يحتاج إعادة تموين - المخزون: ${product.stock}`);
        }
    }

    showLowStockProducts() {
        const lowStockProducts = this.data.products.filter(p => p.stock <= p.minStock && p.stock > 0);

        const listHtml = `
            <div class="low-stock-list">
                <h4>منتجات تحتاج إعادة تموين (${lowStockProducts.length})</h4>
                ${lowStockProducts.length > 0 ? `
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>المنتج</th>
                                <th>الكود</th>
                                <th>المخزون الحالي</th>
                                <th>الحد الأدنى</th>
                                <th>الإجراء</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${lowStockProducts.map(product => `
                                <tr>
                                    <td>${product.name}</td>
                                    <td>${product.code}</td>
                                    <td><span class="low-stock-badge">${product.stock}</span></td>
                                    <td>${product.minStock}</td>
                                    <td>
                                        ${this.hasPermission('adjust_stock') ? `
                                            <button class="btn btn-sm btn-primary" onclick="salesSystem.adjustStock('${product.id}')">
                                                <i class="fas fa-plus"></i> إضافة مخزون
                                            </button>
                                        ` : ''}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                ` : '<p class="empty-state">لا توجد منتجات تحتاج إعادة تموين</p>'}
            </div>
        `;

        this.showModal('منتجات تحتاج إعادة تموين', listHtml, 'modal-lg');
    }

    showOutOfStockProducts() {
        const outOfStockProducts = this.data.products.filter(p => p.stock === 0);

        const listHtml = `
            <div class="out-of-stock-list">
                <h4>منتجات نفد مخزونها (${outOfStockProducts.length})</h4>
                ${outOfStockProducts.length > 0 ? `
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>المنتج</th>
                                <th>الكود</th>
                                <th>الفئة</th>
                                <th>آخر سعر</th>
                                <th>الإجراء</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${outOfStockProducts.map(product => `
                                <tr>
                                    <td>${product.name}</td>
                                    <td>${product.code}</td>
                                    <td>${product.category}</td>
                                    <td>${this.formatCurrency(product.price)}</td>
                                    <td>
                                        ${this.hasPermission('adjust_stock') ? `
                                            <button class="btn btn-sm btn-primary" onclick="salesSystem.adjustStock('${product.id}')">
                                                <i class="fas fa-plus"></i> إضافة مخزون
                                            </button>
                                        ` : ''}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                ` : '<p class="empty-state">لا توجد منتجات نفد مخزونها</p>'}
            </div>
        `;

        this.showModal('منتجات نفد مخزونها', listHtml, 'modal-lg');
    }

    showExpiringContracts() {
        const expiringContracts = this.data.contracts.filter(c => {
            const remainingDays = this.calculateRemainingDays(c.endDate);
            return remainingDays <= this.data.settings.contractAlertDays && remainingDays > 0 && c.status === 'نشط';
        });

        const listHtml = `
            <div class="expiring-contracts-list">
                <h4>اتفاقات تنتهي قريباً (${expiringContracts.length})</h4>
                ${expiringContracts.length > 0 ? `
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>رقم الاتفاق</th>
                                <th>العميل</th>
                                <th>القيمة</th>
                                <th>تاريخ الانتهاء</th>
                                <th>المدة المتبقية</th>
                                <th>الإجراء</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${expiringContracts.map(contract => {
            const remainingDays = this.calculateRemainingDays(contract.endDate);
            return `
                                    <tr class="contract-expiring">
                                        <td>${contract.contractNumber}</td>
                                        <td>${contract.customerName}</td>
                                        <td>${this.formatCurrency(contract.value)}</td>
                                        <td>${this.formatDate(contract.endDate)}</td>
                                        <td><span class="remaining-days warning">${remainingDays} يوم</span></td>
                                        <td>
                                            ${this.hasPermission('edit_contract') ? `
                                                <button class="btn btn-sm btn-warning" onclick="salesSystem.editContract('${contract.id}')">
                                                    <i class="fas fa-edit"></i> تجديد
                                                </button>
                                            ` : ''}
                                        </td>
                                    </tr>
                                `;
        }).join('')}
                        </tbody>
                    </table>
                ` : '<p class="empty-state">لا توجد اتفاقات تنتهي قريباً</p>'}
            </div>
        `;

        this.showModal('اتفاقات تنتهي قريباً', listHtml, 'modal-lg');
    }

    // =============================================
    // MODAL AND UI HELPERS
    // =============================================

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';

            modal.style.animation = 'fadeInModal 0.3s ease';

            setTimeout(() => {
                const firstInput = modal.querySelector('input:not([type="hidden"]):not([type="checkbox"]), select, textarea');
                if (firstInput) firstInput.focus();
            }, 100);
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.animation = 'fadeOutModal 0.3s ease';

            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = '';
                modal.style.animation = '';

                const form = modal.querySelector('form');
                if (form) form.reset();

                this.resetEditMode();
            }, 300);
        }
    }

    closeAllModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (modal.style.display === 'block') {
                const modalId = modal.id;
                if (modalId) {
                    this.closeModal(modalId);
                } else {
                    modal.style.display = 'none';
                }
            }
        });
        document.body.style.overflow = '';
        this.resetEditMode();
    }

    showModal(title, content, size = '', buttons = null) {
        const modalId = 'dynamicModal_' + Date.now();
        const modalHtml = `
            <div id="${modalId}" class="modal" style="display: block;">
                <div class="modal-content ${size}">
                    <div class="modal-header">
                        <h2>${title}</h2>
                        <span class="close" onclick="salesSystem.closeDynamicModal('${modalId}')">&times;</span>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                    ${buttons ? `
                        <div class="modal-footer">
                            ${buttons.map(btn => `
                                <button class="btn ${btn.class}" onclick="${btn.onClick ? btn.onClick.toString().replace('function', '').replace('{', '(){') : `salesSystem.closeDynamicModal('${modalId}')`}">
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
    }

    closeDynamicModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.animation = 'fadeOutModal 0.3s ease';
            setTimeout(() => {
                modal.remove();
                document.body.style.overflow = '';
            }, 300);
        }
    }

    resetEditMode() {
        this.currentEditId = null;
        this.currentEditType = null;

        const modalTitles = {
            'saleModal': 'إضافة مبيعة جديدة',
            'contractModal': 'إضافة اتفاق جديد',
            'customerModal': 'إضافة عميل جديد',
            'productModal': 'إضافة منتج جديد'
        };

        Object.entries(modalTitles).forEach(([modalId, title]) => {
            const titleElement = document.querySelector(`#${modalId} h2`);
            if (titleElement) titleElement.textContent = title;
        });

        const buttonTexts = {
            'saleForm': '<i class="fas fa-save"></i> إضافة المبيعة',
            'contractForm': '<i class="fas fa-save"></i> إضافة الاتفاق',
            'customerForm': '<i class="fas fa-save"></i> إضافة العميل',
            'productForm': '<i class="fas fa-save"></i> إضافة المنتج'
        };

        Object.entries(buttonTexts).forEach(([formId, buttonText]) => {
            const button = document.querySelector(`#${formId} button[type="submit"]`);
            if (button) button.innerHTML = buttonText;
        });
    }

    showLoading(show = true) {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = show ? 'flex' : 'none';
            if (show) {
                overlay.style.animation = 'fadeIn 0.3s ease';
            }
        }
    }

    async showConfirmDialog(message, title = 'تأكيد') {
        return new Promise((resolve) => {
            const modalId = 'confirmModal_' + Date.now();
            const modalHtml = `
                <div id="${modalId}" class="modal" style="display: block;">
                    <div class="modal-content modal-sm">
                        <div class="confirmation-dialog">
                            <div class="confirmation-icon">
                                <i class="fas fa-question-circle"></i>
                            </div>
                            <h3 class="confirmation-title">${title}</h3>
                            <p class="confirmation-message">${message}</p>
                            <div class="confirmation-actions">
                                <button class="btn btn-primary" onclick="confirmAction(true)">نعم</button>
                                <button class="btn btn-secondary" onclick="confirmAction(false)">لا</button>
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

    // =============================================
    // DATA POPULATION METHODS
    // =============================================

    populateAllSelects() {
        this.populateCustomerSelects();
        this.populateProductSelects();
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
                    option.textContent = `${product.name} - ${product.code} (${product.stock} ${product.unit} متاح)`;
                    option.dataset.price = product.price;
                    if (product.id === currentValue) option.selected = true;
                    select.appendChild(option);
                });
        }
    }

    updateSectionData(sectionId) {
        switch (sectionId) {
            case 'dashboard':
                this.updateDashboard();
                break;
            case 'sales':
                this.updateSalesTable();
                this.populateAllSelects();
                break;
            case 'contracts':
                this.updateContractsTable();
                this.populateCustomerSelects();
                break;
            case 'customers':
                this.updateCustomersTable();
                break;
            case 'products':
                this.updateProductsTable();
                break;
            case 'reports':
                this.loadReportsSection();
                break;
            case 'settings':
                this.loadSettingsSection();
                break;
        }
    }

    loadReportsSection() {
        console.log('📊 تحميل قسم التقارير');
    }

    loadSettingsSection() {
        this.loadSettings();
        console.log('⚙️ تحميل قسم الإعدادات');
    }

    // =============================================
    // SEARCH AND FILTER FUNCTIONALITY
    // =============================================

    performAdvancedSearch(section, query) {
        const tableBodyId = `${section}TableBody`;
        const tbody = document.getElementById(tableBodyId);

        if (!tbody || !query.trim()) {
            this[`update${section.charAt(0).toUpperCase() + section.slice(1)}Table`]();
            return;
        }

        const searchFields = this.getSearchFields(section);
        const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);

        let data = this.data[section] || [];

        const filteredData = data.filter(item => {
            return searchTerms.every(term => {
                return searchFields.some(field => {
                    const value = this.getNestedValue(item, field);
                    return value && value.toString().toLowerCase().includes(term);
                });
            });
        });

        this.updateTableWithFilteredData(section, filteredData);
    }

    getSearchFields(section) {
        const fieldMap = {
            sales: ['invoiceNumber', 'customerName', 'productName', 'notes'],
            contracts: ['contractNumber', 'customerName', 'type', 'details'],
            customers: ['name', 'phone', 'email', 'company', 'address'],
            products: ['name', 'code', 'category', 'description']
        };

        return fieldMap[section] || [];
    }

    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current && current[key], obj);
    }

    updateTableWithFilteredData(section, filteredData) {
        console.log(`تصفية ${section}:`, filteredData.length, 'نتيجة');
    }

    // =============================================
    // TABLE SELECTION AND ACTIONS
    // =============================================

    handleRowSelection() {
        const checkboxes = document.querySelectorAll('.row-checkbox:checked');
        const deleteBtn = document.getElementById('deleteSelectedBtn');

        if (deleteBtn) {
            deleteBtn.disabled = checkboxes.length === 0;
            deleteBtn.textContent = checkboxes.length > 0 ?
                `حذف المحدد (${checkboxes.length})` : 'حذف المحدد';
        }
    }

    toggleSelectAll(tableType) {
        const selectAllCheckbox = document.getElementById(`selectAll${tableType.charAt(0).toUpperCase() + tableType.slice(1)}Checkbox`);
        const rowCheckboxes = document.querySelectorAll('.row-checkbox');

        rowCheckboxes.forEach(checkbox => {
            checkbox.checked = selectAllCheckbox?.checked || false;
        });

        this.handleRowSelection();
    }

    selectAllSales() {
        this.toggleSelectAll('sales');
    }

    async deleteSelectedSales() {
        if (!this.checkPermission('delete_sale', 'الحذف الجماعي')) return;

        if (!(await this.verifyPassword('أدخل كلمة المرور للحذف الجماعي'))) {
            this.addWarningNotification('تم إلغاء الحذف الجماعي');
            return;
        }

        const checkboxes = document.querySelectorAll('.row-checkbox:checked');
        const saleIds = Array.from(checkboxes).map(cb => cb.value);

        if (saleIds.length === 0) {
            this.addWarningNotification('يرجى تحديد مبيعات للحذف');
            return;
        }

        const confirmed = await this.showConfirmDialog(
            `هل أنت متأكد من حذف ${saleIds.length} مبيعة؟ لا يمكن التراجع عن هذا الإجراء.`,
            'تأكيد الحذف الجماعي'
        );

        if (!confirmed) return;

        try {
            this.showLoading(true);
            let deletedCount = 0;
            let totalAmount = 0;

            for (const saleId of saleIds) {
                const saleIndex = this.data.sales.findIndex(s => s.id === saleId);
                if (saleIndex !== -1) {
                    const sale = this.data.sales[saleIndex];
                    totalAmount += sale.total;

                    const product = this.data.products.find(p => p.id === sale.productId);
                    if (product) {
                        product.stock += sale.quantity;
                        product.status = this.getProductStatus(product.stock, product.minStock);
                    }

                    const customer = this.data.customers.find(c => c.id === sale.customerId);
                    if (customer) {
                        customer.totalPurchases -= sale.total;
                    }

                    this.data.sales.splice(saleIndex, 1);
                    deletedCount++;
                }
            }

            await this.saveData();
            this.updateSalesTable();
            this.updateDashboard();
            this.populateAllSelects();

            await this.sendTelegramNotification(`🗑️ حذف جماعي للمبيعات
📊 عدد المبيعات المحذوفة: ${deletedCount}
💰 إجمالي المبلغ المحذوف: ${this.formatCurrency(totalAmount)}
👨‍💼 بواسطة: ${this.currentUser.fullName}`);

            this.addSuccessNotification(`تم حذف ${deletedCount} مبيعة بنجاح`);

        } catch (error) {
            console.error('خطأ في الحذف الجماعي:', error);
            this.addErrorNotification('حدث خطأ أثناء الحذف الجماعي');
        } finally {
            this.showLoading(false);
        }
    }

    clearAllSelections() {
        const checkboxes = document.querySelectorAll('.row-checkbox, input[type="checkbox"][id^="selectAll"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        this.handleRowSelection();
    }

    // =============================================
    // QUICK ACTIONS AND SHORTCUTS
    // =============================================

    showQuickActions() {
        const quickActionsHtml = `
            <div class="quick-actions-menu">
                <h4>الإجراءات السريعة</h4>
                <div class="quick-actions-grid">
                    ${this.hasPermission('add_sale') ? `
                        <button class="quick-action-item" onclick="salesSystem.openModal('saleModal'); salesSystem.closeDynamicModal('${arguments[0] || 'quickActions'}')">
                            <i class="fas fa-shopping-cart"></i>
                            <span>مبيعة جديدة</span>
                            <small>F2</small>
                        </button>
                    ` : ''}
                    ${this.hasPermission('add_contract') ? `
                        <button class="quick-action-item" onclick="salesSystem.openModal('contractModal'); salesSystem.closeDynamicModal('${arguments[0] || 'quickActions'}')">
                            <i class="fas fa-handshake"></i>
                            <span>اتفاق جديد</span>
                        </button>
                    ` : ''}
                    ${this.hasPermission('add_customer') ? `
                        <button class="quick-action-item" onclick="salesSystem.openModal('customerModal'); salesSystem.closeDynamicModal('${arguments[0] || 'quickActions'}')">
                            <i class="fas fa-user-plus"></i>
                            <span>عميل جديد</span>
                            <small>F3</small>
                        </button>
                    ` : ''}
                    ${this.hasPermission('add_product') ? `
                        <button class="quick-action-item" onclick="salesSystem.openModal('productModal'); salesSystem.closeDynamicModal('${arguments[0] || 'quickActions'}')">
                            <i class="fas fa-box"></i>
                            <span>منتج جديد</span>
                            <small>F4</small>
                        </button>
                    ` : ''}
                    ${this.hasPermission('export_data') ? `
                        <button class="quick-action-item" onclick="salesSystem.exportData(); salesSystem.closeDynamicModal('${arguments[0] || 'quickActions'}')">
                            <i class="fas fa-download"></i>
                            <span>تصدير البيانات</span>
                            <small>Ctrl+E</small>
                        </button>
                    ` : ''}
                    <button class="quick-action-item" onclick="salesSystem.logout(); salesSystem.closeDynamicModal('${arguments[0] || 'quickActions'}')">
                        <i class="fas fa-sign-out-alt"></i>
                        <span>تسجيل الخروج</span>
                    </button>
                </div>
            </div>
        `;

        this.showModal('الإجراءات السريعة', quickActionsHtml, 'modal-sm');
    }

    focusSearch() {
        const activeSection = document.querySelector('.section.active')?.id;
        if (activeSection) {
            const searchInput = document.getElementById(`${activeSection}Search`);
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        }
    }

    createBackup() {
        if (this.hasPermission('export_data')) {
            this.exportData();
        } else {
            this.showAccessDenied('إنشاء نسخة احتياطية');
        }
    }

    // =============================================
    // SETTINGS MANAGEMENT
    // =============================================

    loadSettings() {
        const botTokenInput = document.getElementById('botToken');
        const chatIdInput = document.getElementById('chatId');

        if (botTokenInput) botTokenInput.value = this.data.settings.botToken || '';
        if (chatIdInput) chatIdInput.value = this.data.settings.chatId || '';

        const passwordInput = document.getElementById('adminPassword');
        if (passwordInput) passwordInput.value = this.data.settings.password || '';

        const notificationCheckboxes = [
            'telegramNotifications',
            'notifySales',
            'notifyContracts',
            'notifyCustomers',
            'notifyLowStock'
        ];

        notificationCheckboxes.forEach(checkboxId => {
            const checkbox = document.getElementById(checkboxId);
            if (checkbox) {
                const setting = checkboxId.replace('notify', '').toLowerCase();
                checkbox.checked = this.data.settings.notifications[setting] !== false;
            }
        });

        console.log('⚙️ تم تحميل الإعدادات');
    }

    async saveTelegramSettings() {
        if (!(await this.verifyPassword('أدخل كلمة المرور لحفظ إعدادات التليجرام'))) {
            this.addWarningNotification('تم إلغاء حفظ الإعدادات');
            return;
        }

        const botToken = document.getElementById('botToken')?.value.trim();
        const chatId = document.getElementById('chatId')?.value.trim();

        if (!botToken || !chatId) {
            this.addWarningNotification('يرجى ملء جميع الحقول');
            return;
        }

        this.data.settings.botToken = botToken;
        this.data.settings.chatId = chatId;

        await this.saveData();
        this.addSuccessNotification('تم حفظ إعدادات التليجرام بنجاح');

        console.log('💾 تم حفظ إعدادات التليجرام');
    }

    async testTelegramConnection() {
        const botToken = document.getElementById('botToken')?.value.trim();
        const chatId = document.getElementById('chatId')?.value.trim();

        if (!botToken || !chatId) {
            this.addWarningNotification('يرجى ملء البيانات أولاً');
            return;
        }

        if (!this.isOnline) {
            this.addWarningNotification('يتطلب الاتصال بالإنترنت لاختبار الاتصال');
            return;
        }

        try {
            this.showLoading(true);

            const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
            const testMessage = `🧪 اختبار الاتصال بنجاح!

🏷️ نظام Tag ElMalek v${this.version}
📅 ${this.formatDateTime(new Date())}
👨‍💼 تم الاختبار بواسطة: ${this.currentUser.fullName}
✅ الاتصال يعمل بشكل مثالي
🚀 النظام جاهز لإرسال الإشعارات`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: testMessage,
                    parse_mode: 'HTML'
                })
            });

            if (response.ok) {
                this.addSuccessNotification('تم اختبار الاتصال بنجاح! تحقق من التليجرام');
            } else {
                const errorData = await response.json();
                throw new Error(errorData.description || 'فشل الاتصال');
            }
        } catch (error) {
            console.error('خطأ في اختبار الاتصال:', error);
            this.addErrorNotification('فشل في اختبار الاتصال: ' + error.message);
        } finally {
            this.showLoading(false);
        }
    }

    async saveAdminPassword() {
        if (this.data.settings.password && this.data.settings.password.trim() !== '') {
            if (!(await this.verifyPassword('أدخل كلمة المرور الحالية للتأكيد'))) {
                this.addWarningNotification('تم إلغاء تغيير كلمة المرور');
                return;
            }
        }

        const newPassword = document.getElementById('adminPassword')?.value.trim();
        const confirmPassword = document.getElementById('confirmPassword')?.value.trim();

        if (newPassword !== confirmPassword) {
            this.addErrorNotification('كلمات المرور غير متطابقة');
            return;
        }

        if (newPassword.length > 0 && newPassword.length < 4) {
            this.addWarningNotification('كلمة المرور يجب أن تكون 4 أحرف على الأقل أو فارغة للإلغاء');
            return;
        }

        this.data.settings.password = newPassword;
        await this.saveData();

        if (newPassword.length > 0) {
            this.addSuccessNotification('تم تحديث كلمة المرور الإدارية بنجاح');
        } else {
            this.addSuccessNotification('تم إلغاء كلمة المرور الإدارية');
        }

        document.getElementById('adminPassword').value = '';
        document.getElementById('confirmPassword').value = '';

        console.log('🔐 تم تحديث كلمة المرور الإدارية');
    }

    async saveNotificationSettings() {
        if (!(await this.verifyPassword('أدخل كلمة المرور لحفظ إعدادات الإشعارات'))) {
            this.addWarningNotification('تم إلغاء حفظ الإعدادات');
            return;
        }

        const notifications = {
            sales: document.getElementById('notifySales')?.checked || false,
            contracts: document.getElementById('notifyContracts')?.checked || false,
            customers: document.getElementById('notifyCustomers')?.checked || false,
            lowStock: document.getElementById('notifyLowStock')?.checked || false,
            contractExpiry: document.getElementById('notifyContractExpiry')?.checked || false
        };

        this.data.settings.notifications = notifications;
        await this.saveData();

        this.addSuccessNotification('تم حفظ إعدادات الإشعارات بنجاح');
        console.log('🔔 تم حفظ إعدادات الإشعارات');
    }

    // =============================================
    // USER INTERFACE LOADING
    // =============================================

    async loadMainInterface() {
        // Update user info in header
        const userInfoElement = document.getElementById('userInfo');
        if (userInfoElement && this.currentUser) {
            const roleInfo = this.userRoles[this.currentUser.role];
            userInfoElement.innerHTML = `
                <div class="user-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="user-details">
                    <span class="user-name">${this.currentUser.fullName}</span>
                    <span class="user-role" style="color: ${roleInfo.color}">
                        ${roleInfo.name}
                    </span>
                </div>
            `;
        }

        // Hide/show elements based on permissions
        this.applyPermissions();

        // Show last login info
        const sessionData = JSON.parse(localStorage.getItem('tagelmalek_session'));
        if (sessionData) {
            const loginTime = new Date(sessionData.loginTime);
            const lastLoginElement = document.getElementById('lastLogin');
            if (lastLoginElement) {
                lastLoginElement.textContent = `آخر دخول: ${this.formatDateTime(loginTime)}`;
            }
        }
    }

    applyPermissions() {
        // Sales permissions
        const addSaleBtn = document.getElementById('addSaleBtn');
        if (addSaleBtn) addSaleBtn.style.display = this.hasPermission('add_sale') ? 'inline-block' : 'none';

        // Products permissions
        const addProductBtn = document.getElementById('addProductBtn');
        if (addProductBtn) addProductBtn.style.display = this.hasPermission('add_product') ? 'inline-block' : 'none';

        // Customers permissions
        const addCustomerBtn = document.getElementById('addCustomerBtn');
        if (addCustomerBtn) addCustomerBtn.style.display = this.hasPermission('add_customer') ? 'inline-block' : 'none';

        // Contracts permissions
        const addContractBtn = document.getElementById('addContractBtn');
        if (addContractBtn) addContractBtn.style.display = this.hasPermission('add_contract') ? 'inline-block' : 'none';

        // Export/Import permissions
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) exportBtn.style.display = this.hasPermission('export_data') ? 'inline-block' : 'none';

        const importBtn = document.getElementById('importBtn');
        if (importBtn) importBtn.style.display = this.hasPermission('export_data') ? 'inline-block' : 'none';

        // Reports permissions
        const reportsSection = document.getElementById('reports');
        if (reportsSection) {
            const isVisible = this.hasPermission('view_reports') || this.hasPermission('basic_reports');
            reportsSection.style.display = isVisible ? 'block' : 'none';
        }

        // Settings permissions (only admin can access full settings)
        const settingsSection = document.getElementById('settings');
        if (settingsSection) {
            settingsSection.style.display = this.hasPermission('*') ? 'block' : 'none';
        }

        // Bulk delete permissions
        const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');
        if (deleteSelectedBtn) {
            deleteSelectedBtn.style.display = this.hasPermission('delete_sale') ? 'inline-block' : 'none';
        }
    }
}

// =============================================
// GLOBAL FUNCTIONS AND INITIALIZATION
// =============================================

let salesSystem;

document.addEventListener('DOMContentLoaded', async function () {
    console.log(`🚀 بدء تحميل نظام Tag ElMalek المطور v2.2...`);

    try {
        salesSystem = new AdvancedSalesManagementSystem();
        window.salesSystem = salesSystem;

        window.addEventListener('error', (event) => {
            console.error('خطأ في النظام:', event.error);
            if (salesSystem) {
                salesSystem.addErrorNotification('حدث خطأ في النظام، يرجى إعادة تحميل الصفحة');
            }
        });

        window.addEventListener('unhandledrejection', (event) => {
            console.error('خطأ غير معالج:', event.reason);
            event.preventDefault();
        });

        console.log('✅ تم تحميل نظام Tag ElMalek مع الحماية والصلاحيات بنجاح!');

    } catch (error) {
        console.error('❌ فشل في تحميل النظام:', error);

        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.innerHTML = `
                <div class="error-message" style="text-align: center; color: #dc3545;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                    <h3>خطأ في تحميل النظام</h3>
                    <p>${error.message}</p>
                    <button onclick="location.reload()" class="btn btn-primary" style="margin-top: 1rem;">
                        <i class="fas fa-sync-alt"></i>
                        إعادة تحميل
                    </button>
                </div>
            `;
        }
    }
});

// Global functions for HTML access
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

function saveTelegramSettings() {
    if (window.salesSystem) {
        window.salesSystem.saveTelegramSettings();
    }
}

function testTelegramConnection() {
    if (window.salesSystem) {
        window.salesSystem.testTelegramConnection();
    }
}

function saveAdminPassword() {
    if (window.salesSystem) {
        window.salesSystem.saveAdminPassword();
    }
}

function saveNotificationSettings() {
    if (window.salesSystem) {
        window.salesSystem.saveNotificationSettings();
    }
}

function exportData() {
    if (window.salesSystem) {
        window.salesSystem.exportData();
    }
}

function importData() {
    if (window.salesSystem) {
        window.salesSystem.importData();
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');

    if (sidebar) {
        sidebar.classList.toggle('collapsed');
    }

    if (mainContent) {
        mainContent.style.marginRight = sidebar?.classList.contains('collapsed') ? '0' : '280px';
    }
}

function refreshDashboard() {
    if (window.salesSystem) {
        window.salesSystem.updateDashboard();
        window.salesSystem.addSuccessNotification('تم تحديث لوحة التحكم');
    }
}

function showQuickActions() {
    if (window.salesSystem) {
        window.salesSystem.showQuickActions();
    }
}

function showNotifications() {
    if (window.salesSystem) {
        window.salesSystem.showNotifications();
    }
}

// Auto-hide sidebar on small screens
window.addEventListener('resize', function () {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');

    if (window.innerWidth <= 768) {
        if (sidebar && !sidebar.classList.contains('collapsed')) {
            sidebar.classList.add('collapsed');
            if (mainContent) {
                mainContent.style.marginRight = '0';
            }
        }
    }
});

// Save data before leaving
window.addEventListener('beforeunload', function (event) {
    if (window.salesSystem) {
        window.salesSystem.saveData();
    }
});

// Add styles for enhanced UI
const enhancedStyles = document.createElement('style');
enhancedStyles.textContent = `
    .user-info {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px;
        border-radius: 8px;
        background: rgba(255,255,255,0.1);
    }
    
    .user-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: #667eea;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
    }
    
    .user-details {
        display: flex;
        flex-direction: column;
    }
    
    .user-name {
        font-weight: 600;
        font-size: 14px;
    }
    
    .user-role {
        font-size: 12px;
        opacity: 0.8;
    }
    
    .access-denied-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    }
    
    .created-by {
        font-size: 11px;
        color: #6b7280;
        font-weight: 500;
    }
    
    .phone-link, .email-link {
        color: #667eea;
        text-decoration: none;
    }
    
    .phone-link:hover, .email-link:hover {
        text-decoration: underline;
    }
    
    .low-stock-row {
        background-color: #fef3c7 !important;
    }
    
    .out-of-stock-row {
        background-color: #fee2e2 !important;
    }
    
    .contract-expiring {
        background-color: #fef3c7 !important;
    }
    
    .contract-expired {
        background-color: #fee2e2 !important;
    }
    
    @media (max-width: 768px) {
        .btn-group {
            display: flex;
            flex-wrap: wrap;
            gap: 2px;
        }
        
        .btn-group .btn {
            flex: 1;
            min-width: auto;
        }
    }
`;
document.head.appendChild(enhancedStyles);

console.log(`
🏷️ Tag ElMalek Advanced Sales Management System v2.2 🔐
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ النظام محمل مع نظام حماية وصلاحيات متكامل
🔐 حماية متعددة المستويات للعمليات
👥 إدارة المستخدمين والأدوار
📱 واجهة مستجيبة مع تحكم بالوصول
🛡️ حماية شاملة: إضافة/تعديل/حذف/تصدير
💾 حفظ تلقائي آمن كل 3 دقائق
🔔 نظام إشعارات متكامل
📊 تقارير محمية بالصلاحيات
🔒 نسخ احتياطية محمية
📱 تكامل تليجرام مع تتبع المستخدم
🚀 جاهز للاستخدام الإنتاجي الآمن
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);



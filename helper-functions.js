/**
 * Helper Functions for Tag ElMalek Advanced Sales Management System
 * Additional utilities and enhancements
 */

class HelperFunctions {
    // =============================================
    // FORMATTING UTILITIES
    // =============================================

    static formatCurrency(amount, currency = 'EGP', locale = 'ar-EG') {
        const symbols = {
            EGP: 'ج.م',
            USD: '$',
            EUR: '€',
            SAR: 'ر.س',
            AED: 'د.إ'
        };

        try {
            const formatted = new Intl.NumberFormat(locale, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }).format(amount);

            return `${formatted} ${symbols[currency] || currency}`;
        } catch (error) {
            return `${amount.toLocaleString()} ${symbols[currency] || currency}`;
        }
    }

    static formatNumber(number, decimals = 0) {
        try {
            return new Intl.NumberFormat('ar-EG', {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals
            }).format(number);
        } catch (error) {
            return number.toFixed(decimals);
        }
    }

    static formatDate(date, format = 'full') {
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
            time: {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            },
            datetime: {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }
        };

        try {
            return new Intl.DateTimeFormat('ar-EG', formats[format] || formats.full).format(dateObj);
        } catch (error) {
            return dateObj.toLocaleDateString('ar-EG');
        }
    }

    static formatFileSize(bytes) {
        const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
        if (bytes === 0) return '0 بايت';

        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    }

    // =============================================
    // VALIDATION UTILITIES
    // =============================================

    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static validatePhone(phone) {
        // Egyptian phone number patterns
        const patterns = [
            /^(\+20|0)?1[0125][0-9]{8}$/, // Mobile
            /^(\+20|0)?[23][0-9]{7}$/, // Landline
        ];

        const cleanPhone = phone.replace(/\s|-/g, '');
        return patterns.some(pattern => pattern.test(cleanPhone));
    }

    static validateURL(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    static validateRequired(value) {
        return value !== null && value !== undefined && value !== '';
    }

    static validateLength(value, min = 0, max = Infinity) {
        const length = value ? value.toString().length : 0;
        return length >= min && length <= max;
    }

    static validateNumber(value, min = -Infinity, max = Infinity) {
        const num = parseFloat(value);
        return !isNaN(num) && num >= min && num <= max;
    }

    // =============================================
    // DATA PROCESSING UTILITIES
    // =============================================

    static filterArray(array, filters) {
        return array.filter(item => {
            return Object.keys(filters).every(key => {
                const filterValue = filters[key];
                const itemValue = item[key];

                if (filterValue === null || filterValue === undefined || filterValue === '') {
                    return true;
                }

                if (typeof filterValue === 'string') {
                    return itemValue.toString().toLowerCase().includes(filterValue.toLowerCase());
                }

                return itemValue === filterValue;
            });
        });
    }

    static sortArray(array, sortBy, direction = 'asc') {
        return [...array].sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];

            // Handle dates
            if (sortBy.includes('date') || sortBy.includes('Date')) {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
            }

            // Handle numbers
            if (typeof aValue === 'string' && !isNaN(aValue)) {
                aValue = parseFloat(aValue);
                bValue = parseFloat(bValue);
            }

            if (direction === 'asc') {
                return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
            } else {
                return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
            }
        });
    }

    static groupBy(array, key) {
        return array.reduce((groups, item) => {
            const group = item[key];
            groups[group] = groups[group] || [];
            groups[group].push(item);
            return groups;
        }, {});
    }

    static calculatePercentage(value, total) {
        if (total === 0) return 0;
        return Math.round((value / total) * 100 * 100) / 100;
    }

    // =============================================
    // EXPORT UTILITIES
    // =============================================

    static exportToCSV(data, filename = 'export.csv') {
        if (!data.length) return;

        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(header => {
                const value = row[header];
                if (typeof value === 'string' && value.includes(',')) {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                return value;
            }).join(','))
        ].join('\n');

        this.downloadFile(csvContent, filename, 'text/csv');
    }

    static exportToJSON(data, filename = 'export.json') {
        const jsonContent = JSON.stringify(data, null, 2);
        this.downloadFile(jsonContent, filename, 'application/json');
    }

    static downloadFile(content, filename, contentType) {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    }

    // =============================================
    // UI UTILITIES
    // =============================================

    static debounce(func, wait) {
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

    static throttle(func, limit) {
        let inThrottle;
        return function (...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    static animateNumber(element, start, end, duration = 1000) {
        const range = end - start;
        const startTime = Date.now();

        const updateNumber = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const current = start + (range * this.easeOutQuart(progress));
            element.textContent = Math.round(current);

            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            }
        };

        requestAnimationFrame(updateNumber);
    }

    static easeOutQuart(t) {
        return 1 - (--t) * t * t * t;
    }

    static copyToClipboard(text) {
        if (navigator.clipboard) {
            return navigator.clipboard.writeText(text);
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                const successful = document.execCommand('copy');
                document.body.removeChild(textArea);
                return successful ? Promise.resolve() : Promise.reject();
            } catch (err) {
                document.body.removeChild(textArea);
                return Promise.reject(err);
            }
        }
    }

    // =============================================
    // BUSINESS LOGIC UTILITIES
    // =============================================

    static calculateBusinessDays(startDate, endDate) {
        let count = 0;
        const curDate = new Date(startDate);
        const endDateObj = new Date(endDate);

        while (curDate <= endDateObj) {
            const dayOfWeek = curDate.getDay();
            if (dayOfWeek !== 5 && dayOfWeek !== 6) { // Not Friday or Saturday
                count++;
            }
            curDate.setDate(curDate.getDate() + 1);
        }

        return count;
    }

    static generateBarcode(text) {
        // Simple barcode representation
        return `*${text}*`;
    }

    static generateQRCode(text, size = 200) {
        // Using a QR code service API
        return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`;
    }

    static calculateDiscount(originalPrice, discountPercent) {
        const discount = (originalPrice * discountPercent) / 100;
        return {
            discount: discount,
            finalPrice: originalPrice - discount,
            savings: discount
        };
    }

    static calculateTax(amount, taxRate = 14) {
        const tax = (amount * taxRate) / 100;
        return {
            taxAmount: tax,
            totalWithTax: amount + tax,
            taxRate: taxRate
        };
    }

    // =============================================
    // PDF GENERATION UTILITIES
    // =============================================

    static generateInvoicePDF(invoice) {
        const printWindow = window.open('', '_blank');
        const content = `
            <!DOCTYPE html>
            <html dir="rtl" lang="ar">
            <head>
                <meta charset="UTF-8">
                <title>فاتورة - ${invoice.invoiceNumber}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; direction: rtl; }
                    .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; }
                    .company-info { margin: 20px 0; }
                    .invoice-details { display: flex; justify-content: space-between; margin: 20px 0; }
                    .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: right; }
                    .items-table th { background-color: #f2f2f2; }
                    .total-section { text-align: right; margin-top: 20px; }
                    .footer { border-top: 1px solid #ddd; padding-top: 20px; text-align: center; }
                    @media print { body { margin: 0; } }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>🏷️ Tag ElMalek</h1>
                    <p>نظام إدارة المبيعات والاتفاقات</p>
                </div>
                
                <div class="company-info">
                    <h2>فاتورة مبيعات</h2>
                    <p><strong>رقم الفاتورة:</strong> ${invoice.invoiceNumber}</p>
                    <p><strong>التاريخ:</strong> ${this.formatDate(invoice.date)}</p>
                </div>
                
                <div class="invoice-details">
                    <div>
                        <h3>بيانات العميل:</h3>
                        <p>${invoice.customerName}</p>
                    </div>
                    <div>
                        <h3>طريقة الدفع:</h3>
                        <p>${invoice.paymentMethod || 'نقدي'}</p>
                    </div>
                </div>
                
                <table class="items-table">
                    <thead>
                        <tr>
                            <th>المنتج</th>
                            <th>الكمية</th>
                            <th>السعر</th>
                            <th>المجموع</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${invoice.productName}</td>
                            <td>${invoice.quantity}</td>
                            <td>${this.formatCurrency(invoice.price)}</td>
                            <td>${this.formatCurrency(invoice.total)}</td>
                        </tr>
                    </tbody>
                </table>
                
                <div class="total-section">
                    <p><strong>المجموع الفرعي: ${this.formatCurrency(invoice.total)}</strong></p>
                    <p><strong>الضريبة (14%): ${this.formatCurrency(invoice.total * 0.14)}</strong></p>
                    <p><strong>المجموع الكلي: ${this.formatCurrency(invoice.total * 1.14)}</strong></p>
                </div>
                
                ${invoice.notes ? `<div><strong>ملاحظات:</strong> ${invoice.notes}</div>` : ''}
                
                <div class="footer">
                    <p>شكراً لتعاملكم معنا</p>
                    <p>تم إنشاء هذه الفاتورة بواسطة نظام Tag ElMalek</p>
                </div>
            </body>
            </html>
        `;

        printWindow.document.write(content);
        printWindow.document.close();

        setTimeout(() => {
            printWindow.print();
        }, 500);
    }

    // =============================================
    // LOCAL STORAGE UTILITIES
    // =============================================

    static saveToLocalStorage(key, data) {
        try {
            const serialized = JSON.stringify(data);
            localStorage.setItem(key, serialized);
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    }

    static loadFromLocalStorage(key, defaultValue = null) {
        try {
            const serialized = localStorage.getItem(key);
            if (serialized === null) return defaultValue;
            return JSON.parse(serialized);
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return defaultValue;
        }
    }

    static removeFromLocalStorage(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    }

    static clearLocalStorage() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    }

    // =============================================
    // NOTIFICATION UTILITIES
    // =============================================

    static showBrowserNotification(title, options = {}) {
        if (!('Notification' in window)) {
            console.warn('This browser does not support notifications');
            return;
        }

        if (Notification.permission === 'granted') {
            new Notification(title, {
                icon: '/favicon.ico',
                badge: '/favicon.ico',
                ...options
            });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification(title, options);
                }
            });
        }
    }

    // =============================================
    // SEARCH AND FILTER UTILITIES
    // =============================================

    static performFuzzySearch(items, query, keys) {
        const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);

        return items.filter(item => {
            return searchTerms.every(term => {
                return keys.some(key => {
                    const value = this.getNestedValue(item, key);
                    return value && value.toString().toLowerCase().includes(term);
                });
            });
        });
    }

    static getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current && current[key], obj);
    }

    static highlightSearchTerms(text, query) {
        if (!query) return text;

        const searchTerms = query.split(' ').filter(term => term.length > 0);
        let highlighted = text;

        searchTerms.forEach(term => {
            const regex = new RegExp(`(${term})`, 'gi');
            highlighted = highlighted.replace(regex, '<mark>$1</mark>');
        });

        return highlighted;
    }

    // =============================================
    // PERFORMANCE UTILITIES
    // =============================================

    static measurePerformance(fn, name = 'Operation') {
        const start = performance.now();
        const result = fn();
        const end = performance.now();
        console.log(`${name} took ${(end - start).toFixed(2)}ms`);
        return result;
    }

    static batchOperation(items, batchSize = 100, operation) {
        const batches = [];
        for (let i = 0; i < items.length; i += batchSize) {
            batches.push(items.slice(i, i + batchSize));
        }

        return batches.map(batch => operation(batch));
    }

    // =============================================
    // CHART UTILITIES
    // =============================================

    static createChart(ctx, config) {
        return new Chart(ctx, {
            ...config,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            usePointStyle: true,
                            font: {
                                family: 'Cairo, Arial, sans-serif'
                            }
                        }
                    }
                },
                ...config.options
            }
        });
    }

    static getChartColors(count = 1) {
        const colors = [
            '#667eea', '#f093fb', '#4facfe', '#43e97b', '#ffd54f',
            '#ff7675', '#fd79a8', '#00b894', '#00cec9', '#a29bfe'
        ];

        return colors.slice(0, count);
    }

    // =============================================
    // NETWORK UTILITIES
    // =============================================

    static async fetchWithRetry(url, options = {}, maxRetries = 3) {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const response = await fetch(url, options);
                if (response.ok) {
                    return response;
                }
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            } catch (error) {
                if (attempt === maxRetries) {
                    throw error;
                }

                // Exponential backoff
                const delay = Math.pow(2, attempt) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }

    static isOnline() {
        return navigator.onLine;
    }

    static onNetworkChange(callback) {
        window.addEventListener('online', () => callback(true));
        window.addEventListener('offline', () => callback(false));
    }
}

// =============================================
// ADVANCED SEARCH AND FILTER CLASS
// =============================================

class AdvancedSearchFilter {
    constructor(systemInstance) {
        this.system = systemInstance;
        this.searchHistory = this.loadSearchHistory();
        this.setupAdvancedSearch();
    }

    setupAdvancedSearch() {
        this.addSearchBoxes();
        this.setupFilterPanels();
        this.setupSearchHistory();
    }

    addSearchBoxes() {
        const sections = ['sales', 'contracts', 'customers', 'products'];

        sections.forEach(section => {
            const container = document.querySelector(`#${section} .section-header`);
            if (container && !container.querySelector('.advanced-search-container')) {
                const searchContainer = document.createElement('div');
                searchContainer.className = 'advanced-search-container';
                searchContainer.innerHTML = this.createSearchHTML(section);

                container.appendChild(searchContainer);
                this.bindSearchEvents(section);
            }
        });
    }

    createSearchHTML(section) {
        return `
            <div class="search-filters-panel">
                <div class="search-row">
                    <div class="search-input-container">
                        <i class="fas fa-search search-icon"></i>
                        <input type="text" 
                               id="${section}AdvancedSearch" 
                               class="advanced-search-input"
                               placeholder="البحث في ${this.getSectionTitle(section)}..."
                               autocomplete="off">
                        <button class="clear-search-btn" onclick="this.clearSearch('${section}')">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <button class="filters-toggle-btn" onclick="this.toggleFilters('${section}')">
                        <i class="fas fa-filter"></i>
                        فلاتر متقدمة
                    </button>
                </div>
                
                <div class="advanced-filters-panel" id="${section}FiltersPanel" style="display: none;">
                    ${this.createFiltersHTML(section)}
                </div>
                
                <div class="search-results-info" id="${section}SearchInfo" style="display: none;">
                    <span class="results-count">0 نتيجة</span>
                    <span class="search-time">في 0ms</span>
                </div>
            </div>
        `;
    }

    createFiltersHTML(section) {
        const filters = this.getAvailableFilters(section);

        return `
            <div class="filters-grid">
                ${filters.map(filter => `
                    <div class="filter-group">
                        <label>${filter.label}:</label>
                        ${this.createFilterInput(filter, section)}
                    </div>
                `).join('')}
            </div>
            <div class="filters-actions">
                <button class="btn btn-primary btn-sm" onclick="advancedSearch.applyFilters('${section}')">
                    <i class="fas fa-search"></i> تطبيق
                </button>
                <button class="btn btn-secondary btn-sm" onclick="advancedSearch.clearFilters('${section}')">
                    <i class="fas fa-eraser"></i> إلغاء
                </button>
                <button class="btn btn-info btn-sm" onclick="advancedSearch.saveFilter('${section}')">
                    <i class="fas fa-bookmark"></i> حفظ الفلتر
                </button>
            </div>
        `;
    }

    getAvailableFilters(section) {
        const filterMap = {
            sales: [
                { key: 'status', label: 'الحالة', type: 'select', options: ['مكتملة', 'قيد التنفيذ', 'ملغية'] },
                { key: 'paymentMethod', label: 'طريقة الدفع', type: 'select', options: ['نقدي', 'آجل', 'بطاقة ائتمان', 'حوالة بنكية'] },
                { key: 'dateFrom', label: 'من تاريخ', type: 'date' },
                { key: 'dateTo', label: 'إلى تاريخ', type: 'date' },
                { key: 'minAmount', label: 'أقل مبلغ', type: 'number' },
                { key: 'maxAmount', label: 'أعلى مبلغ', type: 'number' }
            ],
            contracts: [
                { key: 'type', label: 'نوع الاتفاق', type: 'select', options: ['خدمات', 'توريد', 'صيانة', 'استشارات'] },
                { key: 'status', label: 'الحالة', type: 'select', options: ['نشط', 'معلق', 'منتهي'] },
                { key: 'startDateFrom', label: 'بداية من', type: 'date' },
                { key: 'endDateTo', label: 'انتهاء حتى', type: 'date' },
                { key: 'minValue', label: 'أقل قيمة', type: 'number' },
                { key: 'maxValue', label: 'أعلى قيمة', type: 'number' }
            ],
            customers: [
                { key: 'type', label: 'نوع العميل', type: 'select', options: ['فرد', 'شركة', 'جهة حكومية'] },
                { key: 'registrationFrom', label: 'مسجل من', type: 'date' },
                { key: 'registrationTo', label: 'مسجل حتى', type: 'date' },
                { key: 'minPurchases', label: 'أقل مشتريات', type: 'number' },
                { key: 'maxPurchases', label: 'أعلى مشتريات', type: 'number' }
            ],
            products: [
                { key: 'category', label: 'الفئة', type: 'select', options: ['إلكترونيات', 'ملابس', 'أدوات منزلية', 'كتب', 'أخرى'] },
                { key: 'status', label: 'الحالة', type: 'select', options: ['متاح', 'غير متاح', 'مخزون منخفض'] },
                { key: 'minPrice', label: 'أقل سعر', type: 'number' },
                { key: 'maxPrice', label: 'أعلى سعر', type: 'number' },
                { key: 'minStock', label: 'أقل مخزون', type: 'number' },
                { key: 'maxStock', label: 'أعلى مخزون', type: 'number' }
            ]
        };

        return filterMap[section] || [];
    }

    createFilterInput(filter, section) {
        const inputId = `${section}_filter_${filter.key}`;

        switch (filter.type) {
            case 'select':
                return `
                    <select id="${inputId}" class="filter-input">
                        <option value="">الكل</option>
                        ${filter.options.map(option => `<option value="${option}">${option}</option>`).join('')}
                    </select>
                `;
            case 'date':
                return `<input type="date" id="${inputId}" class="filter-input">`;
            case 'number':
                return `<input type="number" id="${inputId}" class="filter-input" placeholder="أدخل ${filter.label}">`;
            default:
                return `<input type="text" id="${inputId}" class="filter-input" placeholder="أدخل ${filter.label}">`;
        }
    }

    bindSearchEvents(section) {
        const searchInput = document.getElementById(`${section}AdvancedSearch`);
        if (searchInput) {
            searchInput.addEventListener('input', HelperFunctions.debounce((e) => {
                this.performSearch(section, e.target.value);
            }, 300));

            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.addToSearchHistory(section, e.target.value);
                }
            });
        }
    }

    performSearch(section, query) {
        const startTime = performance.now();

        let data = this.system.data[section] || [];
        let filteredData = [...data];

        // Apply text search
        if (query.trim()) {
            filteredData = this.searchInData(filteredData, query, section);
        }

        // Apply active filters
        const activeFilters = this.getActiveFilters(section);
        if (Object.keys(activeFilters).length > 0) {
            filteredData = this.applyFilters(filteredData, activeFilters, section);
        }

        const endTime = performance.now();
        const searchTime = Math.round(endTime - startTime);

        // Update UI
        this.updateSearchResults(section, filteredData, data.length, searchTime);
        this.highlightSearchTerms(section, query);

        return filteredData;
    }

    searchInData(data, query, section) {
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

    getActiveFilters(section) {
        const filters = {};
        const availableFilters = this.getAvailableFilters(section);

        availableFilters.forEach(filter => {
            const inputId = `${section}_filter_${filter.key}`;
            const input = document.getElementById(inputId);
            if (input && input.value) {
                filters[filter.key] = input.value;
            }
        });

        return filters;
    }

    applyFilters(data, filters, section) {
        return data.filter(item => {
            return Object.entries(filters).every(([key, value]) => {
                return this.matchesFilter(item, key, value, section);
            });
        });
    }

    matchesFilter(item, filterKey, filterValue, section) {
        switch (filterKey) {
            case 'dateFrom':
                return !item.date || item.date >= filterValue;
            case 'dateTo':
                return !item.date || item.date <= filterValue;
            case 'startDateFrom':
                return !item.startDate || item.startDate >= filterValue;
            case 'endDateTo':
                return !item.endDate || item.endDate <= filterValue;
            case 'registrationFrom':
                return !item.registrationDate || item.registrationDate >= filterValue;
            case 'registrationTo':
                return !item.registrationDate || item.registrationDate <= filterValue;
            case 'minAmount':
                return !item.total || item.total >= parseFloat(filterValue);
            case 'maxAmount':
                return !item.total || item.total <= parseFloat(filterValue);
            case 'minValue':
                return !item.value || item.value >= parseFloat(filterValue);
            case 'maxValue':
                return !item.value || item.value <= parseFloat(filterValue);
            case 'minPurchases':
                return !item.totalPurchases || item.totalPurchases >= parseFloat(filterValue);
            case 'maxPurchases':
                return !item.totalPurchases || item.totalPurchases <= parseFloat(filterValue);
            case 'minPrice':
                return !item.price || item.price >= parseFloat(filterValue);
            case 'maxPrice':
                return !item.price || item.price <= parseFloat(filterValue);
            case 'minStock':
                return !item.stock || item.stock >= parseInt(filterValue);
            case 'maxStock':
                return !item.stock || item.stock <= parseInt(filterValue);
            default:
                return !item[filterKey] || item[filterKey] === filterValue;
        }
    }

    updateSearchResults(section, filteredData, totalCount, searchTime) {
        const infoElement = document.getElementById(`${section}SearchInfo`);
        if (infoElement) {
            const resultCount = filteredData.length;
            infoElement.style.display = 'block';
            infoElement.querySelector('.results-count').textContent =
                `${resultCount} من ${totalCount} نتيجة`;
            infoElement.querySelector('.search-time').textContent = `في ${searchTime}ms`;
        }

        // Update table with filtered data
        this.updateTableWithFilteredData(section, filteredData);
    }

    updateTableWithFilteredData(section, data) {
        // This would integrate with the main system to update the table
        if (this.system && this.system[`update${section.charAt(0).toUpperCase() + section.slice(1)}Table`]) {
            // Temporarily replace the data for display
            const originalData = this.system.data[section];
            this.system.data[section] = data;
            this.system[`update${section.charAt(0).toUpperCase() + section.slice(1)}Table`]();
            this.system.data[section] = originalData;
        }
    }

    highlightSearchTerms(section, query) {
        if (!query.trim()) return;

        const tableBody = document.getElementById(`${section}TableBody`);
        if (!tableBody) return;

        const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
        const rows = tableBody.querySelectorAll('tr');

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            searchTerms.forEach(term => {
                cells.forEach(cell => {
                    if (cell.innerHTML && typeof cell.innerHTML === 'string') {
                        const regex = new RegExp(`(${term})`, 'gi');
                        cell.innerHTML = cell.innerHTML.replace(regex, '<mark>$1</mark>');
                    }
                });
            });
        });
    }

    addToSearchHistory(section, query) {
        if (!query.trim()) return;

        if (!this.searchHistory[section]) {
            this.searchHistory[section] = [];
        }

        // Remove if already exists
        this.searchHistory[section] = this.searchHistory[section].filter(item => item.query !== query);

        // Add to beginning
        this.searchHistory[section].unshift({
            query: query,
            timestamp: new Date().toISOString(),
            section: section
        });

        // Keep only last 10 searches
        this.searchHistory[section] = this.searchHistory[section].slice(0, 10);

        this.saveSearchHistory();
    }

    loadSearchHistory() {
        return HelperFunctions.loadFromLocalStorage('tagelmalek_search_history', {});
    }

    saveSearchHistory() {
        HelperFunctions.saveToLocalStorage('tagelmalek_search_history', this.searchHistory);
    }

    getSectionTitle(section) {
        const titles = {
            sales: 'المبيعات',
            contracts: 'الاتفاقات',
            customers: 'العملاء',
            products: 'المنتجات'
        };
        return titles[section] || section;
    }

    toggleFilters(section) {
        const panel = document.getElementById(`${section}FiltersPanel`);
        if (panel) {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        }
    }

    clearSearch(section) {
        const searchInput = document.getElementById(`${section}AdvancedSearch`);
        if (searchInput) {
            searchInput.value = '';
            this.performSearch(section, '');
        }
    }

    clearFilters(section) {
        const availableFilters = this.getAvailableFilters(section);
        availableFilters.forEach(filter => {
            const inputId = `${section}_filter_${filter.key}`;
            const input = document.getElementById(inputId);
            if (input) {
                input.value = '';
            }
        });

        this.performSearch(section, document.getElementById(`${section}AdvancedSearch`).value || '');
    }
}

// =============================================
// REPORTING SYSTEM
// =============================================

class AdvancedReporting {
    constructor(systemInstance) {
        this.system = systemInstance;
        this.reportCache = new Map();
        this.setupReporting();
    }

    setupReporting() {
        this.createReportingInterface();
        this.bindReportEvents();
    }

    createReportingInterface() {
        // This would create advanced reporting interface
        console.log('📊 Advanced Reporting System initialized');
    }

    generateDailyReport(date = new Date()) {
        const reportDate = date.toISOString().split('T')[0];
        const cacheKey = `daily_${reportDate}`;

        if (this.reportCache.has(cacheKey)) {
            return this.reportCache.get(cacheKey);
        }

        const report = {
            date: reportDate,
            sales: this.getDailySalesReport(reportDate),
            contracts: this.getDailyContractsReport(reportDate),
            customers: this.getDailyCustomersReport(reportDate),
            summary: {}
        };

        report.summary = {
            totalSales: report.sales.total,
            salesCount: report.sales.count,
            newContracts: report.contracts.new.length,
            newCustomers: report.customers.new.length,
            avgOrderValue: report.sales.count > 0 ? report.sales.total / report.sales.count : 0
        };

        this.reportCache.set(cacheKey, report);
        return report;
    }

    generateWeeklyReport(startDate = new Date()) {
        const weekStart = new Date(startDate);
        weekStart.setDate(startDate.getDate() - startDate.getDay());

        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);

        const cacheKey = `weekly_${weekStart.toISOString().split('T')[0]}`;

        if (this.reportCache.has(cacheKey)) {
            return this.reportCache.get(cacheKey);
        }

        const report = {
            startDate: weekStart.toISOString().split('T')[0],
            endDate: weekEnd.toISOString().split('T')[0],
            dailyReports: [],
            summary: {}
        };

        // Generate daily reports for the week
        for (let d = new Date(weekStart); d <= weekEnd; d.setDate(d.getDate() + 1)) {
            report.dailyReports.push(this.generateDailyReport(new Date(d)));
        }

        // Calculate weekly totals
        report.summary = {
            totalSales: report.dailyReports.reduce((sum, day) => sum + day.summary.totalSales, 0),
            totalSalesCount: report.dailyReports.reduce((sum, day) => sum + day.summary.salesCount, 0),
            totalNewContracts: report.dailyReports.reduce((sum, day) => sum + day.summary.newContracts, 0),
            totalNewCustomers: report.dailyReports.reduce((sum, day) => sum + day.summary.newCustomers, 0),
            avgDailySales: 0,
            bestDay: null,
            worstDay: null
        };

        report.summary.avgDailySales = report.summary.totalSales / 7;

        // Find best and worst days
        let bestDayAmount = 0;
        let worstDayAmount = Infinity;

        report.dailyReports.forEach(day => {
            if (day.summary.totalSales > bestDayAmount) {
                bestDayAmount = day.summary.totalSales;
                report.summary.bestDay = day.date;
            }
            if (day.summary.totalSales < worstDayAmount) {
                worstDayAmount = day.summary.totalSales;
                report.summary.worstDay = day.date;
            }
        });

        this.reportCache.set(cacheKey, report);
        return report;
    }

    getDailySalesReport(date) {
        const sales = this.system.data.sales.filter(sale => sale.date === date);

        return {
            date: date,
            sales: sales,
            count: sales.length,
            total: sales.reduce((sum, sale) => sum + sale.total, 0),
            byPaymentMethod: this.groupBy(sales, 'paymentMethod'),
            byCustomer: this.groupBy(sales, 'customerName'),
            byProduct: this.groupBy(sales, 'productName'),
            hourlyDistribution: this.getHourlyDistribution(sales)
        };
    }

    getDailyContractsReport(date) {
        const contracts = this.system.data.contracts.filter(contract =>
            contract.startDate === date || contract.createdAt?.startsWith(date)
        );

        return {
            date: date,
            new: contracts,
            count: contracts.length,
            totalValue: contracts.reduce((sum, contract) => sum + contract.value, 0),
            byType: this.groupBy(contracts, 'type'),
            byCustomer: this.groupBy(contracts, 'customerName')
        };
    }

    getDailyCustomersReport(date) {
        const customers = this.system.data.customers.filter(customer =>
            customer.registrationDate === date
        );

        return {
            date: date,
            new: customers,
            count: customers.length,
            byType: this.groupBy(customers, 'type')
        };
    }

    getHourlyDistribution(sales) {
        const hourly = {};
        for (let i = 0; i < 24; i++) {
            hourly[i] = { count: 0, total: 0 };
        }

        sales.forEach(sale => {
            if (sale.createdAt) {
                const hour = new Date(sale.createdAt).getHours();
                hourly[hour].count++;
                hourly[hour].total += sale.total;
            }
        });

        return hourly;
    }

    groupBy(array, key) {
        return array.reduce((groups, item) => {
            const group = item[key] || 'غير محدد';
            if (!groups[group]) {
                groups[group] = [];
            }
            groups[group].push(item);
            return groups;
        }, {});
    }

    exportReportToPDF(report, reportType = 'daily') {
        const reportTitle = `تقرير ${reportType === 'daily' ? 'يومي' : 'أسبوعي'} - Tag ElMalek`;

        HelperFunctions.generateInvoicePDF({
            invoiceNumber: `RPT-${Date.now()}`,
            customerName: 'إدارة النظام',
            productName: reportTitle,
            quantity: 1,
            price: 0,
            total: report.summary?.totalSales || 0,
            date: report.date || report.startDate,
            paymentMethod: 'تقرير',
            notes: this.generateReportSummary(report)
        });
    }

    generateReportSummary(report) {
        if (report.summary) {
            return `
إجمالي المبيعات: ${HelperFunctions.formatCurrency(report.summary.totalSales)}
عدد المبيعات: ${report.summary.totalSalesCount || report.summary.salesCount}
متوسط قيمة الطلب: ${HelperFunctions.formatCurrency(report.summary.avgOrderValue)}
عملاء جدد: ${report.summary.totalNewCustomers || report.summary.newCustomers}
اتفاقات جديدة: ${report.summary.totalNewContracts || report.summary.newContracts}
            `.trim();
        }
        return 'تقرير مفصل للنشاط التجاري';
    }

    bindReportEvents() {
        // Bind report generation events
        console.log('📋 Report events bound');
    }

    clearReportCache() {
        this.reportCache.clear();
        console.log('🗑️ Report cache cleared');
    }
}

// =============================================
// GLOBAL INITIALIZATION
// =============================================

// Initialize advanced features when system is ready
document.addEventListener('DOMContentLoaded', function () {
    // Wait for main system to initialize
    setTimeout(() => {
        if (window.salesSystem) {
            // Initialize advanced search
            window.advancedSearch = new AdvancedSearchFilter(window.salesSystem);

            // Initialize advanced reporting
            window.advancedReporting = new AdvancedReporting(window.salesSystem);

            // Make helper functions globally available
            window.HelperFunctions = HelperFunctions;

            console.log('🚀 Advanced Helper Functions initialized successfully!');
        }
    }, 1500);
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        HelperFunctions,
        AdvancedSearchFilter,
        AdvancedReporting
    };
}

console.log('🔧 Helper Functions script loaded successfully!');

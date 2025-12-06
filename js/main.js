
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar-elegant');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    document.querySelectorAll('.brand-card-elegant, .product-card-elegant').forEach(el => {
        observer.observe(el);
    });

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        emailjs.init("Jm_erYIMlPMfxsR3w");
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            if (!validateForm()) {
                showAlert('Por favor, complete todos los campos obligatorios correctamente.', 'warning');
                return;
            }
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="bi bi-arrow-repeat spinner"></i> Enviando...';
            
            const templateParams = {
                from_name: document.getElementById('nombre').value,
                from_company: document.getElementById('empresa').value || 'No especificada',
                from_email: document.getElementById('email').value,
                from_phone: document.getElementById('telefono').value,
                subject: document.getElementById('asunto').value,
                message: document.getElementById('mensaje').value,
                newsletter: document.getElementById('newsletter').checked ? 'Sí' : 'No',
                to_email: 'apoloimportaciones97@gmail.com'
            };
            
            emailjs.send('service_apolo', 'template_apolo', templateParams)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    showAlert('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.', 'success');
                    contactForm.reset();
                }, function(error) {
                    console.error('FAILED...', error);
                    showAlert('Error al enviar el mensaje. Por favor, inténtelo nuevamente.', 'warning');
                })
                .finally(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                });
        });
    }
    const searchForms = document.querySelectorAll('.search-form');
    
    function showAllProducts() {
        document.querySelectorAll('.product-card-elegant').forEach(card => {
            card.style.display = 'block';
            card.classList.remove('highlighted');
        });
        
        document.querySelectorAll('.search-highlight').forEach(el => {
            el.outerHTML = el.innerHTML;
        });
        
        document.querySelectorAll('.no-results-message').forEach(msg => msg.remove());
        
        if (window.location.pathname.includes('productos.html')) {
            const newUrl = new URL(window.location);
            newUrl.searchParams.delete('search');
            window.history.pushState({}, '', newUrl);
        }
    }

    function highlightSearchTerms(searchTerm) {
        if (!searchTerm || searchTerm.trim() === '') {
            showAllProducts();
            return;
        }
        
        document.querySelectorAll('.highlighted').forEach(el => {
            el.classList.remove('highlighted');
        });
        
        document.querySelectorAll('.search-highlight').forEach(el => {
            el.outerHTML = el.innerHTML;
        });
        
        document.querySelectorAll('.no-results-message').forEach(msg => msg.remove());
        
        const productCards = document.querySelectorAll('.product-card-elegant');
        let foundProducts = 0;
        
        productCards.forEach(card => {
            const productNameEl = card.querySelector('.product-name');
            const productDescEl = card.querySelector('.product-desc');
            const productSpecsEl = card.querySelector('.product-specs');

            const productName = productNameEl ? productNameEl.textContent.toLowerCase() : '';
            const productDesc = productDescEl ? productDescEl.textContent.toLowerCase() : '';
            const productSpecs = productSpecsEl ? productSpecsEl.textContent.toLowerCase() : '';
            
            const searchTerms = searchTerm.split(' ');
            let matchFound = false;
            
            searchTerms.forEach(term => {
                if (term.length > 1 && (
                    productName.includes(term) || 
                    productDesc.includes(term) || 
                    productSpecs.includes(term)
                )) {
                    matchFound = true;
                }
            });
            
            if (matchFound) {
                foundProducts++;
                card.style.display = 'block';
                card.classList.add('highlighted');
                if (productNameEl) highlightTextInElement(productNameEl, searchTerm);
                if (productDescEl) highlightTextInElement(productDescEl, searchTerm);
                if (productSpecsEl) highlightTextInElement(productSpecsEl, searchTerm);
            } else {
                card.style.display = 'none';
            }
        });
        
        if (foundProducts > 0) {
            showAlert(`Se encontraron ${foundProducts} productos para "${searchTerm}"`, 'success');
        } else {
            showAlert(`No se encontraron productos para "${searchTerm}"`, 'warning');
            showNoResultsMessage(searchTerm);
        }
    }

    function highlightTextInElement(element, searchTerm) {
        if (!element) return;
        const text = element.innerHTML;
        const searchTerms = searchTerm.split(' ');
        
        let highlightedText = text;
        searchTerms.forEach(term => {
            if (term.length > 1) {
                const regex = new RegExp(`(${term})`, 'gi');
                highlightedText = highlightedText.replace(regex, '<mark class="search-highlight">$1</mark>');
            }
        });
        
        element.innerHTML = highlightedText;
    }
    function showNoResultsMessage(searchTerm) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'no-results-message';
        messageDiv.innerHTML = `
            <i class="bi bi-search"></i>
            <h4>No se encontraron productos</h4>
            <p>No hay resultados para "<strong>${searchTerm}</strong>"</p>
            <p class="text-muted">Intenta con otros términos de búsqueda</p>
            <button class="btn btn-primary mt-3" onclick="showAllProducts()">
                Ver todos los productos
            </button>
        `;
        
        const sectionTitles = document.querySelectorAll('.section-title');
        if (sectionTitles.length > 0) {
            sectionTitles[0].parentNode.parentNode.appendChild(messageDiv);
        }
    }

    function processURLSearch() {
        const urlParams = new URLSearchParams(window.location.search);
        const searchParam = urlParams.get('search');
        
        if (searchParam) {
            const searchInput = document.querySelector('input[type="search"]');
            if (searchInput) {
                searchInput.value = searchParam;
                highlightSearchTerms(searchParam.toLowerCase());
            }
        }
    }

    searchForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchInput = this.querySelector('input[type="search"]');
            const searchTerm = searchInput.value.trim().toLowerCase();
            
            if (searchTerm) {
                if (window.location.pathname.includes('productos.html')) {
                    highlightSearchTerms(searchTerm);
                    const newUrl = new URL(window.location);
                    newUrl.searchParams.set('search', searchTerm);
                    window.history.pushState({}, '', newUrl);
                } else {
                    window.location.href = `productos.html?search=${encodeURIComponent(searchTerm)}`;
                }
            } else {
                showAllProducts();
            }
        });
    });

    searchForms.forEach(form => {
        const searchInput = form.querySelector('input[type="search"]');
        if (searchInput) {
            let searchTimeout;
            
            searchInput.addEventListener('input', function() {
                clearTimeout(searchTimeout);
                const searchTerm = this.value.trim().toLowerCase();
                
                const clearBtn = this.parentNode.querySelector('.btn-clear-search');
                if (clearBtn) {
                    clearBtn.style.display = this.value ? 'block' : 'none';
                }
                
                if (searchTerm.length >= 2) {
                    searchTimeout = setTimeout(() => {
                        if (window.location.pathname.includes('productos.html')) {
                            highlightSearchTerms(searchTerm);
                        }
                    }, 500);
                } else if (searchTerm.length === 0) {
                    showAllProducts();
                }
            });
            
            const clearBtn = document.createElement('button');
            clearBtn.type = 'button';
            clearBtn.className = 'btn btn-clear-search';
            clearBtn.innerHTML = '<i class="bi bi-x"></i>';
            clearBtn.style.cssText = `
                position: absolute;
                right: 40px;
                top: 50%;
                transform: translateY(-50%);
                background: transparent;
                border: none;
                color: #666;
                display: none;
                z-index: 5;
            `;
            
            form.querySelector('.input-group').style.position = 'relative';
            form.querySelector('.input-group').appendChild(clearBtn);
            
            clearBtn.addEventListener('click', function() {
                searchInput.value = '';
                searchInput.focus();
                this.style.display = 'none';
                
                showAllProducts();
            });

            searchInput.addEventListener('search', function() {
                if (this.value === '') {
                    showAllProducts();
                }
            });
        }
    });

    const yearElements = document.querySelectorAll('.footer-bottom p');
    yearElements.forEach(element => {
        if (element.textContent.includes('2024')) {
            const currentYear = new Date().getFullYear();
            element.innerHTML = element.innerHTML.replace('2024', currentYear);
        }
    });

    function showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert-${type}`;
        alertDiv.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            transform: translateX(400px);
            transition: transform 0.3s ease;
        `;
        
        if (type === 'success') {
            alertDiv.style.background = 'var(--accent-color)';
        } else if (type === 'warning') {
            alertDiv.style.background = '#f59e0b';
        } else if (type === 'info') {
            alertDiv.style.background = 'var(--primary-color)';
        }
        
        alertDiv.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="bi bi-${getAlertIcon(type)} me-2"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
            alertDiv.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            alertDiv.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (alertDiv.parentNode) {
                    alertDiv.remove();
                }
            }, 300);
        }, 5000);
    }

    function getAlertIcon(type) {
        const icons = {
            'success': 'check-circle-fill',
            'warning': 'exclamation-triangle-fill',
            'info': 'info-circle-fill'
        };
        return icons[type] || 'info-circle-fill';
    }

    const carousels = document.querySelectorAll('.carousel');
    carousels.forEach(carousel => {
        new bootstrap.Carousel(carousel, {
            interval: 5000,
            wrap: true
        });
    });

    if (window.location.pathname.includes('productos.html')) {
        processURLSearch();
    }

    window.showAllProducts = showAllProducts;
});

const style = document.createElement('style');
style.textContent = `
    .spinner {
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    .contact-section {
        background: var(--white);
    }
    
    .contact-info-card {
        background: var(--white);
        padding: 2rem;
        border-radius: 12px;
        box-shadow: var(--shadow);
    }
    
    .contact-item {
        display: flex;
        align-items: flex-start;
        margin-bottom: 1.5rem;
        padding-bottom: 1.5rem;
        border-bottom: 1px solid var(--border-color);
    }
    
    .contact-item:last-child {
        border-bottom: none;
        margin-bottom: 0;
        padding-bottom: 0;
    }
    
    .contact-item i {
        color: var(--accent-color);
        font-size: 1.2rem;
        margin-right: 1rem;
        margin-top: 0.25rem;
        min-width: 20px;
    }
    
    .contact-item h5 {
        color: var(--primary-color);
        margin-bottom: 0.5rem;
    }
    
    .contact-item p {
        color: var(--gray-dark);
        margin: 0;
    }

    /* Estilos para el buscador mejorado */
    .search-highlight {
        background-color: #FFD700;
        padding: 2px 4px;
        border-radius: 3px;
        font-weight: bold;
    }

    .product-card-elegant.highlighted {
        border: 2px solid var(--accent-color);
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        transition: all 0.3s ease;
    }

    .btn-clear-search:hover {
        color: var(--accent-color) !important;
        transform: scale(1.1);
    }

    .input-group:focus-within .btn-clear-search {
        color: var(--accent-color);
    }

    .btn-clear-search {
        transition: all 0.3s ease;
        cursor: pointer;
    }

    /* Animación para productos encontrados */
    @keyframes highlightPulse {
        0% { box-shadow: 0 0 0 0 rgba(var(--accent-rgb), 0.4); }
        70% { box-shadow: 0 0 0 10px rgba(var(--accent-rgb), 0); }
        100% { box-shadow: 0 0 0 0 rgba(var(--accent-rgb), 0); }
    }

    .product-card-elegant.highlighted {
        animation: highlightPulse 2s;
    }

    /* Estilo para cuando no hay resultados */
    .no-results-message {
        text-align: center;
        padding: 3rem;
        color: var(--gray-dark);
        grid-column: 1 / -1;
    }

    .no-results-message i {
        font-size: 3rem;
        color: var(--gray-light);
        margin-bottom: 1rem;
    }

    /* Animación suave para mostrar/ocultar productos */
    .product-card-elegant {
        transition: all 0.3s ease;
    }
`;
document.head.appendChild(style);

function validateForm() {
    const nombre = document.getElementById('nombre');
    const email = document.getElementById('email');
    const telefono = document.getElementById('telefono');
    const asunto = document.getElementById('asunto');
    const mensaje = document.getElementById('mensaje');
    
    if (!nombre || !email || !telefono || !asunto || !mensaje) return true;
    
    let isValid = true;
    
    if (nombre.value.trim() === '') {
        markInvalid(nombre);
        isValid = false;
    } else {
        markValid(nombre);
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
        markInvalid(email);
        isValid = false;
    } else {
        markValid(email);
    }
    
    if (telefono.value.trim() === '') {
        markInvalid(telefono);
        isValid = false;
    } else {
        markValid(telefono);
    }
    
    if (asunto.value === '') {
        markInvalid(asunto);
        isValid = false;
    } else {
        markValid(asunto);
    }
    
    if (mensaje.value.trim() === '') {
        markInvalid(mensaje);
        isValid = false;
    } else {
        markValid(mensaje);
    }
    
    return isValid;
}

function markInvalid(element) {
    element.style.borderColor = '#dc3545';
    element.style.boxShadow = '0 0 0 0.2rem rgba(220, 53, 69, 0.25)';
}

function markValid(element) {
    element.style.borderColor = '#28a745';
    element.style.boxShadow = '0 0 0 0.2rem rgba(40, 167, 69, 0.25)';
}
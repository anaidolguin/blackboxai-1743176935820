// Main Application Module
const MedicalRecordApp = (() => {
    // DOM Elements
    const elements = {
        appContainer: document.getElementById('app'),
        contentArea: document.getElementById('content')
    };

    // State
    let currentView = 'dashboard';
    let patients = [];
    let consultations = [];

    // Initialize the application
    const init = () => {
        renderHeader();
        renderNavigation();
        loadView(currentView);
        setupEventListeners();
    };

    // Render application header
    const renderHeader = () => {
        const header = document.createElement('header');
        header.className = 'bg-white shadow-sm py-4 px-6';
        header.innerHTML = `
            <div class="container mx-auto flex justify-between items-center">
                <h1 class="text-2xl font-bold text-blue-600">
                    <i class="fas fa-hospital mr-2"></i>
                    Gestor de Expedientes
                </h1>
                <div id="user-info" class="flex items-center">
                    <span class="mr-2 font-medium">Dr. Ejemplo</span>
                    <i class="fas fa-user-circle text-xl text-gray-600"></i>
                </div>
            </div>
        `;
        elements.appContainer.prepend(header);
    };

    // Render navigation sidebar
    const renderNavigation = () => {
        const nav = document.createElement('aside');
        nav.className = 'w-64 bg-white shadow-sm p-4 hidden md:block';
        nav.innerHTML = `
            <nav>
                <ul class="space-y-2">
                    <li>
                        <button data-view="dashboard" class="w-full text-left px-4 py-2 rounded hover:bg-blue-50 flex items-center ${currentView === 'dashboard' ? 'bg-blue-50 text-blue-600' : ''}">
                            <i class="fas fa-tachometer-alt mr-3"></i>
                            Dashboard
                        </button>
                    </li>
                    <li>
                        <button data-view="patients" class="w-full text-left px-4 py-2 rounded hover:bg-blue-50 flex items-center ${currentView === 'patients' ? 'bg-blue-50 text-blue-600' : ''}">
                            <i class="fas fa-user-injured mr-3"></i>
                            Pacientes
                        </button>
                    </li>
                    <li>
                        <button data-view="consultations" class="w-full text-left px-4 py-2 rounded hover:bg-blue-50 flex items-center ${currentView === 'consultations' ? 'bg-blue-50 text-blue-600' : ''}">
                            <i class="fas fa-notes-medical mr-3"></i>
                            Consultas
                        </button>
                    </li>
                </ul>
            </nav>
        `;
        elements.appContainer.insertBefore(nav, elements.appContainer.firstChild.nextSibling);
    };

    // Load view based on current state
    const loadView = (view) => {
        currentView = view;
        // TODO: Implement view loading logic
        elements.contentArea.innerHTML = `
            <div class="bg-white rounded-lg shadow p-6">
                <h2 class="text-xl font-semibold mb-4">${view.charAt(0).toUpperCase() + view.slice(1)}</h2>
                <p>Esta vista estará disponible pronto.</p>
            </div>
        `;
    };

    // Set up event listeners
    const setupEventListeners = () => {
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-view]') || e.target.closest('[data-view]')) {
                const view = e.target.dataset.view || e.target.closest('[data-view]').dataset.view;
                loadView(view);
            }
        });
    };

    // Public API
    return {
        init
    };
})();

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', MedicalRecordApp.init);
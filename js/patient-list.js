document.addEventListener('DOMContentLoaded', () => {
    const patientTableBody = document.getElementById('patientTableBody');
    const searchInput = document.getElementById('searchInput');
    const filterGender = document.getElementById('filterGender');
    
    // Load and display patients
    loadPatients();
    
    // Set up event listeners
    searchInput.addEventListener('input', debounce(loadPatients, 300));
    filterGender.addEventListener('change', loadPatients);
    
    // Load patients from storage
    function loadPatients() {
        const searchTerm = searchInput.value.toLowerCase();
        const genderFilter = filterGender.value;
        
        // Get patients from localStorage (simulated data if empty)
        let patients = JSON.parse(localStorage.getItem('patients') || '[]');
        
        // If no patients, create sample data for demo
        if (patients.length === 0) {
            patients = generateSamplePatients();
            localStorage.setItem('patients', JSON.stringify(patients));
        }
        
        // Filter patients
        const filteredPatients = patients.filter(patient => {
            const matchesSearch = 
                patient.firstName.toLowerCase().includes(searchTerm) ||
                patient.lastName.toLowerCase().includes(searchTerm) ||
                patient.phone.includes(searchTerm);
            
            const matchesGender = 
                !genderFilter || patient.gender === genderFilter;
            
            return matchesSearch && matchesGender;
        });
        
        // Display patients
        renderPatients(filteredPatients);
    }
    
    // Render patients to the table
    function renderPatients(patients) {
        patientTableBody.innerHTML = '';
        
        if (patients.length === 0) {
            patientTableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                        No se encontraron pacientes
                    </td>
                </tr>
            `;
            return;
        }
        
        patients.forEach(patient => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50 patient-card';
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <i class="fas fa-user text-blue-600"></i>
                        </div>
                        <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">
                                ${patient.firstName} ${patient.lastName}
                            </div>
                            <div class="text-sm text-gray-500">
                                ${patient.email || 'Sin correo'}
                            </div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">
                        ${calculateAge(patient.birthDate)} años
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${patient.gender === 'male' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'}">
                        ${patient.gender === 'male' ? 'Masculino' : 'Femenino'}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${formatPhoneNumber(patient.phone)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${patient.lastConsultation || 'Nunca'}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a href="../patient-form.html?id=${patient.id}" class="text-blue-600 hover:text-blue-900 mr-3">
                        <i class="fas fa-edit"></i>
                    </a>
                    <a href="#" class="text-red-600 hover:text-red-900" onclick="deletePatient(${patient.id}, event)">
                        <i class="fas fa-trash"></i>
                    </a>
                </td>
            `;
            patientTableBody.appendChild(row);
        });
    }
    
    // Helper function to calculate age from birth date
    function calculateAge(birthDate) {
        const birth = new Date(birthDate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age;
    }
    
    // Helper function to format phone number
    function formatPhoneNumber(phone) {
        return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    }
    
    // Debounce function for search input
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }
    
    // Generate sample patients for demo
    function generateSamplePatients() {
        return [
            {
                id: 1,
                firstName: 'Juan',
                lastName: 'Pérez',
                birthDate: '1985-05-15',
                gender: 'male',
                phone: '5551234567',
                email: 'juan.perez@example.com',
                address: 'Calle Falsa 123',
                allergies: 'Penicilina',
                medicalHistory: 'Hipertensión',
                currentMedications: 'Losartan 50mg',
                lastConsultation: '2023-10-15',
                createdAt: '2023-01-10T10:30:00Z'
            },
            {
                id: 2,
                firstName: 'María',
                lastName: 'González',
                birthDate: '1990-08-22',
                gender: 'female',
                phone: '5559876543',
                email: 'maria.gonzalez@example.com',
                address: 'Avenida Siempreviva 456',
                allergies: 'Ninguna',
                medicalHistory: 'Asma',
                currentMedications: 'Salbutamol inhalador',
                lastConsultation: '2023-11-02',
                createdAt: '2023-02-15T14:45:00Z'
            }
        ];
    }
});

// Delete patient function (needs to be global for onclick)
function deletePatient(patientId, event) {
    event.preventDefault();
    
    if (confirm('¿Está seguro que desea eliminar este paciente?')) {
        const patients = JSON.parse(localStorage.getItem('patients') || '[]');
        const updatedPatients = patients.filter(p => p.id !== patientId);
        localStorage.setItem('patients', JSON.stringify(updatedPatients));
        
        // Reload the patient list
        document.dispatchEvent(new Event('DOMContentLoaded'));
    }
}
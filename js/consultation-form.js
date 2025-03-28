document.addEventListener('DOMContentLoaded', () => {
    const consultationForm = document.getElementById('consultationForm');
    const patientSelect = document.getElementById('patientSelect');
    const patientInfo = document.getElementById('patientInfo');
    const prescriptionsContainer = document.getElementById('prescriptionsContainer');
    const addPrescriptionBtn = document.getElementById('addPrescriptionBtn');
    const followupRequired = document.getElementById('followupRequired');
    const followupDateContainer = document.getElementById('followupDateContainer');
    let prescriptionCount = 1;

    // Initialize form
    loadPatients();
    setupEventListeners();

    // Load patients into select dropdown
    function loadPatients() {
        const patients = JSON.parse(localStorage.getItem('patients') || '[]');
        
        patients.forEach(patient => {
            const option = document.createElement('option');
            option.value = patient.id;
            option.textContent = `${patient.firstName} ${patient.lastName}`;
            patientSelect.appendChild(option);
        });
    }

    // Set up event listeners
    function setupEventListeners() {
        // Patient selection change
        patientSelect.addEventListener('change', (e) => {
            if (e.target.value) {
                loadPatientInfo(e.target.value);
                patientInfo.classList.remove('hidden');
            } else {
                patientInfo.classList.add('hidden');
            }
        });

        // Follow-up toggle
        followupRequired.addEventListener('change', (e) => {
            followupDateContainer.classList.toggle('hidden', e.target.value !== 'yes');
        });

        // Add prescription button
        addPrescriptionBtn.addEventListener('click', addPrescriptionField);

        // Form submission
        consultationForm.addEventListener('submit', handleFormSubmit);
    }

    // Load patient information
    function loadPatientInfo(patientId) {
        const patients = JSON.parse(localStorage.getItem('patients') || '[]');
        const patient = patients.find(p => p.id == patientId);

        if (patient) {
            document.getElementById('patientName').textContent = `${patient.firstName} ${patient.lastName}`;
            document.getElementById('patientAge').textContent = `${calculateAge(patient.birthDate)} años`;
            document.getElementById('patientGender').textContent = patient.gender === 'male' ? 'Masculino' : 'Femenino';
            document.getElementById('patientHistory').textContent = patient.medicalHistory || 'No registrado';
        }
    }

    // Add new prescription field
    function addPrescriptionField() {
        prescriptionCount++;
        const newPrescription = document.createElement('div');
        newPrescription.className = 'prescription-item mb-4 p-4 border rounded-md';
        newPrescription.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <label for="medication${prescriptionCount}">Medicamento</label>
                    <input type="text" id="medication${prescriptionCount}" name="medications[${prescriptionCount-1}].name" required>
                </div>
                <div>
                    <label for="dosage${prescriptionCount}">Dosis</label>
                    <input type="text" id="dosage${prescriptionCount}" name="medications[${prescriptionCount-1}].dosage" required>
                </div>
                <div>
                    <label for="frequency${prescriptionCount}">Frecuencia</label>
                    <input type="text" id="frequency${prescriptionCount}" name="medications[${prescriptionCount-1}].frequency" required>
                </div>
                <div>
                    <label for="duration${prescriptionCount}">Duración</label>
                    <input type="text" id="duration${prescriptionCount}" name="medications[${prescriptionCount-1}].duration" required>
                </div>
            </div>
            <button type="button" class="mt-2 px-2 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200 text-sm remove-prescription">
                <i class="fas fa-times mr-1"></i> Eliminar
            </button>
        `;
        prescriptionsContainer.appendChild(newPrescription);

        // Add event listener to remove button
        newPrescription.querySelector('.remove-prescription').addEventListener('click', () => {
            prescriptionsContainer.removeChild(newPrescription);
        });
    }

    // Handle form submission
    function handleFormSubmit(e) {
        e.preventDefault();
        
        // Validate required fields
        if (!patientSelect.value) {
            showAlert('Por favor seleccione un paciente', 'error');
            return;
        }

        // Get form data
        const formData = new FormData(consultationForm);
        const consultationData = {
            patientId: formData.get('patientId'),
            consultationDate: formData.get('consultationDate'),
            consultationType: formData.get('consultationType'),
            reason: formData.get('reason'),
            symptoms: formData.get('symptoms'),
            diagnosis: formData.get('diagnosis'),
            treatment: formData.get('treatment'),
            followupRequired: formData.get('followupRequired'),
            followupDate: formData.get('followupDate'),
            followupNotes: formData.get('followupNotes'),
            medications: []
        };

        // Get medications data
        const medicationNames = consultationForm.querySelectorAll('[name^="medications["][name$="].name"]');
        medicationNames.forEach((med, index) => {
            const baseName = med.name.replace('.name', '');
            consultationData.medications.push({
                name: formData.get(`${baseName}.name`),
                dosage: formData.get(`${baseName}.dosage`),
                frequency: formData.get(`${baseName}.frequency`),
                duration: formData.get(`${baseName}.duration`)
            });
        });

        // Save consultation
        saveConsultation(consultationData)
            .then(() => {
                showAlert('Consulta registrada exitosamente', 'success');
                consultationForm.reset();
                patientInfo.classList.add('hidden');
                prescriptionsContainer.innerHTML = '';
                addPrescriptionField(); // Add first prescription field back
            })
            .catch(error => {
                console.error('Error saving consultation:', error);
                showAlert('Error al guardar la consulta', 'error');
            });
    }

    // Save consultation data
    function saveConsultation(consultationData) {
        return new Promise((resolve) => {
            // Simulate API call delay
            setTimeout(() => {
                // In a real app, this would be an API call
                console.log('Consultation data to save:', consultationData);
                
                // Store in localStorage for demo purposes
                const consultations = JSON.parse(localStorage.getItem('consultations') || '[]');
                consultations.push({
                    id: Date.now(),
                    ...consultationData,
                    createdAt: new Date().toISOString()
                });
                localStorage.setItem('consultations', JSON.stringify(consultations));
                
                // Update patient's last consultation date
                const patients = JSON.parse(localStorage.getItem('patients') || '[]');
                const patientIndex = patients.findIndex(p => p.id == consultationData.patientId);
                if (patientIndex !== -1) {
                    patients[patientIndex].lastConsultation = new Date(consultationData.consultationDate).toLocaleDateString();
                    localStorage.setItem('patients', JSON.stringify(patients));
                }
                
                resolve();
            }, 1000);
        });
    }

    // Helper function to calculate age
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

    // Show alert message
    function showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} mb-4`;
        alertDiv.textContent = message;
        
        const firstChild = consultationForm.firstChild;
        consultationForm.insertBefore(alertDiv, firstChild);
        
        // Remove alert after 5 seconds
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }

    // Add first prescription field
    addPrescriptionField();
});
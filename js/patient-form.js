document.addEventListener('DOMContentLoaded', () => {
    const patientForm = document.getElementById('patientForm');
    const cancelBtn = patientForm.querySelector('button[type="button"]');

    // Handle form submission
    patientForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(patientForm);
        const patientData = Object.fromEntries(formData.entries());
        
        // Validate required fields
        if (!patientData.firstName || !patientData.lastName || !patientData.birthDate || !patientData.gender || !patientData.phone) {
            showAlert('Por favor complete todos los campos requeridos', 'error');
            return;
        }

        // Process and save patient data
        savePatient(patientData)
            .then(() => {
                showAlert('Paciente registrado exitosamente', 'success');
                patientForm.reset();
            })
            .catch(error => {
                console.error('Error saving patient:', error);
                showAlert('Error al guardar el paciente', 'error');
            });
    });

    // Handle cancel button
    cancelBtn.addEventListener('click', () => {
        if (confirm('¿Está seguro que desea cancelar? Los datos no guardados se perderán.')) {
            window.location.href = '../index.html';
        }
    });

    // Save patient data (simulated - would connect to backend in real app)
    function savePatient(patientData) {
        return new Promise((resolve) => {
            // Simulate API call delay
            setTimeout(() => {
                // In a real app, this would be an API call
                console.log('Patient data to save:', patientData);
                
                // Store in localStorage for demo purposes
                const patients = JSON.parse(localStorage.getItem('patients') || '[]');
                patients.push({
                    id: Date.now(),
                    ...patientData,
                    createdAt: new Date().toISOString()
                });
                localStorage.setItem('patients', JSON.stringify(patients));
                
                resolve();
            }, 1000);
        });
    }

    // Show alert message
    function showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} mb-4`;
        alertDiv.textContent = message;
        
        const firstChild = patientForm.firstChild;
        patientForm.insertBefore(alertDiv, firstChild);
        
        // Remove alert after 5 seconds
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }
});
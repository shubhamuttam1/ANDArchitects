/**
 * AND Architects - Booking System JavaScript
 * Handles appointment booking flow, calendar integration, and form processing
 */

// ===== BOOKING SYSTEM VARIABLES =====
let currentStep = 1;
let selectedService = null;
let selectedDate = null;
let selectedTime = null;
let calendar = null;
let availableTimeSlots = [];
let bookedSlots = new Set(); // Simulate booked appointments

// Booking data storage
let bookingData = {
    service: null,
    date: null,
    time: null,
    duration: null,
    price: null,
    customer: {}
};

// Business hours configuration
const businessHours = {
    monday: { start: '09:00', end: '17:00', break: ['12:00', '13:00'] },
    tuesday: { start: '09:00', end: '17:00', break: ['12:00', '13:00'] },
    wednesday: { start: '09:00', end: '17:00', break: ['12:00', '13:00'] },
    thursday: { start: '09:00', end: '17:00', break: ['12:00', '13:00'] },
    friday: { start: '09:00', end: '17:00', break: ['12:00', '13:00'] },
    saturday: { start: '10:00', end: '16:00', break: [] },
    sunday: { closed: true }
};

// Service configurations
const serviceConfigs = {
    architecture: { name: 'Architecture Consultation', duration: 90, price: 200 },
    interior: { name: 'Interior Design Consultation', duration: 60, price: 200 },
    plotting: { name: 'Plot Planning Consultation', duration: 60, price: 200 },
    general: { name: 'General Consultation', duration: 45, price: 200 }
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.booking-section')) {
        initializeBookingSystem();
    }
});

function initializeBookingSystem() {
    initializeServiceSelection();
    initializeStepNavigation();
    initializeCalendar();
    initializeBookingForm();
    initializeConfirmation();
    
    console.log('Booking system initialized successfully');
}

// ===== STEP 1: SERVICE SELECTION =====
function initializeServiceSelection() {
    const serviceOptions = document.querySelectorAll('.service-option');
    const nextStep1Button = document.getElementById('nextStep1');
    
    serviceOptions.forEach(option => {
        option.addEventListener('click', function() {
            selectService(this);
        });
    });
    
    if (nextStep1Button) {
        nextStep1Button.addEventListener('click', function() {
            if (selectedService) {
                showStep(2);
                updateSelectedServiceInfo();
            }
        });
    }
}

function selectService(serviceElement) {
    // Remove previous selection
    document.querySelectorAll('.service-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Add selection to clicked service
    serviceElement.classList.add('selected');
    
    // Store service data
    selectedService = serviceElement.dataset.service;
    const config = serviceConfigs[selectedService];
    
    bookingData.service = selectedService;
    bookingData.duration = config.duration;
    bookingData.price = config.price;
    bookingData.serviceName = config.name;
    
    // Enable next button
    const nextStep1Button = document.getElementById('nextStep1');
    if (nextStep1Button) {
        nextStep1Button.disabled = false;
    }
    
    // Add visual feedback
    serviceElement.style.transform = 'scale(1.02)';
    setTimeout(() => {
        serviceElement.style.transform = '';
    }, 150);
}

// ===== STEP 2: DATE & TIME SELECTION =====
function initializeCalendar() {
    const calendarElement = document.getElementById('calendar');
    if (!calendarElement) return;
    
    // Initialize FullCalendar
    calendar = new FullCalendar.Calendar(calendarElement, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth'
        },
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        weekends: true,
        validRange: {
            start: new Date().toISOString().split('T')[0] // Disable past dates
        },
        selectConstraint: {
            daysOfWeek: [1, 2, 3, 4, 5, 6] // Monday to Saturday
        },
        businessHours: [
            {
                daysOfWeek: [1, 2, 3, 4, 5], // Monday - Friday
                startTime: '09:00',
                endTime: '17:00'
            },
            {
                daysOfWeek: [6], // Saturday
                startTime: '10:00',
                endTime: '16:00'
            }
        ],
        select: function(info) {
            selectDate(info.startStr);
        },
        dayCellClassNames: function(info) {
            const day = info.date.getDay();
            if (day === 0) { // Sunday
                return ['fc-disabled-day'];
            }
            return [];
        },
        dayCellDidMount: function(info) {
            const day = info.date.getDay();
            if (day === 0) { // Sunday
                info.el.style.backgroundColor = '#f5f5f5';
                info.el.style.color = '#ccc';
                info.el.style.pointerEvents = 'none';
            }
        }
    });
    
    calendar.render();
    
    // Simulate some booked slots
    simulateBookedSlots();
}

function selectDate(dateStr) {
    selectedDate = dateStr;
    bookingData.date = dateStr;
    
    // Update UI
    updateSelectedDateDisplay(dateStr);
    
    // Generate time slots for selected date
    generateTimeSlots(dateStr);
    
    // Clear previous calendar selections
    calendar.unselect();
    
    // Highlight selected date
    highlightSelectedDate(dateStr);
}

function updateSelectedDateDisplay(dateStr) {
    const selectedDateDisplay = document.getElementById('selectedDateDisplay');
    if (selectedDateDisplay) {
        const date = new Date(dateStr);
        const formattedDate = date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        selectedDateDisplay.textContent = formattedDate;
    }
}

function updateSelectedServiceInfo() {
    const selectedServiceName = document.getElementById('selectedServiceName');
    const selectedServiceDuration = document.getElementById('selectedServiceDuration');
    
    if (selectedServiceName && selectedServiceDuration && selectedService) {
        const config = serviceConfigs[selectedService];
        selectedServiceName.textContent = config.name;
        selectedServiceDuration.textContent = config.duration;
    }
}

function highlightSelectedDate(dateStr) {
    // Remove previous highlights
    document.querySelectorAll('.fc-daygrid-day.selected-date').forEach(el => {
        el.classList.remove('selected-date');
    });
    
    // Add highlight to selected date
    const dateElements = calendar.el.querySelectorAll(`[data-date="${dateStr}"]`);
    dateElements.forEach(el => {
        el.classList.add('selected-date');
    });
}

function generateTimeSlots(dateStr) {
    const timeSlotsContainer = document.getElementById('timeSlots');
    if (!timeSlotsContainer) return;
    
    const date = new Date(dateStr);
    const dayOfWeek = getDayOfWeek(date.getDay());
    const businessHour = businessHours[dayOfWeek];
    
    if (businessHour.closed) {
        timeSlotsContainer.innerHTML = '<p class="no-slots">Office is closed on Sundays</p>';
        return;
    }
    
    const slots = calculateAvailableSlots(dateStr, businessHour);
    
    if (slots.length === 0) {
        timeSlotsContainer.innerHTML = '<p class="no-slots">No available slots for this date</p>';
        return;
    }
    
    // Generate time slot elements
    timeSlotsContainer.innerHTML = '';
    slots.forEach(slot => {
        const slotElement = createTimeSlotElement(slot);
        timeSlotsContainer.appendChild(slotElement);
    });
}

function calculateAvailableSlots(dateStr, businessHour) {
    const slots = [];
    const duration = bookingData.duration;
    const slotInterval = 30; // 30-minute intervals
    
    // Convert business hours to minutes
    const startMinutes = timeToMinutes(businessHour.start);
    const endMinutes = timeToMinutes(businessHour.end);
    
    // Generate slots
    for (let minutes = startMinutes; minutes + duration <= endMinutes; minutes += slotInterval) {
        const timeStr = minutesToTime(minutes);
        const endTimeStr = minutesToTime(minutes + duration);
        
        // Skip break times
        if (businessHour.break && isInBreakTime(timeStr, endTimeStr, businessHour.break)) {
            continue;
        }
        
        // Check if slot is available
        const slotKey = `${dateStr}-${timeStr}`;
        if (!bookedSlots.has(slotKey)) {
            slots.push({
                time: timeStr,
                endTime: endTimeStr,
                available: true
            });
        }
    }
    
    return slots;
}

function createTimeSlotElement(slot) {
    const slotElement = document.createElement('div');
    slotElement.className = 'time-slot';
    slotElement.textContent = slot.time;
    slotElement.dataset.time = slot.time;
    
    if (!slot.available) {
        slotElement.classList.add('unavailable');
    } else {
        slotElement.addEventListener('click', function() {
            selectTimeSlot(this);
        });
    }
    
    return slotElement;
}

function selectTimeSlot(slotElement) {
    // Remove previous selection
    document.querySelectorAll('.time-slot.selected').forEach(slot => {
        slot.classList.remove('selected');
    });
    
    // Select clicked slot
    slotElement.classList.add('selected');
    selectedTime = slotElement.dataset.time;
    bookingData.time = selectedTime;
    
    // Enable next button
    const nextStep2Button = document.getElementById('nextStep2');
    if (nextStep2Button) {
        nextStep2Button.disabled = false;
    }
}

// ===== STEP 3: CUSTOMER INFORMATION =====
function initializeBookingForm() {
    const bookingForm = document.getElementById('bookingForm');
    const nextStep3Button = document.getElementById('nextStep3');
    
    if (nextStep3Button) {
        nextStep3Button.addEventListener('click', function() {
            if (validateBookingForm()) {
                collectCustomerData();
                showStep(4);
                displayBookingSummary();
            }
        });
    }
}

function validateBookingForm() {
    const form = document.getElementById('bookingForm');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'This field is required');
            isValid = false;
        } else {
            clearFieldError(field);
            
            // Additional validation
            if (field.type === 'email' && !isValidEmail(field.value)) {
                showFieldError(field, 'Please enter a valid email address');
                isValid = false;
            }
            
            if (field.type === 'tel' && !isValidPhone(field.value)) {
                showFieldError(field, 'Please enter a valid phone number');
                isValid = false;
            }
        }
    });
    
    return isValid;
}

function collectCustomerData() {
    const form = document.getElementById('bookingForm');
    const formData = new FormData(form);
    
    bookingData.customer = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        company: formData.get('company'),
        projectType: formData.get('projectType'),
        budget: formData.get('budget'),
        timeline: formData.get('timeline'),
        projectDetails: formData.get('projectDetails'),
        specialRequests: formData.get('specialRequests'),
        newsletter: formData.get('newsletter') === 'on'
    };
}

// ===== STEP 4: BOOKING SUMMARY & CONFIRMATION =====
function initializeConfirmation() {
    const confirmButton = document.getElementById('confirmBooking');
    
    if (confirmButton) {
        confirmButton.addEventListener('click', function() {
            confirmBooking();
        });
    }
}

function displayBookingSummary() {
    // Service details
    document.getElementById('summaryService').textContent = bookingData.serviceName;
    document.getElementById('summaryDuration').textContent = `${bookingData.duration} minutes`;
    document.getElementById('summaryPrice').textContent = `₹${bookingData.price}`;
    
    // Appointment details
    const date = new Date(bookingData.date);
    document.getElementById('summaryDate').textContent = date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('summaryTime').textContent = formatTime12Hour(bookingData.time);
    
    // Customer details
    document.getElementById('summaryName').textContent = 
        `${bookingData.customer.firstName} ${bookingData.customer.lastName}`;
    document.getElementById('summaryEmail').textContent = bookingData.customer.email;
    document.getElementById('summaryPhone').textContent = bookingData.customer.phone;
}

async function confirmBooking() {
    const confirmButton = document.getElementById('confirmBooking');
    const originalText = confirmButton.innerHTML;
    
    // Show loading state
    confirmButton.disabled = true;
    confirmButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Confirming...';
    
    try {
        // Simulate API call to book appointment
        await submitBooking();
        
        // Mark slot as booked
        const slotKey = `${bookingData.date}-${bookingData.time}`;
        bookedSlots.add(slotKey);
        
        // Show success step
        showStep('success');
        displaySuccessDetails();
        
        // Send confirmation email (simulation)
        await sendConfirmationEmail();
        
    } catch (error) {
        console.error('Booking confirmation error:', error);
        showNotification('Sorry, there was an error confirming your booking. Please try again.', 'error');
        
        // Reset button
        confirmButton.disabled = false;
        confirmButton.innerHTML = originalText;
    }
}

async function submitBooking() {
    try {
        // Submit to both Google Forms and WhatsApp
        await Promise.all([
            submitToGoogleForms(),
            sendWhatsAppNotification()
        ]);
        
        return Promise.resolve();
    } catch (error) {
        console.error('Booking submission failed:', error);
        return Promise.reject(new Error('Booking submission failed. Please try again or contact us directly.'));
    }
}

async function submitToGoogleForms() {
    // Google Forms submission
    // You'll need to replace this URL with your actual Google Form action URL
    const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1DK9w2WDLfMKQwR54z98iiGKvrv0obeQosbYkNrP9cgI/formResponse';
    
    const formData = new FormData();
    
    // Map booking data to Google Form fields
    // Entry IDs extracted from your Google Form source code
    formData.append('entry.2005620554', bookingData.serviceName); // Service Type
    formData.append('entry.1045781291', formatDate(bookingData.date)); // Appointment Date  
    formData.append('entry.1065046570', formatTime12Hour(bookingData.time)); // Appointment Time
    formData.append('entry.1166974658', `${bookingData.duration} minutes`); // Duration
    formData.append('entry.839337160', `₹${bookingData.price}`); // Consultation Fee
    formData.append('entry.523327575', `${bookingData.customer.firstName} ${bookingData.customer.lastName}`); // Client Name
    formData.append('entry.1996042048', bookingData.customer.email); // Client Email
    formData.append('entry.45019109', bookingData.customer.phone); // Client Phone
    formData.append('entry.1444915736', bookingData.customer.projectType || 'Not specified'); // Project Type
    formData.append('entry.1330418491', bookingData.customer.budget || 'Not specified'); // Budget Range
    formData.append('entry.1168732581', bookingData.customer.timeline || 'Not specified'); // Timeline  
    formData.append('entry.1552771188', bookingData.customer.message || 'No additional message'); // Message
    formData.append('entry.419421918', new Date().toISOString()); // Booking Timestamp
    
    // Submit to Google Forms
    return fetch(GOOGLE_FORM_URL, {
        method: 'POST',
        body: formData,
        mode: 'no-cors' // Required for Google Forms
    });
}

async function sendWhatsAppNotification() {
    // Format booking details for WhatsApp message
    const date = new Date(bookingData.date);
    const whatsappMessage = formatWhatsAppMessage();
    
    // Your WhatsApp Business number
    const whatsappNumber = '919913448866'; // +91 99 13 44 88 66
    
    // Create WhatsApp URL
    const whatsappURL = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(whatsappMessage)}`;
    
    // Open WhatsApp (this will work on mobile devices and WhatsApp Web)
    window.open(whatsappURL, '_blank');
    
    return Promise.resolve();
}

function formatWhatsAppMessage() {
    const date = new Date(bookingData.date);
    const formattedDate = date.toLocaleDateString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    
    return `🏗️ *NEW APPOINTMENT BOOKING*

📅 *Service:* ${bookingData.serviceName}
📅 *Date:* ${formattedDate}
🕐 *Time:* ${formatTime12Hour(bookingData.time)}
⏱️ *Duration:* ${bookingData.duration} minutes
💰 *Consultation Fee:* ₹${bookingData.price}

👤 *Client Details:*
*Name:* ${bookingData.customer.firstName} ${bookingData.customer.lastName}
📞 *Phone:* ${bookingData.customer.phone}
📧 *Email:* ${bookingData.customer.email}

🏡 *Project Details:*
*Type:* ${bookingData.customer.projectType || 'Not specified'}
*Budget:* ${bookingData.customer.budget || 'Not specified'}  
*Timeline:* ${bookingData.customer.timeline || 'Not specified'}

💬 *Message:* ${bookingData.customer.message || 'No additional message'}

⏰ *Booked at:* ${new Date().toLocaleString('en-IN')}

_Please confirm this appointment with the client._`;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function displaySuccessDetails() {
    const date = new Date(bookingData.date);
    document.getElementById('successDate').textContent = date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
    document.getElementById('successTime').textContent = formatTime12Hour(bookingData.time);
}

async function sendConfirmationEmail() {
    // Simulate sending confirmation email
    return new Promise(resolve => {
        setTimeout(resolve, 1000);
    });
}

// ===== STEP NAVIGATION =====
function initializeStepNavigation() {
    // Next step buttons
    document.getElementById('nextStep2')?.addEventListener('click', () => {
        if (selectedDate && selectedTime) {
            showStep(3);
        } else {
            showNotification('Please select a date and time.', 'warning');
        }
    });
    
    // Back step buttons
    document.getElementById('backStep2')?.addEventListener('click', () => showStep(1));
    document.getElementById('backStep2Btn')?.addEventListener('click', () => showStep(1));
    document.getElementById('backStep3')?.addEventListener('click', () => showStep(2));
    document.getElementById('backStep3Btn')?.addEventListener('click', () => showStep(2));
    document.getElementById('backStep4')?.addEventListener('click', () => showStep(3));
    document.getElementById('backStep4Btn')?.addEventListener('click', () => showStep(3));
}

function showStep(stepNumber) {
    // Hide all steps
    document.querySelectorAll('.booking-step').forEach(step => {
        step.style.display = 'none';
    });
    
    // Show target step
    const targetStep = stepNumber === 'success' ? 
        document.getElementById('successStep') : 
        document.getElementById(`step${stepNumber}`);
        
    if (targetStep) {
        targetStep.style.display = 'block';
        
        // Scroll to top of booking container
        const bookingContainer = document.querySelector('.booking-container');
        if (bookingContainer) {
            bookingContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
        // Update current step
        currentStep = stepNumber;
        
        // Initialize step-specific functionality
        if (stepNumber === 2 && calendar) {
            setTimeout(() => calendar.render(), 100);
        }
    }
}

// ===== UTILITY FUNCTIONS =====
function timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}

function minutesToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

function formatTime12Hour(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

function getDayOfWeek(dayIndex) {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[dayIndex];
}

function isInBreakTime(startTime, endTime, breakTimes) {
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);
    
    for (let i = 0; i < breakTimes.length; i += 2) {
        const breakStart = timeToMinutes(breakTimes[i]);
        const breakEnd = timeToMinutes(breakTimes[i + 1]);
        
        // Check if appointment overlaps with break time
        if (startMinutes < breakEnd && endMinutes > breakStart) {
            return true;
        }
    }
    return false;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.classList.add('error');
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.color = '#e74c3c';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.marginTop = '0.25rem';
    
    field.parentNode.appendChild(errorElement);
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

function simulateBookedSlots() {
    // Simulate some pre-booked appointments for demonstration
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        // Random chance of having booked slots
        if (Math.random() > 0.7) {
            const randomHour = 9 + Math.floor(Math.random() * 8);
            const randomMinute = Math.random() > 0.5 ? 0 : 30;
            const timeStr = `${randomHour.toString().padStart(2, '0')}:${randomMinute.toString().padStart(2, '0')}`;
            const dateStr = date.toISOString().split('T')[0];
            
            bookedSlots.add(`${dateStr}-${timeStr}`);
        }
    }
}

// ===== NOTIFICATION SYSTEM (if not already included) =====
if (!window.showNotification) {
    window.showNotification = function(message, type = 'info') {
        // Simple notification system for booking page
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'error' ? '#e74c3c' : type === 'warning' ? '#f39c12' : '#27ae60'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10000;
            max-width: 300px;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    };
}

// ===== EXPORT FOR TESTING =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        selectService,
        selectDate,
        selectTimeSlot,
        validateBookingForm,
        calculateAvailableSlots,
        timeToMinutes,
        minutesToTime
    };
}

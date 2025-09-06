# 🔧 How to Update Google Form Entry IDs

## 📋 Current Status
✅ Your form URL is connected: `1DK9w2WDLfMKQwR54z98iiGKvrv0obeQosbYkNrP9cgI`  
⏳ Need to update entry IDs in `assets/js/booking.js`

## 🔍 Get Your Entry IDs

### Step 1: Open Form in View Mode
Go to: https://docs.google.com/forms/d/1DK9w2WDLfMKQwR54z98iiGKvrv0obeQosbYkNrP9cgI/viewform

### Step 2: View Page Source  
- Right-click → "View Page Source"
- Or press `Ctrl+U` (Windows) / `Cmd+Option+U` (Mac)

### Step 3: Find Entry IDs
- Search for `"entry.` (with quotes)
- You'll find entries like: `entry.123456789`
- Map them to your form fields in order

## 🎯 Field Mapping Template

Copy this template and fill in your actual entry IDs:

```javascript
// In assets/js/booking.js, replace lines 480-492 with:

formData.append('entry.YOUR_ID_HERE', bookingData.serviceName); // Service Type
formData.append('entry.YOUR_ID_HERE', formatDate(bookingData.date)); // Appointment Date  
formData.append('entry.YOUR_ID_HERE', formatTime12Hour(bookingData.time)); // Appointment Time
formData.append('entry.YOUR_ID_HERE', `${bookingData.duration} minutes`); // Duration
formData.append('entry.YOUR_ID_HERE', `₹${bookingData.price}`); // Consultation Fee
formData.append('entry.YOUR_ID_HERE', `${bookingData.customer.firstName} ${bookingData.customer.lastName}`); // Client Name
formData.append('entry.YOUR_ID_HERE', bookingData.customer.email); // Client Email
formData.append('entry.YOUR_ID_HERE', bookingData.customer.phone); // Client Phone
formData.append('entry.YOUR_ID_HERE', bookingData.customer.projectType || 'Not specified'); // Project Type
formData.append('entry.YOUR_ID_HERE', bookingData.customer.budget || 'Not specified'); // Budget Range
formData.append('entry.YOUR_ID_HERE', bookingData.customer.timeline || 'Not specified'); // Timeline  
formData.append('entry.YOUR_ID_HERE', bookingData.customer.message || 'No additional message'); // Message
formData.append('entry.YOUR_ID_HERE', new Date().toISOString()); // Booking Timestamp
```

## 📝 Form Field Order (from your form)
Based on your Google Form, the fields appear in this order:

1. **Email** (automatically collected)
2. **Service Type** ← entry.??? 
3. **Appointment Date** ← entry.???
4. **Appointment Time** ← entry.???
5. **Duration** ← entry.???
6. **Consultation Fee** ← entry.???
7. **Client Name** ← entry.???
8. **Client Email** ← entry.???
9. **Client Phone** ← entry.???
10. **Project Type** ← entry.???
11. **Budget Range** ← entry.???
12. **Timeline** ← entry.???
13. **Message** ← entry.???
14. **Booking Timestamp** ← entry.???

## 🧪 Testing After Update

1. **Make a test booking** on your website
2. **Check your email** (uttam.shubham123@gmail.com)
3. **Check Google Sheets** responses
4. **Verify all fields** populate correctly

## 🆘 Need Help?

If you find the entry IDs, just share them with me and I'll update the booking.js file for you!

**Example**: "entry.123456789 is for Service Type, entry.987654321 is for Date..."

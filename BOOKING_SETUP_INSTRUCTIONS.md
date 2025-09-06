# 📋 Booking Notifications Setup Instructions

## 🎯 What You'll Get
Your booking system now supports **dual notifications**:
- ✅ **Google Forms**: Automatic email notifications + organized data in Google Sheets
- ✅ **WhatsApp**: Instant mobile notifications to your business number (+91 99 13 44 88 66)

---

## 🔧 Setup Required (15 minutes)

### **Step 1: Create Google Form**

1. **Go to Google Forms**: https://forms.google.com
2. **Click "Create a new form"** or use this template: "Contact Information"
3. **Set Form Title**: "AND Architects - Booking Notifications"
4. **Add these questions** (make them all "Short answer" type):

```
Question 1: Service Type
Question 2: Appointment Date  
Question 3: Appointment Time
Question 4: Duration
Question 5: Consultation Fee
Question 6: Client Name
Question 7: Client Email
Question 8: Client Phone
Question 9: Project Type
Question 10: Budget Range
Question 11: Timeline
Question 12: Message
Question 13: Booking Timestamp
```

### **Step 2: Configure Form Settings**

1. **Click Settings** (⚙️ icon)
2. **Under "Responses"**:
   - ✅ Check "Collect email addresses"
   - ✅ Check "Send me email notifications of new responses"
3. **Set your email**: contact.andarchitects@gmail.com
4. **Under "Presentation"**: 
   - ✅ Check "Show link to submit another response"

### **Step 3: Get Form Action URL**

1. **Click "Send"** button (top right)
2. **Click the Link tab** (🔗)
3. **Copy the form URL** (it looks like: `https://docs.google.com/forms/d/e/FORM_ID/viewform`)
4. **Convert to submission URL**: Replace `/viewform` with `/formResponse`
   - Example: `https://docs.google.com/forms/d/e/1FAIpQLSe.../formResponse`

### **Step 4: Get Field Entry IDs**

1. **Open your form in a new tab**
2. **Right-click** and select "View Page Source"
3. **Search for "entry."** (Ctrl+F)
4. **Find entry IDs** for each field (they look like: `entry.123456789`)

**Map them like this:**
```
SERVICE → entry.XXXXXXXXX
DATE → entry.XXXXXXXXX  
TIME → entry.XXXXXXXXX
DURATION → entry.XXXXXXXXX
PRICE → entry.XXXXXXXXX
CLIENT_NAME → entry.XXXXXXXXX
CLIENT_EMAIL → entry.XXXXXXXXX
CLIENT_PHONE → entry.XXXXXXXXX
PROJECT_TYPE → entry.XXXXXXXXX
BUDGET → entry.XXXXXXXXX
TIMELINE → entry.XXXXXXXXX
MESSAGE → entry.XXXXXXXXX
BOOKING_TIME → entry.XXXXXXXXX
```

### **Step 5: Update Website Code**

1. **Open**: `assets/js/booking.js`
2. **Find line 473**: `const GOOGLE_FORM_URL = 'YOUR_GOOGLE_FORM_URL_HERE';`
3. **Replace with your form URL**: 
   ```javascript
   const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse';
   ```

4. **Update entry field names** (lines 478-490):
   ```javascript
   formData.append('entry.YOUR_ID_1', bookingData.serviceName);
   formData.append('entry.YOUR_ID_2', formatDate(bookingData.date));
   // ... update all 13 entries with your actual entry IDs
   ```

---

## 🧪 Test Your Setup

### **Test Google Forms Integration**
1. **Make a test booking** on your website
2. **Check your email** (contact.andarchitects@gmail.com) within 5 minutes
3. **Check Google Sheets** for the response data
4. **Verify all fields** are populated correctly

### **Test WhatsApp Integration** 
1. **Make a test booking** 
2. **WhatsApp should automatically open** with a pre-formatted message
3. **The message goes to**: +91 99 13 44 88 66
4. **Verify message format** looks professional

---

## 📱 What Happens When Someone Books

### **For You (Business Owner)**:
1. **📧 Email**: Instant notification to contact.andarchitects@gmail.com
2. **📊 Google Sheets**: Automatic data entry for record keeping  
3. **💬 WhatsApp**: Formatted message opens on client's phone
4. **📋 Organized Data**: All bookings in one spreadsheet

### **For Clients**:
1. **✅ Immediate Confirmation**: Success page with booking details
2. **📧 Email Confirmation**: "We'll contact you within 24 hours"
3. **💬 WhatsApp**: Option to contact you directly via WhatsApp
4. **📞 Phone Follow-up**: Expectation of phone confirmation

---

## 📊 Sample Email You'll Receive

```
Subject: New Booking - AND Architects

Service: Architecture Consultation
Date: Monday, 09 September 2025  
Time: 2:00 PM
Duration: 90 minutes
Fee: ₹200

Client: John Doe
Phone: +91 98765 43210
Email: john@example.com

Project: Residential House
Budget: ₹10,00,000 - ₹25,00,000
Timeline: 3-6 months

Message: Need consultation for 3BHK house design
```

---

## 📱 Sample WhatsApp Message

```
🏗️ *NEW APPOINTMENT BOOKING*

📅 *Service:* Architecture Consultation
📅 *Date:* Monday, 09 September 2025
🕐 *Time:* 2:00 PM  
⏱️ *Duration:* 90 minutes
💰 *Consultation Fee:* ₹200

👤 *Client Details:*
*Name:* John Doe
📞 *Phone:* +91 98765 43210
📧 *Email:* john@example.com

🏡 *Project Details:*
*Type:* Residential House
*Budget:* ₹10,00,000 - ₹25,00,000
*Timeline:* 3-6 months

💬 *Message:* Need consultation for 3BHK house design

⏰ *Booked at:* 06/09/2025, 8:30:45 PM

_Please confirm this appointment with the client._
```

---

## 🔧 Troubleshooting

### **Not receiving emails?**
- Check spam/junk folder
- Verify your email in Google Form settings
- Make sure form notifications are enabled

### **WhatsApp not opening?**
- Check if WhatsApp is installed
- Verify phone number format: 919913448866
- Test on mobile device vs desktop

### **Form submissions not working?**
- Verify GOOGLE_FORM_URL is correct
- Check entry field IDs match
- Test form manually first

### **Missing form data?**
- Ensure all 13 entry fields are mapped
- Check for typos in entry IDs
- Verify form accepts responses

---

## 🚀 Go Live Checklist

- [ ] Google Form created with all 13 questions
- [ ] Email notifications enabled  
- [ ] Form URL updated in booking.js
- [ ] All entry IDs mapped correctly
- [ ] WhatsApp number verified (+91 99 13 44 88 66)
- [ ] Test booking completed successfully
- [ ] Email notification received
- [ ] WhatsApp message formatted correctly
- [ ] Google Sheet populated with data

---

## 📞 Need Help?

If you encounter any issues during setup:

1. **Test each component separately**
2. **Check browser console for errors**
3. **Verify all IDs and URLs are correct**
4. **Make sure form is set to accept responses**

**Your booking system is now ready to capture every appointment and notify you instantly via email and WhatsApp!** 🎉

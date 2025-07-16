// Android specific logic for payload generation and UI updates

function updateAndroidPayloadFields(initialType = null, initialValue = '') {
    const payloadTypeSelect = document.getElementById('androidPayloadType');
    const androidPayloadFieldsContainer = document.getElementById('androidPayloadFields');
    const selectedType = initialType || payloadTypeSelect.value;

    let fieldsHtml = '';
    switch (selectedType) {
        case 'adb_command':
            fieldsHtml = `
                <label for="adbCommand">ADB Shell Command:</label>
                <input type="text" id="adbCommand" value="${initialValue}" placeholder="e.g., pm list packages">
                <small>Command to run on the device via 'adb shell'. Requires ADB enabled.</small>
            `;
            break;
        case 'termux_script':
            fieldsHtml = `
                <label for="termuxScript">Termux Script:</label>
                <textarea id="termuxScript" rows="10" placeholder="e.g., pkg install figlet\nfiglet HACKED">${initialValue}</textarea>
                <small>Script to be executed within the Termux app on Android.</small>
            `;
            break;
        case 'social_engineering':
            fieldsHtml = `
                <label for="socialEngText">Social Engineering Message:</label>
                <textarea id="socialEngText" rows="5" placeholder="e.g., Your phone has been compromised! Click here to fix: [LINK]">${initialValue}</textarea>
                <small>Text for a pop-up, notification, or message to trick the user. (This is theoretical, Digispark does not directly display messages on Android without a custom script/app)</small>
            `;
            break;
        default:
            fieldsHtml = '<p>Select a payload type to configure options.</p>';
    }

    androidPayloadFieldsContainer.innerHTML = fieldsHtml;
    
    // Add event listeners to new fields
    const newInputs = androidPayloadFieldsContainer.querySelectorAll('input, textarea');
    newInputs.forEach(input => {
        input.addEventListener('input', generateAndroidCode);
    });
    
    generateAndroidCode();
}

function generateAndroidCode() {
    const payloadType = document.getElementById('androidPayloadType').value;
    let code = '';

    switch (payloadType) {
        case 'adb_command':
            const adbCommand = document.getElementById('adbCommand')?.value || '';
            code = `#!/bin/bash
# Android ADB Command Payload
# Make sure ADB is installed and the device is connected and authorized

# Check if ADB is available
if ! command -v adb &> /dev/null; then
    echo "ADB not found. Please install Android SDK platform-tools."
    exit 1
fi

# Check if device is connected
if ! adb devices | grep -q "device$"; then
    echo "No Android device found or not authorized."
    echo "Make sure USB debugging is enabled and device is authorized."
    exit 1
fi

# Execute the command
echo "Executing: ${adbCommand}"
adb shell "${adbCommand}"
`;
            break;
            
        case 'termux_script':
            const termuxScript = document.getElementById('termuxScript')?.value || '';
            code = `#!/data/data/com.termux/files/usr/bin/bash
# Termux Script Payload
# This script should be executed within the Termux app

# Update package list
pkg update -y

# Script content:
${termuxScript}

echo "Script execution completed."
`;
            break;
            
        case 'social_engineering':
            const socialEngText = document.getElementById('socialEngText')?.value || '';
            code = `# Social Engineering Payload
# This is a theoretical example - actual implementation would require
# custom Android application or specific attack vector

# Message to display:
# "${socialEngText}"

# Note: Digispark cannot directly display messages on Android
# This would require:
# 1. Custom Android application with malicious intent
# 2. Phishing website/app
# 3. SMS/notification spoofing (requires additional tools)
# 4. Physical access with custom interface

echo "Social Engineering Message:"
echo "${socialEngText}"
`;
            break;
            
        default:
            code = '# Select a payload type to generate code';
    }

    document.getElementById('outputCode').value = code;
}

function getAndroidPayloadValue() {
    const payloadType = document.getElementById('androidPayloadType').value;
    
    switch (payloadType) {
        case 'adb_command':
            return document.getElementById('adbCommand')?.value || '';
        case 'termux_script':
            return document.getElementById('termuxScript')?.value || '';
        case 'social_engineering':
            return document.getElementById('socialEngText')?.value || '';
        default:
            return '';
    }
}

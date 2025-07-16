// Android specific logic for payload generation and UI updates

function updateAndroidPayloadFields(initialType = null, initialValue = '') {
    const payloadTypeSelect = document.getElementById('androidPayloadType');
    const androidPayloadFieldsContainer = document.getElementById('androidPayloadFields');
    const selectedType = initialType || payloadTypeSelect.value;

    // Clear container safely
    while (androidPayloadFieldsContainer.firstChild) {
        androidPayloadFieldsContainer.removeChild(androidPayloadFieldsContainer.firstChild);
    }

    let elements;
    switch (selectedType) {
        case 'adb_command':
            elements = createAdbCommandFields(initialValue);
            break;
        case 'termux_script':
            elements = createTermuxScriptFields(initialValue);
            break;
        case 'social_engineering':
            elements = createSocialEngineeringFields(initialValue);
            break;
        default:
            elements = createDefaultFields();
    }

    elements.forEach(element => {
        androidPayloadFieldsContainer.appendChild(element);
    });
    
    // Add event listeners to new fields
    const newInputs = androidPayloadFieldsContainer.querySelectorAll('input, textarea');
    newInputs.forEach(input => {
        input.addEventListener('input', generateAndroidCode);
    });
    
    generateAndroidCode();
}

function createAdbCommandFields(initialValue = '') {
    const label = document.createElement('label');
    label.setAttribute('for', 'adbCommand');
    label.textContent = 'ADB Shell Command:';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'adbCommand';
    input.value = initialValue;
    input.placeholder = 'e.g., pm list packages';
    
    const small = document.createElement('small');
    small.textContent = 'Command to run on the device via \'adb shell\'. Requires ADB enabled.';
    
    return [label, input, small];
}

function createTermuxScriptFields(initialValue = '') {
    const label = document.createElement('label');
    label.setAttribute('for', 'termuxScript');
    label.textContent = 'Termux Script:';
    
    const textarea = document.createElement('textarea');
    textarea.id = 'termuxScript';
    textarea.rows = 10;
    textarea.placeholder = 'e.g., pkg install figlet\nfiglet HACKED';
    textarea.value = initialValue;
    
    const small = document.createElement('small');
    small.textContent = 'Script to be executed within the Termux app on Android.';
    
    return [label, textarea, small];
}

function createSocialEngineeringFields(initialValue = '') {
    const label = document.createElement('label');
    label.setAttribute('for', 'socialEngText');
    label.textContent = 'Social Engineering Message:';
    
    const textarea = document.createElement('textarea');
    textarea.id = 'socialEngText';
    textarea.rows = 5;
    textarea.placeholder = 'e.g., Your phone has been compromised! Click here to fix: [LINK]';
    textarea.value = initialValue;
    
    const small = document.createElement('small');
    small.textContent = 'Text for a pop-up, notification, or message to trick the user. (This is theoretical, Digispark does not directly display messages on Android without a custom script/app)';
    
    return [label, textarea, small];
}

function createDefaultFields() {
    const p = document.createElement('p');
    p.textContent = 'Select a payload type to configure options.';
    return [p];
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

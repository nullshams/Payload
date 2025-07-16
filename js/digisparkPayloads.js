// Digispark specific logic for payload generation and UI updates

let digisparkActionCounter = 0;

// Make counter globally accessible
window.digisparkActionCounter = 0;

// OS Key Map for Digispark
const osDigisparkKeyMap = {
    windows: {
        gui: 'KEY_GUI', enter: 'KEY_ENTER', tab: 'KEY_TAB', esc: 'KEY_ESC', space: 'KEY_SPACE',
        backspace: 'KEY_BACKSPACE', capslock: 'KEY_CAPSLOCK', left_arrow: 'KEY_LEFT_ARROW',
        right_arrow: 'KEY_RIGHT_ARROW', up_arrow: 'KEY_UP_ARROW', down_arrow: 'KEY_DOWN_ARROW',
        delete: 'KEY_DELETE',
        f1: 'KEY_F1', f2: 'KEY_F2', f3: 'KEY_F3', f4: 'KEY_F4', f5: 'KEY_F5',
        f6: 'KEY_F6', f7: 'KEY_F7', f8: 'KEY_F8', f9: 'KEY_F9', f10: 'KEY_F10',
        f11: 'KEY_F11', f12: 'KEY_F12'
    },
    mac: {
        gui: 'KEY_COMMAND', enter: 'KEY_ENTER', tab: 'KEY_TAB', esc: 'KEY_ESC', space: 'KEY_SPACE',
        backspace: 'KEY_BACKSPACE', capslock: 'KEY_CAPSLOCK', left_arrow: 'KEY_LEFT_ARROW',
        right_arrow: 'KEY_RIGHT_ARROW', up_arrow: 'KEY_UP_ARROW', down_arrow: 'KEY_DOWN_ARROW',
        delete: 'KEY_DELETE', // Mac delete is Backspace in Digispark terms sometimes
        f1: 'KEY_F1', f2: 'KEY_F2', f3: 'KEY_F3', f4: 'KEY_F4', f5: 'KEY_F5',
        f6: 'KEY_F6', f7: 'KEY_F7', f8: 'KEY_F8', f9: 'KEY_F9', f10: 'KEY_F10',
        f11: 'KEY_F11', f12: 'KEY_F12'
    },
    linux: { // Often similar to Windows
        gui: 'KEY_GUI', enter: 'KEY_ENTER', tab: 'KEY_TAB', esc: 'KEY_ESC', space: 'KEY_SPACE',
        backspace: 'KEY_BACKSPACE', capslock: 'KEY_CAPSLOCK', left_arrow: 'KEY_LEFT_ARROW',
        right_arrow: 'KEY_RIGHT_ARROW', up_arrow: 'KEY_UP_ARROW', down_arrow: 'KEY_DOWN_ARROW',
        delete: 'KEY_DELETE',
        f1: 'KEY_F1', f2: 'KEY_F2', f3: 'KEY_F3', f4: 'KEY_F4', f5: 'KEY_F5',
        f6: 'KEY_F6', f7: 'KEY_F7', f8: 'KEY_F8', f9: 'KEY_F9', f10: 'KEY_F10',
        f11: 'KEY_F11', f12: 'KEY_F12'
    }
};

const digisparkModifierKeys = {
    'CTRL': 'MOD_CTRL',
    'ALT': 'MOD_ALT',
    'SHIFT': 'MOD_SHIFT',
    'GUI': 'MOD_GUI' // Or MOD_COMMAND for Mac
};

function addDigisparkAction(actionType = 'keyboard', value = '', delay = 100) {
    const payloadActionsContainer = document.getElementById('digisparkPayloadActions');
    if (!payloadActionsContainer) {
        console.error('Digispark payload actions container not found');
        return;
    }
    
    const actionId = `digispark-action-${digisparkActionCounter++}`;
    window.digisparkActionCounter = digisparkActionCounter; // Update global counter
    
    // Create action item container
    const actionDiv = document.createElement('div');
    actionDiv.className = 'action-item';
    actionDiv.id = actionId;
    
    // Create type selection
    const typeFormGroup = document.createElement('div');
    typeFormGroup.className = 'form-group';
    
    const typeLabel = document.createElement('label');
    typeLabel.setAttribute('for', `${actionId}-type`);
    typeLabel.textContent = 'Operation Type:';
    
    const typeSelect = document.createElement('select');
    typeSelect.id = `${actionId}-type`;
    typeSelect.onchange = () => updateDigisparkActionFields(actionId);
    
    const options = [
        {value: 'keyboard', text: 'Keyboard (Type Text)', selected: actionType === 'keyboard'},
        {value: 'press_key', text: 'Press Specific Key', selected: actionType === 'press_key'},
        {value: 'combined_keys', text: 'Combined Keys (Ctrl+C, Alt+F4)', selected: actionType === 'combined_keys'},
        {value: 'mouse_move', text: 'Mouse (Move)', selected: actionType === 'mouse_move'},
        {value: 'mouse_click', text: 'Mouse (Click)', selected: actionType === 'mouse_click'},
        {value: 'mouse_scroll', text: 'Mouse (Scroll)', selected: actionType === 'mouse_scroll'},
        {value: 'run_dialog', text: 'Execute Command (Run Dialog)', selected: actionType === 'run_dialog'},
        {value: 'delay', text: 'Delay (Custom Ms)', selected: actionType === 'delay'},
        {value: 'comment', text: 'Comment (Code Annotation)', selected: actionType === 'comment'},
        {value: 'custom_code', text: 'Custom Arduino Code', selected: actionType === 'custom_code'}
    ];
    
    options.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt.value;
        option.textContent = opt.text;
        if (opt.selected) option.selected = true;
        typeSelect.appendChild(option);
    });
    
    typeFormGroup.appendChild(typeLabel);
    typeFormGroup.appendChild(typeSelect);
    
    // Create value field container
    const valueFormGroup = document.createElement('div');
    valueFormGroup.className = 'form-group action-value-field';
    
    // Create delay field
    const delayFormGroup = document.createElement('div');
    delayFormGroup.className = 'form-group action-delay-field';
    
    const delayLabel = document.createElement('label');
    delayLabel.setAttribute('for', `${actionId}-delay`);
    delayLabel.textContent = 'Delay After Action (ms):';
    
    const delayInput = document.createElement('input');
    delayInput.type = 'number';
    delayInput.id = `${actionId}-delay`;
    delayInput.value = delay;
    delayInput.min = '0';
    
    delayFormGroup.appendChild(delayLabel);
    delayFormGroup.appendChild(delayInput);
    
    // Create action controls
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'action-controls';
    
    const removeButton = document.createElement('button');
    removeButton.onclick = () => removeDigisparkAction(actionId);
    removeButton.innerHTML = '<i class="fas fa-trash-alt"></i> Remove';
    
    controlsDiv.appendChild(removeButton);
    
    // Assemble the action item
    actionDiv.appendChild(typeFormGroup);
    actionDiv.appendChild(valueFormGroup);
    actionDiv.appendChild(delayFormGroup);
    actionDiv.appendChild(controlsDiv);
    
    payloadActionsContainer.appendChild(actionDiv);
    updateDigisparkActionFields(actionId, actionType, value); // Initialize fields
    attachDigisparkEventListeners();
}

function updateDigisparkActionFields(actionId, initialType = null, initialValue = '') {
    const actionItem = document.getElementById(actionId);
    const typeSelect = actionItem.querySelector('select');
    const valueFieldContainer = actionItem.querySelector('.action-value-field');
    const selectedType = initialType || typeSelect.value;

    // Clear existing content safely
    while (valueFieldContainer.firstChild) {
        valueFieldContainer.removeChild(valueFieldContainer.firstChild);
    }

    const elements = createDigisparkValueFields(actionId, selectedType, initialValue);
    elements.forEach(element => {
        valueFieldContainer.appendChild(element);
    });
    
    attachDigisparkEventListeners();
}

function createDigisparkValueFields(actionId, selectedType, initialValue) {
    switch (selectedType) {
        case 'keyboard':
            return createDigisparkKeyboardFields(actionId, initialValue);
        case 'press_key':
            return createDigisparkPressKeyFields(actionId, initialValue);
        case 'combined_keys':
            return createDigisparkCombinedKeysFields(actionId, initialValue);
        case 'mouse_move':
            return createDigisparkMouseMoveFields(actionId, initialValue);
        case 'mouse_click':
            return createDigisparkMouseClickFields(actionId, initialValue);
        case 'mouse_scroll':
            return createDigisparkMouseScrollFields(actionId, initialValue);
        case 'run_dialog':
            return createDigisparkRunDialogFields(actionId, initialValue);
        case 'delay':
            return createDigisparkDelayFields(actionId, initialValue);
        case 'comment':
            return createDigisparkCommentFields(actionId, initialValue);
        case 'custom_code':
            return createDigisparkCustomCodeFields(actionId, initialValue);
        default:
            return [];
    }
}

function createDigisparkKeyboardFields(actionId, initialValue) {
    const label = document.createElement('label');
    label.setAttribute('for', `${actionId}-text`);
    label.textContent = 'Text to Type:';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.id = `${actionId}-text`;
    input.value = initialValue;
    
    return [label, input];
}

function createDigisparkPressKeyFields(actionId, initialValue) {
    const os = document.getElementById('osSelect').value;
    const osKeys = osDigisparkKeyMap[os];
    
    const label = document.createElement('label');
    label.setAttribute('for', `${actionId}-key`);
    label.textContent = 'Key to Press:';
    
    const select = document.createElement('select');
    select.id = `${actionId}-key`;
    
    for (const key in osKeys) {
        const displayKey = key.replace(/_/g, ' ').toUpperCase();
        const option = document.createElement('option');
        option.value = osKeys[key];
        option.textContent = displayKey;
        if (initialValue === osKeys[key]) option.selected = true;
        select.appendChild(option);
    }
    
    return [label, select];
}

function createDigisparkCombinedKeysFields(actionId, initialValue) {
    const currentSelectedModifiers = initialValue.modifiers || [];
    const currentCombinedKey = initialValue.key || '';
    
    const modLabel = document.createElement('label');
    modLabel.textContent = 'Modifier Keys:';
    
    const checkboxGroup = document.createElement('div');
    checkboxGroup.className = 'checkbox-group';
    
    for (const mod in digisparkModifierKeys) {
        const label = document.createElement('label');
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.setAttribute('data-modifier', digisparkModifierKeys[mod]);
        if (currentSelectedModifiers.includes(digisparkModifierKeys[mod])) {
            checkbox.checked = true;
        }
        
        const text = document.createTextNode(` ${mod}`);
        
        label.appendChild(checkbox);
        label.appendChild(text);
        checkboxGroup.appendChild(label);
    }
    
    const keyLabel = document.createElement('label');
    keyLabel.setAttribute('for', `${actionId}-combined-key`);
    keyLabel.textContent = 'Main Key:';
    
    const keyInput = document.createElement('input');
    keyInput.type = 'text';
    keyInput.id = `${actionId}-combined-key`;
    keyInput.value = currentCombinedKey;
    keyInput.placeholder = 'e.g., A, 1, F1';
    
    const small = document.createElement('small');
    small.textContent = 'Main key (e.g., \'A\' or \'KEY_F1\'). Use \'KEY_GUI\' or \'KEY_COMMAND\' for OS key if not using a modifier.';
    
    return [modLabel, checkboxGroup, keyLabel, keyInput, small];
}

function createDigisparkMouseMoveFields(actionId, initialValue) {
    const [x, y] = (initialValue || '').split(',').map(Number);
    
    const xLabel = document.createElement('label');
    xLabel.setAttribute('for', `${actionId}-mouse-x`);
    xLabel.textContent = 'Move X:';
    
    const xInput = document.createElement('input');
    xInput.type = 'number';
    xInput.id = `${actionId}-mouse-x`;
    xInput.value = x || 0;
    
    const yLabel = document.createElement('label');
    yLabel.setAttribute('for', `${actionId}-mouse-y`);
    yLabel.textContent = 'Move Y:';
    
    const yInput = document.createElement('input');
    yInput.type = 'number';
    yInput.id = `${actionId}-mouse-y`;
    yInput.value = y || 0;
    
    return [xLabel, xInput, yLabel, yInput];
}

function createDigisparkMouseClickFields(actionId, initialValue) {
    const label = document.createElement('label');
    label.setAttribute('for', `${actionId}-mouse-button`);
    label.textContent = 'Mouse Button:';
    
    const select = document.createElement('select');
    select.id = `${actionId}-mouse-button`;
    
    const buttons = [
        {value: 'LEFT', text: 'Left'},
        {value: 'RIGHT', text: 'Right'},
        {value: 'MIDDLE', text: 'Middle'}
    ];
    
    buttons.forEach(button => {
        const option = document.createElement('option');
        option.value = button.value;
        option.textContent = button.text;
        if (initialValue === button.value) option.selected = true;
        select.appendChild(option);
    });
    
    return [label, select];
}

function createDigisparkMouseScrollFields(actionId, initialValue) {
    const label = document.createElement('label');
    label.setAttribute('for', `${actionId}-mouse-scroll`);
    label.textContent = 'Scroll Amount:';
    
    const input = document.createElement('input');
    input.type = 'number';
    input.id = `${actionId}-mouse-scroll`;
    input.value = initialValue || 0;
    
    const small = document.createElement('small');
    small.textContent = 'Positive for up, negative for down.';
    
    return [label, input, small];
}

function createDigisparkRunDialogFields(actionId, initialValue) {
    const label = document.createElement('label');
    label.setAttribute('for', `${actionId}-command`);
    label.textContent = 'Command to Execute (Run Dialog):';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.id = `${actionId}-command`;
    input.value = initialValue;
    input.placeholder = 'e.g., notepad.exe';
    
    return [label, input];
}

function createDigisparkDelayFields(actionId, initialValue) {
    const label = document.createElement('label');
    label.setAttribute('for', `${actionId}-custom-delay`);
    label.textContent = 'Custom Delay (ms):';
    
    const input = document.createElement('input');
    input.type = 'number';
    input.id = `${actionId}-custom-delay`;
    input.value = initialValue || 1000;
    input.min = '0';
    
    return [label, input];
}

function createDigisparkCommentFields(actionId, initialValue) {
    const label = document.createElement('label');
    label.setAttribute('for', `${actionId}-comment-text`);
    label.textContent = 'Comment Text:';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.id = `${actionId}-comment-text`;
    input.value = initialValue;
    input.placeholder = 'e.g., Open browser';
    
    return [label, input];
}

function createDigisparkCustomCodeFields(actionId, initialValue) {
    const label = document.createElement('label');
    label.setAttribute('for', `${actionId}-custom-arduino-code`);
    label.textContent = 'Custom Arduino Code:';
    
    const textarea = document.createElement('textarea');
    textarea.id = `${actionId}-custom-arduino-code`;
    textarea.rows = 5;
    textarea.placeholder = 'e.g., DigiKeyboard.print("Hello");';
    textarea.value = initialValue;
    
    const small = document.createElement('small');
    small.textContent = 'Enter valid Arduino/Digispark code here. Each line will be added directly.';
    
    return [label, textarea, small];
}

function removeDigisparkAction(id) {
    document.getElementById(id).remove();
    generateDigisparkCode();
}

function generateDigisparkCode() {
    const osSelect = document.getElementById('osSelect');
    const initialDelayInput = document.getElementById('initialDelay');
    
    if (!osSelect || !initialDelayInput) {
        console.error('Required elements not found for code generation');
        return;
    }
    
    const os = osSelect.value;
    const initialDelay = parseInt(initialDelayInput.value) || 1000;
    const guiKey = osDigisparkKeyMap[os]?.gui || 'KEY_GUI';

    let code = `#include <DigiKeyboard.h>\n\n`;
    // For mouse/consumer control, you'd need additional includes/libraries
    // if not using a unified DigiKeyboard.h that handles them.
    // For this example, we assume DigiKeyboard handles all HID types or
    // that a more advanced setup would be managed by the user.

    code += `void setup() {\n`;
    code += `  DigiKeyboard.delay(${initialDelay});\n`;
    code += `}\n\n`;
    code += `void loop() {\n`;

    const actions = document.querySelectorAll('#digisparkPayloadActions .action-item');
    actions.forEach(actionItem => {
        const actionId = actionItem.id;
        const typeSelect = actionItem.querySelector('select');
        const delayInput = actionItem.querySelector(`#${actionId}-delay`);
        
        if (!typeSelect) return;
        
        const type = typeSelect.value;
        const delay = delayInput ? parseInt(delayInput.value) || 0 : 0;

        switch (type) {
            case 'keyboard':
                const textInput = actionItem.querySelector(`#${actionId}-text`);
                const text = textInput ? textInput.value : '';
                if (text) {
                    code += `  DigiKeyboard.print("${text.replace(/"/g, '\\"')}");\n`; // Escape quotes
                }
                break;
            case 'press_key':
                const keyInput = actionItem.querySelector(`#${actionId}-key`);
                const key = keyInput ? keyInput.value : '';
                if (key) {
                    code += `  DigiKeyboard.sendKeyStroke(${key});\n`;
                }
                break;
            case 'combined_keys':
                const modifiers = Array.from(actionItem.querySelectorAll(`#${actionId} input[type="checkbox"]`))
                    .filter(cb => cb.checked)
                    .map(cb => cb.dataset.modifier);
                const combinedKeyInput = actionItem.querySelector(`#${actionId}-combined-key`);
                let combinedKey = combinedKeyInput ? combinedKeyInput.value : '';

                if (combinedKey.length === 1 && combinedKey.match(/[a-z]/i)) {
                    combinedKey = `KEY_` + combinedKey.toUpperCase();
                } else if (combinedKey.length === 1 && combinedKey.match(/[0-9]/)) {
                    combinedKey = `KEY_` + combinedKey;
                } else if (!combinedKey.startsWith('KEY_') && combinedKey !== '') { // Allow empty for only modifiers
                    combinedKey = `KEY_` + combinedKey.toUpperCase();
                } else if (combinedKey === '') {
                     combinedKey = '0'; // No primary key
                }

                if (modifiers.length > 0 || combinedKey !== '0') {
                    const modifierString = modifiers.length > 0 ? modifiers.join(' | ') : '0';
                    code += `  DigiKeyboard.sendKeyStroke(${combinedKey}, ${modifierString});\n`;
                }
                break;
            case 'mouse_move':
                const mouseXInput = actionItem.querySelector(`#${actionId}-mouse-x`);
                const mouseYInput = actionItem.querySelector(`#${actionId}-mouse-y`);
                const mouseX = mouseXInput ? parseInt(mouseXInput.value) || 0 : 0;
                const mouseY = mouseYInput ? parseInt(mouseYInput.value) || 0 : 0;
                code += `  DigiKeyboard.move(${mouseX}, ${mouseY}, 0);\n`;
                break;
            case 'mouse_click':
                const mouseButtonInput = actionItem.querySelector(`#${actionId}-mouse-button`);
                const mouseButton = mouseButtonInput ? mouseButtonInput.value : 'LEFT';
                code += `  DigiKeyboard.click(MOUSE_BUTTON_${mouseButton});\n`;
                break;
            case 'mouse_scroll':
                const mouseScrollInput = actionItem.querySelector(`#${actionId}-mouse-scroll`);
                const mouseScroll = mouseScrollInput ? parseInt(mouseScrollInput.value) || 0 : 0;
                code += `  DigiKeyboard.scroll(${mouseScroll});\n`;
                break;
          //  case 'consumer_control':
              //  const consumerAction = actionItem.querySelector(`#${actionId}-consumer`).value;
               // code += `  DigiKeyboard.sendKeyStroke(${consumerAction});\n`;
              //  break;
            case 'run_dialog':
                const commandInput = actionItem.querySelector(`#${actionId}-command`);
                const command = commandInput ? commandInput.value : '';
                if (command) {
                    code += `  DigiKeyboard.sendKeyStroke(${guiKey}, KEY_R);\n`;
                    code += `  DigiKeyboard.delay(500);\n`;
                    code += `  DigiKeyboard.print("${command.replace(/"/g, '\\"')}");\n`;
                    const enterKey = osDigisparkKeyMap[os]?.enter || 'KEY_ENTER';
                    code += `  DigiKeyboard.sendKeyStroke(${enterKey});\n`;
                }
                break;
            case 'delay':
                const customDelayInput = actionItem.querySelector(`#${actionId}-custom-delay`);
                const customDelay = customDelayInput ? parseInt(customDelayInput.value) || 1000 : 1000;
                code += `  DigiKeyboard.delay(${customDelay});\n`;
                break;
            case 'comment':
                const commentInput = actionItem.querySelector(`#${actionId}-comment-text`);
                const commentText = commentInput ? commentInput.value : '';
                if (commentText) {
                    code += `  // ${commentText}\n`;
                }
                break;
            case 'custom_code':
                const customCodeInput = actionItem.querySelector(`#${actionId}-custom-arduino-code`);
                const customArduinoCode = customCodeInput ? customCodeInput.value : '';
                if (customArduinoCode) {
                    code += `  // Custom Code Block Start\n`;
                    customArduinoCode.split('\n').forEach(line => {
                        code += `  ${line.trim()}\n`;
                    });
                    code += `  // Custom Code Block End\n`;
                }
                break;
        }

        if (delay > 0) {
            code += `  DigiKeyboard.delay(${delay});\n`;
        }
    });

    code += `  // Loop forever (or remove for single execution payload)\n`;
    code += `  for(;;);\n`; // Digispark loop should not exit
    code += `}\n`;

    const outputCode = document.getElementById('outputCode');
    if (outputCode) {
        outputCode.value = code;
    }
}

// Attach event listeners for Digispark specific fields
function attachDigisparkEventListeners() {
    document.querySelectorAll('#digisparkPayloadActions .action-item select, #digisparkPayloadActions .action-item input[type="text"], #digisparkPayloadActions .action-item input[type="number"], #digisparkPayloadActions .action-item input[type="checkbox"], #digisparkPayloadActions .action-item textarea').forEach(element => {
        element.removeEventListener('input', generateDigisparkCode);
        element.removeEventListener('change', generateDigisparkCode);

        if (element.tagName === 'SELECT' || element.type === 'checkbox') {
            element.addEventListener('change', generateDigisparkCode);
        } else {
            element.addEventListener('input', generateDigisparkCode);
        }
    });

    document.getElementById('osSelect').removeEventListener('change', handleDigisparkOSChange);
    document.getElementById('osSelect').addEventListener('change', handleDigisparkOSChange);

    document.getElementById('initialDelay').removeEventListener('input', generateDigisparkCode);
    document.getElementById('initialDelay').addEventListener('input', generateDigisparkCode);
}

function handleDigisparkOSChange() {
    if (typeof generateDigisparkCode === 'function') {
        generateDigisparkCode(); // Regenerate code with new OS settings
    }
    
    // Update 'Press Specific Key' dropdowns if they exist
    document.querySelectorAll('.action-item').forEach(item => {
        const typeSelect = item.querySelector('select');
        if (typeSelect && typeSelect.value === 'press_key') {
            const keyInput = item.querySelector(`#${item.id}-key`);
            const currentValue = keyInput ? keyInput.value : '';
            updateDigisparkActionFields(item.id, 'press_key', currentValue);
        }
    });
}

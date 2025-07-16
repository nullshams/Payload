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
    const actionHtml = `
        <div class="action-item" id="${actionId}">
            <div class="form-group">
                <label for="${actionId}-type">Operation Type:</label>
                <select id="${actionId}-type" onchange="updateDigisparkActionFields('${actionId}')">
                    <option value="keyboard" ${actionType === 'keyboard' ? 'selected' : ''}>Keyboard (Type Text)</option>
                    <option value="press_key" ${actionType === 'press_key' ? 'selected' : ''}>Press Specific Key</option>
                    <option value="combined_keys" ${actionType === 'combined_keys' ? 'selected' : ''}>Combined Keys (Ctrl+C, Alt+F4)</option>
                    <option value="mouse_move" ${actionType === 'mouse_move' ? 'selected' : ''}>Mouse (Move)</option>
                    <option value="mouse_click" ${actionType === 'mouse_click' ? 'selected' : ''}>Mouse (Click)</option>
                    <option value="mouse_scroll" ${actionType === 'mouse_scroll' ? 'selected' : ''}>Mouse (Scroll)</option>
                /* <option value="consumer_control" ${actionType === 'consumer_control' ? 'selected' : ''}>Consumer Control (Vol/Media)</option>*/ 
                    <option value="run_dialog" ${actionType === 'run_dialog' ? 'selected' : ''}>Execute Command (Run Dialog)</option>
                    <option value="delay" ${actionType === 'delay' ? 'selected' : ''}>Delay (Custom Ms)</option>
                    <option value="comment" ${actionType === 'comment' ? 'selected' : ''}>Comment (Code Annotation)</option>
                    <option value="custom_code" ${actionType === 'custom_code' ? 'selected' : ''}>Custom Arduino Code</option>
                </select>
            </div>
            <div class="form-group action-value-field">
                </div>
            <div class="form-group action-delay-field">
                <label for="${actionId}-delay">Delay After Action (ms):</label>
                <input type="number" id="${actionId}-delay" value="${delay}" min="0">
            </div>
            <div class="action-controls">
                <button onclick="removeDigisparkAction('${actionId}')"><i class="fas fa-trash-alt"></i> Remove</button>
            </div>
        </div>
    `;
    payloadActionsContainer.insertAdjacentHTML('beforeend', actionHtml);
    updateDigisparkActionFields(actionId, actionType, value); // Initialize fields
    attachDigisparkEventListeners();
}

function updateDigisparkActionFields(actionId, initialType = null, initialValue = '') {
    const actionItem = document.getElementById(actionId);
    const typeSelect = actionItem.querySelector('select');
    const valueFieldContainer = actionItem.querySelector('.action-value-field');
    const selectedType = initialType || typeSelect.value;

    let valueHtml = '';
    switch (selectedType) {
        case 'keyboard':
            valueHtml = `
                <label for="${actionId}-text">Text to Type:</label>
                <input type="text" id="${actionId}-text" value="${initialValue}">
            `;
            break;
        case 'press_key':
            const os = document.getElementById('osSelect').value;
            const osKeys = osDigisparkKeyMap[os];
            let keyOptions = '';
            for (const key in osKeys) {
                const displayKey = key.replace(/_/g, ' ').toUpperCase();
                keyOptions += `<option value="${osKeys[key]}" ${initialValue === osKeys[key] ? 'selected' : ''}>${displayKey}</option>`;
            }
            valueHtml = `
                <label for="${actionId}-key">Key to Press:</label>
                <select id="${actionId}-key">
                    ${keyOptions}
                </select>
            `;
            break;
        case 'combined_keys':
            let modifierOptions = '';
            const currentSelectedModifiers = initialValue.modifiers || [];
            const currentCombinedKey = initialValue.key || '';

            for (const mod in digisparkModifierKeys) {
                modifierOptions += `
                    <label>
                        <input type="checkbox" data-modifier="${digisparkModifierKeys[mod]}" ${currentSelectedModifiers.includes(digisparkModifierKeys[mod]) ? 'checked' : ''}> ${mod}
                    </label>
                `;
            }
            valueHtml = `
                <label>Modifier Keys:</label>
                <div class="checkbox-group">${modifierOptions}</div>
                <label for="${actionId}-combined-key">Main Key:</label>
                <input type="text" id="${actionId}-combined-key" value="${currentCombinedKey}" placeholder="e.g., A, 1, F1">
                <small>Main key (e.g., 'A' or 'KEY_F1'). Use 'KEY_GUI' or 'KEY_COMMAND' for OS key if not using a modifier.</small>
            `;
            break;
        case 'mouse_move':
            const [x, y] = (initialValue || '').split(',').map(Number);
            valueHtml = `
                <label for="${actionId}-mouse-x">Move X:</label>
                <input type="number" id="${actionId}-mouse-x" value="${x || 0}">
                <label for="${actionId}-mouse-y">Move Y:</label>
                <input type="number" id="${actionId}-mouse-y" value="${y || 0}">
            `;
            break;
        case 'mouse_click':
            valueHtml = `
                <label for="${actionId}-mouse-button">Mouse Button:</label>
                <select id="${actionId}-mouse-button">
                    <option value="LEFT" ${initialValue === 'LEFT' ? 'selected' : ''}>Left</option>
                    <option value="RIGHT" ${initialValue === 'RIGHT' ? 'selected' : ''}>Right</option>
                    <option value="MIDDLE" ${initialValue === 'MIDDLE' ? 'selected' : ''}>Middle</option>
                </select>
            `;
            break;
        case 'mouse_scroll':
            valueHtml = `
                <label for="${actionId}-mouse-scroll">Scroll Amount:</label>
                <input type="number" id="${actionId}-mouse-scroll" value="${initialValue || 0}">
                <small>Positive for up, negative for down.</small>
            `;
            break;
     /*  case 'consumer_control':
            valueHtml = `
                <label for="${actionId}-consumer">Consumer Control:</label>
                <select id="${actionId}-consumer">
                    <option value="MEDIA_VOLUME_UP" ${initialValue === 'MEDIA_VOLUME_UP' ? 'selected' : ''}>Volume Up</option>
                    <option value="MEDIA_VOLUME_DOWN" ${initialValue === 'MEDIA_VOLUME_DOWN' ? 'selected' : ''}>Volume Down</option>
                    <option value="MEDIA_MUTE" ${initialValue === 'MEDIA_MUTE' ? 'selected' : ''}>Mute</option>
                    <option value="MEDIA_PLAY_PAUSE" ${initialValue === 'MEDIA_PLAY_PAUSE' ? 'selected' : ''}>Play/Pause</option>
                    <option value="MEDIA_NEXT" ${initialValue === 'MEDIA_NEXT' ? 'selected' : ''}>Next Track</option>
                    <option value="MEDIA_PREVIOUS" ${initialValue === 'MEDIA_PREVIOUS' ? 'selected' : ''}>Previous Track</option>
                </select>
            `;*/
            break;
        case 'run_dialog':
            valueHtml = `
                <label for="${actionId}-command">Command to Execute (Run Dialog):</label>
                <input type="text" id="${actionId}-command" value="${initialValue}" placeholder="e.g., notepad.exe">
            `;
            break;
        case 'delay':
            valueHtml = `
                <label for="${actionId}-custom-delay">Custom Delay (ms):</label>
                <input type="number" id="${actionId}-custom-delay" value="${initialValue || 1000}" min="0">
            `;
            break;
        case 'comment':
            valueHtml = `
                <label for="${actionId}-comment-text">Comment Text:</label>
                <input type="text" id="${actionId}-comment-text" value="${initialValue}" placeholder="e.g., Open browser">
            `;
            break;
        case 'custom_code':
            valueHtml = `
                <label for="${actionId}-custom-arduino-code">Custom Arduino Code:</label>
                <textarea id="${actionId}-custom-arduino-code" rows="5" placeholder="e.g., DigiKeyboard.print(&quot;Hello&quot;);">${initialValue}</textarea>
                <small>Enter valid Arduino/Digispark code here. Each line will be added directly.</small>
            `;
            break;
    }
    valueFieldContainer.innerHTML = valueHtml;
    attachDigisparkEventListeners();
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

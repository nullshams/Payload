// Utility functions shared across different payload types

function copyCode() {
    const outputCode = document.getElementById('outputCode');
    if (outputCode && outputCode.value) {
        // Try modern clipboard API first
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(outputCode.value).then(function() {
                alert('Payload copied to clipboard!');
            }).catch(function(err) {
                console.error('Failed to copy with clipboard API:', err);
                fallbackCopyTextToClipboard(outputCode.value);
            });
        } else {
            fallbackCopyTextToClipboard(outputCode.value);
        }
    } else {
        alert('No payload to copy!');
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        alert('Payload copied to clipboard!');
    } catch (err) {
        console.error('Fallback: Could not copy text: ', err);
        alert('Failed to copy to clipboard');
    }
    
    document.body.removeChild(textArea);
}

function downloadCode() {
    const outputCode = document.getElementById('outputCode');
    if (!outputCode || !outputCode.value.trim()) {
        alert('No payload to download!');
        return;
    }

    const activeTabContent = document.querySelector('.tab-content.active');
    let filename = 'payload.txt';
    
    if (activeTabContent) {
        if (activeTabContent.id === 'digispark' || activeTabContent.id === 'blueprints') {
            filename = "payload.ino";
        } else if (activeTabContent.id === 'android') {
            const payloadType = document.getElementById('androidPayloadType')?.value;
            if (payloadType === 'adb_command' || payloadType === 'termux_script') {
                filename = "android_payload.sh";
            } else {
                filename = "android_payload.txt";
            }
        }
    }

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(outputCode.value));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function showTab(tabId) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Deactivate all tab buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });

    // Show the selected tab content
    document.getElementById(tabId).classList.add('active');

    // Activate the corresponding tab button
    document.querySelector(`.tab-button[onclick="showTab('${tabId}')"]`).classList.add('active');

    // Regenerate code for the newly active tab
    if (tabId === 'digispark') {
        if (typeof generateDigisparkCode === 'function') {
            generateDigisparkCode();
        }
    } else if (tabId === 'android') {
        if (typeof generateAndroidCode === 'function') {
            generateAndroidCode();
        }
    } else if (tabId === 'blueprints') {
        // Blueprints will regenerate on selection
        const blueprintSelect = document.getElementById('blueprintSelect');
        const blueprintDescription = document.getElementById('blueprintDescription');
        const outputCode = document.getElementById('outputCode');
        
        if (blueprintSelect) blueprintSelect.value = ''; // Reset blueprint selection
        if (blueprintDescription) {
            blueprintDescription.textContent = '';
            const p = document.createElement('p');
            p.textContent = 'Select a blueprint to see its description and generated payload.';
            blueprintDescription.appendChild(p);
        }
        if (outputCode) outputCode.value = ''; // Clear output
    }
}

// Function to save configuration
function saveConfig() {
    try {
        const activeTabContent = document.querySelector('.tab-content.active');
        if (!activeTabContent) {
            alert('No active tab found!');
            return;
        }
        
        let config = {};
        const currentTab = activeTabContent.id;

        if (currentTab === 'digispark' || currentTab === 'blueprints') {
            const osSelect = document.getElementById('osSelect');
            const initialDelay = document.getElementById('initialDelay');
            
            config = {
                type: 'digispark',
                os: osSelect ? osSelect.value : 'windows',
                initialDelay: initialDelay ? initialDelay.value : '1000',
                actions: []
            };

            const actionItems = document.querySelectorAll('#digisparkPayloadActions .action-item');
            actionItems.forEach(actionItem => {
                const actionId = actionItem.id;
                const typeSelect = actionItem.querySelector('select');
                const delayInput = actionItem.querySelector(`#${actionId}-delay`);
                
                if (!typeSelect) return;
                
                const type = typeSelect.value;
                const delay = delayInput ? parseInt(delayInput.value) || 0 : 0;
                let value = '';

                try {
                    switch (type) {
                        case 'keyboard':
                            const textInput = actionItem.querySelector(`#${actionId}-text`);
                            value = textInput ? textInput.value : '';
                            break;
                        case 'press_key':
                            const keyInput = actionItem.querySelector(`#${actionId}-key`);
                            value = keyInput ? keyInput.value : '';
                            break;
                        case 'combined_keys':
                            const modifiers = Array.from(actionItem.querySelectorAll(`input[type="checkbox"]`))
                                .filter(cb => cb.checked)
                                .map(cb => cb.dataset.modifier);
                            const combinedKeyInput = actionItem.querySelector(`#${actionId}-combined-key`);
                            const combinedKey = combinedKeyInput ? combinedKeyInput.value : '';
                            value = { modifiers, key: combinedKey };
                            break;
                        case 'mouse_move':
                            const mouseXInput = actionItem.querySelector(`#${actionId}-mouse-x`);
                            const mouseYInput = actionItem.querySelector(`#${actionId}-mouse-y`);
                            const mouseX = mouseXInput ? parseInt(mouseXInput.value) || 0 : 0;
                            const mouseY = mouseYInput ? parseInt(mouseYInput.value) || 0 : 0;
                            value = `${mouseX},${mouseY}`;
                            break;
                        case 'mouse_click':
                            const mouseButtonInput = actionItem.querySelector(`#${actionId}-mouse-button`);
                            value = mouseButtonInput ? mouseButtonInput.value : '';
                            break;
                        case 'mouse_scroll':
                            const mouseScrollInput = actionItem.querySelector(`#${actionId}-mouse-scroll`);
                            value = mouseScrollInput ? parseInt(mouseScrollInput.value) || 0 : 0;
                            break;
                        case 'run_dialog':
                            const commandInput = actionItem.querySelector(`#${actionId}-command`);
                            value = commandInput ? commandInput.value : '';
                            break;
                        case 'delay':
                            const customDelayInput = actionItem.querySelector(`#${actionId}-custom-delay`);
                            value = customDelayInput ? parseInt(customDelayInput.value) || 1000 : 1000;
                            break;
                        case 'comment':
                            const commentInput = actionItem.querySelector(`#${actionId}-comment-text`);
                            value = commentInput ? commentInput.value : '';
                            break;
                        case 'custom_code':
                            const customCodeInput = actionItem.querySelector(`#${actionId}-custom-arduino-code`);
                            value = customCodeInput ? customCodeInput.value : '';
                            break;
                    }
                    
                    config.actions.push({ type, value, delay });
                } catch (actionError) {
                    console.warn('Error processing action:', actionError);
                }
            });
            
        } else if (currentTab === 'android') {
            const payloadTypeSelect = document.getElementById('androidPayloadType');
            config = {
                type: 'android',
                payloadType: payloadTypeSelect ? payloadTypeSelect.value : 'adb_command',
                value: typeof getAndroidPayloadValue === 'function' ? getAndroidPayloadValue() : ''
            };
        }

        localStorage.setItem('payloadForgeConfig', JSON.stringify(config));
        alert('Configuration saved!');
    } catch (error) {
        console.error('Error saving configuration:', error);
        alert('Error saving configuration: ' + error.message);
    }
}

// Function to load configuration
function loadConfig() {
    try {
        const savedConfig = localStorage.getItem('payloadForgeConfig');
        if (savedConfig) {
            const config = JSON.parse(savedConfig);

            if (config.type === 'digispark') {
                showTab('digispark');
                
                const osSelect = document.getElementById('osSelect');
                const initialDelay = document.getElementById('initialDelay');
                
                if (osSelect) osSelect.value = config.os || 'windows';
                if (initialDelay) initialDelay.value = config.initialDelay || '1000';

                const actionsContainer = document.getElementById('digisparkPayloadActions');
                if (actionsContainer) {
                    // Clear container safely
                    while (actionsContainer.firstChild) {
                        actionsContainer.removeChild(actionsContainer.firstChild);
                    }
                }
                
                if (typeof window.digisparkActionCounter !== 'undefined') {
                    window.digisparkActionCounter = 0; // Reset counter for Digispark
                }

                if (config.actions && Array.isArray(config.actions)) {
                    config.actions.forEach(action => {
                        if (typeof addDigisparkAction === 'function') {
                            addDigisparkAction(action.type, action.value, action.delay);
                        }
                    });
                }
                
                if (typeof generateDigisparkCode === 'function') {
                    generateDigisparkCode();
                }
                
            } else if (config.type === 'android') {
                showTab('android');
                
                const androidPayloadType = document.getElementById('androidPayloadType');
                if (androidPayloadType) {
                    androidPayloadType.value = config.payloadType || 'adb_command';
                }
                
                if (typeof updateAndroidPayloadFields === 'function') {
                    updateAndroidPayloadFields(config.payloadType, config.value);
                }
                
                if (typeof generateAndroidCode === 'function') {
                    generateAndroidCode();
                }
                
            } else if (config.type === 'blueprint') {
                showTab('blueprints');
                
                const blueprintSelect = document.getElementById('blueprintSelect');
                if (blueprintSelect) {
                    blueprintSelect.value = config.selectedBlueprint || '';
                }
                
                if (typeof loadBlueprint === 'function') {
                    loadBlueprint(); // Load the selected blueprint
                }
            }
            
            alert('Configuration loaded!');
        } else {
            alert('No saved configuration found.');
        }
    } catch (error) {
        console.error('Error loading configuration:', error);
        alert('Error loading configuration: ' + error.message);
    }
}

# 🔥 Payload Forge | Advanced Generator

[![License](https://img.shields.io/badge/license-Educational-red.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Web-blue.svg)](https://github.com)
[![Language](https://img.shields.io/badge/language-JavaScript-yellow.svg)](https://github.com)

> **⚠️ EDUCATIONAL PURPOSE ONLY**: This tool is designed for educational purposes, penetration testing, and authorized security research. Users are responsible for ensuring compliance with all applicable laws and regulations.

## 📖 Overview

**Payload Forge** is a sophisticated web-based payload generation tool that creates Arduino-compatible code for Digispark devices and various attack scenarios. The tool features a cyberpunk-themed interface and supports multiple operating systems (Windows, macOS, Linux) with extensive attack blueprints.

## ✨ Features

### 🎯 Core Functionality
- **Multi-OS Support**: Generate payloads for Windows, macOS, and Linux
- **Digispark Integration**: Arduino-compatible code generation (.ino files)
- **Attack Blueprints**: Pre-configured attack scenarios
- **Real-time Code Generation**: Live payload preview and editing
- **Configuration Management**: Save/load payload configurations

### 🛠️ Attack Categories

#### 📊 Data Exfiltration (سرقت اطلاعات)
- Wi-Fi Password Stealer
- Screenshot & Exfiltration
- Browser History Grabber
- SSH Key Extraction
- AWS Credentials Grabber
- Chrome Password Stealer

#### 🔒 Persistence & Backdoor (پایداری و بک‌دور)
- PowerShell Reverse Shell
- Persistent Backdoor Installation
- SSH Key Addition
- Sticky Keys Backdoor

#### 💥 Disruption & Sabotage (اختلال و خرابکاری)
- Windows Defender Disabling
- Network Disruption
- System Shutdown/Restart
- Drive Formatting (⚠️ DESTRUCTIVE)

#### 🎭 Prank Attacks (حملات شوخی)
- Rickroll Payload
- Fake Error Messages
- Mouse/Keyboard Chaos
- Multiple Window Spawning

#### 🔍 Information Gathering (جمع‌آوری اطلاعات)
- System Information Collection
- Network Configuration Grabbing
- Installed Programs Enumeration
- Directory Listing

#### ⬆️ Privilege Escalation (افزایش سطح دسترسی)
- UAC Bypass Techniques
- User Account Manipulation
- Firewall Disabling

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Basic understanding of cybersecurity concepts
- **Legal authorization** for any testing activities

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/payload-forge.git
   cd payload-forge
   ```

2. **Open the application**:
   ```bash
   # Simply open index.html in your web browser
   open index.html  # macOS
   # or
   xdg-open index.html  # Linux
   # or double-click index.html on Windows
   ```

3. **Start crafting payloads**!

## 🎮 Usage

### Basic Workflow

1. **Select Target OS**: Choose between Windows, macOS, or Linux
2. **Configure Global Settings**: Set initial delays and parameters
3. **Choose Method**:
   - **Manual**: Add individual actions step-by-step
   - **Blueprint**: Select from pre-configured attack scenarios
4. **Generate Payload**: Real-time Arduino code generation
5. **Download**: Export as `.ino` file for Digispark programming

### Example: Creating a Wi-Fi Password Stealer

1. Navigate to "Attack Blueprints" tab
2. Select "Wi-Fi Password Stealer (Windows)" from the dropdown
3. Customize server IP and port in the generated code
4. Download the `.ino` file
5. Upload to your Digispark device using Arduino IDE

### Digispark Hardware Setup

```cpp
// Example generated payload structure
#include "DigiKeyboard.h"

void setup() {
  DigiKeyboard.delay(1000);  // Initial delay
  // Generated payload actions here
}

void loop() {
  // Empty loop for one-time execution
}
```

## 📁 Project Structure

```
payload-forge/
├── index.html              # Main application interface
├── css/
│   └── style.css          # Cyberpunk-themed styling
├── js/
│   ├── script.js          # Main application logic
│   ├── digisparkPayloads.js  # Digispark-specific functions
│   ├── androidPayloads.js    # Android payload generation
│   └── commonUtils.js        # Shared utility functions
└── assets/
    └── images/
        └── background.jpg     # Cyberpunk background image
```

## 🔧 Technical Details

### Supported Key Mappings
- **Windows**: `KEY_GUI` (Windows key), standard function keys
- **macOS**: `KEY_COMMAND` (Cmd key), Mac-specific shortcuts
- **Linux**: `KEY_GUI` (Super key), Linux desktop shortcuts

### Action Types
- **Keyboard Input**: Text typing simulation
- **Key Press**: Individual key presses
- **Combined Keys**: Modifier + key combinations
- **Delays**: Timing control between actions
- **Comments**: Code documentation

## ⚖️ Legal Disclaimer

This tool is provided for **EDUCATIONAL PURPOSES ONLY**. The developers assume no liability and are not responsible for any misuse or damage caused by this program. 

### Important Guidelines:
- ✅ Use only on systems you own or have explicit permission to test
- ✅ Ensure compliance with local laws and regulations
- ✅ Use for authorized penetration testing and security research
- ❌ Do not use for malicious activities
- ❌ Do not target systems without permission
- ❌ Do not use for illegal purposes

## 🛡️ Security Considerations

- Many payloads require administrative privileges
- Some actions may be detected by antivirus software
- Network-based payloads require proper server setup
- Always test in isolated environments first

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-payload`)
3. Commit your changes (`git commit -m 'Add amazing payload'`)
4. Push to the branch (`git push origin feature/amazing-payload`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and conventions
- Add comments for complex payload logic
- Test payloads in safe environments
- Update documentation for new features

## 📜 License

This project is licensed under the Educational License - see the [LICENSE](LICENSE) file for details.

## 🔗 Resources

- [Digispark Official Documentation](http://digistump.com/wiki/digispark)
- [Arduino IDE Setup](https://www.arduino.cc/en/software)
- [Ethical Hacking Guidelines](https://www.eccouncil.org/ethical-hacking/)

## ⚠️ Disclaimer

**WARNING**: This tool generates potentially dangerous payloads that could harm systems or violate laws if misused. Always ensure you have proper authorization before using any generated payloads. The creators of this tool are not responsible for any illegal or unethical use.

---

*Crafting digital tools for the digital realm.* 🔥💻🔥

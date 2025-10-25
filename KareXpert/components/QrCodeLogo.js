import React, { useState, useEffect } from 'react'; // Added useEffect
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity, // Added for pressable
  Modal, // Added for the pop-up
  Text, // Added for close button
  Pressable, // Added to close modal on bg press
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { CameraView, useCameraPermissions } from 'expo-camera'; // --- ADDED for scanner

const defaultColor = '#1e40af'; // tailwind-blue-800

/**
 * Interactive QR Code Component
 *
 * (Original props from your code)
 * @prop {string} value - QR payload (URL/text)
 * @prop {number} size - width/height of the *small* QR (default 120)
 * @prop {string} color - dark modules color
 * @prop {string} backgroundColor - QR background color
 * @prop {ImageSource} logo - local require(...) or { uri: '...' }
 * @prop {number} logoSize - size of the center logo
 * @prop {string} ecl - error correction level: L, M, Q, H
 *
 * (New props for modal)
 * @prop {string} modalTitle - Text to display above the large QR (e.g., Patient Name)
 */
export const QrCodeLogo = ({
  value = 'https://example.com',
  size = 120,
  color = defaultColor,
  backgroundColor = 'transparent',
  logo = null,
  logoSize = 32,
  ecl = 'Q',
  modalTitle = 'Patient ID', // Added a prop for the title
}) => {
  const showLogo = !!logo;
  const [isModalVisible, setModalVisible] = useState(false); // State for modal

  // --- New State for Scanner ---
  const [isScannerVisible, setScannerVisible] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [permission, requestPermission] = useCameraPermissions();
  // ------------------------------

  // Reset scanner when modal is closed
  useEffect(() => {
    if (!isModalVisible) {
      setScannerVisible(false);
      setScannedData(null);
    }
  }, [isModalVisible]);

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleSwitchToScanner = async () => {
    setScannedData(null); // Clear previous scan
    let perm;
    if (!permission || permission.status === 'undetermined') {
      perm = await requestPermission();
    } else {
      perm = permission;
    }

    if (perm.granted) {
      setScannerVisible(true);
    } else {
      // Show an error message if permission is denied
      setScannedData({ data: 'Camera permission is required to use the scanner.' });
      setScannerVisible(true); // Still show scanner view, but it will show the message
    }
  };

  const handleBarcodeScanned = ({ data }) => {
    setScannedData({ data });
    // Keep scanner visible to show data
  };

  return (
    <>
      {/* 1. The original component is now pressable */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={[styles.container, { width: size, height: size }]}>
        <QRCode
          value={value}
          size={size}
          color={color}
          backgroundColor={backgroundColor}
          ecl={ecl}
        />

        {showLogo && (
          <View
            style={[
              styles.logoWrapper,
              {
                width: logoSize + 8,
                height: logoSize + 8,
                left: (size - logoSize - 8) / 2,
                top: (size - logoSize - 8) / 2,
              },
            ]}>
            <View
              style={[
                styles.logoBg,
                { width: logoSize + 6, height: logoSize + 6, borderRadius: (logoSize + 6) / 6 },
              ]}
            />
            <Image
              source={logo}
              style={[
                styles.logo,
                { width: logoSize, height: logoSize, borderRadius: logoSize * 0.12 },
              ]}
              resizeMode="contain"
            />
          </View>
        )}
      </TouchableOpacity>

      {/* 2. The new modal component */}
      <Modal
        animationType="fade"
        transparent={true} // This is key for the "blur" overlay
        visible={isModalVisible}
        onRequestClose={handleCloseModal}>
        {/* Full-screen background pressable to close */}
        <Pressable style={styles.modalOverlay} onPress={handleCloseModal}>
          {/* Content container (prevents background press from closing) */}
          <Pressable style={styles.modalContent} onPress={() => {}}>
            {/* --- Conditional Content: My Code vs. Scanner --- */}

            {isScannerVisible ? (
              /* --- SCANNER VIEW --- */
              <>
                <Text style={styles.modalTitle}>Scan QR Code</Text>

                {permission?.granted ? (
                  <View style={styles.cameraContainer}>
                    <CameraView
                      style={styles.camera}
                      onBarcodeScanned={scannedData ? undefined : handleBarcodeScanned} // Stop scanning after one result
                      barcodeScannerSettings={{
                        barcodeTypes: ['qr'],
                      }}
                    />
                  </View>
                ) : (
                  <View style={styles.cameraContainer}>
                    <Text style={styles.permissionText}>Camera permission is required.</Text>
                  </View>
                )}

                {/* Display Scanned Data */}
                {scannedData && (
                  <View style={styles.scannedDataContainer}>
                    <Text style={styles.scannedDataText} numberOfLines={2}>
                      {scannedData.data}
                    </Text>
                  </View>
                )}

                {/* Scanner Actions */}
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    onPress={handleCloseModal}
                    style={[styles.modalButton, styles.closeButton]}>
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setScannerVisible(false)}
                    style={[styles.modalButton, styles.switchButton]}>
                    <Text style={styles.switchButtonText}>Show My Code</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              /* --- "MY CODE" VIEW --- */
              <>
                <Text style={styles.modalTitle}>{modalTitle}</Text>

                <QRCode
                  value={value}
                  size={280} // Larger size for the modal
                  color={color}
                  backgroundColor="white" // Modal QR should have solid bg
                  ecl={ecl}
                />

                {/* My Code Actions */}
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    onPress={handleCloseModal}
                    style={[styles.modalButton, styles.closeButton]}>
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSwitchToScanner}
                    style={[styles.modalButton, styles.switchButton]}>
                    <Text style={styles.switchButtonText}>Switch to Scanner</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  logoWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBg: {
    position: 'absolute',
    backgroundColor: 'white',
    opacity: 0.98,
    elevation: 2,
  },
  logo: {
    zIndex: 2,
  },

  // --- New Modal Styles ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // This creates the "blur" bg
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
    width: '90%', // Set a width for content
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
  },

  // --- Scanner Styles ---
  cameraContainer: {
    width: '100%',
    aspectRatio: 1, // Make it square
    backgroundColor: '#000',
    borderRadius: 16,
    overflow: 'hidden', // Clip the camera view
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  permissionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    padding: 16,
  },
  scannedDataContainer: {
    padding: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    width: '100%',
    marginTop: 8,
  },
  scannedDataText: {
    color: '#111827',
    fontSize: 14,
    textAlign: 'center',
  },

  // --- Button Styles ---
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 24,
  },
  modalButton: {
    flex: 1, // Make buttons share space
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: '#e5e7eb',
    marginRight: 8, // Add spacing
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  switchButton: {
    backgroundColor: defaultColor, // Use the main QR color
    marginLeft: 8, // Add spacing
  },
  switchButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default QrCodeLogo;

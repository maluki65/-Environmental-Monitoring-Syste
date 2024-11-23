#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>
#include <TinyGPS++.h>

// Replace with your WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Replace with your Alchemy endpoint and private key
const char* alchemyEndpoint = "https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY";
const char* privateKey = "YOUR_PRIVATE_KEY";
const char* contractAddress = "YOUR_CONTRACT_ADDRESS";

// Sensor pins
#define DHTPIN 4
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

// GPS setup
HardwareSerial gpsSerial(2);
TinyGPSPlus gps;

void setup() {
  Serial.begin(115200);
  dht.begin();

  gpsSerial.begin(9600, SERIAL_8N1, 16, 17); // RX=16, TX=17 for GPS module
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
}

void loop() {
  // Read temperature and humidity
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();

  // Get GPS data
  while (gpsSerial.available() > 0) {
    gps.encode(gpsSerial.read());
  }

  if (gps.location.isUpdated()) {
    float latitude = gps.location.lat();
    float longitude = gps.location.lng();

    // Prepare payload for the smart contract
    String payload = "{\"jsonrpc\":\"2.0\",\"method\":\"eth_sendTransaction\",\"params\":[{\"from\":\"YOUR_METAMASK_ADDRESS\",\"to\":\"" + String(contractAddress) + "\",\"data\":\"" +
                     generateABIEncodedData(humidity, temperature, latitude, longitude) + "\",\"gas\":\"0x5208\"}],\"id\":1}";

    // Send the data
    if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;
      http.begin(alchemyEndpoint);
      http.addHeader("Content-Type", "application/json");
      int httpResponseCode = http.POST(payload);

      if (httpResponseCode > 0) {
        String response = http.getString();
        Serial.println("Response: " + response);
      } else {
        Serial.println("Error sending data");
      }
      http.end();
    }
  }

  delay(600000); // Send data every 10 minutes
}

// Generate ABI-encoded data for the addData function
String generateABIEncodedData(float humidity, float temperature, float latitude, float longitude) {
  String humidityHex = String((int)(humidity * 100), HEX);
  String temperatureHex = String((int)(temperature * 100), HEX);
  String latitudeHex = String((int)(latitude * 1000000), HEX);
  String longitudeHex = String((int)(longitude * 1000000), HEX);

  return "0xYOUR_FUNCTION_SIGNATURE" + humidityHex + temperatureHex + latitudeHex + longitudeHex;
}
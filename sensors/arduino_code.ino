#include <DHT.h>

#define DHTPIN 2
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  dht.begin();
}

void loop() {
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();
  int airQuality = analogRead(A0);  // MQ135 on A0

  if (!isnan(humidity) && !isnan(temperature)) {
    Serial.print("T:");
    Serial.print(temperature);
    Serial.print(",H:");
    Serial.print(humidity);
    Serial.print(",AQ:");
    Serial.println(airQuality);
  }
  delay(2000);
}

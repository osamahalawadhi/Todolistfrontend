# Verwende ein Node-Image als Basis
FROM node:14

# Setze das Arbeitsverzeichnis innerhalb des Containers
WORKDIR /usr/src/app

# Kopiere die package.json-Datei und die package-lock.json-Datei in das Arbeitsverzeichnis
COPY package*.json ./

# Installiere die Abhängigkeiten
RUN npm install

# Kopiere den Rest des Codes in das Arbeitsverzeichnis
COPY . .

# Baue die Anwendung
RUN npm run build

# Setze den Befehl zum Starten der Anwendung beim Containerstart
CMD ["npm", "run", "serve"]

# Exponiere den Port, auf dem die Anwendung läuft (standardmäßig 8080 für Vue)
EXPOSE 8080

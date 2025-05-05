const fs = require('fs');
const path = require('path');

// Clase Logger
class Logger {
  constructor(logDirectory = './logs') {
    // Directorio donde se guardarán los archivos de log
    this.logDirectory = logDirectory;
    
    // Crear el directorio si no existe
    if (!fs.existsSync(this.logDirectory)) {
      fs.mkdirSync(this.logDirectory);
    }

    // Almacenar los logs por categoría
    this.logsByCategory = {};
  }

  // Función para agregar un log
  log(category, message) {
    const timestamp = new Date().toISOString(); // Obtiene la fecha y hora actual en formato ISO
    const logEntry = `${timestamp} - ${message}\n`;

    // Si la categoría no existe, inicializarla
    if (!this.logsByCategory[category]) {
      this.logsByCategory[category] = [];
    }

    // Agregar el log a la categoría
    this.logsByCategory[category].push(logEntry);

    // También guardarlo en un archivo en el sistema de archivos
    this.saveToFile(category, logEntry);
  }

  // Función para guardar los logs en un archivo
  saveToFile(category, logEntry) {
    const logFilePath = path.join(this.logDirectory, `${category}.log`);

    fs.appendFile(logFilePath, logEntry, (err) => {
      if (err) {
        console.error('Error al escribir el log en el archivo:', err);
      }
    });
  }

  // Función para obtener la fecha del último log de una categoría
  getLastLogDate(category) {
    const logFilePath = path.join(this.logDirectory, `${category}.log`);
    let data = fs.readFileSync(logFilePath).toString()
    let splitData = data.split("\n").filter(a => a!="")
    if (splitData.length == 0) {
      return ""
    }
    return splitData[splitData.length-1].split("T")[0]
  }
}

module.exports = Logger;

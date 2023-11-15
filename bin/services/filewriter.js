const fs = require('fs-extra');

async function writeFileWithContents(filePath, content) {
    if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
            if (err) {
              console.error('Fejl under sletning af fil:', err);
            } else {
              console.log('Filen er slettet.');
            }
          });
    }

    fs.writeFile(filePath, content, (err) => {
        if (err) {
            console.error('Fejl under skrivning til fil:', err);
        } else {
            console.log('Tekst er skrevet til filen.');
        }
    });
}

module.exports = { writeFileWithContents }
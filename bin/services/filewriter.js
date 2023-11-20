const fs = require('fs-extra');

async function writeFileWithContents(filePath, content) {
    if (fs.existsSync(filePath)) {
        // fs.unlink(filePath, (err) => {
        //     if (err) {
        //       console.error(err);
        //     } else {
        //     }
        //   });
        console.log('filepath already exists', filePath)
    }

    await fs.writeFile(filePath, content, (err) => {
        if (err) {
            console.error('error writing to file:', err);
        } else {
        }
    });
}

module.exports = { writeFileWithContents }
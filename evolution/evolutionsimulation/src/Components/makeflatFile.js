const fs = require('fs');
const path = require('path');

const outputFile = 'flatfile.md';
const scriptName = 'makeflatFile.js';

function getLanguageFromExtension(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const languageMap = {
        '.js': 'javascript',
        '.ts': 'typescript',
        '.jsx': 'jsx',
        '.tsx': 'tsx',
        '.html': 'html',
        '.css': 'css',
        '.scss': 'scss',
        '.json': 'json',
        '.md': 'markdown',
        // Add more mappings as needed
    };
    return languageMap[ext] || 'plaintext';
}

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walkDir(file));
        } else {
            results.push(file);
        }
    });
    return results;
}

function compileFlatFile() {
    const currentDir = process.cwd();
    const files = walkDir(currentDir);

    let output = '# Flat File Compilation\n\n';
    let fileCount = 0;

    files.forEach((file) => {
        const baseName = path.basename(file);
        if (baseName !== outputFile && baseName !== scriptName) {
            const relativePath = path.relative(currentDir, file);
            const content = fs.readFileSync(file, 'utf-8');
            const language = getLanguageFromExtension(file);
            output += `## File: ${relativePath}\n\n\`\`\`${language}\n${content}\n\`\`\`\n\n`;
            fileCount++;
        }
    });

    fs.writeFileSync(outputFile, output);
    console.log(`Compiled ${fileCount} files into ${outputFile}`);
}

compileFlatFile();
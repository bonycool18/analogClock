const pug = require('pug');
const fs = require('fs');
const path = require('path');
const {
    execSync
} = require('child_process');
const csso = require('csso'); // Import the csso module
const terser = require('terser'); // Import terser for JS minification

// Create the 'build' folder if it doesn't exist
if (!fs.existsSync('build')) {
    fs.mkdirSync('build');
}

// Function to create empty folders
const createFolder = (folderPath) => {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, {
            recursive: true
        });
    }
};

// Create empty 'css' and 'js' folders
createFolder('build/css');
createFolder('build/js');

// Helper function to copy files from source to destination
const copyFiles = (src, dest) => {
    if (!fs.existsSync(dest)) {
        // Create the destination folder if it doesn't exist
        fs.mkdirSync(dest, {
            recursive: true
        });
    }

    const files = fs.readdirSync(src);

    files.forEach((file) => {
        const srcFile = path.join(src, file);
        const destFile = path.join(dest, file);

        if (fs.statSync(srcFile).isDirectory()) {
            // Recursively copy subdirectories
            copyFiles(srcFile, destFile);
        } else {
            fs.copyFileSync(srcFile, destFile);
        }
    });
};

// Copy Folders in Public to Build Folder
// copyFiles('public/css', 'build/css');
// copyFiles('public/js', 'build/js');
copyFiles('public/fonts', 'build/fonts');
copyFiles('public/images', 'build/images');

// Function to transpile JavaScript files with Babel
const transpileJavaScript = () => {
    try {
        execSync('npx babel public/js --out-dir build/js', {
            stdio: 'inherit'
        });
    } catch (error) {
        console.error('Error transpiling JavaScript with Babel:', error);
    }
};

// Function to minify JavaScript files using Terser
const minifyJavaScript = async () => {
    try {
        const jsFiles = fs.readdirSync('build/js');

        for (const file of jsFiles) {
            const filePath = path.join('build/js', file);

            // Skip files that are already minified (.min.js)
            if (path.extname(file) === '.js' && !file.endsWith('.min.js')) {
                const jsContent = fs.readFileSync(filePath, 'utf-8');

                if (jsContent.trim()) {
                    try {
                        const minifiedResult = await terser.minify(jsContent);

                        if (minifiedResult.error) {
                            throw minifiedResult.error; // Handle minification error
                        }

                        const minifiedJs = minifiedResult.code;
                        const minifiedFilePath = filePath.replace(/\.js$/, '.min.js');

                        // Write the minified JS file
                        fs.writeFileSync(minifiedFilePath, minifiedJs);
                    } catch (minificationError) {
                        console.error(`Error minifying ${filePath}:`, minificationError);
                    }
                } else {
                    console.log(`Skipped empty or whitespace-only file: ${filePath}`);
                }
            } else {
                console.log(`Skipped minified or non-JS file: ${file}`);
            }
        }
    } catch (error) {
        console.error('Error reading JS files for minification:', error);
    }
};

// Function to remove original unminified JavaScript files
const cleanupUnMinifiedFiles = () => {
    try {
        const jsFiles = fs.readdirSync('build/js');
        jsFiles.forEach((file) => {
            const filePath = path.join('build/js', file);
            if (path.extname(file) === '.js' && !filePath.endsWith('.min.js')) {
                try {
                    fs.unlinkSync(filePath);
                } catch (error) {
                    console.error(`Error removing file ${filePath}:`, error);
                }
            }
        });
    } catch (error) {
        console.error('Error during cleanup of unminified JS files:', error);
    }
};

// Define pages and their variables
const pages = [{
    file: 'index.pug',
    output: 'build/index.html',
    variables: {
        title: 'Home',
        description: 'Description of Homepage',
        pageClass: "homePage",
        cssFile: "style.min.css",
        jsFile: "script.min.js",
        fileExtension: ".html",
    }
}, ];

// Compile each Pug file with its respective variables
pages.forEach((page) => {
    const compiledHtml = pug.renderFile(`views/${page.file}`, {
        ...page.variables,
    }); // pretty: true,
    fs.writeFileSync(page.output, compiledHtml);
});

// Compile SASS to CSS
// execSync('sass public/scss/style.scss build/css/style.css', { stdio: 'inherit' }); // build/css/style.css

// Minify CSS using csso
const css = fs.readFileSync('public/css/style.css', 'utf-8');
const minifiedCss = csso.minify(css).css;
fs.writeFileSync('build/css/style.min.css', minifiedCss);

// Run the functions in sequence
transpileJavaScript();
minifyJavaScript().catch(console.error);
cleanupUnMinifiedFiles();
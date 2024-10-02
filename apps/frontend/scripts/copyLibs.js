const fs = require('fs');
const path = require('path');
const fsp = fs.promises;

async function copyDir(src, dest) {
  await fsp.mkdir(dest, { recursive: true });
  const entries = await fsp.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fsp.copyFile(srcPath, destPath);
    }
  }
}

async function copyLibs() {
  const chartingLibrarySrc = path.resolve(
    __dirname,
    '../../../node_modules/@sovryn/charting-library/public/charting_library',
  );
  const chartingLibraryDest = path.resolve(
    __dirname,
    '../public/charting_library',
  );

  const datafeedsSrc = path.resolve(
    __dirname,
    '../../../node_modules/@sovryn/charting-library/public/datafeeds',
  );
  const datafeedsDest = path.resolve(__dirname, '../public/datafeeds');

  if (fs.existsSync(chartingLibrarySrc)) {
    if (!fs.existsSync(chartingLibraryDest)) {
      await copyDir(chartingLibrarySrc, chartingLibraryDest);
      console.log('Charting Library copied.');
    }
  } else {
    console.error('Charting Library source not found.');
  }

  if (fs.existsSync(datafeedsSrc)) {
    if (!fs.existsSync(datafeedsDest)) {
      await copyDir(datafeedsSrc, datafeedsDest);
      console.log('Datafeeds copied.');
    }
  } else {
    console.error('Datafeeds source not found.');
  }
}

copyLibs();

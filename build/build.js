const fs = require("fs");
const { join } = require("path");

async function deleteFiles(path) {
  if (!fs.existsSync(path)) {
    console.warn(new Error("路径不存在。"));
    return;
  }
  const files = await fs.readdirSync(path);
  if (files && files.length) {
    for (const fileName of files) {
      if (fileName.startsWith(".")) {
        continue;
      }
      const p = join(path, fileName);
      const f = fs.lstatSync(p);
      if (f.isFile()) {
        fs.unlinkSync(p);
      }
      if (f.isDirectory()) {
        await deleteFiles(p);
        fs.rmdirSync(p);
      }
    }
  }
}

async function moveFiles(oldPath, newPath) {
  if (!fs.existsSync(oldPath) || !fs.existsSync(newPath)) {
    console.warn(new Error("路径不存在。"));
    return;
  }
  const files = await fs.readdirSync(oldPath);
  if (files && files.length) {
    files.forEach(async (fileName) => {
      const oldFile = join(oldPath, fileName);
      const f = fs.lstatSync(oldFile);
      if (f.isFile()) {
        const newFile = join(newPath, fileName);
        fs.copyFileSync(oldFile, newFile);
      }
      if (f.isDirectory()) {
        const oldDir = join(oldPath, fileName);
        const newDir = join(newPath, fileName);
        if (!fs.existsSync(newDir)) {
          await fs.mkdirSync(newDir);
        }
        moveFiles(oldDir, newDir);
      }
    });
  }
}

const oldPath = join(__dirname, "../dist");
const newPath = join(__dirname, "../../shellingfordly.io");

deleteFiles(newPath).then(() => {
  moveFiles(oldPath, newPath);
});

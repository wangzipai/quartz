import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 递归遍历目录找到所有.md文件
function findMarkdownFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findMarkdownFiles(filePath, fileList);
    } else if (path.extname(file) === '.md') {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// 将日期格式从 "YYYY-MM-DD HH:MM" 转换为 ISO 8601 格式 "YYYY-MM-DDTHH:MM:00+08:00"
function formatDate(dateStr) {
  if (!dateStr) return '';

  // 如果已经是ISO格式，直接返回
  if (dateStr.includes('T')) return dateStr;

  // 处理 "YYYY-MM-DD HH:MM" 格式
  const match = dateStr.match(/(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})/);
  if (match) {
    return `${match[1]}T${match[2]}:00+08:00`;
  }
  
  // 如果只有日期没有时间，添加时间
  const dateMatch = dateStr.match(/(\d{4}-\d{2}-\d{2})/);
  if (dateMatch) {
    return `${dateMatch[1]}T00:00:00+08:00`;
  }

  return dateStr;
}

// 修改文件的frontmatter
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // 检查文件是否有frontmatter
    if (content.startsWith('---')) {
      const frontmatterEndIndex = content.indexOf('---', 3);
      if (frontmatterEndIndex !== -1) {
        const frontmatter = content.substring(0, frontmatterEndIndex + 3);
        let newFrontmatter = frontmatter;

        // 替换 date created 为 created
        if (newFrontmatter.includes('date created:')) {
          const dateCreatedMatch = newFrontmatter.match(/date created:\s*(.*?)(\n|$)/);
          if (dateCreatedMatch) {
            const formattedDate = formatDate(dateCreatedMatch[1].trim());
            newFrontmatter = newFrontmatter.replace(
              /date created:\s*(.*?)(\n|$)/,
              `created: "${formattedDate}"$2`
            );
            modified = true;
          }
        }
        // 处理已有的created字段但没有引号的情况
        else if (newFrontmatter.includes('created:')) {
          const dateCreatedMatch = newFrontmatter.match(/created:\s*(.*?)(\n|$)/);
          if (dateCreatedMatch && !dateCreatedMatch[1].includes('"')) {
            const formattedDate = formatDate(dateCreatedMatch[1].trim());
            newFrontmatter = newFrontmatter.replace(
              /created:\s*(.*?)(\n|$)/,
              `created: "${formattedDate}"$2`
            );
            modified = true;
          }
        }

        // 替换 date updated 为 updated
        if (newFrontmatter.includes('date updated:')) {
          const dateUpdatedMatch = newFrontmatter.match(/date updated:\s*(.*?)(\n|$)/);
          if (dateUpdatedMatch) {
            const formattedDate = formatDate(dateUpdatedMatch[1].trim());
            newFrontmatter = newFrontmatter.replace(
              /date updated:\s*(.*?)(\n|$)/,
              `updated: "${formattedDate}"$2`
            );
            modified = true;
          }
        }
        // 处理已有的updated字段但没有引号的情况
        else if (newFrontmatter.includes('updated:')) {
          const dateUpdatedMatch = newFrontmatter.match(/updated:\s*(.*?)(\n|$)/);
          if (dateUpdatedMatch && !dateUpdatedMatch[1].includes('"')) {
            const formattedDate = formatDate(dateUpdatedMatch[1].trim());
            newFrontmatter = newFrontmatter.replace(
              /updated:\s*(.*?)(\n|$)/,
              `updated: "${formattedDate}"$2`
            );
            modified = true;
          }
        }

        if (modified) {
          // 更新文件内容
          content = content.replace(frontmatter, newFrontmatter);
          fs.writeFileSync(filePath, content, 'utf8');
          console.log(`已修复: ${filePath}`);
        }
      }
    }
  } catch (error) {
    console.error(`处理文件 ${filePath} 时出错:`, error);
  }
}

// 主函数
function main() {
  // 处理多个目录
  const directories = [
    path.join(__dirname, 'content'),
    '/Users/wyq/Documents/ROOT'
  ];
  
  let totalFiles = 0;
  
  // 处理每个目录
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      console.error(`找不到目录: ${dir}`);
      return;
    }
    
    console.log(`开始处理目录: ${dir}`);
    const markdownFiles = findMarkdownFiles(dir);
    console.log(`在 ${dir} 中找到 ${markdownFiles.length} 个Markdown文件`);
    
    markdownFiles.forEach(file => {
      processFile(file);
    });
    
    totalFiles += markdownFiles.length;
  });

  console.log(`完成! 总共处理了 ${totalFiles} 个文件`);
}

main(); 
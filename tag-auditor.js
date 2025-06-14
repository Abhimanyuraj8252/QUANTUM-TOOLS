// QUANTUM TOOLS Tag Audit Tool
// This script will generate a report of all tagged vs. untagged pages

const fs = require('fs');
const path = require('path');
const glob = require('glob');

class TagAuditor {
    constructor() {
        this.rootDir = __dirname;
        this.reportFile = path.join(this.rootDir, 'tag-audit-report.html');
        this.results = {
            totalPages: 0,
            taggedPages: 0,
            untaggedPages: 0,
            taggedPagesList: [],
            untaggedPagesList: []
        };
    }
    
    // Find all HTML files in the directory structure
    findAllHTMLFiles() {
        return new Promise((resolve, reject) => {
            glob('**/*.html', { cwd: this.rootDir }, (err, files) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(files);
                }
            });
        });
    }
    
    // Check if file has tag manager code
    checkTagStatus(file) {
        const filePath = path.join(this.rootDir, file);
        
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, 'utf8', (err, content) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                const isTagged = content.includes('tag-manager.js') || 
                                content.includes('tag-manager-ui.js') || 
                                content.includes('tag-manager-styles.css');
                
                // Get page title
                let title = file;
                const titleMatch = content.match(/<title[^>]*>([^<]+)<\/title>/i);
                if (titleMatch && titleMatch[1]) {
                    title = titleMatch[1];
                }
                
                resolve({
                    file,
                    title,
                    isTagged
                });
            });
        });
    }
    
    // Process a single file and collect results
    async processFile(file) {
        try {
            const result = await this.checkTagStatus(file);
            this.results.totalPages++;
            
            if (result.isTagged) {
                this.results.taggedPages++;
                this.results.taggedPagesList.push(result);
            } else {
                this.results.untaggedPages++;
                this.results.untaggedPagesList.push(result);
            }
            
            return result;
        } catch (err) {
            console.error(`Error checking tag status for ${file}:`, err.message);
            return {
                file,
                title: file,
                isTagged: false,
                error: err.message
            };
        }
    }
    
    // Generate HTML report
    generateReport() {
        const timestamp = new Date().toLocaleString();
        const taggingPercentage = (this.results.taggedPages / this.results.totalPages * 100).toFixed(1);
        
        let html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QUANTUM TOOLS - Tag Audit Report</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        h1, h2, h3 {
            color: #2196F3;
        }
        .report-header {
            background-color: #f5f5f5;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            border-left: 5px solid #2196F3;
        }
        .summary {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 30px;
        }
        .summary-card {
            background-color: white;
            border-radius: 5px;
            padding: 15px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            flex: 1 0 200px;
            text-align: center;
        }
        .summary-card h3 {
            margin-top: 0;
            margin-bottom: 10px;
        }
        .summary-card .number {
            font-size: 2.5em;
            font-weight: bold;
            margin: 10px 0;
        }
        .tagged {
            border-top: 4px solid #4caf50;
        }
        .untagged {
            border-top: 4px solid #f44336;
        }
        .total {
            border-top: 4px solid #2196F3;
        }
        .percentage {
            border-top: 4px solid #ff9800;
        }
        .page-list {
            margin: 20px 0;
            border: 1px solid #ddd;
            border-radius: 5px;
            overflow: hidden;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #f5f5f5;
            font-weight: bold;
        }
        tr:hover {
            background-color: #f9f9f9;
        }
        .status {
            padding: 5px 10px;
            border-radius: 3px;
            font-weight: bold;
            text-align: center;
            display: inline-block;
            min-width: 80px;
        }
        .status.tagged {
            background-color: #e8f5e9;
            color: #2e7d32;
        }
        .status.untagged {
            background-color: #ffebee;
            color: #c62828;
        }
        .actions {
            margin: 30px 0;
            display: flex;
            gap: 10px;
        }
        .actions button {
            background-color: #2196F3;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
        }
        .actions button:hover {
            background-color: #0b7dda;
        }
        .actions .fix-all {
            background-color: #4caf50;
        }
        .actions .fix-all:hover {
            background-color: #388e3c;
        }
        footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="report-header">
        <h1>QUANTUM TOOLS - Tag Audit Report</h1>
        <p>Generated on: ${timestamp}</p>
    </div>
    
    <div class="summary">
        <div class="summary-card total">
            <h3>Total Pages</h3>
            <div class="number">${this.results.totalPages}</div>
        </div>
        <div class="summary-card tagged">
            <h3>Tagged Pages</h3>
            <div class="number">${this.results.taggedPages}</div>
        </div>
        <div class="summary-card untagged">
            <h3>Untagged Pages</h3>
            <div class="number">${this.results.untaggedPages}</div>
        </div>
        <div class="summary-card percentage">
            <h3>Tagging Percentage</h3>
            <div class="number">${taggingPercentage}%</div>
        </div>
    </div>
    
    <div class="actions">
        <button class="refresh-btn" onclick="window.location.reload()">Refresh Report</button>
        <button class="fix-all" onclick="alert('To fix all untagged pages, run: node tag-auto-manager.js')">Fix All Untagged Pages</button>
    </div>
    
    <h2>Untagged Pages (${this.results.untaggedPages})</h2>
    `;
        
        if (this.results.untaggedPagesList.length > 0) {
            html += `
    <div class="page-list">
        <table>
            <thead>
                <tr>
                    <th>File Path</th>
                    <th>Page Title</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
            `;
            
            this.results.untaggedPagesList.forEach(page => {
                html += `
                <tr>
                    <td>${page.file}</td>
                    <td>${page.title}</td>
                    <td><span class="status untagged">Untagged</span></td>
                </tr>
                `;
            });
            
            html += `
            </tbody>
        </table>
    </div>
            `;
        } else {
            html += `<p>Great job! All pages are tagged.</p>`;
        }
        
        html += `
    <h2>Tagged Pages (${this.results.taggedPages})</h2>
    <div class="page-list">
        <table>
            <thead>
                <tr>
                    <th>File Path</th>
                    <th>Page Title</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
        `;
        
        this.results.taggedPagesList.forEach(page => {
            html += `
            <tr>
                <td>${page.file}</td>
                <td>${page.title}</td>
                <td><span class="status tagged">Tagged</span></td>
            </tr>
            `;
        });
        
        html += `
            </tbody>
        </table>
    </div>
    
    <footer>
        <p>QUANTUM TOOLS Tag Audit Report - Run the audit periodically to ensure all pages are properly tagged.</p>
        <p>To automatically add tags to all pages, run: <code>node tag-auto-manager.js</code></p>
    </footer>
</body>
</html>
        `;
        
        return html;
    }
    
    // Save report to file
    saveReport(html) {
        return new Promise((resolve, reject) => {
            fs.writeFile(this.reportFile, html, 'utf8', err => {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.reportFile);
                }
            });
        });
    }
    
    // Run the audit
    async runAudit() {
        try {
            console.log('Starting tag audit...');
            
            // Find all HTML files
            const files = await this.findAllHTMLFiles();
            console.log(`Found ${files.length} HTML files to audit`);
            
            // Process each file
            for (const file of files) {
                await this.processFile(file);
                process.stdout.write(`Processed: ${this.results.totalPages}/${files.length}\r`);
            }
            
            console.log(`\nAudit complete. Tagged: ${this.results.taggedPages}, Untagged: ${this.results.untaggedPages}`);
            
            // Generate and save report
            const reportHtml = this.generateReport();
            const reportPath = await this.saveReport(reportHtml);
            
            console.log(`Report saved to: ${reportPath}`);
            console.log(`Open this file in your browser to view the full report.`);
            
        } catch (err) {
            console.error('Error during audit:', err.message);
        }
    }
}

// Run the auditor
const tagAuditor = new TagAuditor();
tagAuditor.runAudit();

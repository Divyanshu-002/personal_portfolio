import { Router } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const resumePath = path.join(__dirname, '../assets/resume.pdf');

router.get('/', (req, res) => {
  if (!fs.existsSync(resumePath)) {
    const placeholder = generatePlaceholderPdf();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=Divyanshu_Resume.pdf');
    return res.send(placeholder);
  }

  res.download(resumePath, 'Divyanshu_Resume.pdf');
});

function generatePlaceholderPdf() {
  const content = `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj
4 0 obj<</Length 120>>stream
BT /F1 24 Tf 72 720 Td (Divyanshu - Resume) Tj 0 -40 Td /F1 12 Tf (Replace server/assets/resume.pdf with your resume) Tj ET
endstream endobj
5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj
xref
0 6
trailer<</Size 6/Root 1 0 R>>
startxref
400
%%EOF`;
  return Buffer.from(content);
}

export default router;

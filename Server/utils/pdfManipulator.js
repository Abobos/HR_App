import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';

import fs from 'fs';
import path from 'path';
import { InternalServerError } from '../exceptions';

// documentName, pageNumber, embeddedType, width, height, imageType, fileName, text

const pdfManipulator = async (
  documentName,
  pageNumber,
  embeddedType,
  imageType,
  widthPlacement,
  heightPlacement,
  fileName,
) => {
  // This should be a Uint8Array or ArrayBuffer
  // This data can be obtained in a number of different ways
  // If your running in a Node environment, you could use fs.readFile()
  // In the browser, you could make a fetch() call and use res.arrayBuffer()
  try {
    const baseDir = path.join(__dirname, '../../uploads', documentName);

    const existingPdfBytes = fs.readFileSync(baseDir);

    // Load a PDFDocument from the existing PDF bytes
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // Draw a string of text diagonally across the first page
    if (embeddedType === 'text') {
      // console.log(pdfDoc);
      // Embed the Helvetica font
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

      // Get the first page of the document
      const pages = pdfDoc.getPages();

      const firstPage = pages[pageNumber];

      // Get the width and height of the first page
      const { width, height } = firstPage.getSize();

      firstPage.drawText(text, {
        x: widthPlacement,
        y: heightPlacement,
        size: 20,
        font: helveticaFont,
        color: black,
        rotate: degrees(-45),
      });
    }

    if (embeddedType === 'image') {
      // This data can be obtained in a number of different ways
      // If your running in a Node environment, you could use fs.readFile()
      // In the browser, you could make a fetch() call and use res.arrayBuffer()

      const baseDirII = path.join(__dirname, '../../uploads', fileName);

      const ImageBytes = fs.readFileSync(baseDirII);

      let image =
        imageType === 'image/jpeg'
          ? await pdfDoc.embedJpg(ImageBytes)
          : await pdfDoc.embedPng(ImageBytes);
      // Embed the JPG image bytes and PNG image bytes

      // Get the width/height of the JPG image scaled down to 25% of its original size
      const ImgDims = image.scale(0.5);

      // Get the width/height of the PNG image scaled down to 50% of its original size

      // Get the first page of the document
      const pages = pdfDoc.getPages();

      const firstPage = pages[pageNumber];

      // Draw the JPG image in the center of the page
      firstPage.drawImage(image, {
        x: widthPlacement,
        y: heightPlacement,
        width: ImgDims.width,
        height: ImgDims.height,
      });
    }
    // These should be
    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save();

    // For example, `pdfBytes` can be:
    //   • Written to a file in Node
    //   • Downloaded from the browser
    //   • Rendered in an <iframe>

    const baseDirIII = path.join(__dirname, '../../signedDocs', documentName);

    fs.writeFileSync(baseDirIII, pdfBytes, {
      encoding: 'base64',
    });
  } catch (e) {
    throw new InternalServerError(e);
  }
};

export default pdfManipulator;

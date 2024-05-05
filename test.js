const generatePDF = async (name) => {
    const certificateNumber = "RKCER" + Math.floor(10000000 + Math.random() * 90000000); // Generate random 8-digit number starting with "RKCER"
    
    const existingPdfBytes = await fetch("./cert.pdf").then((res) =>
      res.arrayBuffer()
    );
  
    // Load a PDFDocument from the existing PDF bytes
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    pdfDoc.registerFontkit(fontkit);
  
    //get font
    const fontBytes = await fetch("./Sanchez-Regular.ttf").then((res) =>
      res.arrayBuffer()
    );
  
    // Embed our custom font in the document
    const SanChezFont = await pdfDoc.embedFont(fontBytes);
  
    // Get the first page of the document
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
  
    // Draw certificate number
    firstPage.drawText(certificateNumber, {
      x: 50,
      y: 50,
      size: 12,
      font: SanChezFont,
      color: rgb(0, 0, 0), // Black color
    });
  
    // Draw a string of text diagonally across the first page
    firstPage.drawText(name, {
      x: 300,
      y: 270,
      size: 46,
      font: SanChezFont,
      color: rgb(0.2, 0.84, 0.67),
    });
  
    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save();
    console.log("Done creating");
  
    var file = new File(
      [pdfBytes],
      "RK INSTITUION Certificate.pdf",
      {
        type: "application/pdf;charset=utf-8",
      }
    );
    saveAs(file);
  };
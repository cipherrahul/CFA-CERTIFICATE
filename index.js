const userName = document.getElementById("name");
const submitBtn = document.getElementById("submitBtn");
const { PDFDocument, rgb, degrees } = PDFLib;
const capitalize = (str, lower = false) =>
  (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, (match) =>
    match.toUpperCase()
  );

submitBtn.addEventListener("click", () => {
  const val = capitalize(userName.value);
  //check if the text is empty or not
  if (val.trim() !== "" && userName.checkValidity()) {
    // console.log(val);
    generatePDF(val);
  } else {
    userName.reportValidity();
  }
});

const generatePDF = async (name) => {
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
  const certificateNumber =
    "RKCER" + Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  // Draw the certificate number
  firstPage.drawText(certificateNumber, {
    x: 168,
    y: 227, // Adjust position as needed
    size: 12, // Adjust size as needed
    font: SanChezFont,
    color: rgb(0, 0, 0),
  });
  // Draw a string of text diagonally across the first page
  firstPage.drawText(name, {
    x: 412, //290
    y: 267,
    size: 32,
    font: SanChezFont,
    color: rgb(0.2, 0.84, 0.67),
  });
  
  // Add current date
  const currentDate = new Date().toLocaleDateString();
  firstPage.drawText(currentDate, {
    x: 678,
    y: 142,
    size: 12,
    font: SanChezFont,
    color: rgb(0, 0, 0),
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

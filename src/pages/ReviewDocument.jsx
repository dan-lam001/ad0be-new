import React, { useState } from 'react';
import jsPDF from 'jspdf';

const ReviewDocument = () => {
  const [showPreview, setShowPreview] = useState(false);

  const handleDownload = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();

    // Header - Adobe logo and text
    doc.addImage('/adobe-logo.png', 'PNG', 15, 15, 15, 15);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Adobe Acrobat Sign', 35, 26);

    // Adobe red logo on the right
    doc.addImage('/adobe-red-logo.png', 'PNG', 165, 10, 25, 30);

    // Main message
    doc.setFontSize(22);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    const mainText = 'Dr Aaima sent you a document to review.';
    const textWidth = doc.getStringUnitWidth(mainText) * 22 / doc.internal.scaleFactor;
    doc.text(mainText, (pageWidth - textWidth) / 2, 60);

    // Blue button (clickable)
    doc.setDrawColor(0, 120, 212);
    doc.setLineWidth(2);
    doc.roundedRect((pageWidth / 2) - 50, 72, 100, 16, 8, 8, 'S');

    // Button text with link
    doc.setTextColor(0, 120, 212);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    const buttonText = 'Review Projects Pictures Here';
    const buttonTextWidth = doc.getStringUnitWidth(buttonText) * 14 / doc.internal.scaleFactor;
    doc.textWithLink(buttonText, (pageWidth - buttonTextWidth) / 2, 82, { url: 'https://adobe-pdf-reader.vercel.app/' });

    // Horizontal line
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(15, 105, pageWidth - 15, 105);

    // After sign in text
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('After you sign in, you will receive a PDF copy by email.', 15, 120);

    // Powered by section
    doc.addImage('/adobe-logo.png', 'PNG', 15, 135, 12, 12);
    doc.setFontSize(12);
    doc.text('Powered by', 32, 142);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Adobe Acrobat Sign', 32, 148);

    // Agreement text
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('By proceeding, you agree that this agreement may be signed', 15, 170);
    doc.text('using electronic or handwritten signatures.', 15, 178);

    // Email instruction
    doc.text('To ensure that you continue receiving our emails, please add', 15, 195);
    doc.setTextColor(0, 120, 212);
    doc.textWithLink('adobesign@adobesign.com', 15, 203, { url: 'mailto:' });
    doc.setTextColor(0, 0, 0);
    doc.text('to your address book or safe list.', 70, 203);

    // Footer links
    doc.setTextColor(0, 120, 212);
    doc.setFont('helvetica', 'bold');
    const termsText = 'Terms of Use';
    const termsWidth = doc.getStringUnitWidth(termsText) * 12 / doc.internal.scaleFactor;
    const reportText = 'Report Abuse';
    const reportWidth = doc.getStringUnitWidth(reportText) * 12 / doc.internal.scaleFactor;
    const totalLinksWidth = termsWidth + reportWidth + 10; // 10mm for " | "
    const startX = (pageWidth - totalLinksWidth) / 2;
    
    doc.textWithLink(termsText, startX, 220, { url: '#' });
    doc.setTextColor(0, 0, 0);
    doc.text('|', startX + termsWidth + 3, 220);
    doc.setTextColor(0, 120, 212);
    doc.textWithLink(reportText, startX + termsWidth + 7, 220, { url: '#' });

    // Copyright
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.text('© 2026 Adobe. All rights reserved.', 15, 235);

    // Virus-free section
    doc.addImage('/virus-free.png', 'PNG', 15, 245, 12, 12);
    doc.setTextColor(0, 166, 80);
    doc.setFontSize(14);
    doc.text('virus-free', 32, 253);

    doc.save('review_document.pdf');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg" style={{ color: '#404040' }}>
      <div className="flex justify-between items-center mb-4">
        <div className='flex items-center mt-3'>
          <img src="/adobe-logo.png" alt="Adobe Logo" className="h-8 mr-2" />
          <span className="text-xl font-bold">Adobe Acrobat Sign</span>
        </div>
        <img src="/adobe-red-logo.png" alt="Adobe" className='h-[100px]' />
      </div>
      
      <p className="text-center text-2xl mb-10">Ben Lordon sent you a document to review.</p>
      
      <div className="w-[45%] mx-auto mb-10">
        <a
          href="http://localhost:5173/"
          className="flex justify-center p-2 underline border-2 border-blue-500 text-blue-500 text-center rounded-3xl font-bold"
        >
          Review Projects Pictures Here
        </a>
      </div>
      
      <div className="border-b-2 border-black w-full mb-10"></div>
      
      <p className="mt-4">After you sign in, you will receive a PDF copy by email.</p>
      
      <div className="my-10 flex items-center">
        <img src="/adobe-logo.png" alt="Adobe Sign Logo" className="h-12 mr-2" />
        <div>
          <p className="font-bold text-md">Powered by</p>
          <p className="text-xl font-bold">Adobe Acrobat Sign</p>
        </div>
      </div>
      
      <p className="mt-4 mb-8">By proceeding, you agree that this agreement may be signed using electronic or handwritten signatures.</p>
      
      <p className="mt-2">To ensure that you continue receiving our emails, please add{' '}
        <a href="mailto:adobesign@adobesign.com" className="text-[#0078D4] hover:underline">adobesign@adobesign.com</a>{' '}
        to your address book or safe list.
      </p>
      
      <div className="mt-4 flex justify-center">
        <a href="#" className="text-[#0078D4] hover:underline font-bold mr-2">Terms of Use</a>
        <span className="mr-2">|</span>
        <a href="#" className="text-[#0078D4] hover:underline font-bold">Report Abuse</a>
      </div>
      
      <p className="mt-4">© 2024 Adobe. All rights reserved.</p>
      
      <div className="flex items-center text-xl mt-5 text-[#00A650]">
        <img src="/virus-free.png" alt="Virus Free" className="h-12 mr-2" />
        <span>virus-free</span>
      </div>
      
      <div className="mt-4">
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="bg-[#0078D4] text-white px-4 py-2 rounded hover:bg-[#005BB5] mr-2"
        >
          {showPreview ? 'Hide Preview' : 'Show Preview'}
        </button>
        <button
          onClick={handleDownload}
          className="bg-[#00A650] text-white px-4 py-2 rounded hover:bg-[#00843D]"
        >
          Download PDF
        </button>
      </div>
      
      {showPreview && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p className="text-gray-700">Preview of the document content will be displayed here.</p>
        </div>
      )}
    </div>
  );
};

export default ReviewDocument;
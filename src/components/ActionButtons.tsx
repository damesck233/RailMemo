'use client';

import { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { TicketFormData } from '@/types/ticket';
import { processTemplate, getTemplateHTML } from '@/lib/templateProcessor';

interface ActionButtonsProps {
  onGenerate: () => void;
  ticketQueue: TicketFormData[];
}

export default function ActionButtons({ onGenerate, ticketQueue }: ActionButtonsProps) {
  const [isExporting, setIsExporting] = useState(false);





  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      
      if (ticketQueue.length === 0) {
        alert('候补列表为空，请先生成车票');
        return;
      }

      // 获取模板HTML
      const templateHTML = await getTemplateHTML();
      
      // A4纸张尺寸（毫米）
      const a4Width = 210;
      const a4Height = 297;
      
      // 火车票实际尺寸（毫米）
      const ticketWidth = 86;
      const ticketHeight = 54;
      
      // 计算在A4纸上的排版
      const cols = Math.floor(a4Width / (ticketWidth + 4)); // 2列，留4mm间距
      const rows = Math.floor(a4Height / (ticketHeight + 4)); // 5行，留4mm间距
      const ticketsPerPage = cols * rows;
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // 计算起始位置（居中）
      const startX = (a4Width - (cols * ticketWidth + (cols - 1) * 4)) / 2;
      const startY = (a4Height - (rows * ticketHeight + (rows - 1) * 4)) / 2;

      // 创建临时容器用于渲染车票
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '-9999px';
      tempContainer.style.width = '1810px';
      tempContainer.style.height = '1140px';
      document.body.appendChild(tempContainer);

      try {
        for (let ticketIndex = 0; ticketIndex < ticketQueue.length; ticketIndex++) {
          const ticket = ticketQueue[ticketIndex];
          
          // 处理模板
          const processedHTML = processTemplate(templateHTML, ticket);
          tempContainer.innerHTML = processedHTML;

          // 等待DOM渲染完成
          await new Promise(resolve => setTimeout(resolve, 200));

          // 生成canvas
          const canvas = await html2canvas(tempContainer, {
            scale: 1,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            width: 1810,
            height: 1140,
            logging: true,
            onclone: (clonedDoc) => {
              // 处理背景图片，确保能正确渲染
              const elements = clonedDoc.querySelectorAll('*');
              elements.forEach(el => {
                const style = window.getComputedStyle(el);
                if (style.backgroundImage && style.backgroundImage !== 'none') {
                  (el as HTMLElement).style.backgroundImage = style.backgroundImage;
                }
              });
            }
          });

          const imgData = canvas.toDataURL('image/png');
          
          // 计算当前车票在页面上的位置
          const pageIndex = Math.floor(ticketIndex / ticketsPerPage);
          const positionInPage = ticketIndex % ticketsPerPage;
          const row = Math.floor(positionInPage / cols);
          const col = positionInPage % cols;
          
          // 如果需要新页面
          if (ticketIndex > 0 && positionInPage === 0) {
            pdf.addPage();
          }
          
          const x = startX + col * (ticketWidth + 4);
          const y = startY + row * (ticketHeight + 4);
          
          pdf.addImage(imgData, 'PNG', x, y, ticketWidth, ticketHeight);
        }
      } finally {
        // 清理临时容器
        document.body.removeChild(tempContainer);
      }

      // 下载PDF
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      pdf.save(`火车票批量_${ticketQueue.length}张_${timestamp}.pdf`);
      
    } catch (error) {
      console.error('导出PDF失败:', error);
      alert('导出PDF失败，请重试');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800 tracking-tight">操作区域</h2>
      
      <div className="space-y-3">
        <button
          onClick={onGenerate}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-2 text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>生成车票</span>
        </button>

        <button
          onClick={handleExportPDF}
          disabled={isExporting || ticketQueue.length === 0}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:hover:scale-100 transition-all duration-200 flex items-center justify-center space-x-2 text-sm"
        >
          {isExporting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>导出中...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>导出PDF ({ticketQueue.length})</span>
            </>
          )}
        </button>
      </div>

      <div className="bg-blue-50/80 border border-blue-200/50 rounded-xl p-3 backdrop-blur-sm">
        <p className="text-xs text-blue-800 font-medium leading-relaxed">
          <strong>使用说明：</strong>填写车票信息后点击"生成车票"添加到候补列表，可生成多张车票，最后点击"导出PDF"一次性导出所有车票。
        </p>
      </div>
    </div>
  );
}
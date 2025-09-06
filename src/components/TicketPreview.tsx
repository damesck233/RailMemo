'use client';

import { useEffect, useState } from 'react';
import { TicketData } from '@/types/ticket';
import { processTemplate, getTemplateHTML } from '@/lib/templateProcessor';

interface TicketPreviewProps {
  ticketData: TicketData;
}

export default function TicketPreview({ ticketData }: TicketPreviewProps) {
  const [processedHTML, setProcessedHTML] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadAndProcessTemplate = async () => {
      try {
        setLoading(true);
        setError('');

        const templateHTML = await getTemplateHTML();
        const processed = processTemplate(templateHTML, ticketData);
        setProcessedHTML(processed);
      } catch (err) {
        console.error('Error processing template:', err);
        setError('加载模板失败，请检查模板文件是否存在');
      } finally {
        setLoading(false);
      }
    };

    loadAndProcessTemplate();
  }, [ticketData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 sm:h-80">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-base font-medium">正在加载模板...</p>
        </div>
      </div>
  );
}

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 sm:h-80">
        <div className="text-center">
          <div className="text-red-400 text-2xl mb-4">⚠️</div>
          <p className="text-red-600 text-base font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden mx-auto"
      style={{
        width: 'calc(1810px * 0.15)',
        height: 'calc(1140px * 0.15)',
        display: 'inline-block'
      }}
    >
      <div 
        className="origin-center transition-all duration-300"
        style={{ 
          transform: 'scale(0.15)', 
          transformOrigin: 'top left', 
          lineHeight: 0,
          display: 'block'
        }}
        dangerouslySetInnerHTML={{ __html: processedHTML }}
      />
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { Paper, Text, Loader, Alert, Center } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';
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
      <Center h={320}>
        <div style={{ textAlign: 'center' }}>
          <Loader size="lg" color="blue" mb="md" />
          <Text c="dimmed" fw={500}>正在加载模板...</Text>
        </div>
      </Center>
    );
  }

  if (error) {
    return (
      <Center h={320}>
        <Alert
          icon={<IconAlertTriangle size={16} />}
          title="加载失败"
          color="red"
          radius="md"
        >
          <Text size="sm">{error}</Text>
        </Alert>
      </Center>
    );
  }

  return (
    <Paper
      shadow="md"
      radius="md"
      withBorder
      style={{
        width: 'calc(1810px * 0.15)',
        height: 'calc(1140px * 0.15)',
        display: 'inline-block',
        overflow: 'hidden',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        border: '1px solid #e9ecef'
      }}
    >
      <div 
        style={{ 
          transform: 'scale(0.15)', 
          transformOrigin: 'top left', 
          lineHeight: 0,
          display: 'block',
          transition: 'all 300ms ease'
        }}
        dangerouslySetInnerHTML={{ __html: processedHTML }}
      />
    </Paper>
  );
}
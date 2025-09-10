'use client';

import { useState } from 'react';
import { Button, Group, Paper, Title, Text, Alert, Loader } from '@mantine/core';
import { IconPlus, IconPhoto, IconFileTypePdf, IconInfoCircle } from '@tabler/icons-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import JSZip from 'jszip';
import { TicketFormData } from '@/types/ticket';
import { processTemplate, getTemplateHTML } from '@/lib/templateProcessor';

interface ActionButtonsProps {
  onGenerate: () => void;
  ticketQueue: TicketFormData[];
}

export default function ActionButtons({ onGenerate, ticketQueue }: ActionButtonsProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingImages, setIsExportingImages] = useState(false);

  const handleExportImages = async () => {
    try {
      setIsExportingImages(true);

      if (ticketQueue.length === 0) {
        alert('候补列表为空，请先生成车票');
        return;
      }

      // 获取模板HTML
      const templateHTML = await getTemplateHTML(ticketQueue[0].templateId);

      // 创建临时容器用于渲染车票
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '-9999px';
      tempContainer.style.width = '1810px';
      tempContainer.style.height = '1140px';
      document.body.appendChild(tempContainer);

      try {
        if (ticketQueue.length === 1) {
          // 单张车票直接下载PNG
          const ticket = ticketQueue[0];
          const processedHTML = processTemplate(templateHTML, ticket, ticket.templateId);
          // 如果票据有不同的模板，需要重新获取模板
          if (ticket.templateId && ticket.templateId !== ticketQueue[0].templateId) {
            const ticketTemplateHTML = await getTemplateHTML(ticket.templateId);
            tempContainer.innerHTML = processTemplate(ticketTemplateHTML, ticket, ticket.templateId);
          }
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
            logging: false,
            onclone: (clonedDoc) => {
              const elements = clonedDoc.querySelectorAll('*');
              elements.forEach(el => {
                const style = window.getComputedStyle(el);
                if (style.backgroundImage && style.backgroundImage !== 'none') {
                  (el as HTMLElement).style.backgroundImage = style.backgroundImage;
                }
              });
            }
          });

          // 下载单张图片
          const link = document.createElement('a');
          link.download = `火车票_${ticket.trainNumber}_${ticket.departureStation}到${ticket.arrivalStation}.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();
        } else {
          // 多张车票打包成ZIP
          const zip = new JSZip();

          for (let i = 0; i < ticketQueue.length; i++) {
            const ticket = ticketQueue[i];
            const processedHTML = processTemplate(templateHTML, ticket, ticket.templateId);
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
              logging: false,
              onclone: (clonedDoc) => {
                const elements = clonedDoc.querySelectorAll('*');
                elements.forEach(el => {
                  const style = window.getComputedStyle(el);
                  if (style.backgroundImage && style.backgroundImage !== 'none') {
                    (el as HTMLElement).style.backgroundImage = style.backgroundImage;
                  }
                });
              }
            });

            // 将图片添加到ZIP
            const imgData = canvas.toDataURL('image/png').split(',')[1];
            zip.file(`火车票_${ticket.trainNumber}_${ticket.departureStation}到${ticket.arrivalStation}.png`, imgData, { base64: true });
          }

          // 下载ZIP文件
          const zipBlob = await zip.generateAsync({ type: 'blob' });
          const link = document.createElement('a');
          link.download = `火车票批量_${ticketQueue.length}张.zip`;
          link.href = URL.createObjectURL(zipBlob);
          link.click();
        }
      } finally {
        // 清理临时容器
        document.body.removeChild(tempContainer);
      }

    } catch (error) {
      console.error('导出图片失败:', error);
      alert('导出图片失败，请重试');
    } finally {
      setIsExportingImages(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);

      if (ticketQueue.length === 0) {
        alert('候补列表为空，请先生成车票');
        return;
      }

      // 获取模板HTML（使用第一张票的模板作为默认）
      const templateHTML = await getTemplateHTML(ticketQueue[0].templateId);

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
          // 如果票据有不同的模板，需要重新获取模板
          let currentTemplateHTML = templateHTML;
          if (ticket.templateId && ticket.templateId !== ticketQueue[0].templateId) {
            currentTemplateHTML = await getTemplateHTML(ticket.templateId);
          }
          const processedHTML = processTemplate(currentTemplateHTML, ticket, ticket.templateId);
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
    <Paper p="lg" radius="md" withBorder>
      <Title order={2} mb="lg" c="dark.8">操作区域</Title>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Button
          onClick={onGenerate}
          leftSection={<IconPlus size={20} />}
          variant="filled"
          color="blue"
          size="lg"
          radius="md"
          fullWidth
          styles={{
            root: {
              height: '48px',
              fontSize: '16px',
              fontWeight: 600
            }
          }}
        >
          生成车票
        </Button>

        <Group grow gap="md">
          <Button
            onClick={handleExportImages}
            disabled={isExportingImages || ticketQueue.length === 0}
            leftSection={isExportingImages ? <Loader size={18} color="white" /> : <IconPhoto size={18} />}
            variant="light"
            color="teal"
            size="md"
            radius="md"
            styles={{
              root: {
                height: '42px',
                fontSize: '14px'
              }
            }}
          >
            {isExportingImages ? '导出中...' : `导出图片 (${ticketQueue.length})`}
          </Button>

          <Button
            onClick={handleExportPDF}
            disabled={isExporting || ticketQueue.length === 0}
            leftSection={isExporting ? <Loader size={18} color="white" /> : <IconFileTypePdf size={18} />}
            variant="light"
            color="red"
            size="md"
            radius="md"
            styles={{
              root: {
                height: '42px',
                fontSize: '14px'
              }
            }}
          >
            {isExporting ? '导出中...' : `导出PDF (${ticketQueue.length})`}
          </Button>
        </Group>
      </div>

      <Alert
        icon={<IconInfoCircle size={16} />}
        title="使用说明"
        color="blue"
        radius="md"
        mt="lg"
      >
        <Text size="xs">
          填写车票信息后点击"生成车票"添加到候补列表，可生成多张车票。支持导出图片（单张PNG或多张ZIP）和PDF格式。
        </Text>
      </Alert>
    </Paper>
  );
}
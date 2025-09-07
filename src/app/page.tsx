'use client';

import { useState } from 'react';
import { Container, Grid, Paper, Title, Text, Alert, Group, Stack, Center, Badge, Divider, Card, Tabs } from '@mantine/core';
import { IconTrain, IconAlertTriangle, IconTicket, IconSettings, IconHistory, IconDownload } from '@tabler/icons-react';
import TicketForm from '@/components/TicketForm';
import TicketPreview from '@/components/TicketPreview';
import ActionButtons from '@/components/ActionButtons';
import { FooterSocial } from '@/components/FooterSocial';
import { TicketFormData } from '@/types/ticket';
import { getDefaultTicketData } from '@/lib/templateProcessor';

export default function Home() {
  const [ticketData, setTicketData] = useState<TicketFormData>(getDefaultTicketData());
  const [ticketQueue, setTicketQueue] = useState<TicketFormData[]>([]);
  const [isGenerated, setIsGenerated] = useState(false);

  const MAX_QUEUE_SIZE = 10;

  const handleDataChange = (data: TicketFormData) => {
    setTicketData(data);
    // 如果有基本信息就显示预览
    if (data.ticketNumber || data.departureStation || data.arrivalStation) {
      setIsGenerated(true);
    } else {
      setIsGenerated(false);
    }
  };

  const handleGenerate = () => {
    if (ticketData.ticketNumber && ticketData.departureStation && ticketData.arrivalStation) {
      if (ticketQueue.length >= MAX_QUEUE_SIZE) {
        alert(`候补列表已满，最多只能添加${MAX_QUEUE_SIZE}张车票`);
        return;
      }

      const newTicket = {
        ...ticketData,
        id: Date.now().toString()
      };
      setTicketQueue(prev => [...prev, newTicket]);
      setIsGenerated(true);
    }
  };

  const handleRemoveTicket = (ticketId: string) => {
    setTicketQueue(prev => prev.filter(ticket => ticket.id !== ticketId));
  };

  const handlePreviewTicket = (ticket: TicketFormData) => {
    setTicketData(ticket);
    setIsGenerated(true);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <FooterSocial />
      


      {/* Main Content */}
      <Container size="xl" pb="xl">
        <Stack gap="xl">
          {/* 主要工作区 */}
          <Grid gutter="xl">
            {/* 左侧：表单输入 */}
            <Grid.Col span={{ base: 12, lg: 5 }}>
              <Card shadow="xs" padding="lg" radius="md" withBorder>
                <Group mb="md" justify="space-between">
                  <Title order={4} c="dark.7">
                    车票信息
                  </Title>
                  <Badge variant="light" color="blue">
                    快速填写
                  </Badge>
                </Group>
                <TicketForm
                  onDataChange={handleDataChange}
                  initialData={ticketData}
                />
                <Divider my="md" />
                <ActionButtons
                  onGenerate={handleGenerate}
                  ticketQueue={ticketQueue}
                />
              </Card>
            </Grid.Col>

            {/* 右侧：车票预览和候补列表 */}
            <Grid.Col span={{ base: 12, lg: 7 }}>
              {/* 车票预览 */}
              <Card shadow="xs" padding="lg" radius="md" withBorder mb="lg">
                <Group mb="md" justify="space-between">
                  <Title order={4} c="dark.7">
                    车票预览
                  </Title>
                  <Badge variant="light" color={isGenerated ? "green" : "gray"}>
                    {isGenerated ? "已生成" : "未生成"}
                  </Badge>
                </Group>
                
                <div style={{ minHeight: '200px' }}>
                  {isGenerated ? (
                    <TicketPreview ticketData={ticketData} />
                  ) : (
                    <Center style={{ minHeight: '200px' }}>
                      <Stack align="center" gap="md">
                        <Paper
                          radius="md"
                          style={{
                            width: 80,
                            height: 80,
                            background: 'linear-gradient(135deg, #e9ecef 0%, #f8f9fa 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            flexShrink: 0,
                            minWidth: 80,
                            minHeight: 80,
                            maxWidth: 80,
                            maxHeight: 80,
                            boxSizing: 'border-box'
                          }}
                        >
                          <IconTicket size={32} color="#adb5bd" />
                        </Paper>
                        <Text c="dimmed" ta="center" size="lg">
                          暂无预览
                        </Text>
                        <Text c="dimmed" ta="center" size="sm">
                          请填写车票信息后查看预览效果
                        </Text>
                      </Stack>
                    </Center>
                  )}
                </div>
                
                {/* 候补列表 */}
                <Divider my="lg" />
                <Group mb="md" justify="space-between">
                  <Title order={5} c="dark.7">
                    候补列表 ({ticketQueue.length}/{MAX_QUEUE_SIZE})
                  </Title>
                  <Badge variant="light" color="orange">
                    待处理
                  </Badge>
                </Group>
                
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {ticketQueue.length === 0 ? (
                    <Center style={{ minHeight: '120px' }}>
                      <Stack align="center" gap="md">
                        <Paper
                          radius="md"
                          style={{
                            width: 64,
                            height: 64,
                            background: 'linear-gradient(135deg, #e9ecef 0%, #f8f9fa 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            flexShrink: 0,
                            minWidth: 64,
                            minHeight: 64,
                            maxWidth: 64,
                            maxHeight: 64,
                            boxSizing: 'border-box'
                          }}
                        >
                          <IconTrain size={24} color="#adb5bd" />
                        </Paper>
                        <Text c="dimmed" ta="center" size="sm">
                          暂无候补车票
                        </Text>
                      </Stack>
                    </Center>
                  ) : (
                    <Stack gap="xs">
                      {ticketQueue.map((ticket, index) => (
                        <Paper key={ticket.id} p="sm" withBorder radius="sm">
                          <Group justify="space-between">
                            <div style={{ flex: 1 }}>
                              <Text size="sm" fw={500}>
                                {ticket.departureStation} → {ticket.arrivalStation}
                              </Text>
                              <Text size="xs" c="dimmed">
                                 {ticket.trainNumber} | {ticket.date} {ticket.departureTime}
                               </Text>
                            </div>
                            <Group gap="xs">
                              <Text size="xs" c="blue" style={{ cursor: 'pointer' }} onClick={() => handlePreviewTicket(ticket)}>
                                预览
                              </Text>
                              <Text size="xs" c="red" style={{ cursor: 'pointer' }} onClick={() => handleRemoveTicket(ticket.id!)}>
                                删除
                              </Text>
                            </Group>
                          </Group>
                        </Paper>
                      ))}
                    </Stack>
                  )}
                </div>
              </Card>
            </Grid.Col>
          </Grid>

          {/* 使用说明 */}
          <Card shadow="xs" padding="lg" radius="md" withBorder>
            <Title order={4} mb="lg" c="dark.7">
              使用说明
            </Title>
            <Grid gutter="lg">
              <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
                <Stack gap="xs">
                  <Title order={5} size="h5" c="dark.7">1. 填写信息</Title>
                  <Text c="dimmed" size="sm">
                    在左侧表单中填写火车票相关信息，右侧会实时显示预览效果。
                  </Text>
                </Stack>
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
                <Stack gap="xs">
                  <Title order={5} size="h5" c="dark.7">2. 生成车票</Title>
                  <Text c="dimmed" size="sm">
                    点击"生成车票"按钮将当前信息添加到候补列表中。
                  </Text>
                </Stack>
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
                <Stack gap="xs">
                  <Title order={5} size="h5" c="dark.7">3. 批量处理</Title>
                  <Text c="dimmed" size="sm">
                    可以添加多张车票到候补列表，然后批量下载或处理。
                  </Text>
                </Stack>
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
                <Stack gap="xs">
                  <Title order={5} size="h5" c="dark.7">4. 下载保存</Title>
                  <Text c="dimmed" size="sm">
                    支持多种格式下载，包括图片、PDF等格式。
                  </Text>
                </Stack>
              </Grid.Col>
            </Grid>
          </Card>

          {/* 注意事项 */}
          <Alert
            icon={<IconAlertTriangle size={16} />}
            title="注意事项"
            color="yellow"
            variant="light"
          >
            <Text size="sm">
              本工具仅用于学习和演示目的，生成的车票仅为模拟效果，不具备任何法律效力。
              请勿用于任何非法用途。
            </Text>
          </Alert>
        </Stack>
      </Container>
    </div>
  );
}
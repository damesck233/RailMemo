'use client';

import { useState, useEffect } from 'react';
import { TextInput, Select, Paper, Title, Grid, Alert, Button, Group, Textarea, Modal, Text, Notification, Tabs, Code } from '@mantine/core';
import { IconInfoCircle, IconCopy, IconClipboard, IconFileText, IconCheck, IconX, IconEdit, IconCode } from '@tabler/icons-react';
import { TicketFormData } from '@/types/ticket';
import { generateJSONTemplate, validateTicketJSON, ticketDataToJSON } from '@/lib/templateProcessor';

interface TicketFormProps {
  onDataChange: (data: TicketFormData) => void;
  initialData: TicketFormData;
}

export default function TicketForm({ onDataChange, initialData }: TicketFormProps) {
  const [formData, setFormData] = useState<TicketFormData>(initialData);
  const [dateInputValue, setDateInputValue] = useState('');
  const [jsonModalOpened, setJsonModalOpened] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>('form');
  const [jsonEditorValue, setJsonEditorValue] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);


  // 当外部数据变化时更新表单
  useEffect(() => {
    setFormData(initialData);
    // 如果有中文日期格式，转换为HTML5 date输入格式
    if (initialData.date) {
      const match = initialData.date.match(/(\d{4})年(\d{2})月(\d{2})日/);
      if (match) {
        setDateInputValue(`${match[1]}-${match[2]}-${match[3]}`);
      }
    }
    // 更新JSON编辑器的值
    updateJsonEditor(initialData);
  }, [initialData]);

  // 更新JSON编辑器的值
  const updateJsonEditor = (data: TicketFormData) => {
    try {
      const jsonString = ticketDataToJSON(data);
      setJsonEditorValue(jsonString);
      setJsonError(null);
    } catch (error) {
      setJsonError('JSON生成失败');
    }
  };

  // 处理JSON编辑器的变化
  const handleJsonEditorChange = (value: string) => {
    setJsonEditorValue(value);

    if (!value.trim()) {
      setJsonError(null);
      return;
    }

    try {
      const result = validateTicketJSON(value);
      if (result.isValid && result.data) {
        setJsonError(null);
        const newData = { ...result.data };
        setFormData(newData);
        onDataChange(newData);

        // 更新日期输入框
        if (result.data.date) {
          const match = result.data.date.match(/(\d{4})年(\d{2})月(\d{2})日/);
          if (match) {
            setDateInputValue(`${match[1]}-${match[2]}-${match[3]}`);
          }
        }
      } else {
        setJsonError(result.error || 'JSON格式错误');
      }
    } catch (error) {
      setJsonError('JSON解析失败');
    }
  };

  const handleInputChange = (field: keyof TicketFormData, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onDataChange(newData);
    // 同步更新JSON编辑器
    updateJsonEditor(newData);
  };

  // 复制当前数据为JSON
  const handleCopyJSON = async () => {
    try {
      const jsonString = ticketDataToJSON(formData);
      await navigator.clipboard.writeText(jsonString);
      showNotification('success', 'JSON数据已复制到剪贴板');
    } catch (error) {
      showNotification('error', '复制失败，请手动复制');
    }
  };

  // 复制JSON模板
  const handleCopyTemplate = async () => {
    try {
      const template = generateJSONTemplate();
      await navigator.clipboard.writeText(template);
      showNotification('success', 'JSON模板已复制到剪贴板');
    } catch (error) {
      showNotification('error', '复制失败，请手动复制');
    }
  };

  // 粘贴并解析JSON数据
  const handlePasteJSON = () => {
    setJsonModalOpened(true);
    setJsonInput('');
  };

  // 处理JSON输入
  const handleJSONSubmit = () => {
    const result = validateTicketJSON(jsonInput);
    if (result.isValid && result.data) {
      const newData = { ...result.data };
      setFormData(newData);
      onDataChange(newData);

      // 更新日期输入框
      if (result.data.date) {
        const match = result.data.date.match(/(\d{4})年(\d{2})月(\d{2})日/);
        if (match) {
          setDateInputValue(`${match[1]}-${match[2]}-${match[3]}`);
        }
      }

      setJsonModalOpened(false);
      showNotification('success', 'JSON数据导入成功');
    } else {
      showNotification('error', result.error || '数据格式错误');
    }
  };

  // 显示通知
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // 自动粘贴剪贴板内容
  const handleAutoFillFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setJsonInput(text);
    } catch (error) {
      showNotification('error', '无法读取剪贴板内容');
    }
  };

  return (
    <div>


      <Tabs value={activeTab} onChange={setActiveTab} variant="default" radius="md">
        <Tabs.List>
          <Tabs.Tab value="form" leftSection={<IconEdit size={16} />}>
            表单填写
          </Tabs.Tab>
          <Tabs.Tab value="json" leftSection={<IconCode size={16} />}>
            JSON编辑
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="form" pt="md">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            <Grid>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="票号"
                  value={formData.ticketNumber}
                  onChange={(e) => handleInputChange('ticketNumber', e.target.value)}
                  placeholder="请输入票号"
                  radius="md"
                  size="sm"
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="车次"
                  value={formData.trainNumber}
                  onChange={(e) => handleInputChange('trainNumber', e.target.value)}
                  placeholder="如：C2135"
                  radius="md"
                  size="sm"
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="出发站"
                  value={formData.departureStation}
                  onChange={(e) => handleInputChange('departureStation', e.target.value)}
                  placeholder="如：北京南"
                  radius="md"
                  size="sm"
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="到达站"
                  value={formData.arrivalStation}
                  onChange={(e) => handleInputChange('arrivalStation', e.target.value)}
                  placeholder="如：天津西"
                  radius="md"
                  size="sm"
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="出发站英文"
                  value={formData.departureStationEn}
                  onChange={(e) => handleInputChange('departureStationEn', e.target.value)}
                  placeholder="如：Beijing South"
                  radius="md"
                  size="sm"
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="到达站英文"
                  value={formData.arrivalStationEn}
                  onChange={(e) => handleInputChange('arrivalStationEn', e.target.value)}
                  placeholder="如：Tianjin West"
                  radius="md"
                  size="sm"
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="日期"
                  type="date"
                  value={dateInputValue}
                  onChange={(e) => {
                    setDateInputValue(e.target.value);
                    // 将日期格式转换为中文格式
                    if (e.target.value) {
                      const [year, month, day] = e.target.value.split('-');
                      const formattedDate = `${year}年${month}月${day}日`;
                      handleInputChange('date', formattedDate);
                    } else {
                      handleInputChange('date', '');
                    }
                  }}
                  radius="md"
                  size="sm"
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="发车时间"
                  type="time"
                  value={formData.departureTime}
                  onChange={(e) => handleInputChange('departureTime', e.target.value)}
                  radius="md"
                  size="sm"
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={{ base: 12, sm: 4 }}>
                <TextInput
                  label="车厢号"
                  value={formData.carNumber}
                  onChange={(e) => handleInputChange('carNumber', e.target.value)}
                  placeholder="如：01"
                  radius="md"
                  size="sm"
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 4 }}>
                <TextInput
                  label="座位号"
                  value={formData.seatNumber}
                  onChange={(e) => handleInputChange('seatNumber', e.target.value)}
                  placeholder="如：01A"
                  radius="md"
                  size="sm"
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 4 }}>
                <Select
                  label="座位席别"
                  value={formData.seatType}
                  onChange={(value) => handleInputChange('seatType', value || '')}
                  data={[
                    // 高铁/动车
                    { value: '商务座', label: '商务座' },
                    { value: '特等座', label: '特等座' },
                    { value: '一等座', label: '一等座' },
                    { value: '二等座', label: '二等座' },
                    { value: '一等卧', label: '一等卧' },
                    { value: '二等卧', label: '二等卧' },
                    { value: '动卧', label: '动卧' },

                    // 普速列车
                    { value: '高级软卧', label: '高级软卧' },
                    { value: '软卧', label: '软卧' },
                    { value: '硬卧', label: '硬卧' },
                    { value: '软座', label: '软座' },
                    { value: '硬座', label: '硬座' },

                    // 其他
                    { value: '无座', label: '无座' },
                    { value: '包厢', label: '包厢' },
                    { value: '篷车', label: '篷车' },
                    { value: '其他', label: '其他' },
                  ]}
                  radius="md"
                  size="sm"
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="票价（元）"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="如：553.0"
                  radius="md"
                  size="sm"
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="乘客姓名"
                  value={formData.passengerName}
                  onChange={(e) => handleInputChange('passengerName', e.target.value)}
                  placeholder="请输入乘客姓名"
                  radius="md"
                  size="sm"
                />
              </Grid.Col>
            </Grid>

            <TextInput
              label="身份证号"
              value={formData.idNumber}
              onChange={(e) => handleInputChange('idNumber', e.target.value)}
              placeholder="请输入身份证号"
              maxLength={18}
              radius="md"
              size="sm"
            />
          </div>


        </Tabs.Panel>

        <Tabs.Panel value="json" pt="md">
          <div style={{ marginBottom: '1rem' }}>
            <Text size="sm" c="dimmed" mb="xs">
              在下方编辑JSON数据，修改会实时同步到表单：
            </Text>
            {jsonError && (
              <Alert color="red" mb="sm" variant="light">
                {jsonError}
              </Alert>
            )}
          </div>

          <Textarea
            value={jsonEditorValue}
            onChange={(e) => handleJsonEditorChange(e.target.value)}
            placeholder="JSON数据将在这里显示..."
            minRows={15}
            maxRows={25}
            autosize
            styles={{
              input: {
                fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                fontSize: '13px',
                lineHeight: '1.4'
              }
            }}
          />

          <Group mt="md" gap="sm" justify="center">
            <Button
              leftSection={<IconCopy size={16} />}
              variant="light"
              color="blue"
              size="sm"
              onClick={handleCopyJSON}
            >
              复制JSON
            </Button>
            <Button
              leftSection={<IconFileText size={16} />}
              variant="light"
              color="orange"
              size="sm"
              onClick={handleCopyTemplate}
            >
              复制模板
            </Button>
          </Group>
        </Tabs.Panel>
      </Tabs>

      <Alert
        icon={<IconInfoCircle size={16} />}
        title="提示"
        color="yellow"
        mt="xl"
        radius="md"
        variant="light"
      >
        此工具仅用于生成纪念性火车票，不可用于实际乘车或报销。
      </Alert>

      {/* JSON输入模态框 */}
      <Modal
        opened={jsonModalOpened}
        onClose={() => setJsonModalOpened(false)}
        title="导入JSON数据"
        size="lg"
      >
        <div style={{ marginBottom: '1rem' }}>
          <Text size="sm" c="dimmed" mb="xs">
            请粘贴JSON格式的车票数据：
          </Text>
          <Group gap="xs" mb="sm">
            <Button
              size="xs"
              variant="light"
              onClick={handleAutoFillFromClipboard}
            >
              从剪贴板粘贴
            </Button>
            <Button
              size="xs"
              variant="light"
              color="orange"
              onClick={handleCopyTemplate}
            >
              获取模板
            </Button>
          </Group>
        </div>
        <Textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder='{
  "ticketNumber": "D010570",
  "departureStation": "北京南",
  "arrivalStation": "天津",
  ...
}'
          minRows={10}
          maxRows={15}
          autosize
        />
        <Group justify="flex-end" mt="md">
          <Button
            variant="light"
            onClick={() => setJsonModalOpened(false)}
          >
            取消
          </Button>
          <Button
            onClick={handleJSONSubmit}
            disabled={!jsonInput.trim()}
          >
            导入数据
          </Button>
        </Group>
      </Modal>

      {/* 通知组件 */}
      {notification && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 1000,
            backgroundColor: notification.type === 'success' ? '#51cf66' : '#ff6b6b',
            color: 'white',
            padding: '12px 16px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}
        >
          {notification.type === 'success' ? <IconCheck size={16} /> : <IconX size={16} />}
          <Text size="sm" fw={500}>{notification.message}</Text>
        </div>
      )}
    </div>
  );
}
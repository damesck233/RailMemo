'use client';

import { useState, useEffect } from 'react';
import { TextInput, Select, Paper, Title, Grid, Alert } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { TicketFormData } from '@/types/ticket';

interface TicketFormProps {
  onDataChange: (data: TicketFormData) => void;
  initialData: TicketFormData;
}

export default function TicketForm({ onDataChange, initialData }: TicketFormProps) {
  const [formData, setFormData] = useState<TicketFormData>(initialData);
  const [dateInputValue, setDateInputValue] = useState('');
  
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
  }, [initialData]);

  const handleInputChange = (field: keyof TicketFormData, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onDataChange(newData);
  };

  return (
    <Paper shadow="md" p="xl" radius="md" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #e9ecef' }}>
      <Title order={2} mb="xl" c="dark.8">火车票信息填写</Title>
      
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
              placeholder="如：G1"
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
              placeholder="如：上海虹桥"
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
                { value: '二等座', label: '二等座' },
                { value: '一等座', label: '一等座' },
                { value: '商务座', label: '商务座' },
                { value: '硬座', label: '硬座' },
                { value: '硬卧', label: '硬卧' },
                { value: '软卧', label: '软卧' }
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

      <Alert
        icon={<IconInfoCircle size={16} />}
        title="提示"
        color="yellow"
        mt="xl"
        radius="md"
      >
        此工具仅用于生成纪念性火车票，不可用于实际乘车或报销。
      </Alert>
    </Paper>
  );
}
import { useState } from 'react'
import { 
  Card,           
  Typography,
  Space,
  Tag,
  Checkbox,
  Button
} from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'  // 图标组件
import type { CheckboxProps } from 'antd';
import './TransferPage.css'

// 定义数据项的类型接口
interface TransferItem {
  id: number
  value: string
  label: string
}
const CheckboxGroup = Checkbox.Group;
/**
 * TransferPage 穿梭框页面
 */
function TransferPage() {
  // 模拟数据源 - 左侧列表的初始数据
  const mockData: TransferItem[] = Array.from({ length: 20 }).map((_, i) => ({
    id:i+1,
    value: `${i + 1}`,
    label: `选项 ${i + 1}`,
  }))

  const [leftSelectArr, setLeftSelectArr] = useState<TransferItem[]>([...mockData])
  const [rightSelectArr, setRightSelectArr] = useState<TransferItem[]>([])
  const [leftCheckedValues, setLeftCheckedValues] = useState<string[]>([])
  const [rightCheckedValues, setRightCheckedValues] = useState<string[]>([])

  // 计算统计信息
  const totalItems = mockData.length
  // 已选择到右侧的数量
  const selectedItems = rightSelectArr.length
  // 左侧剩余数量
  const remainingItems = leftSelectArr.length

  // 左侧全选状态
  const leftCheckAll = leftSelectArr.length > 0 && leftCheckedValues.length === leftSelectArr.length;
  const leftIndeterminate = leftCheckedValues.length > 0 && leftCheckedValues.length < leftSelectArr.length;

  // 右侧全选状态
  const rightCheckAll = rightSelectArr.length > 0 && rightCheckedValues.length === rightSelectArr.length;
  const rightIndeterminate = rightCheckedValues.length > 0 && rightCheckedValues.length < rightSelectArr.length;

  // 左侧复选框变化
  const onLeftChange = (checkedValues: string[]) => {
    setLeftCheckedValues(checkedValues);
  };

  // 右侧复选框变化
  const onRightChange = (checkedValues: string[]) => {
    setRightCheckedValues(checkedValues);
  };

  // 左侧全选
  const onLeftCheckAllChange: CheckboxProps['onChange'] = (e) => {
    setLeftCheckedValues(e.target.checked ? leftSelectArr.map(item => item.value) : []);
  };

  // 右侧全选
  const onRightCheckAllChange: CheckboxProps['onChange'] = (e) => {
    setRightCheckedValues(e.target.checked ? rightSelectArr.map(item => item.value) : []);
  };

  // 向右移动：将左侧选中的项移到右侧
  const handleMoveToRight = () => {
    if (leftCheckedValues.length === 0) {
      return;
    }
    
    // 从左侧移除选中的项
    const itemsToMove = leftSelectArr.filter(item => leftCheckedValues.includes(item.value));
    setLeftSelectArr(leftSelectArr.filter(item => !leftCheckedValues.includes(item.value)));

    const sortRrightArr = [...rightSelectArr, ...itemsToMove].sort((a, b) => a.id - b.id);
    
    // 添加到右侧
    setRightSelectArr(sortRrightArr);
    
    // 清空左侧选中状态
    setLeftCheckedValues([]);
  };

  // 向左移动：将右侧选中的项移回左侧
  const handleMoveToLeft = () => {
    if (rightCheckedValues.length === 0) {
      return;
    }
    
    // 从右侧移除选中的项
    const itemsToMove = rightSelectArr.filter(item => rightCheckedValues.includes(item.value));
    setRightSelectArr(rightSelectArr.filter(item => !rightCheckedValues.includes(item.value)));
    
    const sortLeftArr = [...leftSelectArr, ...itemsToMove].sort((a, b) => a.id - b.id);

    // 添加到左侧
    setLeftSelectArr(sortLeftArr);
    
    // 清空右侧选中状态
    setRightCheckedValues([]);
  };

  return (
    <div className="transfer-page-container">
      {/* 使用 Card 组件包装整个内容区域 */}
      <Card 
        title={
          <Typography.Title level={2} style={{ margin: 0, textAlign: 'center' }}>
            穿梭框
          </Typography.Title>
        }
        style={{ maxWidth: 900, margin: '0 auto' }}
      >
        {/* 统计信息区域 - 使用 Tag 组件显示统计 */}
        <Space size="middle" style={{ marginBottom: 16, justifyContent: 'center', width: '100%' }}>
          <Tag color="blue">总数据项: {totalItems}</Tag>
          <Tag color="green">已选择: {selectedItems}</Tag>
          <Tag color="orange">剩余: {remainingItems}</Tag>
        </Space>

        <div className="w-full h-[400px] flex justify-center flex-row gap-1 mb-2! relative">
          {/* 左侧列表 */}
          <div className="left flex-1 border border-gray-200 rounded-md flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-2.5! sticky top-0 bg-white z-10 border-b border-gray-200">
              <Checkbox 
                indeterminate={leftIndeterminate} 
                onChange={onLeftCheckAllChange} 
                checked={leftCheckAll}
              >
                左侧列表 ({leftSelectArr.length})
              </Checkbox>
            </div>
            <CheckboxGroup 
              className='overflow-y-auto' 
              value={leftCheckedValues} 
              onChange={onLeftChange}
            >
              {leftSelectArr.map((item) => (
                <div key={item.value} className="px-2.5! py-1! w-full">
                  <Checkbox value={item.value}>{item.label}</Checkbox>
                </div>
              ))}
            </CheckboxGroup>
          </div>

          {/* 中间操作按钮 */}
          <div className='center w-[30px] flex flex-col gap-1 justify-center'>
            <Button 
              type="primary" 
              icon={<RightOutlined />} 
              onClick={handleMoveToRight}
              disabled={leftCheckedValues.length === 0}
            />
            <Button 
              type="primary" 
              icon={<LeftOutlined />} 
              onClick={handleMoveToLeft}
              disabled={rightCheckedValues.length === 0}
            />
          </div>

          {/* 右侧列表 */}
          <div className="right flex-1 border border-gray-200 rounded-md flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-2.5! sticky top-0 bg-white z-10 border-b border-gray-200">
              <Checkbox 
                indeterminate={rightIndeterminate} 
                onChange={onRightCheckAllChange} 
                checked={rightCheckAll}
              >
                右侧({rightSelectArr.length})
              </Checkbox>
            </div>
            <CheckboxGroup 
              className='overflow-y-auto' 
              value={rightCheckedValues} 
              onChange={onRightChange}
            >
              {rightSelectArr.map((item) => (
                <div key={item.value} className="px-2.5! py-1! w-full">
                  <Checkbox value={item.value}>{item.label}</Checkbox>
                </div>
              ))}
            </CheckboxGroup>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default TransferPage


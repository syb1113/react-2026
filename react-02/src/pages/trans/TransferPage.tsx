import { useState } from "react";
import {
  Card,
  Typography,
  Space,
  Tag,
  Button,
  Input,
  message,
} from "antd";
import { LeftOutlined, RightOutlined, PlusOutlined } from "@ant-design/icons"; // 图标组件
import type { CheckboxProps } from "antd";
import "./TransferPage.css";
import dayjs from "dayjs";
import TransferListPanel, { type TransferItem } from "./components/TransferListPanel";

/**
 * TransferPage 穿梭框页面
 */
function TransferPage() {
  // 模拟数据源 - 左侧列表的初始数据
  const mockData: TransferItem[] = Array.from({ length: 20 }).map((_, i) => ({
    id: i + 1,
    value: `${i + 1}`,
    label: `选项 ${i + 1}`,
    time: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
  }));

  const [leftSelectArr, setLeftSelectArr] = useState<TransferItem[]>([
    ...mockData,
  ]);
  const [rightSelectArr, setRightSelectArr] = useState<TransferItem[]>([]);
  const [leftCheckedValues, setLeftCheckedValues] = useState<string[]>([]);
  const [rightCheckedValues, setRightCheckedValues] = useState<string[]>([]);

  // 输入框的值
  const [inputValue, setInputValue] = useState<string>("");

  // 计算统计信息
  const totalItems = leftSelectArr.length;
  // 已选择到右侧的数量
  const selectedItems = rightSelectArr.length;
  // 左侧剩余数量
  const remainingItems = leftSelectArr.length;

  // 左侧全选状态
  const leftCheckAll =
    leftSelectArr.length > 0 &&
    leftCheckedValues.length === leftSelectArr.length;
  const leftIndeterminate =
    leftCheckedValues.length > 0 &&
    leftCheckedValues.length < leftSelectArr.length;

  // 右侧全选状态
  const rightCheckAll =
    rightSelectArr.length > 0 &&
    rightCheckedValues.length === rightSelectArr.length;
  const rightIndeterminate =
    rightCheckedValues.length > 0 &&
    rightCheckedValues.length < rightSelectArr.length;

  // 左侧复选框变化
  const onLeftChange = (checkedValues: string[]) => {
    setLeftCheckedValues(checkedValues);
  };

  // 右侧复选框变化
  const onRightChange = (checkedValues: string[]) => {
    setRightCheckedValues(checkedValues);
  };

  // 左侧全选
  const onLeftCheckAllChange: CheckboxProps["onChange"] = (e) => {
    setLeftCheckedValues(
      e.target.checked ? leftSelectArr.map((item) => item.value) : []
    );
  };

  // 右侧全选
  const onRightCheckAllChange: CheckboxProps["onChange"] = (e) => {
    setRightCheckedValues(
      e.target.checked ? rightSelectArr.map((item) => item.value) : []
    );
  };

  // 向右移动：将左侧选中的项移到右侧
  const handleMoveToRight = () => {
    if (leftCheckedValues.length === 0) {
      return;
    }

    const newDate = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");

    // 从左侧移除选中的项
    const itemsToMove = leftSelectArr.filter((item) =>
      leftCheckedValues.includes(item.value)
    ).map((item) => ({
      ...item,
      time: newDate,
    }));

    setLeftSelectArr(
      leftSelectArr.filter((item) => !leftCheckedValues.includes(item.value))
    );

    const sortRrightArr = [...rightSelectArr, ...itemsToMove]

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
    const itemsToMove = rightSelectArr.filter((item) =>
      rightCheckedValues.includes(item.value)
    );
    setRightSelectArr(
      rightSelectArr.filter((item) => !rightCheckedValues.includes(item.value))
    );

    const sortLeftArr = [...leftSelectArr, ...itemsToMove].sort(
      (a, b) => a.id - b.id
    );

    // 添加到左侧
    setLeftSelectArr(sortLeftArr);

    // 清空右侧选中状态
    setRightCheckedValues([]);
  };

  const handleAddTodo = () => {
    if (inputValue.trim() === "") {
      message.warning("请输入待办事项内容");
      return; // 如果为空，直接返回，不添加
    }

    // 创建新的待办事项对象
    const newTodo: TransferItem = {
      id: Date.now(),
      label: inputValue.trim(),
      value: Date.now().toString(),
      time: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
    };

    setLeftSelectArr([newTodo, ...leftSelectArr]);

    setInputValue("");
  };

  return (
    <div className="transfer-page-container">
      <Card
        title={
          <Typography.Title
            level={2}
            style={{ margin: 0, textAlign: "center" }}
          >
            穿梭框 && TodoList
          </Typography.Title>
        }
        style={{ maxWidth: 1200, margin: "0 auto" }}
      >
        {/* 统计信息区域 */}
        <Space
          size="middle"
          style={{ marginBottom: 16, justifyContent: "center", width: "100%" }}
        >
          <Tag color="blue">总数据项: {totalItems}</Tag>
          <Tag color="green">已选择: {selectedItems}</Tag>
          <Tag color="orange">剩余: {remainingItems}</Tag>
        </Space>
        {/* 输入区域 - 使用 Space 组件设置间距 */}
        <Space.Compact style={{ width: "100%", marginBottom: 16 }}>
          <Input
            size="large"
            placeholder="输入待办事项..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onPressEnter={handleAddTodo}
            allowClear
          />
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={handleAddTodo}
          >
            添加
          </Button>
        </Space.Compact>

        <div className="w-full h-[800px] flex justify-center flex-row gap-1 mb-2! relative">
          {/* 左侧列表 */}
          <TransferListPanel
            className="left"
            title="Todo"
            items={leftSelectArr}
            checkedValues={leftCheckedValues}
            onChange={onLeftChange}
            checkAll={leftCheckAll}
            indeterminate={leftIndeterminate}
            onCheckAllChange={onLeftCheckAllChange}
          />

          {/* 中间操作按钮 */}
          <div className="center w-[80px] flex flex-col gap-1 justify-center">
            <Button
              type="primary"
              icon={<RightOutlined />}
              onClick={handleMoveToRight}
              disabled={leftCheckedValues.length === 0}
              iconPlacement="end"
            >
              已做
            </Button>
            <Button
              type="primary"
              icon={<LeftOutlined />}
              onClick={handleMoveToLeft}
              disabled={rightCheckedValues.length === 0}
            >
              重做
            </Button>
          </div>

          {/* 右侧列表 */}
          <TransferListPanel
            className="right"
            title="历史Todo"
            items={rightSelectArr}
            checkedValues={rightCheckedValues}
            onChange={onRightChange}
            checkAll={rightCheckAll}
            indeterminate={rightIndeterminate}
            onCheckAllChange={onRightCheckAllChange}
            itemLabelClassName="line-through text-gray-400"
          />
        </div>
      </Card>
    </div>
  );
}

export default TransferPage;
